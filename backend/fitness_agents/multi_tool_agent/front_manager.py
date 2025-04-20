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

def create_profile_json(height: str, weight: str, fitness_level: str, workout_time: str, goal: str) -> str:
    """Creates a fitness profile in JSON format."""
    profile = {
        "height": height,
        "weight": weight,
        "fitness_level": fitness_level,
        "workout_time": workout_time,
        "goal": goal
    }
    return str(profile).replace("'", '"')  # Convert to JSON string

def close_session(session):
    """Closes the session."""
    try:
        session.close()
    except Exception as e:
        print(f"Error closing session: {e}")

front_agent = Agent(
    name="Front_Manager",
    model=AGENT_MODEL, # Specifies the underlying LLM
    description="Interacts with the user and identifies their needs", # Crucial for delegation later
    instruction="You are a helpful fitness assistant. Your primary goal is to identify the user's fitness needs and goals. "
                "Ask your questions one by one. Do not ask all questions at once. Ensure you have an answer before proceeding to the next question. "
                "Ask the user their current height and weight."
                "Ask the user's fitness level. Prompt to identify as beginner, intermediate, or advanced."
                "Ask the user what is their comfotable length of time to work out each session."
                "Ask the user what is their goal. Prompt to identify as weight loss, muscle gain, or cardiovascular improvements."
                "After the user answers all of these questions, You must call 'create_profile_json' with the user's answers and print out the returned results.",
    tools=[create_profile_json], # Make the tool available to this agent
)

print(f"Agent '{front_agent.name}' created using model '{AGENT_MODEL}'.")