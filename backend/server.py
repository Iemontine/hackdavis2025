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
from fitness_agents.multi_tool_agent import workout_session
import json
import traceback
import uuid
import shortuuid


# important globals
uid_to_session = {}

# Initialize OpenAI client
load_dotenv()
openai = OpenAI()

# Load environment variables
load_dotenv()
# MongoDB setup
MONGO_CONN_STRING = os.getenv("DB_CONN_STRING")
DB_NAME = os.getenv("DB_NAME")
USERS_COLLECTION_NAME = os.getenv("USERS_COLLECTION_NAME", "users")

# Configuration for restricted access
AUTHORIZED_EMAILS = os.getenv("AUTHORIZED_EMAILS", "").split(",")

client = MongoClient(MONGO_CONN_STRING)
db = client[DB_NAME]
users_collection = db[USERS_COLLECTION_NAME]
workouts_collection = db["workouts"]  # New collection for workouts

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

# Helper function to verify authorized access
def verify_authorized_email(email: str) -> bool:
    return email in AUTHORIZED_EMAILS

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
    profile_json: Dict[str, Any]

# Pydantic models for workouts
class Exercise(BaseModel):
    name: str
    description: str
    duration: Optional[str] = None
    reps: Optional[int] = None

class WorkoutData(BaseModel):
    type: str
    name: str
    duration: Optional[str] = None
    description: str
    exercises: list[Exercise]
    created_by: Optional[str] = None  # Auth0 ID of creator

class WorkoutResponse(BaseModel):
    workout_id: str
    workout: WorkoutData
    share_url: str

class WorkoutGenerationRequest(BaseModel):
    auth0_id: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

# Generate a unique, readable workout ID
def generate_workout_id():
    return shortuuid.uuid()[:16]  # 16 characters is enough for uniqueness while being readable

# Endpoint to create a new user
@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def save_user(user: User):
    # Check if user has authorized email
    # if not verify_authorized_email(user.email):
    #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
    
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

    return user_data

