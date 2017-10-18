'use strict';

const expect = require('chai').expect;
const TestModel = require('./_test-model');
const timestamp = require('../lib/mixins/timestamp');

describe('timestamp mixin', function () {

  let model;

  const OldDate = global.Date;
  const fixedTime = new OldDate('Jan 01 1970');

  beforeEach(() => {
    global.Date = function () { return new OldDate('Jan 01 1970'); };
    model = new TestModel();
    timestamp(model, {});
  });

  after(() => global.Date = OldDate);

  it('should define both properties as required and type Date', function () {
    const equal = {
      type: Date,
      required: false,
      defaultFn: 'now',
    };
    expect(model.createdAt).to.be.deep.eql(equal);
    expect(model.updatedAt).to.be.deep.eql(equal);
  });

  it('should set both createdAt and updatedAt on fresh model', function (done) {
    const ctx = { isNewInstance: true, instance: model };
    model.emit('before save', ctx, () => {
      const time = new OldDate('Jan 01 1970');
      expect(model.createdAt.getTime()).to.be.eql(fixedTime.getTime());
      expect(model.updatedAt.getTime()).to.be.eql(fixedTime.getTime());
      done();
    });
  });

  it('should set only updatedAt on existing model', function (done) {
    const now = new OldDate();
    model.createdAt = new OldDate();
    expect(now.getTime()).to.not.be.eql(fixedTime.getTime());

    const data = {};
    const ctx = { currentInstance: model, data };
    model.emit('before save', ctx, () => {
      expect(model.createdAt.getTime()).to.be.eql(now.getTime());
      expect(data.updatedAt.getTime()).to.be.eql(fixedTime.getTime());
      done();
    });
  });
});