import { useState, useEffect } from 'react'
const localKey = "valGPT.config";
const dprompt = `You are a Valorant Player using in game chat.
Only use one short sentence responses.
Act as a normal person who responds unprofessionally to conversation.
Do not act as an AI, but as a person.
Speak casually with no punctuation, don't not say sorry for being an AI.
Don't ask to clarify anything.
Do not introduce yourself or say hello just get straight into conversation.
`

const Options = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [key, setKey] = useState<string>(() => {
    const storedKey = localStorage.getItem(`${localKey}.key`);
    return storedKey ?? "";
  });

  const [prompt, setPrompt] = useState<string>(() => {
    const storedPrompt = localStorage.getItem(`${localKey}.prompt`);
    return storedPrompt ?? dprompt;
  });

  const handleListenClick = async () => {
    if (!isListening) {
      await fetch('http://localhost:1337/api/toggleWs/on', {
        body: JSON.stringify({'key':key,'prompt':prompt}),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }});
      setIsListening(true)
    } else {
      await fetch('http://localhost:1337/api/toggleWs/off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }});
      setIsListening(false); 
    }
  };

  const handleActiveClick = async () => {
    if (!isActive) {
      await fetch('http://localhost:1337/api/toggleActive/on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }});
      setIsActive(true)
    } else {
      await fetch('http://localhost:1337/api/toggleActive/off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }});
      setIsActive(false); 
    }
  };

  const sendToggleOffRequests = async () => {
    if (isListening) {
      await handleListenClick();
    }
    if (isActive) {
      await handleActiveClick();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = async (event:any) => {
      event.preventDefault();
      event.returnValue = '';
      await sendToggleOffRequests();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isListening, isActive]);

  return (
    <div className='flex flex-row w-full mx-auto mb-5 gap-2'>
      <button onClick={handleListenClick} className=' bg-zinc-200 p-1 rounded-lg w-full font-semibold'>
        {isListening ? 'Stop Listener' : 'Start Listener'}
      </button>
      <button onClick={handleActiveClick} className='bg-zinc-200 p-1 rounded-lg w-full font-semibold'>
        {isActive ? 'Stop ValGPT' : 'Start ValGPT'}
      </button>
    </div>
  );
};

export default Options