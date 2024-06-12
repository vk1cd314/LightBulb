from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class User(BaseModel):
    uid: Optional[PyObjectId] = Field(alias="_id")
    name: str
    email: EmailStr
    gender: str
    password: str
    profilepic: Optional[str] = None
    followercount: int = 0

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Community(BaseModel):
    commid: Optional[PyObjectId] = Field(alias="_id")
    name: str
    topic: str
    memberlist: List[PyObjectId] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Blog(BaseModel):
    blogid: Optional[PyObjectId] = Field(alias="_id")
    uid: PyObjectId
    commid: Optional[PyObjectId] = None
    content: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Following(BaseModel):
    uid1: PyObjectId
    uid2: PyObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Like(BaseModel):
    uid: PyObjectId
    blogid: PyObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Comment(BaseModel):
    uid: PyObjectId
    blogid: PyObjectId
    commid: Optional[PyObjectId] = None
    commentcontent: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
