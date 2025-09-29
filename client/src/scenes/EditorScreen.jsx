import React, { useState, useEffect } from 'react';
import './EditorScreen.css';

const EditorScreen = ({ onNavigate }) => {
    const [code, setCode] = useState('');
    const [currentFile, setCurrentFile] = useState('index.html');
    const [files, setFiles] = useState({});
    const [isSaved, setIsSaved] = useState(true);

    useEffect(() => {
        // Инициализация файлов проекта
        const initialFiles = {
            'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My SphereDev Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to SphereDev Network! 🚀</h1>
            <p>Your virtual development environment</p>
        </header>
        
        <main>
            <section class="features">
                <div class="feature-card">
                    <h3>🌐 Virtual Hosting</h3>
                    <p>Deploy your projects instantly</p>
                </div>
                <div class="feature-card">
                    <h3>⚡ Real-time Editing</h3>
                    <p>Code and see changes live</p>
                </div>
                <div class="feature-card">
                    <h3>🔧 Built-in Tools</h3>
                    <p>Everything you need in one place</p>
                </div>
            </section>
        </main>
        
        <footer>
            <p>Built with ❤️ on SphereDev Network</p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
            'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #001122 0%, #003366 100%);
    color: white;
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 3rem;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #00ffff, #00ffaa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

header p {
    font-size: 1.2rem;
    color: #cccccc;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.feature-card {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    border-color: #00ffff;
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.2);
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #00ffff;
}

.feature-card p {
    color: #cccccc;
}

footer {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #888;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    header h1 {
        font-size: 2rem;
    }
    
    .features {
        grid-template-columns: 1fr;
    }
}`,
            'script.js': `// Welcome to your SphereDev project!
console.log('🚀 SphereDev Network - Virtual Development Environment');

// Sample interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add some dynamic effects
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        document.documentElement.style.setProperty('--accent-hue', hue);
    }, 50);
});

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatFileSize };
}`,
            'package.json': `{
  "name": "spheredev-project",
  "version": "1.0.0",
  "description": "A project built on SphereDev Network",
  "main": "index.html",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": [
    "spheredev",
    "virtual",
    "development",
    "environment"
  ],
  "author": "SphereDev User",
  "license": "MIT",
  "devDependencies": {
    "vite": "^4.0.0"
  }
}`
        };

        setFiles(initialFiles);
        setCode(initialFiles['index.html']);
    }, []);

    const handleFileSelect = (filename) => {
        if (!isSaved) {
            const save = window.confirm('Save changes to current file?');
            if (save) {
                handleSave();
            }
        }
        setCurrentFile(filename);
        setCode(files[filename] || '');
        setIsSaved(true);
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setIsSaved(false);
    };

    const handleSave = () => {
        setFiles(prev => ({
            ...prev,
            [currentFile]: code
        }));
        setIsSaved(true);
        
        // Показать уведомление о сохранении
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.textContent = `💾 ${currentFile} saved successfully!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    };

    const handleRun = () => {
        // Симуляция запуска проекта
        alert('🚀 Project is running! Check the preview panel.');
    };

    const fileIcons = {
        'index.html': '📄',
        'styles.css': '🎨',
        'script.js': '⚡',
        'package.json': '📦'
    };

    return (
        <div className="editor-screen">
            <header className="editor-header">
                <button 
                    className="back-button"
                    onClick={() => onNavigate('home')}
                >
                    ← Back
                </button>
                <h1>Code Editor</h1>
                <div className="editor-actions">
                    <div className="file-info">
                        <span className="current-file">
                            {fileIcons[currentFile]} {currentFile}
                        </span>
                        {!isSaved && <span className="unsaved-indicator">●</span>}
                    </div>
                    <button 
                        className="btn-secondary"
                        onClick={handleRun}
                    >
                        ▶ Run
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={isSaved}
                    >
                        {isSaved ? '✓ Saved' : '💾 Save'}
                    </button>
                </div>
            </header>

            <div className="editor-container">
                {/* Файловый эксплорер */}
                <div className="file-explorer">
                    <h3>Project Files</h3>
                    <div className="file-list">
                        {Object.keys(files).map(filename => (
                            <div
                                key={filename}
                                className={`file-item ${currentFile === filename ? 'active' : ''}`}
                                onClick={() => handleFileSelect(filename)}
                            >
                                <span className="file-icon">{fileIcons[filename]}</span>
                                <span className="file-name">{filename}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="explorer-actions">
                        <button className="explorer-btn">📁 New File</button>
                        <button className="explorer-btn">📂 New Folder</button>
                    </div>
                </div>

                {/* Область редактирования кода */}
                <div className="code-area">
                    <div className="code-toolbar">
                        <div className="language-info">
                            <span>
                                {currentFile.endsWith('.html') && 'HTML'}
                                {currentFile.endsWith('.css') && 'CSS'}
                                {currentFile.endsWith('.js') && 'JavaScript'}
                                {currentFile.endsWith('.json') && 'JSON'}
                            </span>
                        </div>
                        <div className="code-stats">
                            <span>Lines: {code.split('\n').length}</span>
                            <span>Chars: {code.length}</span>
                        </div>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className="code-editor"
                        spellCheck="false"
                        placeholder="Start coding..."
                    />
                </div>

                {/* Панель предварительного просмотра */}
                <div className="preview-area">
                    <div className="preview-header">
                        <h3>Live Preview</h3>
                        <button 
                            className="refresh-btn"
                            onClick={() => document.querySelector('.preview-frame').contentWindow.location.reload()}
                        >
                            🔄
                        </button>
                    </div>
                    <div className="preview-container">
                        <iframe
                            title="preview"
                            srcDoc={files['index.html'] + `<style>${files['styles.css']}</style><script>${files['script.js']}</script>`}
                            className="preview-frame"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>
            </div>

            {/* Статус бар */}
            <div className="editor-status-bar">
                <div className="status-item">
                    <span>Ln {code.substr(0, code.indexOf('\n')).length > 0 ? code.substr(0, code.indexOf('\n')).length : 1}, Col {code.length}</span>
                </div>
                <div className="status-item">
                    <span>{isSaved ? 'Saved' : 'Unsaved'}</span>
                </div>
                <div className="status-item">
                    <span>UTF-8</span>
                </div>
                <div className="status-item">
                    <span>SphereDev Editor</span>
                </div>
            </div>
        </div>
    );
};

export default EditorScreen;