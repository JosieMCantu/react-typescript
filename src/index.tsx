import * as esbuild from 'esbuild-wasm';
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';

const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const ref = useRef<any>();

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    };

    useEffect(() => {
        startService();
    }, []);

    const onClick = async () => {
        if (!ref.current) {
            return;
        }
        const result = await ref.current.transform(input, {
            loader: 'jsx',
            target: 'es2015'
        });
        setCode(result.code);
    };

    return <div>
        <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Push Me</button>
        </div>
        <pre>{code}</pre>
    </div>
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
