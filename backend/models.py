from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

class User(BaseModel):
    uid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    email: EmailStr
    gender: Optional[str] = None
    username: Optional[str] = None
    profilepic: Optional[str] = "https://i.ibb.co/hYbbGyR/6596121-modified.png"
    about: Optional[str] = None

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

class Like(BaseModel):
    lid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    blogid: str
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class Comment(BaseModel):
    cid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    blogid: str
    commid: Optional[str] = None
    commentcontent: str
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))
    updated_at: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class Reply(BaseModel):
    rid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    cid: str
    uid: str
    blogid: str
    commid: Optional[str] = None
    replycontent: str
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))
    updated_at: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class Blog(BaseModel):
    blogid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    title: str
    commid: Optional[str] = None
    content: str
    comments: list[str] = []
    likes: list[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))
    updated_at: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class Draft(BaseModel):
    draftid: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    uid: str
    title: Optional[str] = None
    commid: Optional[str] = None
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class Following(BaseModel):
    uid1: str
    uid2: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class BlogDetailsResponse(BaseModel):
    blog: Blog
    user: User
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}
        
class TikzModel(BaseModel):
    tikz_code: str

class ImageModel(BaseModel):
    id: str
    base64_image: str