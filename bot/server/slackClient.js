const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}


function handleOnMessage(message) {

  // rtm.sendMessage('ხიწვი შემერჭოოო', message.channel);
  if(message.text && message.text.toLowerCase().includes('ccbot')) {

    nlp.ask(message.text, (err, res) => {
      if(err) {
        console.log(err);
        return;
      }

      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error('Could not extract intent.' + res.intent[0].value);
        }

        const intent = require('./intents/' + res.intent[0].value + 'Intent');

        intent.process(res, registry, (err, response) => {
          if(err) {
            console.log(err.message);
            return
          }

          return rtm.sendMessage(response, message.channel);
        });

      } catch(err) {
        console.log(err);
        console.log(res);
        rtm.sendMessage('ვოთ დუ უ ვონთ? ვაი დუ დეი დუ', message.channel);
      }


    });
  }

}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}


module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
  rtm = new RtmClient(token, { logLevel });
  nlp = nlpClient;
  registry = serviceRegistry;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
  return rtm;
} 

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;