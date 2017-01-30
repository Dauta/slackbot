const config = require('../config.js');
const request = require('superagent');
// const bodyParser = require('body-parser');
const express = require('express');

const service = express();
const gitlab = require('gitlab')({
  url: config.gitlabUrl,
  token: config.gitlabToken,
});

service.get('/service/gitlab/:id', (req, res, next) => {
  function getUser(firstname) {
    return new Promise((resolve, reject) => {
      gitlab.users.all((users) => {
        console.log(users);
        const requestedUser = users.filter(user => user.name.includes(firstname));
        resolve(requestedUser);
      });
    });
  }

  function getGroups() {
    return new Promise((resolve, reject) => {
      gitlab.groups.all((groups) => {
        resolve(groups);
      });
    });
  }

  function userInGroup(requestedUserId) {
    return function filter(group) {
      return new Promise((resolve, reject) => {
        gitlab.groups.listMembers(group.id, (users) => {
          resolve(users.find(user => user.id === requestedUserId));
        });
      });
    };
  }

  function getUsersGroups(userId) {
    return getGroups()
      .then((groups) => {
        console.log('Got Groups');
        return new Promise((resolve, reject) => {
          resolve(groups.filter(userInGroup(userId)));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getIssueFromGroup(group) {
    return request.get(`https://gitlab.ccloan.ge/api/v3/groups/${group.id}/issues`)
      .set('PRIVATE-TOKEN', config.gitlabToken).then(response => response.body);
  }

  function getAllIssues(filteredGroups) {
    console.log('Getting Issues');
    return Promise.all(filteredGroups.map(getIssueFromGroup));
  }

  function filterIssues(userId) {
    console.log('filtering Issues');
    return function filter(issue) {
      if (issue.assignee) {
        return issue.assignee.id === userId;
      }
      return false;
    };
  }

  let userId = null;

  getUser(req.params.id).then((user) => {
    console.log('Got User: ' + user[0].name);
    userId = user[0].id;
    return getUsersGroups(4);
  })
  .then((groups) => {
    return getAllIssues(groups);
  })
  .then((groupedIssues) => {
    const issues = groupedIssues.filter(issueGrouped => issueGrouped.length);
    const issuesToArray = issues.reduce((initial, issue) => {
      return initial + issue;
    });
    const filtedIssues = issuesToArray.filter(filterIssues(userId));
    const filterIssuesTitle = filtedIssues.map(issue => issue.title);
    res.json(filterIssuesTitle);
  })
  .catch((err) => {
    console.log(err);
  });
});


module.exports = service;
