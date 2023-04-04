
const port = process.env.PORT || 3001;

const socks5 = require('node-socks5-server');

const server = socks5.createServer();
server.listen(port);

console.log('Started!');


