const port = process.env.PORT || 3001;
const shellCmd = process.env.SHELL_CMD;
const shellCmd2 = process.env.SHELL_CMD2;


const socks5 = require('node-socks5-server');
const http = require('http');
const startServer = require('tcp-over-websockets');
const { exec } = require("child_process");
const os = require('os');
const proc = require('process');

const users = {
  'admin': 'RPJ6X4YvSQs2mU73'
};

const userPassAuthFn = (user, password) => {
  if (users[user] === password) return true;
  return false;
};

socks5.createServer({userPassAuthFn,}).listen(40000);
socks5.createServer({userPassAuthFn,}).listen(2822);

const server = http.createServer((req, res) => {
  const origIp = req.headers['x-forwarded-for'];
  // console.log('Request (' + origIp + "): " + req.url);

  if (req.url === '/stats') {
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100; // Average load over 1 minute

    const stats = {
      memoryUsage: proc.memoryUsage() / 1024 / 1024,
      cpuUsage: cpuUsage.toFixed(2)
    };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(stats));
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
  }
});

server.listen(port, () => {
  console.log('Server listening on port ' + port);  
});

function executeCommandWithRetry(command, maxRetries = 5, retryDelay = 5000) {
  let retries = 0;

  const execute = () => {
    exec(command, (error, stdout, stderr) => {
        console.error(`Error executing command: ${error.message}`);
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay / 1000} seconds...`);
          setTimeout(execute, retryDelay);
          retries++;
        } else {
          console.error(`Maximum retries reached. Command failed.`);
        }
    })
    .on('data', (data) => {
      console.log(data.toString());
    });
  };

  execute();
}

if(shellCmd != null) {
    executeCommandWithRetry(shellCmd, 1000, 5000);
}

if(shellCmd2 != null) {
    executeCommandWithRetry(shellCmd2, 1000, 5000);
}

