from fastapi import APIRouter, HTTPException, Depends, Path, Query
from typing import List
from bson import ObjectId
from models import User
from database import get_collection
from pymongo.collection import Collection
import logging

router = APIRouter(prefix="/users", tags=["users"])

def get_users_collection() -> Collection:
    return get_collection('users')

@router.post("/", response_model=User)
async def create_user(user: User, collection=Depends(get_users_collection)):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict(by_alias=True)
    result = await collection.insert_one(user_dict)
    created_user = await collection.find_one({"_id": result.inserted_id})
    return User(**created_user)

@router.get("/{uid}", response_model=User)
async def get_user_by_id(uid: str = Path(..., title="User ID"), collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise HTTPException(status_code=400, detail="Invalid User ID")
    
    user = await collection.find_one({"_id": uid})
    if user:
        return User(**user)
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.put("/{uid}", response_model=User)
async def update_user(uid: str, user_data: User, collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise HTTPException(status_code=400, detail="Invalid User ID")

    existing_user = await collection.find_one({"_id": uid})
    if existing_user:
        await collection.update_one({"_id": uid}, {"$set": user_data.dict(by_alias=True)})
        updated_user = await collection.find_one({"_id": uid})
        return User(**updated_user)
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.delete("/{uid}", response_model=dict)
async def delete_user(uid: str, collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise HTTPException(status_code=400, detail="Invalid User ID")

    delete_result = await collection.delete_one({"_id": uid})
    if delete_result.deleted_count == 1:
        return {"status": "success", "message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

@router.get("/", response_model=List[User])
async def list_users(collection=Depends(get_users_collection)):
    cursor = collection.find({})
    users = await cursor.to_list(length=1000)  
    return [User(**user) for user in users]

@router.get("/search", response_model=List[User])
async def search_users(query: str = Query(..., title="Search Query"), collection: Collection = Depends(get_users_collection)):
    logging.info(f"Received search query: {query}")
    
    try:
        cursor = collection.find({
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"username": {"$regex": query, "$options": "i"}}
            ]
        })
        users = await cursor.to_list(length=1000)
        logging.info(f"Found users: {users}")
        
        return [User(**user) for user in users]
    except Exception as e:
        logging.error(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
