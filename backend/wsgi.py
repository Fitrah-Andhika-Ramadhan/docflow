import sys
import os
from pathlib import Path

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/docflow/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['MONGO_URL'] = 'mongodb+srv://docflow_db:main123@cluster0.bbuyo04.mongodb.net/?appName=Cluster0'
os.environ['DB_NAME'] = 'docflow_db'
os.environ['CORS_ORIGINS'] = '*'
os.environ['SECRET_KEY'] = 'your-secret-key-change-in-production-123456789'

# Import your FastAPI app
from server import app as application
