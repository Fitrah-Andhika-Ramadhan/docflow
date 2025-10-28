import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin_user():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'docflow_db')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    users_collection = db.users
    
    # Check if admin exists
    existing_admin = await users_collection.find_one({"username": "admin"})
    
    if existing_admin:
        print("✅ Admin user already exists")
        return
    
    # Create admin user
    admin_user = {
        "email": "admin@docflow.com",
        "username": "admin",
        "hashed_password": pwd_context.hash("admin123"),
        "created_at": None
    }
    
    await users_collection.insert_one(admin_user)
    print("✅ Admin user created successfully!")
    print("   Email: admin@docflow.com")
    print("   Username: admin")
    print("   Password: admin123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin_user())
