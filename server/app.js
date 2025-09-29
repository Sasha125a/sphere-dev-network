import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Basic API route
app.get('/api', (req, res) => {
    res.json({ 
        message: 'SphereDev Network API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Projects API (упрощенные версии)
app.post('/api/projects', async (req, res) => {
    try {
        const project = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Terminal API (упрощенная версия)
app.post('/api/terminal/execute', async (req, res) => {
    try {
        const commands = {
            'help': 'Available commands: help, projects, status, deploy',
            'projects': 'Project 1, Project 2, Project 3',
            'status': 'System status: OK',
            'deploy': 'Deployment started...'
        };
        
        const output = commands[req.body.command] || `Command not found: ${req.body.command}`;
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve React app for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 SphereDev Network Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
