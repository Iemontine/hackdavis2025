from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, Union
from datetime import datetime
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from fitness_agents.multi_tool_agent import session_runner


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
    details: Optional[Dict[str, Any]] = {}
    created_at: datetime

class WorkoutRequest(BaseModel):
    auth0_id: str

class WorkoutConversationRequest(BaseModel):
    auth0_id: str
    message: str

# Add new Pydantic model for fitness profile updates
class FitnessProfileUpdate(BaseModel):
    auth0_id: str
    height: str
    weight: str
    fitness_level: str
    workout_time: str
    goal: str

# Endpoint to create a new user
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
        "details": {},
        "created_at": datetime.utcnow(),
    }

    # Insert into MongoDB
    result = users_collection.insert_one(user_data)

    # Map MongoDB's _id to id for the response
    user_data["id"] = str(result.inserted_id)  # Convert ObjectId to string
    # del user_data["_id"] if "_id" in user_data else None  # Remove the MongoDB-specific _id field

    return user_data

# Endpoint to get user data by Auth0 ID
@app.get("/users/{auth0_id}")
async def get_user(auth0_id: str):
    
    user = users_collection.find_one({"auth0_id": auth0_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user["_id"])  # Convert ObjectId to string
    del user["_id"]  # Remove MongoDB-specific field
    return user

# Endpoint to get user data by Auth0 ID
# Transcription endpoint
@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # No user-specific check here since this endpoint might be used before user creation
    # If needed, you can add authorization via headers or query params
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
        # return {"transcription": "My age is 25. My height is 5'9\". My weight is 150 lbs. I am a beginner. I prefer to work out for 30 minutes. My goal is to lose weight. I have no dietary restrictions OR EQUIPMENT!"}
    except Exception as e:
        return {"error": str(e)}
            
uid_to_sid = {}

# Add debug route to verify server is running
@app.get("/")
async def root():
    """Root endpoint to verify server is running"""
    return {"status": "Server is running", "endpoints": ["/workouts/start_workout", "/transcribe/"]}

@app.post("/workouts/start_workout")
async def start_workout(request: WorkoutRequest):
    try:
        # Check if user exists - make this optional during development
        user = users_collection.find_one({"auth0_id": request.auth0_id})
        if not user and request.auth0_id != "user123":  # Allow test user
            raise HTTPException(status_code=404, detail="User not found")
        greeting = await session_runner.call_agent_async("Start the conversation.")
        session_id = session_runner.SESSION_ID
        if request.auth0_id not in uid_to_sid:
            uid_to_sid[request.auth0_id] = session_id
        return {"message": greeting}
    except Exception as e:
        # Log the error and return a helpful message
        print(f"Error in start_workout: {str(e)}")
        return {"message": f"An error occurred: {str(e)}. Please check server logs."}

@app.post("/workouts/add_to_workout_conversation")
async def add_to_workout_conversation(request: WorkoutConversationRequest):
    try:
        # Check if user exists - make this optional during development
        user = users_collection.find_one({"auth0_id": request.auth0_id})
        if not user and request.auth0_id != "user123":  # Allow test user
            raise HTTPException(status_code=404, detail="User not found")
        if request.auth0_id not in uid_to_sid:
            # If no session exists, start a new one
            greeting = await session_runner.call_agent_async("Start the conversation.")
            uid_to_sid[request.auth0_id] = session_runner.SESSION_ID
            return {"message": greeting}
        # Use the existing session ID
        session_id = uid_to_sid[request.auth0_id]
        response = await session_runner.call_agent_async(request.message)

        return {"message": response}
    except Exception as e:
        # Log the error and return a helpful message
        print(f"Error in add_to_workout_conversation: {str(e)}")
        return {"message": f"An error occurred: {str(e)}. Please check server logs."}

# Separate endpoint to update user fitness profile
@app.post("/users/update-fitness-profile")
async def update_fitness_profile(profile_update: FitnessProfileUpdate):
    try:
        # Check if user exists
        user = users_collection.find_one({"auth0_id": profile_update.auth0_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user with fitness profile information
        result = users_collection.update_one(
            {"auth0_id": profile_update.auth0_id},
            {"$set": {
            "details.height": profile_data.get("height"),
            "details.weight": profile_data.get("weight"),
            "details.age": profile_data.get("age"),
            "details.fitness_level": profile_data.get("fitness_level"),
            "details.workout_time": profile_data.get("workout_time"),
            "details.goal": profile_data.get("goal"),
            "details.preferences": profile_data.get("preferences"),
            "details.tailoring": profile_data.get("tailoring")
            }}
        )
        
        if result.modified_count == 0:
            # If no document was modified, it might be due to the document already having the same values
            # In this case, we still want to return success
            return {"message": "Profile already up to date or no changes needed"}
        
        return {"message": "Fitness profile updated successfully"}
    
    except Exception as e:
        print(f"Error updating fitness profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")