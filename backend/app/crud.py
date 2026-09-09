from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from .models import Situation
from .schemas import SituationCreate


def list_situations(
    db: Session,
    search: str | None = None,
    category: str | None = None,
    status: str | None = None,
    favorite: bool | None = None,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Situation], int]:
    query = db.query(Situation)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Situation.title.ilike(search_term),
                Situation.description.ilike(search_term),
            )
        )
    if category:
        query = query.filter(Situation.category == category)
    if status:
        query = query.filter(Situation.status == status)
    if favorite is not None:
        query = query.filter(Situation.is_favorite == favorite)

    total = query.count()
    items = (
        query.order_by(Situation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def get_situation(db: Session, situation_id: int) -> Situation | None:
    return db.get(Situation, situation_id)


def create_situation(db: Session, payload: SituationCreate) -> Situation:
    situation = Situation(
        title=payload.title,
        description=payload.description,
        category=payload.category.value,
        status=payload.status.value,
    )
    db.add(situation)
    db.commit()
    db.refresh(situation)
    return situation


def update_situation(
    db: Session,
    situation: Situation,
    values: dict[str, object],
) -> Situation:
    for key, value in values.items():
        setattr(situation, key, value)
    db.commit()
    db.refresh(situation)
    return situation


def delete_situation(db: Session, situation: Situation) -> None:
    db.delete(situation)
    db.commit()


def touch(situation: Situation) -> None:
    situation.updated_at = datetime.utcnow()
