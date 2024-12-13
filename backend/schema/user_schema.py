from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username : str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    userid: str
    
class Config:
        orm_mode = True
        
class LoginRequest(BaseModel):
    username: str
    email: str
    password: str
    