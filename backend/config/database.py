from config.settings import settings
from motor.motor_asyncio import AsyncIOMotorClient

# Initialize MongoDB client
client = AsyncIOMotorClient(settings.MONGO_URI)

# Select the database and collection
database = client["Blog"]
db = database["user"]
