from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, communities, blogs # Assuming you have these routers
import database  # Ensure this is imported to establish DB connection

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to LightBulb"}



app.include_router(users.router)
app.include_router(communities.router)
app.include_router(blogs.router)


def install_requirements():
    import subprocess,sys
    """
    Function to install packages from requirements.txt.
    """
    try:
        # Run pip install with subprocess
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print(result.stdout.decode())
    except subprocess.CalledProcessError as e:
        print(
            f"An error occurred while installing dependencies: {e.stderr.decode()}")


if __name__ == "__main__":
    install_requirements()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
