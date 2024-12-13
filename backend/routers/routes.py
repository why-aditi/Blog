from fastapi import APIRouter
from routers.auth_normal import routers as auth_normal_router  


api_routers = APIRouter()

api_routers.include_router(auth_normal_router, prefix="/auth", tags=["Auth"])

