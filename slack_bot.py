import os
import slack_sdk
from dotenv import load_dotenv

#Load environment variables in .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# Instantiate Slack API Web Client
bot_token = os.environ["SLACK_API_TOKEN"]
client = slack_sdk.WebClient(token=bot_token)

# Provide the user and channel IDs
user_id = "U06HQP5JN1X"
# channel_id = "CHANNEL_ID"

# Set the message text
message = "Hello, this is from My Traffic Wizard on Render!"

# Send the private message
response = client.chat_postMessage(channel=user_id, text=message)

# Check if the message was sent successfully
if response["ok"]:
    print("Private message sent successfully!")
else:
    print("Failed to send private message:", response["error"])

