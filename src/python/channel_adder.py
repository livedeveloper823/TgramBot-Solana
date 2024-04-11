import asyncio
from telethon import TelegramClient
import pymysql.cursors
import os
from dotenv import load_dotenv
load_dotenv()
user = os.getenv("DATABASE_USER")
pw =os.getenv("DATABASE_PASSWORD")
# Function to establish database connection
def db_connect():
    return pymysql.connect(host='localhost',
                           user=user,
                           password=pw,
                           database='tonksniper_bot',
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)

async def main():
    # Set up Telegram client
    async with TelegramClient('session_name', '21245473', 'bcb877d46ff6ae1bec2a45667d46efa6') as client:
        while True:
            link=input("link:")
            channel = await client.get_entity(link)
            
            # Output channel details
            print(f"Title: {channel.title}")
            print(f"Username: {channel.username}")
            
            # Connect to the database
            connection = db_connect()
            try:
                with connection.cursor() as cursor:
                    # Insert channel details into the database
                    sql = "INSERT INTO `channels` (`name`, `codename`) VALUES (%s, %s)"
                    cursor.execute(sql, (channel.title, channel.username))
                    connection.commit()
            except pymysql.Error as e:  # Use pymysql.Error for exception handling
                print(f"Database error: {e}")
            finally:
                # Close the database connection
                connection.close()

# Run the async main function
asyncio.run(main())
