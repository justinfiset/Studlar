from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Password hashing and verification functions
from api.password import hash_password, verify_password

from models import User, Board, TaskList, Task
from schemas import *
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# TASKS ROUTES
@router.get("/api/tasks/", response_model=list[TaskResponse])
def get_tasks(task: TaskGet = Depends(), db : Session = Depends(get_db)):
    db_tasks = db.query(TaskList).filter(task.list_id == Task.list_id).all()
    if(not db_tasks):
        raise HTTPException(status_code=404, detail="No task found")
    
    return db_tasks

@router.post("/api/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_tasklist = db.query(TaskList).filter(TaskList.id == task.list_id).first()
    if not db_tasklist:
        raise HTTPException(status_code=404, detail="Task list does not exist")
    
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# TASKLIKST ROUTES
@router.get("/api/tasklists/", response_model=list[TaskListResponse])
def get_tasklists(tasklist: TaskListGet = Depends(), db : Session = Depends(get_db)):
    db_tasklists = db.query(TaskList).filter(tasklist.board_id == TaskList.board_id).all()
    if(not db_tasklists):
        raise HTTPException(status_code=404, detail="No tasklist found")
    
    return db_tasklists

@router.post("/api/tasklists/", response_model=TaskListResponse)
def create_tasklist(tasklist: TaskListCreate, db: Session = Depends(get_db)):
    db_board = db.query(Board).filter(Board.id == tasklist.board_id).first()
    if not db_board:
        raise HTTPException(status_code=404, detail="Board does not exist")
    
    db_tasklist = TaskList(**tasklist.dict())
    db.add(db_tasklist)
    db.commit()
    db.refresh(db_tasklist)
    return db_tasklist


# BOARDS ROUTES
@router.get("/api/boards/", response_model=list[BoardResponse])
def get_boards(board: BoardGet = Depends(), db: Session = Depends(get_db)):
    db_boards = db.query(Board).filter(board.owner_id == Board.owner_id).all()
    if(not db_boards):
        raise HTTPException(status_code=404, detail="No board found")
    
    return db_boards

@router.post("/api/boards/", response_model=BoardResponse)
def create_board(board: BoardCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == board.owner_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Owner does not exist")
    
    db_board = Board(**board.dict())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

# USERS ROUTES
@router.post("/api/login/", response_model=UserResponse)
def get_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email and verify_password(user.password, User.password)).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="Username or password is incorrect")
    return db_user

@router.post("/api/signup/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="This email is already userd by another user")

    user_data = user.dict(exclude={'password'})
    db_user = User(**   user_data, password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user