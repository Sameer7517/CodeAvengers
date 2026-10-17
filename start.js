import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('🌱 Starting Campus Exchange (Backend API on :5000 & Frontend on :5173)...');

// Start Server (Express API)
const serverProcess = spawn(npmCmd, ['--prefix', 'server', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

// Start Client (Vite React)
const clientProcess = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down Campus Exchange servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
