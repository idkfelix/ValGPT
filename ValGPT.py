import os
import json
import ssl
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

default_prompt = """Use mostly short sentences unless a longer response is expencted.
    Act as a normal person who responds unprofessionally to conversation.
    Do not act as an assistant, but as a person.
    Speak casually with no punctuation. \n\n 
    """

if not os.path.exists("config.yaml"):
    default_config = f"openai_key:\nhost_username:\nprompt: | \n    {default_prompt}"
    with open("config.yml", "w") as f:
                f.write(default_config)
    print("Fill out the config.yml file \n")
    input("Press Enter to continue...")
    exit()
else:
    with open("config.yaml", 'r') as f:
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
except OSError:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")

def GetResponse(message):
    token = config["openai_key"]
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
    }
    body = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "assistant", "content": ""},{"role": "user", "content": message}],
        "max_tokens": 40,
        "stop": "."
    }
    response = requests.request("POST", url, json=body, headers=headers, verify=False)
    return response.json()["choices"][0]["message"]["content"] 

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

        while True:
            response = await websocket.recv()
            if len(response) > 0 and json.loads(response)[2]['uri'] == "/chat/v6/messages" and json.loads(response)[2]["data"]["messages"][0]["game_name"] != config["host_username"]:
                cmsgid = json.loads(response)[2]["data"]["messages"][0]["id"]

                if cmsgid in msgids:
                    continue
                else:
                    msg = json.loads(response)[2]["data"]["messages"][0]
                    name = msg["game_name"]
                    body = msg["body"]
                    cid = msg["cid"]
                    print(f"{name}: {body}")
                    GPTmsg = GetResponse(config["prompt"] + body)
                    SendMessage(cid,GPTmsg)
                    print(f"ValGPT: {GPTmsg}")
                msgids.append(cmsgid)

try:
    asyncio.get_event_loop().run_until_complete(ws())
except websockets.exceptions.ConnectionClosedError:
     print("Make Sure Valorant Is running \n")
     input("Press Enter to continue...")