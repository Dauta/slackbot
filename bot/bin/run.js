'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = '';
const witClient = require('../server/witClient')(witToken);

const slackToken = '';
const slackLogLevel = 'verbose';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))



server.on('listening', () => {
  console.log(`ccbot is listening on ${server.address().port} in ${service.get('env')} mode.`);
});