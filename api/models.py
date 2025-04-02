from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    password = Column(String)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    boards = relationship("Board", back_populates="owner")

class Board(Base):
    __tablename__ = "Board"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    positionX = Column(Integer)
    positionY = Column(Integer)
    sizeX = Column(Integer)
    sizeY = Column(Integer)
    owner_id = Column(Integer, ForeignKey("User.id"), index=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    owner = relationship("User", back_populates="boards")
    task_lists = relationship("TaskList", back_populates="board")

class TaskList(Base):
    __tablename__ = "TaskList"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    board_id = Column(Integer, ForeignKey("Board.id"), index=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    board = relationship("Board", back_populates="task_lists")
    tasks = relationship("Task", back_populates="task_list")

class Task(Base):
    __tablename__ = "Task"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    status = Column(String)
    list_id = Column(Integer, ForeignKey("TaskList.id"), index=True)

    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    task_list = relationship("TaskList", back_populates="tasks")