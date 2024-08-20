const port = process.env.PORT || 3001;

const socks5 = require('node-socks5-server');
const startServer = require('tcp-over-websockets');
const { spawn } = require('node:child_process');

socks5.createServer().listen(40000);

startServer(port, (err) => {
	if (err) {
		console.error(err)
	} else console.info(`listening on ${port}`)
})

const proc = spawn('ssh', []);

proc.stdout.on('data', (data) => {
  console.log(data.toString());
});

proc.stderr.on('data', (data) => {
  console.error(data.toString());
});

proc.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
}); 
