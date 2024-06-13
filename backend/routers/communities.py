from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from models import Community
from database import get_collection

router = APIRouter(prefix="/communities", tags=["communities"])

def get_communities_collection():
    return get_collection('communities')

@router.post("/", response_model=Community)
async def create_community(community: Community, collection=Depends(get_communities_collection)):
    community_dict = community.dict(by_alias=True)
    result = await collection.insert_one(community_dict)
    community_dict["_id"] = result.inserted_id
    return community_dict

@router.get("/{community_id}", response_model=Community)
async def read_community(community_id: str, collection=Depends(get_communities_collection)):
    if not ObjectId.is_valid(community_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    community = await collection.find_one({"_id": ObjectId(community_id)})
    if community is None:
        raise HTTPException(status_code=404, detail="Community not found")
    return community
