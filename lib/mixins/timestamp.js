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

  Model.observe('before save', (ctx, next) => {
    const date = new Date();

    // Creating a brand new model eg: PersistedModel.create();
    if (ctx.instance && ctx.isNewInstance) {
      ctx.instance['updatedAt'] = date;
      ctx.instance['createdAt'] = date;

    // Full model update eg: PersistedModel.prototype.save();
    } else if (ctx.instance && !ctx.isNewInstance) {
      ctx.instance['updatedAt'] = date;

    // Partial update eg: PersistedModel.prototype.updateAttributes();
    } else {
      ctx.data['updatedAt'] = date;
    }
    
    process.nextTick(next);
  });
};
