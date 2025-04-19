from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uvicorn
import json
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(
	title="Workout Health App API",
	description="Backend for an AI-powered workout health application",
	version="1.0.0"
)

# Enable CORS
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # In production, replace with specific origins
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# OAuth2 for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models for data validation
class User(BaseModel):
	username: str
	email: str
	full_name: Optional[str] = None

class UserProfile(BaseModel):
	height: float  # in cm
	weight: float  # in kg
	goals: List[str]  # e.g. ["weight loss", "strength"]
	experience_level: str  # e.g. "beginner", "intermediate", "advanced"
	available_equipment: List[str]

class WorkoutPlan(BaseModel):
	user_id: str
	workouts: List[Dict[str, Any]]
	schedule: List[Dict[str, Any]]
	created_at: datetime

class WorkoutSession(BaseModel):
	workout_id: str
	user_id: str
	exercises: List[Dict[str, Any]]
	start_time: Optional[datetime] = None
	end_time: Optional[datetime] = None
	feedback: Optional[str] = None

# Mock database (replace with actual database in production)
users_db = {}
profiles_db = {}
workout_plans_db = {}
workout_sessions_db = {}

# Authentication endpoints
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
	# Mock authentication - implement proper auth in production
	user = users_db.get(form_data.username)
	if not user:
		raise HTTPException(status_code=400, detail="Incorrect username or password")
	
	# Return token (implement JWT in production)
	return {"access_token": form_data.username, "token_type": "bearer"}

# User endpoints
@app.post("/users/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
	if user.username in users_db:
		raise HTTPException(status_code=400, detail="Username already registered")
	users_db[user.username] = user.dict()
	return user

@app.get("/users/me", response_model=User)
async def get_current_user(token: str = Depends(oauth2_scheme)):
	user = users_db.get(token)
	if not user:
		raise HTTPException(status_code=401, detail="Invalid authentication credentials")
	return user

# User profile endpoints
@app.post("/profiles/", response_model=UserProfile)
async def create_profile(profile: UserProfile, token: str = Depends(oauth2_scheme)):
	# Verify user exists
	if token not in users_db:
		raise HTTPException(status_code=401, detail="Invalid authentication credentials")
	
	# Store profile
	profiles_db[token] = profile.dict()
	return profile

@app.get("/profiles/me", response_model=UserProfile)
async def get_profile(token: str = Depends(oauth2_scheme)):
	profile = profiles_db.get(token)
	if not profile:
		raise HTTPException(status_code=404, detail="Profile not found")
	return profile

# Workout planning endpoints (AI Planner & Workout Planner)
@app.post("/workout-plans/", response_model=WorkoutPlan)
async def create_workout_plan(token: str = Depends(oauth2_scheme)):
	# Verify user exists and has profile
	if token not in users_db:
		raise HTTPException(status_code=401, detail="Invalid authentication credentials")
	if token not in profiles_db:
		raise HTTPException(status_code=400, detail="User profile required before generating workout plan")
	
	# Mock AI-generated workout plan
	profile = profiles_db[token]
	plan_id = f"plan_{len(workout_plans_db) + 1}"
	
	# This is where the AI workout planner would generate a customized plan
	# For now, using a placeholder
	plan = WorkoutPlan(
		user_id=token,
		workouts=[
			{
				"name": "Upper Body Strength",
				"exercises": ["Push-ups", "Pull-ups", "Shoulder Press"],
				"duration": 30  # minutes
			},
			{
				"name": "Lower Body Strength",
				"exercises": ["Squats", "Lunges", "Calf Raises"],
				"duration": 30
			}
		],
		schedule=[
			{"day": "Monday", "workout": "Upper Body Strength"},
			{"day": "Wednesday", "workout": "Lower Body Strength"},
			{"day": "Friday", "workout": "Upper Body Strength"}
		],
		created_at=datetime.now()
	)
	
	workout_plans_db[plan_id] = plan.dict()
	return plan

@app.get("/workout-plans/", response_model=List[WorkoutPlan])
async def get_workout_plans(token: str = Depends(oauth2_scheme)):
	# Filter plans for this user
	user_plans = [plan for plan_id, plan in workout_plans_db.items() if plan["user_id"] == token]
	return user_plans

# Workout coaching endpoints (Workout Coach)
@app.post("/workout-sessions/", response_model=WorkoutSession)
async def start_workout_session(workout_id: str, token: str = Depends(oauth2_scheme)):
	# Verify user exists
	if token not in users_db:
		raise HTTPException(status_code=401, detail="Invalid authentication credentials")
	
	# Create a new workout session
	session_id = f"session_{len(workout_sessions_db) + 1}"
	
	# Get workout details from plan
	workout_found = False
	exercises = []
	
	for plan_id, plan in workout_plans_db.items():
		for workout in plan["workouts"]:
			if workout["name"] == workout_id:
				exercises = [{"name": ex, "completed": False} for ex in workout["exercises"]]
				workout_found = True
				break
	
	if not workout_found:
		raise HTTPException(status_code=404, detail="Workout not found")
	
	session = WorkoutSession(
		workout_id=workout_id,
		user_id=token,
		exercises=exercises,
		start_time=datetime.now()
	)
	
	workout_sessions_db[session_id] = session.dict()
	return session

@app.put("/workout-sessions/{session_id}/exercise/{exercise_index}")
async def update_exercise_status(
	session_id: str, 
	exercise_index: int, 
	completed: bool,
	token: str = Depends(oauth2_scheme)
):
	# Verify session exists
	if session_id not in workout_sessions_db:
		raise HTTPException(status_code=404, detail="Session not found")
	
	session = workout_sessions_db[session_id]
	
	# Verify user owns this session
	if session["user_id"] != token:
		raise HTTPException(status_code=403, detail="Not authorized to access this session")
	
	# Update exercise completion status
	if exercise_index < 0 or exercise_index >= len(session["exercises"]):
		raise HTTPException(status_code=400, detail="Invalid exercise index")
	
	session["exercises"][exercise_index]["completed"] = completed
	workout_sessions_db[session_id] = session
	
	return {"message": "Exercise status updated"}

@app.put("/workout-sessions/{session_id}/complete")
async def complete_workout_session(
	session_id: str,
	feedback: Optional[str] = None,
	token: str = Depends(oauth2_scheme)
):
	# Verify session exists
	if session_id not in workout_sessions_db:
		raise HTTPException(status_code=404, detail="Session not found")
	
	session = workout_sessions_db[session_id]
	
	# Verify user owns this session
	if session["user_id"] != token:
		raise HTTPException(status_code=403, detail="Not authorized to access this session")
	
	# Complete the session
	session["end_time"] = datetime.now()
	if feedback:
		session["feedback"] = feedback
	
	workout_sessions_db[session_id] = session
	
	return {"message": "Workout session completed"}

# Run the application
if __name__ == "__main__":
	uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)