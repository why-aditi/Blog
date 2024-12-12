from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from config.database import db
from config.settings import Settings
from models.user import User, Token

# App initialization
app = FastAPI()

token_secret = Settings.JWT_SECRET
algorithm = Settings.JWT_ALGORITHM
access_token_expire_minutes = Settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def authenticate_user(email: str, password: str):
    user = db.find_one({"email": email})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, token_secret, algorithm=algorithm)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, token_secret, algorithms=[algorithm])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid user")
        return User(id=str(user["_id"]), email=email)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=access_token_expire_minutes)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
def register(email: str, password: str):
    if db.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(password)
    user = {"email": email, "password": hashed_password}
    result = db.insert_one(user)
    return {"id": str(result.inserted_id), "email": email}

@app.get("/dashboard/{user_id}")
def dashboard(user_id: str, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    return {"message": f"Welcome to the dashboard, user {current_user.email}!"}

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI JWT Auth Service"}

@app.post("/verify")
def verify(request: Request, token: str):
    try:
        payload = jwt.decode(token, token_secret, algorithms=[algorithm])
        user_email = payload.get("sub")
        user = db.find_one({"email": user_email})
        if user:
            user_id = str(user["_id"])
            return RedirectResponse(url=f"/dashboard/{user_id}")
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
