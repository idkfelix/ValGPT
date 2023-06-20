import { useState, useEffect } from "react";

const localKey = "valGPT.config";

const dprompt = `You are a casual Valorant player chatting in-game, respond naturally without being too formal or professional. Avoid using punctuation, don't apologize for being an AI, and refrain from asking for clarification. Jump straight into the conversation without introductions or greetings. Make sure your responses are under 30 words, and feel free to add jokes whenever possible.`


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
