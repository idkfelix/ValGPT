# Standard library imports
from os import path, getenv, system
from base64 import b64encode
from json import loads as jsonLoads
from ssl import SSLContext, PROTOCOL_TLS_CLIENT, CERT_NONE
from asyncio import get_event_loop as async_get_event_loop
from re import sub as resub

# Third-party library imports
from requests import request
from websockets import connect, exceptions
import openai
from yaml import safe_load
from urllib3 import disable_warnings, exceptions
from threading import Thread


# Disable unsecure request warnings and clear console
disable_warnings(exceptions.InsecureRequestWarning)
system('cls')

# Print banner
print("""
____   ____      .__    _____________________________
\   \ /   /____  |  |  /  _____/\______   \__    ___/
 \   Y   /\__  \ |  | /   \  ___ |     ___/ |    |   
  \     /  / __ \|  |_\    \_\  \|    |     |    |   
   \___/  (____  /____/\______  /|____|     |____|   
               \/             \/                     
""")

# Define default prompt for config
default_prompt = """you are a chat bot for a Valorant in game chat.
    Use mostly short sentences unless a longer response is expencted.
    Act as a normal person who responds unprofessionally to conversation.
    Do not act as an AI, but as a person, make no referance to being a AI chat bot.
    Speak casually with no punctuation, dont be appolagetic. \n\n 
    """

# If config dosent exist create it, else load it
if not path.exists("config.yml"):
    default_config = f"openai_key: \nprompt: | \n    {default_prompt}"
    with open("config.yml", "w") as f:
                f.write(default_config)
    print("Fill out the config.yml file \n")
    input("Press Enter to continue...")
    exit()
else:
    with open("config.yml", 'r') as f:
            config = safe_load(f)

# Get values from Valorant lockfile
def getlockData():
    lockfilePath = path.join(getenv("LOCALAPPDATA")+"\Riot Games\Riot Client\Config\lockfile")
    with open(lockfilePath, 'r') as f:
        contents = f.read()
    d = {}
    d['name'], d['pid'], d['port'], d['password'], d['protocol'] = contents.strip().split(':')
    return d

# Catch error if valorant isnt running
try:
    lockfile = getlockData()
except Exception:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")

# Get Player username
def GetUsername():
    url = f"https://127.0.0.1:{lockfile['port']}/player-account/aliases/v1/active"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic " + b64encode(('riot:' + lockfile['password']).encode()).decode()
    }

    response = request("GET", url, headers=headers, verify=False)
    l = jsonLoads(response.text)
    return l["game_name"]

# Catch Valorant not running error
try:
    username = GetUsername()
except Exception:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")

# Define Valorant send message function
def SendMessage(cid, msg):
    url = f"https://127.0.0.1:{lockfile['port']}/chat/v6/messages/"
    body = {
        "cid": cid,
        "message": msg,
        "type": "groupchat"
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic " + b64encode(('riot:' + lockfile['password']).encode()).decode()
    }

    request("POST", url, json=body, headers=headers, verify=False)

# Define OpenAI completion function
def GetResponse(messages):
    openai.api_key = config["openai_key"]
    completions = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    # logging.INFO(completions)
    return completions.choices[0].message.content

# Config for websocket
ssl_context = SSLContext(PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = CERT_NONE

local_headers = {}
local_headers['Authorization'] = 'Basic ' + b64encode(('riot:' + lockfile['password']).encode()).decode()
url = f"wss://127.0.0.1:{lockfile['port']}"

# Create websocket function
async def ws():
    async with connect(url, ssl=ssl_context, extra_headers=local_headers) as websocket:
        await websocket.send("[5, \"OnJsonApiEvent\"]")

        msgids = []
        messages = [
            {"role": "system", "content": config["prompt"]},
            {"role": "assistant", "name":username, "content": "whats up?"},
            ]

        # Listen for messages from websocket
        while True:
            response = await websocket.recv()

            if len(response) > 0 and jsonLoads(response)[2]['uri'] == "/chat/v6/messages":
                cmsgid = jsonLoads(response)[2]["data"]["messages"][0]["id"]
                msg = jsonLoads(response)[2]["data"]["messages"][0]
                unfixedName = msg["game_name"]
                name = resub(r'[^a-zA-Z0-9_-]', '_', unfixedName)
                body = msg["body"]
                cid = msg["cid"]
                if cmsgid in msgids:
                    continue
                else:
                    messages.append({"role":"user","name":name,"content":body})
                    print(f"{name}: {body} \n")

                    if  name != username:
                        try:
                            GPTmsg = GetResponse(messages)
                            SendMessage(cid, GPTmsg)
                        except Exception:
                            continue
                msgids.append(cmsgid)

try:
    async_get_event_loop().run_until_complete(ws())
except exceptions.ConnectionClosedError:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")