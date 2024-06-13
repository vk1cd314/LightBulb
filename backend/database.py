from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
print(uri)
client = AsyncIOMotorClient(uri)
db = client["LightBulb"]

def get_collection(name: str):
    return db[name]
