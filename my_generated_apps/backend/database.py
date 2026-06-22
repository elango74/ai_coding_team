from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str

class Database:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.engine = create_engine(self.database_url)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.Base = declarative_base()
        self.SessionLocal = SessionLocal

    def get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

settings = Settings()
engine = Database(settings.DATABASE_URL).engine
Base = Database(settings.DATABASE_URL).Base

def get_db):
    return Database(settings.DATABASE_URL).get_db()
