'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, cb) {
  console.log(intentData);
  if(intentData.intent[0].value !== 'giff') {
    return cb(new Error(`Expected giff intent, got ${intentData.intent[0].value}`));
  }

  if(!intentData.intent[1].value &&  intentData.intent[1].value !== 'user') {
    return cb(new Error('to whom should I giff?'));
  }

  let tag = ``;

  if(intentData.search_query) {
    tag = intentData.search_query[0].value;
  }

  request.get(`http://localhost:3010/service/gif/${tag}`)
    .end((err, res) => {
      if(err || res.statusCode != 200 || !res.body.url) {

        return cb(false, `I had problem with giffing you`);
      }

      return cb(null, `პირველი გიფი უპროცენტოა:
      ${res.body.url}`);
  });



  

}