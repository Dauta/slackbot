const service = require('../server/service');
// const storage = require('../storage');
const http = require('http');

const server = http.createServer(service);
server.listen();

server.on('listening', function () {
  console.log(`bot-gitlab is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
