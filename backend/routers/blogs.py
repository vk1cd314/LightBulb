from fastapi import APIRouter, Depends
from models import Blog, Like, Comment, BlogDetailsResponse, ImageModel, TikzModel
from database import get_collection
from exception import BE_Exception as exception
from tikzrenderer.tikzrender import *
from bson import ObjectId

router = APIRouter(prefix="/blogs", tags=["blogs"])

def get_blog_collection():
    return get_collection('blogs')

def get_image_collection():
    return get_collection('images')

def get_like_collection():
    return get_collection('likes')

def get_comment_collection():
    return get_collection('comments')

def get_reply_collection():
    return get_collection('replies')

def get_user_collection():
    return get_collection('users')


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


@router.put("/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, blog: Blog, collection=Depends(get_blog_collection)):
    if not ObjectId.is_valid(blog_id):
        raise exception.BadRequest

    blog_id_obj = blog_id

    existing_blog = await collection.find_one({"_id": blog_id_obj})
    if not existing_blog:
        raise exception.NotFound

    if existing_blog["uid"] != blog.uid:
        raise exception.BadRequest
    if existing_blog["commid"] != blog.commid:
        raise exception.BadRequest

    blog_dict = blog.dict(by_alias=True)
    blog_dict.pop("_id", None)

    result = await collection.replace_one({"_id": blog_id_obj}, blog_dict)
    if result.modified_count == 0:
        raise exception.NotFound

    updated_blog = await collection.find_one({"_id": blog_id_obj})
    return Blog(**updated_blog)

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
async def like_blog(blog_id: str, liker:Like, 
                    blog_collection=Depends(get_blog_collection), 
                    like_collection=Depends(get_like_collection)):
    if liker is None or blog_id != liker.blogid:
        raise exception.BadRequest
    
    blog = await blog_collection.find_one({"_id": blog_id})
    
    if blog is None:
        raise exception.NotFound
    
    if blog.get("likes") is None:
        blog["likes"] = []

    for like_str in blog["likes"]:
        like = await like_collection.find_one({"_id": like_str})
        if like["uid"] == liker.uid:
            raise exception.AlreadyLiked
    
    alreadyLiked = await like_collection.find_one({"blogid": blog_id, "uid": liker.uid})
    print(alreadyLiked)
    if alreadyLiked is not None:
        raise exception.AlreadyLiked
    
    likes = like_collection
    result = await likes.insert_one(liker.dict(by_alias=True))
    liker.lid = result.inserted_id
    
    blog["likes"].append(liker.lid)
    blog_dict = blog.copy()
    blog_dict.pop("_id", None)
    blog_collection.replace_one({"_id": blog_id}, blog_dict)
    return liker.dict(by_alias=True)

@router.delete("/{blog_id}/like",response_model=Like)
async def unlike_blog(blog_id: str, liker:Like, 
                      blog_collection=Depends(get_blog_collection), 
                      like_collection=Depends(get_like_collection)):
    if liker is None or blog_id != liker.blogid:
        raise exception.BadRequest
    
    blog = await blog_collection.find_one({"_id": blog_id})
    
    if blog is None:
        raise exception.NotFound
    
    toremove = None
    
    for like_str in blog["likes"]:
        like = await like_collection.find_one({"_id": like_str})
        if like["uid"] == liker.uid:
            toremove = like
            break

    if toremove is None:
        raise exception.NotFound
    
    blog["likes"].remove(toremove["_id"])
    blog_dict = blog.copy()
    blog_dict.pop("_id", None)
    await blog_collection.replace_one({"_id": blog_id}, blog_dict)
    await like_collection.delete_one({"_id": toremove["_id"]})
        
    return liker.dict(by_alias=True)

@router.post("/{blog_id}/comment", response_model=Comment)
async def comment_blog(blog_id: str, commenter: Comment, 
                       blog_collection=Depends(get_blog_collection), 
                       comment_collection=Depends(get_comment_collection)):
    if commenter is None or blog_id != commenter.blogid:
        raise exception.BadRequest
    
    blog = await blog_collection.find_one({"_id": blog_id})
    if blog is None:
        raise exception.NotFound
    
    result = await comment_collection.insert_one(commenter.dict(by_alias=True))
    commenter.cid = result.inserted_id
    
    if blog.get("comments") is None:
        blog["comments"] = []

    blog["comments"].append(commenter.cid)
    blog_dict = blog.copy()
    blog_dict.pop("_id", None)
    await blog_collection.replace_one({"_id": blog_id}, blog_dict)

    return commenter.dict(by_alias=True)

@router.delete("/{blog_id}/comment", response_model=Comment)
async def uncomment_blog(blog_id: str, commenter: Comment, 
                         blog_collection=Depends(get_blog_collection), 
                         comment_collection=Depends(get_comment_collection)):
    if commenter is None or blog_id != commenter.blogid:
        raise exception.BadRequest
    
    blog = await blog_collection.find_one({"_id": blog_id})
    if blog is None:
        raise exception.NotFound
    
    to_remove = await comment_collection.find_one({"_id": commenter.cid, "uid": commenter.uid})
    if to_remove is None:
        raise exception.NotFound
    
    blog["comments"].remove(commenter.cid)
    blog_dict = blog.copy()
    blog_dict.pop("_id", None)
    await blog_collection.replace_one({"_id": blog_id}, blog_dict)
    await comment_collection.delete_one({"_id": commenter.cid})

    return commenter.dict(by_alias=True)

@router.get("/{blog_id}/comments",response_model=list[Comment])
async def get_blog_comments(blog_id: str, collection=Depends(get_comment_collection)):
    comments = []
    async for comment in collection.find({"blogid": blog_id}):
        comments.append(comment)
    return comments

@router.get("/comments/{comment_id}",response_model=Comment)
async def get_comments(comment_id:str, collection=Depends(get_comment_collection)):
    comment = await collection.find_one({"_id": comment_id})
    if comment is None:
        raise exception.NotFound
    print(comment)    
    return comment

@router.get("/{blog_id}/likes",response_model=list[Like])
async def get_blog_likes(blog_id: str, collection=Depends(get_like_collection)):
    likes = []
    async for like in collection.find({"blogid": blog_id}):
        likes.append(like)
    return likes

@router.get("/likes/{like_id}",response_model=Like)
async def get_likes(like_id:str, collection=Depends(get_like_collection)):
    like = await collection.find_one({"_id": like_id})
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
    print(collection.find())
    async for blog in collection.find().sort(lambda x:len(x["likes"])*3 + 2*len(x["comments"]), -1):
        blogs.append(blog)
    return blogs

@router.get("/{blog_id}/details")
async def get_blog_details(blog_id: str, blog_collection=Depends(get_blog_collection),
                            user_collection=Depends(get_user_collection)):
    blog = await blog_collection.find_one({"_id": blog_id})
    if blog is None:
        raise exception.NotFound

    user = await user_collection.find_one({"_id": blog["uid"]})
    if user is None:
        raise exception.UserNotFound

    response = {
        "blog": blog,
        "user": user
    }
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