from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from models import User
from database import get_collection

router = APIRouter(prefix="/users", tags=["users"])

def get_users_collection():
    return get_collection('users')

@router.post("/", response_model=User)
async def create_user(user: User, collection=Depends(get_users_collection)):
    print("Posting")
    user_dict = user.dict(by_alias=True)
    result = await collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return user_dict

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: str, collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    user = await collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
