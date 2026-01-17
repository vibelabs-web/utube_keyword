"""
API v1 router.
"""
from fastapi import APIRouter
from app.api.v1 import endpoints, keywords


api_router = APIRouter()
api_router.include_router(keywords.router, prefix="/api/v1")
api_router.include_router(endpoints.router, prefix="/api/v1")
