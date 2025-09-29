import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VirtualTerminal {
    constructor() {
        this.processes = new Map();
    }

    async executeCommand(projectId, command) {
        return new Promise((resolve, reject) => {
            const projectPath = path.join(__dirname, '../../virtual-projects', projectId);
            
            const safeCommands = {
                'ls': `dir "${projectPath}"`,
                'pwd': `echo "${projectPath}"`,
                'git status': 'echo "Git repository"',
                'npm install': 'echo "Installing dependencies..."',
                'deploy': 'echo "Deploying to virtual server..."'
            };

            const safeCommand = safeCommands[command] || `echo "Command: ${command}"`;

            const process = exec(safeCommand, { cwd: projectPath }, (error, stdout, stderr) => {
                if (error) {
                    resolve({ output: stderr || error.message });
                } else {
                    resolve({ output: stdout });
                }
            });

            this.processes.set(projectId, process);
        });
    }

    killProcess(projectId) {
        const process = this.processes.get(projectId);
        if (process) {
            process.kill();
            this.processes.delete(projectId);
        }
    }
}

export default new VirtualTerminal();