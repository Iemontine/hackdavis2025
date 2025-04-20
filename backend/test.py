import requests
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_CONN_STRING = os.getenv("DB_CONN_STRING")
DB_NAME = os.getenv("DB_NAME")
print("MongoDB Connection String:", MONGO_CONN_STRING)
print("Database Name:", DB_NAME)

client = MongoClient(MONGO_CONN_STRING)
db = client[DB_NAME]
print("Collections:", db.list_collection_names())

url = "http://localhost:8000/users/google-oauth2|102013292606913480656"
headers = {"Content-Type": "application/json"}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    print("User data:", response.json())
else:
    print("Error:", response.status_code, response.json())