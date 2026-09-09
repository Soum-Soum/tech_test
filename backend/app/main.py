import asyncio
import random
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud
from .database import Base, SessionLocal, engine, get_db
from .models import Situation
from .schemas import (
    FavoriteUpdate,
    SituationCategory,
    SituationCreate,
    SituationListResponse,
    SituationRead,
    SituationStatus,
    SituationUpdate,
)
from .seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Situations API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/situations", response_model=SituationListResponse)
async def list_situations(
    search: str | None = None,
    category: SituationCategory | None = None,
    status_filter: SituationStatus | None = Query(default=None, alias="status"),
    favorite: bool | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=5000),
    db: Session = Depends(get_db),
) -> SituationListResponse:
    if search:
        await asyncio.sleep(random.uniform(0.1, 0.7))

    items, total = crud.list_situations(
        db,
        search=search,
        category=category.value if category else None,
        status=status_filter.value if status_filter else None,
        favorite=favorite,
        skip=(page - 1) * page_size,
        limit=page_size,
    )
    return SituationListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )


@app.get("/situations/{situation_id}", response_model=SituationRead)
async def get_situation(situation_id: int, db: Session = Depends(get_db)) -> Situation:
    situation = crud.get_situation(db, situation_id)
    if situation is None:
        raise HTTPException(status_code=404, detail="Situation not found")
    return situation


@app.post(
    "/situations",
    response_model=SituationRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_situation(
    payload: SituationCreate,
    db: Session = Depends(get_db),
) -> Situation:
    return crud.create_situation(db, payload)


@app.patch("/situations/{situation_id}", response_model=SituationRead)
async def update_situation(
    situation_id: int,
    payload: SituationUpdate,
    db: Session = Depends(get_db),
) -> Situation:
    situation = crud.get_situation(db, situation_id)
    if situation is None:
        raise HTTPException(status_code=404, detail="Situation not found")

    values = payload.model_dump(exclude_unset=True)
    if "category" in values:
        values["category"] = values["category"].value
    if "status" in values:
        values["status"] = values["status"].value

    crud.touch(situation)
    return crud.update_situation(db, situation, values)


@app.patch("/situations/{situation_id}/favorite", response_model=SituationRead)
async def update_favorite(
    situation_id: int,
    payload: FavoriteUpdate,
    db: Session = Depends(get_db),
) -> Situation:
    situation = crud.get_situation(db, situation_id)
    if situation is None:
        raise HTTPException(status_code=404, detail="Situation not found")

    situation.is_favorite = payload.is_favorite
    crud.touch(situation)
    db.commit()
    db.refresh(situation)
    return situation


@app.delete("/situations/{situation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_situation(situation_id: int, db: Session = Depends(get_db)) -> Response:
    situation = crud.get_situation(db, situation_id)
    if situation is None:
        raise HTTPException(status_code=404, detail="Situation not found")
    crud.delete_situation(db, situation)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
