from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskCreate(BaseModel):
    description: str
    status: str = "todo"

class TaskUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    description: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}