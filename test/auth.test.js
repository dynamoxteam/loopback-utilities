'use strict';

const auth = require('../lib/testing/auth');
const expect = require('chai').expect;

describe('auth test', function () {

  it('should export functions', function () {
    expect(auth.clearToken).to.be.a('function');
    expect(auth.loginAsAdmin).to.be.a('function');
    expect(auth.loginAsUser).to.be.a('function');
  });
});