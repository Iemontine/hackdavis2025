import json
import os
import asyncio
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts

import warnings
# Ignore all warnings
warnings.filterwarnings("ignore")

import logging
logging.basicConfig(level=logging.ERROR)

load_dotenv()

# @title Define the Weather Agent
# Use one of the model constants defined earlier
AGENT_MODEL = "gemini-2.0-flash" # Starting with a powerful Gemini model

def format_exercises(list_of_exercises: list[str]):
    """Converts string array of exercises to JSON format."""
    exercises = { 
        "exercises": list_of_exercises
    }
    print(exercises)
    return exercises


def create_workout_agent():
    """Returns the front agent."""
    print(f"Front manager created using model '{AGENT_MODEL}'.")
    return Agent(
        name="workout_generator",
        model=AGENT_MODEL, # Specifies the underlying LLM
        description="Takes a fitness profile in JSON string and generates a workout routine.", # Crucial for delegation later
        instruction="You are a workout generator. Your goal is to generate a workout routine based on the user's fitness profile data which is in JSON string format."
                    "You will receive a JSON string with the user's height, weight, fitness level, workout time, and goal."
                    "IMPORTANT: Generate a list of at least 5 exercises that are suitable for the user's fitness level and goal.",
        output_schema=Exercises,  # Specify the output schema for validation
        output_key="workout_exercises",
        tools=[],
    )

from pydantic import BaseModel, Field

class Exercises(BaseModel):
    """Pydantic model for the output of the function."""
    name: list[str] = Field(..., description="Name of the exercise")
    description: list[str] = Field(..., description="Description of the exercise")
    duration: list[int] = Field(..., description="Duration of the exercise in seconds")
    type: list[str] = Field(..., description="Type of the exercise. Can only be TIME BASED or REPETITION BASED.")

# workout_agent = Agent(
#     name="workout_generator",
#     model=AGENT_MODEL, # Specifies the underlying LLM
#     description="Takes a fitness profile in JSON string and generates a workout routine.", # Crucial for delegation later
#     instruction="You are a workout generator. Your goal is to generate a workout routine based on the user's fitness profile data which is in JSON string format."
#                 "You will receive a JSON string with the user's height, weight, fitness level, workout time, and goal."
#                 "IMPORTANT: Generate a list of at least 5 exercises that are suitable for the user's fitness level and goal.",
#     output_schema=Exercises,  # Specify the output schema for validation
#     output_key="workout_exercises",
#     tools=[],
#     # tools=[format_exercises], # Make the tool available to this agent
# )

# print(f"Agent '{workout_agent.name}' created using model '{AGENT_MODEL}'.")