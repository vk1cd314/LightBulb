from fastapi import APIRouter, Depends
from typing import List
from bson import ObjectId
from models import Draft
from database import get_collection
from pymongo.collection import Collection
from datetime import datetime
from exception import BE_Exception as exception

router = APIRouter(prefix="/drafts", tags=["drafts"])

def get_drafts_collection() -> Collection:
    return get_collection('drafts')

@router.post("/", response_model=Draft)
async def create_draft(draft: Draft, collection=Depends(get_drafts_collection)):
    draft_dict = draft.dict(by_alias=True)
    result = await collection.insert_one(draft_dict)
    created_draft = await collection.find_one({"_id": result.inserted_id})
    return Draft(**created_draft)

@router.get("/{draftid}", response_model=Draft)
async def get_draft(draftid: str, collection=Depends(get_drafts_collection)):
    if not ObjectId.is_valid(draftid):
        raise exception.BadRequest

    draft = await collection.find_one({"_id": draftid})
    if draft:
        return Draft(**draft)
    else:
        raise exception.NotFound

@router.get("/{uid}", response_model=List[Draft])
async def get_user_drafts(uid: str, collection=Depends(get_drafts_collection)):
    cursor = collection.find({"uid": uid})
    drafts = await cursor.to_list(length=100)
    return [Draft(**draft) for draft in drafts]

@router.put("/{draftid}", response_model=Draft)
async def update_draft(draftid: str, draft_data: Draft, collection=Depends(get_drafts_collection)):
    if not ObjectId.is_valid(draftid):
        raise exception.BadRequest

    existing_draft = await collection.find_one({"_id": draftid})
    if existing_draft:
        draft_data.updated_at = datetime.utcnow()
        update_data = draft_data.dict(by_alias=True)
        update_data.pop("_id", None)
        await collection.update_one({"_id": draftid}, {"$set": update_data})
        updated_draft = await collection.find_one({"_id": draftid})
        return Draft(**updated_draft)
    else:
        raise exception.NotFound

@router.delete("/{draftid}", response_model=dict)
async def delete_draft(draftid: str, collection=Depends(get_drafts_collection)):
    if not ObjectId.is_valid(draftid):
        raise exception.BadRequest

    delete_result = await collection.delete_one({"_id": draftid})
    if delete_result.deleted_count == 1:
        return {"status": "success", "message": "Draft deleted successfully"}
    else:
        raise exception.NotFound
