import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VersionControlSystem {
    constructor() {
        this.commits = new Map();
    }

    async initRepo(projectId) {
        const projectPath = path.join(__dirname, '../../virtual-projects', projectId);
        
        try {
            // Создаем файл для симуляции Git
            const gitInfo = {
                initialized: true,
                commits: [],
                branches: ['main']
            };
            
            await fs.writeFile(
                path.join(projectPath, '.gitinfo.json'),
                JSON.stringify(gitInfo, null, 2)
            );
            
            return true;
        } catch (error) {
            console.error('Error initializing repo:', error);
            return false;
        }
    }

    async commit(projectId, message, author = 'Virtual Developer') {
        const projectPath = path.join(__dirname, '../../virtual-projects', projectId);
        
        try {
            const commit = {
                id: this.generateCommitHash(),
                message,
                author,
                timestamp: new Date(),
                files: ['All project files']
            };

            // Читаем существующие коммиты
            let gitInfo;
            try {
                const gitInfoContent = await fs.readFile(path.join(projectPath, '.gitinfo.json'), 'utf8');
                gitInfo = JSON.parse(gitInfoContent);
            } catch {
                gitInfo = { commits: [], branches: ['main'] };
            }

            gitInfo.commits.push(commit);
            
            await fs.writeFile(
                path.join(projectPath, '.gitinfo.json'),
                JSON.stringify(gitInfo, null, 2)
            );

            if (!this.commits.has(projectId)) {
                this.commits.set(projectId, []);
            }
            this.commits.get(projectId).push(commit);

            return commit;
        } catch (error) {
            throw new Error(`Commit failed: ${error.message}`);
        }
    }

    async getHistory(projectId) {
        if (this.commits.has(projectId)) {
            return this.commits.get(projectId);
        }
        
        // Пытаемся загрузить из файла
        const projectPath = path.join(__dirname, '../../virtual-projects', projectId);
        try {
            const gitInfoContent = await fs.readFile(path.join(projectPath, '.gitinfo.json'), 'utf8');
            const gitInfo = JSON.parse(gitInfoContent);
            return gitInfo.commits || [];
        } catch {
            return [];
        }
    }

    generateCommitHash() {
        return Math.random().toString(36).substr(2, 9);
    }
}

export default new VersionControlSystem();