import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client
app.use(express.static(path.join(__dirname, '../client/public')));

// Импорт утилит
import virtualFS from './utils/virtualFS.js';
import domainSystem from './utils/domainSystem.js';
import virtualDeployer from './utils/virtualDeployer.js';
import virtualTerminal from './utils/virtualTerminal.js';
import versionControl from './utils/versionControl.js';
import virtualDatabase from './utils/virtualDatabase.js';

// Basic routes
app.get('/api', (req, res) => {
    res.json({ 
        message: 'SphereDev Network API',
        version: '1.0.0'
    });
});

// Projects API
app.post('/api/projects', async (req, res) => {
    try {
        const project = await virtualFS.createProject(req.body);
        await versionControl.initRepo(project.id);
        virtualDatabase.createDatabase(project.id, 'sql');
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/projects/:id/files', async (req, res) => {
    try {
        const content = await virtualFS.getFile(req.params.id, req.query.path);
        res.send(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/projects/:id/files', async (req, res) => {
    try {
        await virtualFS.saveFile(req.params.id, req.body.path, req.body.content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Terminal API
app.post('/api/terminal/execute', async (req, res) => {
    try {
        const result = await virtualTerminal.executeCommand(req.body.projectId, req.body.command);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deployment API
app.post('/api/projects/:id/deploy', async (req, res) => {
    try {
        const deployment = await virtualDeployer.deployProject(req.params.id, req.body.server);
        res.json(deployment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Metrics API
app.get('/api/projects/:id/metrics', (req, res) => {
    const metrics = {
        current: {
            cpu: Math.random() * 100,
            memory: 50 + Math.random() * 50,
            traffic: Math.random() * 1000,
            requests: Math.floor(Math.random() * 100)
        }
    };
    res.json(metrics);
});

// Domain API
app.post('/api/domains/register', (req, res) => {
    try {
        const domain = domainSystem.registerDomain(req.body.domain, req.body.projectId);
        res.json({ domain, success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket для реального времени
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create-project', (data) => {
        console.log('Project creation requested:', data);
        socket.emit('project-created', { id: Date.now(), ...data });
    });

    socket.on('join-editor', (data) => {
        socket.join(data.projectId);
        socket.to(data.projectId).emit('user-joined', { userId: socket.id });
    });

    socket.on('code-update', (data) => {
        socket.to(data.projectId).emit('code-update', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 SphereDev Network Server running on port ${PORT}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
});