from pydantic import BaseModel

class User(BaseModel):
    id: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str