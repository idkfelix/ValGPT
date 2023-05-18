<div align="center">
  <body>
  <pre>
  ____   ____      .__    _____________________________
  \   \ /   /____  |  |  /  _____/\______   \__    ___/
   \   Y   /\__  \ |  | /   \  ___ |     ___/ |    |   
    \     /  / __ \|  |_\    \_\  \|    |     |    |   
     \___/  (____  /____/\______  /|____|     |____|   
 \/             \/    
  </pre>
  </body>
  <h3>AI Chatbot for Valorant Text Chat using OpenAI GPT-3.5 Turbo</h3>

  <img src="https://img.shields.io/badge/OpenAI-412991.svg?style=for-the-badge&logo=OpenAI&logoColor=white" alt="OpenAI Badge">
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python Badge">
  <img src="https://img.shields.io/badge/Valorant-FA4454.svg?style=for-the-badge&logo=Valorant&logoColor=white" alt="Valorant Badge">

</div>

## Features

- Automatic AI text response to any chat messages in Valorant game chat

## Requirements

- Python 3.6+
- PyPi

## Setup

1. Clone this repository to your local machine
2. Install the requirements.txt with pypi using the following command:

```
pip install --no-cache-dir -r requirements.txt
```

3. Create a `config.yaml` file in the root directory of the project, containing the following information:

```
openai_key: <your_key>
prompt: |
    you are a Valorant Player using in game chat.
    only use one short sentance responses.
    Act as a normal person who responds unprofessionally to conversation.
    Do not act as an AI, but as a person, make no referance to being a AI chat bot.
    Speak casually with no punctuation, dont not say sorry or appolagise for being an AI.
    Dont ask to clarify anything.
    Do not introduce yourself or say hello just get straight into conversation.
```
Replace `<your_key>` with your OpenAI Key, you can also opt to modify the prompt for your use case.

4. run the ValGPT.py file with python using the following command:

```
python ValGPT.py
```
