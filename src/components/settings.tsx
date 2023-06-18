import { useState, useEffect } from "react";

const localKey = "valGPT.config";

const dprompt = `You are a Valorant Player using in game chat.
Only use one short sentence responses.
Act as a normal person who responds unprofessionally to conversation.
Do not act as an AI, but as a person.
Speak casually with no punctuation, don't not say sorry for being an AI.
Don't ask to clarify anything.
Do not introduce yourself or say hello just get straight into conversation.
`

const Settings = () => {
  const [key, setKey] = useState<string>(() => {
    const storedKey = localStorage.getItem(`${localKey}.key`);
    return storedKey ?? "";
  });

  const [prompt, setPrompt] = useState<string>(() => {
    const storedPrompt = localStorage.getItem(`${localKey}.prompt`);
    return storedPrompt ?? dprompt;
  });

  function handleKeyChange(e: any) {
    setKey(e.target.value);
  }

  function handlePromptChange(e: any) {
    setPrompt(e.target.value);
  }

  useEffect(() => {
    localStorage.setItem(`${localKey}.key`, key);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(`${localKey}.prompt`, prompt);
  }, [prompt]);

  return (
    <div className="flex flex-col w-full gap-2 text-white">
      <label className="font-semibold" >OpenAI API Key</label>
      <input
        className="p-2 rounded-xl bg-zinc-700"
        type="text"
        onChange={handleKeyChange}
        value={key}
        placeholder="OpenAI API Key"
      />
      <a className="text-sm text-gray-500" href="https://platform.openai.com/account/api-keys" target="_blank">Get an API key here</a>
      <label className="font-semibold">ValGPT Prompt</label>
      <textarea className="h-[380px] p-2 rounded-xl bg-zinc-700" onChange={handlePromptChange} value={prompt}/>
      <a className="text-sm text-gray-500" onClick={() => setPrompt(dprompt)}>Reset</a>
    </div>
  );
};

export default Settings;
