import { useState, useEffect } from 'react'
const localKey = "valGPT.config";
const dprompt = `You are a casual Valorant player chatting in-game, respond naturally without being too formal or professional. Avoid using punctuation, don't apologize for being an AI, and refrain from asking for clarification. Jump straight into the conversation without introductions or greetings. Make sure your responses are under 30 words, and feel free to add jokes whenever possible.`

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