'use strict';

const config = require('../config.js');
const request = require('superagent');
const express = require('express');
const service = express();
const gitlab = require('gitlab')({
  url: config.gitlabUrl,
  token: config.gitlabToken
});



service.get('/service/gitlab/:firstname', (req, res, next) => {

  // Get User
  gitlab.users.all((users) => {
    const requestedUser = users.filter(user => {
      return user.name.includes(req.params.firstname);
    });
    
    // Get Groups
    gitlab.groups.all((groups) => {
      let issues;
      groups.forEach((group) => {
        gitlab.groups.listMembers(group.id, (users) => {
          const userInGroup = users.find((user) => {
            return user.id === requestedUser[0].id;
          });

          if(userInGroup) {
            request.get(`https://gitlab.ccloan.ge/api/v3/groups/${group.id}/issues`)
              .set('PRIVATE-TOKEN', config.gitlabToken)
              .end((err, result) => {

                if(err) {
                  console.log(err);
                  return err;
                }

                if(res.statusCode != 200) return 'Expected Status 200 but got ' + res.statusCode;


                result.body.map((issue) => {
                  console.log(issue.title);
                });
              });
          }
        });
      });
    });
  });

  res.end();
  // Get Groups

  

  // Get issues 



 
});


module.exports = service;