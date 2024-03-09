module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  
  // Can compare values in handlebars
  eq: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  }
};