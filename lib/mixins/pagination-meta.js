'use strict'

const _ = require('lodash');

module.exports = function (Model, options) {
  const defaultOptions = {
    limit: 25
  };

  const resultOptions = Object.assign({}, defaultOptions, options);
  const methods = resultOptions.methods || [];

  const beforeRemote = (ctx, instance, next) => {
    const page = _.get(ctx.args, 'filter.page', 1);
    const limit = _.get(ctx.args, 'filter.limit', resultOptions.limit);
    const skip = limit * (page - 1)

    _.set(ctx.args, 'filter.skip', skip);
    _.set(ctx.args, 'filter.limit', limit);

    process.nextTick(next);
  };

  const afterRemote = (ctx, instance, next) => {
    const page = parseInt(_.get(ctx.args, 'filter.page', 1));
    const limit = parseInt(_.get(ctx.args, 'filter.limit', false));
    const where = _.get(ctx.args, 'filter.where', {});

    Model.count(where)
      .then(countResources => {
        const pages = limit ? Math.ceil(countResources / limit) : 1;
        ctx.result = {
          docs: ctx.result,
          pages: {
            current: page,
            prev: page - 1,
            hasPrev: (page - 1) > 0,
            next: page + 1,
            hasNext: (page < pages),
            total: pages
          },
          items: {
            limit,
            total: countResources
          }
        };

        process.nextTick(next);
      })
      .catch(err => next(err));
  };

  Model.beforeRemote('find', beforeRemote);
  Model.afterRemote('find', afterRemote);

  methods.forEach((method) => {
    Model.beforeRemote(method, beforeRemote);
    Model.afterRemote(method, afterRemote);
  });
}
