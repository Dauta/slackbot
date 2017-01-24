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


  request.get('http://api.giphy.com/v1/gifs/random')
    .query({'api_key': 'dc6zaTOxFJmzC'})
    .end((err, res) => {
      if(err) return cb(err);

      if(res.statusCode != 200) return cb('Expected Status 200 but got ' + res.statusCode);


      return cb(false, res.body.data.image_url);
    });


  

}