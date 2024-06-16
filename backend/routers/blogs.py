from fastapi import APIRouter, Depends
from models import Blog, Like, Comment, BlogDetailsResponse, ImageModel, TikzModel
from database import get_collection
from exception import BE_Exception as exception
from tikzrenderer.tikzrender import *

router = APIRouter(prefix="/blogs", tags=["blogs"])

def get_blog_collection():
    return get_collection('blogs')

def get_image_collection():
    return get_collection('images')


@router.post("/",response_model=Blog)
async def create_blog(blog: Blog, collection=Depends(get_blog_collection)):
    blog_dict = blog.dict(by_alias=True)
    
    # check if it got any issues with user id
    if blog_dict["uid"] is None:
        raise exception.BadRequest
    
    users = get_collection("users")
    user = await users.find_one({"_id": blog_dict["uid"]})
    if user is None:
        raise exception.UserNotFound
    
    if blog_dict["commid"] is not None:
        community = await get_collection("communities").find_one({"_id": blog_dict["commid"]})
        if community is None:
            raise exception.CommunityNotFound
        if blog_dict["uid"] not in community["memberlist"]:
            raise exception.UserNotInCommunity
        
    result = await collection.insert_one(blog_dict)
    blog_dict["_id"] = result.inserted_id
    return blog_dict

@router.get("/{blog_id}",response_model=Blog)
async def get_blog(blog_id: str, collection=Depends(get_blog_collection)):
    blog = await collection.find_one({"_id": blog_id})
    if blog is None:
        raise exception.NotFound
    return blog


@router.put("/{blog_id}",response_model=Blog)
async def update_blog(blog_id: str, blog: Blog, collection=Depends(get_blog_collection)):
    blog_dict = blog.dict(by_alias=True)
    
    if blog_dict is None or blog_dict["_id"] is None:
        raise exception.BadRequest
    
    blog = await collection.find_one({"_id": blog_id})
    if blog["uid"] != blog_dict["uid"]:
        raise exception.BadRequest
    
    if blog["commid"] != blog_dict["commid"]:
        raise exception.BadRequest
    
    result = await collection.replace_one({"_id": blog_id}, blog_dict)
    if result.modified_count == 0:
        raise exception.NotFound
    return blog_dict

@router.delete("/{blog_id}",response_model=Blog)
async def delete_blog(blog_id: str, collection=Depends(get_blog_collection)):
    blog = await collection.find_one({"_id": blog_id})
    
    if blog is None:
        raise exception.NotFound
    
    for like in blog["likes"]:
        await get_collection("likes").delete_one({"_id":like})
        
    for comment in blog["comments"]:
        await get_collection("comments").delete_one({"_id": comment})
        
    await collection.delete_one({"_id": blog_id})
    return blog

@router.get("/",response_model=list[Blog])
async def get_blogs(collection=Depends(get_blog_collection)):
    blogs = []
    async for blog in collection.find():
        blogs.append(blog)
    return blogs


@router.get("/{user_id}/users",response_model=list[Blog])
async def get_user_blogs(user_id: str, collection=Depends(get_blog_collection)):
    blogs = []
    async for blog in collection.find({"uid": user_id}):
        blogs.append(blog)
    return blogs

@router.get("/{community_id}/communities",response_model=list[Blog])
async def get_community_blogs(community_id: str, collection=Depends(get_blog_collection)):
    blogs = []
    async for blog in collection.find({"commid": community_id}):
        blogs.append(blog)
    return blogs

@router.post("/{blog_id}/like",response_model=Like)
async def like_blog(blog_id: str, liker:Like):
    if liker is None or blog_id != liker["blogid"]:
        raise exception.BadRequest
    
    blog = get_collection("blogs").find_one({"_id": blog_id})
    
    if blog is None:
        raise exception.NotFound
    
    if blog["likes"] is None:
        blog["likes"] = []

    if liker["uid"] in blog["likes"]:
        raise exception.BadRequest
    
    likes = get_collection("likes")
    result = await likes.insert_one(liker)
    liker["_id"] = result.inserted_id
    
    blog["likes"].append(liker["_id"])
    get_collection("blogs").replace_one({"_id": blog_id}, blog)
    return result

@router.delete("/{blog_id}/like",response_model=Like)
async def unlike_blog(blog_id: str, liker:Like):
    if liker is None or blog_id != liker["blogid"]:
        raise exception.BadRequest
    
    blog = get_collection("blogs").find_one({"_id": blog_id})
    liked_id = None
    if blog is None:
        raise exception.NotFound
    for like in blog["likes"]:
        cur_like = get_collection("likes").find_one({"_id": like})
        if cur_like["uid"] == liker["uid"] and cur_like["blogid"] == like["blogid"]:
            liked_id = cur_like
            break
    if  liked_id is None:
        raise exception.BadRequest
    
    blog["likes"].remove(liker["_id"])
    get_collection("blogs").replace_one({"_id": blog_id}, blog)
    likes = get_collection("likes")
    result = await likes.delete_one({"_id": liked_id["_id"]})
    return result
        
