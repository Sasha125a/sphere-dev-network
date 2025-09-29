import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ projectId, filePath, onSave }) => {
    const [code, setCode] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        loadFile();
        setupWebSocket();
    }, [projectId, filePath]);

    const loadFile = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/files?path=${filePath}`);
            const content = await response.text();
            setCode(content);
        } catch (error) {
            console.error('Error loading file:', error);
        }
    };

    const setupWebSocket = () => {
        const ws = new WebSocket(`ws://localhost:3000/editor/${projectId}`);
        
        ws.onopen = () => {
            setIsConnected(true);
            ws.send(JSON.stringify({
                type: 'join',
                filePath: filePath
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'code_update':
                    if (data.filePath === filePath) {
                        setCode(data.content);
                    }
                    break;
                case 'users_update':
                    setCollaborators(data.users);
                    break;
            }
        };

        ws.onclose = () => setIsConnected(false);
    };

    const handleCodeChange = (value) => {
        setCode(value);
        // Отправка изменений через WebSocket
        // В реальном приложении здесь будет дебаунс
    };

    const handleSave = async () => {
        try {
            await fetch(`/api/projects/${projectId}/files`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, content: code })
            });
            onSave && onSave();
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    return (
        <div className="code-editor-container">
            <div className="editor-header">
                <div className="file-info">
                    <span>{filePath}</span>
                    <div className="connection-status">
                        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                </div>
                
                <div className="editor-actions">
                    <div className="collaborators">
                        {collaborators.map(user => (
                            <div key={user.id} className="collaborator" title={user.name}>
                                {user.name.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSave} className="save-btn">
                        Save
                    </button>
                </div>
            </div>

            <Editor
                height="70vh"
                language={getLanguageFromFile(filePath)}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true
                }}
            />
        </div>
    );
};

function getLanguageFromFile(filePath) {
    const ext = filePath.split('.').pop();
    const languages = {
        'js': 'javascript',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown',
        'py': 'python'
    };
    return languages[ext] || 'plaintext';
}

export default CodeEditor;