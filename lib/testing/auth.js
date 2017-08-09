'use strict'

/* eslint-disable no-unused-expressions */

const request = require('supertest');
const expect = require('chai').expect;

module.exports = { loginAsUser, loginAsAdmin, clearToken };

function loginAsUser(login, password, app, done) {
  const callback = function () {
    request(app)
      .post('/api/Accounts/login')
      .send({ email: login, password: password })
      .expect(200)
      .then(res => {
        global.accessToken = res.body.id
        expect(global.accessToken).to.not.be.empty
      })
      .catch(done)
  }
  if (app.booting) {
    console.log('Waiting for app boot...');
    app.on('booted', callback);
  } else {
    callback();
  }
}

function loginAsAdmin(app, done) {
  loginAsUser(
    process.env.DEFAULT_ADMIN_EMAIL,
    process.env.DEFAULT_ADMIN_PASSWORD,
    app,
    done
  );
}

function clearToken() {
  global.accessToken = null;
  expect(global.accessToken).to.be.empty;
}