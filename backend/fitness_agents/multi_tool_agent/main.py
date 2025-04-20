import asyncio
import front_manager
import session_runner
from google.adk.sessions import Session

async def main():
    # Simple interactive loop
    print("front manager is ready! Type 'exit' to quit.")
    greeting = await session_runner.call_agent_async("Hi! Help me with my fitness.")
    print(f"\nfront manager: {greeting}")
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "exit":
            break
        
        response = await session_runner.call_agent_async(user_input)
        print(f"\nfront manager: {response}")
if __name__ == "__main__":
    asyncio.run(main())