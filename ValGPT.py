import os
import json
import ssl
import openai
import asyncio
import requests
import websockets
from yaml import safe_load
from base64 import b64encode
from urllib3 import disable_warnings, exceptions
disable_warnings(exceptions.InsecureRequestWarning)

os.system('cls')

print("""
____   ____      .__    _____________________________
\   \ /   /____  |  |  /  _____/\______   \__    ___/
 \   Y   /\__  \ |  | /   \  ___ |     ___/ |    |   
  \     /  / __ \|  |_\    \_\  \|    |     |    |   
   \___/  (____  /____/\______  /|____|     |____|   
               \/             \/                     
""")

default_prompt = """you are a chat bot for a Valorant in game chat.
    Use mostly short sentences unless a longer response is expencted.
    Act as a normal person who responds unprofessionally to conversation.
    Do not act as an AI, but as a person, make no referance to being a AI chat bot.
    Speak casually with no punctuation, dont be appolagetic. \n\n 
    """

if not os.path.exists("config.yml"):
    default_config = f"openai_key: \nprompt: | \n    {default_prompt}"
    with open("config.yml", "w") as f:
                f.write(default_config)
    print("Fill out the config.yml file \n")
    input("Press Enter to continue...")
    exit()
else:
    with open("config.yml", 'r') as f:
            config = safe_load(f)

def getlockData():
    lockfilePath = os.path.join(os.getenv("LOCALAPPDATA")+"\Riot Games\Riot Client\Config\lockfile")
    with open(lockfilePath, 'r') as f:
        contents = f.read()
    d = {}
    d['name'], d['pid'], d['port'], d['password'], d['protocol'] = contents.strip().split(':')
    return d

try:
    lockfile = getlockData()
except Exception:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")

def GetUsername():
    url = f"https://127.0.0.1:{lockfile['port']}/player-account/aliases/v1/active"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic " + b64encode(('riot:' + lockfile['password']).encode()).decode()
    }

    response = requests.request("GET", url, headers=headers, verify=False)
    l = json.loads(response.text)
    return l["game_name"]

try:
    username = GetUsername()
except Exception:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")


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

    requests.request("POST", url, json=body, headers=headers, verify=False)

def GetResponse(messages):
    openai.api_key = config["openai_key"]
    completions = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    for x in range(5):
        try:
            completions.choices[0].message.content
            break
        except:
            continue
    return completions.choices[0].message.content

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

local_headers = {}
local_headers['Authorization'] = 'Basic ' + b64encode(('riot:' + lockfile['password']).encode()).decode()
url = f"wss://127.0.0.1:{lockfile['port']}"

async def ws():
    async with websockets.connect(url, ssl=ssl_context, extra_headers=local_headers) as websocket:
        await websocket.send("[5, \"OnJsonApiEvent\"]")

        msgids = []
        messages = [
            {"role": "system", "content": config["prompt"]},
            {"role": "assistant", "name":username, "content": "whats up?"},
            ]

        while True:
            response = await websocket.recv()

            if len(response) > 0 and json.loads(response)[2]['uri'] == "/chat/v6/messages":
                cmsgid = json.loads(response)[2]["data"]["messages"][0]["id"]
                msg = json.loads(response)[2]["data"]["messages"][0]
                name = msg["game_name"]
                body = msg["body"]
                cid = msg["cid"]
                if cmsgid in msgids:
                    continue
                else:
                    messages.append({"role":"user","name":name,"content":body})
                    # print(messages)

                    if  name != username:
                        print(f"{name}: {body}")
                        
                        try:
                            GPTmsg = GetResponse(messages)
                            SendMessage(cid,GPTmsg)
                            print(username+f": {GPTmsg}")
                        except Exception:
                            continue
                msgids.append(cmsgid)

try:
    asyncio.get_event_loop().run_until_complete(ws())
except websockets.exceptions.ConnectionClosedError:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")