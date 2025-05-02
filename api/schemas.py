from pydantic import BaseModel
from typing import Optional

class TaskGet(BaseModel):
    list_id: int

class TaskDelete(BaseModel):
    id: int
    list_id: int

class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    list_id: int

class TaskUpdate(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    list_id: Optional[int] = None

    class Config:
        orm_mode = True


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    list_id: int
    created_at: str
    updated_at: str

# Tasklist
class TaskListGet(BaseModel):
    board_id: int

class TaskListCreate(BaseModel):
    name: str
    description: str
    board_id: int

class TaskListResponse(BaseModel):
    id: int
    name: str
    description: str
    board_id: int

    class Config:
        orm_mode = True

# Boards
class BoardDelete(BaseModel):
    id: int
    owner_id: int

class BoardGet(BaseModel):
    owner_id: int

class BoardCreate(BaseModel):
    name: str
    description: str
    owner_id: int
    positionX: int = 0
    positionY: int = 0
    sizeX: int = 1
    sizeY: int = 1

class BoardUpdate(BaseModel):
    id: int
    owner_id: int
    name: Optional[str] = None
    description: Optional[str] = None
    positionX: Optional[int] = None
    positionY: Optional[int] = None
    sizeX: Optional[int] = None
    sizeY: Optional[int] = None

    class Config:
            orm_mode = True
            
class BoardResponse(BaseModel):
    id: int
    name: str
    description: str
    positionX: int
    positionY: int
    sizeX: int
    sizeY: int
    owner_id: int

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    id: int
    email: Optional[str] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    password: Optional[str] = None

    class Config:
        orm_mode = True

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