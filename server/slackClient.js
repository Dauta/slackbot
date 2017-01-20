const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}


function handleOnMessage(message) {
  nlp.ask(message.text, (err, res) => {
    if(err) {
      console.log(err);
      return;
    }

    rtm.sendMessage('ბოდიშიიიი', 'D3PUDB3FB', () => {

    });
  });

 
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}


module.exports.init = function slackClient(token, logLevel, nlpClient) {
  rtm = new RtmClient(token, { logLevel });
  nlp = nlpClient;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
  return rtm;
} 

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;