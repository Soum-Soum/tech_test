from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class SituationCategory(str, Enum):
    conflict = "conflict"
    assertiveness = "assertiveness"
    relationship = "relationship"
    work = "work"
    other = "other"


class SituationStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    archived = "archived"


class SituationCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default="", max_length=10_000)
    category: SituationCategory = SituationCategory.other
    status: SituationStatus = SituationStatus.draft


class SituationUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=10_000)
    category: SituationCategory | None = None
    status: SituationStatus | None = None


class FavoriteUpdate(BaseModel):
    is_favorite: bool


class SituationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    category: SituationCategory
    status: SituationStatus
    is_favorite: bool
    created_at: datetime
    updated_at: datetime


class SituationListResponse(BaseModel):
    items: list[SituationRead]
    page: int
    page_size: int
    total: int
