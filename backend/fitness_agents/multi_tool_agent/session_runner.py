import os
import asyncio
from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm # For multi-model support
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts
import json, requests


from fitness_agents.multi_tool_agent import front_manager

import warnings
# Ignore all warnings
warnings.filterwarnings("ignore")

import logging
logging.basicConfig(level=logging.ERROR)
# @title Setup Session Service and Runner

# --- Session Management ---
# Key Concept: SessionService stores conversation history & state.
# InMemorySessionService is simple, non-persistent storage for this tutorial.
session_service = InMemorySessionService()

# Define constants for identifying the interaction context
APP_NAME = "my_app"
SESSION_ID = "session_001" # Using a fixed ID for simplicity

# Create the specific session where the conversation will happen


# --- Runner ---
# Key Concept: Runner orchestrates the agent execution loop.
def create_session_runner(user_id: str) -> Runner:
    """Creates a session runner for the agent."""
    print(f"Creating runner.")
    session = session_service.create_session(
        app_name=APP_NAME,
        user_id=user_id,
        session_id=SESSION_ID
    )
    print(f"Session created: App='{APP_NAME}', User='{user_id}', Session='{SESSION_ID}'")
    return Runner(
        agent=front_manager.create_front_agent(), # The agent we want to run
        app_name=APP_NAME,   # Associates runs with our app
        session_service=session_service # Uses our session manager
    )

# TODO: Should take in session_id as a parameter to ensure that only the session associated with the user is used.
async def call_agent_async(query: str, runner: Runner, user_id: str) -> str:
    """Sends a query to the agent and prints the final response."""

    # Prepare the user's message in ADK format
    content = types.Content(role='user', parts=[types.Part(text=query)])

    final_response_text = "Agent did not produce a final response." # Default

    # Key Concept: run_async executes the agent logic and yields Events.
    # We iterate through events to find the final answer.
    async for event in runner.run_async(user_id=user_id, session_id=SESSION_ID, new_message=content):
        # You can uncomment the line below to see *all* events during execution
        # print(f"  [Event] Author: {event.author}, Type: {type(event).__name__}, Final: {event.is_final_response()}, Content: {event.content}")
        # Key Concept: is_final_response() marks the concluding message for the turn.
        # print(event)    
        if event.content and event.content.parts[0].function_response:
            # Handle function response
            function_response = event.content.parts[0].function_response
            profile_json = function_response.response
            if function_response.name == "create_profile_json":
                # Make a POST request to update the fitness profile in a non-blocking way
                import threading
                def send_profile_update():
                    url = os.getenv("FRONTEND_URL", "http://localhost:8000") + "/users/update-fitness-profile"
                    headers = {"Content-Type": "application/json"}
                    
                    print(f"Function response received: {profile_json}")
                    print(f"Type of profile_json: {type(profile_json)}")
                    
                    try:
                        data = {
                            "auth0_id": user_id,
                            "profile_json": profile_json
                        }
                        print(f"Sending request to {url} with data: {json.dumps(data)}")
                        
                        # Set a timeout to prevent hanging
                        post_response = requests.post(url, headers=headers, json=data, timeout=5)
                        
                        print(f"Response status code: {post_response.status_code}")
                        print(f"Response content: {post_response.text}")
                        
                        if post_response.status_code == 200:
                            print("Profile updated successfully")
                        else:
                            print(f"Failed to update profile. Status code: {post_response.status_code}, Response: {post_response.text}")
                    except requests.exceptions.Timeout:
                        print("Request timed out - server might be slow or unavailable")
                    except requests.exceptions.ConnectionError:
                        print("Connection error - cannot connect to the server")
                    except Exception as e:
                        print(f"Exception during profile update request: {e}")
                        import traceback
                        traceback.print_exc()
                
                # Run the request in a separate thread to avoid blocking
                thread = threading.Thread(target=send_profile_update)
                thread.daemon = True  # Allow Python to exit even if thread is running
                thread.start()
                print("Profile update request started in background thread")
        
        if event.is_final_response():
            if event.content and event.content.parts:
                # Assuming text response in the first part
                final_response_text = event.content.parts[0].text
            elif event.actions and event.actions.escalate: # Handle potential errors/escalations
                final_response_text = f"Agent escalated: {event.error_message or 'No specific message.'}"
            # Add more checks here if needed (e.g., specific error codes)
            break # Stop processing events once the final response is found

    #print(f"<<< Agent Response: {final_response_text}")
    return final_response_text