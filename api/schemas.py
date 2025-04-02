from pydantic import BaseModel

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    firstname: str
    lastname: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    firstname: str
    lastname: str
    
    class Config:
        orm_mode = True