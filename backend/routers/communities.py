from fastapi import APIRouter, Depends
from models import Community
from database import get_collection
from exception import BE_Exception as exception

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
    community = await collection.find_one({"_id": community_id})
    if community is None:
        raise exception.CommunityNotFound
    return community


@router.put("/{community_id}", response_model=Community)
async def update_community(community_id: str, community: Community, collection=Depends(get_communities_collection)):
    community_dict = community.dict(by_alias=True)

    community_dict.pop("_id", None)

    result = await collection.replace_one({"_id": community_id}, community_dict)
    if result.modified_count == 0:
        raise exception.CommunityNotFound
    
    updated_community = await collection.find_one({"_id": community_id})
    
    return Community(**updated_community)

@router.delete("/{community_id}", response_model=Community)
async def delete_community(community_id: str, collection=Depends(get_communities_collection)):
    community = await collection.find_one({"_id": community_id})
    if community is None:
        raise exception.CommunityNotFound
    await collection.delete_one({"_id": community_id})
    return community


@router.get("/", response_model=list[Community])
async def read_communities(collection=Depends(get_communities_collection)):
    communities = []
    async for community in collection.find():
        communities.append(community)
    return communities


@router.put("/{community_id}/join", response_model=Community)
async def join_community(community_id: str, user_id: str, collection=Depends(get_communities_collection)):
    community = await collection.find_one({"_id": community_id})
    user_collection = get_collection("users")
    user = await user_collection.find_one({"_id": user_id})
    
    if user is None:
        raise exception.UserNotFound
    if community is None:
        raise exception.CommunityNotFound
    if user_id not in community.get("memberlist", []):
        community["memberlist"].append(user_id)
        community_dict = community.copy()
        community_dict.pop("_id", None)
        await collection.replace_one({"_id": community_id}, community_dict)
    
    return Community(**community)


@router.put("/{community_id}/leave", response_model=Community)
async def leave_community(community_id: str, user_id: str, collection=Depends(get_communities_collection)):
    community = await collection.find_one({"_id": community_id})
    user_collection = get_collection("users")
    user = await user_collection.find_one({"_id": user_id})

    if user is None:
        raise exception.UserNotFound
    if community is None:
        raise exception.CommunityNotFound

    if user_id in community.get("memberlist", []):
        community["memberlist"].remove(user_id)
        community_dict = community.copy()
        community_dict.pop("_id", None)
        await collection.replace_one({"_id": community_id}, community_dict)

    return Community(**community)


@router.get("/recommended", response_model=list[Community])
async def get_recommended_communities(topic: str, collection=Depends(get_communities_collection)):
    communities = []
    async for community in collection.find({"topic": topic}).sort(lambda x: len(x["memberlist"]),-1):
        communities.append(community)
    return communities