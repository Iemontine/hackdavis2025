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

def create_profile_json(height: str, weight: str, age:int, fitness_level: str, workout_time: str, preferences:str,  goal: str) -> str:
    """Creates a fitness profile in JSON format."""
    profile = {
        "height": height,
        "weight": weight,
        "age": 0,
        "fitness_level": fitness_level,
        "workout_time": workout_time,
        "preferences,": preferences, 
        "goal": goal
    }
    return str(profile).replace("'", '"')  # Convert to JSON string

front_agent = Agent(
    name="Front_Manager",
    model=AGENT_MODEL, # Specifies the underlying LLM
    description="Interacts with the user and identifies their needs", # Crucial for delegation later
    instruction="You are a helpful fitness assistant. Your primary goal is to identify the user's fitness needs and goals. "
                "Ask your questions one by one. Do not ask all questions at once. Ensure you have an answer before proceeding to the next question. "
                "Make sure the user provides a clear answer, with units if applicable, and make sure to ask for clarification if the answer is not clear. "
                "Ask the user their current height, weight, and age."
                "Ask the user's fitness level. Prompt to identify as beginner, intermediate, or advanced."
                "Ask the user what is their comfotable length of time to work out each session."
                "Ask the user what is their goal. Prompt to identify as weight loss, muscle gain, or cardiovascular improvements."
                "Also ask if they have any specific preferences or restrictions specifically with regards to equipment available, dietary restrictions."
                "After the user answers all of these questions, please call 'create_profile_json' with the user's answers to upload the profile to the database.",
    tools=[create_profile_json], # Make the tool available to this agent
)

print(f"Agent '{front_agent.name}' created using model '{AGENT_MODEL}'.")