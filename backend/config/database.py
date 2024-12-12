from config.settings import Settings
import motor.motor_asyncio

settings = Settings()

MONGO_URI = settings.MONGO_URI
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

db = client["Blog"]
