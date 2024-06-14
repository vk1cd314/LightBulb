from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from bson import ObjectId

class User(BaseModel):
    uid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    email: EmailStr
    gender: Optional[str] = None
    username: Optional[str] = None
    profilepic: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Community(BaseModel):
    commid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    topic: str
    memberlist: List[str] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Blog(BaseModel):
    blogid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    commid: Optional[str] = None
    content: str
    comments: Optional[str] = None
    likes: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Following(BaseModel):
    uid1: str
    uid2: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Like(BaseModel):
    lid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    blogid: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Comment(BaseModel):
    cid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    blogid: str
    commid: Optional[str] = None
    commentcontent: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
