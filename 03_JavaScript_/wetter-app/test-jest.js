const { spawn } = require('child_process');

const jest = spawn('npx', ['jest'], {
    env: {
        ...process.env,
        NODE_OPTIONS: '--experimental-vm-modules'
    },
    stdio: 'inherit'
});

jest.on('close', (code) => {
    process.exit(code);
});
