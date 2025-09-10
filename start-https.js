const { spawn } = require('child_process');
const path = require('path');

// Start backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit'
});

// Start frontend with HTTPS
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  env: {
    ...process.env,
    HTTPS: 'true',
    SSL_CRT_FILE: path.join(__dirname, 'certs', 'localhost.pem'),
    SSL_KEY_FILE: path.join(__dirname, 'certs', 'localhost-key.pem')
  }
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
