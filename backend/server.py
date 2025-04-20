from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import os
from openai import OpenAI  # Updated import for OpenAI client
from dotenv import load_dotenv

# Initialize OpenAI client
load_dotenv()
openai = OpenAI()

# Load environment variables
load_dotenv()
# MongoDB setup
MONGO_CONN_STRING = os.getenv("DB_CONN_STRING")
DB_NAME = os.getenv("DB_NAME")
USERS_COLLECTION_NAME = os.getenv("USERS_COLLECTION_NAME", "users")

client = MongoClient(MONGO_CONN_STRING)
db = client[DB_NAME]
users_collection = db[USERS_COLLECTION_NAME]

# Initialize FastAPI app
app = FastAPI(
	title="Workout Health App API",
	description="Backend for an AI-powered workout health application",
	version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models
class User(BaseModel):
    auth0_id: str
    name: str
    email: EmailStr
    preferences: Optional[Dict[str, Any]] = {}

class UserResponse(BaseModel):
    id: str
    auth0_id: str
    name: str
    email: EmailStr
    preferences: Optional[Dict[str, Any]] = {}
    created_at: datetime


# Endpoint to save user data
@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def save_user(user: User):
    # Check if user already exists
    existing_user = users_collection.find_one({"auth0_id": user.auth0_id})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Prepare user data for MongoDB
    user_data = {
        "auth0_id": user.auth0_id,
        "name": user.name,
        "email": user.email,
        "preferences": user.preferences,
        "created_at": datetime.utcnow(),
    }

    # Insert into MongoDB
    result = users_collection.insert_one(user_data)

    # Map MongoDB's _id to id for the response
    user_data["id"] = str(result.inserted_id)  # Convert ObjectId to string
    del user_data["_id"]  # Remove the MongoDB-specific _id field

    return user_data

# Endpoint to get user data by Auth0 ID
@app.get("/users/{auth0_id}", response_model=UserResponse)
async def get_user(auth0_id: str):
    user = users_collection.find_one({"auth0_id": auth0_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return user



# Transcription endpoint
@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())
        
        # Use the new OpenAI client API for transcription
        with open(temp_file_path, "rb") as audio_file:
            response = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            
        
        # Clean up the temporary file
        os.remove(temp_file_path)
        
        # Return the transcription text
        return {"transcription": response.text}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/workouts/start_workout")
async def start_workout(auth0_id: str):
    # Check if user exists
    user = users_collection.find_one({"auth0_id": auth0_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    

    return {"message": "Workout started successfully"}


@app.post("/workouts/add_to_workout_conversation")
async 