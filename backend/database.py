import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite:///./prelegal.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Reset DB on every startup (ephemeral per spec)
    if os.path.exists("./prelegal.db"):
        os.remove("./prelegal.db")
    from models import User, Document  # noqa: F401 — registers tables
    Base.metadata.create_all(bind=engine)
