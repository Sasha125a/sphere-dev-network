import React, { useState, useRef, useEffect } from 'react';
import './VirtualTerminal.css';

const VirtualTerminal = ({ projectId, onClose }) => {
    const [commands, setCommands] = useState([]);
    const [input, setInput] = useState('');
    const terminalRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [commands]);

    const executeCommand = async (cmd) => {
        const commandId = Date.now();
        setCommands(prev => [...prev, { id: commandId, type: 'input', text: `$ ${cmd}` }]);

        try {
            const response = await fetch('/api/terminal/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, command: cmd })
            });

            const result = await response.json();
            setCommands(prev => [...prev, { 
                id: commandId + 1, 
                type: 'output', 
                text: result.output 
            }]);
        } catch (error) {
            setCommands(prev => [...prev, { 
                id: commandId + 1, 
                type: 'error', 
                text: `Error: ${error.message}` 
            }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            executeCommand(input.trim());
            setInput('');
        }
    };

    const predefinedCommands = [
        { name: 'ls', desc: 'List files' },
        { name: 'cd', desc: 'Change directory' },
        { name: 'git status', desc: 'Check Git status' },
        { name: 'npm install', desc: 'Install dependencies' },
        { name: 'deploy', desc: 'Deploy project' }
    ];

    return (
        <div className="terminal-modal">
            <div className="terminal-header">
                <h3>Virtual Terminal - Project {projectId}</h3>
                <button onClick={onClose}>×</button>
            </div>
            
            <div className="terminal-toolbar">
                {predefinedCommands.map(cmd => (
                    <button 
                        key={cmd.name}
                        onClick={() => executeCommand(cmd.name)}
                        className="terminal-cmd-btn"
                    >
                        {cmd.name}
                    </button>
                ))}
            </div>

            <div ref={terminalRef} className="terminal-output">
                {commands.map(cmd => (
                    <div key={cmd.id} className={`terminal-line ${cmd.type}`}>
                        {cmd.text}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="terminal-input-form">
                <span className="prompt">$</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command..."
                    autoFocus
                />
            </form>
        </div>
    );
};

export default VirtualTerminal;