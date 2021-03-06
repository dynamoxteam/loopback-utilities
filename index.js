'use strict';

module.exports = {
  mixins: {
    'pagination-meta': require('./lib/mixins/pagination-meta'),
    'soft-delete': require('./lib/mixins/soft-delete'),
    'timestamp': require('./lib/mixins/timestamp')
  },
  testing: {
    'auth': require('./lib/testing/auth')
  }
};