import React, { useState, useRef, useEffect } from 'react';
import './TerminalScreen.css';

const TerminalScreen = ({ onNavigate }) => {
    const [commands, setCommands] = useState([]);
    const [input, setInput] = useState('');
    const [currentProject, setCurrentProject] = useState(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        // Получаем проекты из localStorage
        const savedProjects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
        
        if (savedProjects.length > 0) {
            setCurrentProject(savedProjects[0]);
        }

        // Добавляем приветственное сообщение
        setCommands([{
            id: Date.now(),
            type: 'output',
            text: '🌐 Welcome to SphereDev Terminal\nType "help" for available commands'
        }]);
    }, []);

    useEffect(() => {
        // Автопрокрутка к нижней части терминала
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [commands]);

    const executeCommand = async (cmd) => {
        const commandId = Date.now();
        setCommands(prev => [...prev, { 
            id: commandId, 
            type: 'input', 
            text: `$ ${cmd}` 
        }]);

        // Симуляция выполнения команд
        await new Promise(resolve => setTimeout(resolve, 500));

        let output = '';
        
        switch (cmd.toLowerCase()) {
            case 'help':
                output = `Available commands:
help - Show this help message
projects - List all projects
status - Show project status
deploy - Deploy current project
install - Install dependencies
build - Build project
test - Run tests
clear - Clear terminal
`;
                break;
                
            case 'projects':
                const projects = JSON.parse(localStorage.getItem('sphereDevProjects') || '[]');
                output = projects.length > 0 
                    ? projects.map(p => `📁 ${p.name} (${p.type}) - ${p.status || 'active'}`).join('\n')
                    : 'No projects found. Create one first!';
                break;
                
            case 'status':
                output = currentProject 
                    ? `Project: ${currentProject.name}
Type: ${currentProject.type}
Status: ${currentProject.status || 'active'}
Domain: ${currentProject.domain || 'auto'}.spheredev
Created: ${new Date(currentProject.createdAt).toLocaleDateString()}`
                    : 'No project selected';
                break;
                
            case 'deploy':
                output = currentProject 
                    ? `🚀 Deploying ${currentProject.name}...
✅ Build completed
✅ Tests passed
✅ Uploading to virtual server...
🌍 Deployment successful!
📦 Project deployed to: ${currentProject.domain || currentProject.name}.spheredev`
                    : 'No project to deploy';
                break;
                
            case 'install':
                output = currentProject 
                    ? `📦 Installing dependencies for ${currentProject.name}...
✅ Dependencies installed successfully`
                    : 'No project selected';
                break;
                
            case 'build':
                output = currentProject 
                    ? `🔨 Building ${currentProject.name}...
✅ Build completed successfully`
                    : 'No project selected';
                break;
                
            case 'test':
                output = currentProject 
                    ? `🧪 Running tests for ${currentProject.name}...
✅ All tests passed (15/15)`
                    : 'No project selected';
                break;
                
            case 'clear':
                setCommands([]);
                return;
                
            case 'ls':
                output = `📁 Project Structure:
├── src/
│   ├── index.js
│   ├── components/
│   └── styles/
├── public/
├── package.json
└── README.md`;
                break;
                
            case 'pwd':
                output = currentProject 
                    ? `/home/spheredev/projects/${currentProject.name}`
                    : '/home/spheredev';
                break;
                
            default:
                output = `Command not found: ${cmd}\nType "help" for available commands`;
        }

        setCommands(prev => [...prev, { 
            id: commandId + 1, 
            type: 'output', 
            text: output 
        }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            executeCommand(input.trim());
            setInput('');
        }
    };

    const predefinedCommands = [
        { cmd: 'projects', desc: 'List all projects' },
        { cmd: 'status', desc: 'Show current project status' },
        { cmd: 'deploy', desc: 'Deploy to virtual server' },
        { cmd: 'install', desc: 'Install dependencies' },
        { cmd: 'build', desc: 'Build project' },
        { cmd: 'test', desc: 'Run tests' },
        { cmd: 'ls', desc: 'List files' },
        { cmd: 'clear', desc: 'Clear terminal' }
    ];

    return (
        <div className="terminal-screen">
            {/* Header */}
            <header className="terminal-header">
                <div className="header-left">
                    <button 
                        className="back-button"
                        onClick={() => onNavigate('home')}
                    >
                        ← Back
                    </button>
                    <h1>Virtual Terminal</h1>
                </div>
                
                <div className="project-info">
                    {currentProject ? (
                        <>
                            <span className="project-name">{currentProject.name}</span>
                            <span className="project-type">{currentProject.type}</span>
                        </>
                    ) : (
                        <span className="no-project">No project selected</span>
                    )}
                </div>

                <div className="header-actions">
                    <button 
                        className="btn-secondary"
                        onClick={() => onNavigate('projects')}
                    >
                        Switch Project
                    </button>
                </div>
            </header>

            <div className="terminal-container">
                {/* Панель быстрых команд */}
                <div className="quick-commands">
                    <h3>Quick Commands</h3>
                    <div className="commands-grid">
                        {predefinedCommands.map((item, index) => (
                            <button
                                key={index}
                                className="cmd-button"
                                onClick={() => executeCommand(item.cmd)}
                            >
                                <span className="cmd-text">{item.cmd}</span>
                                <span className="cmd-desc">{item.desc}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="terminal-tips">
                        <h4>Terminal Tips</h4>
                        <ul>
                            <li>Use ↑↓ arrows for command history</li>
                            <li>Tab key for auto-completion</li>
                            <li>Ctrl+C to stop running process</li>
                            <li>Clear terminal with 'clear' command</li>
                        </ul>
                    </div>
                </div>

                {/* Терминал */}
                <div className="terminal-wrapper">
                    <div ref={terminalRef} className="terminal-output">
                        {commands.map(command => (
                            <div 
                                key={command.id} 
                                className={`terminal-line ${command.type}`}
                            >
                                {command.text.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        ))}
                        <div className="terminal-cursor">_</div>
                    </div>

                    <form onSubmit={handleSubmit} className="terminal-input">
                        <span className="prompt">
                            {currentProject ? `~/projects/${currentProject.name}` : '~'}$ 
                        </span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a command..."
                            autoFocus
                            className="input-field"
                        />
                    </form>
                </div>
            </div>

            {/* Статус бар */}
            <div className="status-bar">
                <div className="status-item">
                    <div className="status-indicator connected"></div>
                    <span>Connected to Virtual Environment</span>
                </div>
                <div className="status-item">
                    <span>Commands executed: {commands.filter(c => c.type === 'input').length}</span>
                </div>
                <div className="status-item">
                    <span>SphereDev Network Terminal v1.0</span>
                </div>
            </div>
        </div>
    );
};

export default TerminalScreen;
