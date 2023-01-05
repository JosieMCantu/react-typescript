import * as esbuild from 'esbuild-wasm';
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

function App(): JSX.Element {
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
        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin()]
        });
        setCode(result.outputFiles[0].text);
    };

    const css = `
    textarea {
        height: 300px;
        width: 400px;
        background-color: pink;
    }`

    return <div>
        <style>{css}</style>
        <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
        <div>
            <button onClick={onClick}>Push Me</button>
        </div>
        <pre>{code}</pre>
    </div>;
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
