# @title Define the Weather Agent
# Use one of the model constants defined earlier
AGENT_MODEL = gemini-2.0-flash # Starting with a powerful Gemini model

Front_agent = Agent(
    name="Front_Manager",
    model=AGENT_MODEL, # Specifies the underlying LLM
    description="Interacts with the user and identifies their needs", # Crucial for delegation later
    #TODO: Replace with instructions to identify fitness goals and redirect to specific agents
    instruction="You are a helpful weather assistant. Your primary goal is to provide current weather reports. "
                "When the user asks for the weather in a specific city, "
                "you MUST use the 'get_weather' tool to find the information. "
                "Analyze the tool's response: if the status is 'error', inform the user politely about the error message. "
                "If the status is 'success', present the weather 'report' clearly and concisely to the user. "
                "Only use the tool when a city is mentioned for a weather request.",
    tools=[get_weather], # Make the tool available to this agent
)

print(f"Agent '{weather_agent.name}' created using model '{AGENT_MODEL}'.")