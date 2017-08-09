'use strict';

module.exports = function (Model, bootOptions = {}) {
  Model.defineProperty('createdAt', {
    type: Date,
    required: false,
    defaultFn: 'now',
  });

  Model.defineProperty('updatedAt', {
    type: Date,
    required: false,
    defaultFn: 'now'
  });

  Model.observe('persist', (ctx, next) => {
    const date = new Date();
    if (ctx.isNewInstance) {
      ctx.currentInstance['updatedAt'] = ctx.currentInstance['createdAt'] = date;
    } else {
      ctx.currentInstance['updatedAt'] = date;
    }
    process.nextTick(next);
  });
};
