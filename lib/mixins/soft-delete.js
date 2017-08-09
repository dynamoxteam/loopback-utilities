'use strict';

const _ = require('lodash');

module.exports = function (Model, bootOptions = {}) {
  Model.defineProperty('deleted', {
    type: Boolean,
    required: true,
    default: false
  });

  /**
   * @return {Promise<Model>}
   */
  Model.prototype.softDelete = function () {
    return this.updateAttribute('deleted', true);
  }

  /**
   * @return {Promise<Model>}
   */
  Model.prototype.restore = function () {
    return this.updateAttribute('deleted', false);
  }

  Model.beforeRemote('find', (ctx, instance, next) => {
    const scope = _.get(ctx.args, 'filter.scope', 'active');
    _.unset(ctx.args, 'filter.scope');
    switch (scope) {
      case 'active':
        _.set(ctx.args, 'filter.where.deleted', false);
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
