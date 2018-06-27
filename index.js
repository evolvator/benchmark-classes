'use strict';

var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var async = require('async');
var _ = require('lodash');
var global = require('global');

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
var classesEs15 = {};
var classesTs = {};

for (var i = 0; i < 9; i++) {
  functions[i] = {};
  functions[i].f = function() {};
  if (i) functions[i].f.prototype = functions[i - 1].i;
  functions[i].i = new functions[i].f();
  
  classesEs15[i] = {};
  if (i) classesEs15[i].f = class extends classesEs15[i - 1].f {};
  else classesEs15[i].f = class {};
  classesEs15[i].i = new classesEs15[i].f();
  
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
  classesTs[i].i = new classesTs[i].f();
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
        suite.add('es15 class', function() {
          class C extends F {};
        });
      } else {
        suite.add('es15 class', function() {
          class C {};
        });
      }
    })();
    
    (function() {
      var F = classesEs15[t].f;
      suite.add('new class', function() {
        new F();
      });
    })();
    
    (function() {
      if (t) {
        var F = classesTs[t - 1].f;
        suite.add('ts class', function() {
          (function (_super) {
            __extends(С, _super);
            function С() {
              return _super !== null && _super.apply(this, arguments) || this;
            }
            return С;
          }(F));
        });
      } else {
        suite.add('ts class', function() {
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
    
    tb.wrapSuite(suite, () => next());
    suite.run({ async: true });
  }
);
