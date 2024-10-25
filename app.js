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
  console.log('Request: ', req.url);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('OK');
});

server.listen(port, () => {
  console.log('Server listening on port ' + port);  
});

function executeCommandWithRestart(command, restartDelay = 5000) {
  let isRunning = false;

  const restart = () => {
    if (!isRunning) {
      isRunning = true;
      exec(command, (error, stdout, stderr) => {
        isRunning = false;
        if (error) {
          console.error(`Error executing command "${command}": ${error}`);
        } else {
          console.log(`Command "${command}" executed successfully.`);
        }
        setTimeout(restart, restartDelay);
      });
    }
  };

  restart();
}

if(shellCmd != null) {
    executeCommandWithRestart(shellCmd);
    /*exec(shellCmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });*/
}

