import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Store projects in memory (in production use a database)
let projects = [
    {
        id: 1,
        name: 'Welcome Project',
        type: 'website',
        status: 'active',
        domain: 'welcome.spheredev',
        description: 'Your first project in SphereDev Network'
    }
];

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SphereDev Network API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.post('/api/projects', (req, res) => {
    const project = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'active',
        domain: `${req.body.name.toLowerCase().replace(/\s+/g, '-')}.spheredev`
    };
    
    projects.push(project);
    res.json(project);
});

app.post('/api/terminal/execute', (req, res) => {
    const { command } = req.body;
    
    const responses = {
        'help': `Available commands:
help - Show this help message
projects - List all projects
status - Show system status
deploy - Deploy current project
build - Build project
test - Run tests
clear - Clear terminal`,

        'projects': projects.length > 0 
            ? projects.map(p => `📁 ${p.name} (${p.type}) - ${p.status}`).join('\n')
            : 'No projects found. Create one first!',

        'status': `System Status:
✅ Virtual Hosting: Online
✅ Database: Connected  
✅ File System: Active
✅ Network: Stable
📊 Projects: ${projects.length} active`,

        'deploy': `🚀 Starting deployment...
📦 Building project...
✅ Build successful
🧪 Running tests...
✅ All tests passed
🌍 Deploying to virtual server...
🎉 Deployment completed!`,

        'build': `🔨 Building project...
✅ Dependencies installed
✅ Code compiled  
✅ Assets optimized
🎊 Build completed successfully!`,

        'test': `🧪 Running test suite...
✅ Unit tests: 15/15 passed
✅ Integration tests: 8/8 passed
✅ E2E tests: 3/3 passed
🎯 All tests passed!`,

        'clear': 'Terminal cleared'
    };
    
    const output = responses[command] || `Command '${command}' not found. Type 'help' for available commands.`;
    
    // Simulate processing time
    setTimeout(() => {
        res.json({ output });
    }, 500);
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('🚀 SphereDev Network Server started!');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/health`);
});
