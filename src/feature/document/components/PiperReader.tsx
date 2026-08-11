import { useState } from 'react';
import { usePiper } from '../hooks/usePiper';

export default function PiperReader() {
  const [text, setText] = useState('');
  const { ready, synthesize } = usePiper();
  const speak = async () => {
    const wav = await synthesize(text);
    const audio = new Audio(URL.createObjectURL(wav));
    await audio.play();
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={10}
      />

      <button
        onClick={speak}
        disabled={!ready}
      >
        Read
      </button>
    </div>
  );
}