import Options from './components/options';
import Chatbox from './components/chatbox';
import Settings from './components/settings';
import { useEffect, useState } from 'react';

function App() {
  const [settings, toggleSettings] = useState<boolean>(false)

  async function off() {
    await fetch('http://localhost:1337/api/toggleWs/off', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }});
    await fetch('http://localhost:1337/api/toggleActive/off', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }});
  }

  useEffect(() => {
    if(settings) {
      off()
    }
  }, [settings])

  return (
    <div className='p-5 pt- h-[100vh]'>
      <div className='flex flex-row'>
        <button className='mb-2' onClick={() => toggleSettings(!settings)}>
          ⚙
        </button>
        <h1 className='text-white text-center w-full font-bold text-xl mb-2'>ValGPT</h1>
        <div className='opacity-0'>⚙</div>
      </div>
      {!settings &&       
        <div className='h-[85%]'>
          <Options/>
          <Chatbox/>
        </div>
      }
      {settings && <Settings/>}

    </div>
  )
}

export default App
