class ProjectTemplates {
    constructor() {
        this.templates = {
            'react-app': {
                name: 'React Application',
                type: 'webapp',
                structure: {
                    'package.json': `{
  "name": "react-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
                    'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>React App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`
                }
            },
            'node-api': {
                name: 'Node.js API',
                type: 'api',
                structure: {
                    'package.json': `{
  "name": "node-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`,
                    'server.js': `import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js API' })
})

app.listen(port, () => {
  console.log('Server running on port', port)
})`
                }
            }
        };
    }

    getTemplate(templateId) {
        return this.templates[templateId] || this.templates['react-app'];
    }

    getAllTemplates() {
        return Object.entries(this.templates).map(([id, template]) => ({
            id,
            name: template.name,
            type: template.type
        }));
    }
}

export default new ProjectTemplates();