@router.post("/{blog_id}/comment",response_model=Comment)
async def comment_blog(blog_id: str, commenter:Comment):
    if commenter is None or blog_id != commenter["blogid"]:
        raise exception.BadRequest
    
    blog = get_collection("blogs").find_one({"_id": blog_id})
    
    if blog is None:
        raise exception.NotFound
    
    comments = get_collection("comments")
    result = await comments.insert_one(commenter)
    commenter["_id"] = result.inserted_id
    
    if blog["comments"] is None:
        blog["comments"] = []
        
    blog["comments"].append(commenter["_id"])
    get_collection("blogs").replace_one({"_id": blog_id}, blog)
    return result

@router.delete("/{blog_id}/comment",response_model=Comment)
async def uncomment_blog(blog_id: str, commenter:Comment):
    if commenter is None or blog_id!= commenter["blogid"]:
        raise exception.BadRequest
    
    blog = get_collection("blogs").find_one({"_id": blog_id})

    if blog is None:
        raise exception.NotFound
    
    blog["comments"].remove(commenter["_id"])
    get_collection("blogs").replace_one({"_id": blog_id}, blog)
    comments = get_collection("comments")
    result = await comments.delete_one({"_id": commenter["_id"]})
    return result

@router.get("/{blog_id}/comments",response_model=list[Comment])
async def get_blog_comments(blog_id: str, collection=Depends(get_blog_collection)):
    comments = []
    async for comment in collection.find({"blogid": blog_id}):
        comments.append(comment)
    return comments

@router.get("/comments/{comment_id}",response_model=Comment)
async def get_comments(comment_id:str):
    collection = get_collection("comments")
    comment = collection.find({"_id": comment_id})
    if comment is None:
        raise exception.NotFound
    
    return comment

@router.get("/{blog_id}/likes",response_model=list[Like])
async def get_blog_likes(blog_id: str, collection=Depends(get_blog_collection)):
    likes = []
    async for like in collection.find({"blogid": blog_id}):
        likes.append(like)
    return likes

@router.get("/likes/{like_id}",response_model=Like)
async def get_likes(like_id:str):
    collection = get_collection("likes")
    like = collection.find({"_id": like_id})
    if like is None:
        raise exception.NotFound
    
    return like

@router.get("/search/{search_query}",response_model=list[Blog])
async def search_blogs(search_query: str, collection=Depends(get_blog_collection)):
    blogs = []
    async for blog in collection.find({"title": {"$regex": search_query}}):
        blogs.append(blog)
    return blogs

@router.get("/trending",response_model=list[Blog])
async def get_trending_blogs(collection=Depends(get_blog_collection)):
    blogs = []
    async for blog in collection.find().sort(lambda x:len(x["likes"])*3 + 2*len(x["comments"]), -1):
        blogs.append(blog)
    return blogs


def get_user_collection():
    return get_collection('users')

def get_comment_collection():
    return get_collection('comments')

@router.get("/{blog_id}/details", response_model=BlogDetailsResponse)
async def get_blog_details(blog_id: str, blog_collection=Depends(get_blog_collection),
                            user_collection=Depends(get_user_collection),
                            comment_collection=Depends(get_comment_collection)):
    blog = await blog_collection.find_one({"_id": blog_id})
    if blog is None:
        raise exception.NotFound

    user = await user_collection.find_one({"_id": blog["uid"]})
    if user is None:
        raise exception.UserNotFound

    comments = []
    async for comment in comment_collection.find({"blogid": blog_id}):
        comments.append(comment)
    
    response = BlogDetailsResponse(blog=blog, user=user, comments=comments)
    return response

@router.post("/generate", response_model=ImageModel)
async def generate_image(tikz: TikzModel):
    output_file = "output.jpg"  
    
    success = compile_tikz_to_jpg(tikz.tikz_code, output_file)
    if not success:
        raise exception.TikzError
    
    base64_string = encode_image_to_base64(output_file)
    
    image_data = {"base64_image": base64_string}
    result = get_image_collection().insert_one(image_data)
    
    return {"id": "1", "base64_image": base64_string}

@router.get("/image/{image_id}", response_model=ImageModel)
async def get_image(image_id: str):
    image_data = get_image_collection*().find_one({"_id": image_id})
    if image_data is None:
        raise exception.ImageError
    
    return {"id": str(image_data["_id"]), "base64_image": image_data["base64_image"]}