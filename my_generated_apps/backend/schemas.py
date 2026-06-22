from pydantic import BaseModel
from datetime import date
from typing import Optional

class HabitBase(BaseModel):
    name: str
    description: str

class Habit(HabitBase):
    id: int
    class Config:
        orm_mode = True

class HabitCompletion(BaseModel):
    habit_id: int
    date: date

class HabitCompletionResponse(HabitCompletion):
    id: int
    name: str
    description: str
    completed: bool
    class Config:
        orm_mode = True
