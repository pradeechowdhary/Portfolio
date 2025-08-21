import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://pponnam_user:4qL8N8KfV5FFCY8xkrzA0vqVwI83PsAp@dpg-d2jotmf5r7bs73e0fhrg-a/pponnam")

# For SQLite in containers, disable same-thread check
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)

def init_db():
    # Import models before create_all
    from .models import Message  # noqa: F401
    SQLModel.metadata.create_all(engine)

def get_session() -> Session:
    return Session(engine)
