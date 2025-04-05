from pydantic import BaseModel

class TaskGet(BaseModel):
    list_id: int

class TaskCreate(BaseModel):
    title: str
    description: str
    status: str
    list_id: int

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    list_id: int

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