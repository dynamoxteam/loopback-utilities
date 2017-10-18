'use strict';

const _ = require('lodash');

module.exports = function (Model, bootOptions = {}) {
  const defaultOptions = {
    exposeSoftDelete: true,
    exposeRestore: true
  };
  _.defaults(bootOptions, defaultOptions);

  Model.defineProperty('deleted', {
    type: Boolean,
    required: true,
    default: false
  });

  /**
   * @return {Promise<Model>}
   */
  Model.prototype.softDelete = function (callback) {
    return this.updateAttribute('deleted', true, callback);
  }

  /**
   * @return {Promise<Model>}
   */
  Model.prototype.restore = function (callback) {
    return this.updateAttribute('deleted', false, callback);
  }

  if (bootOptions.exposeSoftDelete) {
    Model.remoteMethod('softDelete', {
      isStatic: false,
      description: 'Marks this model as deleted.',
      http: {
        path: '/softDelete',
        verb: 'DELETE'
      }
    });
  }

  if (bootOptions.exposeRestore) {
    Model.remoteMethod('restore', {
      isStatic: false,
      description: 'Restores this model by removing the deleted flag.',
      http: {
        path: '/restore',
        verb: 'PATCH'
      }
    });
  }

  Model.beforeRemote('find', (ctx, instance, next) => {
    const scope = _.get(ctx.args, 'filter.scope', 'active');
    _.unset(ctx.args, 'filter.scope');
    switch (scope) {
      case 'active':
        _.set(ctx.args, 'filter.where.deleted.neq', true);
        break;
      case 'inactive':
        _.set(ctx.args, 'filter.where.deleted', true);
        break;
      default:
        _.unset(ctx.args, 'filter.where.deleted');
        break;
    }
    process.nextTick(next);
  });
}
