from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List
from backend.models import User, Community
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to LightBulb"}

uri = os.getenv("MONGODB_URI")

# Create a new client and connect to the server
client = AsyncIOMotorClient(uri)

# Connect to LightBulb database
db = client["LightBulb"]

def get_collection(name: str):
    return db[name]

print("Pinged your deployment. You successfully connected to MongoDB!")

@app.post("/users/", response_model=User)
async def create_user(user: User, collection=Depends(get_collection('users'))):
    user_dict = user.dict(by_alias=True)
    result = await collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return user_dict

@app.get("/users/{user_id}", response_model=User)
async def read_user(user_id: str, collection=Depends(get_collection('users'))):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    user = await collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/communities/", response_model=Community)
async def create_community(community: Community, collection=Depends(get_collection('communities'))):
    community_dict = community.dict(by_alias=True)
    result = await collection.insert_one(community_dict)
    community_dict["_id"] = result.inserted_id
    return community_dict

@app.get("/communities/{community_id}", response_model=Community)
async def read_community(community_id: str, collection=Depends(get_collection('communities'))):
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    community = await collection.find_one({"_id": ObjectId(community_id)})
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return community
