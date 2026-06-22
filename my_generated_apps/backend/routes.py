from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import Habit, HabitCompletion, HabitCompletionResponse
from models import Habit as HabitModel, HabitCompletion as HabitCompletionModel

habits_router = APIRouter(
    prefix="/habits",
    tags=["habits"],
)

@habits_router.post("/")
async def create_habit(habit: Habit, db: Session = Depends(get_db)):
    db_habit = HabitModel(name=habit.name, description=habit.description)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@habits_router.patch("/{habit_id}/complete")
async def complete_habit(habit_id: int, completion: HabitCompletion, db: Session = Depends(get_db)):
    db_habit = db.query(HabitModel).filter(HabitModel.id == habit_id).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="Habit not found")
    db_completion = db.query(HabitCompletionModel).filter(HabitCompletionModel.habit_id == habit_id, HabitCompletionModel.date == completion.date).first()
    if db_completion is None:
        db_completion = HabitCompletionModel(habit_id=habit_id, date=completion.date)
        db.add(db_completion)
        db.commit()
        db.refresh(db_completion)
    return {"id": db_habit.id, "name": db_habit.name, "description": db_habit.description, "completed": True}

@habits_router.get("/")
async def read_habits(db: Session = Depends(get_db)):
    return db.query(HabitModel).all()
