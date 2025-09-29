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

// Middleware
app.use(cors());
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

// Projects API
app.post('/api/projects', async (req, res) => {
    try {
        const project = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        console.log('Project created:', project.name);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Terminal API
app.post('/api/terminal/execute', async (req, res) => {
    try {
        const { projectId, command } = req.body;
        const responses = {
            'help': 'Available commands: help, projects, status, deploy, build, test, clear',
            'projects': 'Project 1: Website, Project 2: API, Project 3: Web App',
            'status': 'System status: All services operational ✅',
            'deploy': '🚀 Deployment started...\n✅ Build completed\n✅ Tests passed\n🌍 Deployment successful!',
            'build': '🔨 Building project...\n✅ Build completed successfully',
            'test': '🧪 Running tests...\n✅ All tests passed (15/15)',
            'clear': 'Terminal cleared',
            'ls': '📁 Project Structure:\n├── src/\n├── public/\n├── package.json\n└── README.md',
            'pwd': '/home/spheredev/projects/current'
        };
        
        const output = responses[command] || `Command not found: ${command}\nType "help" for available commands`;
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket for real-time features
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-editor', (data) => {
        socket.join(data.projectId);
        console.log(`User ${socket.id} joined editor for project ${data.projectId}`);
    });

    socket.on('code-update', (data) => {
        socket.to(data.projectId).emit('code-update', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Serve React app for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 SphereDev Network Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV === 'production') {
        console.log(`📊 Application is ready for production use`);
    } else {
        console.log(`🔧 Development server: http://localhost:${PORT}`);
    }
});
