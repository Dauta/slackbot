'use strict';

const request = require('superagent');
const express = require('express');
const service = express();



service.get('/service/gif/:tag?', (req, res, next) => {
  const tag = req.params.tag;

  request.get('http://api.giphy.com/v1/gifs/random')
    .query({'api_key': 'dc6zaTOxFJmzC'})
    .query({'tag': tag})
    .end((err, result) => {
      if(err) return err;

      if(result.statusCode != 200) return 'Expected Status 200 but got ' + res.statusCode;

      res.json({url: result.body.data.fixed_height_downsampled_url});
  });



});



module.exports = service;