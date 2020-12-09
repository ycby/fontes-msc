module.exports = function(vars) {
  return function(stylus) {
    for (var name in vars) {
      stylus.define(name, vars[name]);
    }
  };
};
