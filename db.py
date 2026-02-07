#App Flask connect handler to Neon

from dotenv import load_dotenv
import os 
import psycopg

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is missing in .env")
    return psycopg.connect(DATABASE_URL, sslmode='require')