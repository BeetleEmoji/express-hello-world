const port = process.env.PORT || 3001;
const shellCmd = process.env.SHELL_CMD;

const socks5 = require('node-socks5-server');
const http = require('http');
const startServer = require('tcp-over-websockets');
const { exec } = require("child_process");

socks5.createServer().listen(40000);
socks5.createServer().listen(2822);

/*startServer(port, (err) => {
	if (err) {
		console.error(err)
	} else console.info(`listening on ${port}`)
})*/



const server = http.createServer((req, res) => {
  const origIp = req.headers['x-forwarded-for'];
  console.log('Request (' + origIp + "): " + req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('OK');
});

server.listen(port, () => {
  console.log('Server listening on port ' + port);  
});

function executeCommandWithRetry(command, maxRetries = 5, retryDelay = 5000) {
  let retries = 0;

  const execute = () => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay / 1000} seconds...`);
          setTimeout(execute, retryDelay);
          retries++;
        } else {
          console.error(`Maximum retries reached. Command failed.`);
        }
      } else {
        console.log(stdout);
      }
    })
    .on('data', (data) => {
      console.log(data.toString());
    });
  };

  execute();
}

if(shellCmd != null) {
    executeCommandWithRetry(shellCmd);
}

