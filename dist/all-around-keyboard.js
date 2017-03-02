(function (exports) {
    'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

    function interopDefault(ex) {
    	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var asyncGenerator = function () {
      function AwaitValue(value) {
        this.value = value;
      }

      function AsyncGenerator(gen) {
        var front, back;

        function send(key, arg) {
          return new Promise(function (resolve, reject) {
            var request = {
              key: key,
              arg: arg,
              resolve: resolve,
              reject: reject,
              next: null
            };

            if (back) {
              back = back.next = request;
            } else {
              front = back = request;
              resume(key, arg);
            }
          });
        }

        function resume(key, arg) {
          try {
            var result = gen[key](arg);
            var value = result.value;

            if (value instanceof AwaitValue) {
              Promise.resolve(value.value).then(function (arg) {
                resume("next", arg);
              }, function (arg) {
                resume("throw", arg);
              });
            } else {
              settle(result.done ? "return" : "normal", result.value);
            }
          } catch (err) {
            settle("throw", err);
          }
        }

        function settle(type, value) {
          switch (type) {
            case "return":
              front.resolve({
                value: value,
                done: true
              });
              break;

            case "throw":
              front.reject(value);
              break;

            default:
              front.resolve({
                value: value,
                done: false
              });
              break;
          }

          front = front.next;

          if (front) {
            resume(front.key, front.arg);
          } else {
            back = null;
          }
        }

        this._invoke = send;

        if (typeof gen.return !== "function") {
          this.return = undefined;
        }
      }

      if (typeof Symbol === "function" && Symbol.asyncIterator) {
        AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
          return this;
        };
      }

      AsyncGenerator.prototype.next = function (arg) {
        return this._invoke("next", arg);
      };

      AsyncGenerator.prototype.throw = function (arg) {
        return this._invoke("throw", arg);
      };

      AsyncGenerator.prototype.return = function (arg) {
        return this._invoke("return", arg);
      };

      return {
        wrap: function (fn) {
          return function () {
            return new AsyncGenerator(fn.apply(this, arguments));
          };
        },
        await: function (value) {
          return new AwaitValue(value);
        }
      };
    }();

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var get = function get(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };

    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };

    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    var isArguments = createCommonjsModule(function (module) {
    	'use strict';

    	var toStr = Object.prototype.toString;

    	module.exports = function isArguments(value) {
    		var str = toStr.call(value);
    		var isArgs = str === '[object Arguments]';
    		if (!isArgs) {
    			isArgs = str !== '[object Array]' && value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
    		}
    		return isArgs;
    	};
    });

    var isArguments$1 = interopDefault(isArguments);



    var require$$0$1 = Object.freeze({
    	default: isArguments$1
    });

    var index$6 = createCommonjsModule(function (module) {
    	'use strict';

    	// modified from https://github.com/es-shims/es5-shim

    	var has = Object.prototype.hasOwnProperty;
    	var toStr = Object.prototype.toString;
    	var slice = Array.prototype.slice;
    	var isArgs = interopDefault(require$$0$1);
    	var isEnumerable = Object.prototype.propertyIsEnumerable;
    	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
    	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
    	var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
    	var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
    		var ctor = o.constructor;
    		return ctor && ctor.prototype === o;
    	};
    	var excludedKeys = {
    		$console: true,
    		$external: true,
    		$frame: true,
    		$frameElement: true,
    		$frames: true,
    		$innerHeight: true,
    		$innerWidth: true,
    		$outerHeight: true,
    		$outerWidth: true,
    		$pageXOffset: true,
    		$pageYOffset: true,
    		$parent: true,
    		$scrollLeft: true,
    		$scrollTop: true,
    		$scrollX: true,
    		$scrollY: true,
    		$self: true,
    		$webkitIndexedDB: true,
    		$webkitStorageInfo: true,
    		$window: true
    	};
    	var hasAutomationEqualityBug = function () {
    		/* global window */
    		if (typeof window === 'undefined') {
    			return false;
    		}
    		for (var k in window) {
    			try {
    				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && _typeof(window[k]) === 'object') {
    					try {
    						equalsConstructorPrototype(window[k]);
    					} catch (e) {
    						return true;
    					}
    				}
    			} catch (e) {
    				return true;
    			}
    		}
    		return false;
    	}();
    	var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
    		/* global window */
    		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
    			return equalsConstructorPrototype(o);
    		}
    		try {
    			return equalsConstructorPrototype(o);
    		} catch (e) {
    			return false;
    		}
    	};

    	var keysShim = function keys(object) {
    		var isObject = object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
    		var isFunction = toStr.call(object) === '[object Function]';
    		var isArguments = isArgs(object);
    		var isString = isObject && toStr.call(object) === '[object String]';
    		var theKeys = [];

    		if (!isObject && !isFunction && !isArguments) {
    			throw new TypeError('Object.keys called on a non-object');
    		}

    		var skipProto = hasProtoEnumBug && isFunction;
    		if (isString && object.length > 0 && !has.call(object, 0)) {
    			for (var i = 0; i < object.length; ++i) {
    				theKeys.push(String(i));
    			}
    		}

    		if (isArguments && object.length > 0) {
    			for (var j = 0; j < object.length; ++j) {
    				theKeys.push(String(j));
    			}
    		} else {
    			for (var name in object) {
    				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
    					theKeys.push(String(name));
    				}
    			}
    		}

    		if (hasDontEnumBug) {
    			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

    			for (var k = 0; k < dontEnums.length; ++k) {
    				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
    					theKeys.push(dontEnums[k]);
    				}
    			}
    		}
    		return theKeys;
    	};

    	keysShim.shim = function shimObjectKeys() {
    		if (Object.keys) {
    			var keysWorksWithArguments = function () {
    				// Safari 5.0 bug
    				return (Object.keys(arguments) || '').length === 2;
    			}(1, 2);
    			if (!keysWorksWithArguments) {
    				var originalKeys = Object.keys;
    				Object.keys = function keys(object) {
    					if (isArgs(object)) {
    						return originalKeys(slice.call(object));
    					} else {
    						return originalKeys(object);
    					}
    				};
    			}
    		} else {
    			Object.keys = keysShim;
    		}
    		return Object.keys || keysShim;
    	};

    	module.exports = keysShim;
    });

    var index$7 = interopDefault(index$6);



    var require$$0 = Object.freeze({
    	default: index$7
    });

    var index$8 = createCommonjsModule(function (module) {
        var hasOwn = Object.prototype.hasOwnProperty;
        var toString = Object.prototype.toString;

        module.exports = function forEach(obj, fn, ctx) {
            if (toString.call(fn) !== '[object Function]') {
                throw new TypeError('iterator must be a function');
            }
            var l = obj.length;
            if (l === +l) {
                for (var i = 0; i < l; i++) {
                    fn.call(ctx, obj[i], i, obj);
                }
            } else {
                for (var k in obj) {
                    if (hasOwn.call(obj, k)) {
                        fn.call(ctx, obj[k], k, obj);
                    }
                }
            }
        };
    });

    var index$9 = interopDefault(index$8);

var require$$0$2 = Object.freeze({
        default: index$9
    });

    var index$4 = createCommonjsModule(function (module) {
    	'use strict';

    	var keys = interopDefault(require$$0);
    	var foreach = interopDefault(require$$0$2);
    	var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

    	var toStr = Object.prototype.toString;

    	var isFunction = function isFunction(fn) {
    		return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
    	};

    	var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
    		var obj = {};
    		try {
    			Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
    			/* eslint-disable no-unused-vars, no-restricted-syntax */
    			for (var _ in obj) {
    				return false;
    			}
    			/* eslint-enable no-unused-vars, no-restricted-syntax */
    			return obj.x === obj;
    		} catch (e) {
    			/* this is IE 8. */
    			return false;
    		}
    	};
    	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

    	var defineProperty = function defineProperty(object, name, value, predicate) {
    		if (name in object && (!isFunction(predicate) || !predicate())) {
    			return;
    		}
    		if (supportsDescriptors) {
    			Object.defineProperty(object, name, {
    				configurable: true,
    				enumerable: false,
    				value: value,
    				writable: true
    			});
    		} else {
    			object[name] = value;
    		}
    	};

    	var defineProperties = function defineProperties(object, map) {
    		var predicates = arguments.length > 2 ? arguments[2] : {};
    		var props = keys(map);
    		if (hasSymbols) {
    			props = props.concat(Object.getOwnPropertySymbols(map));
    		}
    		foreach(props, function (name) {
    			defineProperty(object, name, map[name], predicates[name]);
    		});
    	};

    	defineProperties.supportsDescriptors = !!supportsDescriptors;

    	module.exports = defineProperties;
    });

    var index$5 = interopDefault(index$4);



    var require$$1 = Object.freeze({
    	default: index$5
    });

    var _isNaN = createCommonjsModule(function (module) {
    	module.exports = Number.isNaN || function isNaN(a) {
    		return a !== a;
    	};
    });

    var _isNaN$1 = interopDefault(_isNaN);

var require$$5 = Object.freeze({
    	default: _isNaN$1
    });

    var _isFinite = createCommonjsModule(function (module) {
      var $isNaN = Number.isNaN || function (a) {
        return a !== a;
      };

      module.exports = Number.isFinite || function (x) {
        return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
      };
    });

    var _isFinite$1 = interopDefault(_isFinite);

var require$$4 = Object.freeze({
      default: _isFinite$1
    });

    var assign = createCommonjsModule(function (module) {
    	var has = Object.prototype.hasOwnProperty;
    	module.exports = Object.assign || function assign(target, source) {
    		for (var key in source) {
    			if (has.call(source, key)) {
    				target[key] = source[key];
    			}
    		}
    		return target;
    	};
    });

    var assign$1 = interopDefault(assign);

var require$$7$1 = Object.freeze({
    	default: assign$1
    });

    var sign = createCommonjsModule(function (module) {
    	module.exports = function sign(number) {
    		return number >= 0 ? 1 : -1;
    	};
    });

    var sign$1 = interopDefault(sign);

var require$$3 = Object.freeze({
    	default: sign$1
    });

    var mod = createCommonjsModule(function (module) {
    	module.exports = function mod(number, modulo) {
    		var remain = number % modulo;
    		return Math.floor(remain >= 0 ? remain : remain + modulo);
    	};
    });

    var mod$1 = interopDefault(mod);

var require$$2 = Object.freeze({
    	default: mod$1
    });

    var isPrimitive = createCommonjsModule(function (module) {
    	module.exports = function isPrimitive(value) {
    		return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
    	};
    });

    var isPrimitive$1 = interopDefault(isPrimitive);



    var require$$4$1 = Object.freeze({
    	default: isPrimitive$1
    });

    var isPrimitive$2 = createCommonjsModule(function (module) {
    	module.exports = function isPrimitive(value) {
    		return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
    	};
    });

    var isPrimitive$3 = interopDefault(isPrimitive$2);



    var require$$1$2 = Object.freeze({
    	default: isPrimitive$3
    });

    var index$10 = createCommonjsModule(function (module) {
    	'use strict';

    	var fnToStr = Function.prototype.toString;

    	var constructorRegex = /^\s*class /;
    	var isES6ClassFn = function isES6ClassFn(value) {
    		try {
    			var fnStr = fnToStr.call(value);
    			var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
    			var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
    			var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
    			return constructorRegex.test(spaceStripped);
    		} catch (e) {
    			return false; // not a function
    		}
    	};

    	var tryFunctionObject = function tryFunctionObject(value) {
    		try {
    			if (isES6ClassFn(value)) {
    				return false;
    			}
    			fnToStr.call(value);
    			return true;
    		} catch (e) {
    			return false;
    		}
    	};
    	var toStr = Object.prototype.toString;
    	var fnClass = '[object Function]';
    	var genClass = '[object GeneratorFunction]';
    	var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

    	module.exports = function isCallable(value) {
    		if (!value) {
    			return false;
    		}
    		if (typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    			return false;
    		}
    		if (hasToStringTag) {
    			return tryFunctionObject(value);
    		}
    		if (isES6ClassFn(value)) {
    			return false;
    		}
    		var strClass = toStr.call(value);
    		return strClass === fnClass || strClass === genClass;
    	};
    });

    var index$11 = interopDefault(index$10);



    var require$$0$4 = Object.freeze({
    	default: index$11
    });

    var index$12 = createCommonjsModule(function (module) {
    	'use strict';

    	var getDay = Date.prototype.getDay;
    	var tryDateObject = function tryDateObject(value) {
    		try {
    			getDay.call(value);
    			return true;
    		} catch (e) {
    			return false;
    		}
    	};

    	var toStr = Object.prototype.toString;
    	var dateClass = '[object Date]';
    	var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

    	module.exports = function isDateObject(value) {
    		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null) {
    			return false;
    		}
    		return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
    	};
    });

    var index$13 = interopDefault(index$12);



    var require$$1$3 = Object.freeze({
    	default: index$13
    });

    var index$14 = createCommonjsModule(function (module) {
    	'use strict';

    	var toStr = Object.prototype.toString;
    	var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

    	if (hasSymbols) {
    		var symToStr = Symbol.prototype.toString;
    		var symStringRegex = /^Symbol\(.*\)$/;
    		var isSymbolObject = function isSymbolObject(value) {
    			if (_typeof(value.valueOf()) !== 'symbol') {
    				return false;
    			}
    			return symStringRegex.test(symToStr.call(value));
    		};
    		module.exports = function isSymbol(value) {
    			if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
    				return true;
    			}
    			if (toStr.call(value) !== '[object Symbol]') {
    				return false;
    			}
    			try {
    				return isSymbolObject(value);
    			} catch (e) {
    				return false;
    			}
    		};
    	} else {
    		module.exports = function isSymbol(value) {
    			// this environment does not support Symbols.
    			return false;
    		};
    	}
    });

    var index$15 = interopDefault(index$14);



    var require$$0$5 = Object.freeze({
    	default: index$15
    });

    var es6$2 = createCommonjsModule(function (module) {
    	'use strict';

    	var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';

    	var isPrimitive = interopDefault(require$$1$2);
    	var isCallable = interopDefault(require$$0$4);
    	var isDate = interopDefault(require$$1$3);
    	var isSymbol = interopDefault(require$$0$5);

    	var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
    		if (typeof O === 'undefined' || O === null) {
    			throw new TypeError('Cannot call method on ' + O);
    		}
    		if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
    			throw new TypeError('hint must be "string" or "number"');
    		}
    		var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
    		var method, result, i;
    		for (i = 0; i < methodNames.length; ++i) {
    			method = O[methodNames[i]];
    			if (isCallable(method)) {
    				result = method.call(O);
    				if (isPrimitive(result)) {
    					return result;
    				}
    			}
    		}
    		throw new TypeError('No default value');
    	};

    	var GetMethod = function GetMethod(O, P) {
    		var func = O[P];
    		if (func !== null && typeof func !== 'undefined') {
    			if (!isCallable(func)) {
    				throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
    			}
    			return func;
    		}
    	};

    	// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
    	module.exports = function ToPrimitive(input, PreferredType) {
    		if (isPrimitive(input)) {
    			return input;
    		}
    		var hint = 'default';
    		if (arguments.length > 1) {
    			if (PreferredType === String) {
    				hint = 'string';
    			} else if (PreferredType === Number) {
    				hint = 'number';
    			}
    		}

    		var exoticToPrim;
    		if (hasSymbols) {
    			if (Symbol.toPrimitive) {
    				exoticToPrim = GetMethod(input, Symbol.toPrimitive);
    			} else if (isSymbol(input)) {
    				exoticToPrim = Symbol.prototype.valueOf;
    			}
    		}
    		if (typeof exoticToPrim !== 'undefined') {
    			var result = exoticToPrim.call(input, hint);
    			if (isPrimitive(result)) {
    				return result;
    			}
    			throw new TypeError('unable to convert exotic object to primitive');
    		}
    		if (hint === 'default' && (isDate(input) || isSymbol(input))) {
    			hint = 'string';
    		}
    		return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
    	};
    });

    var es6$3 = interopDefault(es6$2);



    var require$$3$1 = Object.freeze({
    	default: es6$3
    });

    var implementation$2 = createCommonjsModule(function (module) {
        var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
        var slice = Array.prototype.slice;
        var toStr = Object.prototype.toString;
        var funcType = '[object Function]';

        module.exports = function bind(that) {
            var target = this;
            if (typeof target !== 'function' || toStr.call(target) !== funcType) {
                throw new TypeError(ERROR_MESSAGE + target);
            }
            var args = slice.call(arguments, 1);

            var bound;
            var binder = function binder() {
                if (this instanceof bound) {
                    var result = target.apply(this, args.concat(slice.call(arguments)));
                    if (Object(result) === result) {
                        return result;
                    }
                    return this;
                } else {
                    return target.apply(that, args.concat(slice.call(arguments)));
                }
            };

            var boundLength = Math.max(0, target.length - args.length);
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                boundArgs.push('$' + i);
            }

            bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

            if (target.prototype) {
                var Empty = function Empty() {};
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }

            return bound;
        };
    });

    var implementation$3 = interopDefault(implementation$2);

var require$$0$6 = Object.freeze({
        default: implementation$3
    });

    var index$16 = createCommonjsModule(function (module) {
      var implementation = interopDefault(require$$0$6);

      module.exports = Function.prototype.bind || implementation;
    });

    var index$17 = interopDefault(index$16);

var require$$1$4 = Object.freeze({
      default: index$17
    });

    var es5$2 = createCommonjsModule(function (module) {
    	'use strict';

    	var toStr = Object.prototype.toString;

    	var isPrimitive = interopDefault(require$$1$2);

    	var isCallable = interopDefault(require$$0$4);

    	// https://es5.github.io/#x8.12
    	var ES5internalSlots = {
    		'[[DefaultValue]]': function DefaultValue(O, hint) {
    			var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

    			if (actualHint === String || actualHint === Number) {
    				var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
    				var value, i;
    				for (i = 0; i < methods.length; ++i) {
    					if (isCallable(O[methods[i]])) {
    						value = O[methods[i]]();
    						if (isPrimitive(value)) {
    							return value;
    						}
    					}
    				}
    				throw new TypeError('No default value');
    			}
    			throw new TypeError('invalid [[DefaultValue]] hint supplied');
    		}
    	};

    	// https://es5.github.io/#x9
    	module.exports = function ToPrimitive(input, PreferredType) {
    		if (isPrimitive(input)) {
    			return input;
    		}
    		return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
    	};
    });

    var es5$3 = interopDefault(es5$2);

var require$$0$7 = Object.freeze({
    	default: es5$3
    });

    var es5 = createCommonjsModule(function (module) {
    	'use strict';

    	var $isNaN = interopDefault(require$$5);
    	var $isFinite = interopDefault(require$$4);

    	var sign = interopDefault(require$$3);
    	var mod = interopDefault(require$$2);

    	var IsCallable = interopDefault(require$$0$4);
    	var toPrimitive = interopDefault(require$$0$7);

    	// https://es5.github.io/#x9
    	var ES5 = {
    		ToPrimitive: toPrimitive,

    		ToBoolean: function ToBoolean(value) {
    			return Boolean(value);
    		},
    		ToNumber: function ToNumber(value) {
    			return Number(value);
    		},
    		ToInteger: function ToInteger(value) {
    			var number = this.ToNumber(value);
    			if ($isNaN(number)) {
    				return 0;
    			}
    			if (number === 0 || !$isFinite(number)) {
    				return number;
    			}
    			return sign(number) * Math.floor(Math.abs(number));
    		},
    		ToInt32: function ToInt32(x) {
    			return this.ToNumber(x) >> 0;
    		},
    		ToUint32: function ToUint32(x) {
    			return this.ToNumber(x) >>> 0;
    		},
    		ToUint16: function ToUint16(value) {
    			var number = this.ToNumber(value);
    			if ($isNaN(number) || number === 0 || !$isFinite(number)) {
    				return 0;
    			}
    			var posInt = sign(number) * Math.floor(Math.abs(number));
    			return mod(posInt, 0x10000);
    		},
    		ToString: function ToString(value) {
    			return String(value);
    		},
    		ToObject: function ToObject(value) {
    			this.CheckObjectCoercible(value);
    			return Object(value);
    		},
    		CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
    			/* jshint eqnull:true */
    			if (value == null) {
    				throw new TypeError(optMessage || 'Cannot call method on ' + value);
    			}
    			return value;
    		},
    		IsCallable: IsCallable,
    		SameValue: function SameValue(x, y) {
    			if (x === y) {
    				// 0 === -0, but they are not identical.
    				if (x === 0) {
    					return 1 / x === 1 / y;
    				}
    				return true;
    			}
    			return $isNaN(x) && $isNaN(y);
    		},

    		// http://www.ecma-international.org/ecma-262/5.1/#sec-8
    		Type: function Type(x) {
    			if (x === null) {
    				return 'Null';
    			}
    			if (typeof x === 'undefined') {
    				return 'Undefined';
    			}
    			if (typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
    				return 'Object';
    			}
    			if (typeof x === 'number') {
    				return 'Number';
    			}
    			if (typeof x === 'boolean') {
    				return 'Boolean';
    			}
    			if (typeof x === 'string') {
    				return 'String';
    			}
    		}
    	};

    	module.exports = ES5;
    });

    var es5$1 = interopDefault(es5);



    var require$$1$5 = Object.freeze({
    	default: es5$1
    });

    var index$20 = createCommonjsModule(function (module) {
      var bind = interopDefault(require$$1$4);

      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    });

    var index$21 = interopDefault(index$20);

var require$$0$9 = Object.freeze({
      default: index$21
    });

    var index$18 = createCommonjsModule(function (module) {
    	'use strict';

    	var has = interopDefault(require$$0$9);
    	var regexExec = RegExp.prototype.exec;
    	var gOPD = Object.getOwnPropertyDescriptor;

    	var tryRegexExecCall = function tryRegexExec(value) {
    		try {
    			var lastIndex = value.lastIndex;
    			value.lastIndex = 0;

    			regexExec.call(value);
    			return true;
    		} catch (e) {
    			return false;
    		} finally {
    			value.lastIndex = lastIndex;
    		}
    	};
    	var toStr = Object.prototype.toString;
    	var regexClass = '[object RegExp]';
    	var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

    	module.exports = function isRegex(value) {
    		if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
    			return false;
    		}
    		if (!hasToStringTag) {
    			return toStr.call(value) === regexClass;
    		}

    		var descriptor = gOPD(value, 'lastIndex');
    		var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
    		if (!hasLastIndexDataProperty) {
    			return false;
    		}

    		return tryRegexExecCall(value);
    	};
    });

    var index$19 = interopDefault(index$18);



    var require$$0$8 = Object.freeze({
    	default: index$19
    });

    var es6 = createCommonjsModule(function (module) {
    	'use strict';

    	var toStr = Object.prototype.toString;
    	var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';
    	var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

    	var $isNaN = interopDefault(require$$5);
    	var $isFinite = interopDefault(require$$4);
    	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

    	var assign = interopDefault(require$$7$1);
    	var sign = interopDefault(require$$3);
    	var mod = interopDefault(require$$2);
    	var isPrimitive = interopDefault(require$$4$1);
    	var toPrimitive = interopDefault(require$$3$1);
    	var parseInteger = parseInt;
    	var bind = interopDefault(require$$1$4);
    	var strSlice = bind.call(Function.call, String.prototype.slice);
    	var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
    	var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
    	var nonWS = ['\x85', '\u200B', '\uFFFE'].join('');
    	var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
    	var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
    	var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
    	var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

    	// whitespace from: http://es5.github.io/#x15.5.4.20
    	// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
    	var ws = ['\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
    	var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
    	var replace = bind.call(Function.call, String.prototype.replace);
    	var trim = function trim(value) {
    		return replace(value, trimRegex, '');
    	};

    	var ES5 = interopDefault(require$$1$5);

    	var hasRegExpMatcher = interopDefault(require$$0$8);

    	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
    	var ES6 = assign(assign({}, ES5), {

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
    		Call: function Call(F, V) {
    			var args = arguments.length > 2 ? arguments[2] : [];
    			if (!this.IsCallable(F)) {
    				throw new TypeError(F + ' is not a function');
    			}
    			return F.apply(V, args);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
    		ToPrimitive: toPrimitive,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
    		// ToBoolean: ES5.ToBoolean,

    		// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
    		ToNumber: function ToNumber(argument) {
    			var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
    			if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
    				throw new TypeError('Cannot convert a Symbol value to a number');
    			}
    			if (typeof value === 'string') {
    				if (isBinary(value)) {
    					return this.ToNumber(parseInteger(strSlice(value, 2), 2));
    				} else if (isOctal(value)) {
    					return this.ToNumber(parseInteger(strSlice(value, 2), 8));
    				} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
    					return NaN;
    				} else {
    					var trimmed = trim(value);
    					if (trimmed !== value) {
    						return this.ToNumber(trimmed);
    					}
    				}
    			}
    			return Number(value);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
    		// ToInteger: ES5.ToNumber,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
    		// ToInt32: ES5.ToInt32,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
    		// ToUint32: ES5.ToUint32,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
    		ToInt16: function ToInt16(argument) {
    			var int16bit = this.ToUint16(argument);
    			return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
    		// ToUint16: ES5.ToUint16,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
    		ToInt8: function ToInt8(argument) {
    			var int8bit = this.ToUint8(argument);
    			return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
    		ToUint8: function ToUint8(argument) {
    			var number = this.ToNumber(argument);
    			if ($isNaN(number) || number === 0 || !$isFinite(number)) {
    				return 0;
    			}
    			var posInt = sign(number) * Math.floor(Math.abs(number));
    			return mod(posInt, 0x100);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
    		ToUint8Clamp: function ToUint8Clamp(argument) {
    			var number = this.ToNumber(argument);
    			if ($isNaN(number) || number <= 0) {
    				return 0;
    			}
    			if (number >= 0xFF) {
    				return 0xFF;
    			}
    			var f = Math.floor(argument);
    			if (f + 0.5 < number) {
    				return f + 1;
    			}
    			if (number < f + 0.5) {
    				return f;
    			}
    			if (f % 2 !== 0) {
    				return f + 1;
    			}
    			return f;
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
    		ToString: function ToString(argument) {
    			if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol') {
    				throw new TypeError('Cannot convert a Symbol value to a string');
    			}
    			return String(argument);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
    		ToObject: function ToObject(value) {
    			this.RequireObjectCoercible(value);
    			return Object(value);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
    		ToPropertyKey: function ToPropertyKey(argument) {
    			var key = this.ToPrimitive(argument, String);
    			return (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    		ToLength: function ToLength(argument) {
    			var len = this.ToInteger(argument);
    			if (len <= 0) {
    				return 0;
    			} // includes converting -0 to +0
    			if (len > MAX_SAFE_INTEGER) {
    				return MAX_SAFE_INTEGER;
    			}
    			return len;
    		},

    		// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
    		CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
    			if (toStr.call(argument) !== '[object String]') {
    				throw new TypeError('must be a string');
    			}
    			if (argument === '-0') {
    				return -0;
    			}
    			var n = this.ToNumber(argument);
    			if (this.SameValue(this.ToString(n), argument)) {
    				return n;
    			}
    			return void 0;
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
    		RequireObjectCoercible: ES5.CheckObjectCoercible,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
    		IsArray: Array.isArray || function IsArray(argument) {
    			return toStr.call(argument) === '[object Array]';
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
    		// IsCallable: ES5.IsCallable,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
    		IsConstructor: function IsConstructor(argument) {
    			return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
    		IsExtensible: function IsExtensible(obj) {
    			if (!Object.preventExtensions) {
    				return true;
    			}
    			if (isPrimitive(obj)) {
    				return false;
    			}
    			return Object.isExtensible(obj);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
    		IsInteger: function IsInteger(argument) {
    			if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
    				return false;
    			}
    			var abs = Math.abs(argument);
    			return Math.floor(abs) === abs;
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
    		IsPropertyKey: function IsPropertyKey(argument) {
    			return typeof argument === 'string' || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol';
    		},

    		// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
    		IsRegExp: function IsRegExp(argument) {
    			if (!argument || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) !== 'object') {
    				return false;
    			}
    			if (hasSymbols) {
    				var isRegExp = argument[Symbol.match];
    				if (typeof isRegExp !== 'undefined') {
    					return ES5.ToBoolean(isRegExp);
    				}
    			}
    			return hasRegExpMatcher(argument);
    		},

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
    		// SameValue: ES5.SameValue,

    		// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
    		SameValueZero: function SameValueZero(x, y) {
    			return x === y || $isNaN(x) && $isNaN(y);
    		},

    		/**
       * 7.3.2 GetV (V, P)
       * 1. Assert: IsPropertyKey(P) is true.
       * 2. Let O be ToObject(V).
       * 3. ReturnIfAbrupt(O).
       * 4. Return O.[[Get]](P, V).
       */
    		GetV: function GetV(V, P) {
    			// 7.3.2.1
    			if (!this.IsPropertyKey(P)) {
    				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    			}

    			// 7.3.2.2-3
    			var O = this.ToObject(V);

    			// 7.3.2.4
    			return O[P];
    		},

    		/**
       * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
       * 1. Assert: IsPropertyKey(P) is true.
       * 2. Let func be GetV(O, P).
       * 3. ReturnIfAbrupt(func).
       * 4. If func is either undefined or null, return undefined.
       * 5. If IsCallable(func) is false, throw a TypeError exception.
       * 6. Return func.
       */
    		GetMethod: function GetMethod(O, P) {
    			// 7.3.9.1
    			if (!this.IsPropertyKey(P)) {
    				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    			}

    			// 7.3.9.2
    			var func = this.GetV(O, P);

    			// 7.3.9.4
    			if (func == null) {
    				return undefined;
    			}

    			// 7.3.9.5
    			if (!this.IsCallable(func)) {
    				throw new TypeError(P + 'is not a function');
    			}

    			// 7.3.9.6
    			return func;
    		},

    		/**
       * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
       * 1. Assert: Type(O) is Object.
       * 2. Assert: IsPropertyKey(P) is true.
       * 3. Return O.[[Get]](P, O).
       */
    		Get: function Get(O, P) {
    			// 7.3.1.1
    			if (this.Type(O) !== 'Object') {
    				throw new TypeError('Assertion failed: Type(O) is not Object');
    			}
    			// 7.3.1.2
    			if (!this.IsPropertyKey(P)) {
    				throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
    			}
    			// 7.3.1.3
    			return O[P];
    		},

    		Type: function Type(x) {
    			if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'symbol') {
    				return 'Symbol';
    			}
    			return ES5.Type(x);
    		},

    		// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
    		SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
    			if (this.Type(O) !== 'Object') {
    				throw new TypeError('Assertion failed: Type(O) is not Object');
    			}
    			var C = O.constructor;
    			if (typeof C === 'undefined') {
    				return defaultConstructor;
    			}
    			if (this.Type(C) !== 'Object') {
    				throw new TypeError('O.constructor is not an Object');
    			}
    			var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
    			if (S == null) {
    				return defaultConstructor;
    			}
    			if (this.IsConstructor(S)) {
    				return S;
    			}
    			throw new TypeError('no constructor found');
    		}
    	});

    	delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

    	module.exports = ES6;
    });

    var es6$1 = interopDefault(es6);



    var require$$1$1 = Object.freeze({
    	default: es6$1
    });

    var implementation = createCommonjsModule(function (module) {
    	'use strict';

    	var ES = interopDefault(require$$1$1);
    	var supportsDescriptors = interopDefault(require$$1).supportsDescriptors;

    	/*! https://mths.be/array-from v0.2.0 by @mathias */
    	module.exports = function from(arrayLike) {
    		var defineProperty = supportsDescriptors ? Object.defineProperty : function put(object, key, descriptor) {
    			object[key] = descriptor.value;
    		};
    		var C = this;
    		if (arrayLike === null || typeof arrayLike === 'undefined') {
    			throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
    		}
    		var items = ES.ToObject(arrayLike);

    		var mapFn, T;
    		if (typeof arguments[1] !== 'undefined') {
    			mapFn = arguments[1];
    			if (!ES.IsCallable(mapFn)) {
    				throw new TypeError('When provided, the second argument to `Array.from` must be a function');
    			}
    			if (arguments.length > 2) {
    				T = arguments[2];
    			}
    		}

    		var len = ES.ToLength(items.length);
    		var A = ES.IsCallable(C) ? ES.ToObject(new C(len)) : new Array(len);
    		var k = 0;
    		var kValue, mappedValue;
    		while (k < len) {
    			kValue = items[k];
    			if (mapFn) {
    				mappedValue = typeof T === 'undefined' ? mapFn(kValue, k) : ES.Call(mapFn, T, [kValue, k]);
    			} else {
    				mappedValue = kValue;
    			}
    			defineProperty(A, k, {
    				'configurable': true,
    				'enumerable': true,
    				'value': mappedValue,
    				'writable': true
    			});
    			k += 1;
    		}
    		A.length = len;
    		return A;
    	};
    });

    var implementation$1 = interopDefault(implementation);

var require$$0$3 = Object.freeze({
    	default: implementation$1
    });

    var polyfill = createCommonjsModule(function (module) {
    	'use strict';

    	var ES = interopDefault(require$$1$1);
    	var implementation = interopDefault(require$$0$3);

    	var tryCall = function tryCall(fn) {
    		try {
    			fn();
    			return true;
    		} catch (e) {
    			return false;
    		}
    	};

    	module.exports = function getPolyfill() {
    		var implemented = ES.IsCallable(Array.from) && tryCall(function () {
    			Array.from({ 'length': -Infinity });
    		}) && !tryCall(function () {
    			Array.from([], undefined);
    		});

    		return implemented ? Array.from : implementation;
    	};
    });

    var polyfill$1 = interopDefault(polyfill);

var require$$0$10 = Object.freeze({
    	default: polyfill$1
    });

    var shim = createCommonjsModule(function (module) {
    	'use strict';

    	var define = interopDefault(require$$1);
    	var getPolyfill = interopDefault(require$$0$10);

    	module.exports = function shimArrayFrom() {
    		var polyfill = getPolyfill();

    		define(Array, { 'from': polyfill }, {
    			'from': function from() {
    				return Array.from !== polyfill;
    			}
    		});

    		return polyfill;
    	};
    });

    var shim$1 = interopDefault(shim);

var require$$0$11 = Object.freeze({
    	default: shim$1
    });

    var index$2 = createCommonjsModule(function (module) {
    	'use strict';

    	var define = interopDefault(require$$1);

    	var implementation = interopDefault(require$$0$3);
    	var getPolyfill = interopDefault(require$$0$10);
    	var shim = interopDefault(require$$0$11);

    	// eslint-disable-next-line no-unused-vars
    	var boundFromShim = function from(array) {
    		// eslint-disable-next-line no-invalid-this
    		return implementation.apply(this || Array, arguments);
    	};

    	define(boundFromShim, {
    		'getPolyfill': getPolyfill,
    		'implementation': implementation,
    		'shim': shim
    	});

    	module.exports = boundFromShim;
    });

    var index$3 = interopDefault(index$2);

var require$$7 = Object.freeze({
    	default: index$3
    });

    var hasSymbols = createCommonjsModule(function (module) {
    	'use strict';

    	var keys = interopDefault(require$$0);

    	module.exports = function hasSymbols() {
    		if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    			return false;
    		}
    		if (_typeof(Symbol.iterator) === 'symbol') {
    			return true;
    		}

    		var obj = {};
    		var sym = Symbol('test');
    		var symObj = Object(sym);
    		if (typeof sym === 'string') {
    			return false;
    		}

    		if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    			return false;
    		}
    		if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    			return false;
    		}

    		// temp disabled per https://github.com/ljharb/object.assign/issues/17
    		// if (sym instanceof Symbol) { return false; }
    		// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
    		// if (!(symObj instanceof Symbol)) { return false; }

    		var symVal = 42;
    		obj[sym] = symVal;
    		for (sym in obj) {
    			return false;
    		}
    		if (keys(obj).length !== 0) {
    			return false;
    		}
    		if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    			return false;
    		}

    		if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    			return false;
    		}

    		var syms = Object.getOwnPropertySymbols(obj);
    		if (syms.length !== 1 || syms[0] !== sym) {
    			return false;
    		}

    		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    			return false;
    		}

    		if (typeof Object.getOwnPropertyDescriptor === 'function') {
    			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    			if (descriptor.value !== symVal || descriptor.enumerable !== true) {
    				return false;
    			}
    		}

    		return true;
    	};
    });

    var hasSymbols$1 = interopDefault(hasSymbols);



    var require$$0$13 = Object.freeze({
    	default: hasSymbols$1
    });

    var implementation$4 = createCommonjsModule(function (module) {
    	'use strict';

    	// modified from https://github.com/es-shims/es6-shim

    	var keys = interopDefault(require$$0);
    	var bind = interopDefault(require$$1$4);
    	var canBeObject = function canBeObject(obj) {
    		return typeof obj !== 'undefined' && obj !== null;
    	};
    	var hasSymbols = interopDefault(require$$0$13)();
    	var toObject = Object;
    	var push = bind.call(Function.call, Array.prototype.push);
    	var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);
    	var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

    	module.exports = function assign(target, source1) {
    		if (!canBeObject(target)) {
    			throw new TypeError('target must be an object');
    		}
    		var objTarget = toObject(target);
    		var s, source, i, props, syms, value, key;
    		for (s = 1; s < arguments.length; ++s) {
    			source = toObject(arguments[s]);
    			props = keys(source);
    			var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
    			if (getSymbols) {
    				syms = getSymbols(source);
    				for (i = 0; i < syms.length; ++i) {
    					key = syms[i];
    					if (propIsEnumerable(source, key)) {
    						push(props, key);
    					}
    				}
    			}
    			for (i = 0; i < props.length; ++i) {
    				key = props[i];
    				value = source[key];
    				if (propIsEnumerable(source, key)) {
    					objTarget[key] = value;
    				}
    			}
    		}
    		return objTarget;
    	};
    });

    var implementation$5 = interopDefault(implementation$4);

var require$$0$12 = Object.freeze({
    	default: implementation$5
    });

    var polyfill$2 = createCommonjsModule(function (module) {
    	'use strict';

    	var implementation = interopDefault(require$$0$12);

    	var lacksProperEnumerationOrder = function lacksProperEnumerationOrder() {
    		if (!Object.assign) {
    			return false;
    		}
    		// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
    		// note: this does not detect the bug unless there's 20 characters
    		var str = 'abcdefghijklmnopqrst';
    		var letters = str.split('');
    		var map = {};
    		for (var i = 0; i < letters.length; ++i) {
    			map[letters[i]] = letters[i];
    		}
    		var obj = Object.assign({}, map);
    		var actual = '';
    		for (var k in obj) {
    			actual += k;
    		}
    		return str !== actual;
    	};

    	var assignHasPendingExceptions = function assignHasPendingExceptions() {
    		if (!Object.assign || !Object.preventExtensions) {
    			return false;
    		}
    		// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
    		// which is 72% slower than our shim, and Firefox 40's native implementation.
    		var thrower = Object.preventExtensions({ 1: 2 });
    		try {
    			Object.assign(thrower, 'xy');
    		} catch (e) {
    			return thrower[1] === 'y';
    		}
    		return false;
    	};

    	module.exports = function getPolyfill() {
    		if (!Object.assign) {
    			return implementation;
    		}
    		if (lacksProperEnumerationOrder()) {
    			return implementation;
    		}
    		if (assignHasPendingExceptions()) {
    			return implementation;
    		}
    		return Object.assign;
    	};
    });

    var polyfill$3 = interopDefault(polyfill$2);

var require$$0$14 = Object.freeze({
    	default: polyfill$3
    });

    var shim$2 = createCommonjsModule(function (module) {
    	'use strict';

    	var define = interopDefault(require$$1);
    	var getPolyfill = interopDefault(require$$0$14);

    	module.exports = function shimAssign() {
    		var polyfill = getPolyfill();
    		define(Object, { assign: polyfill }, { assign: function assign() {
    				return Object.assign !== polyfill;
    			} });
    		return polyfill;
    	};
    });

    var shim$3 = interopDefault(shim$2);

var require$$0$15 = Object.freeze({
    	default: shim$3
    });

    var index$22 = createCommonjsModule(function (module) {
    	'use strict';

    	var defineProperties = interopDefault(require$$1);

    	var implementation = interopDefault(require$$0$12);
    	var getPolyfill = interopDefault(require$$0$14);
    	var shim = interopDefault(require$$0$15);

    	var polyfill = getPolyfill();

    	defineProperties(polyfill, {
    		implementation: implementation,
    		getPolyfill: getPolyfill,
    		shim: shim
    	});

    	module.exports = polyfill;
    });

    var index$23 = interopDefault(index$22);

var require$$6 = Object.freeze({
    	default: index$23
    });

    var es6Promise = createCommonjsModule(function (module, exports) {
      /*!
       * @overview es6-promise - a tiny implementation of Promises/A+.
       * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
       * @license   Licensed under MIT license
       *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
       * @version   4.0.5
       */

      (function (global, factory) {
        (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ES6Promise = factory();
      })(commonjsGlobal, function () {
        'use strict';

        function objectOrFunction(x) {
          return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
        }

        function isFunction(x) {
          return typeof x === 'function';
        }

        var _isArray = undefined;
        if (!Array.isArray) {
          _isArray = function _isArray(x) {
            return Object.prototype.toString.call(x) === '[object Array]';
          };
        } else {
          _isArray = Array.isArray;
        }

        var isArray = _isArray;

        var len = 0;
        var vertxNext = undefined;
        var customSchedulerFn = undefined;

        var asap = function asap(callback, arg) {
          queue[len] = callback;
          queue[len + 1] = arg;
          len += 2;
          if (len === 2) {
            // If len is 2, that means that we need to schedule an async flush.
            // If additional callbacks are queued before the queue is flushed, they
            // will be processed by this flush that we are scheduling.
            if (customSchedulerFn) {
              customSchedulerFn(flush);
            } else {
              scheduleFlush();
            }
          }
        };

        function setScheduler(scheduleFn) {
          customSchedulerFn = scheduleFn;
        }

        function setAsap(asapFn) {
          asap = asapFn;
        }

        var browserWindow = typeof window !== 'undefined' ? window : undefined;
        var browserGlobal = browserWindow || {};
        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
        var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

        // test for web worker but not in IE10
        var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

        // node
        function useNextTick() {
          // node version 0.10.x displays a deprecation warning when nextTick is used recursively
          // see https://github.com/cujojs/when/issues/410 for details
          return function () {
            return process.nextTick(flush);
          };
        }

        // vertx
        function useVertxTimer() {
          if (typeof vertxNext !== 'undefined') {
            return function () {
              vertxNext(flush);
            };
          }

          return useSetTimeout();
        }

        function useMutationObserver() {
          var iterations = 0;
          var observer = new BrowserMutationObserver(flush);
          var node = document.createTextNode('');
          observer.observe(node, { characterData: true });

          return function () {
            node.data = iterations = ++iterations % 2;
          };
        }

        // web worker
        function useMessageChannel() {
          var channel = new MessageChannel();
          channel.port1.onmessage = flush;
          return function () {
            return channel.port2.postMessage(0);
          };
        }

        function useSetTimeout() {
          // Store setTimeout reference so es6-promise will be unaffected by
          // other code modifying setTimeout (like sinon.useFakeTimers())
          var globalSetTimeout = setTimeout;
          return function () {
            return globalSetTimeout(flush, 1);
          };
        }

        var queue = new Array(1000);
        function flush() {
          for (var i = 0; i < len; i += 2) {
            var callback = queue[i];
            var arg = queue[i + 1];

            callback(arg);

            queue[i] = undefined;
            queue[i + 1] = undefined;
          }

          len = 0;
        }

        function attemptVertx() {
          try {
            var r = require;
            var vertx = r('vertx');
            vertxNext = vertx.runOnLoop || vertx.runOnContext;
            return useVertxTimer();
          } catch (e) {
            return useSetTimeout();
          }
        }

        var scheduleFlush = undefined;
        // Decide what async method to use to triggering processing of queued callbacks:
        if (isNode) {
          scheduleFlush = useNextTick();
        } else if (BrowserMutationObserver) {
          scheduleFlush = useMutationObserver();
        } else if (isWorker) {
          scheduleFlush = useMessageChannel();
        } else if (browserWindow === undefined && 'function' === 'function') {
          scheduleFlush = attemptVertx();
        } else {
          scheduleFlush = useSetTimeout();
        }

        function then(onFulfillment, onRejection) {
          var _arguments = arguments;

          var parent = this;

          var child = new this.constructor(noop);

          if (child[PROMISE_ID] === undefined) {
            makePromise(child);
          }

          var _state = parent._state;

          if (_state) {
            (function () {
              var callback = _arguments[_state - 1];
              asap(function () {
                return invokeCallback(_state, child, callback, parent._result);
              });
            })();
          } else {
            subscribe(parent, child, onFulfillment, onRejection);
          }

          return child;
        }

        /**
          `Promise.resolve` returns a promise that will become resolved with the
          passed `value`. It is shorthand for the following:
        
          ```javascript
          let promise = new Promise(function(resolve, reject){
            resolve(1);
          });
        
          promise.then(function(value){
            // value === 1
          });
          ```
        
          Instead of writing the above, your code now simply becomes the following:
        
          ```javascript
          let promise = Promise.resolve(1);
        
          promise.then(function(value){
            // value === 1
          });
          ```
        
          @method resolve
          @static
          @param {Any} value value that the returned promise will be resolved with
          Useful for tooling.
          @return {Promise} a promise that will become fulfilled with the given
          `value`
        */
        function resolve(object) {
          /*jshint validthis:true */
          var Constructor = this;

          if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
            return object;
          }

          var promise = new Constructor(noop);
          _resolve(promise, object);
          return promise;
        }

        var PROMISE_ID = Math.random().toString(36).substring(16);

        function noop() {}

        var PENDING = void 0;
        var FULFILLED = 1;
        var REJECTED = 2;

        var GET_THEN_ERROR = new ErrorObject();

        function selfFulfillment() {
          return new TypeError("You cannot resolve a promise with itself");
        }

        function cannotReturnOwn() {
          return new TypeError('A promises callback cannot return that same promise.');
        }

        function getThen(promise) {
          try {
            return promise.then;
          } catch (error) {
            GET_THEN_ERROR.error = error;
            return GET_THEN_ERROR;
          }
        }

        function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
          try {
            then.call(value, fulfillmentHandler, rejectionHandler);
          } catch (e) {
            return e;
          }
        }

        function handleForeignThenable(promise, thenable, then) {
          asap(function (promise) {
            var sealed = false;
            var error = tryThen(then, thenable, function (value) {
              if (sealed) {
                return;
              }
              sealed = true;
              if (thenable !== value) {
                _resolve(promise, value);
              } else {
                fulfill(promise, value);
              }
            }, function (reason) {
              if (sealed) {
                return;
              }
              sealed = true;

              _reject(promise, reason);
            }, 'Settle: ' + (promise._label || ' unknown promise'));

            if (!sealed && error) {
              sealed = true;
              _reject(promise, error);
            }
          }, promise);
        }

        function handleOwnThenable(promise, thenable) {
          if (thenable._state === FULFILLED) {
            fulfill(promise, thenable._result);
          } else if (thenable._state === REJECTED) {
            _reject(promise, thenable._result);
          } else {
            subscribe(thenable, undefined, function (value) {
              return _resolve(promise, value);
            }, function (reason) {
              return _reject(promise, reason);
            });
          }
        }

        function handleMaybeThenable(promise, maybeThenable, then$$) {
          if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
            handleOwnThenable(promise, maybeThenable);
          } else {
            if (then$$ === GET_THEN_ERROR) {
              _reject(promise, GET_THEN_ERROR.error);
            } else if (then$$ === undefined) {
              fulfill(promise, maybeThenable);
            } else if (isFunction(then$$)) {
              handleForeignThenable(promise, maybeThenable, then$$);
            } else {
              fulfill(promise, maybeThenable);
            }
          }
        }

        function _resolve(promise, value) {
          if (promise === value) {
            _reject(promise, selfFulfillment());
          } else if (objectOrFunction(value)) {
            handleMaybeThenable(promise, value, getThen(value));
          } else {
            fulfill(promise, value);
          }
        }

        function publishRejection(promise) {
          if (promise._onerror) {
            promise._onerror(promise._result);
          }

          publish(promise);
        }

        function fulfill(promise, value) {
          if (promise._state !== PENDING) {
            return;
          }

          promise._result = value;
          promise._state = FULFILLED;

          if (promise._subscribers.length !== 0) {
            asap(publish, promise);
          }
        }

        function _reject(promise, reason) {
          if (promise._state !== PENDING) {
            return;
          }
          promise._state = REJECTED;
          promise._result = reason;

          asap(publishRejection, promise);
        }

        function subscribe(parent, child, onFulfillment, onRejection) {
          var _subscribers = parent._subscribers;
          var length = _subscribers.length;

          parent._onerror = null;

          _subscribers[length] = child;
          _subscribers[length + FULFILLED] = onFulfillment;
          _subscribers[length + REJECTED] = onRejection;

          if (length === 0 && parent._state) {
            asap(publish, parent);
          }
        }

        function publish(promise) {
          var subscribers = promise._subscribers;
          var settled = promise._state;

          if (subscribers.length === 0) {
            return;
          }

          var child = undefined,
              callback = undefined,
              detail = promise._result;

          for (var i = 0; i < subscribers.length; i += 3) {
            child = subscribers[i];
            callback = subscribers[i + settled];

            if (child) {
              invokeCallback(settled, child, callback, detail);
            } else {
              callback(detail);
            }
          }

          promise._subscribers.length = 0;
        }

        function ErrorObject() {
          this.error = null;
        }

        var TRY_CATCH_ERROR = new ErrorObject();

        function tryCatch(callback, detail) {
          try {
            return callback(detail);
          } catch (e) {
            TRY_CATCH_ERROR.error = e;
            return TRY_CATCH_ERROR;
          }
        }

        function invokeCallback(settled, promise, callback, detail) {
          var hasCallback = isFunction(callback),
              value = undefined,
              error = undefined,
              succeeded = undefined,
              failed = undefined;

          if (hasCallback) {
            value = tryCatch(callback, detail);

            if (value === TRY_CATCH_ERROR) {
              failed = true;
              error = value.error;
              value = null;
            } else {
              succeeded = true;
            }

            if (promise === value) {
              _reject(promise, cannotReturnOwn());
              return;
            }
          } else {
            value = detail;
            succeeded = true;
          }

          if (promise._state !== PENDING) {
            // noop
          } else if (hasCallback && succeeded) {
            _resolve(promise, value);
          } else if (failed) {
            _reject(promise, error);
          } else if (settled === FULFILLED) {
            fulfill(promise, value);
          } else if (settled === REJECTED) {
            _reject(promise, value);
          }
        }

        function initializePromise(promise, resolver) {
          try {
            resolver(function resolvePromise(value) {
              _resolve(promise, value);
            }, function rejectPromise(reason) {
              _reject(promise, reason);
            });
          } catch (e) {
            _reject(promise, e);
          }
        }

        var id = 0;
        function nextId() {
          return id++;
        }

        function makePromise(promise) {
          promise[PROMISE_ID] = id++;
          promise._state = undefined;
          promise._result = undefined;
          promise._subscribers = [];
        }

        function Enumerator(Constructor, input) {
          this._instanceConstructor = Constructor;
          this.promise = new Constructor(noop);

          if (!this.promise[PROMISE_ID]) {
            makePromise(this.promise);
          }

          if (isArray(input)) {
            this._input = input;
            this.length = input.length;
            this._remaining = input.length;

            this._result = new Array(this.length);

            if (this.length === 0) {
              fulfill(this.promise, this._result);
            } else {
              this.length = this.length || 0;
              this._enumerate();
              if (this._remaining === 0) {
                fulfill(this.promise, this._result);
              }
            }
          } else {
            _reject(this.promise, validationError());
          }
        }

        function validationError() {
          return new Error('Array Methods must be provided an Array');
        };

        Enumerator.prototype._enumerate = function () {
          var length = this.length;
          var _input = this._input;

          for (var i = 0; this._state === PENDING && i < length; i++) {
            this._eachEntry(_input[i], i);
          }
        };

        Enumerator.prototype._eachEntry = function (entry, i) {
          var c = this._instanceConstructor;
          var resolve$$ = c.resolve;

          if (resolve$$ === resolve) {
            var _then = getThen(entry);

            if (_then === then && entry._state !== PENDING) {
              this._settledAt(entry._state, i, entry._result);
            } else if (typeof _then !== 'function') {
              this._remaining--;
              this._result[i] = entry;
            } else if (c === Promise) {
              var promise = new c(noop);
              handleMaybeThenable(promise, entry, _then);
              this._willSettleAt(promise, i);
            } else {
              this._willSettleAt(new c(function (resolve$$) {
                return resolve$$(entry);
              }), i);
            }
          } else {
            this._willSettleAt(resolve$$(entry), i);
          }
        };

        Enumerator.prototype._settledAt = function (state, i, value) {
          var promise = this.promise;

          if (promise._state === PENDING) {
            this._remaining--;

            if (state === REJECTED) {
              _reject(promise, value);
            } else {
              this._result[i] = value;
            }
          }

          if (this._remaining === 0) {
            fulfill(promise, this._result);
          }
        };

        Enumerator.prototype._willSettleAt = function (promise, i) {
          var enumerator = this;

          subscribe(promise, undefined, function (value) {
            return enumerator._settledAt(FULFILLED, i, value);
          }, function (reason) {
            return enumerator._settledAt(REJECTED, i, reason);
          });
        };

        /**
          `Promise.all` accepts an array of promises, and returns a new promise which
          is fulfilled with an array of fulfillment values for the passed promises, or
          rejected with the reason of the first passed promise to be rejected. It casts all
          elements of the passed iterable to promises as it runs this algorithm.
        
          Example:
        
          ```javascript
          let promise1 = resolve(1);
          let promise2 = resolve(2);
          let promise3 = resolve(3);
          let promises = [ promise1, promise2, promise3 ];
        
          Promise.all(promises).then(function(array){
            // The array here would be [ 1, 2, 3 ];
          });
          ```
        
          If any of the `promises` given to `all` are rejected, the first promise
          that is rejected will be given as an argument to the returned promises's
          rejection handler. For example:
        
          Example:
        
          ```javascript
          let promise1 = resolve(1);
          let promise2 = reject(new Error("2"));
          let promise3 = reject(new Error("3"));
          let promises = [ promise1, promise2, promise3 ];
        
          Promise.all(promises).then(function(array){
            // Code here never runs because there are rejected promises!
          }, function(error) {
            // error.message === "2"
          });
          ```
        
          @method all
          @static
          @param {Array} entries array of promises
          @param {String} label optional string for labeling the promise.
          Useful for tooling.
          @return {Promise} promise that is fulfilled when all `promises` have been
          fulfilled, or rejected if any of them become rejected.
          @static
        */
        function all(entries) {
          return new Enumerator(this, entries).promise;
        }

        /**
          `Promise.race` returns a new promise which is settled in the same way as the
          first passed promise to settle.
        
          Example:
        
          ```javascript
          let promise1 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 1');
            }, 200);
          });
        
          let promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 2');
            }, 100);
          });
        
          Promise.race([promise1, promise2]).then(function(result){
            // result === 'promise 2' because it was resolved before promise1
            // was resolved.
          });
          ```
        
          `Promise.race` is deterministic in that only the state of the first
          settled promise matters. For example, even if other promises given to the
          `promises` array argument are resolved, but the first settled promise has
          become rejected before the other promises became fulfilled, the returned
          promise will become rejected:
        
          ```javascript
          let promise1 = new Promise(function(resolve, reject){
            setTimeout(function(){
              resolve('promise 1');
            }, 200);
          });
        
          let promise2 = new Promise(function(resolve, reject){
            setTimeout(function(){
              reject(new Error('promise 2'));
            }, 100);
          });
        
          Promise.race([promise1, promise2]).then(function(result){
            // Code here never runs
          }, function(reason){
            // reason.message === 'promise 2' because promise 2 became rejected before
            // promise 1 became fulfilled
          });
          ```
        
          An example real-world use case is implementing timeouts:
        
          ```javascript
          Promise.race([ajax('foo.json'), timeout(5000)])
          ```
        
          @method race
          @static
          @param {Array} promises array of promises to observe
          Useful for tooling.
          @return {Promise} a promise which settles in the same way as the first passed
          promise to settle.
        */
        function race(entries) {
          /*jshint validthis:true */
          var Constructor = this;

          if (!isArray(entries)) {
            return new Constructor(function (_, reject) {
              return reject(new TypeError('You must pass an array to race.'));
            });
          } else {
            return new Constructor(function (resolve, reject) {
              var length = entries.length;
              for (var i = 0; i < length; i++) {
                Constructor.resolve(entries[i]).then(resolve, reject);
              }
            });
          }
        }

        /**
          `Promise.reject` returns a promise rejected with the passed `reason`.
          It is shorthand for the following:
        
          ```javascript
          let promise = new Promise(function(resolve, reject){
            reject(new Error('WHOOPS'));
          });
        
          promise.then(function(value){
            // Code here doesn't run because the promise is rejected!
          }, function(reason){
            // reason.message === 'WHOOPS'
          });
          ```
        
          Instead of writing the above, your code now simply becomes the following:
        
          ```javascript
          let promise = Promise.reject(new Error('WHOOPS'));
        
          promise.then(function(value){
            // Code here doesn't run because the promise is rejected!
          }, function(reason){
            // reason.message === 'WHOOPS'
          });
          ```
        
          @method reject
          @static
          @param {Any} reason value that the returned promise will be rejected with.
          Useful for tooling.
          @return {Promise} a promise rejected with the given `reason`.
        */
        function reject(reason) {
          /*jshint validthis:true */
          var Constructor = this;
          var promise = new Constructor(noop);
          _reject(promise, reason);
          return promise;
        }

        function needsResolver() {
          throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        }

        function needsNew() {
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }

        /**
          Promise objects represent the eventual result of an asynchronous operation. The
          primary way of interacting with a promise is through its `then` method, which
          registers callbacks to receive either a promise's eventual value or the reason
          why the promise cannot be fulfilled.
        
          Terminology
          -----------
        
          - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
          - `thenable` is an object or function that defines a `then` method.
          - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
          - `exception` is a value that is thrown using the throw statement.
          - `reason` is a value that indicates why a promise was rejected.
          - `settled` the final resting state of a promise, fulfilled or rejected.
        
          A promise can be in one of three states: pending, fulfilled, or rejected.
        
          Promises that are fulfilled have a fulfillment value and are in the fulfilled
          state.  Promises that are rejected have a rejection reason and are in the
          rejected state.  A fulfillment value is never a thenable.
        
          Promises can also be said to *resolve* a value.  If this value is also a
          promise, then the original promise's settled state will match the value's
          settled state.  So a promise that *resolves* a promise that rejects will
          itself reject, and a promise that *resolves* a promise that fulfills will
          itself fulfill.
        
        
          Basic Usage:
          ------------
        
          ```js
          let promise = new Promise(function(resolve, reject) {
            // on success
            resolve(value);
        
            // on failure
            reject(reason);
          });
        
          promise.then(function(value) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
        
          Advanced Usage:
          ---------------
        
          Promises shine when abstracting away asynchronous interactions such as
          `XMLHttpRequest`s.
        
          ```js
          function getJSON(url) {
            return new Promise(function(resolve, reject){
              let xhr = new XMLHttpRequest();
        
              xhr.open('GET', url);
              xhr.onreadystatechange = handler;
              xhr.responseType = 'json';
              xhr.setRequestHeader('Accept', 'application/json');
              xhr.send();
        
              function handler() {
                if (this.readyState === this.DONE) {
                  if (this.status === 200) {
                    resolve(this.response);
                  } else {
                    reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
                  }
                }
              };
            });
          }
        
          getJSON('/posts.json').then(function(json) {
            // on fulfillment
          }, function(reason) {
            // on rejection
          });
          ```
        
          Unlike callbacks, promises are great composable primitives.
        
          ```js
          Promise.all([
            getJSON('/posts'),
            getJSON('/comments')
          ]).then(function(values){
            values[0] // => postsJSON
            values[1] // => commentsJSON
        
            return values;
          });
          ```
        
          @class Promise
          @param {function} resolver
          Useful for tooling.
          @constructor
        */
        function Promise(resolver) {
          this[PROMISE_ID] = nextId();
          this._result = this._state = undefined;
          this._subscribers = [];

          if (noop !== resolver) {
            typeof resolver !== 'function' && needsResolver();
            this instanceof Promise ? initializePromise(this, resolver) : needsNew();
          }
        }

        Promise.all = all;
        Promise.race = race;
        Promise.resolve = resolve;
        Promise.reject = reject;
        Promise._setScheduler = setScheduler;
        Promise._setAsap = setAsap;
        Promise._asap = asap;

        Promise.prototype = {
          constructor: Promise,

          /**
            The primary way of interacting with a promise is through its `then` method,
            which registers callbacks to receive either a promise's eventual value or the
            reason why the promise cannot be fulfilled.
          
            ```js
            findUser().then(function(user){
              // user is available
            }, function(reason){
              // user is unavailable, and you are given the reason why
            });
            ```
          
            Chaining
            --------
          
            The return value of `then` is itself a promise.  This second, 'downstream'
            promise is resolved with the return value of the first promise's fulfillment
            or rejection handler, or rejected if the handler throws an exception.
          
            ```js
            findUser().then(function (user) {
              return user.name;
            }, function (reason) {
              return 'default name';
            }).then(function (userName) {
              // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
              // will be `'default name'`
            });
          
            findUser().then(function (user) {
              throw new Error('Found user, but still unhappy');
            }, function (reason) {
              throw new Error('`findUser` rejected and we're unhappy');
            }).then(function (value) {
              // never reached
            }, function (reason) {
              // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
              // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
            });
            ```
            If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
          
            ```js
            findUser().then(function (user) {
              throw new PedagogicalException('Upstream error');
            }).then(function (value) {
              // never reached
            }).then(function (value) {
              // never reached
            }, function (reason) {
              // The `PedgagocialException` is propagated all the way down to here
            });
            ```
          
            Assimilation
            ------------
          
            Sometimes the value you want to propagate to a downstream promise can only be
            retrieved asynchronously. This can be achieved by returning a promise in the
            fulfillment or rejection handler. The downstream promise will then be pending
            until the returned promise is settled. This is called *assimilation*.
          
            ```js
            findUser().then(function (user) {
              return findCommentsByAuthor(user);
            }).then(function (comments) {
              // The user's comments are now available
            });
            ```
          
            If the assimliated promise rejects, then the downstream promise will also reject.
          
            ```js
            findUser().then(function (user) {
              return findCommentsByAuthor(user);
            }).then(function (comments) {
              // If `findCommentsByAuthor` fulfills, we'll have the value here
            }, function (reason) {
              // If `findCommentsByAuthor` rejects, we'll have the reason here
            });
            ```
          
            Simple Example
            --------------
          
            Synchronous Example
          
            ```javascript
            let result;
          
            try {
              result = findResult();
              // success
            } catch(reason) {
              // failure
            }
            ```
          
            Errback Example
          
            ```js
            findResult(function(result, err){
              if (err) {
                // failure
              } else {
                // success
              }
            });
            ```
          
            Promise Example;
          
            ```javascript
            findResult().then(function(result){
              // success
            }, function(reason){
              // failure
            });
            ```
          
            Advanced Example
            --------------
          
            Synchronous Example
          
            ```javascript
            let author, books;
          
            try {
              author = findAuthor();
              books  = findBooksByAuthor(author);
              // success
            } catch(reason) {
              // failure
            }
            ```
          
            Errback Example
          
            ```js
          
            function foundBooks(books) {
          
            }
          
            function failure(reason) {
          
            }
          
            findAuthor(function(author, err){
              if (err) {
                failure(err);
                // failure
              } else {
                try {
                  findBoooksByAuthor(author, function(books, err) {
                    if (err) {
                      failure(err);
                    } else {
                      try {
                        foundBooks(books);
                      } catch(reason) {
                        failure(reason);
                      }
                    }
                  });
                } catch(error) {
                  failure(err);
                }
                // success
              }
            });
            ```
          
            Promise Example;
          
            ```javascript
            findAuthor().
              then(findBooksByAuthor).
              then(function(books){
                // found books
            }).catch(function(reason){
              // something went wrong
            });
            ```
          
            @method then
            @param {Function} onFulfilled
            @param {Function} onRejected
            Useful for tooling.
            @return {Promise}
          */
          then: then,

          /**
            `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
            as the catch block of a try/catch statement.
          
            ```js
            function findAuthor(){
              throw new Error('couldn't find that author');
            }
          
            // synchronous
            try {
              findAuthor();
            } catch(reason) {
              // something went wrong
            }
          
            // async with promises
            findAuthor().catch(function(reason){
              // something went wrong
            });
            ```
          
            @method catch
            @param {Function} onRejection
            Useful for tooling.
            @return {Promise}
          */
          'catch': function _catch(onRejection) {
            return this.then(null, onRejection);
          }
        };

        function polyfill() {
          var local = undefined;

          if (typeof commonjsGlobal !== 'undefined') {
            local = commonjsGlobal;
          } else if (typeof self !== 'undefined') {
            local = self;
          } else {
            try {
              local = Function('return this')();
            } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
            }
          }

          var P = local.Promise;

          if (P) {
            var promiseToString = null;
            try {
              promiseToString = Object.prototype.toString.call(P.resolve());
            } catch (e) {
              // silently ignored
            }

            if (promiseToString === '[object Promise]' && !P.cast) {
              return;
            }
          }

          local.Promise = Promise;
        }

        // Strange compat..
        Promise.polyfill = polyfill;
        Promise.Promise = Promise;

        return Promise;
      });
      });

    var es6Promise$1 = interopDefault(es6Promise);



    var require$$5$1 = Object.freeze({
      default: es6Promise$1
    });

    window.customElements && eval("/**\n * @license\n * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.\n * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n * Code distributed by Google as part of the polymer project is also\n * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n */\n\n/**\n * This shim allows elements written in, or compiled to, ES5 to work on native\n * implementations of Custom Elements.\n *\n * ES5-style classes don't work with native Custom Elements because the\n * HTMLElement constructor uses the value of `new.target` to look up the custom\n * element definition for the currently called constructor. `new.target` is only\n * set when `new` is called and is only propagated via super() calls. super()\n * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works\n * when extending other ES5-style classes, and does not propagate `new.target`.\n *\n * This shim allows the native HTMLElement constructor to work by generating and\n * registering a stand-in class instead of the users custom element class. This\n * stand-in class's constructor has an actual call to super().\n * `customElements.define()` and `customElements.get()` are both overridden to\n * hide this stand-in class from users.\n *\n * In order to create instance of the user-defined class, rather than the stand\n * in, the stand-in's constructor swizzles its instances prototype and invokes\n * the user-defined constructor. When the user-defined constructor is called\n * directly it creates an instance of the stand-in class to get a real extension\n * of HTMLElement and returns that.\n *\n * There are two important constructors: A patched HTMLElement constructor, and\n * the StandInElement constructor. They both will be called to create an element\n * but which is called first depends on whether the browser creates the element\n * or the user-defined constructor is called directly. The variables\n * `browserConstruction` and `userConstruction` control the flow between the\n * two constructors.\n *\n * This shim should be better than forcing the polyfill because:\n *   1. It's smaller\n *   2. All reaction timings are the same as native (mostly synchronous)\n *   3. All reaction triggering DOM operations are automatically supported\n *\n * There are some restrictions and requirements on ES5 constructors:\n *   1. All constructors in a inheritance hierarchy must be ES5-style, so that\n *      they can be called with Function.call(). This effectively means that the\n *      whole application must be compiled to ES5.\n *   2. Constructors must return the value of the emulated super() call. Like\n *      `return SuperClass.call(this)`\n *   3. The `this` reference should not be used before the emulated super() call\n *      just like `this` is illegal to use before super() in ES6.\n *   4. Constructors should not create other custom elements before the emulated\n *      super() call. This is the same restriction as with native custom\n *      elements.\n *\n *  Compiling valid class-based custom elements to ES5 will satisfy these\n *  requirements with the latest version of popular transpilers.\n */\n(() => {\n  'use strict';\n\n  // Do nothing if `customElements` does not exist.\n  if (!window.customElements) return;\n\n  const NativeHTMLElement = window.HTMLElement;\n  const nativeDefine = window.customElements.define;\n  const nativeGet = window.customElements.get;\n\n  /**\n   * Map of user-provided constructors to tag names.\n   *\n   * @type {Map<Function, string>}\n   */\n  const tagnameByConstructor = new Map();\n\n  /**\n   * Map of tag names to user-provided constructors.\n   *\n   * @type {Map<string, Function>}\n   */\n  const constructorByTagname = new Map();\n\n\n  /**\n   * Whether the constructors are being called by a browser process, ie parsing\n   * or createElement.\n   */\n  let browserConstruction = false;\n\n  /**\n   * Whether the constructors are being called by a user-space process, ie\n   * calling an element constructor.\n   */\n  let userConstruction = false;\n\n  window.HTMLElement = function() {\n    if (!browserConstruction) {\n      const tagname = tagnameByConstructor.get(this.constructor);\n      const fakeClass = nativeGet.call(window.customElements, tagname);\n\n      // Make sure that the fake constructor doesn't call back to this constructor\n      userConstruction = true;\n      const instance = new (fakeClass)();\n      return instance;\n    }\n    // Else do nothing. This will be reached by ES5-style classes doing\n    // HTMLElement.call() during initialization\n    browserConstruction = false;\n  };\n  // By setting the patched HTMLElement's prototype property to the native\n  // HTMLElement's prototype we make sure that:\n  //     document.createElement('a') instanceof HTMLElement\n  // works because instanceof uses HTMLElement.prototype, which is on the\n  // ptototype chain of built-in elements.\n  window.HTMLElement.prototype = NativeHTMLElement.prototype;\n\n  window.customElements.define = (tagname, elementClass) => {\n    const elementProto = elementClass.prototype;\n    const StandInElement = class extends NativeHTMLElement {\n      constructor() {\n        // Call the native HTMLElement constructor, this gives us the\n        // under-construction instance as `this`:\n        super();\n\n        // The prototype will be wrong up because the browser used our fake\n        // class, so fix it:\n        Object.setPrototypeOf(this, elementProto);\n\n        if (!userConstruction) {\n          // Make sure that user-defined constructor bottom's out to a do-nothing\n          // HTMLElement() call\n          browserConstruction = true;\n          // Call the user-defined constructor on our instance:\n          elementClass.call(this);\n        }\n        userConstruction = false;\n      }\n    };\n    const standInProto = StandInElement.prototype;\n    StandInElement.observedAttributes = elementClass.observedAttributes;\n    standInProto.connectedCallback = elementProto.connectedCallback;\n    standInProto.disconnectedCallback = elementProto.disconnectedCallback;\n    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;\n    standInProto.adoptedCallback = elementProto.adoptedCallback;\n\n    tagnameByConstructor.set(elementClass, tagname);\n    constructorByTagname.set(tagname, elementClass);\n    nativeDefine.call(window.customElements, tagname, StandInElement);\n  };\n\n  window.customElements.get = (tagname) => constructorByTagname.get(tagname);\n\n})();");

    /**
     * @license
     * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
     */

    // minimal template polyfill
    (function () {

      var needsTemplate = typeof HTMLTemplateElement === 'undefined';

      // NOTE: Patch document.importNode to work around IE11 bug that
      // casues children of a document fragment imported while
      // there is a mutation observer to not have a parentNode (!?!)
      // It's important that this is the first patch to `importNode` so that
      // dom produced for later patches is correct.
      if (/Trident/.test(navigator.userAgent)) {
        (function () {
          var Native_importNode = Document.prototype.importNode;
          Document.prototype.importNode = function () {
            var n = Native_importNode.apply(this, arguments);
            // Copy all children to a new document fragment since
            // this one may be broken
            if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
              var f = this.createDocumentFragment();
              f.appendChild(n);
              return f;
            } else {
              return n;
            }
          };
        })();
      }

      // NOTE: we rely on this cloneNode not causing element upgrade.
      // This means this polyfill must load before the CE polyfill and
      // this would need to be re-worked if a browser supports native CE
      // but not <template>.
      var Native_cloneNode = Node.prototype.cloneNode;
      var Native_createElement = Document.prototype.createElement;
      var Native_importNode = Document.prototype.importNode;

      // returns true if nested templates cannot be cloned (they cannot be on
      // some impl's like Safari 8 and Edge)
      // OR if cloning a document fragment does not result in a document fragment
      var needsCloning = function () {
        if (!needsTemplate) {
          var t = document.createElement('template');
          var t2 = document.createElement('template');
          t2.content.appendChild(document.createElement('div'));
          t.content.appendChild(t2);
          var clone = t.cloneNode(true);
          return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0 || !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);
        }
      }();

      var TEMPLATE_TAG = 'template';
      var PolyfilledHTMLTemplateElement = function PolyfilledHTMLTemplateElement() {};

      if (needsTemplate) {
        var defineInnerHTML = function defineInnerHTML(obj) {
          Object.defineProperty(obj, 'innerHTML', {
            get: function get() {
              var o = '';
              for (var e = this.content.firstChild; e; e = e.nextSibling) {
                o += e.outerHTML || escapeData(e.data);
              }
              return o;
            },
            set: function set(text) {
              contentDoc.body.innerHTML = text;
              PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
              while (this.content.firstChild) {
                this.content.removeChild(this.content.firstChild);
              }
              while (contentDoc.body.firstChild) {
                this.content.appendChild(contentDoc.body.firstChild);
              }
            },
            configurable: true
          });
        };

        var escapeReplace = function escapeReplace(c) {
          switch (c) {
            case '&':
              return '&amp;';
            case '<':
              return '&lt;';
            case '>':
              return '&gt;';
            case '\xA0':
              return '&nbsp;';
          }
        };

        var escapeData = function escapeData(s) {
          return s.replace(escapeDataRegExp, escapeReplace);
        };

        var contentDoc = document.implementation.createHTMLDocument('template');
        var canDecorate = true;

        var templateStyle = document.createElement('style');
        templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

        var head = document.head;
        head.insertBefore(templateStyle, head.firstElementChild);

        /**
          Provides a minimal shim for the <template> element.
        */
        PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);

        // if elements do not have `innerHTML` on instances, then
        // templates can be patched by swizzling their prototypes.
        var canProtoPatch = !document.createElement('div').hasOwnProperty('innerHTML');

        /**
          The `decorate` method moves element children to the template's `content`.
          NOTE: there is no support for dynamically adding elements to templates.
        */
        PolyfilledHTMLTemplateElement.decorate = function (template) {
          // if the template is decorated, return fast
          if (template.content) {
            return;
          }
          template.content = contentDoc.createDocumentFragment();
          var child;
          while (child = template.firstChild) {
            template.content.appendChild(child);
          }
          // NOTE: prefer prototype patching for performance and
          // because on some browsers (IE11), re-defining `innerHTML`
          // can result in intermittent errors.
          if (canProtoPatch) {
            template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
          } else {
            template.cloneNode = function (deep) {
              return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
            };
            // add innerHTML to template, if possible
            // Note: this throws on Safari 7
            if (canDecorate) {
              try {
                defineInnerHTML(template);
              } catch (err) {
                canDecorate = false;
              }
            }
          }
          // bootstrap recursively
          PolyfilledHTMLTemplateElement.bootstrap(template.content);
        };

        defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);

        /**
          The `bootstrap` method is called automatically and "fixes" all
          <template> elements in the document referenced by the `doc` argument.
        */
        PolyfilledHTMLTemplateElement.bootstrap = function (doc) {
          var templates = doc.querySelectorAll(TEMPLATE_TAG);
          for (var i = 0, l = templates.length, t; i < l && (t = templates[i]); i++) {
            PolyfilledHTMLTemplateElement.decorate(t);
          }
        };

        // auto-bootstrapping for main document
        document.addEventListener('DOMContentLoaded', function () {
          PolyfilledHTMLTemplateElement.bootstrap(document);
        });

        // Patch document.createElement to ensure newly created templates have content
        Document.prototype.createElement = function () {
          'use strict';

          var el = Native_createElement.apply(this, arguments);
          if (el.localName === 'template') {
            PolyfilledHTMLTemplateElement.decorate(el);
          }
          return el;
        };

        var escapeDataRegExp = /[&\u00A0<>]/g;
      }

      // make cloning/importing work!
      if (needsTemplate || needsCloning) {

        PolyfilledHTMLTemplateElement._cloneNode = function (template, deep) {
          var clone = Native_cloneNode.call(template, false);
          // NOTE: decorate doesn't auto-fix children because they are already
          // decorated so they need special clone fixup.
          if (this.decorate) {
            this.decorate(clone);
          }
          if (deep) {
            // NOTE: use native clone node to make sure CE's wrapped
            // cloneNode does not cause elements to upgrade.
            clone.content.appendChild(Native_cloneNode.call(template.content, true));
            // now ensure nested templates are cloned correctly.
            this.fixClonedDom(clone.content, template.content);
          }
          return clone;
        };

        PolyfilledHTMLTemplateElement.prototype.cloneNode = function (deep) {
          return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        };

        // Given a source and cloned subtree, find <template>'s in the cloned
        // subtree and replace them with cloned <template>'s from source.
        // We must do this because only the source templates have proper .content.
        PolyfilledHTMLTemplateElement.fixClonedDom = function (clone, source) {
          // do nothing if cloned node is not an element
          if (!source.querySelectorAll) return;
          // these two lists should be coincident
          var s$ = source.querySelectorAll(TEMPLATE_TAG);
          var t$ = clone.querySelectorAll(TEMPLATE_TAG);
          for (var i = 0, l = t$.length, t, s; i < l; i++) {
            s = s$[i];
            t = t$[i];
            if (this.decorate) {
              this.decorate(s);
            }
            t.parentNode.replaceChild(s.cloneNode(true), t);
          }
        };

        // override all cloning to fix the cloned subtree to contain properly
        // cloned templates.
        Node.prototype.cloneNode = function (deep) {
          var dom;
          // workaround for Edge bug cloning documentFragments
          // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
          if (this instanceof DocumentFragment) {
            if (!deep) {
              return this.ownerDocument.createDocumentFragment();
            } else {
              dom = this.ownerDocument.importNode(this, true);
            }
          } else {
            dom = Native_cloneNode.call(this, deep);
          }
          // template.content is cloned iff `deep`.
          if (deep) {
            PolyfilledHTMLTemplateElement.fixClonedDom(dom, this);
          }
          return dom;
        };

        // NOTE: we are cloning instead of importing <template>'s.
        // However, the ownerDocument of the cloned template will be correct!
        // This is because the native import node creates the right document owned
        // subtree and `fixClonedDom` inserts cloned templates into this subtree,
        // thus updating the owner doc.
        Document.prototype.importNode = function (element, deep) {
          if (element.localName === TEMPLATE_TAG) {
            return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
          } else {
            var dom = Native_importNode.call(this, element, deep);
            if (deep) {
              PolyfilledHTMLTemplateElement.fixClonedDom(dom, element);
            }
            return dom;
          }
        };

        if (needsCloning) {
          window.HTMLTemplateElement.prototype.cloneNode = function (deep) {
            return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
          };
        }
      }

      if (needsTemplate) {
        window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
      }
    })();

    var reservedTagList = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

    /**
     * @param {string} localName
     * @returns {boolean}
     */
    function isValidCustomElementName(localName) {
      var reserved = reservedTagList.has(localName);
      var validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
      return !reserved && validForm;
    }

    /**
     * @private
     * @param {!Node} node
     * @return {boolean}
     */
    function isConnected(node) {
      // Use `Node#isConnected`, if defined.
      var nativeValue = node.isConnected;
      if (nativeValue !== undefined) {
        return nativeValue;
      }

      /** @type {?Node|undefined} */
      var current = node;
      while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
        current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
      }
      return !!(current && (current.__CE_isImportDocument || current instanceof Document));
    }

    /**
     * @param {!Node} root
     * @param {!Node} start
     * @return {?Node}
     */
    function nextSiblingOrAncestorSibling(root, start) {
      var node = start;
      while (node && node !== root && !node.nextSibling) {
        node = node.parentNode;
      }
      return !node || node === root ? null : node.nextSibling;
    }

    /**
     * @param {!Node} root
     * @param {!Node} start
     * @return {?Node}
     */
    function nextNode(root, start) {
      return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
    }

    /**
     * @param {!Node} root
     * @param {!function(!Element)} callback
     * @param {!Set<Node>=} visitedImports
     */
    function walkDeepDescendantElements(root, callback) {
      var visitedImports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

      var node = root;
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          var element = /** @type {!Element} */node;

          callback(element);

          var localName = element.localName;
          if (localName === 'link' && element.getAttribute('rel') === 'import') {
            // If this import (polyfilled or not) has it's root node available,
            // walk it.
            var importNode = /** @type {!Node} */element.import;
            if (importNode instanceof Node && !visitedImports.has(importNode)) {
              // Prevent multiple walks of the same import root.
              visitedImports.add(importNode);

              for (var child = importNode.firstChild; child; child = child.nextSibling) {
                walkDeepDescendantElements(child, callback, visitedImports);
              }
            }

            // Ignore descendants of import links to prevent attempting to walk the
            // elements created by the HTML Imports polyfill that we just walked
            // above.
            node = nextSiblingOrAncestorSibling(root, element);
            continue;
          } else if (localName === 'template') {
            // Ignore descendants of templates. There shouldn't be any descendants
            // because they will be moved into `.content` during construction in
            // browsers that support template but, in case they exist and are still
            // waiting to be moved by a polyfill, they will be ignored.
            node = nextSiblingOrAncestorSibling(root, element);
            continue;
          }

          // Walk shadow roots.
          var shadowRoot = element.__CE_shadowRoot;
          if (shadowRoot) {
            for (var _child = shadowRoot.firstChild; _child; _child = _child.nextSibling) {
              walkDeepDescendantElements(_child, callback, visitedImports);
            }
          }
        }

        node = nextNode(root, node);
      }
    }

    /**
     * Used to suppress Closure's "Modifying the prototype is only allowed if the
     * constructor is in the same scope" warning without using
     * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
     *
     * @param {!Object} destination
     * @param {string} name
     * @param {*} value
     */
    function setPropertyUnchecked(destination, name, value) {
      destination[name] = value;
    }

    /**
     * @enum {number}
     */
    var CustomElementState = {
      custom: 1,
      failed: 2
    };

    var CustomElementInternals = function () {
      function CustomElementInternals() {
        classCallCheck(this, CustomElementInternals);

        /** @type {!Map<string, !CustomElementDefinition>} */
        this._localNameToDefinition = new Map();

        /** @type {!Map<!Function, !CustomElementDefinition>} */
        this._constructorToDefinition = new Map();

        /** @type {!Array<!function(!Node)>} */
        this._patches = [];

        /** @type {boolean} */
        this._hasPatches = false;
      }

      /**
       * @param {string} localName
       * @param {!CustomElementDefinition} definition
       */


      createClass(CustomElementInternals, [{
        key: 'setDefinition',
        value: function setDefinition(localName, definition) {
          this._localNameToDefinition.set(localName, definition);
          this._constructorToDefinition.set(definition.constructor, definition);
        }

        /**
         * @param {string} localName
         * @return {!CustomElementDefinition|undefined}
         */

      }, {
        key: 'localNameToDefinition',
        value: function localNameToDefinition(localName) {
          return this._localNameToDefinition.get(localName);
        }

        /**
         * @param {!Function} constructor
         * @return {!CustomElementDefinition|undefined}
         */

      }, {
        key: 'constructorToDefinition',
        value: function constructorToDefinition(constructor) {
          return this._constructorToDefinition.get(constructor);
        }

        /**
         * @param {!function(!Node)} listener
         */

      }, {
        key: 'addPatch',
        value: function addPatch(listener) {
          this._hasPatches = true;
          this._patches.push(listener);
        }

        /**
         * @param {!Node} node
         */

      }, {
        key: 'patchTree',
        value: function patchTree(node) {
          var _this = this;

          if (!this._hasPatches) return;

          walkDeepDescendantElements(node, function (element) {
            return _this.patch(element);
          });
        }

        /**
         * @param {!Node} node
         */

      }, {
        key: 'patch',
        value: function patch(node) {
          if (!this._hasPatches) return;

          if (node.__CE_patched) return;
          node.__CE_patched = true;

          for (var i = 0; i < this._patches.length; i++) {
            this._patches[i](node);
          }
        }

        /**
         * @param {!Node} root
         */

      }, {
        key: 'connectTree',
        value: function connectTree(root) {
          var elements = [];

          walkDeepDescendantElements(root, function (element) {
            return elements.push(element);
          });

          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.__CE_state === CustomElementState.custom) {
              this.connectedCallback(element);
            } else {
              this.upgradeElement(element);
            }
          }
        }

        /**
         * @param {!Node} root
         */

      }, {
        key: 'disconnectTree',
        value: function disconnectTree(root) {
          var elements = [];

          walkDeepDescendantElements(root, function (element) {
            return elements.push(element);
          });

          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.__CE_state === CustomElementState.custom) {
              this.disconnectedCallback(element);
            }
          }
        }

        /**
         * Upgrades all uncustomized custom elements at and below a root node for
         * which there is a definition. When custom element reaction callbacks are
         * assumed to be called synchronously (which, by the current DOM / HTML spec
         * definitions, they are *not*), callbacks for both elements customized
         * synchronously by the parser and elements being upgraded occur in the same
         * relative order.
         *
         * NOTE: This function, when used to simulate the construction of a tree that
         * is already created but not customized (i.e. by the parser), does *not*
         * prevent the element from reading the 'final' (true) state of the tree. For
         * example, the element, during truly synchronous parsing / construction would
         * see that it contains no children as they have not yet been inserted.
         * However, this function does not modify the tree, the element will
         * (incorrectly) have children. Additionally, self-modification restrictions
         * for custom element constructors imposed by the DOM spec are *not* enforced.
         *
         *
         * The following nested list shows the steps extending down from the HTML
         * spec's parsing section that cause elements to be synchronously created and
         * upgraded:
         *
         * The "in body" insertion mode:
         * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
         * - Switch on token:
         *   .. other cases ..
         *   -> Any other start tag
         *      - [Insert an HTML element](below) for the token.
         *
         * Insert an HTML element:
         * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
         * - Insert a foreign element for the token in the HTML namespace:
         *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
         *   - Create an element for a token:
         *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
         *     - Will execute script flag is true?
         *       - (Element queue pushed to the custom element reactions stack.)
         *     - Create an element:
         *       https://dom.spec.whatwg.org/#concept-create-element
         *       - Sync CE flag is true?
         *         - Constructor called.
         *         - Self-modification restrictions enforced.
         *       - Sync CE flag is false?
         *         - (Upgrade reaction enqueued.)
         *     - Attributes appended to element.
         *       (`attributeChangedCallback` reactions enqueued.)
         *     - Will execute script flag is true?
         *       - (Element queue popped from the custom element reactions stack.
         *         Reactions in the popped stack are invoked.)
         *   - (Element queue pushed to the custom element reactions stack.)
         *   - Insert the element:
         *     https://dom.spec.whatwg.org/#concept-node-insert
         *     - Shadow-including descendants are connected. During parsing
         *       construction, there are no shadow-*excluding* descendants.
         *       However, the constructor may have validly attached a shadow
         *       tree to itself and added descendants to that shadow tree.
         *       (`connectedCallback` reactions enqueued.)
         *   - (Element queue popped from the custom element reactions stack.
         *     Reactions in the popped stack are invoked.)
         *
         * @param {!Node} root
         * @param {!Set<Node>=} visitedImports
         */

      }, {
        key: 'patchAndUpgradeTree',
        value: function patchAndUpgradeTree(root) {
          var _this2 = this;

          var visitedImports = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

          var elements = [];

          var gatherElements = function gatherElements(element) {
            if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
              // The HTML Imports polyfill sets a descendant element of the link to
              // the `import` property, specifically this is *not* a Document.
              var importNode = /** @type {?Node} */element.import;

              if (importNode instanceof Node && importNode.readyState === 'complete') {
                importNode.__CE_isImportDocument = true;

                // Connected links are associated with the registry.
                importNode.__CE_hasRegistry = true;
              } else {
                // If this link's import root is not available, its contents can't be
                // walked. Wait for 'load' and walk it when it's ready.
                element.addEventListener('load', function () {
                  var importNode = /** @type {!Node} */element.import;

                  if (importNode.__CE_documentLoadHandled) return;
                  importNode.__CE_documentLoadHandled = true;

                  importNode.__CE_isImportDocument = true;

                  // Connected links are associated with the registry.
                  importNode.__CE_hasRegistry = true;

                  // Clone the `visitedImports` set that was populated sync during
                  // the `patchAndUpgradeTree` call that caused this 'load' handler to
                  // be added. Then, remove *this* link's import node so that we can
                  // walk that import again, even if it was partially walked later
                  // during the same `patchAndUpgradeTree` call.
                  var clonedVisitedImports = new Set(visitedImports);
                  visitedImports.delete(importNode);

                  _this2.patchAndUpgradeTree(importNode, visitedImports);
                });
              }
            } else {
              elements.push(element);
            }
          };

          // `walkDeepDescendantElements` populates (and internally checks against)
          // `visitedImports` when traversing a loaded import.
          walkDeepDescendantElements(root, gatherElements, visitedImports);

          if (this._hasPatches) {
            for (var i = 0; i < elements.length; i++) {
              this.patch(elements[i]);
            }
          }

          for (var _i = 0; _i < elements.length; _i++) {
            this.upgradeElement(elements[_i]);
          }
        }

        /**
         * @param {!Element} element
         */

      }, {
        key: 'upgradeElement',
        value: function upgradeElement(element) {
          var currentState = element.__CE_state;
          if (currentState !== undefined) return;

          var definition = this.localNameToDefinition(element.localName);
          if (!definition) return;

          definition.constructionStack.push(element);

          var constructor = definition.constructor;
          try {
            try {
              var result = new constructor();
              if (result !== element) {
                throw new Error('The custom element constructor did not produce the element being upgraded.');
              }
            } finally {
              definition.constructionStack.pop();
            }
          } catch (e) {
            element.__CE_state = CustomElementState.failed;
            throw e;
          }

          element.__CE_state = CustomElementState.custom;
          element.__CE_definition = definition;

          if (definition.attributeChangedCallback) {
            var observedAttributes = definition.observedAttributes;
            for (var i = 0; i < observedAttributes.length; i++) {
              var name = observedAttributes[i];
              var value = element.getAttribute(name);
              if (value !== null) {
                this.attributeChangedCallback(element, name, null, value, null);
              }
            }
          }

          if (isConnected(element)) {
            this.connectedCallback(element);
          }
        }

        /**
         * @param {!Element} element
         */

      }, {
        key: 'connectedCallback',
        value: function connectedCallback(element) {
          var definition = element.__CE_definition;
          if (definition.connectedCallback) {
            definition.connectedCallback.call(element);
          }
        }

        /**
         * @param {!Element} element
         */

      }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback(element) {
          var definition = element.__CE_definition;
          if (definition.disconnectedCallback) {
            definition.disconnectedCallback.call(element);
          }
        }

        /**
         * @param {!Element} element
         * @param {string} name
         * @param {?string} oldValue
         * @param {?string} newValue
         * @param {?string} namespace
         */

      }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(element, name, oldValue, newValue, namespace) {
          var definition = element.__CE_definition;
          if (definition.attributeChangedCallback && definition.observedAttributes.indexOf(name) > -1) {
            definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
          }
        }
      }]);
      return CustomElementInternals;
    }();

    var DocumentConstructionObserver = function () {
      function DocumentConstructionObserver(internals, doc) {
        classCallCheck(this, DocumentConstructionObserver);

        /**
         * @type {!CustomElementInternals}
         */
        this._internals = internals;

        /**
         * @type {!Document}
         */
        this._document = doc;

        /**
         * @type {MutationObserver|undefined}
         */
        this._observer = undefined;

        // Simulate tree construction for all currently accessible nodes in the
        // document.
        this._internals.patchAndUpgradeTree(this._document);

        if (this._document.readyState === 'loading') {
          this._observer = new MutationObserver(this._handleMutations.bind(this));

          // Nodes created by the parser are given to the observer *before* the next
          // task runs. Inline scripts are run in a new task. This means that the
          // observer will be able to handle the newly parsed nodes before the inline
          // script is run.
          this._observer.observe(this._document, {
            childList: true,
            subtree: true
          });
        }
      }

      createClass(DocumentConstructionObserver, [{
        key: 'disconnect',
        value: function disconnect() {
          if (this._observer) {
            this._observer.disconnect();
          }
        }

        /**
         * @param {!Array<!MutationRecord>} mutations
         */

      }, {
        key: '_handleMutations',
        value: function _handleMutations(mutations) {
          // Once the document's `readyState` is 'interactive' or 'complete', all new
          // nodes created within that document will be the result of script and
          // should be handled by patching.
          var readyState = this._document.readyState;
          if (readyState === 'interactive' || readyState === 'complete') {
            this.disconnect();
          }

          for (var i = 0; i < mutations.length; i++) {
            var addedNodes = mutations[i].addedNodes;
            for (var j = 0; j < addedNodes.length; j++) {
              var node = addedNodes[j];
              this._internals.patchAndUpgradeTree(node);
            }
          }
        }
      }]);
      return DocumentConstructionObserver;
    }();

    /**
     * @template T
     */
    var Deferred = function () {
      function Deferred() {
        var _this = this;

        classCallCheck(this, Deferred);

        /**
         * @private
         * @type {T|undefined}
         */
        this._value = undefined;

        /**
         * @private
         * @type {Function|undefined}
         */
        this._resolve = undefined;

        /**
         * @private
         * @type {!Promise<T>}
         */
        this._promise = new Promise(function (resolve) {
          _this._resolve = resolve;

          if (_this._value) {
            resolve(_this._value);
          }
        });
      }

      /**
       * @param {T} value
       */


      createClass(Deferred, [{
        key: 'resolve',
        value: function resolve(value) {
          if (this._value) {
            throw new Error('Already resolved.');
          }

          this._value = value;

          if (this._resolve) {
            this._resolve(value);
          }
        }

        /**
         * @return {!Promise<T>}
         */

      }, {
        key: 'toPromise',
        value: function toPromise() {
          return this._promise;
        }
      }]);
      return Deferred;
    }();

    /**
     * @unrestricted
     */

    var CustomElementRegistry = function () {

      /**
       * @param {!CustomElementInternals} internals
       */
      function CustomElementRegistry(internals) {
        classCallCheck(this, CustomElementRegistry);

        /**
         * @private
         * @type {boolean}
         */
        this._elementDefinitionIsRunning = false;

        /**
         * @private
         * @type {!CustomElementInternals}
         */
        this._internals = internals;

        /**
         * @private
         * @type {!Map<string, !Deferred<undefined>>}
         */
        this._whenDefinedDeferred = new Map();

        /**
         * The default flush callback triggers the document walk synchronously.
         * @private
         * @type {!Function}
         */
        this._flushCallback = function (fn) {
          return fn();
        };

        /**
         * @private
         * @type {boolean}
         */
        this._flushPending = false;

        /**
         * @private
         * @type {!Array<string>}
         */
        this._unflushedLocalNames = [];

        /**
         * @private
         * @type {!DocumentConstructionObserver}
         */
        this._documentConstructionObserver = new DocumentConstructionObserver(internals, document);
      }

      /**
       * @param {string} localName
       * @param {!Function} constructor
       */


      createClass(CustomElementRegistry, [{
        key: 'define',
        value: function define(localName, constructor) {
          var _this = this;

          if (!(constructor instanceof Function)) {
            throw new TypeError('Custom element constructors must be functions.');
          }

          if (!isValidCustomElementName(localName)) {
            throw new SyntaxError('The element name \'' + localName + '\' is not valid.');
          }

          if (this._internals.localNameToDefinition(localName)) {
            throw new Error('A custom element with name \'' + localName + '\' has already been defined.');
          }

          if (this._elementDefinitionIsRunning) {
            throw new Error('A custom element is already being defined.');
          }
          this._elementDefinitionIsRunning = true;

          var connectedCallback = void 0;
          var disconnectedCallback = void 0;
          var adoptedCallback = void 0;
          var attributeChangedCallback = void 0;
          var observedAttributes = void 0;
          try {
            var getCallback = function getCallback(name) {
              var callbackValue = prototype[name];
              if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
                throw new Error('The \'' + name + '\' callback must be a function.');
              }
              return callbackValue;
            };

            /** @type {!Object} */
            var prototype = constructor.prototype;
            if (!(prototype instanceof Object)) {
              throw new TypeError('The custom element constructor\'s prototype is not an object.');
            }

            connectedCallback = getCallback('connectedCallback');
            disconnectedCallback = getCallback('disconnectedCallback');
            adoptedCallback = getCallback('adoptedCallback');
            attributeChangedCallback = getCallback('attributeChangedCallback');
            observedAttributes = constructor['observedAttributes'] || [];
          } catch (e) {
            return;
          } finally {
            this._elementDefinitionIsRunning = false;
          }

          var definition = {
            localName: localName,
            constructor: constructor,
            connectedCallback: connectedCallback,
            disconnectedCallback: disconnectedCallback,
            adoptedCallback: adoptedCallback,
            attributeChangedCallback: attributeChangedCallback,
            observedAttributes: observedAttributes,
            constructionStack: []
          };

          this._internals.setDefinition(localName, definition);

          this._unflushedLocalNames.push(localName);

          // If we've already called the flush callback and it hasn't called back yet,
          // don't call it again.
          if (!this._flushPending) {
            this._flushPending = true;
            this._flushCallback(function () {
              return _this._flush();
            });
          }
        }
      }, {
        key: '_flush',
        value: function _flush() {
          // If no new definitions were defined, don't attempt to flush. This could
          // happen if a flush callback keeps the function it is given and calls it
          // multiple times.
          if (this._flushPending === false) return;

          this._flushPending = false;
          this._internals.patchAndUpgradeTree(document);

          while (this._unflushedLocalNames.length > 0) {
            var localName = this._unflushedLocalNames.shift();
            var deferred = this._whenDefinedDeferred.get(localName);
            if (deferred) {
              deferred.resolve(undefined);
            }
          }
        }

        /**
         * @param {string} localName
         * @return {Function|undefined}
         */

      }, {
        key: 'get',
        value: function get(localName) {
          var definition = this._internals.localNameToDefinition(localName);
          if (definition) {
            return definition.constructor;
          }

          return undefined;
        }

        /**
         * @param {string} localName
         * @return {!Promise<undefined>}
         */

      }, {
        key: 'whenDefined',
        value: function whenDefined(localName) {
          if (!isValidCustomElementName(localName)) {
            return Promise.reject(new SyntaxError('\'' + localName + '\' is not a valid custom element name.'));
          }

          var prior = this._whenDefinedDeferred.get(localName);
          if (prior) {
            return prior.toPromise();
          }

          var deferred = new Deferred();
          this._whenDefinedDeferred.set(localName, deferred);

          var definition = this._internals.localNameToDefinition(localName);
          // Resolve immediately only if the given local name has a definition *and*
          // the full document walk to upgrade elements with that local name has
          // already happened.
          if (definition && this._unflushedLocalNames.indexOf(localName) === -1) {
            deferred.resolve(undefined);
          }

          return deferred.toPromise();
        }
      }, {
        key: 'polyfillWrapFlushCallback',
        value: function polyfillWrapFlushCallback(outer) {
          this._documentConstructionObserver.disconnect();
          var inner = this._flushCallback;
          this._flushCallback = function (flush) {
            return outer(function () {
              return inner(flush);
            });
          };
        }
      }]);
      return CustomElementRegistry;
    }();

    window['CustomElementRegistry'] = CustomElementRegistry;
    CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
    CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
    CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
    CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;

    var Native = {
      Document_createElement: window.Document.prototype.createElement,
      Document_createElementNS: window.Document.prototype.createElementNS,
      Document_importNode: window.Document.prototype.importNode,
      Document_prepend: window.Document.prototype['prepend'],
      Document_append: window.Document.prototype['append'],
      Node_cloneNode: window.Node.prototype.cloneNode,
      Node_appendChild: window.Node.prototype.appendChild,
      Node_insertBefore: window.Node.prototype.insertBefore,
      Node_removeChild: window.Node.prototype.removeChild,
      Node_replaceChild: window.Node.prototype.replaceChild,
      Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
      Element_attachShadow: window.Element.prototype['attachShadow'],
      Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
      Element_getAttribute: window.Element.prototype.getAttribute,
      Element_setAttribute: window.Element.prototype.setAttribute,
      Element_removeAttribute: window.Element.prototype.removeAttribute,
      Element_getAttributeNS: window.Element.prototype.getAttributeNS,
      Element_setAttributeNS: window.Element.prototype.setAttributeNS,
      Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
      Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
      Element_prepend: window.Element.prototype['prepend'],
      Element_append: window.Element.prototype['append'],
      Element_before: window.Element.prototype['before'],
      Element_after: window.Element.prototype['after'],
      Element_replaceWith: window.Element.prototype['replaceWith'],
      Element_remove: window.Element.prototype['remove'],
      HTMLElement: window.HTMLElement,
      HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
      HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement']
    };

    /**
     * This class exists only to work around Closure's lack of a way to describe
     * singletons. It represents the 'already constructed marker' used in custom
     * element construction stacks.
     *
     * https://html.spec.whatwg.org/#concept-already-constructed-marker
     */
    var AlreadyConstructedMarker = function AlreadyConstructedMarker() {
      classCallCheck(this, AlreadyConstructedMarker);
    };

    var AlreadyConstructedMarker$1 = new AlreadyConstructedMarker();

    /**
     * @param {!CustomElementInternals} internals
     */
    function PatchHTMLElement (internals) {
      window['HTMLElement'] = function () {
        /**
         * @type {function(new: HTMLElement): !HTMLElement}
         */
        function HTMLElement() {
          // This should really be `new.target` but `new.target` can't be emulated
          // in ES5. Assuming the user keeps the default value of the constructor's
          // prototype's `constructor` property, this is equivalent.
          /** @type {!Function} */
          var constructor = this.constructor;

          var definition = internals.constructorToDefinition(constructor);
          if (!definition) {
            throw new Error('The custom element being constructed was not registered with `customElements`.');
          }

          var constructionStack = definition.constructionStack;

          if (constructionStack.length === 0) {
            var _element = Native.Document_createElement.call(document, definition.localName);
            Object.setPrototypeOf(_element, constructor.prototype);
            _element.__CE_state = CustomElementState.custom;
            _element.__CE_definition = definition;
            internals.patch(_element);
            return _element;
          }

          var lastIndex = constructionStack.length - 1;
          var element = constructionStack[lastIndex];
          if (element === AlreadyConstructedMarker$1) {
            throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
          }
          constructionStack[lastIndex] = AlreadyConstructedMarker$1;

          Object.setPrototypeOf(element, constructor.prototype);
          internals.patch( /** @type {!HTMLElement} */element);

          return element;
        }

        HTMLElement.prototype = Native.HTMLElement.prototype;

        return HTMLElement;
      }();
    };

    /**
     * @param {!CustomElementInternals} internals
     * @param {!Object} destination
     * @param {!ParentNodeNativeMethods} builtIn
     */
    function PatchParentNode (internals, destination, builtIn) {
      /**
       * @param {...(!Node|string)} nodes
       */
      destination['prepend'] = function () {
        for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
          nodes[_key] = arguments[_key];
        }

        // TODO: Fix this for when one of `nodes` is a DocumentFragment!
        var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
          // DocumentFragments are not connected and will not be added to the list.
          return node instanceof Node && isConnected(node);
        });

        builtIn.prepend.apply(this, nodes);

        for (var i = 0; i < connectedBefore.length; i++) {
          internals.disconnectTree(connectedBefore[i]);
        }

        if (isConnected(this)) {
          for (var _i = 0; _i < nodes.length; _i++) {
            var node = nodes[_i];
            if (node instanceof Element) {
              internals.connectTree(node);
            }
          }
        }
      };

      /**
       * @param {...(!Node|string)} nodes
       */
      destination['append'] = function () {
        for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nodes[_key2] = arguments[_key2];
        }

        // TODO: Fix this for when one of `nodes` is a DocumentFragment!
        var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
          // DocumentFragments are not connected and will not be added to the list.
          return node instanceof Node && isConnected(node);
        });

        builtIn.append.apply(this, nodes);

        for (var i = 0; i < connectedBefore.length; i++) {
          internals.disconnectTree(connectedBefore[i]);
        }

        if (isConnected(this)) {
          for (var _i2 = 0; _i2 < nodes.length; _i2++) {
            var node = nodes[_i2];
            if (node instanceof Element) {
              internals.connectTree(node);
            }
          }
        }
      };
    };

    /**
     * @param {!CustomElementInternals} internals
     */
    function PatchDocument (internals) {
      setPropertyUnchecked(Document.prototype, 'createElement',
      /**
       * @this {Document}
       * @param {string} localName
       * @return {!Element}
       */
      function (localName) {
        // Only create custom elements if this document is associated with the registry.
        if (this.__CE_hasRegistry) {
          var definition = internals.localNameToDefinition(localName);
          if (definition) {
            return new definition.constructor();
          }
        }

        var result = /** @type {!Element} */
        Native.Document_createElement.call(this, localName);
        internals.patch(result);
        return result;
      });

      setPropertyUnchecked(Document.prototype, 'importNode',
      /**
       * @this {Document}
       * @param {!Node} node
       * @param {boolean=} deep
       * @return {!Node}
       */
      function (node, deep) {
        var clone = Native.Document_importNode.call(this, node, deep);
        // Only create custom elements if this document is associated with the registry.
        if (!this.__CE_hasRegistry) {
          internals.patchTree(clone);
        } else {
          internals.patchAndUpgradeTree(clone);
        }
        return clone;
      });

      var NS_HTML = "http://www.w3.org/1999/xhtml";

      setPropertyUnchecked(Document.prototype, 'createElementNS',
      /**
       * @this {Document}
       * @param {?string} namespace
       * @param {string} localName
       * @return {!Element}
       */
      function (namespace, localName) {
        // Only create custom elements if this document is associated with the registry.
        if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
          var definition = internals.localNameToDefinition(localName);
          if (definition) {
            return new definition.constructor();
          }
        }

        var result = /** @type {!Element} */
        Native.Document_createElementNS.call(this, namespace, localName);
        internals.patch(result);
        return result;
      });

      PatchParentNode(internals, Document.prototype, {
        prepend: Native.Document_prepend,
        append: Native.Document_append
      });
    };

    /**
     * @param {!CustomElementInternals} internals
     */
    function PatchNode (internals) {
      // `Node#nodeValue` is implemented on `Attr`.
      // `Node#textContent` is implemented on `Attr`, `Element`.

      setPropertyUnchecked(Node.prototype, 'insertBefore',
      /**
       * @this {Node}
       * @param {!Node} node
       * @param {?Node} refNode
       * @return {!Node}
       */
      function (node, refNode) {
        if (node instanceof DocumentFragment) {
          var insertedNodes = Array.prototype.slice.apply(node.childNodes);
          var _nativeResult = Native.Node_insertBefore.call(this, node, refNode);

          // DocumentFragments can't be connected, so `disconnectTree` will never
          // need to be called on a DocumentFragment's children after inserting it.

          if (isConnected(this)) {
            for (var i = 0; i < insertedNodes.length; i++) {
              internals.connectTree(insertedNodes[i]);
            }
          }

          return _nativeResult;
        }

        var nodeWasConnected = isConnected(node);
        var nativeResult = Native.Node_insertBefore.call(this, node, refNode);

        if (nodeWasConnected) {
          internals.disconnectTree(node);
        }

        if (isConnected(this)) {
          internals.connectTree(node);
        }

        return nativeResult;
      });

      setPropertyUnchecked(Node.prototype, 'appendChild',
      /**
       * @this {Node}
       * @param {!Node} node
       * @return {!Node}
       */
      function (node) {
        if (node instanceof DocumentFragment) {
          var insertedNodes = Array.prototype.slice.apply(node.childNodes);
          var _nativeResult2 = Native.Node_appendChild.call(this, node);

          // DocumentFragments can't be connected, so `disconnectTree` will never
          // need to be called on a DocumentFragment's children after inserting it.

          if (isConnected(this)) {
            for (var i = 0; i < insertedNodes.length; i++) {
              internals.connectTree(insertedNodes[i]);
            }
          }

          return _nativeResult2;
        }

        var nodeWasConnected = isConnected(node);
        var nativeResult = Native.Node_appendChild.call(this, node);

        if (nodeWasConnected) {
          internals.disconnectTree(node);
        }

        if (isConnected(this)) {
          internals.connectTree(node);
        }

        return nativeResult;
      });

      setPropertyUnchecked(Node.prototype, 'cloneNode',
      /**
       * @this {Node}
       * @param {boolean=} deep
       * @return {!Node}
       */
      function (deep) {
        var clone = Native.Node_cloneNode.call(this, deep);
        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(clone);
        } else {
          internals.patchAndUpgradeTree(clone);
        }
        return clone;
      });

      setPropertyUnchecked(Node.prototype, 'removeChild',
      /**
       * @this {Node}
       * @param {!Node} node
       * @return {!Node}
       */
      function (node) {
        var nodeWasConnected = isConnected(node);
        var nativeResult = Native.Node_removeChild.call(this, node);

        if (nodeWasConnected) {
          internals.disconnectTree(node);
        }

        return nativeResult;
      });

      setPropertyUnchecked(Node.prototype, 'replaceChild',
      /**
       * @this {Node}
       * @param {!Node} nodeToInsert
       * @param {!Node} nodeToRemove
       * @return {!Node}
       */
      function (nodeToInsert, nodeToRemove) {
        if (nodeToInsert instanceof DocumentFragment) {
          var insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
          var _nativeResult3 = Native.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

          // DocumentFragments can't be connected, so `disconnectTree` will never
          // need to be called on a DocumentFragment's children after inserting it.

          if (isConnected(this)) {
            internals.disconnectTree(nodeToRemove);
            for (var i = 0; i < insertedNodes.length; i++) {
              internals.connectTree(insertedNodes[i]);
            }
          }

          return _nativeResult3;
        }

        var nodeToInsertWasConnected = isConnected(nodeToInsert);
        var nativeResult = Native.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
        var thisIsConnected = isConnected(this);

        if (thisIsConnected) {
          internals.disconnectTree(nodeToRemove);
        }

        if (nodeToInsertWasConnected) {
          internals.disconnectTree(nodeToInsert);
        }

        if (thisIsConnected) {
          internals.connectTree(nodeToInsert);
        }

        return nativeResult;
      });

      function patch_textContent(destination, baseDescriptor) {
        Object.defineProperty(destination, 'textContent', {
          enumerable: baseDescriptor.enumerable,
          configurable: true,
          get: baseDescriptor.get,
          set: /** @this {Node} */function set(assignedValue) {
            // If this is a text node then there are no nodes to disconnect.
            if (this.nodeType === Node.TEXT_NODE) {
              baseDescriptor.set.call(this, assignedValue);
              return;
            }

            var removedNodes = undefined;
            // Checking for `firstChild` is faster than reading `childNodes.length`
            // to compare with 0.
            if (this.firstChild) {
              // Using `childNodes` is faster than `children`, even though we only
              // care about elements.
              var childNodes = this.childNodes;
              var childNodesLength = childNodes.length;
              if (childNodesLength > 0 && isConnected(this)) {
                // Copying an array by iterating is faster than using slice.
                removedNodes = new Array(childNodesLength);
                for (var i = 0; i < childNodesLength; i++) {
                  removedNodes[i] = childNodes[i];
                }
              }
            }

            baseDescriptor.set.call(this, assignedValue);

            if (removedNodes) {
              for (var _i = 0; _i < removedNodes.length; _i++) {
                internals.disconnectTree(removedNodes[_i]);
              }
            }
          }
        });
      }

      if (Native.Node_textContent && Native.Node_textContent.get) {
        patch_textContent(Node.prototype, Native.Node_textContent);
      } else {
        internals.addPatch(function (element) {
          patch_textContent(element, {
            enumerable: true,
            configurable: true,
            // NOTE: This implementation of the `textContent` getter assumes that
            // text nodes' `textContent` getter will not be patched.
            get: /** @this {Node} */function get() {
              /** @type {!Array<string>} */
              var parts = [];

              for (var i = 0; i < this.childNodes.length; i++) {
                parts.push(this.childNodes[i].textContent);
              }

              return parts.join('');
            },
            set: /** @this {Node} */function set(assignedValue) {
              while (this.firstChild) {
                Native.Node_removeChild.call(this, this.firstChild);
              }
              Native.Node_appendChild.call(this, document.createTextNode(assignedValue));
            }
          });
        });
      }
    };

    /**
     * @param {!CustomElementInternals} internals
     * @param {!Object} destination
     * @param {!ChildNodeNativeMethods} builtIn
     */
    function PatchChildNode (internals, destination, builtIn) {
      /**
       * @param {...(!Node|string)} nodes
       */
      destination['before'] = function () {
        for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
          nodes[_key] = arguments[_key];
        }

        // TODO: Fix this for when one of `nodes` is a DocumentFragment!
        var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
          // DocumentFragments are not connected and will not be added to the list.
          return node instanceof Node && isConnected(node);
        });

        builtIn.before.apply(this, nodes);

        for (var i = 0; i < connectedBefore.length; i++) {
          internals.disconnectTree(connectedBefore[i]);
        }

        if (isConnected(this)) {
          for (var _i = 0; _i < nodes.length; _i++) {
            var node = nodes[_i];
            if (node instanceof Element) {
              internals.connectTree(node);
            }
          }
        }
      };

      /**
       * @param {...(!Node|string)} nodes
       */
      destination['after'] = function () {
        for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nodes[_key2] = arguments[_key2];
        }

        // TODO: Fix this for when one of `nodes` is a DocumentFragment!
        var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
          // DocumentFragments are not connected and will not be added to the list.
          return node instanceof Node && isConnected(node);
        });

        builtIn.after.apply(this, nodes);

        for (var i = 0; i < connectedBefore.length; i++) {
          internals.disconnectTree(connectedBefore[i]);
        }

        if (isConnected(this)) {
          for (var _i2 = 0; _i2 < nodes.length; _i2++) {
            var node = nodes[_i2];
            if (node instanceof Element) {
              internals.connectTree(node);
            }
          }
        }
      };

      /**
       * @param {...(!Node|string)} nodes
       */
      destination['replaceWith'] = function () {
        for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nodes[_key3] = arguments[_key3];
        }

        // TODO: Fix this for when one of `nodes` is a DocumentFragment!
        var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
          // DocumentFragments are not connected and will not be added to the list.
          return node instanceof Node && isConnected(node);
        });

        var wasConnected = isConnected(this);

        builtIn.replaceWith.apply(this, nodes);

        for (var i = 0; i < connectedBefore.length; i++) {
          internals.disconnectTree(connectedBefore[i]);
        }

        if (wasConnected) {
          internals.disconnectTree(this);
          for (var _i3 = 0; _i3 < nodes.length; _i3++) {
            var node = nodes[_i3];
            if (node instanceof Element) {
              internals.connectTree(node);
            }
          }
        }
      };

      destination['remove'] = function () {
        var wasConnected = isConnected(this);

        builtIn.remove.call(this);

        if (wasConnected) {
          internals.disconnectTree(this);
        }
      };
    };

    /**
     * @param {!CustomElementInternals} internals
     */
    function PatchElement (internals) {
      if (Native.Element_attachShadow) {
        setPropertyUnchecked(Element.prototype, 'attachShadow',
        /**
         * @this {Element}
         * @param {!{mode: string}} init
         * @return {ShadowRoot}
         */
        function (init) {
          var shadowRoot = Native.Element_attachShadow.call(this, init);
          this.__CE_shadowRoot = shadowRoot;
          return shadowRoot;
        });
      } else {
        console.warn('Custom Elements: `Element#attachShadow` was not patched.');
      }

      function patch_innerHTML(destination, baseDescriptor) {
        Object.defineProperty(destination, 'innerHTML', {
          enumerable: baseDescriptor.enumerable,
          configurable: true,
          get: baseDescriptor.get,
          set: /** @this {Element} */function set(htmlString) {
            var _this = this;

            var isConnected$$ = isConnected(this);

            // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
            // that were previously descendants of the context element have all of
            // their children removed as part of the set - the entire subtree is
            // 'disassembled'. This work around walks the subtree *before* using the
            // native setter.
            /** @type {!Array<!Element>|undefined} */
            var removedElements = undefined;
            if (isConnected$$) {
              removedElements = [];
              walkDeepDescendantElements(this, function (element) {
                if (element !== _this) {
                  removedElements.push(element);
                }
              });
            }

            baseDescriptor.set.call(this, htmlString);

            if (removedElements) {
              for (var i = 0; i < removedElements.length; i++) {
                var element = removedElements[i];
                if (element.__CE_state === CustomElementState.custom) {
                  internals.disconnectedCallback(element);
                }
              }
            }

            // Only create custom elements if this element's owner document is
            // associated with the registry.
            if (!this.ownerDocument.__CE_hasRegistry) {
              internals.patchTree(this);
            } else {
              internals.patchAndUpgradeTree(this);
            }
            return htmlString;
          }
        });
      }

      if (Native.Element_innerHTML && Native.Element_innerHTML.get) {
        patch_innerHTML(Element.prototype, Native.Element_innerHTML);
      } else if (Native.HTMLElement_innerHTML && Native.HTMLElement_innerHTML.get) {
        patch_innerHTML(HTMLElement.prototype, Native.HTMLElement_innerHTML);
      } else {

        /** @type {HTMLDivElement} */
        var rawDiv = Native.Document_createElement.call(document, 'div');

        internals.addPatch(function (element) {
          patch_innerHTML(element, {
            enumerable: true,
            configurable: true,
            // Implements getting `innerHTML` by performing an unpatched `cloneNode`
            // of the element and returning the resulting element's `innerHTML`.
            // TODO: Is this too expensive?
            get: /** @this {Element} */function get() {
              return Native.Node_cloneNode.call(this, true).innerHTML;
            },
            // Implements setting `innerHTML` by creating an unpatched element,
            // setting `innerHTML` of that element and replacing the target
            // element's children with those of the unpatched element.
            set: /** @this {Element} */function set(assignedValue) {
              // NOTE: re-route to `content` for `template` elements.
              // We need to do this because `template.appendChild` does not
              // route into `template.content`.
              /** @type {!Node} */
              var content = this.localName === 'template' ? /** @type {!HTMLTemplateElement} */this.content : this;
              rawDiv.innerHTML = assignedValue;

              while (content.childNodes.length > 0) {
                Native.Node_removeChild.call(content, content.childNodes[0]);
              }
              while (rawDiv.childNodes.length > 0) {
                Native.Node_appendChild.call(content, rawDiv.childNodes[0]);
              }
            }
          });
        });
      }

      setPropertyUnchecked(Element.prototype, 'setAttribute',
      /**
       * @this {Element}
       * @param {string} name
       * @param {string} newValue
       */
      function (name, newValue) {
        // Fast path for non-custom elements.
        if (this.__CE_state !== CustomElementState.custom) {
          return Native.Element_setAttribute.call(this, name, newValue);
        }

        var oldValue = Native.Element_getAttribute.call(this, name);
        Native.Element_setAttribute.call(this, name, newValue);
        newValue = Native.Element_getAttribute.call(this, name);
        if (oldValue !== newValue) {
          internals.attributeChangedCallback(this, name, oldValue, newValue, null);
        }
      });

      setPropertyUnchecked(Element.prototype, 'setAttributeNS',
      /**
       * @this {Element}
       * @param {?string} namespace
       * @param {string} name
       * @param {string} newValue
       */
      function (namespace, name, newValue) {
        // Fast path for non-custom elements.
        if (this.__CE_state !== CustomElementState.custom) {
          return Native.Element_setAttributeNS.call(this, namespace, name, newValue);
        }

        var oldValue = Native.Element_getAttributeNS.call(this, namespace, name);
        Native.Element_setAttributeNS.call(this, namespace, name, newValue);
        newValue = Native.Element_getAttributeNS.call(this, namespace, name);
        if (oldValue !== newValue) {
          internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
        }
      });

      setPropertyUnchecked(Element.prototype, 'removeAttribute',
      /**
       * @this {Element}
       * @param {string} name
       */
      function (name) {
        // Fast path for non-custom elements.
        if (this.__CE_state !== CustomElementState.custom) {
          return Native.Element_removeAttribute.call(this, name);
        }

        var oldValue = Native.Element_getAttribute.call(this, name);
        Native.Element_removeAttribute.call(this, name);
        if (oldValue !== null) {
          internals.attributeChangedCallback(this, name, oldValue, null, null);
        }
      });

      setPropertyUnchecked(Element.prototype, 'removeAttributeNS',
      /**
       * @this {Element}
       * @param {?string} namespace
       * @param {string} name
       */
      function (namespace, name) {
        // Fast path for non-custom elements.
        if (this.__CE_state !== CustomElementState.custom) {
          return Native.Element_removeAttributeNS.call(this, namespace, name);
        }

        var oldValue = Native.Element_getAttributeNS.call(this, namespace, name);
        Native.Element_removeAttributeNS.call(this, namespace, name);
        // In older browsers, `Element#getAttributeNS` may return the empty string
        // instead of null if the attribute does not exist. For details, see;
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
        var newValue = Native.Element_getAttributeNS.call(this, namespace, name);
        if (oldValue !== newValue) {
          internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
        }
      });

      function patch_insertAdjacentElement(destination, baseMethod) {
        setPropertyUnchecked(destination, 'insertAdjacentElement',
        /**
         * @this {Element}
         * @param {string} where
         * @param {!Element} element
         * @return {?Element}
         */
        function (where, element) {
          var wasConnected = isConnected(element);
          var insertedElement = /** @type {!Element} */
          baseMethod.call(this, where, element);

          if (wasConnected) {
            internals.disconnectTree(element);
          }

          if (isConnected(insertedElement)) {
            internals.connectTree(element);
          }
          return insertedElement;
        });
      }

      if (Native.HTMLElement_insertAdjacentElement) {
        patch_insertAdjacentElement(HTMLElement.prototype, Native.HTMLElement_insertAdjacentElement);
      } else if (Native.Element_insertAdjacentElement) {
        patch_insertAdjacentElement(Element.prototype, Native.Element_insertAdjacentElement);
      } else {
        console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
      }

      PatchParentNode(internals, Element.prototype, {
        prepend: Native.Element_prepend,
        append: Native.Element_append
      });

      PatchChildNode(internals, Element.prototype, {
        before: Native.Element_before,
        after: Native.Element_after,
        replaceWith: Native.Element_replaceWith,
        remove: Native.Element_remove
      });
    };

    var priorCustomElements = window['customElements'];

    if (!priorCustomElements || priorCustomElements['forcePolyfill'] || typeof priorCustomElements['define'] != 'function' || typeof priorCustomElements['get'] != 'function') {
      /** @type {!CustomElementInternals} */
      var internals = new CustomElementInternals();

      PatchHTMLElement(internals);
      PatchDocument(internals);
      PatchNode(internals);
      PatchElement(internals);

      // The main document is always associated with the registry.
      document.__CE_hasRegistry = true;

      /** @type {!CustomElementRegistry} */
      var customElements$1 = new CustomElementRegistry(internals);

      Object.defineProperty(window, 'customElements', {
        configurable: true,
        enumerable: true,
        value: customElements$1
      });
    }

    var settings = window.ShadyDOM || {};

    settings.hasNativeShadowDOM = Boolean(Element.prototype.attachShadow && Node.prototype.getRootNode);

    var desc = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild');

    settings.hasDescriptors = Boolean(desc && desc.configurable && desc.get);
    settings.inUse = settings.force || !settings.hasNativeShadowDOM;

    function isShadyRoot(obj) {
      return Boolean(obj.__localName === 'ShadyRoot');
    }

    function ownerShadyRootForNode(node) {
      var root = node.getRootNode();
      if (isShadyRoot(root)) {
        return root;
      }
    }

    var p = Element.prototype;
    var matches = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;

    function matchesSelector(element, selector) {
      return matches.call(element, selector);
    }

    function copyOwnProperty(name, source, target) {
      var pd = Object.getOwnPropertyDescriptor(source, name);
      if (pd) {
        Object.defineProperty(target, name, pd);
      }
    }

    function extend(target, source) {
      if (target && source) {
        var n$ = Object.getOwnPropertyNames(source);
        for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
          copyOwnProperty(n, source, target);
        }
      }
      return target || source;
    }

    function extendAll(target) {
      for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < sources.length; i++) {
        extend(target, sources[i]);
      }
      return target;
    }

    function mixin(target, source) {
      for (var i in source) {
        target[i] = source[i];
      }
      return target;
    }

    function patchPrototype(obj, mixin) {
      var proto = Object.getPrototypeOf(obj);
      if (!proto.hasOwnProperty('__patchProto')) {
        var patchProto = Object.create(proto);
        patchProto.__sourceProto = proto;
        extend(patchProto, mixin);
        proto.__patchProto = patchProto;
      }
      // old browsers don't have setPrototypeOf
      obj.__proto__ = proto.__patchProto;
    }

    var twiddle = document.createTextNode('');
    var content = 0;
    var queue = [];
    new MutationObserver(function () {
      while (queue.length) {
        // catch errors in user code...
        try {
          queue.shift()();
        } catch (e) {
          // enqueue another record and throw
          twiddle.textContent = content++;
          throw e;
        }
      }
    }).observe(twiddle, { characterData: true });

    // use MutationObserver to get microtask async timing.
    function microtask(callback) {
      queue.push(callback);
      twiddle.textContent = content++;
    }

    // render enqueuer/flusher
    var flushList = [];
    var scheduled = void 0;
    function enqueue(callback) {
      if (!scheduled) {
        scheduled = true;
        microtask(flush);
      }
      flushList.push(callback);
    }

    function flush() {
      scheduled = false;
      var didFlush = Boolean(flushList.length);
      while (flushList.length) {
        flushList.shift()();
      }
      return didFlush;
    }

    flush.list = flushList;

    var AsyncObserver = function () {
      function AsyncObserver() {
        classCallCheck(this, AsyncObserver);

        this._scheduled = false;
        this.addedNodes = [];
        this.removedNodes = [];
        this.callbacks = new Set();
      }

      createClass(AsyncObserver, [{
        key: 'schedule',
        value: function schedule() {
          var _this = this;

          if (!this._scheduled) {
            this._scheduled = true;
            microtask(function () {
              _this.flush();
            });
          }
        }
      }, {
        key: 'flush',
        value: function flush() {
          if (this._scheduled) {
            this._scheduled = false;
            var mutations = this.takeRecords();
            if (mutations.length) {
              this.callbacks.forEach(function (cb) {
                cb(mutations);
              });
            }
          }
        }
      }, {
        key: 'takeRecords',
        value: function takeRecords() {
          if (this.addedNodes.length || this.removedNodes.length) {
            var mutations = [{
              addedNodes: this.addedNodes,
              removedNodes: this.removedNodes
            }];
            this.addedNodes = [];
            this.removedNodes = [];
            return mutations;
          }
          return [];
        }
      }]);
      return AsyncObserver;
    }();

    // TODO(sorvell): consider instead polyfilling MutationObserver
    // directly so that users do not have to fork their code.
    // Supporting the entire api may be challenging: e.g. filtering out
    // removed nodes in the wrong scope and seeing non-distributing
    // subtree child mutations.


    var observeChildren = function observeChildren(node, callback) {
      node.__shady = node.__shady || {};
      if (!node.__shady.observer) {
        node.__shady.observer = new AsyncObserver();
      }
      node.__shady.observer.callbacks.add(callback);
      var observer = node.__shady.observer;
      return {
        _callback: callback,
        _observer: observer,
        _node: node,
        takeRecords: function takeRecords() {
          return observer.takeRecords();
        }
      };
    };

    var unobserveChildren = function unobserveChildren(handle) {
      var observer = handle && handle._observer;
      if (observer) {
        observer.callbacks.delete(handle._callback);
        if (!observer.callbacks.size) {
          handle._node.__shady.observer = null;
        }
      }
    };

    function filterMutations(mutations, target) {
      var targetRootNode = target.getRootNode();
      return mutations.map(function (mutation) {
        var mutationInScope = targetRootNode === mutation.target.getRootNode();
        if (mutationInScope && mutation.addedNodes) {
          var nodes = Array.from(mutation.addedNodes).filter(function (n) {
            return targetRootNode === n.getRootNode();
          });
          if (nodes.length) {
            mutation = Object.create(mutation);
            Object.defineProperty(mutation, 'addedNodes', {
              value: nodes,
              configurable: true
            });
            return mutation;
          }
        } else if (mutationInScope) {
          return mutation;
        }
      }).filter(function (m) {
        return m;
      });
    }

    var appendChild = Element.prototype.appendChild;
    var insertBefore = Element.prototype.insertBefore;
    var removeChild = Element.prototype.removeChild;
    var setAttribute = Element.prototype.setAttribute;
    var removeAttribute = Element.prototype.removeAttribute;
    var cloneNode = Element.prototype.cloneNode;
    var importNode = Document.prototype.importNode;
    var nativeAddEventListener = Element.prototype.addEventListener;
    var nativeRemoveEventListener = Element.prototype.removeEventListener;

var nativeMethods = Object.freeze({
    	appendChild: appendChild,
    	insertBefore: insertBefore,
    	removeChild: removeChild,
    	setAttribute: setAttribute,
    	removeAttribute: removeAttribute,
    	cloneNode: cloneNode,
    	importNode: importNode,
    	addEventListener: nativeAddEventListener,
    	removeEventListener: nativeRemoveEventListener
    });

    // Cribbed from ShadowDOM polyfill
    // https://github.com/webcomponents/webcomponentsjs/blob/master/src/ShadowDOM/wrappers/HTMLElement.js#L28
    /////////////////////////////////////////////////////////////////////////////
    // innerHTML and outerHTML

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString

    var escapeAttrRegExp = /[&\u00A0"]/g;
    var escapeDataRegExp = /[&\u00A0<>]/g;

    function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case '\xA0':
          return '&nbsp;';
      }
    }

    function escapeAttr(s) {
      return s.replace(escapeAttrRegExp, escapeReplace);
    }

    function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    }

    function makeSet(arr) {
      var set = {};
      for (var i = 0; i < arr.length; i++) {
        set[arr[i]] = true;
      }
      return set;
    }

    // http://www.whatwg.org/specs/web-apps/current-work/#void-elements
    var voidElements = makeSet(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    var plaintextParents = makeSet(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);

    function getOuterHTML(node, parentNode, composed) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          {
            var tagName = node.localName;
            var s = '<' + tagName;
            var attrs = node.attributes;
            for (var i = 0, attr; attr = attrs[i]; i++) {
              s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
            }
            s += '>';
            if (voidElements[tagName]) {
              return s;
            }
            return s + getInnerHTML(node, composed) + '</' + tagName + '>';
          }
        case Node.TEXT_NODE:
          {
            var data = node.data;
            if (parentNode && plaintextParents[parentNode.localName]) {
              return data;
            }
            return escapeData(data);
          }
        case Node.COMMENT_NODE:
          {
            return '<!--' + node.data + '-->';
          }
        default:
          {
            window.console.error(node);
            throw new Error('not implemented');
          }
      }
    }

    function getInnerHTML(node, composed) {
      if (node.localName === 'template') {
        node = node.content;
      }
      var s = '';
      var c$ = composed ? composed(node) : node.childNodes;
      for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
        s += getOuterHTML(child, node, composed);
      }
      return s;
    }

    var nodeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, false);

    var elementWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, false);

    function parentNode(node) {
      nodeWalker.currentNode = node;
      return nodeWalker.parentNode();
    }

    function firstChild(node) {
      nodeWalker.currentNode = node;
      return nodeWalker.firstChild();
    }

    function lastChild(node) {
      nodeWalker.currentNode = node;
      return nodeWalker.lastChild();
    }

    function previousSibling(node) {
      nodeWalker.currentNode = node;
      return nodeWalker.previousSibling();
    }

    function nextSibling(node) {
      nodeWalker.currentNode = node;
      return nodeWalker.nextSibling();
    }

    function childNodes(node) {
      var nodes = [];
      nodeWalker.currentNode = node;
      var n = nodeWalker.firstChild();
      while (n) {
        nodes.push(n);
        n = nodeWalker.nextSibling();
      }
      nodes.item = function (index) {
        return nodes[index];
      };
      return nodes;
    }

    function parentElement(node) {
      elementWalker.currentNode = node;
      return elementWalker.parentNode();
    }

    function firstElementChild(node) {
      elementWalker.currentNode = node;
      return elementWalker.firstChild();
    }

    function lastElementChild(node) {
      elementWalker.currentNode = node;
      return elementWalker.lastChild();
    }

    function previousElementSibling(node) {
      elementWalker.currentNode = node;
      return elementWalker.previousSibling();
    }

    function nextElementSibling(node) {
      elementWalker.currentNode = node;
      return elementWalker.nextSibling();
    }

    function children(node) {
      var nodes = [];
      elementWalker.currentNode = node;
      var n = elementWalker.firstChild();
      while (n) {
        nodes.push(n);
        n = elementWalker.nextSibling();
      }
      return nodes;
    }

    function innerHTML(node) {
      return getInnerHTML(node, function (n) {
        return childNodes(n);
      });
    }

    function textContent(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return node.nodeValue;
      }
      var textWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
      var content = '',
          n = void 0;
      while (n = textWalker.nextNode()) {
        // TODO(sorvell): can't use textContent since we patch it on Node.prototype!
        // However, should probably patch it only on element.
        content += n.nodeValue;
      }
      return content;
    }

var nativeTree = Object.freeze({
      parentNode: parentNode,
      firstChild: firstChild,
      lastChild: lastChild,
      previousSibling: previousSibling,
      nextSibling: nextSibling,
      childNodes: childNodes,
      parentElement: parentElement,
      firstElementChild: firstElementChild,
      lastElementChild: lastElementChild,
      previousElementSibling: previousElementSibling,
      nextElementSibling: nextElementSibling,
      children: children,
      innerHTML: innerHTML,
      textContent: textContent
    });

    function getProperty(node, prop) {
      return node.__shady && node.__shady[prop];
    }

    function hasProperty(node, prop) {
      return getProperty(node, prop) !== undefined;
    }

    function generateSimpleDescriptor(prop) {
      return {
        get: function get() {
          var l = getProperty(this, prop);
          return l !== undefined ? l : nativeTree[prop](this);
        },

        configurable: true
      };
    }

    function clearNode(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }

    var nativeInnerHTMLDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML') || Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');

    var inertDoc = document.implementation.createHTMLDocument('inert');
    var htmlContainer = inertDoc.createElement('div');

    var nativeActiveElementDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement');
    function getDocumentActiveElement() {
      if (nativeActiveElementDescriptor && nativeActiveElementDescriptor.get) {
        return nativeActiveElementDescriptor.get.call(document);
      } else if (!settings.hasDescriptors) {
        return document.activeElement;
      }
    }

    function activeElementForNode(node) {
      var active = getDocumentActiveElement();
      // In IE11, activeElement might be an empty object if the document is
      // contained in an iframe.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10998788/
      if (!active || !active.nodeType) {
        return null;
      }
      var isShadyRoot$$ = !!isShadyRoot(node);
      if (node !== document) {
        // If this node isn't a document or shady root, then it doesn't have
        // an active element.
        if (!isShadyRoot$$) {
          return null;
        }
        // If this shady root's host is the active element or the active
        // element is not a descendant of the host (in the composed tree),
        // then it doesn't have an active element.
        if (node.host === active || !node.host.contains(active)) {
          return null;
        }
      }
      // This node is either the document or a shady root of which the active
      // element is a (composed) descendant of its host; iterate upwards to
      // find the active element's most shallow host within it.
      var activeRoot = ownerShadyRootForNode(active);
      while (activeRoot && activeRoot !== node) {
        active = activeRoot.host;
        activeRoot = ownerShadyRootForNode(active);
      }
      if (node === document) {
        // This node is the document, so activeRoot should be null.
        return activeRoot ? null : active;
      } else {
        // This node is a non-document shady root, and it should be
        // activeRoot.
        return activeRoot === node ? active : null;
      }
    }

    var OutsideAccessors = {
      // node...
      parentElement: generateSimpleDescriptor('parentElement'),

      parentNode: generateSimpleDescriptor('parentNode'),

      nextSibling: generateSimpleDescriptor('nextSibling'),

      previousSibling: generateSimpleDescriptor('previousSibling'),

      className: {
        get: function get() {
          return this.getAttribute('class');
        },
        set: function set(value) {
          this.setAttribute('class', value);
        },

        configurable: true
      },

      // fragment, element, document
      nextElementSibling: {
        get: function get() {
          if (hasProperty(this, 'nextSibling')) {
            var n = this.nextSibling;
            while (n && n.nodeType !== Node.ELEMENT_NODE) {
              n = n.nextSibling;
            }
            return n;
          } else {
            return nextElementSibling(this);
          }
        },

        configurable: true
      },

      previousElementSibling: {
        get: function get() {
          if (hasProperty(this, 'previousSibling')) {
            var n = this.previousSibling;
            while (n && n.nodeType !== Node.ELEMENT_NODE) {
              n = n.previousSibling;
            }
            return n;
          } else {
            return previousElementSibling(this);
          }
        },

        configurable: true
      }

    };

    var InsideAccessors = {

      childNodes: {
        get: function get() {
          if (hasProperty(this, 'firstChild')) {
            if (!this.__shady.childNodes) {
              this.__shady.childNodes = [];
              for (var n = this.firstChild; n; n = n.nextSibling) {
                this.__shady.childNodes.push(n);
              }
            }
            return this.__shady.childNodes;
          } else {
            return childNodes(this);
          }
        },

        configurable: true
      },

      firstChild: generateSimpleDescriptor('firstChild'),

      lastChild: generateSimpleDescriptor('lastChild'),

      textContent: {
        get: function get() {
          if (hasProperty(this, 'firstChild')) {
            var tc = [];
            for (var i = 0, cn = this.childNodes, c; c = cn[i]; i++) {
              if (c.nodeType !== Node.COMMENT_NODE) {
                tc.push(c.textContent);
              }
            }
            return tc.join('');
          } else {
            return textContent(this);
          }
        },
        set: function set(text) {
          if (this.nodeType !== Node.ELEMENT_NODE) {
            // TODO(sorvell): can't do this if patch nodeValue.
            this.nodeValue = text;
          } else {
            clearNode(this);
            if (text) {
              this.appendChild(document.createTextNode(text));
            }
          }
        },

        configurable: true
      },

      // fragment, element, document
      firstElementChild: {
        get: function get() {
          if (hasProperty(this, 'firstChild')) {
            var n = this.firstChild;
            while (n && n.nodeType !== Node.ELEMENT_NODE) {
              n = n.nextSibling;
            }
            return n;
          } else {
            return firstElementChild(this);
          }
        },

        configurable: true
      },

      lastElementChild: {
        get: function get() {
          if (hasProperty(this, 'lastChild')) {
            var n = this.lastChild;
            while (n && n.nodeType !== Node.ELEMENT_NODE) {
              n = n.previousSibling;
            }
            return n;
          } else {
            return lastElementChild(this);
          }
        },

        configurable: true
      },

      children: {
        get: function get() {
          if (hasProperty(this, 'firstChild')) {
            return Array.prototype.filter.call(this.childNodes, function (n) {
              return n.nodeType === Node.ELEMENT_NODE;
            });
          } else {
            return children(this);
          }
        },

        configurable: true
      },

      // element (HTMLElement on IE11)
      innerHTML: {
        get: function get() {
          var content = this.localName === 'template' ? this.content : this;
          if (hasProperty(this, 'firstChild')) {
            return getInnerHTML(content);
          } else {
            return innerHTML(content);
          }
        },
        set: function set(text) {
          var content = this.localName === 'template' ? this.content : this;
          clearNode(content);
          if (nativeInnerHTMLDesc && nativeInnerHTMLDesc.set) {
            nativeInnerHTMLDesc.set.call(htmlContainer, text);
          } else {
            htmlContainer.innerHTML = text;
          }
          while (htmlContainer.firstChild) {
            content.appendChild(htmlContainer.firstChild);
          }
        },

        configurable: true
      }

    };

    // Note: Can be patched on element prototype on all browsers.
    // Must be patched on instance on browsers that support native Shadow DOM
    // but do not have builtin accessors (old Chrome).
    var ShadowRootAccessor = {
      shadowRoot: {
        get: function get() {
          return this.shadyRoot;
        },
        set: function set(value) {
          this.shadyRoot = value;
        },

        configurable: true
      }
    };

    // Note: Can be patched on document prototype on browsers with builtin accessors.
    // Must be patched separately on simulated ShadowRoot.
    // Must be patched as `_activeElement` on browsers without builtin accessors.
    var ActiveElementAccessor = {

      activeElement: {
        get: function get() {
          return activeElementForNode(this);
        },
        set: function set() {},

        configurable: true
      }

    };

    // patch a group of descriptors on an object only if it exists or if the `force`
    // argument is true.
    function patchAccessorGroup(obj, descriptors, force) {
      for (var p in descriptors) {
        var objDesc = Object.getOwnPropertyDescriptor(obj, p);
        if (objDesc && objDesc.configurable || !objDesc && force) {
          Object.defineProperty(obj, p, descriptors[p]);
        } else if (force) {
          console.warn('Could not define', p, 'on', obj);
        }
      }
    }

    // patch dom accessors on proto where they exist
    function patchAccessors(proto) {
      patchAccessorGroup(proto, OutsideAccessors);
      patchAccessorGroup(proto, InsideAccessors);
      patchAccessorGroup(proto, ActiveElementAccessor);
    }

    // ensure element descriptors (IE/Edge don't have em)
    function patchShadowRootAccessors(proto) {
      patchAccessorGroup(proto, InsideAccessors, true);
      patchAccessorGroup(proto, ActiveElementAccessor, true);
    }

    // ensure an element has patched "outside" accessors; no-op when not needed
    var patchOutsideElementAccessors = settings.hasDescriptors ? function () {} : function (element) {
      if (!(element.__shady && element.__shady.__outsideAccessors)) {
        element.__shady = element.__shady || {};
        element.__shady.__outsideAccessors = true;
        patchAccessorGroup(element, OutsideAccessors, true);
      }
    };

    // ensure an element has patched "inside" accessors; no-op when not needed
    var patchInsideElementAccessors = settings.hasDescriptors ? function () {} : function (element) {
      if (!(element.__shady && element.__shady.__insideAccessors)) {
        element.__shady = element.__shady || {};
        element.__shady.__insideAccessors = true;
        patchAccessorGroup(element, InsideAccessors, true);
        patchAccessorGroup(element, ShadowRootAccessor, true);
      }
    };

    function recordInsertBefore(node, container, ref_node) {
      patchInsideElementAccessors(container);
      container.__shady = container.__shady || {};
      if (hasProperty(container, 'firstChild')) {
        container.__shady.childNodes = null;
      }
      // handle document fragments
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var c$ = node.childNodes;
        for (var i = 0; i < c$.length; i++) {
          linkNode(c$[i], container, ref_node);
        }
        // cleanup logical dom in doc fragment.
        node.__shady = node.__shady || {};
        var resetTo = hasProperty(node, 'firstChild') ? null : undefined;
        node.__shady.firstChild = node.__shady.lastChild = resetTo;
        node.__shady.childNodes = resetTo;
      } else {
        linkNode(node, container, ref_node);
      }
    }

    function linkNode(node, container, ref_node) {
      patchOutsideElementAccessors(node);
      ref_node = ref_node || null;
      node.__shady = node.__shady || {};
      container.__shady = container.__shady || {};
      if (ref_node) {
        ref_node.__shady = ref_node.__shady || {};
      }
      // update ref_node.previousSibling <-> node
      node.__shady.previousSibling = ref_node ? ref_node.__shady.previousSibling : container.lastChild;
      var ps = node.__shady.previousSibling;
      if (ps && ps.__shady) {
        ps.__shady.nextSibling = node;
      }
      // update node <-> ref_node
      var ns = node.__shady.nextSibling = ref_node;
      if (ns && ns.__shady) {
        ns.__shady.previousSibling = node;
      }
      // update node <-> container
      node.__shady.parentNode = container;
      if (ref_node) {
        if (ref_node === container.__shady.firstChild) {
          container.__shady.firstChild = node;
        }
      } else {
        container.__shady.lastChild = node;
        if (!container.__shady.firstChild) {
          container.__shady.firstChild = node;
        }
      }
      // remove caching of childNodes
      container.__shady.childNodes = null;
    }

    function recordRemoveChild(node, container) {
      node.__shady = node.__shady || {};
      container.__shady = container.__shady || {};
      if (node === container.__shady.firstChild) {
        container.__shady.firstChild = node.__shady.nextSibling;
      }
      if (node === container.__shady.lastChild) {
        container.__shady.lastChild = node.__shady.previousSibling;
      }
      var p = node.__shady.previousSibling;
      var n = node.__shady.nextSibling;
      if (p) {
        p.__shady = p.__shady || {};
        p.__shady.nextSibling = n;
      }
      if (n) {
        n.__shady = n.__shady || {};
        n.__shady.previousSibling = p;
      }
      // When an element is removed, logical data is no longer tracked.
      // Explicitly set `undefined` here to indicate this. This is disginguished
      // from `null` which is set if info is null.
      node.__shady.parentNode = node.__shady.previousSibling = node.__shady.nextSibling = undefined;
      if (hasProperty(container, 'childNodes')) {
        // remove caching of childNodes
        container.__shady.childNodes = null;
      }
    }

    var recordChildNodes = function recordChildNodes(node) {
      if (!hasProperty(node, 'firstChild')) {
        node.__shady = node.__shady || {};
        node.__shady.firstChild = firstChild(node);
        node.__shady.lastChild = lastChild(node);
        patchInsideElementAccessors(node);
        var c$ = node.__shady.childNodes = childNodes(node);
        for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
          n.__shady = n.__shady || {};
          n.__shady.parentNode = node;
          n.__shady.nextSibling = c$[i + 1] || null;
          n.__shady.previousSibling = c$[i - 1] || null;
          patchOutsideElementAccessors(n);
        }
      }
    };

    // Try to add node. Record logical info, track insertion points, perform
    // distribution iff needed. Return true if the add is handled.
    function addNode(container, node, ref_node) {
      var ownerRoot = ownerShadyRootForNode(container);
      var ipAdded = void 0;
      if (ownerRoot) {
        // optimization: special insertion point tracking
        // TODO(sorvell): verify that the renderPending check here should not be needed.
        if (node.__noInsertionPoint && !ownerRoot._changePending) {
          ownerRoot._skipUpdateInsertionPoints = true;
        }
        // note: we always need to see if an insertion point is added
        // since this saves logical tree info; however, invalidation state
        // needs
        ipAdded = _maybeAddInsertionPoint(node, container, ownerRoot);
        // invalidate insertion points IFF not already invalid!
        if (ipAdded) {
          ownerRoot._skipUpdateInsertionPoints = false;
        }
      }
      if (hasProperty(container, 'firstChild')) {
        recordInsertBefore(node, container, ref_node);
      }
      // if not distributing and not adding to host, do a fast path addition
      // TODO(sorvell): revisit flow since `ipAdded` needed here if
      // node is a fragment that has a patched QSA.
      var handled = _maybeDistribute(node, container, ownerRoot, ipAdded) || container.shadyRoot;
      return handled;
    }

    // Try to remove node: update logical info and perform distribution iff
    // needed. Return true if the removal has been handled.
    // note that it's possible for both the node's host and its parent
    // to require distribution... both cases are handled here.
    function removeNode(node) {
      // important that we want to do this only if the node has a logical parent
      var logicalParent = hasProperty(node, 'parentNode') && getProperty(node, 'parentNode');
      var distributed = void 0;
      var ownerRoot = ownerShadyRootForNode(node);
      if (logicalParent || ownerRoot) {
        // distribute node's parent iff needed
        distributed = maybeDistributeParent(node);
        if (logicalParent) {
          recordRemoveChild(node, logicalParent);
        }
        // remove node from root and distribute it iff needed
        var removedDistributed = ownerRoot && _removeDistributedChildren(ownerRoot, node);
        var addedInsertionPoint = logicalParent && ownerRoot && logicalParent.localName === ownerRoot.getInsertionPointTag();
        if (removedDistributed || addedInsertionPoint) {
          ownerRoot._skipUpdateInsertionPoints = false;
          updateRootViaContentChange(ownerRoot);
        }
      }
      _removeOwnerShadyRoot(node);
      return distributed;
    }

    function _scheduleObserver(node, addedNode, removedNode) {
      var observer = node.__shady && node.__shady.observer;
      if (observer) {
        if (addedNode) {
          observer.addedNodes.push(addedNode);
        }
        if (removedNode) {
          observer.removedNodes.push(removedNode);
        }
        observer.schedule();
      }
    }

    function removeNodeFromParent(node, logicalParent) {
      if (logicalParent) {
        _scheduleObserver(logicalParent, null, node);
        return removeNode(node);
      } else {
        // composed but not logical parent
        if (node.parentNode) {
          removeChild.call(node.parentNode, node);
        }
        _removeOwnerShadyRoot(node);
      }
    }

    function _hasCachedOwnerRoot(node) {
      return Boolean(node.__ownerShadyRoot !== undefined);
    }

    function getRootNode(node) {
      if (!node || !node.nodeType) {
        return;
      }
      var root = node.__ownerShadyRoot;
      if (root === undefined) {
        if (isShadyRoot(node)) {
          root = node;
        } else {
          var parent = node.parentNode;
          root = parent ? getRootNode(parent) : node;
        }
        // memo-ize result for performance but only memo-ize
        // result if node is in the document. This avoids a problem where a root
        // can be cached while an element is inside a fragment.
        // If this happens and we cache the result, the value can become stale
        // because for perf we avoid processing the subtree of added fragments.
        if (document.documentElement.contains(node)) {
          node.__ownerShadyRoot = root;
        }
      }
      return root;
    }

    function _maybeDistribute(node, container, ownerRoot, ipAdded) {
      // TODO(sorvell): technically we should check non-fragment nodes for
      // <content> children but since this case is assumed to be exceedingly
      // rare, we avoid the cost and will address with some specific api
      // when the need arises.  For now, the user must call
      // distributeContent(true), which updates insertion points manually
      // and forces distribution.
      var insertionPointTag = ownerRoot && ownerRoot.getInsertionPointTag() || '';
      var fragContent = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noInsertionPoint && insertionPointTag && node.querySelector(insertionPointTag);
      var wrappedContent = fragContent && fragContent.parentNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
      var hasContent = fragContent || node.localName === insertionPointTag;
      // There are 3 possible cases where a distribution may need to occur:
      // 1. <content> being inserted (the host of the shady root where
      //    content is inserted needs distribution)
      // 2. children being inserted into parent with a shady root (parent
      //    needs distribution)
      // 3. container is an insertionPoint
      if (hasContent || container.localName === insertionPointTag || ipAdded) {
        if (ownerRoot) {
          // note, insertion point list update is handled after node
          // mutations are complete
          updateRootViaContentChange(ownerRoot);
        }
      }
      var needsDist = _nodeNeedsDistribution(container);
      if (needsDist) {
        updateRootViaContentChange(container.shadyRoot);
      }
      // Return true when distribution will fully handle the composition
      // Note that if a content was being inserted that was wrapped by a node,
      // and the parent does not need distribution, return false to allow
      // the nodes to be added directly, after which children may be
      // distributed and composed into the wrapping node(s)
      return needsDist || hasContent && !wrappedContent;
    }

    /* note: parent argument is required since node may have an out
    of date parent at this point; returns true if a <content> is being added */
    function _maybeAddInsertionPoint(node, parent, root) {
      var added = void 0;
      var insertionPointTag = root.getInsertionPointTag();
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noInsertionPoint) {
        var c$ = node.querySelectorAll(insertionPointTag);
        for (var i = 0, n, np, na; i < c$.length && (n = c$[i]); i++) {
          np = n.parentNode;
          // don't allow node's parent to be fragment itself
          if (np === node) {
            np = parent;
          }
          na = _maybeAddInsertionPoint(n, np, root);
          added = added || na;
        }
      } else if (node.localName === insertionPointTag) {
        recordChildNodes(parent);
        recordChildNodes(node);
        added = true;
      }
      return added;
    }

    function _nodeNeedsDistribution(node) {
      return node && node.shadyRoot && node.shadyRoot.hasInsertionPoint();
    }

    function _removeDistributedChildren(root, container) {
      var hostNeedsDist = void 0;
      var ip$ = root._insertionPoints;
      for (var i = 0; i < ip$.length; i++) {
        var insertionPoint = ip$[i];
        if (_contains(container, insertionPoint)) {
          var dc$ = insertionPoint.assignedNodes({ flatten: true });
          for (var j = 0; j < dc$.length; j++) {
            hostNeedsDist = true;
            var node = dc$[j];
            var parent = parentNode(node);
            if (parent) {
              removeChild.call(parent, node);
            }
          }
        }
      }
      return hostNeedsDist;
    }

    function _contains(container, node) {
      while (node) {
        if (node == container) {
          return true;
        }
        node = node.parentNode;
      }
    }

    function _removeOwnerShadyRoot(node) {
      // optimization: only reset the tree if node is actually in a root
      if (_hasCachedOwnerRoot(node)) {
        var c$ = node.childNodes;
        for (var i = 0, l = c$.length, n; i < l && (n = c$[i]); i++) {
          _removeOwnerShadyRoot(n);
        }
      }
      node.__ownerShadyRoot = undefined;
    }

    // TODO(sorvell): This will fail if distribution that affects this
    // question is pending; this is expected to be exceedingly rare, but if
    // the issue comes up, we can force a flush in this case.
    function firstComposedNode(insertionPoint) {
      var n$ = insertionPoint.assignedNodes({ flatten: true });
      var root = getRootNode(insertionPoint);
      for (var i = 0, l = n$.length, n; i < l && (n = n$[i]); i++) {
        // means that we're composed to this spot.
        if (root.isFinalDestination(insertionPoint, n)) {
          return n;
        }
      }
    }

    function maybeDistributeParent(node) {
      var parent = node.parentNode;
      if (_nodeNeedsDistribution(parent)) {
        updateRootViaContentChange(parent.shadyRoot);
        return true;
      }
    }

    function updateRootViaContentChange(root) {
      // mark root as mutation based on a mutation
      root._changePending = true;
      root.update();
    }

    function distributeAttributeChange(node, name) {
      if (name === 'slot') {
        maybeDistributeParent(node);
      } else if (node.localName === 'slot' && name === 'name') {
        var root = ownerShadyRootForNode(node);
        if (root) {
          root.update();
        }
      }
    }

    // NOTE: `query` is used primarily for ShadyDOM's querySelector impl,
    // but it's also generally useful to recurse through the element tree
    // and is used by Polymer's styling system.
    function query(node, matcher, halter) {
      var list = [];
      _queryElements(node.childNodes, matcher, halter, list);
      return list;
    }

    function _queryElements(elements, matcher, halter, list) {
      for (var i = 0, l = elements.length, c; i < l && (c = elements[i]); i++) {
        if (c.nodeType === Node.ELEMENT_NODE && _queryElement(c, matcher, halter, list)) {
          return true;
        }
      }
    }

    function _queryElement(node, matcher, halter, list) {
      var result = matcher(node);
      if (result) {
        list.push(node);
      }
      if (halter && halter(result)) {
        return result;
      }
      _queryElements(node.childNodes, matcher, halter, list);
    }

    function renderRootNode(element) {
      var root = element.getRootNode();
      if (isShadyRoot(root)) {
        root.render();
      }
    }

    var scopingShim = null;

    function setAttribute$1(node, attr, value) {
      if (!scopingShim) {
        scopingShim = window.ShadyCSS && window.ShadyCSS.ScopingShim;
      }
      // avoid scoping elements in non-main document to avoid template documents
      if (scopingShim && attr === 'class' && node.ownerDocument === document) {
        scopingShim.setElementClass(node, value);
      } else {
        setAttribute.call(node, attr, value);
        distributeAttributeChange(node, attr);
      }
    }

    function removeAttribute$1(node, attr) {
      removeAttribute.call(node, attr);
      distributeAttributeChange(node, attr);
    }

    // cases in which we may not be able to just do standard native call
    // 1. container has a shadyRoot (needsDistribution IFF the shadyRoot
    // has an insertion point)
    // 2. container is a shadyRoot (don't distribute, instead set
    // container to container.host.
    // 3. node is <content> (host of container needs distribution)
    function insertBefore$1(parent, node, ref_node) {
      if (ref_node) {
        var p = getProperty(ref_node, 'parentNode');
        if (p !== undefined && p !== parent) {
          throw Error('The ref_node to be inserted before is not a child ' + 'of this node');
        }
      }
      // remove node from its current position iff it's in a tree.
      if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        var _parent = getProperty(node, 'parentNode');
        removeNodeFromParent(node, _parent);
      }
      if (!addNode(parent, node, ref_node)) {
        if (ref_node) {
          // if ref_node is an insertion point replace with first distributed node
          var root = ownerShadyRootForNode(ref_node);
          if (root) {
            ref_node = ref_node.localName === root.getInsertionPointTag() ? firstComposedNode(ref_node) : ref_node;
          }
        }
        // if adding to a shadyRoot, add to host instead
        var container = isShadyRoot(parent) ? parent.host : parent;
        if (ref_node) {
          insertBefore.call(container, node, ref_node);
        } else {
          appendChild.call(container, node);
        }
      }
      _scheduleObserver(parent, node);
      return node;
    }

    /**
      Removes the given `node` from the element's `lightChildren`.
      This method also performs dom composition.
    */
    function removeChild$1(parent, node) {
      if (node.parentNode !== parent) {
        throw Error('The node to be removed is not a child of this node: ' + node);
      }
      if (!removeNode(node)) {
        // if removing from a shadyRoot, remove form host instead
        var container = isShadyRoot(parent) ? parent.host : parent;
        // not guaranteed to physically be in container; e.g.
        // undistributed nodes.
        var nativeParent = parentNode(node);
        if (container === nativeParent) {
          removeChild.call(container, node);
        }
      }
      _scheduleObserver(parent, null, node);
      return node;
    }

    function cloneNode$1(node, deep) {
      if (node.localName == 'template') {
        return cloneNode.call(node, deep);
      } else {
        var n = cloneNode.call(node, false);
        if (deep) {
          var c$ = node.childNodes;
          for (var i = 0, nc; i < c$.length; i++) {
            nc = c$[i].cloneNode(true);
            n.appendChild(nc);
          }
        }
        return n;
      }
    }

    // note: Though not technically correct, we fast path `importNode`
    // when called on a node not owned by the main document.
    // This allows, for example, elements that cannot
    // contain custom elements and are therefore not likely to contain shadowRoots
    // to cloned natively. This is a fairly significant performance win.
    function importNode$1(node, deep) {
      if (node.ownerDocument !== document) {
        return importNode.call(document, node, deep);
      }
      var n = importNode.call(document, node, false);
      if (deep) {
        var c$ = node.childNodes;
        for (var i = 0, nc; i < c$.length; i++) {
          nc = importNode$1(c$[i], true);
          n.appendChild(nc);
        }
      }
      return n;
    }

    // https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
    var alwaysComposed = {
      blur: true,
      focus: true,
      focusin: true,
      focusout: true,
      click: true,
      dblclick: true,
      mousedown: true,
      mouseenter: true,
      mouseleave: true,
      mousemove: true,
      mouseout: true,
      mouseover: true,
      mouseup: true,
      wheel: true,
      beforeinput: true,
      input: true,
      keydown: true,
      keyup: true,
      compositionstart: true,
      compositionupdate: true,
      compositionend: true,
      touchstart: true,
      touchend: true,
      touchmove: true,
      touchcancel: true,
      pointerover: true,
      pointerenter: true,
      pointerdown: true,
      pointermove: true,
      pointerup: true,
      pointercancel: true,
      pointerout: true,
      pointerleave: true,
      gotpointercapture: true,
      lostpointercapture: true,
      dragstart: true,
      drag: true,
      dragenter: true,
      dragleave: true,
      dragover: true,
      drop: true,
      dragend: true,
      DOMActivate: true,
      DOMFocusIn: true,
      DOMFocusOut: true,
      keypress: true
    };

    function pathComposer(startNode, composed) {
      var composedPath = [];
      var current = startNode;
      var startRoot = startNode === window ? window : startNode.getRootNode();
      while (current) {
        composedPath.push(current);
        if (current.assignedSlot) {
          current = current.assignedSlot;
        } else if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
          current = current.host;
        } else {
          current = current.parentNode;
        }
      }
      // event composedPath includes window when startNode's ownerRoot is document
      if (composedPath[composedPath.length - 1] === document) {
        composedPath.push(window);
      }
      return composedPath;
    }

    function retarget(refNode, path) {
      if (!isShadyRoot) {
        return refNode;
      }
      // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
      // shadow-including inclusive ancestor, return ANCESTOR.
      var refNodePath = pathComposer(refNode, true);
      var p$ = path;
      for (var i = 0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
        ancestor = p$[i];
        root = ancestor === window ? window : ancestor.getRootNode();
        if (root !== lastRoot) {
          rootIdx = refNodePath.indexOf(root);
          lastRoot = root;
        }
        if (!isShadyRoot(root) || rootIdx > -1) {
          return ancestor;
        }
      }
    }

    var eventMixin = {

      get composed() {
        if (this.isTrusted && this.__composed === undefined) {
          this.__composed = alwaysComposed[this.type];
        }
        return this.__composed || false;
      },

      composedPath: function composedPath() {
        if (!this.__composedPath) {
          this.__composedPath = pathComposer(this.__target, this.composed);
        }
        return this.__composedPath;
      },


      get target() {
        return retarget(this.currentTarget, this.composedPath());
      },

      // http://w3c.github.io/webcomponents/spec/shadow/#event-relatedtarget-retargeting
      get relatedTarget() {
        if (!this.__relatedTarget) {
          return null;
        }
        if (!this.__relatedTargetComposedPath) {
          this.__relatedTargetComposedPath = pathComposer(this.__relatedTarget, true);
        }
        // find the deepest node in relatedTarget composed path that is in the same root with the currentTarget
        return retarget(this.currentTarget, this.__relatedTargetComposedPath);
      },
      stopPropagation: function stopPropagation() {
        Event.prototype.stopPropagation.call(this);
        this.__propagationStopped = true;
      },
      stopImmediatePropagation: function stopImmediatePropagation() {
        Event.prototype.stopImmediatePropagation.call(this);
        this.__immediatePropagationStopped = true;
        this.__propagationStopped = true;
      }
    };

    function mixinComposedFlag(Base) {
      // NOTE: avoiding use of `class` here so that transpiled output does not
      // try to do `Base.call` with a dom construtor.
      var klazz = function klazz(type, options) {
        var event = new Base(type, options);
        event.__composed = options && Boolean(options.composed);
        return event;
      };
      // put constructor properties on subclass
      mixin(klazz, Base);
      klazz.prototype = Base.prototype;
      return klazz;
    }

    var nonBubblingEventsToRetarget = {
      focus: true,
      blur: true
    };

    function fireHandlers(event, node, phase) {
      var hs = node.__handlers && node.__handlers[event.type] && node.__handlers[event.type][phase];
      if (hs) {
        for (var i = 0, fn; fn = hs[i]; i++) {
          fn.call(node, event);
          if (event.__immediatePropagationStopped) {
            return;
          }
        }
      }
    }

    function retargetNonBubblingEvent(e) {
      var path = e.composedPath();
      var node = void 0;
      // override `currentTarget` to let patched `target` calculate correctly
      Object.defineProperty(e, 'currentTarget', {
        get: function get() {
          return node;
        },
        configurable: true
      });
      for (var i = path.length - 1; i >= 0; i--) {
        node = path[i];
        // capture phase fires all capture handlers
        fireHandlers(e, node, 'capture');
        if (e.__propagationStopped) {
          return;
        }
      }

      // set the event phase to `AT_TARGET` as in spec
      Object.defineProperty(e, 'eventPhase', { value: Event.AT_TARGET });

      // the event only needs to be fired when owner roots change when iterating the event path
      // keep track of the last seen owner root
      var lastFiredRoot = void 0;
      for (var _i = 0; _i < path.length; _i++) {
        node = path[_i];
        if (_i === 0 || node.shadowRoot && node.shadowRoot === lastFiredRoot) {
          fireHandlers(e, node, 'bubble');
          // don't bother with window, it doesn't have `getRootNode` and will be last in the path anyway
          if (node !== window) {
            lastFiredRoot = node.getRootNode();
          }
          if (e.__propagationStopped) {
            return;
          }
        }
      }
    }

    function addEventListener(type, fn, optionsOrCapture) {
      if (!fn) {
        return;
      }

      // The callback `fn` might be used for multiple nodes/events. Since we generate
      // a wrapper function, we need to keep track of it when we remove the listener.
      // It's more efficient to store the node/type/options information as Array in
      // `fn` itself rather than the node (we assume that the same callback is used
      // for few nodes at most, whereas a node will likely have many event listeners).
      // NOTE(valdrin) invoking external functions is costly, inline has better perf.
      var capture = void 0,
          once = void 0,
          passive = void 0;
      if ((typeof optionsOrCapture === 'undefined' ? 'undefined' : _typeof(optionsOrCapture)) === 'object') {
        capture = Boolean(optionsOrCapture.capture);
        once = Boolean(optionsOrCapture.once);
        passive = Boolean(optionsOrCapture.passive);
      } else {
        capture = Boolean(optionsOrCapture);
        once = false;
        passive = false;
      }
      if (fn.__eventWrappers) {
        // Stop if the wrapper function has already been created.
        for (var i = 0; i < fn.__eventWrappers.length; i++) {
          if (fn.__eventWrappers[i].node === this && fn.__eventWrappers[i].type === type && fn.__eventWrappers[i].capture === capture && fn.__eventWrappers[i].once === once && fn.__eventWrappers[i].passive === passive) {
            return;
          }
        }
      } else {
        fn.__eventWrappers = [];
      }

      var wrapperFn = function wrapperFn(e) {
        // Support `once` option.
        if (once) {
          this.removeEventListener(type, fn, optionsOrCapture);
        }
        if (!e.__target) {
          patchEvent(e);
        }
        // There are two critera that should stop events from firing on this node
        // 1. the event is not composed and the current node is not in the same root as the target
        // 2. when bubbling, if after retargeting, relatedTarget and target point to the same node
        if (e.composed || e.composedPath().indexOf(this) > -1) {
          if (e.eventPhase === Event.BUBBLING_PHASE) {
            if (e.target === e.relatedTarget) {
              e.stopImmediatePropagation();
              return;
            }
          }
          if (fn.handleEvent) {
            fn.handleEvent(e);
            return;
          }
          return fn.call(this, e);
        }
      };
      // Store the wrapper information.
      fn.__eventWrappers.push({
        node: this,
        type: type,
        capture: capture,
        once: once,
        passive: passive,
        wrapperFn: wrapperFn
      });

      if (nonBubblingEventsToRetarget[type]) {
        this.__handlers = this.__handlers || {};
        this.__handlers[type] = this.__handlers[type] || { capture: [], bubble: [] };
        this.__handlers[type][capture ? 'capture' : 'bubble'].push(wrapperFn);
      } else {
        nativeAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
      }
    }

    function removeEventListener(type, fn, optionsOrCapture) {
      if (!fn) {
        return;
      }

      // NOTE(valdrin) invoking external functions is costly, inline has better perf.
      var capture = void 0,
          once = void 0,
          passive = void 0;
      if ((typeof optionsOrCapture === 'undefined' ? 'undefined' : _typeof(optionsOrCapture)) === 'object') {
        capture = Boolean(optionsOrCapture.capture);
        once = Boolean(optionsOrCapture.once);
        passive = Boolean(optionsOrCapture.passive);
      } else {
        capture = Boolean(optionsOrCapture);
        once = false;
        passive = false;
      }
      // Search the wrapped function.
      var wrapperFn = undefined;
      if (fn.__eventWrappers) {
        for (var i = 0; i < fn.__eventWrappers.length; i++) {
          if (fn.__eventWrappers[i].node === this && fn.__eventWrappers[i].type === type && fn.__eventWrappers[i].capture === capture && fn.__eventWrappers[i].once === once && fn.__eventWrappers[i].passive === passive) {
            wrapperFn = fn.__eventWrappers.splice(i, 1)[0].wrapperFn;
            // Cleanup.
            if (!fn.__eventWrappers.length) {
              fn.__eventWrappers = undefined;
            }
            break;
          }
        }
      }

      nativeRemoveEventListener.call(this, type, wrapperFn || fn, optionsOrCapture);
      if (wrapperFn && nonBubblingEventsToRetarget[type] && this.__handlers && this.__handlers[type]) {
        var arr = this.__handlers[type][capture ? 'capture' : 'bubble'];
        var idx = arr.indexOf(wrapperFn);
        if (idx > -1) {
          arr.splice(idx, 1);
        }
      }
    }

    function activateFocusEventOverrides() {
      for (var ev in nonBubblingEventsToRetarget) {
        window.addEventListener(ev, function (e) {
          if (!e.__target) {
            patchEvent(e);
            retargetNonBubblingEvent(e);
            e.stopImmediatePropagation();
          }
        }, true);
      }
    }

    function patchEvent(event) {
      event.__target = event.target;
      event.__relatedTarget = event.relatedTarget;
      // patch event prototype if we can
      if (settings.hasDescriptors) {
        patchPrototype(event, eventMixin);
        // and fallback to patching instance
      } else {
        extend(event, eventMixin);
      }
    }

    var PatchedEvent = mixinComposedFlag(window.Event);
    var PatchedCustomEvent = mixinComposedFlag(window.CustomEvent);
    var PatchedMouseEvent = mixinComposedFlag(window.MouseEvent);

    function patchEvents() {
      window.Event = PatchedEvent;
      window.CustomEvent = PatchedCustomEvent;
      window.MouseEvent = PatchedMouseEvent;
      activateFocusEventOverrides();
    }

    function newSplice(index, removed, addedCount) {
      return {
        index: index,
        removed: removed,
        addedCount: addedCount
      };
    }

    var EDIT_LEAVE = 0;
    var EDIT_UPDATE = 1;
    var EDIT_ADD = 2;
    var EDIT_DELETE = 3;

    var ArraySplice = {

      // Note: This function is *based* on the computation of the Levenshtein
      // "edit" distance. The one change is that "updates" are treated as two
      // edits - not one. With Array splices, an update is really a delete
      // followed by an add. By retaining this, we optimize for "keeping" the
      // maximum array items in the original array. For example:
      //
      //   'xxxx123' -> '123yyyy'
      //
      // With 1-edit updates, the shortest path would be just to update all seven
      // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
      // leaves the substring '123' intact.
      calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
        // "Deletion" columns
        var rowCount = oldEnd - oldStart + 1;
        var columnCount = currentEnd - currentStart + 1;
        var distances = new Array(rowCount);

        // "Addition" rows. Initialize null column.
        for (var i = 0; i < rowCount; i++) {
          distances[i] = new Array(columnCount);
          distances[i][0] = i;
        }

        // Initialize null row
        for (var j = 0; j < columnCount; j++) {
          distances[0][j] = j;
        }for (var _i = 1; _i < rowCount; _i++) {
          for (var _j = 1; _j < columnCount; _j++) {
            if (this.equals(current[currentStart + _j - 1], old[oldStart + _i - 1])) distances[_i][_j] = distances[_i - 1][_j - 1];else {
              var north = distances[_i - 1][_j] + 1;
              var west = distances[_i][_j - 1] + 1;
              distances[_i][_j] = north < west ? north : west;
            }
          }
        }

        return distances;
      },


      // This starts at the final weight, and walks "backward" by finding
      // the minimum previous weight recursively until the origin of the weight
      // matrix.
      spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
        var i = distances.length - 1;
        var j = distances[0].length - 1;
        var current = distances[i][j];
        var edits = [];
        while (i > 0 || j > 0) {
          if (i == 0) {
            edits.push(EDIT_ADD);
            j--;
            continue;
          }
          if (j == 0) {
            edits.push(EDIT_DELETE);
            i--;
            continue;
          }
          var northWest = distances[i - 1][j - 1];
          var west = distances[i - 1][j];
          var north = distances[i][j - 1];

          var min = void 0;
          if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;

          if (min == northWest) {
            if (northWest == current) {
              edits.push(EDIT_LEAVE);
            } else {
              edits.push(EDIT_UPDATE);
              current = northWest;
            }
            i--;
            j--;
          } else if (min == west) {
            edits.push(EDIT_DELETE);
            i--;
            current = west;
          } else {
            edits.push(EDIT_ADD);
            j--;
            current = north;
          }
        }

        edits.reverse();
        return edits;
      },


      /**
       * Splice Projection functions:
       *
       * A splice map is a representation of how a previous array of items
       * was transformed into a new array of items. Conceptually it is a list of
       * tuples of
       *
       *   <index, removed, addedCount>
       *
       * which are kept in ascending index order of. The tuple represents that at
       * the |index|, |removed| sequence of items were removed, and counting forward
       * from |index|, |addedCount| items were added.
       */

      /**
       * Lacking individual splice mutation information, the minimal set of
       * splices can be synthesized given the previous state and final state of an
       * array. The basic approach is to calculate the edit distance matrix and
       * choose the shortest path through it.
       *
       * Complexity: O(l * p)
       *   l: The length of the current array
       *   p: The length of the old array
       */
      calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
        var prefixCount = 0;
        var suffixCount = 0;
        var splice = void 0;

        var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
        if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);

        if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

        currentStart += prefixCount;
        oldStart += prefixCount;
        currentEnd -= suffixCount;
        oldEnd -= suffixCount;

        if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];

        if (currentStart == currentEnd) {
          splice = newSplice(currentStart, [], 0);
          while (oldStart < oldEnd) {
            splice.removed.push(old[oldStart++]);
          }return [splice];
        } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];

        var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

        splice = undefined;
        var splices = [];
        var index = currentStart;
        var oldIndex = oldStart;
        for (var i = 0; i < ops.length; i++) {
          switch (ops[i]) {
            case EDIT_LEAVE:
              if (splice) {
                splices.push(splice);
                splice = undefined;
              }

              index++;
              oldIndex++;
              break;
            case EDIT_UPDATE:
              if (!splice) splice = newSplice(index, [], 0);

              splice.addedCount++;
              index++;

              splice.removed.push(old[oldIndex]);
              oldIndex++;
              break;
            case EDIT_ADD:
              if (!splice) splice = newSplice(index, [], 0);

              splice.addedCount++;
              index++;
              break;
            case EDIT_DELETE:
              if (!splice) splice = newSplice(index, [], 0);

              splice.removed.push(old[oldIndex]);
              oldIndex++;
              break;
          }
        }

        if (splice) {
          splices.push(splice);
        }
        return splices;
      },
      sharedPrefix: function sharedPrefix(current, old, searchLength) {
        for (var i = 0; i < searchLength; i++) {
          if (!this.equals(current[i], old[i])) return i;
        }return searchLength;
      },
      sharedSuffix: function sharedSuffix(current, old, searchLength) {
        var index1 = current.length;
        var index2 = old.length;
        var count = 0;
        while (count < searchLength && this.equals(current[--index1], old[--index2])) {
          count++;
        }return count;
      },
      calculateSplices: function calculateSplices(current, previous) {
        return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
      },
      equals: function equals(currentValue, previousValue) {
        return currentValue === previousValue;
      }
    };

    var calculateSplices = function calculateSplices(current, previous) {
      return ArraySplice.calculateSplices(current, previous);
    };

    // NOTE: normalize event contruction where necessary (IE11)
    var NormalizedEvent = typeof Event === 'function' ? Event : function (inType, params) {
      params = params || {};
      var e = document.createEvent('Event');
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
      return e;
    };

    var _class = function () {
      function _class(root) {
        classCallCheck(this, _class);

        this.root = root;
        this.insertionPointTag = 'slot';
      }

      createClass(_class, [{
        key: 'getInsertionPoints',
        value: function getInsertionPoints() {
          return this.root.querySelectorAll(this.insertionPointTag);
        }
      }, {
        key: 'hasInsertionPoint',
        value: function hasInsertionPoint() {
          return Boolean(this.root._insertionPoints && this.root._insertionPoints.length);
        }
      }, {
        key: 'isInsertionPoint',
        value: function isInsertionPoint(node) {
          return node.localName && node.localName == this.insertionPointTag;
        }
      }, {
        key: 'distribute',
        value: function distribute() {
          if (this.hasInsertionPoint()) {
            return this.distributePool(this.root, this.collectPool());
          }
          return [];
        }

        // Gather the pool of nodes that should be distributed. We will combine
        // these with the "content root" to arrive at the composed tree.

      }, {
        key: 'collectPool',
        value: function collectPool() {
          var host = this.root.host;
          var pool = [],
              i = 0;
          for (var n = host.firstChild; n; n = n.nextSibling) {
            pool[i++] = n;
          }
          return pool;
        }

        // perform "logical" distribution; note, no actual dom is moved here,
        // instead elements are distributed into storage
        // array where applicable.

      }, {
        key: 'distributePool',
        value: function distributePool(node, pool) {
          var dirtyRoots = [];
          var p$ = this.root._insertionPoints;
          for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
            this.distributeInsertionPoint(p, pool);
            // provoke redistribution on insertion point parents
            // must do this on all candidate hosts since distribution in this
            // scope invalidates their distribution.
            // only get logical parent.
            var parent = p.parentNode;
            if (parent && parent.shadyRoot && this.hasInsertionPoint(parent.shadyRoot)) {
              dirtyRoots.push(parent.shadyRoot);
            }
          }
          for (var _i = 0; _i < pool.length; _i++) {
            var _p = pool[_i];
            if (_p) {
              _p.__shady = _p.__shady || {};
              _p.__shady.assignedSlot = undefined;
              // remove undistributed elements from physical dom.
              var _parent = parentNode(_p);
              if (_parent) {
                removeChild.call(_parent, _p);
              }
            }
          }
          return dirtyRoots;
        }
      }, {
        key: 'distributeInsertionPoint',
        value: function distributeInsertionPoint(insertionPoint, pool) {
          var prevAssignedNodes = insertionPoint.__shady.assignedNodes;
          if (prevAssignedNodes) {
            this.clearAssignedSlots(insertionPoint, true);
          }
          insertionPoint.__shady.assignedNodes = [];
          var needsSlotChange = false;
          // distribute nodes from the pool that this selector matches
          var anyDistributed = false;
          for (var i = 0, l = pool.length, node; i < l; i++) {
            node = pool[i];
            // skip nodes that were already used
            if (!node) {
              continue;
            }
            // distribute this node if it matches
            if (this.matchesInsertionPoint(node, insertionPoint)) {
              if (node.__shady._prevAssignedSlot != insertionPoint) {
                needsSlotChange = true;
              }
              this.distributeNodeInto(node, insertionPoint);
              // remove this node from the pool
              pool[i] = undefined;
              // since at least one node matched, we won't need fallback content
              anyDistributed = true;
            }
          }
          // Fallback content if nothing was distributed here
          if (!anyDistributed) {
            var children = insertionPoint.childNodes;
            for (var j = 0, _node; j < children.length; j++) {
              _node = children[j];
              if (_node.__shady._prevAssignedSlot != insertionPoint) {
                needsSlotChange = true;
              }
              this.distributeNodeInto(_node, insertionPoint);
            }
          }
          // we're already dirty if a node was newly added to the slot
          // and we're also dirty if the assigned count decreased.
          if (prevAssignedNodes) {
            // TODO(sorvell): the tracking of previously assigned slots
            // could instead by done with a Set and then we could
            // avoid needing to iterate here to clear the info.
            for (var _i2 = 0; _i2 < prevAssignedNodes.length; _i2++) {
              prevAssignedNodes[_i2].__shady._prevAssignedSlot = null;
            }
            if (insertionPoint.__shady.assignedNodes.length < prevAssignedNodes.length) {
              needsSlotChange = true;
            }
          }
          this.setDistributedNodesOnInsertionPoint(insertionPoint);
          if (needsSlotChange) {
            this._fireSlotChange(insertionPoint);
          }
        }
      }, {
        key: 'clearAssignedSlots',
        value: function clearAssignedSlots(slot, savePrevious) {
          var n$ = slot.__shady.assignedNodes;
          if (n$) {
            for (var i = 0; i < n$.length; i++) {
              var n = n$[i];
              if (savePrevious) {
                n.__shady._prevAssignedSlot = n.__shady.assignedSlot;
              }
              // only clear if it was previously set to this slot;
              // this helps ensure that if the node has otherwise been distributed
              // ignore it.
              if (n.__shady.assignedSlot === slot) {
                n.__shady.assignedSlot = null;
              }
            }
          }
        }
      }, {
        key: 'matchesInsertionPoint',
        value: function matchesInsertionPoint(node, insertionPoint) {
          var slotName = insertionPoint.getAttribute('name');
          slotName = slotName ? slotName.trim() : '';
          var slot = node.getAttribute && node.getAttribute('slot');
          slot = slot ? slot.trim() : '';
          return slot == slotName;
        }
      }, {
        key: 'distributeNodeInto',
        value: function distributeNodeInto(child, insertionPoint) {
          insertionPoint.__shady.assignedNodes.push(child);
          child.__shady.assignedSlot = insertionPoint;
        }
      }, {
        key: 'setDistributedNodesOnInsertionPoint',
        value: function setDistributedNodesOnInsertionPoint(insertionPoint) {
          var n$ = insertionPoint.__shady.assignedNodes;
          insertionPoint.__shady.distributedNodes = [];
          for (var i = 0, n; i < n$.length && (n = n$[i]); i++) {
            if (this.isInsertionPoint(n)) {
              var d$ = n.__shady.distributedNodes;
              if (d$) {
                for (var j = 0; j < d$.length; j++) {
                  insertionPoint.__shady.distributedNodes.push(d$[j]);
                }
              }
            } else {
              insertionPoint.__shady.distributedNodes.push(n$[i]);
            }
          }
        }
      }, {
        key: '_fireSlotChange',
        value: function _fireSlotChange(insertionPoint) {
          // NOTE: cannot bubble correctly here so not setting bubbles: true
          // Safari tech preview does not bubble but chrome does
          // Spec says it bubbles (https://dom.spec.whatwg.org/#mutation-observers)
          insertionPoint.dispatchEvent(new NormalizedEvent('slotchange'));
          if (insertionPoint.__shady.assignedSlot) {
            this._fireSlotChange(insertionPoint.__shady.assignedSlot);
          }
        }
      }, {
        key: 'isFinalDestination',
        value: function isFinalDestination(insertionPoint) {
          return !insertionPoint.__shady.assignedSlot;
        }
      }]);
      return _class;
    }();

    // Do not export this object. It must be passed as the first argument to the
    // ShadyRoot constructor in `attachShadow` to prevent the constructor from
    // throwing. This prevents the user from being able to manually construct a
    // ShadyRoot (i.e. `new ShadowRoot()`).
    var ShadyRootConstructionToken = {};

    var ShadyRoot = function ShadyRoot(token, host) {
      if (token !== ShadyRootConstructionToken) {
        throw new TypeError('Illegal constructor');
      }
      // NOTE: this strange construction is necessary because
      // DocumentFragment cannot be subclassed on older browsers.
      var shadowRoot = document.createDocumentFragment();
      shadowRoot.__proto__ = ShadyRoot.prototype;
      shadowRoot._init(host);
      return shadowRoot;
    };

    ShadyRoot.prototype = Object.create(DocumentFragment.prototype);
    extendAll(ShadyRoot.prototype, {
      _init: function _init(host) {
        // NOTE: set a fake local name so this element can be
        // distinguished from a DocumentFragment when patching.
        // FF doesn't allow this to be `localName`
        this.__localName = 'ShadyRoot';
        // logical dom setup
        recordChildNodes(host);
        recordChildNodes(this);
        // root <=> host
        host.shadowRoot = this;
        this.host = host;
        // state flags
        this._renderPending = false;
        this._hasRendered = false;
        this._changePending = false;
        this._distributor = new _class(this);
        this.update();
      },


      // async render
      update: function update() {
        var _this = this;

        if (!this._renderPending) {
          this._renderPending = true;
          enqueue(function () {
            return _this.render();
          });
        }
      },


      // returns the oldest renderPending ancestor root.
      _getRenderRoot: function _getRenderRoot() {
        var renderRoot = this;
        var root = this;
        while (root) {
          if (root._renderPending) {
            renderRoot = root;
          }
          root = root._rendererForHost();
        }
        return renderRoot;
      },


      // Returns the shadyRoot `this.host` if `this.host`
      // has children that require distribution.
      _rendererForHost: function _rendererForHost() {
        var root = this.host.getRootNode();
        if (isShadyRoot(root)) {
          var c$ = this.host.childNodes;
          for (var i = 0, c; i < c$.length; i++) {
            c = c$[i];
            if (this._distributor.isInsertionPoint(c)) {
              return root;
            }
          }
        }
      },
      render: function render() {
        if (this._renderPending) {
          this._getRenderRoot()._render();
        }
      },
      _render: function _render() {
        this._renderPending = false;
        this._changePending = false;
        if (!this._skipUpdateInsertionPoints) {
          this.updateInsertionPoints();
        } else if (!this._hasRendered) {
          this._insertionPoints = [];
        }
        this._skipUpdateInsertionPoints = false;
        // TODO(sorvell): can add a first render optimization here
        // to use if there are no insertion points
        // 1. clear host node of composed children
        // 2. appendChild the shadowRoot itself or (more robust) its logical children
        // NOTE: this didn't seem worth it in perf testing
        // but not ready to delete this info.
        // logical
        this.distribute();
        // physical
        this.compose();
        this._hasRendered = true;
      },
      forceRender: function forceRender() {
        this._renderPending = true;
        this.render();
      },
      distribute: function distribute() {
        var dirtyRoots = this._distributor.distribute();
        for (var i = 0; i < dirtyRoots.length; i++) {
          dirtyRoots[i]._render();
        }
      },
      updateInsertionPoints: function updateInsertionPoints() {
        var i$ = this.__insertionPoints;
        // if any insertion points have been removed, clear their distribution info
        if (i$) {
          for (var i = 0, c; i < i$.length; i++) {
            c = i$[i];
            if (c.getRootNode() !== this) {
              this._distributor.clearAssignedSlots(c);
            }
          }
        }
        i$ = this._insertionPoints = this._distributor.getInsertionPoints();
        // ensure insertionPoints's and their parents have logical dom info.
        // save logical tree info
        // a. for shadyRoot
        // b. for insertion points (fallback)
        // c. for parents of insertion points
        for (var _i = 0, _c; _i < i$.length; _i++) {
          _c = i$[_i];
          _c.__shady = _c.__shady || {};
          recordChildNodes(_c);
          recordChildNodes(_c.parentNode);
        }
      },


      get _insertionPoints() {
        if (!this.__insertionPoints) {
          this.updateInsertionPoints();
        }
        return this.__insertionPoints || (this.__insertionPoints = []);
      },

      set _insertionPoints(insertionPoints) {
        this.__insertionPoints = insertionPoints;
      },

      hasInsertionPoint: function hasInsertionPoint() {
        return this._distributor.hasInsertionPoint();
      },
      compose: function compose() {
        // compose self
        // note: it's important to mark this clean before distribution
        // so that attachment that provokes additional distribution (e.g.
        // adding something to your parentNode) works
        this._composeTree();
        // TODO(sorvell): See fast paths here in Polymer v1
        // (these seem unnecessary)
      },


      // Reify dom such that it is at its correct rendering position
      // based on logical distribution.
      _composeTree: function _composeTree() {
        this._updateChildNodes(this.host, this._composeNode(this.host));
        var p$ = this._insertionPoints || [];
        for (var i = 0, l = p$.length, p, parent; i < l && (p = p$[i]); i++) {
          parent = p.parentNode;
          if (parent !== this.host && parent !== this) {
            this._updateChildNodes(parent, this._composeNode(parent));
          }
        }
      },


      // Returns the list of nodes which should be rendered inside `node`.
      _composeNode: function _composeNode(node) {
        var children = [];
        var c$ = (node.shadyRoot || node).childNodes;
        for (var i = 0; i < c$.length; i++) {
          var child = c$[i];
          if (this._distributor.isInsertionPoint(child)) {
            var distributedNodes = child.__shady.distributedNodes || (child.__shady.distributedNodes = []);
            for (var j = 0; j < distributedNodes.length; j++) {
              var distributedNode = distributedNodes[j];
              if (this.isFinalDestination(child, distributedNode)) {
                children.push(distributedNode);
              }
            }
          } else {
            children.push(child);
          }
        }
        return children;
      },
      isFinalDestination: function isFinalDestination(insertionPoint, node) {
        return this._distributor.isFinalDestination(insertionPoint, node);
      },


      // Ensures that the rendered node list inside `container` is `children`.
      _updateChildNodes: function _updateChildNodes(container, children) {
        var composed = childNodes(container);
        var splices = calculateSplices(children, composed);
        // process removals
        for (var i = 0, d = 0, s; i < splices.length && (s = splices[i]); i++) {
          for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
            // check if the node is still where we expect it is before trying
            // to remove it; this can happen if we move a node and
            // then schedule its previous host for distribution resulting in
            // the node being removed here.
            if (parentNode(n) === container) {
              removeChild.call(container, n);
            }
            composed.splice(s.index + d, 1);
          }
          d -= s.addedCount;
        }
        // process adds
        for (var _i2 = 0, _s, next; _i2 < splices.length && (_s = splices[_i2]); _i2++) {
          //eslint-disable-line no-redeclare
          next = composed[_s.index];
          for (var _j = _s.index, _n; _j < _s.index + _s.addedCount; _j++) {
            _n = children[_j];
            insertBefore.call(container, _n, next);
            // TODO(sorvell): is this splice strictly needed?
            composed.splice(_j, 0, _n);
          }
        }
      },
      getInsertionPointTag: function getInsertionPointTag() {
        return this._distributor.insertionPointTag;
      }
    });

    /**
      Implements a pared down version of ShadowDOM's scoping, which is easy to
      polyfill across browsers.
    */
    function attachShadow(host, options) {
      if (!host) {
        throw 'Must provide a host.';
      }
      if (!options) {
        throw 'Not enough arguments.';
      }
      return new ShadyRoot(ShadyRootConstructionToken, host);
    }

    patchShadowRootAccessors(ShadyRoot.prototype);

    function getAssignedSlot(node) {
      renderRootNode(node);
      return getProperty(node, 'assignedSlot') || null;
    }

    var nodeMixin = {

      addEventListener: addEventListener,

      removeEventListener: removeEventListener,

      appendChild: function appendChild(node) {
        return insertBefore$1(this, node);
      },
      insertBefore: function insertBefore(node, ref_node) {
        return insertBefore$1(this, node, ref_node);
      },
      removeChild: function removeChild(node) {
        return removeChild$1(this, node);
      },
      replaceChild: function replaceChild(node, ref_node) {
        this.insertBefore(node, ref_node);
        this.removeChild(ref_node);
        return node;
      },
      cloneNode: function cloneNode(deep) {
        return cloneNode$1(this, deep);
      },
      getRootNode: function getRootNode$$(options) {
        return getRootNode(this, options);
      },


      get isConnected() {
        // Fast path for distributed nodes.
        var ownerDocument = this.ownerDocument;
        if (ownerDocument && ownerDocument.contains && ownerDocument.contains(this)) return true;
        var ownerDocumentElement = ownerDocument.documentElement;
        if (ownerDocumentElement && ownerDocumentElement.contains && ownerDocumentElement.contains(this)) return true;

        var node = this;
        while (node && !(node instanceof Document)) {
          node = node.parentNode || (node instanceof ShadyRoot ? node.host : undefined);
        }
        return !!(node && node instanceof Document);
      }

    };

    // NOTE: For some reason `Text` redefines `assignedSlot`
    var textMixin = {
      get assignedSlot() {
        return getAssignedSlot(this);
      }
    };

    var fragmentMixin = {

      // TODO(sorvell): consider doing native QSA and filtering results.
      querySelector: function querySelector(selector) {
        // match selector and halt on first result.
        var result = query(this, function (n) {
          return matchesSelector(n, selector);
        }, function (n) {
          return Boolean(n);
        })[0];
        return result || null;
      },
      querySelectorAll: function querySelectorAll(selector) {
        return query(this, function (n) {
          return matchesSelector(n, selector);
        });
      }
    };

    var slotMixin = {
      assignedNodes: function assignedNodes(options) {
        if (this.localName === 'slot') {
          renderRootNode(this);
          return this.__shady ? (options && options.flatten ? this.__shady.distributedNodes : this.__shady.assignedNodes) || [] : [];
        }
      }
    };

    var elementMixin = extendAll({
      setAttribute: function setAttribute(name, value) {
        setAttribute$1(this, name, value);
      },
      removeAttribute: function removeAttribute(name) {
        removeAttribute$1(this, name);
      },
      attachShadow: function attachShadow$$(options) {
        return attachShadow(this, options);
      },


      get slot() {
        return this.getAttribute('slot');
      },

      set slot(value) {
        this.setAttribute('slot', value);
      },

      get assignedSlot() {
        return getAssignedSlot(this);
      }

    }, fragmentMixin, slotMixin);

    Object.defineProperties(elementMixin, ShadowRootAccessor);

    var documentMixin = extendAll({
      importNode: function importNode(node, deep) {
        return importNode$1(node, deep);
      }
    }, fragmentMixin);

    Object.defineProperties(documentMixin, {
      _activeElement: ActiveElementAccessor.activeElement
    });

    function patchBuiltin(proto, obj) {
      var n$ = Object.getOwnPropertyNames(obj);
      for (var i = 0; i < n$.length; i++) {
        var n = n$[i];
        var d = Object.getOwnPropertyDescriptor(obj, n);
        // NOTE: we prefer writing directly here because some browsers
        // have descriptors that are writable but not configurable (e.g.
        // `appendChild` on older browsers)
        if (d.value) {
          proto[n] = d.value;
        } else {
          Object.defineProperty(proto, n, d);
        }
      }
    }

    // Apply patches to builtins (e.g. Element.prototype). Some of these patches
    // can be done unconditionally (mostly methods like
    // `Element.prototype.appendChild`) and some can only be done when the browser
    // has proper descriptors on the builtin prototype
    // (e.g. `Element.prototype.firstChild`)`. When descriptors are not available,
    // elements are individually patched when needed (see e.g.
    // `patchInside/OutsideElementAccessors` in `patch-accessors.js`).
    function patchBuiltins() {
      // These patches can always be done, for all supported browsers.
      patchBuiltin(window.Node.prototype, nodeMixin);
      patchBuiltin(window.Text.prototype, textMixin);
      patchBuiltin(window.DocumentFragment.prototype, fragmentMixin);
      patchBuiltin(window.Element.prototype, elementMixin);
      patchBuiltin(window.Document.prototype, documentMixin);
      if (window.HTMLSlotElement) {
        patchBuiltin(window.HTMLSlotElement.prototype, slotMixin);
      }
      // These patches can *only* be done
      // on browsers that have proper property descriptors on builtin prototypes.
      // This includes: IE11, Edge, Chrome >= 4?; Safari >= 10, Firefox
      // On older browsers (Chrome <= 4?, Safari 9), a per element patching
      // strategy is used for patching accessors.
      if (settings.hasDescriptors) {
        patchAccessors(window.Node.prototype);
        patchAccessors(window.Text.prototype);
        patchAccessors(window.DocumentFragment.prototype);
        patchAccessors(window.Element.prototype);
        var nativeHTMLElement = window.customElements && customElements.nativeHTMLElement || HTMLElement;
        patchAccessors(nativeHTMLElement.prototype);
        patchAccessors(window.Document.prototype);
        if (window.HTMLSlotElement) {
          patchAccessors(window.HTMLSlotElement.prototype);
        }
      }
    }

    if (settings.inUse) {

      window.ShadyDOM = {
        // TODO(sorvell): remove when Polymer does not depend on this.
        inUse: settings.inUse,
        // TODO(sorvell): remove when Polymer does not depend on this.
        patch: function patch(node) {
          return node;
        },
        isShadyRoot: isShadyRoot,
        enqueue: enqueue,
        flush: flush,
        settings: settings,
        filterMutations: filterMutations,
        observeChildren: observeChildren,
        unobserveChildren: unobserveChildren,
        nativeMethods: nativeMethods,
        nativeTree: nativeTree
      };

      // Apply patches to events...
      patchEvents();
      // Apply patches to builtins (e.g. Element.prototype) where applicable.
      patchBuiltins();

      window.ShadowRoot = ShadyRoot;
    }

    // given a string of css, return a simple rule tree

    function parse(text) {
      text = clean(text);
      return parseCss(lex(text), text);
    }

    // remove stuff we don't care about that may hinder parsing
    function clean(cssText) {
      return cssText.replace(RX.comments, '').replace(RX.port, '');
    }

    // super simple {...} lexer that returns a node tree
    function lex(text) {
      var root = {
        start: 0,
        end: text.length
      };
      var n = root;
      for (var i = 0, l = text.length; i < l; i++) {
        if (text[i] === OPEN_BRACE) {
          if (!n.rules) {
            n.rules = [];
          }
          var p = n;
          var previous = p.rules[p.rules.length - 1];
          n = {
            start: i + 1,
            parent: p,
            previous: previous
          };
          p.rules.push(n);
        } else if (text[i] === CLOSE_BRACE) {
          n.end = i + 1;
          n = n.parent || root;
        }
      }
      return root;
    }

    // add selectors/cssText to node tree
    function parseCss(node, text) {
      var t = text.substring(node.start, node.end - 1);
      node.parsedCssText = node.cssText = t.trim();
      if (node.parent) {
        var ss = node.previous ? node.previous.end : node.parent.start;
        t = text.substring(ss, node.start - 1);
        t = _expandUnicodeEscapes(t);
        t = t.replace(RX.multipleSpaces, ' ');
        // TODO(sorvell): ad hoc; make selector include only after last ;
        // helps with mixin syntax
        t = t.substring(t.lastIndexOf(';') + 1);
        var s = node.parsedSelector = node.selector = t.trim();
        node.atRule = s.indexOf(AT_START) === 0;
        // note, support a subset of rule types...
        if (node.atRule) {
          if (s.indexOf(MEDIA_START) === 0) {
            node.type = types.MEDIA_RULE;
          } else if (s.match(RX.keyframesRule)) {
            node.type = types.KEYFRAMES_RULE;
            node.keyframesName = node.selector.split(RX.multipleSpaces).pop();
          }
        } else {
          if (s.indexOf(VAR_START) === 0) {
            node.type = types.MIXIN_RULE;
          } else {
            node.type = types.STYLE_RULE;
          }
        }
      }
      var r$ = node.rules;
      if (r$) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          parseCss(r, text);
        }
      }
      return node;
    }

    // conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
    // expanded form that doesn't require trailing space `\000033`
    function _expandUnicodeEscapes(s) {
      return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
        var code = arguments[1],
            repeat = 6 - code.length;
        while (repeat--) {
          code = '0' + code;
        }
        return '\\' + code;
      });
    }

    // stringify parsed css.
    function stringify(node, preserveProperties, text) {
      text = text || '';
      // calc rule cssText
      var cssText = '';
      if (node.cssText || node.rules) {
        var r$ = node.rules;
        if (r$ && !_hasMixinRules(r$)) {
          for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
            cssText = stringify(r, preserveProperties, cssText);
          }
        } else {
          cssText = preserveProperties ? node.cssText : removeCustomProps(node.cssText);
          cssText = cssText.trim();
          if (cssText) {
            cssText = '  ' + cssText + '\n';
          }
        }
      }
      // emit rule if there is cssText
      if (cssText) {
        if (node.selector) {
          text += node.selector + ' ' + OPEN_BRACE + '\n';
        }
        text += cssText;
        if (node.selector) {
          text += CLOSE_BRACE + '\n\n';
        }
      }
      return text;
    }

    function _hasMixinRules(rules) {
      return rules[0].selector.indexOf(VAR_START) === 0;
    }

    function removeCustomProps(cssText) {
      cssText = removeCustomPropAssignment(cssText);
      return removeCustomPropApply(cssText);
    }

    function removeCustomPropAssignment(cssText) {
      return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
    }

    function removeCustomPropApply(cssText) {
      return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
    }

    var types = {
      STYLE_RULE: 1,
      KEYFRAMES_RULE: 7,
      MEDIA_RULE: 4,
      MIXIN_RULE: 1000
    };

    var OPEN_BRACE = '{';
    var CLOSE_BRACE = '}';

    // helper regexp's
    var RX = {
      comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
      port: /@import[^;]*;/gim,
      customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
      mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
      mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
      varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
      keyframesRule: /^@[^\s]*keyframes/,
      multipleSpaces: /\s+/g
    };

    var VAR_START = '--';
    var MEDIA_START = '@media';
    var AT_START = '@';

    var nativeShadow = !(window.ShadyDOM && window.ShadyDOM.inUse);
    // chrome 49 has semi-working css vars, check if box-shadow works
    // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
    var nativeCssVariables = !navigator.userAgent.match('AppleWebKit/601') && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)');

    // experimental support for native @apply
    function detectNativeApply() {
      var style = document.createElement('style');
      style.textContent = '.foo { @apply --foo }';
      document.head.appendChild(style);
      var nativeCssApply = style.sheet.cssRules[0].cssText.indexOf('apply') >= 0;
      document.head.removeChild(style);
      return nativeCssApply;
    }

    var nativeCssApply = false && detectNativeApply();

    function parseSettings(settings) {
      if (settings) {
        nativeCssVariables = nativeCssVariables && !settings.shimcssproperties;
        nativeShadow = nativeShadow && !settings.shimshadow;
      }
    }

    if (window.ShadyCSS) {
      parseSettings(window.ShadyCSS);
    } else if (window.WebComponents) {
      parseSettings(window.WebComponents.flags);
    }

    function toCssText(rules, callback) {
      if (typeof rules === 'string') {
        rules = parse(rules);
      }
      if (callback) {
        forEachRule(rules, callback);
      }
      return stringify(rules, nativeCssVariables);
    }

    function rulesForStyle(style) {
      if (!style.__cssRules && style.textContent) {
        style.__cssRules = parse(style.textContent);
      }
      return style.__cssRules;
    }

    // Tests if a rule is a keyframes selector, which looks almost exactly
    // like a normal selector but is not (it has nothing to do with scoping
    // for example).
    function isKeyframesSelector(rule) {
      return rule.parent && rule.parent.type === types.KEYFRAMES_RULE;
    }

    function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
      if (!node) {
        return;
      }
      var skipRules = false;
      if (onlyActiveRules) {
        if (node.type === types.MEDIA_RULE) {
          var matchMedia = node.selector.match(rx.MEDIA_MATCH);
          if (matchMedia) {
            // if rule is a non matching @media rule, skip subrules
            if (!window.matchMedia(matchMedia[1]).matches) {
              skipRules = true;
            }
          }
        }
      }
      if (node.type === types.STYLE_RULE) {
        styleRuleCallback(node);
      } else if (keyframesRuleCallback && node.type === types.KEYFRAMES_RULE) {
        keyframesRuleCallback(node);
      } else if (node.type === types.MIXIN_RULE) {
        skipRules = true;
      }
      var r$ = node.rules;
      if (r$ && !skipRules) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
        }
      }
    }

    // add a string of cssText to the document.
    function applyCss(cssText, moniker, target, contextNode) {
      var style = createScopeStyle(cssText, moniker);
      return applyStyle(style, target, contextNode);
    }

    function applyStyle(style, target, contextNode) {
      target = target || document.head;
      var after = contextNode && contextNode.nextSibling || target.firstChild;
      lastHeadApplyNode = style;
      return target.insertBefore(style, after);
    }

    function createScopeStyle(cssText, moniker) {
      var style = document.createElement('style');
      if (moniker) {
        style.setAttribute('scope', moniker);
      }
      style.textContent = cssText;
      return style;
    }

    var lastHeadApplyNode = null;

    // Walk from text[start] matching parens
    // returns position of the outer end paren
    function findMatchingParen(text, start) {
      var level = 0;
      for (var i = start, l = text.length; i < l; i++) {
        if (text[i] === '(') {
          level++;
        } else if (text[i] === ')') {
          if (--level === 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function processVariableAndFallback(str, callback) {
      // find 'var('
      var start = str.indexOf('var(');
      if (start === -1) {
        // no var?, everything is prefix
        return callback(str, '', '', '');
      }
      //${prefix}var(${inner})${suffix}
      var end = findMatchingParen(str, start + 3);
      var inner = str.substring(start + 4, end);
      var prefix = str.substring(0, start);
      // suffix may have other variables
      var suffix = processVariableAndFallback(str.substring(end + 1), callback);
      var comma = inner.indexOf(',');
      // value and fallback args should be trimmed to match in property lookup
      if (comma === -1) {
        // variable, no fallback
        return callback(prefix, inner.trim(), '', suffix);
      }
      // var(${value},${fallback})
      var value = inner.substring(0, comma).trim();
      var fallback = inner.substring(comma + 1).trim();
      return callback(prefix, value, fallback, suffix);
    }

    function setElementClassRaw(element, value) {
      // use native setAttribute provided by ShadyDOM when setAttribute is patched
      if (window.ShadyDOM) {
        window.ShadyDOM.nativeMethods.setAttribute.call(element, 'class', value);
      } else {
        element.setAttribute('class', value);
      }
    }

    var rx = {
      VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,
      MIXIN_MATCH: /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,
      VAR_CONSUMED: /(--[\w-]+)\s*([:,;)]|$)/gi,
      ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/,
      MEDIA_MATCH: /@media[^(]*(\([^)]*\))/,
      IS_VAR: /^--/,
      BRACKETED: /\{[^}]*\}/g,
      HOST_PREFIX: '(?:^|[^.#[:])',
      HOST_SUFFIX: '($|[.:[\\s>+~])'
    };

    /* Transforms ShadowDOM styling into ShadyDOM styling

    * scoping:

      * elements in scope get scoping selector class="x-foo-scope"
      * selectors re-written as follows:

        div button -> div.x-foo-scope button.x-foo-scope

    * :host -> scopeName

    * :host(...) -> scopeName...

    * ::slotted(...) -> scopeName > ...

    * ...:dir(ltr|rtl) -> [dir="ltr|rtl"] ..., ...[dir="ltr|rtl"]

    * :host(:dir[rtl]) -> scopeName:dir(rtl) -> [dir="rtl"] scopeName, scopeName[dir="rtl"]

    */
    var SCOPE_NAME = 'style-scope';

    var StyleTransformer = function () {
      function StyleTransformer() {
        classCallCheck(this, StyleTransformer);
      }

      createClass(StyleTransformer, [{
        key: 'dom',

        // Given a node and scope name, add a scoping class to each node
        // in the tree. This facilitates transforming css into scoped rules.
        value: function dom(node, scope, shouldRemoveScope) {
          // one time optimization to skip scoping...
          if (node.__styleScoped) {
            node.__styleScoped = null;
          } else {
            this._transformDom(node, scope || '', shouldRemoveScope);
          }
        }
      }, {
        key: '_transformDom',
        value: function _transformDom(node, selector, shouldRemoveScope) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.element(node, selector, shouldRemoveScope);
          }
          var c$ = node.localName === 'template' ? (node.content || node._content).childNodes : node.children || node.childNodes;
          if (c$) {
            for (var i = 0; i < c$.length; i++) {
              this._transformDom(c$[i], selector, shouldRemoveScope);
            }
          }
        }
      }, {
        key: 'element',
        value: function element(_element, scope, shouldRemoveScope) {
          // note: if using classes, we add both the general 'style-scope' class
          // as well as the specific scope. This enables easy filtering of all
          // `style-scope` elements
          if (scope) {
            // note: svg on IE does not have classList so fallback to class
            if (_element.classList) {
              if (shouldRemoveScope) {
                _element.classList.remove(SCOPE_NAME);
                _element.classList.remove(scope);
              } else {
                _element.classList.add(SCOPE_NAME);
                _element.classList.add(scope);
              }
            } else if (_element.getAttribute) {
              var c = _element.getAttribute(CLASS);
              if (shouldRemoveScope) {
                if (c) {
                  var newValue = c.replace(SCOPE_NAME, '').replace(scope, '');
                  setElementClassRaw(_element, newValue);
                }
              } else {
                var _newValue = (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope;
                setElementClassRaw(_element, _newValue);
              }
            }
          }
        }
      }, {
        key: 'elementStyles',
        value: function elementStyles(element, styleRules, callback) {
          var cssBuildType = element.__cssBuild;
          // no need to shim selectors if settings.useNativeShadow, also
          // a shady css build will already have transformed selectors
          // NOTE: This method may be called as part of static or property shimming.
          // When there is a targeted build it will not be called for static shimming,
          // but when the property shim is used it is called and should opt out of
          // static shimming work when a proper build exists.
          var cssText = nativeShadow || cssBuildType === 'shady' ? toCssText(styleRules, callback) : this.css(styleRules, element.is, element.extends, callback) + '\n\n';
          return cssText.trim();
        }

        // Given a string of cssText and a scoping string (scope), returns
        // a string of scoped css where each selector is transformed to include
        // a class created from the scope. ShadowDOM selectors are also transformed
        // (e.g. :host) to use the scoping selector.

      }, {
        key: 'css',
        value: function css(rules, scope, ext, callback) {
          var hostScope = this._calcHostScope(scope, ext);
          scope = this._calcElementScope(scope);
          var self = this;
          return toCssText(rules, function (rule) {
            if (!rule.isScoped) {
              self.rule(rule, scope, hostScope);
              rule.isScoped = true;
            }
            if (callback) {
              callback(rule, scope, hostScope);
            }
          });
        }
      }, {
        key: '_calcElementScope',
        value: function _calcElementScope(scope) {
          if (scope) {
            return CSS_CLASS_PREFIX + scope;
          } else {
            return '';
          }
        }
      }, {
        key: '_calcHostScope',
        value: function _calcHostScope(scope, ext) {
          return ext ? '[is=' + scope + ']' : scope;
        }
      }, {
        key: 'rule',
        value: function rule(_rule, scope, hostScope) {
          this._transformRule(_rule, this._transformComplexSelector, scope, hostScope);
        }

        // transforms a css rule to a scoped rule.

      }, {
        key: '_transformRule',
        value: function _transformRule(rule, transformer, scope, hostScope) {
          // NOTE: save transformedSelector for subsequent matching of elements
          // against selectors (e.g. when calculating style properties)
          rule.selector = rule.transformedSelector = this._transformRuleCss(rule, transformer, scope, hostScope);
        }
      }, {
        key: '_transformRuleCss',
        value: function _transformRuleCss(rule, transformer, scope, hostScope) {
          var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
          // we want to skip transformation of rules that appear in keyframes,
          // because they are keyframe selectors, not element selectors.
          if (!isKeyframesSelector(rule)) {
            for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
              p$[i] = transformer.call(this, p, scope, hostScope);
            }
          }
          return p$.join(COMPLEX_SELECTOR_SEP);
        }
      }, {
        key: '_transformComplexSelector',
        value: function _transformComplexSelector(selector, scope, hostScope) {
          var _this = this;

          var stop = false;
          selector = selector.trim();
          // Remove spaces inside of selectors like `:nth-of-type` because it confuses SIMPLE_SELECTOR_SEP
          selector = selector.replace(NTH, function (m, type, inner) {
            return ':' + type + '(' + inner.replace(/\s/g, '') + ')';
          });
          selector = selector.replace(SLOTTED_START, HOST + ' $1');
          selector = selector.replace(SIMPLE_SELECTOR_SEP, function (m, c, s) {
            if (!stop) {
              var info = _this._transformCompoundSelector(s, c, scope, hostScope);
              stop = stop || info.stop;
              c = info.combinator;
              s = info.value;
            }
            return c + s;
          });
          return selector;
        }
      }, {
        key: '_transformCompoundSelector',
        value: function _transformCompoundSelector(selector, combinator, scope, hostScope) {
          // replace :host with host scoping class
          var slottedIndex = selector.indexOf(SLOTTED);
          if (selector.indexOf(HOST) >= 0) {
            selector = this._transformHostSelector(selector, hostScope);
            // replace other selectors with scoping class
          } else if (slottedIndex !== 0) {
            selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
          }
          // mark ::slotted() scope jump to replace with descendant selector + arg
          // also ignore left-side combinator
          var slotted = false;
          if (slottedIndex >= 0) {
            combinator = '';
            slotted = true;
          }
          // process scope jumping selectors up to the scope jump and then stop
          var stop = void 0;
          if (slotted) {
            stop = true;
            if (slotted) {
              // .zonk ::slotted(.foo) -> .zonk.scope > .foo
              selector = selector.replace(SLOTTED_PAREN, function (m, paren) {
                return ' > ' + paren;
              });
            }
          }
          selector = selector.replace(DIR_PAREN, function (m, before, dir) {
            return '[dir="' + dir + '"] ' + before + ', ' + before + '[dir="' + dir + '"]';
          });
          return { value: selector, combinator: combinator, stop: stop };
        }
      }, {
        key: '_transformSimpleSelector',
        value: function _transformSimpleSelector(selector, scope) {
          var p$ = selector.split(PSEUDO_PREFIX);
          p$[0] += scope;
          return p$.join(PSEUDO_PREFIX);
        }

        // :host(...) -> scopeName...

      }, {
        key: '_transformHostSelector',
        value: function _transformHostSelector(selector, hostScope) {
          var m = selector.match(HOST_PAREN);
          var paren = m && m[2].trim() || '';
          if (paren) {
            if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
              // paren starts with a type selector
              var typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
              // if the type selector is our hostScope then avoid pre-pending it
              if (typeSelector === hostScope) {
                return paren;
                // otherwise, this selector should not match in this scope so
                // output a bogus selector.
              } else {
                return SELECTOR_NO_MATCH;
              }
            } else {
              // make sure to do a replace here to catch selectors like:
              // `:host(.foo)::before`
              return selector.replace(HOST_PAREN, function (m, host, paren) {
                return hostScope + paren;
              });
            }
            // if no paren, do a straight :host replacement.
            // TODO(sorvell): this should not strictly be necessary but
            // it's needed to maintain support for `:host[foo]` type selectors
            // which have been improperly used under Shady DOM. This should be
            // deprecated.
          } else {
            return selector.replace(HOST, hostScope);
          }
        }
      }, {
        key: 'documentRule',
        value: function documentRule(rule) {
          // reset selector in case this is redone.
          rule.selector = rule.parsedSelector;
          this.normalizeRootSelector(rule);
          this._transformRule(rule, this._transformDocumentSelector);
        }
      }, {
        key: 'normalizeRootSelector',
        value: function normalizeRootSelector(rule) {
          if (rule.selector === ROOT) {
            rule.selector = 'html';
          }
        }
      }, {
        key: '_transformDocumentSelector',
        value: function _transformDocumentSelector(selector) {
          return selector.match(SLOTTED) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
        }
      }, {
        key: 'SCOPE_NAME',
        get: function get() {
          return SCOPE_NAME;
        }
      }]);
      return StyleTransformer;
    }();

    var NTH = /:(nth[-\w]+)\(([^)]+)\)/;
    var SCOPE_DOC_SELECTOR = ':not(.' + SCOPE_NAME + ')';
    var COMPLEX_SELECTOR_SEP = ',';
    var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g;
    var SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
    var HOST = ':host';
    var ROOT = ':root';
    var SLOTTED = '::slotted';
    var SLOTTED_START = new RegExp('^(' + SLOTTED + ')');
    // NOTE: this supports 1 nested () pair for things like
    // :host(:not([selected]), more general support requires
    // parsing which seems like overkill
    var HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
    // similar to HOST_PAREN
    var SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
    var DIR_PAREN = /(.*):dir\((?:(ltr|rtl))\)/;
    var CSS_CLASS_PREFIX = '.';
    var PSEUDO_PREFIX = ':';
    var CLASS = 'class';
    var SELECTOR_NO_MATCH = 'should_not_match';

    var StyleTransformer$1 = new StyleTransformer();

    var templateMap = {};

    var promise = Promise.resolve();

    var StyleInfo = function () {
      createClass(StyleInfo, null, [{
        key: 'get',
        value: function get(node) {
          return node.__styleInfo;
        }
      }, {
        key: 'set',
        value: function set(node, styleInfo) {
          node.__styleInfo = styleInfo;
          return styleInfo;
        }
      }, {
        key: 'invalidate',
        value: function invalidate(elementName) {
          if (templateMap[elementName]) {
            templateMap[elementName]._applyShimInvalid = true;
          }
        }
        /*
        the template is marked as `validating` for one microtask so that all instances
        found in the tree crawl of `applyStyle` will update themselves,
        but the template will only be updated once.
        */

      }, {
        key: 'startValidating',
        value: function startValidating(elementName) {
          var template = templateMap[elementName];
          if (!template._validating) {
            template._validating = true;
            promise.then(function () {
              template._applyShimInvalid = false;
              template._validating = false;
            });
          }
        }
      }]);

      function StyleInfo(ast, placeholder, ownStylePropertyNames, elementName, typeExtension, cssBuild) {
        classCallCheck(this, StyleInfo);

        this.styleRules = ast || null;
        this.placeholder = placeholder || null;
        this.ownStylePropertyNames = ownStylePropertyNames || [];
        this.overrideStyleProperties = null;
        this.elementName = elementName || '';
        this.cssBuild = cssBuild || '';
        this.typeExtension = typeExtension || '';
        this.styleProperties = null;
        this.scopeSelector = null;
        this.customStyle = null;
      }

      return StyleInfo;
    }();

    // TODO: dedupe with shady
    var p$1 = window.Element.prototype;
    var matchesSelector$1 = p$1.matches || p$1.matchesSelector || p$1.mozMatchesSelector || p$1.msMatchesSelector || p$1.oMatchesSelector || p$1.webkitMatchesSelector;

    var IS_IE = navigator.userAgent.match('Trident');

    var XSCOPE_NAME = 'x-scope';

    var StyleProperties = function () {
      function StyleProperties() {
        classCallCheck(this, StyleProperties);
      }

      createClass(StyleProperties, [{
        key: 'decorateStyles',

        // decorates styles with rule info and returns an array of used style
        // property names
        value: function decorateStyles(rules) {
          var self = this,
              props = {},
              keyframes = [],
              ruleIndex = 0;
          forEachRule(rules, function (rule) {
            self.decorateRule(rule);
            // mark in-order position of ast rule in styles block, used for cache key
            rule.index = ruleIndex++;
            self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
          }, function onKeyframesRule(rule) {
            keyframes.push(rule);
          });
          // Cache all found keyframes rules for later reference:
          rules._keyframes = keyframes;
          // return this list of property names *consumes* in these styles.
          var names = [];
          for (var i in props) {
            names.push(i);
          }
          return names;
        }

        // decorate a single rule with property info

      }, {
        key: 'decorateRule',
        value: function decorateRule(rule) {
          if (rule.propertyInfo) {
            return rule.propertyInfo;
          }
          var info = {},
              properties = {};
          var hasProperties = this.collectProperties(rule, properties);
          if (hasProperties) {
            info.properties = properties;
            // TODO(sorvell): workaround parser seeing mixins as additional rules
            rule.rules = null;
          }
          info.cssText = this.collectCssText(rule);
          rule.propertyInfo = info;
          return info;
        }

        // collects the custom properties from a rule's cssText

      }, {
        key: 'collectProperties',
        value: function collectProperties(rule, properties) {
          var info = rule.propertyInfo;
          if (info) {
            if (info.properties) {
              Object.assign(properties, info.properties);
              return true;
            }
          } else {
            var m = void 0,
                rx$$ = rx.VAR_ASSIGN;
            var cssText = rule.parsedCssText;
            var value = void 0;
            var any = void 0;
            while (m = rx$$.exec(cssText)) {
              // note: group 2 is var, 3 is mixin
              value = (m[2] || m[3]).trim();
              // value of 'inherit' or 'unset' is equivalent to not setting the property here
              if (value !== 'inherit' || value !== 'unset') {
                properties[m[1].trim()] = value;
              }
              any = true;
            }
            return any;
          }
        }

        // returns cssText of properties that consume variables/mixins

      }, {
        key: 'collectCssText',
        value: function collectCssText(rule) {
          return this.collectConsumingCssText(rule.parsedCssText);
        }

        // NOTE: we support consumption inside mixin assignment
        // but not production, so strip out {...}

      }, {
        key: 'collectConsumingCssText',
        value: function collectConsumingCssText(cssText) {
          return cssText.replace(rx.BRACKETED, '').replace(rx.VAR_ASSIGN, '');
        }
      }, {
        key: 'collectPropertiesInCssText',
        value: function collectPropertiesInCssText(cssText, props) {
          var m = void 0;
          while (m = rx.VAR_CONSUMED.exec(cssText)) {
            var name = m[1];
            // This regex catches all variable names, and following non-whitespace char
            // If next char is not ':', then variable is a consumer
            if (m[2] !== ':') {
              props[name] = true;
            }
          }
        }

        // turns custom properties into realized values.

      }, {
        key: 'reify',
        value: function reify(props) {
          // big perf optimization here: reify only *own* properties
          // since this object has __proto__ of the element's scope properties
          var names = Object.getOwnPropertyNames(props);
          for (var i = 0, n; i < names.length; i++) {
            n = names[i];
            props[n] = this.valueForProperty(props[n], props);
          }
        }

        // given a property value, returns the reified value
        // a property value may be:
        // (1) a literal value like: red or 5px;
        // (2) a variable value like: var(--a), var(--a, red), or var(--a, --b) or
        // var(--a, var(--b));
        // (3) a literal mixin value like { properties }. Each of these properties
        // can have values that are: (a) literal, (b) variables, (c) @apply mixins.

      }, {
        key: 'valueForProperty',
        value: function valueForProperty(property, props) {
          // case (1) default
          // case (3) defines a mixin and we have to reify the internals
          if (property) {
            if (property.indexOf(';') >= 0) {
              property = this.valueForProperties(property, props);
            } else {
              // case (2) variable
              var self = this;
              var fn = function fn(prefix, value, fallback, suffix) {
                if (!value) {
                  return prefix + suffix;
                }
                var propertyValue = self.valueForProperty(props[value], props);
                // if value is "initial", then the variable should be treated as unset
                if (!propertyValue || propertyValue === 'initial') {
                  // fallback may be --a or var(--a) or literal
                  propertyValue = self.valueForProperty(props[fallback] || fallback, props) || fallback;
                } else if (propertyValue === 'apply-shim-inherit') {
                  // CSS build will replace `inherit` with `apply-shim-inherit`
                  // for use with native css variables.
                  // Since we have full control, we can use `inherit` directly.
                  propertyValue = 'inherit';
                }
                return prefix + (propertyValue || '') + suffix;
              };
              property = processVariableAndFallback(property, fn);
            }
          }
          return property && property.trim() || '';
        }

        // note: we do not yet support mixin within mixin

      }, {
        key: 'valueForProperties',
        value: function valueForProperties(property, props) {
          var parts = property.split(';');
          for (var i = 0, _p, m; i < parts.length; i++) {
            if (_p = parts[i]) {
              rx.MIXIN_MATCH.lastIndex = 0;
              m = rx.MIXIN_MATCH.exec(_p);
              if (m) {
                _p = this.valueForProperty(props[m[1]], props);
              } else {
                var colon = _p.indexOf(':');
                if (colon !== -1) {
                  var pp = _p.substring(colon);
                  pp = pp.trim();
                  pp = this.valueForProperty(pp, props) || pp;
                  _p = _p.substring(0, colon) + pp;
                }
              }
              parts[i] = _p && _p.lastIndexOf(';') === _p.length - 1 ?
              // strip trailing ;
              _p.slice(0, -1) : _p || '';
            }
          }
          return parts.join(';');
        }
      }, {
        key: 'applyProperties',
        value: function applyProperties(rule, props) {
          var output = '';
          // dynamically added sheets may not be decorated so ensure they are.
          if (!rule.propertyInfo) {
            this.decorateRule(rule);
          }
          if (rule.propertyInfo.cssText) {
            output = this.valueForProperties(rule.propertyInfo.cssText, props);
          }
          rule.cssText = output;
        }

        // Apply keyframe transformations to the cssText of a given rule. The
        // keyframeTransforms object is a map of keyframe names to transformer
        // functions which take in cssText and spit out transformed cssText.

      }, {
        key: 'applyKeyframeTransforms',
        value: function applyKeyframeTransforms(rule, keyframeTransforms) {
          var input = rule.cssText;
          var output = rule.cssText;
          if (rule.hasAnimations == null) {
            // Cache whether or not the rule has any animations to begin with:
            rule.hasAnimations = rx.ANIMATION_MATCH.test(input);
          }
          // If there are no animations referenced, we can skip transforms:
          if (rule.hasAnimations) {
            var transform = void 0;
            // If we haven't transformed this rule before, we iterate over all
            // transforms:
            if (rule.keyframeNamesToTransform == null) {
              rule.keyframeNamesToTransform = [];
              for (var keyframe in keyframeTransforms) {
                transform = keyframeTransforms[keyframe];
                output = transform(input);
                // If the transform actually changed the CSS text, we cache the
                // transform name for future use:
                if (input !== output) {
                  input = output;
                  rule.keyframeNamesToTransform.push(keyframe);
                }
              }
            } else {
              // If we already have a list of keyframe names that apply to this
              // rule, we apply only those keyframe name transforms:
              for (var i = 0; i < rule.keyframeNamesToTransform.length; ++i) {
                transform = keyframeTransforms[rule.keyframeNamesToTransform[i]];
                input = transform(input);
              }
              output = input;
            }
          }
          rule.cssText = output;
        }

        // Test if the rules in these styles matches the given `element` and if so,
        // collect any custom properties into `props`.

      }, {
        key: 'propertyDataFromStyles',
        value: function propertyDataFromStyles(rules, element) {
          var props = {},
              self = this;
          // generates a unique key for these matches
          var o = [];
          // note: active rules excludes non-matching @media rules
          forEachRule(rules, function (rule) {
            // TODO(sorvell): we could trim the set of rules at declaration
            // time to only include ones that have properties
            if (!rule.propertyInfo) {
              self.decorateRule(rule);
            }
            // match element against transformedSelector: selector may contain
            // unwanted uniquification and parsedSelector does not directly match
            // for :host selectors.
            var selectorToMatch = rule.transformedSelector || rule.parsedSelector;
            if (element && rule.propertyInfo.properties && selectorToMatch) {
              if (matchesSelector$1.call(element, selectorToMatch)) {
                self.collectProperties(rule, props);
                // produce numeric key for these matches for lookup
                addToBitMask(rule.index, o);
              }
            }
          }, null, true);
          return { properties: props, key: o };
        }
      }, {
        key: 'whenHostOrRootRule',
        value: function whenHostOrRootRule(scope, rule, cssBuild, callback) {
          if (!rule.propertyInfo) {
            this.decorateRule(rule);
          }
          if (!rule.propertyInfo.properties) {
            return;
          }
          var hostScope = scope.is ? StyleTransformer$1._calcHostScope(scope.is, scope.extends) : 'html';
          var parsedSelector = rule.parsedSelector;
          var isRoot = parsedSelector === ':host > *' || parsedSelector === 'html';
          var isHost = parsedSelector.indexOf(':host') === 0 && !isRoot;
          // build info is either in scope (when scope is an element) or in the style
          // when scope is the default scope; note: this allows default scope to have
          // mixed mode built and unbuilt styles.
          if (cssBuild === 'shady') {
            // :root -> x-foo > *.x-foo for elements and html for custom-style
            isRoot = parsedSelector === hostScope + ' > *.' + hostScope || parsedSelector.indexOf('html') !== -1;
            // :host -> x-foo for elements, but sub-rules have .x-foo in them
            isHost = !isRoot && parsedSelector.indexOf(hostScope) === 0;
          }
          if (cssBuild === 'shadow') {
            isRoot = parsedSelector === ':host > *' || parsedSelector === 'html';
            isHost = isHost && !isRoot;
          }
          if (!isRoot && !isHost) {
            return;
          }
          var selectorToMatch = hostScope;
          if (isHost) {
            // need to transform :host under ShadowDOM because `:host` does not work with `matches`
            if (nativeShadow && !rule.transformedSelector) {
              // transform :host into a matchable selector
              rule.transformedSelector = StyleTransformer$1._transformRuleCss(rule, StyleTransformer$1._transformComplexSelector, StyleTransformer$1._calcElementScope(scope.is), hostScope);
            }
            selectorToMatch = rule.transformedSelector || hostScope;
          }
          callback({
            selector: selectorToMatch,
            isHost: isHost,
            isRoot: isRoot
          });
        }
      }, {
        key: 'hostAndRootPropertiesForScope',
        value: function hostAndRootPropertiesForScope(scope, rules) {
          var hostProps = {},
              rootProps = {},
              self = this;
          // note: active rules excludes non-matching @media rules
          var cssBuild = rules && rules.__cssBuild;
          forEachRule(rules, function (rule) {
            // if scope is StyleDefaults, use _element for matchesSelector
            self.whenHostOrRootRule(scope, rule, cssBuild, function (info) {
              var element = scope._element || scope;
              if (matchesSelector$1.call(element, info.selector)) {
                if (info.isHost) {
                  self.collectProperties(rule, hostProps);
                } else {
                  self.collectProperties(rule, rootProps);
                }
              }
            });
          }, null, true);
          return { rootProps: rootProps, hostProps: hostProps };
        }
      }, {
        key: 'transformStyles',
        value: function transformStyles(element, properties, scopeSelector) {
          var self = this;
          var hostSelector = StyleTransformer$1._calcHostScope(element.is, element.extends);
          var rxHostSelector = element.extends ? '\\' + hostSelector.slice(0, -1) + '\\]' : hostSelector;
          var hostRx = new RegExp(rx.HOST_PREFIX + rxHostSelector + rx.HOST_SUFFIX);
          var rules = StyleInfo.get(element).styleRules;
          var keyframeTransforms = this._elementKeyframeTransforms(element, rules, scopeSelector);
          return StyleTransformer$1.elementStyles(element, rules, function (rule) {
            self.applyProperties(rule, properties);
            if (!nativeShadow && !isKeyframesSelector(rule) && rule.cssText) {
              // NOTE: keyframe transforms only scope munge animation names, so it
              // is not necessary to apply them in ShadowDOM.
              self.applyKeyframeTransforms(rule, keyframeTransforms);
              self._scopeSelector(rule, hostRx, hostSelector, scopeSelector);
            }
          });
        }
      }, {
        key: '_elementKeyframeTransforms',
        value: function _elementKeyframeTransforms(element, rules, scopeSelector) {
          var keyframesRules = rules._keyframes;
          var keyframeTransforms = {};
          if (!nativeShadow && keyframesRules) {
            // For non-ShadowDOM, we transform all known keyframes rules in
            // advance for the current scope. This allows us to catch keyframes
            // rules that appear anywhere in the stylesheet:
            for (var i = 0, keyframesRule = keyframesRules[i]; i < keyframesRules.length; keyframesRule = keyframesRules[++i]) {
              this._scopeKeyframes(keyframesRule, scopeSelector);
              keyframeTransforms[keyframesRule.keyframesName] = this._keyframesRuleTransformer(keyframesRule);
            }
          }
          return keyframeTransforms;
        }

        // Generate a factory for transforming a chunk of CSS text to handle a
        // particular scoped keyframes rule.

      }, {
        key: '_keyframesRuleTransformer',
        value: function _keyframesRuleTransformer(keyframesRule) {
          return function (cssText) {
            return cssText.replace(keyframesRule.keyframesNameRx, keyframesRule.transformedKeyframesName);
          };
        }

        // Transforms `@keyframes` names to be unique for the current host.
        // Example: @keyframes foo-anim -> @keyframes foo-anim-x-foo-0

      }, {
        key: '_scopeKeyframes',
        value: function _scopeKeyframes(rule, scopeId) {
          rule.keyframesNameRx = new RegExp(rule.keyframesName, 'g');
          rule.transformedKeyframesName = rule.keyframesName + '-' + scopeId;
          rule.transformedSelector = rule.transformedSelector || rule.selector;
          rule.selector = rule.transformedSelector.replace(rule.keyframesName, rule.transformedKeyframesName);
        }

        // Strategy: x scope shim a selector e.g. to scope `.x-foo-42` (via classes):
        // non-host selector: .a.x-foo -> .x-foo-42 .a.x-foo
        // host selector: x-foo.wide -> .x-foo-42.wide
        // note: we use only the scope class (.x-foo-42) and not the hostSelector
        // (x-foo) to scope :host rules; this helps make property host rules
        // have low specificity. They are overrideable by class selectors but,
        // unfortunately, not by type selectors (e.g. overriding via
        // `.special` is ok, but not by `x-foo`).

      }, {
        key: '_scopeSelector',
        value: function _scopeSelector(rule, hostRx, hostSelector, scopeId) {
          rule.transformedSelector = rule.transformedSelector || rule.selector;
          var selector = rule.transformedSelector;
          var scope = '.' + scopeId;
          var parts = selector.split(',');
          for (var i = 0, l = parts.length, _p2; i < l && (_p2 = parts[i]); i++) {
            parts[i] = _p2.match(hostRx) ? _p2.replace(hostSelector, scope) : scope + ' ' + _p2;
          }
          rule.selector = parts.join(',');
        }
      }, {
        key: 'applyElementScopeSelector',
        value: function applyElementScopeSelector(element, selector, old) {
          var c = element.getAttribute('class') || '';
          var v = c;
          if (old) {
            v = c.replace(new RegExp('\\s*' + XSCOPE_NAME + '\\s*' + old + '\\s*', 'g'), ' ');
          }
          v += (v ? ' ' : '') + XSCOPE_NAME + ' ' + selector;
          if (c !== v) {
            setElementClassRaw(element, v);
          }
        }
      }, {
        key: 'applyElementStyle',
        value: function applyElementStyle(element, properties, selector, style) {
          // calculate cssText to apply
          var cssText = style ? style.textContent || '' : this.transformStyles(element, properties, selector);
          // if shady and we have a cached style that is not style, decrement
          var styleInfo = StyleInfo.get(element);
          var s = styleInfo.customStyle;
          if (s && !nativeShadow && s !== style) {
            s._useCount--;
            if (s._useCount <= 0 && s.parentNode) {
              s.parentNode.removeChild(s);
            }
          }
          // apply styling always under native or if we generated style
          // or the cached style is not in document(!)
          if (nativeShadow) {
            // update existing style only under native
            if (styleInfo.customStyle) {
              styleInfo.customStyle.textContent = cssText;
              style = styleInfo.customStyle;
              // otherwise, if we have css to apply, do so
            } else if (cssText) {
              // apply css after the scope style of the element to help with
              // style precedence rules.
              style = applyCss(cssText, selector, element.shadowRoot, styleInfo.placeholder);
            }
          } else {
            // shady and no cache hit
            if (!style) {
              // apply css after the scope style of the element to help with
              // style precedence rules.
              if (cssText) {
                style = applyCss(cssText, selector, null, styleInfo.placeholder);
              }
              // shady and cache hit but not in document
            } else if (!style.parentNode) {
              applyStyle(style, null, styleInfo.placeholder);
            }
          }
          // ensure this style is our custom style and increment its use count.
          if (style) {
            style._useCount = style._useCount || 0;
            // increment use count if we changed styles
            if (styleInfo.customStyle != style) {
              style._useCount++;
            }
            styleInfo.customStyle = style;
          }
          // @media rules may be stale in IE 10 and 11
          if (IS_IE) {
            style.textContent = style.textContent;
          }
          return style;
        }
      }, {
        key: 'applyCustomStyle',
        value: function applyCustomStyle(style, properties) {
          var rules = rulesForStyle(style);
          var self = this;
          style.textContent = toCssText(rules, function (rule) {
            var css = rule.cssText = rule.parsedCssText;
            if (rule.propertyInfo && rule.propertyInfo.cssText) {
              // remove property assignments
              // so next function isn't confused
              // NOTE: we have 3 categories of css:
              // (1) normal properties,
              // (2) custom property assignments (--foo: red;),
              // (3) custom property usage: border: var(--foo); @apply(--foo);
              // In elements, 1 and 3 are separated for efficiency; here they
              // are not and this makes this case unique.
              css = removeCustomPropAssignment(css);
              // replace with reified properties, scenario is same as mixin
              rule.cssText = self.valueForProperties(css, properties);
            }
          });
        }
      }, {
        key: 'XSCOPE_NAME',
        get: function get() {
          return XSCOPE_NAME;
        }
      }]);
      return StyleProperties;
    }();

    function addToBitMask(n, bits) {
      var o = parseInt(n / 32);
      var v = 1 << n % 32;
      bits[o] = (bits[o] || 0) | v;
    }

    var StyleProperties$1 = new StyleProperties();

    var placeholderMap = {};

    var StyleCache = function () {
      function StyleCache() {
        var typeMax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
        classCallCheck(this, StyleCache);

        // map element name -> [{properties, styleElement, scopeSelector}]
        this.cache = {};
        this.typeMax = typeMax;
      }

      createClass(StyleCache, [{
        key: '_validate',
        value: function _validate(cacheEntry, properties, ownPropertyNames) {
          for (var idx = 0; idx < ownPropertyNames.length; idx++) {
            var pn = ownPropertyNames[idx];
            if (cacheEntry.properties[pn] !== properties[pn]) {
              return false;
            }
          }
          return true;
        }
      }, {
        key: 'store',
        value: function store(tagname, properties, styleElement, scopeSelector) {
          var list = this.cache[tagname] || [];
          list.push({ properties: properties, styleElement: styleElement, scopeSelector: scopeSelector });
          if (list.length > this.typeMax) {
            list.shift();
          }
          this.cache[tagname] = list;
        }
      }, {
        key: 'fetch',
        value: function fetch(tagname, properties, ownPropertyNames) {
          var list = this.cache[tagname];
          if (!list) {
            return;
          }
          // reverse list for most-recent lookups
          for (var idx = list.length - 1; idx >= 0; idx--) {
            var entry = list[idx];
            if (this._validate(entry, properties, ownPropertyNames)) {
              return entry;
            }
          }
        }
      }]);
      return StyleCache;
    }();

    var MIXIN_MATCH = rx.MIXIN_MATCH;
    var VAR_ASSIGN = rx.VAR_ASSIGN;

    var APPLY_NAME_CLEAN = /;\s*/m;
    var INITIAL_INHERIT = /^\s*(initial)|(inherit)\s*$/;

    // separator used between mixin-name and mixin-property-name when producing properties
    // NOTE: plain '-' may cause collisions in user styles
    var MIXIN_VAR_SEP = '_-_';

    // map of mixin to property names
    // --foo: {border: 2px} -> {properties: {(--foo, ['border'])}, dependants: {'element-name': proto}}

    var MixinMap = function () {
      function MixinMap() {
        classCallCheck(this, MixinMap);

        this._map = {};
      }

      createClass(MixinMap, [{
        key: 'set',
        value: function set(name, props) {
          name = name.trim();
          this._map[name] = {
            properties: props,
            dependants: {}
          };
        }
      }, {
        key: 'get',
        value: function get(name) {
          name = name.trim();
          return this._map[name];
        }
      }]);
      return MixinMap;
    }();

    var ApplyShim = function () {
      function ApplyShim() {
        var _this = this;

        classCallCheck(this, ApplyShim);

        this._currentTemplate = null;
        this._measureElement = null;
        this._map = new MixinMap();
        this._separator = MIXIN_VAR_SEP;
        this._boundProduceCssProperties = function (matchText, propertyName, valueProperty, valueMixin) {
          return _this._produceCssProperties(matchText, propertyName, valueProperty, valueMixin);
        };
      }
      // return true if `cssText` contains a mixin definition or consumption


      createClass(ApplyShim, [{
        key: 'detectMixin',
        value: function detectMixin(cssText) {
          var has = MIXIN_MATCH.test(cssText) || VAR_ASSIGN.test(cssText);
          // reset state of the regexes
          MIXIN_MATCH.lastIndex = 0;
          VAR_ASSIGN.lastIndex = 0;
          return has;
        }
      }, {
        key: 'transformStyle',
        value: function transformStyle(style, elementName) {
          var ast = rulesForStyle(style);
          this.transformRules(ast, elementName);
          return ast;
        }
      }, {
        key: 'transformRules',
        value: function transformRules(rules, elementName) {
          var _this2 = this;

          this._currentTemplate = templateMap[elementName];
          forEachRule(rules, function (r) {
            _this2.transformRule(r);
          });
          this._currentTemplate = null;
        }
      }, {
        key: 'transformRule',
        value: function transformRule(rule) {
          rule.cssText = this.transformCssText(rule.parsedCssText);
          // :root was only used for variable assignment in property shim,
          // but generates invalid selectors with real properties.
          // replace with `:host > *`, which serves the same effect
          if (rule.selector === ':root') {
            rule.selector = ':host > *';
          }
        }
      }, {
        key: 'transformCssText',
        value: function transformCssText(cssText) {
          // produce variables
          cssText = cssText.replace(VAR_ASSIGN, this._boundProduceCssProperties);
          // consume mixins
          return this._consumeCssProperties(cssText);
        }
      }, {
        key: '_getInitialValueForProperty',
        value: function _getInitialValueForProperty(property) {
          if (!this._measureElement) {
            this._measureElement = document.createElement('meta');
            this._measureElement.style.all = 'initial';
            document.head.appendChild(this._measureElement);
          }
          return window.getComputedStyle(this._measureElement).getPropertyValue(property);
        }
        // replace mixin consumption with variable consumption

      }, {
        key: '_consumeCssProperties',
        value: function _consumeCssProperties(text) {
          var m = void 0;
          // loop over text until all mixins with defintions have been applied
          while (m = MIXIN_MATCH.exec(text)) {
            var matchText = m[0];
            var mixinName = m[1];
            var idx = m.index;
            // collect properties before apply to be "defaults" if mixin might override them
            // match includes a "prefix", so find the start and end positions of @apply
            var applyPos = idx + matchText.indexOf('@apply');
            var afterApplyPos = idx + matchText.length;
            // find props defined before this @apply
            var textBeforeApply = text.slice(0, applyPos);
            var textAfterApply = text.slice(afterApplyPos);
            var defaults = this._cssTextToMap(textBeforeApply);
            var replacement = this._atApplyToCssProperties(mixinName, defaults);
            // use regex match position to replace mixin, keep linear processing time
            text = [textBeforeApply, replacement, textAfterApply].join('');
            // move regex search to _after_ replacement
            MIXIN_MATCH.lastIndex = idx + replacement.length;
          }
          return text;
        }
        // produce variable consumption at the site of mixin consumption
        // @apply --foo; -> for all props (${propname}: var(--foo_-_${propname}, ${fallback[propname]}}))
        // Example:
        // border: var(--foo_-_border); padding: var(--foo_-_padding, 2px)

      }, {
        key: '_atApplyToCssProperties',
        value: function _atApplyToCssProperties(mixinName, fallbacks) {
          mixinName = mixinName.replace(APPLY_NAME_CLEAN, '');
          var vars = [];
          var mixinEntry = this._map.get(mixinName);
          // if we depend on a mixin before it is created
          // make a sentinel entry in the map to add this element as a dependency for when it is defined.
          if (!mixinEntry) {
            this._map.set(mixinName, {});
            mixinEntry = this._map.get(mixinName);
          }
          if (mixinEntry) {
            if (this._currentTemplate) {
              mixinEntry.dependants[this._currentTemplate.name] = this._currentTemplate;
            }
            var p = void 0,
                parts = void 0,
                f = void 0;
            for (p in mixinEntry.properties) {
              f = fallbacks && fallbacks[p];
              parts = [p, ': var(', mixinName, MIXIN_VAR_SEP, p];
              if (f) {
                parts.push(',', f);
              }
              parts.push(')');
              vars.push(parts.join(''));
            }
          }
          return vars.join('; ');
        }
      }, {
        key: '_replaceInitialOrInherit',
        value: function _replaceInitialOrInherit(property, value) {
          var match = INITIAL_INHERIT.exec(value);
          if (match) {
            if (match[1]) {
              // initial
              // replace `initial` with the concrete initial value for this property
              value = ApplyShim._getInitialValueForProperty(property);
            } else {
              // inherit
              // with this purposfully illegal value, the variable will be invalid at
              // compute time (https://www.w3.org/TR/css-variables/#invalid-at-computed-value-time)
              // and for inheriting values, will behave similarly
              // we cannot support the same behavior for non inheriting values like 'border'
              value = 'apply-shim-inherit';
            }
          }
          return value;
        }

        // "parse" a mixin definition into a map of properties and values
        // cssTextToMap('border: 2px solid black') -> ('border', '2px solid black')

      }, {
        key: '_cssTextToMap',
        value: function _cssTextToMap(text) {
          var props = text.split(';');
          var property = void 0,
              value = void 0;
          var out = {};
          for (var i = 0, p, sp; i < props.length; i++) {
            p = props[i];
            if (p) {
              sp = p.split(':');
              // ignore lines that aren't definitions like @media
              if (sp.length > 1) {
                property = sp[0].trim();
                // some properties may have ':' in the value, like data urls
                value = this._replaceInitialOrInherit(property, sp.slice(1).join(':'));
                out[property] = value;
              }
            }
          }
          return out;
        }
      }, {
        key: '_invalidateMixinEntry',
        value: function _invalidateMixinEntry(mixinEntry) {
          for (var elementName in mixinEntry.dependants) {
            if (!this._currentTemplate || elementName !== this._currentTemplate.name) {
              StyleInfo.invalidate(elementName);
            }
          }
        }
      }, {
        key: '_produceCssProperties',
        value: function _produceCssProperties(matchText, propertyName, valueProperty, valueMixin) {
          var _this3 = this;

          // handle case where property value is a mixin
          if (valueProperty) {
            // form: --mixin2: var(--mixin1), where --mixin1 is in the map
            processVariableAndFallback(valueProperty, function (prefix, value) {
              if (value && _this3._map.get(value)) {
                valueMixin = '@apply ' + value + ';';
              }
            });
          }
          if (!valueMixin) {
            return matchText;
          }
          var mixinAsProperties = this._consumeCssProperties(valueMixin);
          var prefix = matchText.slice(0, matchText.indexOf('--'));
          var mixinValues = this._cssTextToMap(mixinAsProperties);
          var combinedProps = mixinValues;
          var mixinEntry = this._map.get(propertyName);
          var oldProps = mixinEntry && mixinEntry.properties;
          if (oldProps) {
            // NOTE: since we use mixin, the map of properties is updated here
            // and this is what we want.
            combinedProps = Object.assign(Object.create(oldProps), mixinValues);
          } else {
            this._map.set(propertyName, combinedProps);
          }
          var out = [];
          var p = void 0,
              v = void 0;
          // set variables defined by current mixin
          var needToInvalidate = false;
          for (p in combinedProps) {
            v = mixinValues[p];
            // if property not defined by current mixin, set initial
            if (v === undefined) {
              v = 'initial';
            }
            if (oldProps && !(p in oldProps)) {
              needToInvalidate = true;
            }
            out.push(propertyName + MIXIN_VAR_SEP + p + ': ' + v);
          }
          if (needToInvalidate) {
            this._invalidateMixinEntry(mixinEntry);
          }
          if (mixinEntry) {
            mixinEntry.properties = combinedProps;
          }
          // because the mixinMap is global, the mixin might conflict with
          // a different scope's simple variable definition:
          // Example:
          // some style somewhere:
          // --mixin1:{ ... }
          // --mixin2: var(--mixin1);
          // some other element:
          // --mixin1: 10px solid red;
          // --foo: var(--mixin1);
          // In this case, we leave the original variable definition in place.
          if (valueProperty) {
            prefix = matchText + ';' + prefix;
          }
          return prefix + out.join('; ') + ';';
        }
      }]);
      return ApplyShim;
    }();

    var applyShim = new ApplyShim();
    window['ApplyShim'] = applyShim;

    var flush$1 = function flush() {};

    if (!nativeShadow) {
      var elementNeedsScoping = function elementNeedsScoping(element) {
        return element.classList && !element.classList.contains(StyleTransformer$1.SCOPE_NAME) ||
        // note: necessary for IE11
        element instanceof SVGElement && (!element.hasAttribute('class') || element.getAttribute('class').indexOf(StyleTransformer$1.SCOPE_NAME) < 0);
      };

      var handler = function handler(mxns) {
        for (var x = 0; x < mxns.length; x++) {
          var mxn = mxns[x];
          if (mxn.target === document.documentElement || mxn.target === document.head) {
            continue;
          }
          for (var i = 0; i < mxn.addedNodes.length; i++) {
            var n = mxn.addedNodes[i];
            if (elementNeedsScoping(n)) {
              var root = n.getRootNode();
              if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // may no longer be in a shadowroot
                var host = root.host;
                if (host) {
                  var scope = host.is || host.localName;
                  StyleTransformer$1.dom(n, scope);
                }
              }
            }
          }
          for (var _i = 0; _i < mxn.removedNodes.length; _i++) {
            var _n = mxn.removedNodes[_i];
            if (_n.nodeType === Node.ELEMENT_NODE) {
              var classes = undefined;
              if (_n.classList) {
                classes = Array.from(_n.classList);
              } else if (_n.hasAttribute('class')) {
                classes = _n.getAttribute('class').split(/\s+/);
              }
              if (classes !== undefined) {
                // NOTE: relies on the scoping class always being adjacent to the
                // SCOPE_NAME class.
                var classIdx = classes.indexOf(StyleTransformer$1.SCOPE_NAME);
                if (classIdx >= 0) {
                  var _scope = classes[classIdx + 1];
                  if (_scope) {
                    StyleTransformer$1.dom(_n, _scope, true);
                  }
                }
              }
            }
          }
        }
      };

      var observer = new MutationObserver(handler);
      var start = function start(node) {
        observer.observe(node, { childList: true, subtree: true });
      };
      var nativeCustomElements = window.customElements && !window.customElements.flush;
      // need to start immediately with native custom elements
      // TODO(dfreedm): with polyfilled HTMLImports and native custom elements
      // excessive mutations may be observed; this can be optimized via cooperation
      // with the HTMLImports polyfill.
      if (nativeCustomElements) {
        start(document);
      } else {
        var delayedStart = function delayedStart() {
          start(document.body);
        };
        // use polyfill timing if it's available
        if (window.HTMLImports) {
          window.HTMLImports.whenReady(delayedStart);
          // otherwise push beyond native imports being ready
          // which requires RAF + readystate interactive.
        } else {
          requestAnimationFrame(function () {
            if (document.readyState === 'loading') {
              var listener = function listener() {
                delayedStart();
                document.removeEventListener('readystatechange', listener);
              };
              document.addEventListener('readystatechange', listener);
            } else {
              delayedStart();
            }
          });
        }
      }

      flush$1 = function flush() {
        handler(observer.takeRecords());
      };
    }

    var styleCache = new StyleCache();

    var ShadyCSS = function () {
      function ShadyCSS() {
        classCallCheck(this, ShadyCSS);

        this._scopeCounter = {};
        this._documentOwner = document.documentElement;
        this._documentOwnerStyleInfo = StyleInfo.set(document.documentElement, new StyleInfo({ rules: [] }));
        this._elementsHaveApplied = false;
      }

      createClass(ShadyCSS, [{
        key: 'flush',
        value: function flush() {
          flush$1();
        }
      }, {
        key: '_generateScopeSelector',
        value: function _generateScopeSelector(name) {
          var id = this._scopeCounter[name] = (this._scopeCounter[name] || 0) + 1;
          return name + '-' + id;
        }
      }, {
        key: 'getStyleAst',
        value: function getStyleAst(style) {
          return rulesForStyle(style);
        }
      }, {
        key: 'styleAstToString',
        value: function styleAstToString(ast) {
          return toCssText(ast);
        }
      }, {
        key: '_gatherStyles',
        value: function _gatherStyles(template) {
          var styles = template.content.querySelectorAll('style');
          var cssText = [];
          for (var i = 0; i < styles.length; i++) {
            var s = styles[i];
            cssText.push(s.textContent);
            s.parentNode.removeChild(s);
          }
          return cssText.join('').trim();
        }
      }, {
        key: '_getCssBuild',
        value: function _getCssBuild(template) {
          var style = template.content.querySelector('style');
          if (!style) {
            return '';
          }
          return style.getAttribute('css-build') || '';
        }
      }, {
        key: 'prepareTemplate',
        value: function prepareTemplate(template, elementName, typeExtension) {
          if (template._prepared) {
            return;
          }
          template._prepared = true;
          template.name = elementName;
          template.extends = typeExtension;
          templateMap[elementName] = template;
          var cssBuild = this._getCssBuild(template);
          var cssText = this._gatherStyles(template);
          var info = {
            is: elementName,
            extends: typeExtension,
            __cssBuild: cssBuild
          };
          if (!this.nativeShadow) {
            StyleTransformer$1.dom(template.content, elementName);
          }
          // check if the styling has mixin definitions or uses
          var hasMixins = applyShim.detectMixin(cssText);
          var ast = parse(cssText);
          // only run the applyshim transforms if there is a mixin involved
          if (hasMixins && this.nativeCss && !this.nativeCssApply) {
            applyShim.transformRules(ast, elementName);
          }
          template._styleAst = ast;

          var ownPropertyNames = [];
          if (!this.nativeCss) {
            ownPropertyNames = StyleProperties$1.decorateStyles(template._styleAst, info);
          }
          if (!ownPropertyNames.length || this.nativeCss) {
            var root = this.nativeShadow ? template.content : null;
            var placeholder = placeholderMap[elementName];
            var style = this._generateStaticStyle(info, template._styleAst, root, placeholder);
            template._style = style;
          }
          template._ownPropertyNames = ownPropertyNames;
        }
      }, {
        key: '_generateStaticStyle',
        value: function _generateStaticStyle(info, rules, shadowroot, placeholder) {
          var cssText = StyleTransformer$1.elementStyles(info, rules);
          if (cssText.length) {
            return applyCss(cssText, info.is, shadowroot, placeholder);
          }
        }
      }, {
        key: '_prepareHost',
        value: function _prepareHost(host) {
          var is = host.getAttribute('is') || host.localName;
          var typeExtension = void 0;
          if (is !== host.localName) {
            typeExtension = host.localName;
          }
          var placeholder = placeholderMap[is];
          var template = templateMap[is];
          var ast = void 0;
          var ownStylePropertyNames = void 0;
          var cssBuild = void 0;
          if (template) {
            ast = template._styleAst;
            ownStylePropertyNames = template._ownPropertyNames;
            cssBuild = template._cssBuild;
          }
          return StyleInfo.set(host, new StyleInfo(ast, placeholder, ownStylePropertyNames, is, typeExtension, cssBuild));
        }
      }, {
        key: 'applyStyle',
        value: function applyStyle(host, overrideProps) {
          var is = host.getAttribute('is') || host.localName;
          var styleInfo = StyleInfo.get(host);
          var hasApplied = Boolean(styleInfo);
          if (!styleInfo) {
            styleInfo = this._prepareHost(host);
          }
          // Only trip the `elementsHaveApplied` flag if a node other that the root document has `applyStyle` called
          if (!this._isRootOwner(host)) {
            this._elementsHaveApplied = true;
          }
          if (window.CustomStyle) {
            var CS = window.CustomStyle;
            if (CS._documentDirty) {
              CS.findStyles();
              if (!this.nativeCss) {
                this._updateProperties(this._documentOwner, this._documentOwnerStyleInfo);
              } else if (!this.nativeCssApply) {
                CS._revalidateApplyShim();
              }
              CS.applyStyles();
              // if no elements have booted yet, we can just update the document and be done
              if (!this._elementsHaveApplied) {
                return;
              }
              // if no native css custom properties, we must recalculate the whole tree
              if (!this.nativeCss) {
                this.updateStyles();
                /*
                When updateStyles() runs, this element may not have a shadowroot yet.
                If not, we need to make sure that this element runs `applyStyle` on itself at least once to generate a style
                */
                if (hasApplied) {
                  return;
                }
              }
            }
          }
          if (overrideProps) {
            styleInfo.overrideStyleProperties = styleInfo.overrideStyleProperties || {};
            Object.assign(styleInfo.overrideStyleProperties, overrideProps);
          }
          if (this.nativeCss) {
            if (styleInfo.overrideStyleProperties) {
              this._updateNativeProperties(host, styleInfo.overrideStyleProperties);
            }
            var template = templateMap[is];
            // bail early if there is no shadowroot for this element
            if (!template && !this._isRootOwner(host)) {
              return;
            }
            if (template && template._applyShimInvalid && template._style) {
              // update template
              if (!template._validating) {
                applyShim.transformRules(template._styleAst, is);
                template._style.textContent = StyleTransformer$1.elementStyles(host, styleInfo.styleRules);
                StyleInfo.startValidating(is);
              }
              // update instance if native shadowdom
              if (this.nativeShadow) {
                var root = host.shadowRoot;
                if (root) {
                  var style = root.querySelector('style');
                  style.textContent = StyleTransformer$1.elementStyles(host, styleInfo.styleRules);
                }
              }
              styleInfo.styleRules = template._styleAst;
            }
          } else {
            this._updateProperties(host, styleInfo);
            if (styleInfo.ownStylePropertyNames && styleInfo.ownStylePropertyNames.length) {
              this._applyStyleProperties(host, styleInfo);
            }
          }
          if (hasApplied) {
            var _root = this._isRootOwner(host) ? host : host.shadowRoot;
            // note: some elements may not have a root!
            if (_root) {
              this._applyToDescendants(_root);
            }
          }
        }
      }, {
        key: '_applyToDescendants',
        value: function _applyToDescendants(root) {
          var c$ = root.children;
          for (var i = 0, c; i < c$.length; i++) {
            c = c$[i];
            if (c.shadowRoot) {
              this.applyStyle(c);
            }
            this._applyToDescendants(c);
          }
        }
      }, {
        key: '_styleOwnerForNode',
        value: function _styleOwnerForNode(node) {
          var root = node.getRootNode();
          var host = root.host;
          if (host) {
            if (StyleInfo.get(host)) {
              return host;
            } else {
              return this._styleOwnerForNode(host);
            }
          }
          return this._documentOwner;
        }
      }, {
        key: '_isRootOwner',
        value: function _isRootOwner(node) {
          return node === this._documentOwner;
        }
      }, {
        key: '_applyStyleProperties',
        value: function _applyStyleProperties(host, styleInfo) {
          var is = host.getAttribute('is') || host.localName;
          var cacheEntry = styleCache.fetch(is, styleInfo.styleProperties, styleInfo.ownStylePropertyNames);
          var cachedScopeSelector = cacheEntry && cacheEntry.scopeSelector;
          var cachedStyle = cacheEntry ? cacheEntry.styleElement : null;
          var oldScopeSelector = styleInfo.scopeSelector;
          // only generate new scope if cached style is not found
          styleInfo.scopeSelector = cachedScopeSelector || this._generateScopeSelector(is);
          var style = StyleProperties$1.applyElementStyle(host, styleInfo.styleProperties, styleInfo.scopeSelector, cachedStyle);
          if (!this.nativeShadow) {
            StyleProperties$1.applyElementScopeSelector(host, styleInfo.scopeSelector, oldScopeSelector);
          }
          if (!cacheEntry) {
            styleCache.store(is, styleInfo.styleProperties, style, styleInfo.scopeSelector);
          }
          return style;
        }
      }, {
        key: '_updateProperties',
        value: function _updateProperties(host, styleInfo) {
          var owner = this._styleOwnerForNode(host);
          var ownerStyleInfo = StyleInfo.get(owner);
          var ownerProperties = ownerStyleInfo.styleProperties;
          var props = Object.create(ownerProperties || null);
          var hostAndRootProps = StyleProperties$1.hostAndRootPropertiesForScope(host, styleInfo.styleRules);
          var propertyData = StyleProperties$1.propertyDataFromStyles(ownerStyleInfo.styleRules, host);
          var propertiesMatchingHost = propertyData.properties;
          Object.assign(props, hostAndRootProps.hostProps, propertiesMatchingHost, hostAndRootProps.rootProps);
          this._mixinOverrideStyles(props, styleInfo.overrideStyleProperties);
          StyleProperties$1.reify(props);
          styleInfo.styleProperties = props;
        }
      }, {
        key: '_mixinOverrideStyles',
        value: function _mixinOverrideStyles(props, overrides) {
          for (var p in overrides) {
            var v = overrides[p];
            // skip override props if they are not truthy or 0
            // in order to fall back to inherited values
            if (v || v === 0) {
              props[p] = v;
            }
          }
        }
      }, {
        key: '_updateNativeProperties',
        value: function _updateNativeProperties(element, properties) {
          // remove previous properties
          for (var p in properties) {
            // NOTE: for bc with shim, don't apply null values.
            if (p === null) {
              element.style.removeProperty(p);
            } else {
              element.style.setProperty(p, properties[p]);
            }
          }
        }
      }, {
        key: 'updateStyles',
        value: function updateStyles(properties) {
          this.applyStyle(this._documentOwner, properties);
        }
        /* Custom Style operations */

      }, {
        key: '_transformCustomStyleForDocument',
        value: function _transformCustomStyleForDocument(style) {
          var _this = this;

          var ast = rulesForStyle(style);
          forEachRule(ast, function (rule) {
            if (nativeShadow) {
              StyleTransformer$1.normalizeRootSelector(rule);
            } else {
              StyleTransformer$1.documentRule(rule);
            }
            if (_this.nativeCss && !_this.nativeCssApply) {
              applyShim.transformRule(rule);
            }
          });
          if (this.nativeCss) {
            style.textContent = toCssText(ast);
          } else {
            this._documentOwnerStyleInfo.styleRules.rules.push(ast);
          }
        }
      }, {
        key: '_revalidateApplyShim',
        value: function _revalidateApplyShim(style) {
          if (this.nativeCss && !this.nativeCssApply) {
            var ast = rulesForStyle(style);
            applyShim.transformRules(ast);
            style.textContent = toCssText(ast);
          }
        }
      }, {
        key: '_applyCustomStyleToDocument',
        value: function _applyCustomStyleToDocument(style) {
          if (!this.nativeCss) {
            StyleProperties$1.applyCustomStyle(style, this._documentOwnerStyleInfo.styleProperties);
          }
        }
      }, {
        key: 'getComputedStyleValue',
        value: function getComputedStyleValue(element, property) {
          var value = void 0;
          if (!this.nativeCss) {
            // element is either a style host, or an ancestor of a style host
            var styleInfo = StyleInfo.get(element) || StyleInfo.get(this._styleOwnerForNode(element));
            value = styleInfo.styleProperties[property];
          }
          // fall back to the property value from the computed styling
          value = value || window.getComputedStyle(element).getPropertyValue(property);
          // trim whitespace that can come after the `:` in css
          // example: padding: 2px -> " 2px"
          return value.trim();
        }
        // given an element and a classString, replaces
        // the element's class with the provided classString and adds
        // any necessary ShadyCSS static and property based scoping selectors

      }, {
        key: 'setElementClass',
        value: function setElementClass(element, classString) {
          var root = element.getRootNode();
          var classes = classString ? classString.split(/\s/) : [];
          var scopeName = root.host && root.host.localName;
          // If no scope, try to discover scope name from existing class.
          // This can occur if, for example, a template stamped element that
          // has been scoped is manipulated when not in a root.
          if (!scopeName) {
            var classAttr = element.getAttribute('class');
            if (classAttr) {
              var k$ = classAttr.split(/\s/);
              for (var i = 0; i < k$.length; i++) {
                if (k$[i] === StyleTransformer$1.SCOPE_NAME) {
                  scopeName = k$[i + 1];
                  break;
                }
              }
            }
          }
          if (scopeName) {
            classes.push(StyleTransformer$1.SCOPE_NAME, scopeName);
          }
          if (!this.nativeCss) {
            var styleInfo = StyleInfo.get(element);
            if (styleInfo && styleInfo.scopeSelector) {
              classes.push(StyleProperties$1.XSCOPE_NAME, styleInfo.scopeSelector);
            }
          }
          setElementClassRaw(element, classes.join(' '));
        }
      }, {
        key: '_styleInfoForNode',
        value: function _styleInfoForNode(node) {
          return StyleInfo.get(node);
        }
      }, {
        key: 'nativeShadow',
        get: function get() {
          return nativeShadow;
        }
      }, {
        key: 'nativeCss',
        get: function get() {
          return nativeCssVariables;
        }
      }, {
        key: 'nativeCssApply',
        get: function get() {
          return nativeCssApply;
        }
      }]);
      return ShadyCSS;
    }();

    window['ShadyCSS'] = new ShadyCSS();

    var ShadyCSS$1 = window.ShadyCSS;

    var enqueued = false;

    var customStyles = [];

    var hookFn = null;

    /*
    If a page only has <custom-style> elements, it will flash unstyled content,
    as all the instances will boot asynchronously after page load.

    Calling ShadyCSS.updateStyles() will force the work to happen synchronously
    */
    function enqueueDocumentValidation() {
      if (enqueued) {
        return;
      }
      enqueued = true;
      if (window.HTMLImports) {
        window.HTMLImports.whenReady(validateDocument);
      } else if (document.readyState === 'complete') {
        validateDocument();
      } else {
        document.addEventListener('readystatechange', function () {
          if (document.readyState === 'complete') {
            validateDocument();
          }
        });
      }
    }

    function validateDocument() {
      requestAnimationFrame(function () {
        if (enqueued || ShadyCSS$1._elementsHaveApplied) {
          ShadyCSS$1.updateStyles();
        }
        enqueued = false;
      });
    }

    var CustomStyle = function (_HTMLElement) {
      inherits(CustomStyle, _HTMLElement);
      createClass(CustomStyle, null, [{
        key: 'findStyles',
        value: function findStyles() {
          for (var i = 0; i < customStyles.length; i++) {
            var c = customStyles[i];
            if (!c._style) {
              var style = c.querySelector('style');
              if (!style) {
                continue;
              }
              // HTMLImports polyfill may have cloned the style into the main document,
              // which is referenced with __appliedElement.
              // Also, we must copy over the attributes.
              if (style.__appliedElement) {
                for (var _i = 0; _i < style.attributes.length; _i++) {
                  var attr = style.attributes[_i];
                  style.__appliedElement.setAttribute(attr.name, attr.value);
                }
              }
              c._style = style.__appliedElement || style;
              if (hookFn) {
                hookFn(c._style);
              }
              ShadyCSS$1._transformCustomStyleForDocument(c._style);
            }
          }
        }
      }, {
        key: '_revalidateApplyShim',
        value: function _revalidateApplyShim() {
          for (var i = 0; i < customStyles.length; i++) {
            var c = customStyles[i];
            if (c._style) {
              ShadyCSS$1._revalidateApplyShim(c._style);
            }
          }
        }
      }, {
        key: 'applyStyles',
        value: function applyStyles() {
          for (var i = 0; i < customStyles.length; i++) {
            var c = customStyles[i];
            if (c._style) {
              ShadyCSS$1._applyCustomStyleToDocument(c._style);
            }
          }
          enqueued = false;
        }
      }, {
        key: '_customStyles',
        get: function get() {
          return customStyles;
        }
      }, {
        key: 'processHook',
        get: function get() {
          return hookFn;
        },
        set: function set(fn) {
          hookFn = fn;
        }
      }, {
        key: '_documentDirty',
        get: function get() {
          return enqueued;
        }
      }]);

      function CustomStyle() {
        classCallCheck(this, CustomStyle);

        var _this = possibleConstructorReturn(this, (CustomStyle.__proto__ || Object.getPrototypeOf(CustomStyle)).call(this));

        customStyles.push(_this);
        enqueueDocumentValidation();
        return _this;
      }

      return CustomStyle;
    }(HTMLElement);

    window['CustomStyle'] = CustomStyle;
    window.customElements.define('custom-style', CustomStyle);

    var index = createCommonjsModule(function (module) {
      // NOTE!!!
      //
      // We have to load polyfills directly from source as non-minified files are not
      // published by the polyfills. An issue was raised to discuss this problem and
      // to see if it can be resolved.
      //
      // See https://github.com/webcomponents/custom-elements/issues/45

      // ES2015 polyfills required for the polyfills to work in older browsers.
      interopDefault(require$$7).shim();
      interopDefault(require$$6).shim();
      interopDefault(require$$5$1).polyfill();

      // We have to include this first so that it can patch native. This must be done
      // before any polyfills are loaded.


      // Template polyfill is necessary to use shadycss in IE11
      // this comes before custom elements because of
      // https://github.com/webcomponents/template/blob/master/template.js#L39


      // This comes after the native shim because it requries it to be patched first.


      // Force the polyfill in Safari 10.0.0 and 10.0.1.
      var _window = window,
          navigator = _window.navigator;
      var userAgent = navigator.userAgent;

      var safari = userAgent.indexOf('Safari/60') !== -1;
      var safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
      var safariVersions = [0, 1].map(function (v) {
        return '10.0.' + v;
      }).concat(['10.0']);

      if (safari && safariVersions.indexOf(safariVersion) > -1) {
        window.ShadyDOM = { force: true };
      }

      // ShadyDOM comes first. Both because it may need to be forced and the
      // ShadyCSS polyfill requires it to function.
    });

    interopDefault(index);

    var isFunction = function isFunction(val) {
      return typeof val === 'function';
    };
    var isObject = function isObject(val) {
      return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null;
    };
    var isString = function isString(val) {
      return typeof val === 'string';
    };
    var isSymbol = function isSymbol(val) {
      return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'symbol';
    };
    var isUndefined = function isUndefined(val) {
      return typeof val === 'undefined';
    };

    /**
     * Returns array of owned property names and symbols for the given object
     */
    function getPropNamesAndSymbols() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var listOfKeys = Object.getOwnPropertyNames(obj);
      return isFunction(Object.getOwnPropertySymbols) ? listOfKeys.concat(Object.getOwnPropertySymbols(obj)) : listOfKeys;
    }

    // We are not using Object.assign if it is defined since it will cause problems when Symbol is polyfilled.
    // Apparently Object.assign (or any polyfill for this method) does not copy non-native Symbols.
    var assign$2 = (function (obj) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      args.forEach(function (arg) {
        return getPropNamesAndSymbols(arg).forEach(function (nameOrSymbol) {
          return obj[nameOrSymbol] = arg[nameOrSymbol];
        });
      }); // eslint-disable-line no-return-assign
      return obj;
    });

    function empty (val) {
      return typeof val === 'undefined' || val === null;
    }

    /**
     * Attributes value can only be null or string;
     */
    var toNullOrString = function toNullOrString(val) {
      return empty(val) ? null : String(val);
    };

    function create(def) {
      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args.unshift({}, def);
        return assign$2.apply(undefined, args);
      };
    }

    var parseIfNotEmpty = function parseIfNotEmpty(val) {
      return empty(val) ? null : JSON.parse(val);
    };

    var array = create({
      coerce: function coerce(val) {
        return Array.isArray(val) ? val : empty(val) ? null : [val];
      },
      default: function _default() {
        return [];
      },
      deserialize: parseIfNotEmpty,
      serialize: JSON.stringify
    });

    var boolean = create({
      coerce: function coerce(val) {
        return !!val;
      },
      default: false,
      // TODO: 'false' string must deserialize to false for angular 1.x to work
      // This breaks one existing test.
      // deserialize: val => !(val === null || val === 'false'),
      deserialize: function deserialize(val) {
        return !(val === null);
      },
      serialize: function serialize(val) {
        return val ? '' : null;
      }
    });

    // defaults empty to 0 and allows NaN
    var zeroIfEmptyOrNumberIncludesNaN = function zeroIfEmptyOrNumberIncludesNaN(val) {
      return empty(val) ? 0 : Number(val);
    };

    var number = create({
      default: 0,
      coerce: zeroIfEmptyOrNumberIncludesNaN,
      deserialize: zeroIfEmptyOrNumberIncludesNaN,
      serialize: toNullOrString
    });

    var $connected = '____skate_connected';
    var $created = '____skate_created';

    // DEPRECATED
    //
    // This is the only "symbol" that must stay a string. This is because it is
    // relied upon across several versions. We should remove it, but ensure that
    // it's considered a breaking change that whatever version removes it cannot
    // be passed to vdom functions as tag names.
    var $name = '____skate_name';

    // Used on the Constructor
    var $ctorCreateInitProps = '____skate_ctor_createInitProps';
    var $ctorObservedAttributes = '____skate_ctor_observedAttributes';
    var $ctorProps = '____skate_ctor_props';
    var $ctorPropsMap = '____skate_ctor_propsMap';

    // Used on the Element
    var $props = '____skate_props';
    var $ref = '____skate_ref';
    var $renderer = '____skate_renderer';
    var $rendering = '____skate_rendering';
    var $rendererDebounced = '____skate_rendererDebounced';
    var $updated = '____skate_updated';

    var incrementalDomCjs = createCommonjsModule(function (module, exports) {
      /**
       * @license
       * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *      http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS-IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

      'use strict';

      /**
       * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *      http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS-IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

      /**
       * A cached reference to the hasOwnProperty function.
       */

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      /**
       * A cached reference to the create function.
       */
      var create = Object.create;

      /**
       * Used to prevent property collisions between our "map" and its prototype.
       * @param {!Object<string, *>} map The map to check.
       * @param {string} property The property to check.
       * @return {boolean} Whether map has property.
       */
      var has = function has(map, property) {
        return hasOwnProperty.call(map, property);
      };

      /**
       * Creates an map object without a prototype.
       * @return {!Object}
       */
      var createMap = function createMap() {
        return create(null);
      };

      /**
       * Keeps track of information needed to perform diffs for a given DOM node.
       * @param {!string} nodeName
       * @param {?string=} key
       * @constructor
       */
      function NodeData(nodeName, key) {
        /**
         * The attributes and their values.
         * @const {!Object<string, *>}
         */
        this.attrs = createMap();

        /**
         * An array of attribute name/value pairs, used for quickly diffing the
         * incomming attributes to see if the DOM node's attributes need to be
         * updated.
         * @const {Array<*>}
         */
        this.attrsArr = [];

        /**
         * The incoming attributes for this Node, before they are updated.
         * @const {!Object<string, *>}
         */
        this.newAttrs = createMap();

        /**
         * The key used to identify this node, used to preserve DOM nodes when they
         * move within their parent.
         * @const
         */
        this.key = key;

        /**
         * Keeps track of children within this node by their key.
         * {?Object<string, !Element>}
         */
        this.keyMap = null;

        /**
         * Whether or not the keyMap is currently valid.
         * {boolean}
         */
        this.keyMapValid = true;

        /**
         * The node name for this node.
         * @const {string}
         */
        this.nodeName = nodeName;

        /**
         * @type {?string}
         */
        this.text = null;
      }

      /**
       * Initializes a NodeData object for a Node.
       *
       * @param {Node} node The node to initialize data for.
       * @param {string} nodeName The node name of node.
       * @param {?string=} key The key that identifies the node.
       * @return {!NodeData} The newly initialized data object
       */
      var initData = function initData(node, nodeName, key) {
        var data = new NodeData(nodeName, key);
        node['__incrementalDOMData'] = data;
        return data;
      };

      /**
       * Retrieves the NodeData object for a Node, creating it if necessary.
       *
       * @param {Node} node The node to retrieve the data for.
       * @return {!NodeData} The NodeData for this Node.
       */
      var getData = function getData(node) {
        var data = node['__incrementalDOMData'];

        if (!data) {
          var nodeName = node.nodeName.toLowerCase();
          var key = null;

          if (node instanceof Element) {
            key = node.getAttribute('key');
          }

          data = initData(node, nodeName, key);
        }

        return data;
      };

      /**
       * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *      http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS-IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

      /** @const */
      var symbols = {
        default: '__default',

        placeholder: '__placeholder'
      };

      /**
       * @param {string} name
       * @return {string|undefined} The namespace to use for the attribute.
       */
      var getNamespace = function getNamespace(name) {
        if (name.lastIndexOf('xml:', 0) === 0) {
          return 'http://www.w3.org/XML/1998/namespace';
        }

        if (name.lastIndexOf('xlink:', 0) === 0) {
          return 'http://www.w3.org/1999/xlink';
        }
      };

      /**
       * Applies an attribute or property to a given Element. If the value is null
       * or undefined, it is removed from the Element. Otherwise, the value is set
       * as an attribute.
       * @param {!Element} el
       * @param {string} name The attribute's name.
       * @param {?(boolean|number|string)=} value The attribute's value.
       */
      var applyAttr = function applyAttr(el, name, value) {
        if (value == null) {
          el.removeAttribute(name);
        } else {
          var attrNS = getNamespace(name);
          if (attrNS) {
            el.setAttributeNS(attrNS, name, value);
          } else {
            el.setAttribute(name, value);
          }
        }
      };

      /**
       * Applies a property to a given Element.
       * @param {!Element} el
       * @param {string} name The property's name.
       * @param {*} value The property's value.
       */
      var applyProp = function applyProp(el, name, value) {
        el[name] = value;
      };

      /**
       * Applies a style to an Element. No vendor prefix expansion is done for
       * property names/values.
       * @param {!Element} el
       * @param {string} name The attribute's name.
       * @param {*} style The style to set. Either a string of css or an object
       *     containing property-value pairs.
       */
      var applyStyle = function applyStyle(el, name, style) {
        if (typeof style === 'string') {
          el.style.cssText = style;
        } else {
          el.style.cssText = '';
          var elStyle = el.style;
          var obj = /** @type {!Object<string,string>} */style;

          for (var prop in obj) {
            if (has(obj, prop)) {
              elStyle[prop] = obj[prop];
            }
          }
        }
      };

      /**
       * Updates a single attribute on an Element.
       * @param {!Element} el
       * @param {string} name The attribute's name.
       * @param {*} value The attribute's value. If the value is an object or
       *     function it is set on the Element, otherwise, it is set as an HTML
       *     attribute.
       */
      var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
        var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

        if (type === 'object' || type === 'function') {
          applyProp(el, name, value);
        } else {
          applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
        }
      };

      /**
       * Calls the appropriate attribute mutator for this attribute.
       * @param {!Element} el
       * @param {string} name The attribute's name.
       * @param {*} value The attribute's value.
       */
      var updateAttribute = function updateAttribute(el, name, value) {
        var data = getData(el);
        var attrs = data.attrs;

        if (attrs[name] === value) {
          return;
        }

        var mutator = attributes[name] || attributes[symbols.default];
        mutator(el, name, value);

        attrs[name] = value;
      };

      /**
       * A publicly mutable object to provide custom mutators for attributes.
       * @const {!Object<string, function(!Element, string, *)>}
       */
      var attributes = createMap();

      // Special generic mutator that's called for any attribute that does not
      // have a specific mutator.
      attributes[symbols.default] = applyAttributeTyped;

      attributes[symbols.placeholder] = function () {};

      attributes['style'] = applyStyle;

      /**
       * Gets the namespace to create an element (of a given tag) in.
       * @param {string} tag The tag to get the namespace for.
       * @param {?Node} parent
       * @return {?string} The namespace to create the tag in.
       */
      var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
        if (tag === 'svg') {
          return 'http://www.w3.org/2000/svg';
        }

        if (getData(parent).nodeName === 'foreignObject') {
          return null;
        }

        return parent.namespaceURI;
      };

      /**
       * Creates an Element.
       * @param {Document} doc The document with which to create the Element.
       * @param {?Node} parent
       * @param {string} tag The tag for the Element.
       * @param {?string=} key A key to identify the Element.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element.
       * @return {!Element}
       */
      var createElement = function createElement(doc, parent, tag, key, statics) {
        var namespace = getNamespaceForTag(tag, parent);
        var el = undefined;

        if (namespace) {
          el = doc.createElementNS(namespace, tag);
        } else {
          el = doc.createElement(tag);
        }

        initData(el, tag, key);

        if (statics) {
          for (var i = 0; i < statics.length; i += 2) {
            updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
          }
        }

        return el;
      };

      /**
       * Creates a Text Node.
       * @param {Document} doc The document with which to create the Element.
       * @return {!Text}
       */
      var createText = function createText(doc) {
        var node = doc.createTextNode('');
        initData(node, '#text', null);
        return node;
      };

      /**
       * Creates a mapping that can be used to look up children using a key.
       * @param {?Node} el
       * @return {!Object<string, !Element>} A mapping of keys to the children of the
       *     Element.
       */
      var createKeyMap = function createKeyMap(el) {
        var map = createMap();
        var child = el.firstElementChild;

        while (child) {
          var key = getData(child).key;

          if (key) {
            map[key] = child;
          }

          child = child.nextElementSibling;
        }

        return map;
      };

      /**
       * Retrieves the mapping of key to child node for a given Element, creating it
       * if necessary.
       * @param {?Node} el
       * @return {!Object<string, !Node>} A mapping of keys to child Elements
       */
      var getKeyMap = function getKeyMap(el) {
        var data = getData(el);

        if (!data.keyMap) {
          data.keyMap = createKeyMap(el);
        }

        return data.keyMap;
      };

      /**
       * Retrieves a child from the parent with the given key.
       * @param {?Node} parent
       * @param {?string=} key
       * @return {?Node} The child corresponding to the key.
       */
      var getChild = function getChild(parent, key) {
        return key ? getKeyMap(parent)[key] : null;
      };

      /**
       * Registers an element as being a child. The parent will keep track of the
       * child using the key. The child can be retrieved using the same key using
       * getKeyMap. The provided key should be unique within the parent Element.
       * @param {?Node} parent The parent of child.
       * @param {string} key A key to identify the child with.
       * @param {!Node} child The child to register.
       */
      var registerChild = function registerChild(parent, key, child) {
        getKeyMap(parent)[key] = child;
      };

      /**
       * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *      http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS-IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

      /** @const */
      var notifications = {
        /**
         * Called after patch has compleated with any Nodes that have been created
         * and added to the DOM.
         * @type {?function(Array<!Node>)}
         */
        nodesCreated: null,

        /**
         * Called after patch has compleated with any Nodes that have been removed
         * from the DOM.
         * Note it's an applications responsibility to handle any childNodes.
         * @type {?function(Array<!Node>)}
         */
        nodesDeleted: null
      };

      /**
       * Keeps track of the state of a patch.
       * @constructor
       */
      function Context() {
        /**
         * @type {(Array<!Node>|undefined)}
         */
        this.created = notifications.nodesCreated && [];

        /**
         * @type {(Array<!Node>|undefined)}
         */
        this.deleted = notifications.nodesDeleted && [];
      }

      /**
       * @param {!Node} node
       */
      Context.prototype.markCreated = function (node) {
        if (this.created) {
          this.created.push(node);
        }
      };

      /**
       * @param {!Node} node
       */
      Context.prototype.markDeleted = function (node) {
        if (this.deleted) {
          this.deleted.push(node);
        }
      };

      /**
       * Notifies about nodes that were created during the patch opearation.
       */
      Context.prototype.notifyChanges = function () {
        if (this.created && this.created.length > 0) {
          notifications.nodesCreated(this.created);
        }

        if (this.deleted && this.deleted.length > 0) {
          notifications.nodesDeleted(this.deleted);
        }
      };

      /**
      * Makes sure that keyed Element matches the tag name provided.
      * @param {!string} nodeName The nodeName of the node that is being matched.
      * @param {string=} tag The tag name of the Element.
      * @param {?string=} key The key of the Element.
      */
      var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
        if (nodeName !== tag) {
          throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
        }
      };

      /** @type {?Context} */
      var context = null;

      /** @type {?Node} */
      var currentNode = null;

      /** @type {?Node} */
      var currentParent = null;

      /** @type {?Element|?DocumentFragment} */
      var root = null;

      /** @type {?Document} */
      var doc = null;

      /**
       * Returns a patcher function that sets up and restores a patch context,
       * running the run function with the provided data.
       * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
       * @return {function((!Element|!DocumentFragment),!function(T),T=)}
       * @template T
       */
      var patchFactory = function patchFactory(run) {
        /**
         * TODO(moz): These annotations won't be necessary once we switch to Closure
         * Compiler's new type inference. Remove these once the switch is done.
         *
         * @param {(!Element|!DocumentFragment)} node
         * @param {!function(T)} fn
         * @param {T=} data
         * @template T
         */
        var f = function f(node, fn, data) {
          var prevContext = context;
          var prevRoot = root;
          var prevDoc = doc;
          var prevCurrentNode = currentNode;
          var prevCurrentParent = currentParent;
          var previousInAttributes = false;
          var previousInSkip = false;

          context = new Context();
          root = node;
          doc = node.ownerDocument;
          currentParent = node.parentNode;

          if ('production' !== 'production') {}

          run(node, fn, data);

          if ('production' !== 'production') {}

          context.notifyChanges();

          context = prevContext;
          root = prevRoot;
          doc = prevDoc;
          currentNode = prevCurrentNode;
          currentParent = prevCurrentParent;
        };
        return f;
      };

      /**
       * Patches the document starting at node with the provided function. This
       * function may be called during an existing patch operation.
       * @param {!Element|!DocumentFragment} node The Element or Document
       *     to patch.
       * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
       *     calls that describe the DOM.
       * @param {T=} data An argument passed to fn to represent DOM state.
       * @template T
       */
      var patchInner = patchFactory(function (node, fn, data) {
        currentNode = node;

        enterNode();
        fn(data);
        exitNode();

        if ('production' !== 'production') {}
      });

      /**
       * Patches an Element with the the provided function. Exactly one top level
       * element call should be made corresponding to `node`.
       * @param {!Element} node The Element where the patch should start.
       * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
       *     calls that describe the DOM. This should have at most one top level
       *     element call.
       * @param {T=} data An argument passed to fn to represent DOM state.
       * @template T
       */
      var patchOuter = patchFactory(function (node, fn, data) {
        currentNode = /** @type {!Element} */{ nextSibling: node };

        fn(data);

        if ('production' !== 'production') {}
      });

      /**
       * Checks whether or not the current node matches the specified nodeName and
       * key.
       *
       * @param {?string} nodeName The nodeName for this node.
       * @param {?string=} key An optional key that identifies a node.
       * @return {boolean} True if the node matches, false otherwise.
       */
      var matches = function matches(nodeName, key) {
        var data = getData(currentNode);

        // Key check is done using double equals as we want to treat a null key the
        // same as undefined. This should be okay as the only values allowed are
        // strings, null and undefined so the == semantics are not too weird.
        return nodeName === data.nodeName && key == data.key;
      };

      /**
       * Aligns the virtual Element definition with the actual DOM, moving the
       * corresponding DOM node to the correct location or creating it if necessary.
       * @param {string} nodeName For an Element, this should be a valid tag string.
       *     For a Text, this should be #text.
       * @param {?string=} key The key used to identify this element.
       * @param {?Array<*>=} statics For an Element, this should be an array of
       *     name-value pairs.
       */
      var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
        if (currentNode && matches(nodeName, key)) {
          return;
        }

        var node = undefined;

        // Check to see if the node has moved within the parent.
        if (key) {
          node = getChild(currentParent, key);
          if (node && 'production' !== 'production') {
            assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
          }
        }

        // Create the node if it doesn't exist.
        if (!node) {
          if (nodeName === '#text') {
            node = createText(doc);
          } else {
            node = createElement(doc, currentParent, nodeName, key, statics);
          }

          if (key) {
            registerChild(currentParent, key, node);
          }

          context.markCreated(node);
        }

        // If the node has a key, remove it from the DOM to prevent a large number
        // of re-orders in the case that it moved far or was completely removed.
        // Since we hold on to a reference through the keyMap, we can always add it
        // back.
        if (currentNode && getData(currentNode).key) {
          currentParent.replaceChild(node, currentNode);
          getData(currentParent).keyMapValid = false;
        } else {
          currentParent.insertBefore(node, currentNode);
        }

        currentNode = node;
      };

      /**
       * Clears out any unvisited Nodes, as the corresponding virtual element
       * functions were never called for them.
       */
      var clearUnvisitedDOM = function clearUnvisitedDOM() {
        var node = currentParent;
        var data = getData(node);
        var keyMap = data.keyMap;
        var keyMapValid = data.keyMapValid;
        var child = node.lastChild;
        var key = undefined;

        if (child === currentNode && keyMapValid) {
          return;
        }

        if (data.attrs[symbols.placeholder] && node !== root) {
          if ('production' !== 'production') {}
          return;
        }

        while (child !== currentNode) {
          node.removeChild(child);
          context.markDeleted( /** @type {!Node}*/child);

          key = getData(child).key;
          if (key) {
            delete keyMap[key];
          }
          child = node.lastChild;
        }

        // Clean the keyMap, removing any unusued keys.
        if (!keyMapValid) {
          for (key in keyMap) {
            child = keyMap[key];
            if (child.parentNode !== node) {
              context.markDeleted(child);
              delete keyMap[key];
            }
          }

          data.keyMapValid = true;
        }
      };

      /**
       * Changes to the first child of the current node.
       */
      var enterNode = function enterNode() {
        currentParent = currentNode;
        currentNode = null;
      };

      /**
       * Changes to the next sibling of the current node.
       */
      var nextNode = function nextNode() {
        if (currentNode) {
          currentNode = currentNode.nextSibling;
        } else {
          currentNode = currentParent.firstChild;
        }
      };

      /**
       * Changes to the parent of the current node, removing any unvisited children.
       */
      var exitNode = function exitNode() {
        clearUnvisitedDOM();

        currentNode = currentParent;
        currentParent = currentParent.parentNode;
      };

      /**
       * Makes sure that the current node is an Element with a matching tagName and
       * key.
       *
       * @param {string} tag The element's tag.
       * @param {?string=} key The key used to identify this element. This can be an
       *     empty string, but performance may be better if a unique value is used
       *     when iterating over an array of items.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element. These will only be set once when the
       *     Element is created.
       * @return {!Element} The corresponding Element.
       */
      var coreElementOpen = function coreElementOpen(tag, key, statics) {
        nextNode();
        alignWithDOM(tag, key, statics);
        enterNode();
        return (/** @type {!Element} */currentParent
        );
      };

      /**
       * Closes the currently open Element, removing any unvisited children if
       * necessary.
       *
       * @return {!Element} The corresponding Element.
       */
      var coreElementClose = function coreElementClose() {
        if ('production' !== 'production') {}

        exitNode();
        return (/** @type {!Element} */currentNode
        );
      };

      /**
       * Makes sure the current node is a Text node and creates a Text node if it is
       * not.
       *
       * @return {!Text} The corresponding Text Node.
       */
      var coreText = function coreText() {
        nextNode();
        alignWithDOM('#text', null, null);
        return (/** @type {!Text} */currentNode
        );
      };

      /**
       * Gets the current Element being patched.
       * @return {!Element}
       */
      var currentElement = function currentElement() {
        if ('production' !== 'production') {}
        return (/** @type {!Element} */currentParent
        );
      };

      /**
       * Skips the children in a subtree, allowing an Element to be closed without
       * clearing out the children.
       */
      var skip = function skip() {
        if ('production' !== 'production') {}
        currentNode = currentParent.lastChild;
      };

      /**
       * The offset in the virtual element declaration where the attributes are
       * specified.
       * @const
       */
      var ATTRIBUTES_OFFSET = 3;

      /**
       * Builds an array of arguments for use with elementOpenStart, attr and
       * elementOpenEnd.
       * @const {Array<*>}
       */
      var argsBuilder = [];

      /**
       * @param {string} tag The element's tag.
       * @param {?string=} key The key used to identify this element. This can be an
       *     empty string, but performance may be better if a unique value is used
       *     when iterating over an array of items.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element. These will only be set once when the
       *     Element is created.
       * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
       *     for the Element.
       * @return {!Element} The corresponding Element.
       */
      var elementOpen = function elementOpen(tag, key, statics, const_args) {
        if ('production' !== 'production') {}

        var node = coreElementOpen(tag, key, statics);
        var data = getData(node);

        /*
         * Checks to see if one or more attributes have changed for a given Element.
         * When no attributes have changed, this is much faster than checking each
         * individual argument. When attributes have changed, the overhead of this is
         * minimal.
         */
        var attrsArr = data.attrsArr;
        var newAttrs = data.newAttrs;
        var attrsChanged = false;
        var i = ATTRIBUTES_OFFSET;
        var j = 0;

        for (; i < arguments.length; i += 1, j += 1) {
          if (attrsArr[j] !== arguments[i]) {
            attrsChanged = true;
            break;
          }
        }

        for (; i < arguments.length; i += 1, j += 1) {
          attrsArr[j] = arguments[i];
        }

        if (j < attrsArr.length) {
          attrsChanged = true;
          attrsArr.length = j;
        }

        /*
         * Actually perform the attribute update.
         */
        if (attrsChanged) {
          for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
            newAttrs[arguments[i]] = arguments[i + 1];
          }

          for (var _attr in newAttrs) {
            updateAttribute(node, _attr, newAttrs[_attr]);
            newAttrs[_attr] = undefined;
          }
        }

        return node;
      };

      /**
       * Declares a virtual Element at the current location in the document. This
       * corresponds to an opening tag and a elementClose tag is required. This is
       * like elementOpen, but the attributes are defined using the attr function
       * rather than being passed as arguments. Must be folllowed by 0 or more calls
       * to attr, then a call to elementOpenEnd.
       * @param {string} tag The element's tag.
       * @param {?string=} key The key used to identify this element. This can be an
       *     empty string, but performance may be better if a unique value is used
       *     when iterating over an array of items.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element. These will only be set once when the
       *     Element is created.
       */
      var elementOpenStart = function elementOpenStart(tag, key, statics) {
        if ('production' !== 'production') {}

        argsBuilder[0] = tag;
        argsBuilder[1] = key;
        argsBuilder[2] = statics;
      };

      /***
       * Defines a virtual attribute at this point of the DOM. This is only valid
       * when called between elementOpenStart and elementOpenEnd.
       *
       * @param {string} name
       * @param {*} value
       */
      var attr = function attr(name, value) {
        if ('production' !== 'production') {}

        argsBuilder.push(name, value);
      };

      /**
       * Closes an open tag started with elementOpenStart.
       * @return {!Element} The corresponding Element.
       */
      var elementOpenEnd = function elementOpenEnd() {
        if ('production' !== 'production') {}

        var node = elementOpen.apply(null, argsBuilder);
        argsBuilder.length = 0;
        return node;
      };

      /**
       * Closes an open virtual Element.
       *
       * @param {string} tag The element's tag.
       * @return {!Element} The corresponding Element.
       */
      var elementClose = function elementClose(tag) {
        if ('production' !== 'production') {}

        var node = coreElementClose();

        if ('production' !== 'production') {}

        return node;
      };

      /**
       * Declares a virtual Element at the current location in the document that has
       * no children.
       * @param {string} tag The element's tag.
       * @param {?string=} key The key used to identify this element. This can be an
       *     empty string, but performance may be better if a unique value is used
       *     when iterating over an array of items.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element. These will only be set once when the
       *     Element is created.
       * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
       *     for the Element.
       * @return {!Element} The corresponding Element.
       */
      var elementVoid = function elementVoid(tag, key, statics, const_args) {
        elementOpen.apply(null, arguments);
        return elementClose(tag);
      };

      /**
       * Declares a virtual Element at the current location in the document that is a
       * placeholder element. Children of this Element can be manually managed and
       * will not be cleared by the library.
       *
       * A key must be specified to make sure that this node is correctly preserved
       * across all conditionals.
       *
       * @param {string} tag The element's tag.
       * @param {string} key The key used to identify this element.
       * @param {?Array<*>=} statics An array of attribute name/value pairs of the
       *     static attributes for the Element. These will only be set once when the
       *     Element is created.
       * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
       *     for the Element.
       * @return {!Element} The corresponding Element.
       */
      var elementPlaceholder = function elementPlaceholder(tag, key, statics, const_args) {
        if ('production' !== 'production') {}

        elementOpen.apply(null, arguments);
        skip();
        return elementClose(tag);
      };

      /**
       * Declares a virtual Text at this point in the document.
       *
       * @param {string|number|boolean} value The value of the Text.
       * @param {...(function((string|number|boolean)):string)} const_args
       *     Functions to format the value which are called only when the value has
       *     changed.
       * @return {!Text} The corresponding text node.
       */
      var text = function text(value, const_args) {
        if ('production' !== 'production') {}

        var node = coreText();
        var data = getData(node);

        if (data.text !== value) {
          data.text = /** @type {string} */value;

          var formatted = value;
          for (var i = 1; i < arguments.length; i += 1) {
            /*
             * Call the formatter function directly to prevent leaking arguments.
             * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
             */
            var fn = arguments[i];
            formatted = fn(formatted);
          }

          node.data = formatted;
        }

        return node;
      };

      exports.patch = patchInner;
      exports.patchInner = patchInner;
      exports.patchOuter = patchOuter;
      exports.currentElement = currentElement;
      exports.skip = skip;
      exports.elementVoid = elementVoid;
      exports.elementOpenStart = elementOpenStart;
      exports.elementOpenEnd = elementOpenEnd;
      exports.elementOpen = elementOpen;
      exports.elementClose = elementClose;
      exports.elementPlaceholder = elementPlaceholder;
      exports.text = text;
      exports.attr = attr;
      exports.symbols = symbols;
      exports.attributes = attributes;
      exports.applyAttr = applyAttr;
      exports.applyProp = applyProp;
      exports.notifications = notifications;

      });

    interopDefault(incrementalDomCjs);
    var applyProp = incrementalDomCjs.applyProp;
    var attributes = incrementalDomCjs.attributes;
    var symbols = incrementalDomCjs.symbols;
    var text = incrementalDomCjs.text;
    var elementClose = incrementalDomCjs.elementClose;
    var elementOpen$1 = incrementalDomCjs.elementOpen;
    var skip = incrementalDomCjs.skip;
    var patchInner = incrementalDomCjs.patchInner;

    function enter(object, props) {
      var saved = {};
      Object.keys(props).forEach(function (key) {
        saved[key] = object[key];
        object[key] = props[key];
      });
      return saved;
    }

    function exit(object, saved) {
      assign$2(object, saved);
    }

    // Decorates a function with a side effect that changes the properties of an
    // object during its execution, and restores them after. There is no error
    // handling here, if the wrapped function throws an error, properties are not
    // restored and all bets are off.
    function propContext (object, props) {
      return function (func) {
        return function () {
          var saved = enter(object, props);
          var result = func.apply(undefined, arguments);
          exit(object, saved);
          return result;
        };
      };
    }

    var index$24 = createCommonjsModule(function (module) {
      'use strict';

      module.exports = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.self === self && self || _typeof(commonjsGlobal) === 'object' && commonjsGlobal.global === commonjsGlobal && commonjsGlobal || commonjsGlobal;
    });

    var root = interopDefault(index$24);

var     customElements$2 = root.customElements;
var     HTMLElement$1 = root.HTMLElement;
    var applyDefault = attributes[symbols.default];

    // A stack of children that corresponds to the current function helper being
    // executed.
    var stackChren = [];

    var $skip = '__skip';
    var $currentEventHandlers = '__events';
    var $stackCurrentHelperProps = '__props';

    // The current function helper in the stack.
    var stackCurrentHelper = void 0;

    // This is used for the Incremental DOM overrides to keep track of what args
    // to pass the main elementOpen() function.
    var overrideArgs = void 0;

    // The number of levels deep after skipping a tree.
    var skips = 0;

    var noop = function noop() {};

    // Adds or removes an event listener for an element.
    function applyEvent(elem, ename, newFunc) {
      var events = elem[$currentEventHandlers];

      if (!events) {
        events = elem[$currentEventHandlers] = {};
      }

      // Undefined indicates that there is no listener yet.
      if (typeof events[ename] === 'undefined') {
        // We only add a single listener once. Originally this was a workaround for
        // the Webcomponents ShadyDOM polyfill not removing listeners, but it's
        // also a simpler model for binding / unbinding events because you only
        // have a single handler you need to worry about and a single place where
        // you only store one event handler
        elem.addEventListener(ename, function (e) {
          if (events[ename]) {
            events[ename].call(this, e);
          }
        });
      }

      // Not undefined indicates that we have set a listener, so default to null.
      events[ename] = typeof newFunc === 'function' ? newFunc : null;
    }

    var attributesContext = propContext(attributes, defineProperty({
      // Attributes that shouldn't be applied to the DOM.
      key: noop,
      statics: noop,

      // Attributes that *must* be set via a property on all elements.
      checked: applyProp,
      className: applyProp,
      disabled: applyProp,
      value: applyProp,

      // Ref handler.
      ref: function ref(elem, name, value) {
        elem[$ref] = value;
      },


      // Skip handler.
      skip: function skip(elem, name, value) {
        if (value) {
          elem[$skip] = true;
        } else {
          delete elem[$skip];
        }
      }
    }, symbols.default, function (elem, name, value) {
      var _ref = customElements$2.get(elem.localName) || {
        props: {},
        prototype: {}
      },
          props = _ref.props,
          prototype = _ref.prototype;

      // TODO when refactoring properties to not have to workaround the old
      // WebKit bug we can remove the "name in props" check below.
      //
      // NOTE: That the "name in elem" check won't work for polyfilled custom
      // elements that set a property that isn't explicitly specified in "props"
      // or "prototype" unless it is added to the element explicitly as a
      // property prior to passing the prop to the vdom function. For example, if
      // it were added in a lifecycle callback because it wouldn't have been
      // upgraded yet.
      //
      // We prefer setting props, so we do this if there's a property matching
      // name that was passed. However, certain props on SVG elements are
      // readonly and error when you try to set them.


      if ((name in props || name in elem || name in prototype) && !('ownerSVGElement' in elem)) {
        applyProp(elem, name, value);
        return;
      }

      // Explicit false removes the attribute.
      if (value === false) {
        applyDefault(elem, name);
        return;
      }

      // Handle built-in and custom events.
      if (name.indexOf('on') === 0) {
        var firstChar = name[2];
        var eventName = void 0;

        if (firstChar === '-') {
          eventName = name.substring(3);
        } else if (firstChar === firstChar.toUpperCase()) {
          eventName = firstChar.toLowerCase() + name.substring(3);
        }

        if (eventName) {
          applyEvent(elem, eventName, value);
          return;
        }
      }

      applyDefault(elem, name, value);
    }));

    function resolveTagName(name) {
      // We return falsy values as some wrapped IDOM functions allow empty values.
      if (!name) {
        return name;
      }

      // We try and return the cached tag name, if one exists.
      if (name[$name]) {
        return name[$name];
      }

      // If it's a custom element, we get the tag name by constructing it and
      // caching it.
      if (name.prototype instanceof HTMLElement$1) {
        // eslint-disable-next-line
        var elem = new name();
        return name[$name] = elem.localName;
      }

      // Pass all other values through so IDOM gets what it's expecting.
      return name;
    }

    // Incremental DOM's elementOpen is where the hooks in `attributes` are applied,
    // so it's the only function we need to execute in the context of our attributes.
    var elementOpen = attributesContext(elementOpen$1);

    function elementOpenStart(tag) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var statics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      overrideArgs = [tag, key, statics];
    }

    function elementOpenEnd() {
      var node = newElementOpen.apply(undefined, toConsumableArray(overrideArgs)); // eslint-disable-line no-use-before-define
      overrideArgs = null;
      return node;
    }

    function wrapIdomFunc(func) {
      var tnameFuncHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      return function wrap() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        args[0] = resolveTagName(args[0]);
        stackCurrentHelper = null;
        if (typeof args[0] === 'function') {
          // If we've encountered a function, handle it according to the type of
          // function that is being wrapped.
          stackCurrentHelper = args[0];
          return tnameFuncHandler.apply(undefined, args);
        } else if (stackChren.length) {
          // We pass the wrap() function in here so that when it's called as
          // children, it will queue up for the next stack, if there is one.
          stackChren[stackChren.length - 1].push([wrap, args]);
        } else {
          if (func === elementOpen) {
            if (skips) {
              return ++skips;
            }

            var elem = func.apply(undefined, args);

            if (elem[$skip]) {
              ++skips;
            }

            return elem;
          }

          if (func === elementClose) {
            if (skips === 1) {
              skip();
            }

            // We only want to skip closing if it's not the last closing tag in the
            // skipped tree because we keep the element that initiated the skpping.
            if (skips && --skips) {
              return;
            }

            var _elem = func.apply(undefined, args);
            var ref = _elem[$ref];

            // We delete so that it isn't called again for the same element. If the
            // ref changes, or the element changes, this will be defined again.
            delete _elem[$ref];

            // Execute the saved ref after esuring we've cleand up after it.
            if (typeof ref === 'function') {
              ref(_elem);
            }

            return _elem;
          }

          // We must call elementOpenStart and elementOpenEnd even if we are
          // skipping because they queue up attributes and then call elementClose.
          if (!skips || func === elementOpenStart || func === elementOpenEnd) {
            return func.apply(undefined, args);
          }
        }
      };
    }

    function newAttr() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (stackCurrentHelper) {
        stackCurrentHelper[$stackCurrentHelperProps][args[0]] = args[1];
      } else if (stackChren.length) {
        stackChren[stackChren.length - 1].push([newAttr, args]);
      } else {
        overrideArgs.push(args[0]);
        overrideArgs.push(args[1]);
      }
    }

    function stackOpen(tname, key, statics) {
      var props = { key: key, statics: statics };

      for (var _len3 = arguments.length, attrs = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        attrs[_key3 - 3] = arguments[_key3];
      }

      for (var a = 0; a < attrs.length; a += 2) {
        props[attrs[a]] = attrs[a + 1];
      }
      tname[$stackCurrentHelperProps] = props;
      stackChren.push([]);
    }

    function stackClose(tname) {
      var chren = stackChren.pop();
      var props = tname[$stackCurrentHelperProps];
      delete tname[$stackCurrentHelperProps];
      var elemOrFn = tname(props, function () {
        return chren.forEach(function (args) {
          return args[0].apply(args, toConsumableArray(args[1]));
        });
      });
      return typeof elemOrFn === 'function' ? elemOrFn() : elemOrFn;
    }

    // Incremental DOM overrides
    // -------------------------

    // We must override internal functions that call internal Incremental DOM
    // functions because we can't override the internal references. This means
    // we must roughly re-implement their behaviour. Luckily, they're fairly
    // simple.
    var newElementOpenStart = wrapIdomFunc(elementOpenStart, stackOpen);
    var newElementOpenEnd = wrapIdomFunc(elementOpenEnd);

    // Standard open / closed overrides don't need to reproduce internal behaviour
    // because they are the ones referenced from *End and *Start.
    var newElementOpen = wrapIdomFunc(elementOpen, stackOpen);
    var newElementClose = wrapIdomFunc(elementClose, stackClose);

    // Text override ensures their calls can queue if using function helpers.
    var newText = wrapIdomFunc(text);

    // Convenience function for declaring an Incremental DOM element using
    // hyperscript-style syntax.
    function element(tname, attrs) {
      var atype = typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs);

      // If attributes are a function, then they should be treated as children.

      for (var _len5 = arguments.length, chren = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        chren[_key5 - 2] = arguments[_key5];
      }

      if (atype === 'function' || atype === 'string' || atype === 'number') {
        chren.unshift(attrs);
      }

      // Ensure the attributes are an object. Null is considered an object so we
      // have to test for this explicitly.
      if (attrs === null || atype !== 'object') {
        attrs = {};
      }

      // We open the element so we can set attrs after.
      newElementOpenStart(tname, attrs.key, attrs.statics);

      // Delete so special attrs don't actually get set.
      delete attrs.key;
      delete attrs.statics;

      // Set attributes.
      Object.keys(attrs).forEach(function (name) {
        return newAttr(name, attrs[name]);
      });

      // Close before we render the descendant tree.
      newElementOpenEnd(tname);

      chren.forEach(function (ch) {
        var ctype = typeof ch === 'undefined' ? 'undefined' : _typeof(ch);
        if (ctype === 'function') {
          ch();
        } else if (ctype === 'string' || ctype === 'number') {
          newText(ch);
        } else if (Array.isArray(ch)) {
          ch.forEach(function (sch) {
            return sch();
          });
        }
      });

      return newElementClose(tname);
    }

    // Even further convenience for building a DSL out of JavaScript functions or hooking into standard
    // transpiles for JSX (React.createElement() / h).
    function builder() {
      for (var _len6 = arguments.length, tags = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        tags[_key6] = arguments[_key6];
      }

      if (tags.length === 0) {
        return function () {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return element.bind.apply(element, [null].concat(args));
        };
      }
      return tags.map(function (tag) {
        return function () {
          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
          }

          return element.bind.apply(element, [null, tag].concat(args));
        };
      });
    }

    function createSymbol(description) {
      return typeof Symbol === 'function' ? Symbol(description) : description;
    }

    function data (element) {
      var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
      return namespace && (data[namespace] || (data[namespace] = {})) || data; // eslint-disable-line no-mixed-operators
    }

    var nativeHints = ['native code', '[object MutationObserverConstructor]' // for mobile safari iOS 9.0
    ];
    var native = (function (fn) {
      return nativeHints.map(function (hint) {
        return (fn || '').toString().indexOf([hint]) > -1;
      }).reduce(function (a, b) {
        return a || b;
      });
    });

    var MutationObserver$1 = root.MutationObserver;


    function microtaskDebounce(cbFunc) {
      var scheduled = false;
      var i = 0;
      var cbArgs = [];
      var elem = document.createElement('span');
      var observer = new MutationObserver$1(function () {
        cbFunc.apply(undefined, toConsumableArray(cbArgs));
        scheduled = false;
        cbArgs = null;
      });

      observer.observe(elem, { childList: true });

      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        cbArgs = args;
        if (!scheduled) {
          scheduled = true;
          elem.textContent = '' + i;
          i += 1;
        }
      };
    }

    // We have to use setTimeout() for IE9 and 10 because the Mutation Observer
    // polyfill requires that the element be in the document to trigger Mutation
    // Events. Mutation Events are also synchronous and thus wouldn't debounce.
    //
    // The soonest we can set the timeout for in IE is 1 as they have issues when
    // setting to 0.
    function taskDebounce(cbFunc) {
      var scheduled = false;
      var cbArgs = [];
      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cbArgs = args;
        if (!scheduled) {
          scheduled = true;
          setTimeout(function () {
            scheduled = false;
            cbFunc.apply(undefined, toConsumableArray(cbArgs));
          }, 1);
        }
      };
    }
    var debounce = native(MutationObserver$1) ? microtaskDebounce : taskDebounce;

    function deprecated(elem, oldUsage, newUsage) {
      if (DEBUG) {
        var ownerName = elem.localName ? elem.localName : String(elem);
        console.warn(ownerName + " " + oldUsage + " is deprecated. Use " + newUsage + ".");
      }
    }

    /**
     * @internal
     * Attributes Manager
     *
     * Postpones attributes updates until when connected.
     */

    var AttributesManager = function () {
      function AttributesManager(elem) {
        classCallCheck(this, AttributesManager);

        this.elem = elem;
        this.connected = false;
        this.pendingValues = {};
        this.lastSetValues = {};
      }

      /**
       * Called from disconnectedCallback
       */


      createClass(AttributesManager, [{
        key: 'suspendAttributesUpdates',
        value: function suspendAttributesUpdates() {
          this.connected = false;
        }

        /**
         * Called from connectedCallback
         */

      }, {
        key: 'resumeAttributesUpdates',
        value: function resumeAttributesUpdates() {
          var _this = this;

          this.connected = true;
          var names = Object.keys(this.pendingValues);
          names.forEach(function (name) {
            var value = _this.pendingValues[name];
            // Skip if already cleared
            if (!isUndefined(value)) {
              delete _this.pendingValues[name];
              _this._syncAttrValue(name, value);
            }
          });
        }

        /**
         * Returns true if the value is different from the one set internally
         * using setAttrValue()
         */

      }, {
        key: 'onAttributeChanged',
        value: function onAttributeChanged(name, value) {
          value = toNullOrString(value);

          // A new attribute value voids the pending one
          this._clearPendingValue(name);

          var changed = this.lastSetValues[name] !== value;
          this.lastSetValues[name] = value;
          return changed;
        }

        /**
         * Updates or removes the attribute if value === null.
         *
         * When the component is not connected the value is saved and
         * the attribute is only updated when the component is re-connected.
         */

      }, {
        key: 'setAttrValue',
        value: function setAttrValue(name, value) {
          value = toNullOrString(value);

          this.lastSetValues[name] = value;

          if (this.connected) {
            this._clearPendingValue(name);
            this._syncAttrValue(name, value);
          } else {
            this.pendingValues[name] = value;
          }
        }
      }, {
        key: '_syncAttrValue',
        value: function _syncAttrValue(name, value) {
          var currAttrValue = toNullOrString(this.elem.getAttribute(name));
          if (value !== currAttrValue) {
            if (value === null) {
              this.elem.removeAttribute(name);
            } else {
              this.elem.setAttribute(name, value);
            }
          }
        }
      }, {
        key: '_clearPendingValue',
        value: function _clearPendingValue(name) {
          if (name in this.pendingValues) {
            delete this.pendingValues[name];
          }
        }
      }]);
      return AttributesManager;
    }();

    // Only used by getAttrMgr


    var $attributesMgr = '____skate_attributesMgr';

    /**
     * @internal
     * Returns attribute manager instance for the given Component
     */
    function getAttrMgr(elem) {
      var mgr = elem[$attributesMgr];
      if (!mgr) {
        mgr = new AttributesManager(elem);
        elem[$attributesMgr] = mgr;
      }
      return mgr;
    }

    function getOwnPropertyDescriptors () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return getPropNamesAndSymbols(obj).reduce(function (prev, nameOrSymbol) {
        prev[nameOrSymbol] = Object.getOwnPropertyDescriptor(obj, nameOrSymbol);
        return prev;
      }, {});
    }

    function dashCase (str) {
      return str.split(/([A-Z])/).reduce(function (one, two, idx) {
        var dash = !one || idx % 2 === 0 ? '' : '-';
        return '' + one + dash + two.toLowerCase();
      });
    }

    function error(message) {
      throw new Error(message);
    }

    /**
     * @internal
     * Property Definition
     *
     * Internal meta data and strategies for a property.
     * Created from the options of a PropOptions config object.
     *
     * Once created a PropDefinition should be treated as immutable and final.
     * 'getPropsMap' function memoizes PropDefinitions by Component's Class.
     *
     * The 'attribute' option is normalized to 'attrSource' and 'attrTarget' properties.
     */

    var PropDefinition = function () {
      function PropDefinition(nameOrSymbol, propOptions) {
        var _this = this;

        classCallCheck(this, PropDefinition);

        this._nameOrSymbol = nameOrSymbol;

        propOptions = propOptions || {};

        // default 'attrSource': no observed source attribute (name)
        this.attrSource = null;

        // default 'attrTarget': no reflected target attribute (name)
        this.attrTarget = null;

        // default 'attrTargetIsNotSource'
        this.attrTargetIsNotSource = false;

        // default 'coerce': identity function
        this.coerce = function (value) {
          return value;
        };

        // default 'default': set prop to 'null'
        this.default = null;

        // default 'deserialize': return attribute's value (string or null)
        this.deserialize = function (value) {
          return value;
        };

        // default 'get': no function
        this.get = null;

        // 'initial' default: unspecified
        // 'initial' option is truly optional and it cannot be initialized.
        // Its presence is tested using: ('initial' in propDef)

        // 'serialize' default: return string value or null
        this.serialize = function (value) {
          return empty(value) ? null : String(value);
        };

        // default 'set': no function
        this.set = null;

        // Note: option key is always a string (no symbols here)
        Object.keys(propOptions).forEach(function (option) {
          var optVal = propOptions[option];

          // Only accept documented options and perform minimal input validation.
          switch (option) {
            case 'attribute':
              if (!isObject(optVal)) {
                _this.attrSource = _this.attrTarget = resolveAttrName(optVal, nameOrSymbol);
              } else {
                var source = optVal.source,
                    target = optVal.target;

                if (!source && !target) {
                  error(option + ' \'source\' or \'target\' is missing.');
                }
                _this.attrSource = resolveAttrName(source, nameOrSymbol);
                _this.attrTarget = resolveAttrName(target, nameOrSymbol);
                _this.attrTargetIsNotSource = _this.attrTarget !== _this.attrSource;
              }
              break;
            case 'coerce':
            case 'deserialize':
            case 'get':
            case 'serialize':
            case 'set':
              if (isFunction(optVal)) {
                _this[option] = optVal;
              } else {
                error(option + ' must be a function.');
              }
              break;
            case 'default':
            case 'initial':
              _this[option] = optVal;
              break;
            default:
              // TODO: undocumented options?
              _this[option] = optVal;
              break;
          }
        });
      }

      createClass(PropDefinition, [{
        key: 'nameOrSymbol',
        get: function get() {
          return this._nameOrSymbol;
        }
      }]);
      return PropDefinition;
    }();

    function resolveAttrName(attrOption, nameOrSymbol) {
      if (isSymbol(nameOrSymbol)) {
        error(nameOrSymbol.toString() + ' symbol property cannot have an attribute.');
      } else {
        if (attrOption === true) {
          return dashCase(String(nameOrSymbol));
        }
        if (isString(attrOption)) {
          return attrOption;
        }
      }
      return null;
    }

    /**
     * This is needed to avoid IE11 "stack size errors" when creating
     * a new property on the constructor of an HTMLElement
     */
    function setCtorNativeProperty(Ctor, propName, value) {
      Object.defineProperty(Ctor, propName, { configurable: true, value: value });
    }

    /**
     * Memoizes a map of PropDefinition for the given component class.
     * Keys in the map are the properties name which can a string or a symbol.
     *
     * The map is created from the result of: static get props
     */
    function getPropsMap(Ctor) {
      // Must be defined on constructor and not from a superclass
      if (!Ctor.hasOwnProperty($ctorPropsMap)) {
        var props = Ctor.props || {};

        var propsMap = getPropNamesAndSymbols(props).reduce(function (result, nameOrSymbol) {
          result[nameOrSymbol] = new PropDefinition(nameOrSymbol, props[nameOrSymbol]);
          return result;
        }, {});
        setCtorNativeProperty(Ctor, $ctorPropsMap, propsMap);
      }

      return Ctor[$ctorPropsMap];
    }

    function get$1(elem) {
      var props = {};

      getPropNamesAndSymbols(getPropsMap(elem.constructor)).forEach(function (nameOrSymbol) {
        props[nameOrSymbol] = elem[nameOrSymbol];
      });

      return props;
    }

    function set$1(elem, newProps) {
      assign$2(elem, newProps);
      if (elem[$renderer]) {
        elem[$renderer]();
      }
    }

    function props (elem, newProps) {
      return isUndefined(newProps) ? get$1(elem) : set$1(elem, newProps);
    }

    function getDefaultValue(elem, propDef) {
      return typeof propDef.default === 'function' ? propDef.default(elem, { name: propDef.nameOrSymbol }) : propDef.default;
    }

    function getInitialValue(elem, propDef) {
      return typeof propDef.initial === 'function' ? propDef.initial(elem, { name: propDef.nameOrSymbol }) : propDef.initial;
    }

    function getPropData(elem, name) {
      var elemData = data(elem, 'props');
      return elemData[name] || (elemData[name] = {});
    }

    function createNativePropertyDescriptor(propDef) {
      var nameOrSymbol = propDef.nameOrSymbol;


      var prop = {
        configurable: true,
        enumerable: true
      };

      prop.beforeDefineProperty = function (elem) {
        var propData = getPropData(elem, nameOrSymbol);
        var attrSource = propDef.attrSource;

        // Store attrSource name to property link.
        if (attrSource) {
          data(elem, 'attrSourceLinks')[attrSource] = nameOrSymbol;
        }

        // prop value before upgrading
        var initialValue = elem[nameOrSymbol];

        // Set up initial value if it wasn't specified.
        var valueFromAttrSource = false;
        if (empty(initialValue)) {
          if (attrSource && elem.hasAttribute(attrSource)) {
            valueFromAttrSource = true;
            initialValue = propDef.deserialize(elem.getAttribute(attrSource));
          } else if ('initial' in propDef) {
            initialValue = getInitialValue(elem, propDef);
          } else {
            initialValue = getDefaultValue(elem, propDef);
          }
        }

        initialValue = propDef.coerce(initialValue);

        propData.internalValue = initialValue;

        // Reflect to Target Attribute
        var mustReflect = propDef.attrTarget && !empty(initialValue) && (!valueFromAttrSource || propDef.attrTargetIsNotSource);

        if (mustReflect) {
          var serializedValue = propDef.serialize(initialValue);
          getAttrMgr(elem).setAttrValue(propDef.attrTarget, serializedValue);
        }
      };

      prop.get = function get() {
        var propData = getPropData(this, nameOrSymbol);
        var internalValue = propData.internalValue;

        return propDef.get ? propDef.get(this, { name: nameOrSymbol, internalValue: internalValue }) : internalValue;
      };

      prop.set = function set(newValue) {
        var propData = getPropData(this, nameOrSymbol);

        var useDefaultValue = empty(newValue);
        if (useDefaultValue) {
          newValue = getDefaultValue(this, propDef);
        }

        newValue = propDef.coerce(newValue);

        if (propDef.set) {
          var oldValue = propData.oldValue;


          if (empty(oldValue)) {
            oldValue = null;
          }
          var changeData = { name: nameOrSymbol, newValue: newValue, oldValue: oldValue };
          propDef.set(this, changeData);
        }

        // Queue a re-render.
        this[$rendererDebounced](this);

        // Update prop data so we can use it next time.
        propData.internalValue = propData.oldValue = newValue;

        // Reflect to Target attribute.
        var mustReflect = propDef.attrTarget && (propDef.attrTargetIsNotSource || !propData.settingPropFromAttrSource);
        if (mustReflect) {
          // Note: setting the prop to empty implies the default value
          // and therefore no attribute should be present!
          var serializedValue = useDefaultValue ? null : propDef.serialize(newValue);
          getAttrMgr(this).setAttrValue(propDef.attrTarget, serializedValue);
        }
      };

      return prop;
    }

    /**
     * Polyfill Object.is for IE
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    if (!Object.is) {
      Object.is = function (x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      };
    }
    var objectIs = Object.is;

    var HTMLElement$2 = root.HTMLElement || function () {
      function _class() {
        classCallCheck(this, _class);
      }

      return _class;
    }();
    var _prevName = createSymbol('prevName');
    var _prevOldValue = createSymbol('prevOldValue');
    var _prevNewValue = createSymbol('prevNewValue');

    function preventDoubleCalling(elem, name, oldValue, newValue) {
      return name === elem[_prevName] && oldValue === elem[_prevOldValue] && newValue === elem[_prevNewValue];
    }

    // TODO remove when not catering to Safari < 10.
    function createNativePropertyDescriptors(Ctor) {
      var propDefs = getPropsMap(Ctor);
      return getPropNamesAndSymbols(propDefs).reduce(function (propDescriptors, nameOrSymbol) {
        propDescriptors[nameOrSymbol] = createNativePropertyDescriptor(propDefs[nameOrSymbol]);
        return propDescriptors;
      }, {});
    }

    // TODO refactor when not catering to Safari < 10.
    //
    // We should be able to simplify this where all we do is Object.defineProperty().
    function createInitProps(Ctor) {
      var propDescriptors = createNativePropertyDescriptors(Ctor);

      return function (elem) {
        getPropNamesAndSymbols(propDescriptors).forEach(function (nameOrSymbol) {
          var propDescriptor = propDescriptors[nameOrSymbol];
          propDescriptor.beforeDefineProperty(elem);

          // We check here before defining to see if the prop was specified prior
          // to upgrading.
          var hasPropBeforeUpgrading = nameOrSymbol in elem;

          // This is saved prior to defining so that we can set it after it it was
          // defined prior to upgrading. We don't want to invoke the getter if we
          // don't need to, so we only get the value if we need to re-sync.
          var valueBeforeUpgrading = hasPropBeforeUpgrading && elem[nameOrSymbol];

          // https://bugs.webkit.org/show_bug.cgi?id=49739
          //
          // When Webkit fixes that bug so that native property accessors can be
          // retrieved, we can move defining the property to the prototype and away
          // from having to do if for every instance as all other browsers support
          // this.
          Object.defineProperty(elem, nameOrSymbol, propDescriptor);

          // DEPRECATED
          //
          // We'll be removing get / set callbacks on properties. Use the
          // updatedCallback() instead.
          //
          // We re-set the prop if it was specified prior to upgrading because we
          // need to ensure set() is triggered both in polyfilled environments and
          // in native where the definition may be registerd after elements it
          // represents have already been created.
          if (hasPropBeforeUpgrading) {
            elem[nameOrSymbol] = valueBeforeUpgrading;
          }
        });
      };
    }

    var _class2 = function (_HTMLElement) {
      inherits(_class2, _HTMLElement);
      createClass(_class2, null, [{
        key: 'observedAttributes',

        /**
         * Returns unique attribute names configured with props and
         * those set on the Component constructor if any
         */
        get: function get$$() {
          var attrsOnCtor = this.hasOwnProperty($ctorObservedAttributes) ? this[$ctorObservedAttributes] : [];
          var propDefs = getPropsMap(this);

          // Use Object.keys to skips symbol props since they have no linked attributes
          var attrsFromLinkedProps = Object.keys(propDefs).map(function (propName) {
            return propDefs[propName].attrSource;
          }).filter(Boolean);

          var all = attrsFromLinkedProps.concat(attrsOnCtor).concat(get(_class2.__proto__ || Object.getPrototypeOf(_class2), 'observedAttributes', this));
          return all.filter(function (item, index) {
            return all.indexOf(item) === index;
          });
        },
        set: function set(value) {
          value = Array.isArray(value) ? value : [];
          setCtorNativeProperty(this, 'observedAttributes', value);
        }

        // Returns superclass props overwritten with this Component props

      }, {
        key: 'props',
        get: function get$$() {
          return assign$2({}, get(_class2.__proto__ || Object.getPrototypeOf(_class2), 'props', this), this[$ctorProps]);
        },
        set: function set(value) {
          setCtorNativeProperty(this, $ctorProps, value);
        }

        // Passing args is designed to work with document-register-element. It's not
        // necessary for the webcomponents/custom-element polyfill.

      }]);

      function _class2() {
        var _ref;

        classCallCheck(this, _class2);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _this = possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args)));

        var constructor = _this.constructor;

        // Used for the ready() function so it knows when it can call its callback.

        _this[$created] = true;

        // TODO refactor to not cater to Safari < 10. This means we can depend on
        // built-in property descriptors.
        // Must be defined on constructor and not from a superclass
        if (!constructor.hasOwnProperty($ctorCreateInitProps)) {
          setCtorNativeProperty(constructor, $ctorCreateInitProps, createInitProps(constructor));
        }

        // Set up a renderer that is debounced for property sets to call directly.
        _this[$rendererDebounced] = debounce(_this[$renderer].bind(_this));

        // Set up property lifecycle.
        var propDefsCount = getPropNamesAndSymbols(getPropsMap(constructor)).length;
        if (propDefsCount && constructor[$ctorCreateInitProps]) {
          constructor[$ctorCreateInitProps](_this);
        }

        // DEPRECATED
        //
        // static render()
        // Note that renderCallback is an optional method!
        if (!_this.renderCallback && constructor.render) {
          DEBUG && deprecated(_this, 'static render', 'renderCallback');
          _this.renderCallback = constructor.render.bind(constructor, _this);
        }

        // DEPRECATED
        //
        // static created()
        //
        // Props should be set up before calling this.
        var created = constructor.created;

        if (isFunction(created)) {
          DEBUG && deprecated(_this, 'static created', 'constructor');
          created(_this);
        }

        // DEPRECATED
        //
        // Feature has rarely been used.
        //
        // Created should be set before invoking the ready listeners.
        var elemData = data(_this);
        var readyCallbacks = elemData.readyCallbacks;
        if (readyCallbacks) {
          readyCallbacks.forEach(function (cb) {
            return cb(_this);
          });
          delete elemData.readyCallbacks;
        }
        return _this;
      }

      // Custom Elements v1


      createClass(_class2, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
          // Reflect attributes pending values
          getAttrMgr(this).resumeAttributesUpdates();

          // Used to check whether or not the component can render.
          this[$connected] = true;

          // Render!
          this[$rendererDebounced]();

          // DEPRECATED
          //
          // static attached()
          var attached = this.constructor.attached;

          if (isFunction(attached)) {
            DEBUG && deprecated(this, 'static attached', 'connectedCallback');
            attached(this);
          }

          // DEPRECATED
          //
          // We can remove this once all browsers support :defined.
          this.setAttribute('defined', '');
        }

        // Custom Elements v1

      }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
          // Suspend updating attributes until re-connected
          getAttrMgr(this).suspendAttributesUpdates();

          // Ensures the component can't be rendered while disconnected.
          this[$connected] = false;

          // DEPRECATED
          //
          // static detached()
          var detached = this.constructor.detached;

          if (isFunction(detached)) {
            DEBUG && deprecated(this, 'static detached', 'disconnectedCallback');
            detached(this);
          }
        }

        // Custom Elements v1

      }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, oldValue, newValue) {
          // Polyfill calls this twice.
          if (preventDoubleCalling(this, name, oldValue, newValue)) {
            return;
          }

          // Set data so we can prevent double calling if the polyfill.
          this[_prevName] = name;
          this[_prevOldValue] = oldValue;
          this[_prevNewValue] = newValue;

          var propNameOrSymbol = data(this, 'attrSourceLinks')[name];
          if (propNameOrSymbol) {
            var changedExternally = getAttrMgr(this).onAttributeChanged(name, newValue);
            if (changedExternally) {
              // Sync up the property.
              var propDef = getPropsMap(this.constructor)[propNameOrSymbol];
              var newPropVal = newValue !== null && propDef.deserialize ? propDef.deserialize(newValue) : newValue;

              var propData = data(this, 'props')[propNameOrSymbol];
              propData.settingPropFromAttrSource = true;
              this[propNameOrSymbol] = newPropVal;
              propData.settingPropFromAttrSource = false;
            }
          }

          // DEPRECATED
          //
          // static attributeChanged()
          var attributeChanged = this.constructor.attributeChanged;

          if (isFunction(attributeChanged)) {
            DEBUG && deprecated(this, 'static attributeChanged', 'attributeChangedCallback');
            attributeChanged(this, { name: name, newValue: newValue, oldValue: oldValue });
          }
        }

        // Skate

      }, {
        key: 'updatedCallback',
        value: function updatedCallback(prevProps) {
          if (this.constructor.hasOwnProperty('updated')) {
            DEBUG && deprecated(this, 'static updated', 'updatedCallback');
          }
          return this.constructor.updated(this, prevProps);
        }

        // Skate

      }, {
        key: 'renderedCallback',
        value: function renderedCallback() {
          if (this.constructor.hasOwnProperty('rendered')) {
            DEBUG && deprecated(this, 'static rendered', 'renderedCallback');
          }
          return this.constructor.rendered(this);
        }

        // Skate
        //
        // Maps to the static renderer() callback. That logic should be moved here
        // when that is finally removed.
        // TODO: finalize how to support different rendering strategies.

      }, {
        key: 'rendererCallback',
        value: function rendererCallback() {
          // TODO: cannot move code here because tests expects renderer function to still exist on constructor!
          return this.constructor.renderer(this);
        }

        // Skate
        // @internal
        // Invokes the complete render lifecycle.

      }, {
        key: $renderer,
        value: function value() {
          if (this[$rendering] || !this[$connected]) {
            return;
          }

          // Flag as rendering. This prevents anything from trying to render - or
          // queueing a render - while there is a pending render.
          this[$rendering] = true;
          if (this[$updated]() && isFunction(this.renderCallback)) {
            this.rendererCallback();
            this.renderedCallback();
          }

          this[$rendering] = false;
        }

        // Skate
        // @internal
        // Calls the updatedCallback() with previous props.

      }, {
        key: $updated,
        value: function value() {
          var prevProps = this[$props];
          this[$props] = props(this);
          return this.updatedCallback(prevProps);
        }

        // Skate

      }], [{
        key: 'extend',
        value: function extend() {
          var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var Base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

          // Create class for the user.
          var Ctor = function (_Base) {
            inherits(Ctor, _Base);

            function Ctor() {
              classCallCheck(this, Ctor);
              return possibleConstructorReturn(this, (Ctor.__proto__ || Object.getPrototypeOf(Ctor)).apply(this, arguments));
            }

            return Ctor;
          }(Base);

          // For inheriting from the object literal.


          var opts = getOwnPropertyDescriptors(definition);
          var prot = getOwnPropertyDescriptors(definition.prototype);

          // Prototype is non configurable (but is writable).
          delete opts.prototype;

          // Pass on static and instance members from the definition.
          Object.defineProperties(Ctor, opts);
          Object.defineProperties(Ctor.prototype, prot);

          return Ctor;
        }

        // Skate
        //
        // DEPRECATED
        //
        // Stubbed in case any subclasses are calling it.

      }, {
        key: 'rendered',
        value: function rendered() {}

        // Skate
        //
        // DEPRECATED
        //
        // Move this to rendererCallback() before removing.

      }, {
        key: 'renderer',
        value: function renderer(elem) {
          if (!elem.shadowRoot) {
            elem.attachShadow({ mode: 'open' });
          }
          patchInner(elem.shadowRoot, function () {
            var possibleFn = elem.renderCallback(elem);
            if (isFunction(possibleFn)) {
              possibleFn();
            } else if (Array.isArray(possibleFn)) {
              possibleFn.forEach(function (fn) {
                if (isFunction(fn)) {
                  fn();
                }
              });
            }
          });
        }

        // Skate
        //
        // DEPRECATED
        //
        // Move this to updatedCallback() before removing.

      }, {
        key: 'updated',
        value: function updated(elem, previousProps) {
          // The 'previousProps' will be undefined if it is the initial render.
          if (!previousProps) {
            return true;
          }

          // The 'previousProps' will always contain all of the keys.
          //
          // Use classic loop because:
          // 'for ... in' skips symbols and 'for ... of' is not working yet with IE!?
          // for (let nameOrSymbol of getPropNamesAndSymbols(previousProps)) {
          var namesAndSymbols = getPropNamesAndSymbols(previousProps);
          for (var i = 0; i < namesAndSymbols.length; i++) {
            var nameOrSymbol = namesAndSymbols[i];

            // With Object.is NaN is equal to NaN
            if (!objectIs(previousProps[nameOrSymbol], elem[nameOrSymbol])) {
              return true;
            }
          }

          return false;
        }
      }]);
      return _class2;
    }(HTMLElement$2);

    var Event$1 = function (TheEvent) {
      if (TheEvent) {
        try {
          new TheEvent('emit-init'); // eslint-disable-line no-new
        } catch (e) {
          return undefined;
        }
      }
      return TheEvent;
    }(root.Event);

    var h = builder();

    var pi = Math.PI;
    var tau = 2 * pi;
    var epsilon = 1e-6;
    var tauEpsilon = tau - epsilon;
    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path();
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function moveTo(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function closePath() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function lineTo(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
        this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
        this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function arcTo(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon)) {}

          // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
          // Equivalently, is (x1,y1) coincident with (x2,y2)?
          // Or, is the radius zero? Line to (x1,y1).
          else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
              this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
            }

            // Otherwise, draw an arc!
            else {
                var x20 = x2 - x0,
                    y20 = y2 - y0,
                    l21_2 = x21 * x21 + y21 * y21,
                    l20_2 = x20 * x20 + y20 * y20,
                    l21 = Math.sqrt(l21_2),
                    l01 = Math.sqrt(l01_2),
                    l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                    t01 = l / l01,
                    t21 = l / l21;

                // If the start tangent is not coincident with (x0,y0), line to.
                if (Math.abs(t01 - 1) > epsilon) {
                  this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
                }

                this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
              }
      },
      arc: function arc(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
            this._ += "L" + x0 + "," + y0;
          }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Otherwise, draw an arc!
        else {
            if (da < 0) da = da % tau + tau;
            this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
          }
      },
      rect: function rect(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
      },
      toString: function toString() {
        return this._;
      }
    };

    function constant$1 (x) {
      return function constant() {
        return x;
      };
    }

    var epsilon$1 = 1e-12;
    var pi$1 = Math.PI;
    var halfPi = pi$1 / 2;
    var tau$1 = 2 * pi$1;

    function arcInnerRadius(d) {
      return d.innerRadius;
    }

    function arcOuterRadius(d) {
      return d.outerRadius;
    }

    function arcStartAngle(d) {
      return d.startAngle;
    }

    function arcEndAngle(d) {
      return d.endAngle;
    }

    function arcPadAngle(d) {
      return d && d.padAngle; // Note: optional!
    }

    function asin(x) {
      return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
    }

    function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
      var x10 = x1 - x0,
          y10 = y1 - y0,
          x32 = x3 - x2,
          y32 = y3 - y2,
          t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
      return [x0 + t * x10, y0 + t * y10];
    }

    // Compute perpendicular offset line of length rc.
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
      var x01 = x0 - x1,
          y01 = y0 - y1,
          lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
          ox = lo * y01,
          oy = -lo * x01,
          x11 = x0 + ox,
          y11 = y0 + oy,
          x10 = x1 + ox,
          y10 = y1 + oy,
          x00 = (x11 + x10) / 2,
          y00 = (y11 + y10) / 2,
          dx = x10 - x11,
          dy = y10 - y11,
          d2 = dx * dx + dy * dy,
          r = r1 - rc,
          D = x11 * y10 - x10 * y11,
          d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
          cx0 = (D * dy - dx * d) / d2,
          cy0 = (-D * dx - dy * d) / d2,
          cx1 = (D * dy + dx * d) / d2,
          cy1 = (-D * dx + dy * d) / d2,
          dx0 = cx0 - x00,
          dy0 = cy0 - y00,
          dx1 = cx1 - x00,
          dy1 = cy1 - y00;

      // Pick the closer of the two intersection points.
      // TODO Is there a faster way to determine which intersection to use?
      if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

      return {
        cx: cx0,
        cy: cy0,
        x01: -ox,
        y01: -oy,
        x11: cx0 * (r1 / r - 1),
        y11: cy0 * (r1 / r - 1)
      };
    }

    function arc () {
      var innerRadius = arcInnerRadius,
          outerRadius = arcOuterRadius,
          cornerRadius = constant$1(0),
          padRadius = null,
          startAngle = arcStartAngle,
          endAngle = arcEndAngle,
          padAngle = arcPadAngle,
          context = null;

      function arc() {
        var buffer,
            r,
            r0 = +innerRadius.apply(this, arguments),
            r1 = +outerRadius.apply(this, arguments),
            a0 = startAngle.apply(this, arguments) - halfPi,
            a1 = endAngle.apply(this, arguments) - halfPi,
            da = Math.abs(a1 - a0),
            cw = a1 > a0;

        if (!context) context = buffer = path();

        // Ensure that the outer radius is always larger than the inner radius.
        if (r1 < r0) r = r1, r1 = r0, r0 = r;

        // Is it a point?
        if (!(r1 > epsilon$1)) context.moveTo(0, 0);

        // Or is it a circle or annulus?
        else if (da > tau$1 - epsilon$1) {
            context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
            context.arc(0, 0, r1, a0, a1, !cw);
            if (r0 > epsilon$1) {
              context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
              context.arc(0, 0, r0, a1, a0, cw);
            }
          }

          // Or is it a circular or annular sector?
          else {
              var a01 = a0,
                  a11 = a1,
                  a00 = a0,
                  a10 = a1,
                  da0 = da,
                  da1 = da,
                  ap = padAngle.apply(this, arguments) / 2,
                  rp = ap > epsilon$1 && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
                  rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
                  rc0 = rc,
                  rc1 = rc,
                  t0,
                  t1;

              // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
              if (rp > epsilon$1) {
                var p0 = asin(rp / r0 * Math.sin(ap)),
                    p1 = asin(rp / r1 * Math.sin(ap));
                if ((da0 -= p0 * 2) > epsilon$1) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
                if ((da1 -= p1 * 2) > epsilon$1) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
              }

              var x01 = r1 * Math.cos(a01),
                  y01 = r1 * Math.sin(a01),
                  x10 = r0 * Math.cos(a10),
                  y10 = r0 * Math.sin(a10);

              // Apply rounded corners?
              if (rc > epsilon$1) {
                var x11 = r1 * Math.cos(a11),
                    y11 = r1 * Math.sin(a11),
                    x00 = r0 * Math.cos(a00),
                    y00 = r0 * Math.sin(a00);

                // Restrict the corner radius according to the sector angle.
                if (da < pi$1) {
                  var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                      ax = x01 - oc[0],
                      ay = y01 - oc[1],
                      bx = x11 - oc[0],
                      by = y11 - oc[1],
                      kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                      lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
                  rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
                  rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
                }
              }

              // Is the sector collapsed to a line?
              if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

              // Does the sector’s outer ring have rounded corners?
              else if (rc1 > epsilon$1) {
                  t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
                  t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

                  context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

                  // Have the corners merged?
                  if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

                  // Otherwise, draw the two corners and the ring.
                  else {
                      context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                      context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                      context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                }

                // Or is the outer ring just a circular arc?
                else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

              // Is there no inner ring, and it’s a circular sector?
              // Or perhaps it’s an annular sector collapsed due to padding?
              if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

              // Does the sector’s inner ring (or point) have rounded corners?
              else if (rc0 > epsilon$1) {
                  t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
                  t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

                  context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

                  // Have the corners merged?
                  if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

                  // Otherwise, draw the two corners and the ring.
                  else {
                      context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                      context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                      context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                }

                // Or is the inner ring just a circular arc?
                else context.arc(0, 0, r0, a10, a00, cw);
            }

        context.closePath();

        if (buffer) return context = null, buffer + "" || null;
      }

      arc.centroid = function () {
        var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
            a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
        return [Math.cos(a) * r, Math.sin(a) * r];
      };

      arc.innerRadius = function (_) {
        return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : innerRadius;
      };

      arc.outerRadius = function (_) {
        return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : outerRadius;
      };

      arc.cornerRadius = function (_) {
        return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : cornerRadius;
      };

      arc.padRadius = function (_) {
        return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), arc) : padRadius;
      };

      arc.startAngle = function (_) {
        return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : startAngle;
      };

      arc.endAngle = function (_) {
        return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : endAngle;
      };

      arc.padAngle = function (_) {
        return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : padAngle;
      };

      arc.context = function (_) {
        return arguments.length ? (context = _ == null ? null : _, arc) : context;
      };

      return arc;
    }

    function descending (a, b) {
      return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }

    function identity (d) {
      return d;
    }

    function pie () {
      var value = identity,
          sortValues = descending,
          sort = null,
          startAngle = constant$1(0),
          endAngle = constant$1(tau$1),
          padAngle = constant$1(0);

      function pie(data) {
        var i,
            n = data.length,
            j,
            k,
            sum = 0,
            index = new Array(n),
            arcs = new Array(n),
            a0 = +startAngle.apply(this, arguments),
            da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
            a1,
            p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
            pa = p * (da < 0 ? -1 : 1),
            v;

        for (i = 0; i < n; ++i) {
          if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
            sum += v;
          }
        }

        // Optionally sort the arcs by previously-computed values or by data.
        if (sortValues != null) index.sort(function (i, j) {
          return sortValues(arcs[i], arcs[j]);
        });else if (sort != null) index.sort(function (i, j) {
          return sort(data[i], data[j]);
        });

        // Compute the arcs! They are stored in the original data's order.
        for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
          j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
            data: data[j],
            index: i,
            value: v,
            startAngle: a0,
            endAngle: a1,
            padAngle: p
          };
        }

        return arcs;
      }

      pie.value = function (_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant$1(+_), pie) : value;
      };

      pie.sortValues = function (_) {
        return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
      };

      pie.sort = function (_) {
        return arguments.length ? (sort = _, sortValues = null, pie) : sort;
      };

      pie.startAngle = function (_) {
        return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : startAngle;
      };

      pie.endAngle = function (_) {
        return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : endAngle;
      };

      pie.padAngle = function (_) {
        return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), pie) : padAngle;
      };

      return pie;
    }

    var kr = Math.sin(pi$1 / 10) / Math.sin(7 * pi$1 / 10);
    var kx = Math.sin(tau$1 / 10) * kr;
    var ky = -Math.cos(tau$1 / 10) * kr;

    function noop$1 () {}

    function _point(that, x, y) {
      that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
    }

    function Basis(context) {
      this._context = context;
    }

    Basis.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._y0 = this._y1 = NaN;
        this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 3:
            _point(this, this._x1, this._y1); // proceed
          case 2:
            this._context.lineTo(this._x1, this._y1);break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0:
            this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
          case 1:
            this._point = 2;break;
          case 2:
            this._point = 3;this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
          default:
            _point(this, x, y);break;
        }
        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
      }
    };

    function Bundle(context, beta) {
      this._basis = new Basis(context);
      this._beta = beta;
    }

    Bundle.prototype = {
      lineStart: function lineStart() {
        this._x = [];
        this._y = [];
        this._basis.lineStart();
      },
      lineEnd: function lineEnd() {
        var x = this._x,
            y = this._y,
            j = x.length - 1;

        if (j > 0) {
          var x0 = x[0],
              y0 = y[0],
              dx = x[j] - x0,
              dy = y[j] - y0,
              i = -1,
              t;

          while (++i <= j) {
            t = i / j;
            this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
          }
        }

        this._x = this._y = null;
        this._basis.lineEnd();
      },
      point: function point(x, y) {
        this._x.push(+x);
        this._y.push(+y);
      }
    };

    (function custom(beta) {

      function bundle(context) {
        return beta === 1 ? new Basis(context) : new Bundle(context, beta);
      }

      bundle.beta = function (beta) {
        return custom(+beta);
      };

      return bundle;
    })(0.85);

    function _point$1(that, x, y) {
      that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
    }

    function Cardinal(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    Cardinal.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x2, this._y2);break;
          case 3:
            _point$1(this, this._x1, this._y1);break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0:
            this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
          case 1:
            this._point = 2;this._x1 = x, this._y1 = y;break;
          case 2:
            this._point = 3; // proceed
          default:
            _point$1(this, x, y);break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(tension) {

      function cardinal(context) {
        return new Cardinal(context, tension);
      }

      cardinal.tension = function (tension) {
        return custom(+tension);
      };

      return cardinal;
    })(0);

    function CardinalClosed(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    CardinalClosed.prototype = {
      areaStart: noop$1,
      areaEnd: noop$1,
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 1:
            {
              this._context.moveTo(this._x3, this._y3);
              this._context.closePath();
              break;
            }
          case 2:
            {
              this._context.lineTo(this._x3, this._y3);
              this._context.closePath();
              break;
            }
          case 3:
            {
              this.point(this._x3, this._y3);
              this.point(this._x4, this._y4);
              this.point(this._x5, this._y5);
              break;
            }
        }
      },
      point: function point(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0:
            this._point = 1;this._x3 = x, this._y3 = y;break;
          case 1:
            this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
          case 2:
            this._point = 3;this._x5 = x, this._y5 = y;break;
          default:
            _point$1(this, x, y);break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(tension) {

      function cardinal(context) {
        return new CardinalClosed(context, tension);
      }

      cardinal.tension = function (tension) {
        return custom(+tension);
      };

      return cardinal;
    })(0);

    function CardinalOpen(context, tension) {
      this._context = context;
      this._k = (1 - tension) / 6;
    }

    CardinalOpen.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._point = 0;
      },
      lineEnd: function lineEnd() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0:
            this._point = 1;break;
          case 1:
            this._point = 2;break;
          case 2:
            this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
          case 3:
            this._point = 4; // proceed
          default:
            _point$1(this, x, y);break;
        }
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(tension) {

      function cardinal(context) {
        return new CardinalOpen(context, tension);
      }

      cardinal.tension = function (tension) {
        return custom(+tension);
      };

      return cardinal;
    })(0);

    function _point$2(that, x, y) {
      var x1 = that._x1,
          y1 = that._y1,
          x2 = that._x2,
          y2 = that._y2;

      if (that._l01_a > epsilon$1) {
        var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
            n = 3 * that._l01_a * (that._l01_a + that._l12_a);
        x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
        y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
      }

      if (that._l23_a > epsilon$1) {
        var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
            m = 3 * that._l23_a * (that._l23_a + that._l12_a);
        x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
        y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
      }

      that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
    }

    function CatmullRom(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRom.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x2, this._y2);break;
          case 3:
            this.point(this._x2, this._y2);break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0:
            this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
          case 1:
            this._point = 2;break;
          case 2:
            this._point = 3; // proceed
          default:
            _point$2(this, x, y);break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
      }

      catmullRom.alpha = function (alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    })(0.5);

    function CatmullRomClosed(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRomClosed.prototype = {
      areaStart: noop$1,
      areaEnd: noop$1,
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 1:
            {
              this._context.moveTo(this._x3, this._y3);
              this._context.closePath();
              break;
            }
          case 2:
            {
              this._context.lineTo(this._x3, this._y3);
              this._context.closePath();
              break;
            }
          case 3:
            {
              this.point(this._x3, this._y3);
              this.point(this._x4, this._y4);
              this.point(this._x5, this._y5);
              break;
            }
        }
      },
      point: function point(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0:
            this._point = 1;this._x3 = x, this._y3 = y;break;
          case 1:
            this._point = 2;this._context.moveTo(this._x4 = x, this._y4 = y);break;
          case 2:
            this._point = 3;this._x5 = x, this._y5 = y;break;
          default:
            _point$2(this, x, y);break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
      }

      catmullRom.alpha = function (alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    })(0.5);

    function CatmullRomOpen(context, alpha) {
      this._context = context;
      this._alpha = alpha;
    }

    CatmullRomOpen.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
        this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
      },
      lineEnd: function lineEnd() {
        if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        x = +x, y = +y;

        if (this._point) {
          var x23 = this._x2 - x,
              y23 = this._y2 - y;
          this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
        }

        switch (this._point) {
          case 0:
            this._point = 1;break;
          case 1:
            this._point = 2;break;
          case 2:
            this._point = 3;this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);break;
          case 3:
            this._point = 4; // proceed
          default:
            _point$2(this, x, y);break;
        }

        this._l01_a = this._l12_a, this._l12_a = this._l23_a;
        this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
        this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
        this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
      }
    };

    (function custom(alpha) {

      function catmullRom(context) {
        return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
      }

      catmullRom.alpha = function (alpha) {
        return custom(+alpha);
      };

      return catmullRom;
    })(0.5);

    function sign$2(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign$2(s0) + sign$2(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function _point$3(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function areaStart() {
        this._line = 0;
      },
      areaEnd: function areaEnd() {
        this._line = NaN;
      },
      lineStart: function lineStart() {
        this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function lineEnd() {
        switch (this._point) {
          case 2:
            this._context.lineTo(this._x1, this._y1);break;
          case 3:
            _point$3(this, this._t0, slope2(this, this._t0));break;
        }
        if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function point(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0:
            this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
          case 1:
            this._point = 2;break;
          case 2:
            this._point = 3;_point$3(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
          default:
            _point$3(this, this._t0, t1 = slope3(this, x, y));break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    function MonotoneY(context) {
      this._context = new ReflectContext(context);
    }

    (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    function ReflectContext(context) {
      this._context = context;
    }

    ReflectContext.prototype = {
      moveTo: function moveTo(x, y) {
        this._context.moveTo(y, x);
      },
      closePath: function closePath() {
        this._context.closePath();
      },
      lineTo: function lineTo(x, y) {
        this._context.lineTo(y, x);
      },
      bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
        this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
      }
    };

    var Pentatonic = [2, 4, 7, 9, 11];

    function constant(x) {
      return function constant() {
        return x;
      };
    }

    var keyLayout = function keyLayout() {
      var pieStyle = false;
      var octaves = 1;
      var octaveSize = 12;
      var raisedPattern = Pentatonic;
      var isRaised = void 0;
      var startAngle = constant(-Math.PI);
      var endAngle = constant(Math.PI);
      var frequency = void 0;
      //
      function keyLayout(notes) {
        if (!notes) {
          for (var i = 0, notes = []; i < octaveSize; i++) {
            notes.push(i + 1);
          }
        }
        if (!isRaised) {
          isRaised = function isRaised(k) {
            return raisedPattern.includes(k);
          };
        }
        if (!frequency) {
          frequency = function frequency(k) {
            return 440 * Math.pow(2, (k - 9) / notes.length);
          };
        }

        var raisedPatternOctaves = Math.ceil(Math.max.apply(Math, raisedPattern) / notes.length);
        var allKeys = [],
            raisedKeys = [],
            lowerKeys = [];
        var lowerCount = 0;
        var k = void 0,
            l = void 0;
        for (k = 0; k < notes.length * octaves; k++) {
          if (!isRaised((k + 1) % (raisedPatternOctaves * notes.length))) {
            lowerCount++;
          }
        }

        if (pieStyle) {
          for (k = 0; k < notes.length * octaves; k++) {
            allKeys.push(k + 1);
          }

          allKeys = pie().startAngle(startAngle).endAngle(endAngle).sort(function (a, b) {
            return a - b;
          }).value(1)(allKeys);
        }

        for (k = 0, l = 0; k < notes.length * octaves; k++) {
          var diffAngle = (endAngle(k) - startAngle(k)) / lowerCount;

          var key = pieStyle ? allKeys[k] : {};

          key.note = notes[k % notes.length];
          key.index = k + 1;
          key.frequency = frequency(k + 1);

          if (isRaised(key.index % (raisedPatternOctaves * notes.length))) {
            if (!pieStyle) {
              key.startAngle = startAngle(k) + diffAngle * (l - .5 + 0.15);
              key.endAngle = startAngle(k) + diffAngle * (l + 0.5 - 0.15);
            }
            key.raised = true;
            raisedKeys.push(key);
          } else {
            if (!pieStyle) {
              key.startAngle = startAngle(k) + l * diffAngle;
              key.endAngle = key.startAngle + diffAngle;
            }
            key.raised = false;
            lowerKeys.push(key);
            l++;
          }
        }
        allKeys = lowerKeys.concat(raisedKeys);
        return allKeys;
      }

      // for (var i = 0, n = numTones*octaves; i < n; ++i) {
      //   keys[i].frequency = 440 * Math.pow(2, (i - 9) / numTones); // 0 is middle C
      // }


      //  let isRaised = k => raisedPattern.includes(k);
      keyLayout.isRaised = function (_) {
        if (arguments.length) {
          isRaised = typeof _ === "function" ? _ : constant(_);
        }
        return keyLayout;
      };

      // let raisedPattern = Pentatonic;
      keyLayout.raisedPattern = function (_) {
        if (_ && _.length) {
          raisedPattern = _;
        }
        return keyLayout;
      };

      //  let octaves = 1;
      keyLayout.octaves = function (_) {
        if (typeof _ === "number") {
          octaves = _;
        }
        return keyLayout;
      };

      // let startAngle = constant(-Math.PI);
      keyLayout.startAngle = function (_) {
        if (arguments.length) {
          startAngle = typeof _ === "function" ? _ : constant(_);
        }
        return keyLayout;
      };

      // let frequency;
      keyLayout.frequency = function (_) {
        if (arguments.length) {
          frequency = typeof _ === "function" ? _ : constant(_);
        }
        return keyLayout;
      };

      // let endAngle = constant(Math.PI);
      keyLayout.endAngle = function (_) {
        if (arguments.length) {
          endAngle = typeof _ === "function" ? _ : constant(_);
        }
        return keyLayout;
      };

      keyLayout.octaveSize = function (_) {
        if (typeof _ === "number") {
          octaveSize = _;
        }
        return keyLayout;
      };

      keyLayout.pie = function (_) {
        if (typeof _ === "boolean") {
          pieStyle = _;
        }
        return keyLayout;
      };

      return keyLayout;
    };

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace (name) {
      var prefix = name += "",
          i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
    }

    function creatorInherit(name) {
      return function () {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function () {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator (name) {
      var fullname = namespace(name);
      return (fullname.local ? creatorFixed : creatorInherit)(fullname);
    }

    var matcher = function matcher(selector) {
      return function () {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!element$1.matches) {
        var vendorMatches = element$1.webkitMatchesSelector || element$1.msMatchesSelector || element$1.mozMatchesSelector || element$1.oMatchesSelector;
        matcher = function matcher(selector) {
          return function () {
            return vendorMatches.call(this, selector);
          };
        };
      }
    }

    var matcher$1 = matcher;

    var filterEvents = {};

    var event = null;

    if (typeof document !== "undefined") {
      var element$2 = document.documentElement;
      if (!("onmouseenter" in element$2)) {
        filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function (event) {
        var related = event.relatedTarget;
        if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function (event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
          event = event0;
        }
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function (t) {
        var name = "",
            i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return { type: t, name: name };
      });
    }

    function onRemove(typename) {
      return function () {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function (d, i, group) {
        var on = this.__on,
            o,
            listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
        if (!on) this.__on = [o];else on.push(o);
      };
    }

    function selection_on (typename, value, capture) {
      var typenames = parseTypenames(typename + ""),
          i,
          n = typenames.length,
          t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) {
        this.each(on(typenames[i], value, capture));
      }return this;
    }

    function none$2() {}

    function selector (selector) {
      return selector == null ? none$2 : function () {
        return this.querySelector(selector);
      };
    }

    function selection_select (select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty$1() {
      return [];
    }

    function selectorAll (selector) {
      return selector == null ? empty$1 : function () {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll (select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function selection_filter (match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse (update) {
      return new Array(update.length);
    }

    function selection_enter () {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function appendChild(child) {
        return this._parent.insertBefore(child, this._next);
      },
      insertBefore: function insertBefore(child, next) {
        return this._parent.insertBefore(child, next);
      },
      querySelector: function querySelector(selector) {
        return this._parent.querySelector(selector);
      },
      querySelectorAll: function querySelectorAll(selector) {
        return this._parent.querySelectorAll(selector);
      }
    };

    function constant$2 (x) {
      return function () {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
          exit[i] = node;
        }
      }
    }

    function selection_data (value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function (d) {
          data[++j] = d;
        });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$2(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength) {}
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit () {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge (selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order () {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort (compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call () {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes () {
      var nodes = new Array(this.size()),
          i = -1;
      this.each(function () {
        nodes[++i] = this;
      });
      return nodes;
    }

    function selection_node () {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size () {
      var size = 0;
      this.each(function () {
        ++size;
      });
      return size;
    }

    function selection_empty () {
      return !this.node();
    }

    function selection_each (callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function () {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function () {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function () {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function () {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr (name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
      }

      return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
    }

    function window$1 (node) {
        return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
        node.document && node // node is a Window
        || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function () {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function () {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style (name, value, priority) {
      var node;
      return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : window$1(node = this.node()).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function () {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function () {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function () {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];else this[name] = v;
      };
    }

    function selection_property (name, value) {
      return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function add(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function remove(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function contains(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node),
          i = -1,
          n = names.length;
      while (++i < n) {
        list.add(names[i]);
      }
    }

    function classedRemove(node, names) {
      var list = classList(node),
          i = -1,
          n = names.length;
      while (++i < n) {
        list.remove(names[i]);
      }
    }

    function classedTrue(names) {
      return function () {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function () {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function () {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed (name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()),
            i = -1,
            n = names.length;
        while (++i < n) {
          if (!list.contains(names[i])) return false;
        }return true;
      }

      return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function () {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function () {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text (value) {
      return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function () {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function () {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html (value) {
      return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise () {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower () {
      return this.each(lower);
    }

    function selection_append (name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function () {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert (name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function () {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove () {
      return this.each(remove);
    }

    function selection_datum (value) {
        return arguments.length ? this.property("__data__", value) : this.node().__data__;
    }

    function dispatchEvent(node, type, params) {
      var window = window$1(node),
          event = window.CustomEvent;

      if (event) {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function () {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function () {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch (type, params) {
      return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
    }

    var root$1 = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root$1);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select (selector) {
        return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root$1);
    }

    var noop$2 = { value: function value() {} };

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames$1(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function (t) {
        var name = "",
            i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return { type: t, name: name };
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function on(typename, callback) {
        var _ = this._,
            T = parseTypenames$1(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) {
            if ((t = (typename = T[i]).type) && (t = get$3(_[t], typename.name))) return t;
          }return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set$3(_[t], typename.name, callback);else if (callback == null) for (t in _) {
            _[t] = set$3(_[t], typename.name, null);
          }
        }

        return this;
      },
      copy: function copy() {
        var copy = {},
            _ = this._;
        for (var t in _) {
          copy[t] = _[t].slice();
        }return new Dispatch(copy);
      },
      call: function call(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
          args[i] = arguments[i + 2];
        }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
          t[i].value.apply(that, args);
        }
      },
      apply: function apply(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
          t[i].value.apply(that, args);
        }
      }
    };

    function get$3(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set$3(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({ name: name, value: callback });
      return type;
    }

    var frame = 0;
    var timeout = 0;
    var interval = 0;
    var pokeDelay = 1000;
    var taskHead;
    var taskTail;
    var clockLast = 0;
    var clockNow = 0;
    var clockSkew = 0;
    var clock = (typeof performance === "undefined" ? "undefined" : _typeof(performance)) === "object" && performance.now ? performance : Date;
    var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function (f) {
      setTimeout(f, 17);
    };
    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call = this._time = this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function restart(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function stop() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer();
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead,
          e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(),
          delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0,
          t1 = taskHead,
          t2,
          time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout) timeout = clearTimeout(timeout);
      var delay = time - clockNow;
      if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, delay);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clockNow, interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    function timeout$1 (callback, delay, time) {
      var t = new Timer();
      delay = delay == null ? 0 : +delay;
      t.restart(function (elapsed) {
        t.stop();
        callback(elapsed + delay);
      }, delay, time);
      return t;
    }

    var emptyOn = dispatch("start", "end", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule (node, name, id, index, group, timing) {
      var schedules = node.__transition;
      if (!schedules) node.__transition = {};else if (id in schedules) return;
      create$1(node, id, {
        name: name,
        index: index, // For context during callback.
        group: group, // For context during callback.
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
      });
    }

    function init(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
      return schedule;
    }

    function set$2(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
      return schedule;
    }

    function get$2(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
      return schedule;
    }

    function create$1(node, id, self) {
      var schedules = node.__transition,
          tween;

      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      schedules[id] = self;
      self.timer = timer(schedule, 0, self.time);

      function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);

        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
      }

      function start(elapsed) {
        var i, j, n, o;

        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();

        for (i in schedules) {
          o = schedules[i];
          if (o.name !== self.name) continue;

          // While this element already has a starting transition during this frame,
          // defer starting an interrupting transition until that transition has a
          // chance to tick (and possibly end); see d3/d3-transition#54!
          if (o.state === STARTED) return timeout$1(start);

          // Interrupt the active transition, if any.
          // Dispatch the interrupt event.
          if (o.state === RUNNING) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("interrupt", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }

          // Cancel any pre-empted transitions. No interrupt event is dispatched
          // because the cancelled transitions never started. Note that this also
          // removes this transition from the pending list!
          else if (+i < id) {
              o.state = ENDED;
              o.timer.stop();
              delete schedules[i];
            }
        }

        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        timeout$1(function () {
          if (self.state === STARTED) {
            self.state = RUNNING;
            self.timer.restart(tick, self.delay, self.time);
            tick(elapsed);
          }
        });

        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;

        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for (i = 0, j = -1; i < n; ++i) {
          if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
            tween[++j] = o;
          }
        }
        tween.length = j + 1;
      }

      function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
            i = -1,
            n = tween.length;

        while (++i < n) {
          tween[i].call(null, t);
        }

        // Dispatch the end event.
        if (self.state === ENDING) {
          self.on.call("end", node, node.__data__, self.index, self.group);
          stop();
        }
      }

      function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for (var i in schedules) {
          return;
        } // eslint-disable-line no-unused-vars
        delete node.__transition;
      }
    }

    function interrupt (node, name) {
      var schedules = node.__transition,
          schedule,
          active,
          empty = true,
          i;

      if (!schedules) return;

      name = name == null ? null : name + "";

      for (i in schedules) {
        if ((schedule = schedules[i]).name !== name) {
          empty = false;continue;
        }
        active = schedule.state > STARTING && schedule.state < ENDING;
        schedule.state = ENDED;
        schedule.timer.stop();
        if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
      }

      if (empty) delete node.__transition;
    }

    function selection_interrupt (name) {
      return this.each(function () {
        interrupt(this, name);
      });
    }

    function define$2 (constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend$1(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) {
        prototype[key] = definition[key];
      }return prototype;
    }

    function Color() {}

    var _darker = 0.7;
    var _brighter = 1 / _darker;

    var reI = "\\s*([+-]?\\d+)\\s*";
    var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
    var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
    var reHex3 = /^#([0-9a-f]{3})$/;
    var reHex6 = /^#([0-9a-f]{6})$/;
    var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
    var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
    var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
    var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
    var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
    var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define$2(Color, color, {
      displayable: function displayable() {
        return this.rgb().displayable();
      },
      toString: function toString() {
        return this.rgb() + "";
      }
    });

    function color(format) {
      var m;
      format = (format + "").trim().toLowerCase();
      return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb(m >> 8 & 0xf | m >> 4 & 0x0f0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
      ) : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb();
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function colorRgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define$2(Rgb, colorRgb, extend$1(Color, {
      brighter: function brighter(k) {
        k = k == null ? _brighter : Math.pow(_brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function darker(k) {
        k = k == null ? _darker : Math.pow(_darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function rgb() {
        return this;
      },
      displayable: function displayable() {
        return 0 <= this.r && this.r <= 255 && 0 <= this.g && this.g <= 255 && 0 <= this.b && this.b <= 255 && 0 <= this.opacity && this.opacity <= 1;
      },
      toString: function toString() {
        var a = this.opacity;a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl();
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function colorHsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define$2(Hsl, colorHsl, extend$1(Color, {
      brighter: function brighter(k) {
        k = k == null ? _brighter : Math.pow(_brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function darker(k) {
        k = k == null ? _darker : Math.pow(_darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
      },
      displayable: function displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    var Kn = 18;
    var Xn = 0.950470;
    var Yn = 1;
    var Zn = 1.088830;
    var t0 = 4 / 29;
    var t1 = 6 / 29;
    var t2 = 3 * t1 * t1;
    var t3 = t1 * t1 * t1;
    function labConvert(o) {
      if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
      if (o instanceof Hcl) {
        var h = o.h * deg2rad;
        return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
      }
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var b = rgb2xyz(o.r),
          a = rgb2xyz(o.g),
          l = rgb2xyz(o.b),
          x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
          y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
          z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
      return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab(l, a, b, opacity) {
      return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab(l, a, b, opacity) {
      this.l = +l;
      this.a = +a;
      this.b = +b;
      this.opacity = +opacity;
    }

    define$2(Lab, lab, extend$1(Color, {
      brighter: function brighter(k) {
        return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      darker: function darker(k) {
        return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      rgb: function rgb() {
        var y = (this.l + 16) / 116,
            x = isNaN(this.a) ? y : y + this.a / 500,
            z = isNaN(this.b) ? y : y - this.b / 200;
        y = Yn * lab2xyz(y);
        x = Xn * lab2xyz(x);
        z = Zn * lab2xyz(z);
        return new Rgb(xyz2rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z), xyz2rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), this.opacity);
      }
    }));

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
      return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function xyz2rgb(x) {
      return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2xyz(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert(o) {
      if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
      if (!(o instanceof Lab)) o = labConvert(o);
      var h = Math.atan2(o.b, o.a) * rad2deg;
      return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function colorHcl(h, c, l, opacity) {
      return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl(h, c, l, opacity) {
      this.h = +h;
      this.c = +c;
      this.l = +l;
      this.opacity = +opacity;
    }

    define$2(Hcl, colorHcl, extend$1(Color, {
      brighter: function brighter(k) {
        return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
      },
      darker: function darker(k) {
        return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
      },
      rgb: function rgb() {
        return labConvert(this).rgb();
      }
    }));

    var A = -0.14861;
    var B = +1.78277;
    var C = -0.29227;
    var D = -0.90649;
    var E = +1.97294;
    var ED = E * D;
    var EB = E * B;
    var BC_DA = B * C - D * A;
    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
          // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define$2(Cubehelix, cubehelix, extend$1(Color, {
      brighter: function brighter(k) {
        k = k == null ? _brighter : Math.pow(_brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function darker(k) {
        k = k == null ? _darker : Math.pow(_darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function rgb() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
      }
    }));

    function constant$3 (x) {
      return function () {
        return x;
      };
    }

    function linear(a, d) {
      return function (t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
        return Math.pow(a + t * b, y);
      };
    }

    function hue(a, b) {
      var d = b - a;
      return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function (a, b) {
        return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant$3(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function (t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function array$1 (a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(nb),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) {
        x[i] = value(a[i], b[i]);
      }for (; i < nb; ++i) {
        c[i] = b[i];
      }return function (t) {
        for (i = 0; i < na; ++i) {
          c[i] = x[i](t);
        }return c;
      };
    }

    function date (a, b) {
      var d = new Date();
      return a = +a, b -= a, function (t) {
        return d.setTime(a + b * t), d;
      };
    }

    function interpolateNumber (a, b) {
      return a = +a, b -= a, function (t) {
        return a + b * t;
      };
    }

    function object$1 (a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || (typeof a === "undefined" ? "undefined" : _typeof(a)) !== "object") a = {};
      if (b === null || (typeof b === "undefined" ? "undefined" : _typeof(b)) !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = value(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function (t) {
        for (k in i) {
          c[k] = i[k](t);
        }return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
    var reB = new RegExp(reA.source, "g");
    function zero(b) {
      return function () {
        return b;
      };
    }

    function one(b) {
      return function (t) {
        return b(t) + "";
      };
    }

    function interpolateString (a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0,
          // scan index for next number in b
      am,
          // current match in a
      bm,
          // current match in b
      bs,
          // string preceding current number in b, if any
      i = -1,
          // index in s
      s = [],
          // string constants and placeholders
      q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) {
          // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
          // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else {
          // interpolate non-matching numbers
          s[++i] = null;
          q.push({ i: i, x: interpolateNumber(am, bm) });
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
        for (var i = 0, o; i < b; ++i) {
          s[(o = q[i]).i] = o.x(t);
        }return s.join("");
      });
    }

    function value (a, b) {
        var t = typeof b === "undefined" ? "undefined" : _typeof(b),
            c;
        return b == null || t === "boolean" ? constant$3(b) : (t === "number" ? interpolateNumber : t === "string" ? (c = color(b)) ? (b = c, interpolateRgb) : interpolateString : b instanceof color ? interpolateRgb : b instanceof Date ? date : Array.isArray(b) ? array$1 : isNaN(b) ? object$1 : interpolateNumber)(a, b);
    }

    var degrees = 180 / Math.PI;

    var identity$1 = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1
    };

    function decompose (a, b, c, d, e, f) {
      var scaleX, scaleY, skewX;
      if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
      if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
      if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
      if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
      return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
      };
    }

    var cssNode;
    var cssRoot;
    var cssView;
    var svgNode;
    function parseCss$1(value) {
      if (value === "none") return identity$1;
      if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
      cssNode.style.transform = value;
      value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
      cssRoot.removeChild(cssNode);
      value = value.slice(7, -1).split(",");
      return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
    }

    function parseSvg(value) {
      if (value == null) return identity$1;
      if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svgNode.setAttribute("transform", value);
      if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
      value = value.matrix;
      return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

      function pop(s) {
        return s.length ? s.pop() + " " : "";
      }

      function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push("translate(", null, pxComma, null, pxParen);
          q.push({ i: i - 4, x: interpolateNumber(xa, xb) }, { i: i - 2, x: interpolateNumber(ya, yb) });
        } else if (xb || yb) {
          s.push("translate(" + xb + pxComma + yb + pxParen);
        }
      }

      function rotate(a, b, s, q) {
        if (a !== b) {
          if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path
          q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b) });
        } else if (b) {
          s.push(pop(s) + "rotate(" + b + degParen);
        }
      }

      function skewX(a, b, s, q) {
        if (a !== b) {
          q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b) });
        } else if (b) {
          s.push(pop(s) + "skewX(" + b + degParen);
        }
      }

      function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push(pop(s) + "scale(", null, ",", null, ")");
          q.push({ i: i - 4, x: interpolateNumber(xa, xb) }, { i: i - 2, x: interpolateNumber(ya, yb) });
        } else if (xb !== 1 || yb !== 1) {
          s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
      }

      return function (a, b) {
        var s = [],
            // string constants and placeholders
        q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function (t) {
          var i = -1,
              n = q.length,
              o;
          while (++i < n) {
            s[(o = q[i]).i] = o.x(t);
          }return s.join("");
        };
      };
    }

    var interpolateTransform$1 = interpolateTransform(parseCss$1, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

    function cubehelix$1(hue) {
      return function cubehelixGamma(y) {
        y = +y;

        function cubehelix$$(start, end) {
          var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
              s = nogamma(start.s, end.s),
              l = nogamma(start.l, end.l),
              opacity = nogamma(start.opacity, end.opacity);
          return function (t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(Math.pow(t, y));
            start.opacity = opacity(t);
            return start + "";
          };
        }

        cubehelix$$.gamma = cubehelixGamma;

        return cubehelix$$;
      }(1);
    }

    cubehelix$1(hue);
    var cubehelixLong = cubehelix$1(nogamma);

    function tweenRemove(id, name) {
      var tween0, tween1;
      return function () {
        var schedule = set$2(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = tween0 = tween;
          for (var i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1 = tween1.slice();
              tween1.splice(i, 1);
              break;
            }
          }
        }

        schedule.tween = tween1;
      };
    }

    function tweenFunction(id, name, value) {
      var tween0, tween1;
      if (typeof value !== "function") throw new Error();
      return function () {
        var schedule = set$2(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = (tween0 = tween).slice();
          for (var t = { name: name, value: value }, i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1[i] = t;
              break;
            }
          }
          if (i === n) tween1.push(t);
        }

        schedule.tween = tween1;
      };
    }

    function transition_tween (name, value) {
      var id = this._id;

      name += "";

      if (arguments.length < 2) {
        var tween = get$2(this.node(), id).tween;
        for (var i = 0, n = tween.length, t; i < n; ++i) {
          if ((t = tween[i]).name === name) {
            return t.value;
          }
        }
        return null;
      }

      return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
      var id = transition._id;

      transition.each(function () {
        var schedule = set$2(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
      });

      return function (node) {
        return get$2(node, id).value[name];
      };
    }

    function interpolate (a, b) {
        var c;
        return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
    }

    function attrRemove$1(name) {
      return function () {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function () {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, interpolate, value1) {
      var value00, interpolate0;
      return function () {
        var value0 = this.getAttribute(name);
        return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
      };
    }

    function attrConstantNS$1(fullname, interpolate, value1) {
      var value00, interpolate0;
      return function () {
        var value0 = this.getAttributeNS(fullname.space, fullname.local);
        return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
      };
    }

    function attrFunction$1(name, interpolate, value) {
      var value00, value10, interpolate0;
      return function () {
        var value0,
            value1 = value(this);
        if (value1 == null) return void this.removeAttribute(name);
        value0 = this.getAttribute(name);
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function attrFunctionNS$1(fullname, interpolate, value) {
      var value00, value10, interpolate0;
      return function () {
        var value0,
            value1 = value(this);
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        value0 = this.getAttributeNS(fullname.space, fullname.local);
        return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function transition_attr (name, value) {
      var fullname = namespace(name),
          i = fullname === "transform" ? interpolateTransformSvg : interpolate;
      return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname) : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
    }

    function attrTweenNS(fullname, value) {
      function tween() {
        var node = this,
            i = value.apply(node, arguments);
        return i && function (t) {
          node.setAttributeNS(fullname.space, fullname.local, i(t));
        };
      }
      tween._value = value;
      return tween;
    }

    function attrTween(name, value) {
      function tween() {
        var node = this,
            i = value.apply(node, arguments);
        return i && function (t) {
          node.setAttribute(name, i(t));
        };
      }
      tween._value = value;
      return tween;
    }

    function transition_attrTween (name, value) {
      var key = "attr." + name;
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error();
      var fullname = namespace(name);
      return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
      return function () {
        init(this, id).delay = +value.apply(this, arguments);
      };
    }

    function delayConstant(id, value) {
      return value = +value, function () {
        init(this, id).delay = value;
      };
    }

    function transition_delay (value) {
      var id = this._id;

      return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : get$2(this.node(), id).delay;
    }

    function durationFunction(id, value) {
      return function () {
        set$2(this, id).duration = +value.apply(this, arguments);
      };
    }

    function durationConstant(id, value) {
      return value = +value, function () {
        set$2(this, id).duration = value;
      };
    }

    function transition_duration (value) {
      var id = this._id;

      return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : get$2(this.node(), id).duration;
    }

    function easeConstant(id, value) {
      if (typeof value !== "function") throw new Error();
      return function () {
        set$2(this, id).ease = value;
      };
    }

    function transition_ease (value) {
      var id = this._id;

      return arguments.length ? this.each(easeConstant(id, value)) : get$2(this.node(), id).ease;
    }

    function transition_filter (match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge (transition) {
      if (transition._id !== this._id) throw new Error();

      for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Transition(merges, this._parents, this._name, this._id);
    }

    function start$1(name) {
      return (name + "").trim().split(/^|\s+/).every(function (t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
      });
    }

    function onFunction(id, name, listener) {
      var on0,
          on1,
          sit = start$1(name) ? init : set$2;
      return function () {
        var schedule = sit(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

        schedule.on = on1;
      };
    }

    function transition_on (name, listener) {
      var id = this._id;

      return arguments.length < 2 ? get$2(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
      return function () {
        var parent = this.parentNode;
        for (var i in this.__transition) {
          if (+i !== id) return;
        }if (parent) parent.removeChild(this);
      };
    }

    function transition_remove () {
      return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select (select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            schedule(subgroup[i], name, id, i, subgroup, get$2(node, id));
          }
        }
      }

      return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll (select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            for (var children = select.call(node, node.__data__, i, group), child, inherit = get$2(node, id), k = 0, l = children.length; k < l; ++k) {
              if (child = children[k]) {
                schedule(child, name, id, k, children, inherit);
              }
            }
            subgroups.push(children);
            parents.push(node);
          }
        }
      }

      return new Transition(subgroups, parents, name, id);
    }

    var Selection$1 = selection.prototype.constructor;

    function transition_selection () {
      return new Selection$1(this._groups, this._parents);
    }

    function styleRemove$1(name, interpolate) {
        var value00, value10, interpolate0;
        return function () {
            var style = window$1(this).getComputedStyle(this, null),
                value0 = style.getPropertyValue(name),
                value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
            return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function styleRemoveEnd(name) {
        return function () {
            this.style.removeProperty(name);
        };
    }

    function styleConstant$1(name, interpolate, value1) {
        var value00, interpolate0;
        return function () {
            var value0 = window$1(this).getComputedStyle(this, null).getPropertyValue(name);
            return value0 === value1 ? null : value0 === value00 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value1);
        };
    }

    function styleFunction$1(name, interpolate, value) {
        var value00, value10, interpolate0;
        return function () {
            var style = window$1(this).getComputedStyle(this, null),
                value0 = style.getPropertyValue(name),
                value1 = value(this);
            if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
            return value0 === value1 ? null : value0 === value00 && value1 === value10 ? interpolate0 : interpolate0 = interpolate(value00 = value0, value10 = value1);
        };
    }

    function transition_style (name, value, priority) {
        var i = (name += "") === "transform" ? interpolateTransform$1 : interpolate;
        return value == null ? this.styleTween(name, styleRemove$1(name, i)).on("end.style." + name, styleRemoveEnd(name)) : this.styleTween(name, typeof value === "function" ? styleFunction$1(name, i, tweenValue(this, "style." + name, value)) : styleConstant$1(name, i, value), priority);
    }

    function styleTween(name, value, priority) {
      function tween() {
        var node = this,
            i = value.apply(node, arguments);
        return i && function (t) {
          node.style.setProperty(name, i(t), priority);
        };
      }
      tween._value = value;
      return tween;
    }

    function transition_styleTween (name, value, priority) {
      var key = "style." + (name += "");
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error();
      return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant$1(value) {
      return function () {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function () {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
      };
    }

    function transition_text (value) {
      return this.tween("text", typeof value === "function" ? textFunction$1(tweenValue(this, "text", value)) : textConstant$1(value == null ? "" : value + ""));
    }

    function transition_transition () {
      var name = this._name,
          id0 = this._id,
          id1 = newId();

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            var inherit = get$2(node, id0);
            schedule(node, name, id1, i, group, {
              time: inherit.time + inherit.delay + inherit.duration,
              delay: 0,
              duration: inherit.duration,
              ease: inherit.ease
            });
          }
        }
      }

      return new Transition(groups, this._parents, name, id1);
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
      this._groups = groups;
      this._parents = parents;
      this._name = name;
      this._id = id;
    }

    function transition(name) {
      return selection().transition(name);
    }

    function newId() {
      return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = transition.prototype = {
      constructor: Transition,
      select: transition_select,
      selectAll: transition_selectAll,
      filter: transition_filter,
      merge: transition_merge,
      selection: transition_selection,
      transition: transition_transition,
      call: selection_prototype.call,
      nodes: selection_prototype.nodes,
      node: selection_prototype.node,
      size: selection_prototype.size,
      empty: selection_prototype.empty,
      each: selection_prototype.each,
      on: transition_on,
      attr: transition_attr,
      attrTween: transition_attrTween,
      style: transition_style,
      styleTween: transition_styleTween,
      text: transition_text,
      remove: transition_remove,
      tween: transition_tween,
      delay: transition_delay,
      duration: transition_duration,
      ease: transition_ease
    };

    function cubicInOut(t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var exponent = 3;

    var polyIn = function custom(e) {
      e = +e;

      function polyIn(t) {
        return Math.pow(t, e);
      }

      polyIn.exponent = custom;

      return polyIn;
    }(exponent);

    var polyOut = function custom(e) {
      e = +e;

      function polyOut(t) {
        return 1 - Math.pow(1 - t, e);
      }

      polyOut.exponent = custom;

      return polyOut;
    }(exponent);

    var polyInOut = function custom(e) {
      e = +e;

      function polyInOut(t) {
        return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
      }

      polyInOut.exponent = custom;

      return polyInOut;
    }(exponent);

    var overshoot = 1.70158;

    var backIn = function custom(s) {
      s = +s;

      function backIn(t) {
        return t * t * ((s + 1) * t - s);
      }

      backIn.overshoot = custom;

      return backIn;
    }(overshoot);

    var backOut = function custom(s) {
      s = +s;

      function backOut(t) {
        return --t * t * ((s + 1) * t + s) + 1;
      }

      backOut.overshoot = custom;

      return backOut;
    }(overshoot);

    var backInOut = function custom(s) {
      s = +s;

      function backInOut(t) {
        return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
      }

      backInOut.overshoot = custom;

      return backInOut;
    }(overshoot);

var     tau$2 = 2 * Math.PI;
    var amplitude = 1;
    var period = 0.3;
    var elasticIn = function custom(a, p) {
      var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

      function elasticIn(t) {
        return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
      }

      elasticIn.amplitude = function (a) {
        return custom(a, p * tau$2);
      };
      elasticIn.period = function (p) {
        return custom(a, p);
      };

      return elasticIn;
    }(amplitude, period);

    var elasticOut = function custom(a, p) {
      var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

      function elasticOut(t) {
        return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
      }

      elasticOut.amplitude = function (a) {
        return custom(a, p * tau$2);
      };
      elasticOut.period = function (p) {
        return custom(a, p);
      };

      return elasticOut;
    }(amplitude, period);

    var elasticInOut = function custom(a, p) {
      var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

      function elasticInOut(t) {
        return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
      }

      elasticInOut.amplitude = function (a) {
        return custom(a, p * tau$2);
      };
      elasticInOut.period = function (p) {
        return custom(a, p);
      };

      return elasticInOut;
    }(amplitude, period);

    var defaultTiming = {
      time: null, // Set on use.
      delay: 0,
      duration: 250,
      ease: cubicInOut
    };

    function inherit(node, id) {
      var timing;
      while (!(timing = node.__transition) || !(timing = timing[id])) {
        if (!(node = node.parentNode)) {
          return defaultTiming.time = now(), defaultTiming;
        }
      }
      return timing;
    }

    function selection_transition (name) {
      var id, timing;

      if (name instanceof Transition) {
        id = name._id, name = name._name;
      } else {
        id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
      }

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            schedule(node, name, id, i, group, timing || inherit(node, id));
          }
        }
      }

      return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    var LILSYNTH = Symbol();

    function setupLilSynth() {
      var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
      if (!AudioContext) return console.error("AudioContext not supported");
      if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
      if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;

      if (!window[LILSYNTH]) {
        window[LILSYNTH] = new AudioContext();
      }
    }

    function soundKey(key, frequency) {
      // console.log(d,i,"hey!!!!");
      var context = window[LILSYNTH];
      var now = context.currentTime,
          oscillator = context.createOscillator(),
          oscillator2 = context.createOscillator(),
          filter = context.createBiquadFilter(),
          gain = context.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = frequency / 2;
      oscillator.connect(filter);
      oscillator2.frequency.value = frequency;
      oscillator2.connect(gain);
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(.1, now + .05);
      gain.gain.linearRampToValueAtTime(0.005, now + 5);
      key.gain = gain;
      filter.frequency.value = frequency;
      filter.type = "bandpass";
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start(0);
      key.oscillator = oscillator;
      setTimeout(function () {
        oscillator.stop();
      }, 10000);
    }

    function dampKey(key) {
      var context = window[LILSYNTH];
      var now = context.currentTime;
      var oscillator = key.oscillator;
      var gain = key.gain;
      if (gain) {
        key.gain.gain.linearRampToValueAtTime(0, now + 0.3);
      }
      if (oscillator) {
        setTimeout(function () {
          oscillator.stop();
        }, 500);
      }
    }

    var KEYBOARD = Symbol();
    var KEYS = Symbol();
    var shadowSVG = Symbol();

    var SVGStrokePadding = 5;

    var css = '\nall-around-keyboard {\n  display: block;\n  padding: 5px;\n}\n:host {\n  display: block;\n  padding: 5px;\n}\n.key {\n  stroke-width: 1.5px;\n}\n\n.key--lower { fill: #fff; stroke: #777; }\n.key--upper { fill: #333; stroke: #000; }\n\n.key--pressed,\n.key--highlight.key--pressed.key--upper,\n.key--highlight.key--pressed.key--lower\n  { fill: deeppink; }\n\n.key--highlight {\n  stroke: rgba(0, 91, 255, 0.73);\n  stroke-width: 5.5px;\n  // fill: url(#diagonalHatch);\n  // stroke-dasharray: 8,2;\n}\n\n.key--highlight.key--lower { fill: rgb(215, 237, 249) }\n.key--highlight.key--upper { fill: #495b96 }\n';

    function setupKeyboard() {
      var _this = this;

      var elem = this; //make sure to bind elem to this function
      var outerRadius = (this.width - SVGStrokePadding * 2) / (2 * Math.sin(Math.min(this.sweep, Math.PI) / 2));
      var chordLength = outerRadius * 2 * Math.sin(this.sweep / 2);
      var innerRadius = outerRadius - this.depth;
      var startAngle = -this.sweep / 2;
      var endAngle = this.sweep / 2;
      // sagitta, long and short
      var height;
      if (this.sweep > Math.PI) {
        height = outerRadius + Math.sqrt(Math.pow(outerRadius, 2) - Math.pow(chordLength / 2, 2));
      } else {
        height = outerRadius - Math.sqrt(Math.pow(outerRadius, 2) - Math.pow(chordLength / 2, 2)) + this.depth * Math.cos(this.sweep / 2);
      }
      height += SVGStrokePadding;
      window.select = select;
      var svg = this[shadowSVG];

      svg.attr("viewBox", "0 0 " + this.width + " " + height);

      var g = svg.select("g").attr("transform", "translate(" + this.width / 2 + "," + (outerRadius + SVGStrokePadding / 2) + ")");

      var drawKeys = arc().cornerRadius(2)
      // .padRadius(function(d) { return d.sharp ? outerRadius : outerRadius - depth; })
      .innerRadius(function (d) {
        return d.raised ? innerRadius + elem.depth / (Math.tan(elem.overlapping * Math.PI / 2) + 2) : innerRadius;
      }).outerRadius(function (d) {
        return d.raised ? outerRadius : outerRadius - elem.depth / (Math.tan(elem.overlapping * Math.PI / 2) + 2);
      });

      // DATA JOIN
      this[KEYS] = keyLayout().octaves(this.octaves).raisedPattern(this.raisedNotes).startAngle(startAngle).endAngle(endAngle).octaveSize(this.notesInOctave).pie(this.pie);

      var kbData = g.selectAll("path").data(this[KEYS]); //,(d)=>d.index);

      // EXIT
      kbData.exit().on(KEYPRESS, null).on(KEYRELEASE, null).on(HOVEROVER, null).on(HOVEROUT, null).remove();

      // ENTER
      var kb = kbData.enter().append("path").attr("d", function (d) {
        var k = drawKeys(d);
        this._current = k;
        return k;
      }).merge(kbData);

      // UPDATE (ANIMATE)
      transition("morph").duration(750);

      function animateKeys(d) {
        var thing = this;
        var i = value(this._current, drawKeys(d));
        return function (t) {
          thing._current = i(t);
          return thing._current;
        };
      }

      kbData.transition("morph").attrTween("d", animateKeys);
      // .each(function(d) { this._current = d; })

      this[KEYBOARD] = kb;
      updateKeyClasses.call(this);

      kb.on(HOVEROVER, function (d) {
        var e = new Event(KEYPRESS);e.index = d.index;
        // console.log(d);
        _this.dispatchEvent(e);
      }).on(HOVEROUT, function (d) {
        var e = new Event(KEYRELEASE);e.index = d.index;
        _this.dispatchEvent(e);
      });

      var kbElem = this;

      kb.on(KEYPRESS, function (d, i) {
        if (kbElem.synth) {
          soundKey(this, d.frequency);
        }
      }).on(KEYRELEASE, function (d, i) {
        if (kbElem.synth) {
          dampKey(this);
        }
      });
    }

    function updateKeyClasses() {
      var _this2 = this;

      this[KEYBOARD].classed("key", true).classed("key--upper", function (d) {
        return d.raised;
      }).classed("key--lower", function (d) {
        return !d.raised;
      }).classed("key--pressed", function (d) {
        return _this2[pressedKeys].has(d.index);
      }).classed("key--highlight", function (d) {
        return _this2[litKeys].has(d.index) || _this2[litNotes].has(d.note);
      });
    }

    var multiEmitter = function multiEmitter(elem, eventName, indexName) {
      return function (Ks) {
        var _ref;

        Ks = (_ref = []).concat.apply(_ref, [Ks]);
        Ks.forEach(function (k) {
          var e = new Event(eventName);e[indexName] = k;
          elem.dispatchEvent(e);
        });
        // let o = {detail:{}};
        // o.detail[indexName] = k
        // emit(elem,eventType,o);
      };
    };

    var KEYPRESS = 'keypress';
    var KEYRELEASE = 'keyrelease';
    var KEYLIGHT = 'keylight';
    var KEYDIM = 'keydim';
    var NOTELIGHT = 'notelight';
    var NOTEDIM = 'notedim';
    var HOVEROVER = "touchstart mouseover";
    var HOVEROUT = "touchend mouseout";

    var pressedKeys = Symbol();
    var litKeys = Symbol();
    var litNotes = Symbol();

    var KeyboardElement = customElements.define('all-around-keyboard', function (_Component) {
      inherits(_class2, _Component);

      function _class2() {
        var _ref2;

        var _temp, _this3, _ret;

        classCallCheck(this, _class2);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this3 = possibleConstructorReturn(this, (_ref2 = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref2, [this].concat(args))), _this3), _this3.keysPress = multiEmitter(_this3, KEYPRESS, 'index'), _this3.keysRelease = multiEmitter(_this3, KEYRELEASE, 'index'), _this3.keysLight = multiEmitter(_this3, KEYLIGHT, 'index'), _this3.keysDim = multiEmitter(_this3, KEYDIM, 'index'), _this3.notesLight = multiEmitter(_this3, NOTELIGHT, 'note'), _this3.notesDim = multiEmitter(_this3, NOTEDIM, 'note'), _temp), possibleConstructorReturn(_this3, _ret);
      }

      createClass(_class2, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
          // Ensure we call the parent.
          get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'connectedCallback', this).call(this);
          setupLilSynth();

          this[pressedKeys] = new Set();
          this[litKeys] = new Set();
          this[litNotes] = new Set();

          this.addEventListener(KEYPRESS, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.index == e.index;
            }).classed("key--pressed", true).dispatch(KEYPRESS);

            this[pressedKeys].add(e.index);
          });

          this.addEventListener(KEYRELEASE, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.index == e.index;
            }).classed("key--pressed", false).dispatch(KEYRELEASE);

            this[pressedKeys].delete(e.index);
          });

          this.addEventListener(KEYLIGHT, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.index == e.index;
            }).classed("key--highlight", true).dispatch(KEYLIGHT);

            this[litKeys].add(e.index);
          });

          this.addEventListener(KEYDIM, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.index == e.index;
            }).classed("key--highlight", false).dispatch(KEYDIM);

            this[litKeys].delete(e.index);
          });

          this.addEventListener(NOTELIGHT, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.note == e.note;
            }).classed("key--highlight", true).dispatch(NOTELIGHT);

            this[litNotes].add(e.note);
          });

          this.addEventListener(NOTEDIM, function (e) {
            this[KEYBOARD].filter(function (d) {
              return d.note == e.note;
            }).classed("key--highlight", false).dispatch(NOTEDIM);

            this[litNotes].delete(e.note);
          });
        }
      }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
          get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'disconnectedCallback', this).call(this);

          // todo: cleanup, cleanup... (everybody do your share!)
          //        ...i.e. clearInterval(this[sym]);
        }
      }, {
        key: 'renderCallback',
        value: function renderCallback() {
          return [h('div'), h('style', css)];
        }
      }, {
        key: 'renderedCallback',
        value: function renderedCallback() {
          if (!this[shadowSVG]) {
            this[shadowSVG] = select(this.shadowRoot.children[0]).append("svg").attr("width", "100%");

            this[shadowSVG].append("g");
          }
          this.shadowRoot.children[0].appendChild(this[shadowSVG].node());

          setupKeyboard.call(this);
        }
      }], [{
        key: 'props',
        get: function get() {
          return {
            notesInOctave: number({ attribute: true, default: 12 }),
            raisedNotes: array({ attribute: true, default: [2, 4, 7, 9, 11] }),
            octaves: number({ attribute: true, default: 2 }),
            sweep: number({ attribute: true, default: 90,
              deserialize: function deserialize(val) {
                return val * Math.PI / 180;
              },
              serialize: function serialize(val) {
                return val * 180 / Math.PI;
              }
            }),
            depth: number({ attribute: true, default: 100 }),
            width: number({ attribute: true, default: 500 }),
            overlapping: number({ attribute: true, default: 0.5 }),
            pie: boolean({ attribute: true, default: false }),
            synth: boolean({ attribute: true, default: false })
          };
        }
      }]);
      return _class2;
    }(_class2));

    exports.KeyboardElement = KeyboardElement;
    exports.keyLayout = keyLayout;
    exports.KEYPRESS = KEYPRESS;
    exports.KEYRELEASE = KEYRELEASE;
    exports.KEYLIGHT = KEYLIGHT;
    exports.KEYDIM = KEYDIM;
    exports.NOTELIGHT = NOTELIGHT;
    exports.NOTEDIM = NOTEDIM;

}((this.window = this.window || {})));