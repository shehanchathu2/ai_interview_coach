
import os

from dotenv import load_dotenv
from openai import OpenAI

# Step 1: Load environment variables
load_dotenv()

# Step 2: Get API key
api_key = os.getenv("OPENAI_API_KEY")

# Step 3: Check API key
if not api_key:
    raise ValueError("OpenAI API key not found!")

# Step 4: Create OpenAI client
client = OpenAI(api_key=api_key)

# Step 5: Send a test request
response = client.responses.create(
    model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
    instructions="You are a helpful AI interview coach.",
    input="Explain what a REST API is in simple words."
)

# Step 6: Display AI response
print("\nAI RESPONSE:")
print(response.output_text)
