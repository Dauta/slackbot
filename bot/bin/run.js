'use strict';

const config = require('../config.js');
const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);


const witClient = require('../server/witClient')(config.witToken);


const slackLogLevel = 'verbose';


const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(config.slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))



server.on('listening', () => {
  console.log(`ccbot is listening on ${server.address().port} in ${service.get('env')} mode.`);
});