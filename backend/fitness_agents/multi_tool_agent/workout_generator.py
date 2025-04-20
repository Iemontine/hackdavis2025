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

front_agent = Agent(
    name="workout_generator",
    model=AGENT_MODEL, # Specifies the underlying LLM
    description="Takes a fitness profile in JSON string and generates a workout routine.", # Crucial for delegation later
    instruction="You are a workout generator. Your goal is to generate a workout routine based on the user's fitness profile. "
                "After the user answers all of these questions, You must call 'create_profile_json' with the user's answers and print out the returned results.",
    tools=[], # Make the tool available to this agent
)

print(f"Agent '{front_agent.name}' created using model '{AGENT_MODEL}'.")