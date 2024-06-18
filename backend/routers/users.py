from fastapi import APIRouter, Depends, Path, Query
from typing import List
from bson import ObjectId
from models import User, Following, Blog, Community
from database import get_collection
from pymongo.collection import Collection
import logging
from exception import BE_Exception as exception
from pydantic import EmailStr

router = APIRouter(prefix="/users", tags=["users"])

def get_users_collection() -> Collection:
    return get_collection('users')

def get_following_collection() -> Collection:
    return get_collection('following')

def get_blog_collection() -> Collection:
    return get_collection('blogs')

def get_community_collection() -> Collection:
    return get_collection('communities')

def get_communities_collection() -> Collection:
    return get_collection('communities')

@router.post("/", response_model=User)
async def create_user(user: User, collection=Depends(get_users_collection)):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        return existing_user

    user_dict = user.dict(by_alias=True)
    result = await collection.insert_one(user_dict)
    created_user = await collection.find_one({"_id": result.inserted_id})
    return User(**created_user)

@router.get("/email/", response_model=User)
async def get_user_by_email(email: EmailStr, collection=Depends(get_users_collection)):
    user = await collection.find_one({"email": email})
    if user is None:
        raise exception.UserNotFound
    return User(**user)

@router.get("/{uid}", response_model=User)
async def get_user_by_id(uid: str = Path(..., title="User ID"), collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise exception.BadRequest
    
    user = await collection.find_one({"_id": uid})
    if user:
        return User(**user)
    else:
        raise exception.UserNotFound

@router.put("/{uid}", response_model=User)
async def update_user(uid: str, user_data: User, collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise exception.BadRequest

    existing_user = await collection.find_one({"_id": uid})
    if existing_user:
        update_data = user_data.dict(by_alias=True)
        update_data.pop("_id", None) 

        await collection.update_one({"_id": uid}, {"$set": update_data})
        updated_user = await collection.find_one({"_id": uid})
        return User(**updated_user)
    else:
        raise exception.UserNotFound

@router.delete("/{uid}", response_model=dict)
async def delete_user(uid: str, collection=Depends(get_users_collection)):
    if not ObjectId.is_valid(uid):
        raise exception.BadRequest

    delete_result = await collection.delete_one({"_id": uid})
    if delete_result.deleted_count == 1:
        return {"status": "success", "message": "User deleted successfully"}
    else:
        raise exception.UserNotFound

@router.get("/", response_model=List[User])
async def list_users(collection=Depends(get_users_collection)):
    cursor = collection.find({})
    users = await cursor.to_list(length=1000)
    return [User(**user) for user in users]

@router.get("/search/{query}", response_model=List[User])
async def search_users(query: str, collection: Collection = Depends(get_users_collection)):
    try:
        cursor = collection.find({
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"username": {"$regex": query, "$options": "i"}}
            ]
        })
        users = await cursor.to_list(length=1000)
        
        return [User(**user) for user in users]
    except Exception as e:
        raise exception.ServerException

@router.get("/following/{uid}", response_model=List[User])
async def get_following(uid: str, collection=Depends(get_following_collection), user_collection=Depends(get_users_collection)):
    followings = collection.find({"uid1": uid})
    following_uids = [following["uid2"] for following in await followings.to_list(length=None)]
    
    users = await user_collection.find({"_id": {"$in": following_uids}}).to_list(length=None)
    return users

@router.get("/followers/{uid}", response_model=List[User])
async def get_followers(uid: str, collection=Depends(get_following_collection), user_collection=Depends(get_users_collection)):
    followers = collection.find({"uid2": uid})
    follower_uids = [follower["uid1"] for follower in await followers.to_list(length=None)]
    
    users = await user_collection.find({"_id": {"$in": follower_uids}}).to_list(length=None)
    return users


@router.post("/follow")
async def follow(following: Following, user_collection=Depends(get_users_collection), following_collection=Depends(get_following_collection)):
    if not await user_collection.find_one({"_id": following.uid1}):
        raise exception.UserNotFound
    if not await user_collection.find_one({"_id": following.uid2}):
        raise exception.UserNotFound
    existing_following = await following_collection.find_one({"uid1": following.uid1, "uid2": following.uid2})
    
    if existing_following:
        await following_collection.delete_one({"_id": existing_following["_id"]})
        return {"detail": "Successfully unfollowed"}
    else:
        result = await following_collection.insert_one(following.dict())
        return following

@router.get("/{user_id}/userdata")
async def get_user_data(
    user_id: str,
    user_collection: Collection = Depends(get_users_collection),
    blog_collection: Collection = Depends(get_blog_collection),
    following_collection: Collection = Depends(get_following_collection),
    community_collection: Collection = Depends(get_community_collection)
):
    user_data = await user_collection.find_one({"_id": user_id})
    if not user_data:
        raise exception.UserNotFound
    user = User(**user_data)
    
    blogs_data = await blog_collection.find({"uid": user_id}).to_list(None)
    blogs = [Blog(**blog) for blog in blogs_data]
    
    following_data = await following_collection.find({"uid1": user_id}).to_list(None)
    following = [follow['uid2'] for follow in following_data]
    
    followers_data = await following_collection.find({"uid2": user_id}).to_list(None)
    followers = [follower['uid1'] for follower in followers_data]
    
    communities_data = await community_collection.find({"memberlist": user_id}).to_list(None)
    communities = [Community(**comm) for comm in communities_data]

    response = {
        "user": user.dict(by_alias=True),
        "communities": [comm.dict(by_alias=True) for comm in communities],
        "blogs": [blog.dict(by_alias=True) for blog in blogs],
        "following": following,
        "followers": followers
    }
    return response

@router.post("/followingtype")
async def get_following_type(following: Following, following_collection=Depends(get_following_collection)):
    existing_following = await following_collection.find_one({
        "uid1": following.uid1,
        "uid2": following.uid2
    })
    if existing_following is None:
        return {"details": "false"}
    else:
        return {"details": "true"}