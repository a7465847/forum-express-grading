const formatDistanceToNow = require('date-fns/formatDistanceToNow')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return formatDistanceToNow(a, {includeSeconds: true})
  }
}