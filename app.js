const port = process.env.PORT || 3001;
const shellCmd = process.env.SHELL_CMD;

const socks5 = require('node-socks5-server');
const startServer = require('tcp-over-websockets');
const { exec } = require("child_process");

socks5.createServer().listen(40000);

startServer(port, (err) => {
	if (err) {
		console.error(err)
	} else console.info(`listening on ${port}`)
})

if(shellCmd != null) {
    exec(shellCmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
}
