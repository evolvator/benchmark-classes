'use strict';

var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var async = require('async');
var _ = require('lodash');
var global = require('global');
var klass = require('klass');
var class1 = require('class');

// typescript
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();

var functions = {};
for (var i = 0; i < 9; i++) {
  functions[i] = {};
  functions[i].f = function() {};
  if (i) functions[i].f.prototype = functions[i - 1].i;
  functions[i].i = new functions[i].f();
}

var classesEs15 = {};
for (var i = 0; i < 9; i++) {
  classesEs15[i] = {};
  if (i) classesEs15[i].f = class extends classesEs15[i - 1].f {};
  else classesEs15[i].f = class {};
}

var classesTs = {};
for (var i = 0; i < 9; i++) {
  classesTs[i] = {};
  if (i) {
    classesTs[i].f = /** @class */ (function (_super) {
      __extends(С, _super);
      function С() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return С;
    }(classesTs[i - 1].f));
  } else {
    classesTs[i].f = /** @class */ (function () {
      function С() {}
      return С;
    }());
  }
}

var klasses = {};
for (var i = 0; i < 9; i++) {
  klasses[i] = {};
  if (i) klasses[i].f = klasses[i - 1].f.extend(function() {});
  else klasses[i].f = klass(function() {});
}

var classes1 = {};
for (var i = 0; i < 9; i++) {
  classes1[i] = {};
  if (i) classes1[i].f = classes1[i - 1].f.subclass(function() {});
  else classes1[i].f = class1.new(function() {});
}

async.timesSeries(
  10,
  function(t, next) {
    var suite = new Benchmark.Suite(`x${t}`);
    
    (function() {
      if (t) {
        var prototype = functions[t - 1].i;
        suite.add('create function', function() {
          function F() {};
          F.prototype = prototype;
        });
      } else {
        suite.add('create function', function() {
          function F() {};
        });
      }
    })();
    
    (function() {
      var F = functions[t].f;
      suite.add('new function', function() {
        new F();
      });
    })();
    
    (function() {
      if (t) {
        var F = classesEs15[t - 1].f;
        suite.add('create es15 class', function() {
          class C extends F {};
        });
      } else {
        suite.add('create es15 class', function() {
          class C {};
        });
      }
    })();
    
    (function() {
      var F = classesEs15[t].f;
      suite.add('new es15 class', function() {
        new F();
      });
    })();
    
    (function() {
      if (t) {
        var F = classesTs[t - 1].f;
        suite.add('create ts class', function() {
          (function (_super) {
            __extends(С, _super);
            function С() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            return С;
          }(F));
        });
      } else {
        suite.add('create ts class', function() {
          (function () {
            function С() {}
            return С;
          }());
        });
      }
    })();
    
    (function() {
      var F = classesTs[t].f;
      suite.add('new ts class', function() {
        new F();
      });
    })();
    
    (function() {
      if (t) {
        var F = klasses[t - 1].f;
        suite.add('create klass@1.4.1 class', function() {
          F.extend(function() {});
        });
      } else {
        suite.add('create klass@1.4.1 class', function() {
          klass(function() {});
        });
      }
    })();
    
    (function() {
      var F = klasses[t].f;
      suite.add('new klass@1.4.1', function() {
        new F();
      });
    })();
    
    (function() {
      if (t) {
        var F = classes1[t - 1].f;
        suite.add('create class@0.1.4 class', function() {
          F.subclass(function() {});
        });
      } else {
        suite.add('create class@0.1.4 class', function() {
          class1.new(function() {});
        });
      }
    })();
    
    (function() {
      var F = classes1[t].f;
      suite.add('new class@0.1.4', function() {
        F.new();
      });
    })();
    
    tb.wrapSuite(suite, () => next());
    suite.run({ async: true });
  }
);
