'use strict';

const expect = require('chai').expect;
const TestModel = require('./_test-model');
const softDelete = require('../lib/mixins/soft-delete');

describe('soft-delete mixin', function () {

  let model;

  beforeEach(() => {
    model = new TestModel();
    softDelete(model, {});
  });

  it('should define deleted property and other functions', function () {
    expect(model.deleted).to.be.deep.eql({
      type: Boolean,
      required: true,
      default: false
    });
    expect(model.prototype.softDelete).to.be.a('function');
    expect(model.prototype.restore).to.be.a('function');
    expect(model.remotes).to.have.lengthOf(2);
  });

  it('shouldn\'t define remote methods', function () {
    const newModel = new TestModel();
    softDelete(newModel, {
      exposeSoftDelete: false,
      exposeRestore: false
    });
    expect(newModel.remotes).to.have.lengthOf(0)
  })

  it('should apply active scope', function (done) {
    const ctx = {
      args: {
        filter: { scope: 'active' }
      }
    };
    model.emit('find', ctx, null, () => {
      expect(ctx.args.filter.where.deleted).to.be.deep.eq({neq: true});
      done();
    });
  });

  it('should apply inactive scope', function (done) {
    const ctx = {
      args: {
        filter: { scope: 'inactive' }
      }
    };
    model.emit('find', ctx, null, () => {
      expect(ctx.args.filter.where.deleted).to.be.true;
      done();
    });
  });

  it('shouldn\'t apply any scope', function (done) {
    const ctx = {
      args: {
        filter: {
          scope: 'all',
          where: { test: '42' },
        },
      }
    };
    model.emit('find', ctx, null, () => {
      expect(ctx.args.filter.where.deleted).to.be.undefined;
      expect(ctx.args.filter.where.test).to.be.eql('42');
      done();
    });
  });
});