# Endpoint to get user data by Auth0 ID
@app.get("/users/{auth0_id}", response_model=UserResponse)
async def get_user(auth0_id: str):
    user = users_collection.find_one({"auth0_id": auth0_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user has authorized email
    # if not verify_authorized_email(user.get("email", "")):
    #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
    
    user["id"] = str(user["_id"])  # Convert ObjectId to string
    del user["_id"]  # Remove MongoDB-specific field
    return user

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
            
# Add debug route to verify server is running
@app.get("/")
async def root():
    """Root endpoint to verify server is running"""
    return {"status": "Server is running", "endpoints": ["/onboarding/start_onboarding", "/transcribe/"]}

@app.post("/onboarding/start_onboarding")
async def start_workout(request: WorkoutRequest):
    try:
        # Check if user exists and is authorized
        user_id = request.auth0_id
        user = users_collection.find_one({"auth0_id": user_id})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has authorized email
        # if not verify_authorized_email(user.get("email", "")):
        #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
        
        runner = session_runner.create_session_runner(user_id)
        uid_to_session[user_id] = runner
        greeting = await session_runner.call_agent_async("Start the conversation.", runner, user_id)
        return {"message": greeting}
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error and return a helpful message
        print(f"Error in start_workout: {str(e)}")
        return {"message": f"An error occurred: {str(e)}. Please check server logs."}

@app.post("/workouts/add_to_workout_conversation")
async def add_to_workout_conversation(request: WorkoutConversationRequest):
    try:
        # Check if user exists and is authorized
        user_id = request.auth0_id
        user = users_collection.find_one({"auth0_id": user_id})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has authorized email
        # if not verify_authorized_email(user.get("email", "")):
        #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
        
        if user_id not in uid_to_session:
            runner = session_runner.create_session_runner(user_id)
            uid_to_session[user_id] = runner
            greeting = await session_runner.call_agent_async("Start the conversation.", runner, user_id)
            return {"message": greeting}
        else:
            runner = uid_to_session[user_id]
            response = await session_runner.call_agent_async(request.message, runner, user_id)
        return {"message": response}
    except HTTPException as e:
        raise e
    except Exception as e:
        # Log the error and return a helpful message
        print(f"Error in add_to_workout_conversation: {str(e)}")
        return {"message": f"An error occurred: {str(e)}. Please check server logs."}

# Separate endpoint to update user fitness profile
@app.post("/users/update-fitness-profile")
async def update_fitness_profile(profile_update: FitnessProfileUpdate):
    print("=" * 50)
    print("CALLED update_fitness_profile ENDPOINT")
    print(profile_update)
    print(f"Received update for user: {profile_update.auth0_id}")
    print(f"With profile data: {profile_update.profile_json}")
    print("=" * 50)

    try:
        # Check if user exists
        user = users_collection.find_one({"auth0_id": profile_update.auth0_id})
        if not user:
            print(f"User not found: {profile_update.auth0_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has authorized email
        # if not verify_authorized_email(user.get("email", "")):
        #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
        
        profile_data = profile_update.profile_json
        
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
        
        print(f"Update result: modified_count={result.modified_count}")
        
        if result.modified_count == 0:
            # If no document was modified, it might be due to the document already having the same values
            # In this case, we still want to return success
            return {"message": "Profile already up to date or no changes needed"}
        else:
            uid_to_session.pop(profile_update.auth0_id, None)  # Clear session if it exists
            print(f"Session cleared for user: {profile_update.auth0_id}")
        
        return {"message": "Fitness profile updated successfully"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error updating fitness profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/users/profile")
async def get_user_profile(auth0_id: str):
    try:
        # Look up user in your database
        user_data = users_collection.find_one({"auth0_id": auth0_id})
        
        if not user_data:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if user has authorized email
        # if not verify_authorized_email(user_data.get("email", "")):
        #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in user_data:
            user_data["_id"] = str(user_data["_id"])
        
        return user_data
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error fetching user profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Endpoint to create or retrieve a workout by ID
@app.get("/workout/{workout_id}")
async def get_workout_by_id(workout_id: str):
    # Check if workout exists
    workout = workouts_collection.find_one({"workout_id": workout_id})
    
    if workout:
        # Get creator information if available
        creator_id = workout.get("workout", {}).get("created_by")
        if creator_id:
            creator = users_collection.find_one({"auth0_id": creator_id})
            # if creator and not verify_authorized_email(creator.get("email", "")):
            #     raise HTTPException(status_code=403, detail="Access denied. Workout creator not authorized.")
                
        # Workout exists, return it
        workout["_id"] = str(workout["_id"])  # Convert ObjectId to string
        return workout
    else:
        # Workout doesn't exist
        raise HTTPException(status_code=404, detail="Workout not found")

# Endpoint to generate a new workout
@app.post("/workout/generate", response_model=WorkoutResponse)
async def generate_workout(request: WorkoutGenerationRequest):
    try:
        # Check if user exists and is authorized
        user = None
        if request.auth0_id:
            user = users_collection.find_one({"auth0_id": request.auth0_id})
            # if user and not verify_authorized_email(user.get("email", "")):
            #     raise HTTPException(status_code=403, detail="Access denied. Email not authorized.")
        
        # Generate a unique workout ID
        workout_id = generate_workout_id()

        workout_session.call_agent_async()
        
        # # For now, let's create sample workouts based on type
        # workout_type = request.preferences.get("type", "cardio") if request.preferences else "cardio"
        
        # if workout_type == "cardio":
        #     workout = {
        #         "type": "time-based",
        #         "name": "Cardio Blast",
        #         "duration": "30 minutes",
        #         "description": "A high-intensity cardio workout to get your heart pumping.",
        #         "exercises": [
        #             {"name": "Jumping Jacks", "description": "Classic cardio exercise.", "duration": "2 minutes"},
        #             {"name": "High Knees", "description": "Run in place bringing knees to chest height.", "duration": "2 minutes"},
        #             {"name": "Mountain Climbers", "description": "Dynamic plank with alternating knee drives.", "duration": "1 minute"},
        #             {"name": "Burpees", "description": "Full-body exercise combining squat, plank, and jump.", "duration": "1 minute"},
        #             {"name": "Rest", "description": "Take a short break.", "duration": "1 minute"}
        #         ],
        #         "created_by": request.auth0_id if request.auth0_id else None
        #     }
        # else:
        #     workout = {
        #         "type": "rep-based",
        #         "name": "Strength Builder",
        #         "description": "A full-body strength workout targeting major muscle groups.",
        #         "exercises": [
        #             {"name": "Push-Ups", "description": "Upper body pressing exercise.", "reps": 15},
        #             {"name": "Squats", "description": "Lower body exercise focusing on quadriceps.", "reps": 20},
        #             {"name": "Dumbbell Rows", "description": "Upper back pulling exercise.", "reps": 12},
        #             {"name": "Lunges", "description": "Lower body exercise for quads and glutes.", "reps": 10},
        #             {"name": "Plank", "description": "Core stabilization exercise.", "duration": "30 seconds"}
        #         ],
        #         "created_by": request.auth0_id if request.auth0_id else None
        #     }
        
        # Prepare the workout document for MongoDB
        workout_doc = {
            "workout_id": workout_id,
            "workout": workout,
            "created_at": datetime.utcnow(),
        }
        
        # Store in MongoDB
        workouts_collection.insert_one(workout_doc)
        
        # Create the shareable URL (adjust the domain for production)
        share_url = f"http://localhost:5173/workout/{workout_id}"
        
        # Return the workout with its ID and share URL
        return {
            "workout_id": workout_id,
            "workout": workout,
            "share_url": share_url
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error generating workout: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error generating workout: {str(e)}")