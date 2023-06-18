import { useState, useEffect, useRef } from 'react'

function Chatbox() {
  const [messages, setMessages] = useState<any[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:1337');
    ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages])

  const messageContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='h-full'>
      <div ref={messageContainerRef} className='flex flex-col gap-2 w-full h-full mx-auto bg-zinc-700 text-white rounded-2xl p-5 overflow-y-auto scrollbar-w-1 scrollbar-thumb-gray-500'>
        {messages.map((message: any) => (
          <div className='flex flex-row gap-3 bg-zinc-500 w-full p-1 rounded-lg'>
            <h1 className='font-semibold'>{message.user}</h1>
            <div className='flex-auto min-w-0'>
              <p className='break-words'>{message.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chatbox
