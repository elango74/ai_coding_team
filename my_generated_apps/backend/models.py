from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    habit_completions = relationship("HabitCompletion", back_populates="habit")

class HabitCompletion(Base):
    __tablename__ = "habit_completions"
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))
    date = Column(Date)
    habit = relationship("Habit", back_populates="habit_completions")
