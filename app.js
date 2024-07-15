
const port = process.env.PORT || 3001;

const socks5 = require('node-socks5-server');
const startServer = require('tcp-over-websockets');

socks5.createServer().listen(40000);

startServer(port, (err) => {
	if (err) {
		console.error(err)
	} else console.info(`listening on ${port}`)
})


