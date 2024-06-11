from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"Welcome to LightBulb"}

uri = "mongodb+srv://drakensang47:zuECudUoeKqIN4Qw@lightbulb.7mvqrxi.mongodb.net/?retryWrites=true&w=majority&appName=LightBulb"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    # connect to LightBulb db user collection
    db = client["LightBulb"]
    usersCollection = db["user"]
    print("Pinged your deployment. You successfully connected to MongoDB!")

    # get all users
    @app.get("/users", tags=["users"])
    async def get_users() -> dict:
        users = []
        for user in usersCollection.find():
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            users.append(user)
        return users

    @app.post("/users", tags=["auth"])
    async def register_user(user: dict) -> dict:
        try:
            usersCollection.insert_one(user)
            return {"status": "success", "message": "User registered successfully"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

except Exception as e:
    print(e)