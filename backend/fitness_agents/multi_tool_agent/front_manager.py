import os
import asyncio
from dotenv import load_dotenv
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts
import requests
import json

import warnings
# Ignore all warnings
warnings.filterwarnings("ignore")

import logging
logging.basicConfig(level=logging.ERROR)

load_dotenv() 

# @title Define the Weather Agent
# Use one of the model constants defined earlier
AGENT_MODEL = "gemini-2.0-flash" # Starting with a powerful Gemini model

def create_profile_json(height: str, weight: str, age: int, fitness_level: str, workout_time: str, goal: str, preferences: str, tailoring: str) -> dict:
    """
    Creates a JSON structure containing user fitness profile data.
    Returns a dictionary that can be serialized to JSON.
    """
    return {
        "height": height,
        "weight": weight,
        "age": age,
        "fitness_level": fitness_level,
        "workout_time": workout_time,
        "goal": goal,
        "preferences": preferences,
        "tailoring": tailoring,
    }

def close_session(session):
    """Closes the session."""
    try:
        session.close()
    except Exception as e:
        print(f"Error closing session: {e}")

def create_front_agent():
    """Returns the front agent."""
    print(f"Front manager created using model '{AGENT_MODEL}'.")
    return Agent(
        name="Front_Manager",
        model=AGENT_MODEL, # Specifies the underlying LLM
        description="Interacts with the user and identifies their needs", # Crucial for delegation later
        instruction="You are a kind and gentle, excited fitness coach and wellness assistant. Your primary goal is to identify the user's fitness needs and goals. "
                    "Ask your questions one by one. Do not ask all questions at once. Ensure you have a good answer before proceeding to the next question. "
                    "Make sure to ask for clarification if the answer is not clear. "
                    "Ask the user their current height, weight, and age."
                    "Ask the user's fitness level. Prompt to identify as beginner, intermediate, or advanced."
                    "Ask the user what is their comfortable length of time to work out each session or day."
                    "Ask the user what is their goal. Prompt to identify as 'weight loss, muscle gain, endurance training, or anything else!."
                    "Also ask if they have any specific preferences or restrictions specifically with regards to equipment available, dietary restrictions, types of workout."
                    "At this point in the conversation, you should have a good idea of the user's fitness level and goals. "
                    "You MUST then engage in a nice, simple behavioral conversation with the user to get a better understanding of them." 
                    "As a health coach, you should ask about their motivations, challenges, and any other relevant information."
                    "This is important to tailor the program to their needs. "
                    "The preferences and tailoring parameters may be full descriptive blocks of texts. "
                    "Once you have everything, make sure, sign off with the user, and THEN call 'create_profile_json' with the user's answers to upload the profile to the database.",
        tools=[create_profile_json], # Make the tool available to this agent
    )