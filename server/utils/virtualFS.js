import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VirtualFileSystem {
    constructor() {
        this.basePath = path.join(__dirname, '../../virtual-projects');
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.basePath, { recursive: true });
        } catch (error) {
            console.error('Error initializing virtual FS:', error);
        }
    }

    async createProject(projectData) {
        const projectPath = path.join(this.basePath, projectData.name);
        
        try {
            await fs.mkdir(projectPath, { recursive: true });
            
            const structure = this.getProjectStructure(projectData);
            
            for (const [filePath, content] of Object.entries(structure)) {
                const fullPath = path.join(projectPath, filePath);
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, content);
            }

            const metadata = {
                ...projectData,
                id: this.generateId(),
                created: new Date().toISOString(),
                path: projectPath,
                status: 'created'
            };

            await fs.writeFile(
                path.join(projectPath, 'project.json'),
                JSON.stringify(metadata, null, 2)
            );

            return metadata;
        } catch (error) {
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    getProjectStructure(project) {
        return {
            'index.html': `<!DOCTYPE html>
<html>
<head>
    <title>${project.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #0066ff; }
    </style>
</head>
<body>
    <h1>Welcome to ${project.name}</h1>
    <p>${project.description || 'Your new website on SphereDev Network'}</p>
</body>
</html>`,
            'README.md': `# ${project.name}\n\nCreated with SphereDev Network`
        };
    }

    async getFile(projectId, filePath) {
        const projectPath = path.join(this.basePath, projectId, filePath);
        try {
            return await fs.readFile(projectPath, 'utf8');
        } catch (error) {
            throw new Error(`File not found: ${error.message}`);
        }
    }

    async saveFile(projectId, filePath, content) {
        const projectPath = path.join(this.basePath, projectId, filePath);
        try {
            await fs.mkdir(path.dirname(projectPath), { recursive: true });
            await fs.writeFile(projectPath, content);
        } catch (error) {
            throw new Error(`Save failed: ${error.message}`);
        }
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

export default new VirtualFileSystem();