import asyncio
from telethon import TelegramClient, events
import subprocess
import pymysql.cursors
import re
import os
from subprocess import PIPE
from dotenv import load_dotenv
load_dotenv()
user = os.getenv("DATABASE_USER")
pw =os.getenv("DATABASE_PASSWORD")
def find_solana_addresses(text):
    pattern = r'\b(?:[1-9A-HJ-NP-Za-km-z]{44})\b'
    solana_addresses = re.findall(pattern, text)
    return solana_addresses

def scrape_addresses(text):
    # Regular expression pattern to match addresses
    address_pattern = r'\b[A-Za-z0-9]{44}\b'  # Assuming addresses are 44 characters alphanumeric

    # Find all occurrences of addresses in the text
    addresses = re.findall(address_pattern, text)
    if addresses==[]:
        print("lol")
        find_solana_addresses(text)
    return addresses
# Function to call an external command

async def call_message(user_id, code,codename, channel_name):
    print(channel_name)
    command = ['node', './src/python/showtoken.js', user_id, code, codename,channel_name]
    process = await asyncio.create_subprocess_exec(*command, stdout=PIPE, stderr=PIPE)
    stdout, stderr = await process.communicate()
    if stderr:
        print(f"Error occurred: {stderr.decode()}")
    return stdout.decode().strip()

# Initialize the Telegram client
client = TelegramClient('YOUR_SESSION_NAME', '21245473', 'bcb877d46ff6ae1bec2a45667d46efa6')

# Database connection parameters
mydb_config = {
    'host': "localhost",
    'user': user,
    'password': pw,
    'database': 'tonksniper_bot',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Function to find a channel ID by its name
def find_channel_id(channel_name, cursor):
    print(channel_name)
    cursor.execute("SELECT id FROM channels WHERE name = %s", (channel_name,))
    result = cursor.fetchone()
    return result['id'] if result else None  # Note the change to dict access

# Function to fetch all users linked to a channel by name
def fetch_users_linked_to_channel(channel_name, cursor):
    channel_id = find_channel_id(channel_name, cursor)
    
    if channel_id:
        cursor.execute("SELECT user_id FROM user_channel WHERE channel_id = %s", (channel_id,))
        return [user['user_id'] for user in cursor.fetchall()] 
     # Change to dict access
    return []

# Async function to process new messages
async def process_new_message(event):
    # Create a new database connection inside the async function
    connection = pymysql.connect(**mydb_config)
    print(event.message.text)
    try:
        cursor = connection.cursor()
        channel_name = await event.get_chat()
        channel_title = channel_name.title if hasattr(channel_name, 'title') else "Private Chat"
        user_ids = fetch_users_linked_to_channel(channel_title, cursor)
        for user_id in user_ids:
            print(user_id)
            addresse = scrape_addresses(event.message.text)
            
            for address in addresse:
                print(address)
                # Call the message asynchronously
                print(channel_name)
                result = await call_message(user_id, address,channel_name.username, channel_title)
                print(result)
    finally:
        cursor.close()
        connection.close()

# Main async function
async def main():
    async with client:
        await client.start()

        # Register the event handler for new messages
        @client.on(events.NewMessage)
        async def new_message_listener(event):
            await process_new_message(event)

        print("Listening for new messages...")
        await client.run_until_disconnected()

# Run the client
if __name__ == '__main__':
    asyncio.run(main())
