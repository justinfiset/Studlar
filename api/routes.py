from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.password import hash_password, verify_password

from models import User
from schemas import UserCreate, UserResponse, UserLogin
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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