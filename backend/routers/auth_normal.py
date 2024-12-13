from fastapi import APIRouter, HTTPException, status
from config.database import db
from models.user import token_helper
from schema.user_schema import UserCreate, LoginRequest, Token
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt
from datetime import timedelta, datetime
from dotenv import load_dotenv
from config.settings import settings
from bson import ObjectId

load_dotenv()

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

routers = APIRouter()

@routers.post("/signup", response_model=Token)
async def create_user(user: UserCreate):
    # Check if user already exists with the provided email
    existing_user = await db.find_one({"$or": [{"email": user.email}, {"username": user.username}]})
    if existing_user:
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        if existing_user["username"] == user.username:
            raise HTTPException(status_code=400, detail="Username already registered")

    
    # Check if username already exists
    existing_user = await db.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash the password
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": bcrypt_context.hash(user.password),
    }

    # Insert into database
    new_user = await db.insert_one(user_data)
    
    # Fetch the created user from the database
    created_user = await db.find_one({"_id": new_user.inserted_id})

    if created_user is None:
        raise HTTPException(status_code=500, detail="User creation failed")
    
    # After creating the user, generate and return the access token
    token = await login_for_access_token(OAuth2PasswordRequestForm(username=user.username, password=user.password))
    
    # Debug: Print the token_helper response
    response = token_helper({
        "access_token": str(token),
        "token_type": "bearer",
        "userid": str(created_user["_id"]),  # Ensure `_id` is converted to a string
    })
    print("Generated Token Helper Response:", response)  # Debugging
    return response

    
async def login_for_access_token(form_data: OAuth2PasswordRequestForm):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    EXPIRES_IN_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    token = create_access_token(user["username"], user["_id"], timedelta(minutes=EXPIRES_IN_MINUTES))    
    return token


async def authenticate_user(username: str, password: str):
    user = await db.find_one({"username": username})
    if not user:
        return False
    if not bcrypt_context.verify(password, user["password"]):
        return False
    return user

def create_access_token(username: str, user_id: ObjectId, expires_delta: timedelta):
    to_encode = {"sub": username, "user_id": str(user_id), "exp": datetime.utcnow() + expires_delta}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@routers.get("/")
async def root():
    return {"message": "Hello World"}

@routers.post("/login")
async def login_for_access_token(request: LoginRequest):
    # Assuming you have a function to authenticate user
    user = await authenticate_user(request.username, request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Generate token logic
    EXPIRES_IN_MINUTES = 60
    token = create_access_token(user["username"], user["_id"], timedelta(minutes=EXPIRES_IN_MINUTES))

    response = {
        "access_token": str(token),
        "token_type": "bearer",
        "userid": str(user["_id"]),
    }
    return response