/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _query = __webpack_require__(1);
	
	var _query2 = _interopRequireDefault(_query);
	
	var _fetch = __webpack_require__(7);
	
	var _fetch2 = _interopRequireDefault(_fetch);
	
	var _global = __webpack_require__(14);
	
	var _global2 = _interopRequireDefault(_global);
	
	var _index = __webpack_require__(19);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mpr = _global2.default.mpr;
	
	(0, _fetch2.default)('../lib/marked-plus-renderer/features.md').then(function (res) {
	    return res.text();
	}).then(function (markdownString) {
	    console.log(markdownString);
	    var containerElement = _query2.default.one('#container');
	    console.log(mpr);
	    mpr.render(containerElement, markdownString);
	    var toc = new _index2.default.Toc(containerElement);
	    toc.placeAt(_query2.default.one('#toc'));
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var arrayUtils = __webpack_require__(2);
	var isArrayLike = arrayUtils.isArrayLike;
	var contains = arrayUtils.contains;
	var toArray = arrayUtils.toArray;
	var some = arrayUtils.some;
	var flatten = arrayUtils.flatten;
	
	var checkType = __webpack_require__(3);
	var isString = checkType.isString;
	
	var domUtils = __webpack_require__(5);
	var testDiv = domUtils.testDiv;
	var isDomNode = domUtils.isDomNode;
	
	/*
	 * @author      : 绝云（wensen.lws）
	 * @description : selector
	 * @note        : browser only
	 * @note        : MODERN browsers only
	 */
	
	var doc = document;
	var win = window;
	var nodeTypeStr = 'nodeType';
	var re_quick = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/; // 匹配快速选择器
	var matchesSelector = testDiv.matches || testDiv.webkitMatchesSelector || testDiv.mozMatchesSelector || testDiv.msMatchesSelector || testDiv.oMatchesSelector;
	var hasMatchesSelector = matchesSelector && matchesSelector.call(testDiv, 'div');
	
	function normalizeRoot(root) {
	    if (!root) {
	        return doc;
	    }
	    if (isString(root)) {
	        return query(root)[0];
	    }
	    if (!root[nodeTypeStr] && isArrayLike(root)) {
	        return root[0];
	    }
	    return root;
	}
	function query(selector, optRoot) {
	    /*
	     * description: 选择器
	     */
	    var root = normalizeRoot(optRoot);
	    var match = undefined;
	
	    if (!root || !selector) {
	        return [];
	    }
	    if (selector === win || isDomNode(selector)) {
	        return !optRoot || selector !== win && isDomNode(root) && contains(selector, root) ? [selector] : [];
	    }
	    if (selector.nodeType === 11) {
	        // document fragment
	        return toArray(selector.childNodes);
	    }
	    if (selector && isArrayLike(selector)) {
	        return flatten(selector);
	    }
	
	    // 简单查询使用快速查询方法 {
	    if (isString(selector) && (match = re_quick.exec(selector))) {
	        if (match[1]) {
	            return [root.getElementById(match[1])];
	        } else if (match[2]) {
	            return toArray(root.getElementsByTagName(match[2]));
	        } else if (match[3]) {
	            return toArray(root.getElementsByClassName(match[3]));
	        }
	    }
	    // }
	    if (selector && (selector.document || selector[nodeTypeStr] && selector[nodeTypeStr] === 9)) {
	        return !optRoot ? [selector] : [];
	    }
	    return toArray(root.querySelectorAll(selector));
	}
	function queryOne(selector, optRoot) {
	    return query(selector, optRoot)[0];
	}
	
	function match(element, selector) {
	    /*
	     * @matches selector
	     */
	    if (hasMatchesSelector) {
	        return matchesSelector.call(element, selector);
	    }
	    var parentElem = element.parentNode;
	    var nodes = undefined;
	
	    // if the element is an orphan, and the browser doesn't support matching
	    // orphans, append it to a documentFragment
	    if (!parentElem && !hasMatchesSelector) {
	        parentElem = document.createDocumentFragment();
	        parentElem.appendChild(element);
	    }
	    // from the parent element's context, get all nodes that match the selector
	    nodes = query(selector, parentElem);
	
	    // since support for `matches()` is missing, we need to check to see if
	    // any of the nodes returned by our query match the given element
	    return some(nodes, function (node) {
	        return node === element;
	    });
	}
	
	module.exports = {
	    all: query,
	    one: queryOne,
	    match: match
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(3);
	var numberUtils = __webpack_require__(4);
	
	var isArray = checkType.isArray;
	var AP = Array.prototype;
	var slice = AP.slice;
	
	function isArrayLike(arr) {
	    return (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) === 'object' && numberUtils.isFinite(arr.length);
	}
	function toArray(arr) {
	    return isArrayLike(arr) ? slice.call(arr) : [];
	}
	
	function arrayFromSecondElement(arr) {
	    return slice.call(arr, 1);
	}
	function applyNativeFunction(nativeFunction, target, args) {
	    return nativeFunction.apply(target, arrayFromSecondElement(args));
	}
	
	// index
	var index = function index(up) {
	    return function (arr, searchElement, fromIndex) {
	        var i = undefined;
	        var len = arr.length >>> 0;
	        if (len === 0) {
	            return -1;
	        }
	        if (!fromIndex) {
	            fromIndex = up ? 0 : arr.length;
	        } else if (fromIndex < 0) {
	            fromIndex = Math.max(0, arr.length + fromIndex);
	        }
	        if (up) {
	            for (i = fromIndex; i < arr.length; i++) {
	                if (arr[i] === searchElement) {
	                    return i;
	                }
	            }
	        } else {
	            for (i = fromIndex; i >= 0; i--) {
	                if (arr[i] === searchElement) {
	                    return i;
	                }
	            }
	        }
	        return -1;
	    };
	};
	var indexOf = AP.indexOf ? function (arr) {
	    return applyNativeFunction(AP.indexOf, arr, arguments);
	} : index(true);
	var lastIndexOf = AP.lastIndexOf ? function (arr) {
	    return applyNativeFunction(AP.lastIndexOf, arr, arguments);
	} : index();
	
	// each
	var each = AP.forEach ? function (arr, callback, thisObj) {
	    applyNativeFunction(AP.forEach, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var a = toArray(arr);
	    for (var i = 0; i < a.length; i++) {
	        callback.call(thisObj, a[i], i, arr);
	    }
	};
	
	// every
	var every = AP.every ? function (arr) {
	    return applyNativeFunction(AP.every, arr, arguments);
	} : function (arr, callback, thisObj) {
	    a = toArray(arr);
	    for (var i = 0; i < a.length; i++) {
	        if (!callback.call(thisObj, a[i], i, arr)) {
	            return false;
	        }
	    }
	    return true;
	};
	
	// filter
	var filter = AP.filter ? function (arr) {
	    return applyNativeFunction(AP.filter, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var res = [];
	    each(arr, function (element, key) {
	        if (callback.call(thisObj, element, key, arr)) {
	            res.push(element);
	        }
	    });
	    return res;
	};
	
	// map
	var map = AP.map ? function (arr) {
	    return applyNativeFunction(AP.map, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var res = [];
	    each(arr, function (element, key) {
	        res.push(callback.call(thisObj, element, key, arr));
	    });
	    return res;
	};
	
	// some
	var some = AP.some ? function (arr) {
	    return applyNativeFunction(AP.some, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var i = undefined;
	    for (i = 0; i < arr.length; i++) {
	        if (callback.call(thisObj, arr[i], i, arr)) {
	            return true;
	        }
	    }
	    return false;
	};
	
	// reduce
	var reduce = AP.reduce ? function (arr) {
	    return applyNativeFunction(AP.reduce, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var value = undefined;
	    if (thisObj) {
	        value = thisObj;
	    }
	    for (var i = 0; i < arr.length; i++) {
	        if (value) {
	            value = callback(value, arr[i], i, arr);
	        } else {
	            value = arr[i];
	        }
	    }
	    return value;
	};
	
	// reduceRight
	var reduceRight = AP.reduceRight ? function (arr) {
	    return applyNativeFunction(AP.reduceRight, arr, arguments);
	} : function (arr, callback, thisObj) {
	    var value = undefined;
	    if (thisObj) {
	        value = thisObj;
	    }
	    for (var i = arr.length - 1; i >= 0; i--) {
	        if (value) {
	            value = callback(value, arr[i], i, arr);
	        } else {
	            value = arr[i];
	        }
	    }
	    return value;
	};
	
	// contains
	function contains(arr, value) {
	    return indexOf(toArray(arr), value) > -1;
	}
	
	// uniq
	function uniq(arr) {
	    var resultArr = [];
	    each(arr, function (element) {
	        if (!contains(resultArr, element)) {
	            resultArr.push(element);
	        }
	    });
	    return resultArr;
	}
	
	// flatten
	function flatten(arr) {
	    var a = toArray(arr);
	    var r = [];
	    for (var i = 0, l = a.length; i < l; ++i) {
	        if (isArrayLike(a[i])) {
	            r = r.concat(a[i]);
	        } else {
	            r[r.length] = a[i];
	        }
	    }
	    return r;
	}
	
	var arrayUtils = {
	    contains: contains,
	    each: each,
	    every: every,
	    filter: filter,
	    flatten: flatten,
	    forEach: each,
	    index: index,
	    indexOf: indexOf,
	    isArray: isArray,
	    isArrayLike: isArrayLike,
	    lastIndexOf: lastIndexOf,
	    map: map,
	    reduce: reduce,
	    reduceRight: reduceRight,
	    some: some,
	    toArray: toArray,
	    uniq: uniq,
	    difference: function difference(arr) {
	        var rest = flatten(arrayFromSecondElement(arguments));
	        return filter(arr, function (value) {
	            return !contains(rest, value);
	        });
	    },
	    eachReverse: function eachReverse(arr, callback, thisObj) {
	        var a = toArray(arr);
	        var i = a.length - 1;
	        for (; i > -1; i -= 1) {
	            callback.call(thisObj, a[i], i, arr);
	        }
	    },
	    intersect: function intersect(a, b) {
	        var result = [];
	        each(a, function (value) {
	            if (contains(b, value)) {
	                result.push(value);
	            }
	        });
	        return result;
	    },
	    range: function range() {
	        var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	        var stop = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	        var step = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	
	        var length = Math.max(Math.ceil((stop - start) / step), 0);
	        var range = new Array(length);
	        for (var i = 0; i < length; i++, start += step) {
	            range[i] = start;
	        }
	        return range;
	    },
	    remove: function remove(arr, fromIndex, toIndex) {
	        var rest = undefined;
	        var len = arr.length;
	        if (!numberUtils.isNumber(fromIndex)) {
	            return arr;
	        }
	        rest = arr.slice((toIndex || fromIndex) + 1 || len);
	        arr.length = fromIndex < 0 ? len + fromIndex : fromIndex;
	        return arr.push.apply(arr, rest);
	    },
	    union: function union() {
	        var resultArr = [];
	        var sourceArrs = toArray(arguments);
	        each(sourceArrs, function (arr) {
	            resultArr = resultArr.concat(arr);
	        });
	        return uniq(resultArr);
	    }
	};
	
	module.exports = arrayUtils;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint esnext: true, loopfunc: true */
	
	var toString = ({}).toString;
	var isType = function isType(obj, type) {
	    return toString.call(obj) === '[object ' + type + ']';
	};
	
	var checkType = {
	    isArguments: function isArguments(obj) {
	        return isType(obj, 'Arguments');
	    },
	    isArray: Array.isArray ? Array.isArray : function (obj) {
	        return isType(obj, 'Array');
	    },
	    isArrayLike: function isArrayLike(obj) {
	        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && isFinite(obj.length);
	    },
	    isBoolean: function isBoolean(obj) {
	        return isType(obj, 'Boolean');
	    },
	    isDate: function isDate(obj) {
	        return isType(obj, 'Date');
	    },
	    isError: function isError(obj) {
	        return isType(obj, 'Error');
	    },
	    isFunction: function isFunction(obj) {
	        return isType(obj, 'Function');
	    },
	    isNull: function isNull(obj) {
	        return obj === null;
	    },
	    isNumber: function isNumber(obj) {
	        return isType(obj, 'Number');
	    },
	    isPlainObject: function isPlainObject(obj) {
	        return isType(obj, 'Object');
	    },
	    isRegExp: function isRegExp(obj) {
	        return isType(obj, 'RegExp');
	    },
	    isString: function isString(obj) {
	        return isType(obj, 'String');
	    },
	    isType: isType,
	    isUndefined: function isUndefined(obj) {
	        return obj === undefined;
	    },
	    getType: function getType(obj) {
	        var typeStr = toString.call(obj);
	        return typeStr.replace(/^\[object /, '').replace(/\]$/, '');
	    },
	    isObject: function isObject(obj) {
	        var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
	        return type === 'function' || type === 'object' && !!obj;
	    }
	};
	
	module.exports = checkType;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(3);
	
	var isNumber = checkType.isNumber;
	var nativeMin = Math.min;
	var nativeMax = Math.max;
	
	var numberUtils = {
	    isDecimal: function isDecimal(num) {
	        return isNumber(num) && num % 1 !== 0;
	    },
	    isEven: function isEven(num) {
	        return isNumber(num) && num % 2 === 0;
	    },
	    isFinite: isFinite,
	    isInteger: Number.isInteger ? Number.isInteger : function (num) {
	        return isNumber(num) && num % 1 === 0;
	    },
	    isNaN: isNaN,
	    isNegative: function isNegative(num) {
	        return isNumber(num) && num < 0;
	    },
	    isNumber: isNumber,
	    isOdd: function isOdd(num) {
	        return isNumber(num) && num % 2 !== 0;
	    },
	    isPositive: function isPositive(num) {
	        return isNumber(num) && num > 0;
	    },
	    toFloat: function toFloat(str) {
	        return parseFloat(str);
	    },
	    toInteger: function toInteger(str, radix) {
	        return parseInt(str, radix || 10);
	    },
	    isInRange: function isInRange(value, start, end) {
	        start = +start || 0;
	        if (end === undefined) {
	            end = start;
	            start = 0;
	        } else {
	            end = +end || 0;
	        }
	        return value >= nativeMin(start, end) && value < nativeMax(start, end);
	    }
	};
	
	numberUtils.isInFinite = function (num) {
	    return !numberUtils.isFinite(num);
	};
	
	module.exports = numberUtils;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var stringUtils = __webpack_require__(6);
	
	var doc = document;
	var html = doc.documentElement;
	var testDiv = doc.createElement('div');
	
	module.exports = {
	    hasTextContent: 'textContent' in testDiv,
	    hasClassList: 'classList' in testDiv,
	    hasDataSet: 'dataset' in testDiv,
	    canDnD: 'draggable' in testDiv,
	    isQuirks: stringUtils.lc(doc.compatMode) === 'backcompat' || doc.documentMode === 5, // 怪异模式
	    testDiv: testDiv,
	    contains: 'compareDocumentPosition' in html ? function (element, container) {
	        return (container.compareDocumentPosition(element) & 16) === 16;
	    } : function (element, container) {
	        container = container === doc || container === window ? html : container;
	        return container !== element && container.contains(element);
	    },
	    isDomNode: function isDomNode(element) {
	        var t = element.nodeType;
	        return element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && (t === 1 || t === 9);
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(3);
	
	var isString = checkType.isString;
	var stringPrototype = String.prototype;
	
	function toString(a) {
	    return a.toString();
	}
	
	var stringUtils = {
	    isString: isString,
	    trim: function trim(str) {
	        str = toString(str);
	        return stringPrototype.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	    },
	    trimLeft: function trimLeft(str) {
	        str = toString(str);
	        return stringPrototype.trimLeft ? str.trimLeft() : str.replace(/^\s+/g, '');
	    },
	    trimRight: function trimRight(str) {
	        str = toString(str);
	        return stringPrototype.trimRight ? str.trimRight() : str.replace(/^\s+/g, '');
	    },
	    lc: function lc(str) {
	        return toString(str).toLowerCase();
	    },
	    uc: function uc(str) {
	        return toString(str).toUpperCase();
	    },
	    hasSubString: function hasSubString(str, subStr) {
	        return toString(str).indexOf(toString(subStr)) > -1;
	    }
	};
	
	module.exports = stringUtils;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global location */
	// TODO reconstruct
	
	var Promise = __webpack_require__(8);
	var json = __webpack_require__(16);
	var xhr = __webpack_require__(18);
	
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: fetch polyfill (https://github.com/github/fetch)
	 */
	if (!window.fetch) {
	  var support;
	  var methods;
	
	  (function () {
	    var normalizeName = function normalizeName(name) {
	      if (typeof name !== 'string') {
	        name = String(name);
	      }
	      if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	        throw new TypeError('Invalid character in header field name');
	      }
	      return name.toLowerCase();
	    };
	
	    var normalizeValue = function normalizeValue(value) {
	      if (typeof value !== 'string') {
	        value = String(value);
	      }
	      return value;
	    };
	
	    var Headers = function Headers(headers) {
	      this.map = {};
	
	      if (headers instanceof Headers) {
	        headers.forEach(function (value, name) {
	          this.append(name, value);
	        }, this);
	      } else if (headers) {
	        Object.getOwnPropertyNames(headers).forEach(function (name) {
	          this.append(name, headers[name]);
	        }, this);
	      }
	    };
	
	    var consumed = function consumed(body) {
	      if (body.bodyUsed) {
	        return Promise.reject(new TypeError('Already read'));
	      }
	      body.bodyUsed = true;
	    };
	
	    var fileReaderReady = function fileReaderReady(reader) {
	      return new Promise(function (resolve, reject) {
	        reader.onload = function () {
	          resolve(reader.result);
	        };
	        reader.onerror = function () {
	          reject(reader.error);
	        };
	      });
	    };
	
	    var readBlobAsArrayBuffer = function readBlobAsArrayBuffer(blob) {
	      var reader = new FileReader();
	      reader.readAsArrayBuffer(blob);
	      return fileReaderReady(reader);
	    };
	
	    var readBlobAsText = function readBlobAsText(blob) {
	      var reader = new FileReader();
	      reader.readAsText(blob);
	      return fileReaderReady(reader);
	    };
	
	    var Body = function Body() {
	      this.bodyUsed = false;
	
	      this._initBody = function (body) {
	        this._bodyInit = body;
	        if (typeof body === 'string') {
	          this._bodyText = body;
	        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	          this._bodyBlob = body;
	        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	          this._bodyFormData = body;
	        } else if (!body) {
	          this._bodyText = '';
	        } else {
	          throw new Error('unsupported BodyInit type');
	        }
	      };
	
	      if (support.blob) {
	        this.blob = function () {
	          var rejected = consumed(this);
	          if (rejected) {
	            return rejected;
	          }
	
	          if (this._bodyBlob) {
	            return Promise.resolve(this._bodyBlob);
	          } else if (this._bodyFormData) {
	            throw new Error('could not read FormData body as blob');
	          } else {
	            return Promise.resolve(new Blob([this._bodyText]));
	          }
	        };
	
	        this.arrayBuffer = function () {
	          return this.blob().then(readBlobAsArrayBuffer);
	        };
	
	        this.text = function () {
	          var rejected = consumed(this);
	          if (rejected) {
	            return rejected;
	          }
	
	          if (this._bodyBlob) {
	            return readBlobAsText(this._bodyBlob);
	          } else if (this._bodyFormData) {
	            throw new Error('could not read FormData body as text');
	          } else {
	            return Promise.resolve(this._bodyText);
	          }
	        };
	      } else {
	        this.text = function () {
	          var rejected = consumed(this);
	          return rejected ? rejected : Promise.resolve(this._bodyText);
	        };
	      }
	
	      if (support.formData) {
	        this.formData = function () {
	          return this.text().then(decode);
	        };
	      }
	
	      this.json = function () {
	        return this.text().then(json.parse);
	      };
	
	      return this;
	    };
	
	    // HTTP methods whose capitalization should be normalized
	
	    var normalizeMethod = function normalizeMethod(method) {
	      var upcased = method.toUpperCase();
	      return methods.indexOf(upcased) > -1 ? upcased : method;
	    };
	
	    var Request = function Request(input, options) {
	      options = options || {};
	      var body = options.body;
	      if (Request.prototype.isPrototypeOf(input)) {
	        if (input.bodyUsed) {
	          throw new TypeError('Already read');
	        }
	        this.url = input.url;
	        this.credentials = input.credentials;
	        if (!options.headers) {
	          this.headers = new Headers(input.headers);
	        }
	        this.method = input.method;
	        this.mode = input.mode;
	        if (!body) {
	          body = input._bodyInit;
	          input.bodyUsed = true;
	        }
	      } else {
	        this.url = input;
	      }
	
	      this.credentials = options.credentials || this.credentials || 'omit';
	      if (options.headers || !this.headers) {
	        this.headers = new Headers(options.headers);
	      }
	      this.method = normalizeMethod(options.method || this.method || 'GET');
	      this.mode = options.mode || this.mode || null;
	      this.referrer = null;
	
	      if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	        throw new TypeError('Body not allowed for GET or HEAD requests');
	      }
	      this._initBody(body);
	    };
	
	    var decode = function decode(body) {
	      var form = new FormData();
	      body.trim().split('&').forEach(function (bytes) {
	        if (bytes) {
	          var split = bytes.split('=');
	          var name = split.shift().replace(/\+/g, ' ');
	          var value = split.join('=').replace(/\+/g, ' ');
	          form.append(decodeURIComponent(name), decodeURIComponent(value));
	        }
	      });
	      return form;
	    };
	
	    var headers = function headers(xhr) {
	      var head = new Headers();
	      var pairs = xhr.getAllResponseHeaders().trim().split('\n');
	      pairs.forEach(function (header) {
	        var split = header.trim().split(':');
	        var key = split.shift().trim();
	        var value = split.join(':').trim();
	        head.append(key, value);
	      });
	      return head;
	    };
	
	    var Response = function Response(bodyInit, options) {
	      if (!options) {
	        options = {};
	      }
	
	      this._initBody(bodyInit);
	      this.type = 'default';
	      this.url = null;
	      this.status = options.status;
	      this.ok = this.status >= 200 && this.status < 300;
	      this.statusText = options.statusText;
	      this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
	      this.url = options.url || '';
	    };
	
	    Headers.prototype.append = function (name, value) {
	      name = normalizeName(name);
	      value = normalizeValue(value);
	      var list = this.map[name];
	      if (!list) {
	        list = [];
	        this.map[name] = list;
	      }
	      list.push(value);
	    };
	
	    Headers.prototype['delete'] = function (name) {
	      delete this.map[normalizeName(name)];
	    };
	
	    Headers.prototype.get = function (name) {
	      var values = this.map[normalizeName(name)];
	      return values ? values[0] : null;
	    };
	
	    Headers.prototype.getAll = function (name) {
	      return this.map[normalizeName(name)] || [];
	    };
	
	    Headers.prototype.has = function (name) {
	      return this.map.hasOwnProperty(normalizeName(name));
	    };
	
	    Headers.prototype.set = function (name, value) {
	      this.map[normalizeName(name)] = [normalizeValue(value)];
	    };
	
	    Headers.prototype.forEach = function (callback, thisArg) {
	      Object.getOwnPropertyNames(this.map).forEach(function (name) {
	        this.map[name].forEach(function (value) {
	          callback.call(thisArg, value, name, this);
	        }, this);
	      }, this);
	    };
	
	    support = {
	      blob: 'FileReader' in window && 'Blob' in window && (function () {
	        try {
	          new Blob();
	          return true;
	        } catch (e) {
	          return false;
	        }
	      })(),
	      formData: 'FormData' in window
	    };
	    methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	
	    Body.call(Request.prototype);
	
	    Body.call(Response.prototype);
	
	    window.Headers = Headers;
	    window.Request = Request;
	    window.Response = Response;
	
	    window.fetch = function (input, init) {
	      var request;
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input;
	      } else {
	        request = new Request(input, init);
	      }
	
	      return new Promise(function (resolve, reject) {
	        function responseURL() {
	          if ('responseURL' in xhr) {
	            return xhr.responseURL;
	          }
	
	          // Avoid security warnings on getResponseHeader when not allowed by CORS
	          if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	            return xhr.getResponseHeader('X-Request-URL');
	          }
	
	          return;
	        }
	
	        xhr.onload = function () {
	          var status = xhr.status === 1223 ? 204 : xhr.status;
	          if (status < 100 || status > 599) {
	            reject(new TypeError('Network request failed'));
	            return;
	          }
	          var options = {
	            status: status,
	            statusText: xhr.statusText,
	            headers: headers(xhr),
	            url: responseURL()
	          };
	          var body = 'response' in xhr ? xhr.response : xhr.responseText;
	          resolve(new Response(body, options));
	        };
	
	        xhr.onerror = function () {
	          reject(new TypeError('Network request failed'));
	        };
	
	        xhr.open(request.method, request.url, true);
	
	        if (request.credentials === 'include') {
	          xhr.withCredentials = true;
	        }
	
	        if ('responseType' in xhr && support.blob) {
	          xhr.responseType = 'blob';
	        }
	
	        request.headers.forEach(function (value, name) {
	          xhr.setRequestHeader(name, value);
	        });
	
	        xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	      });
	    };
	    window.fetch.polyfill = true;
	  })();
	}
	
	module.exports = window.fetch;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process) {'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global setImmediate, process, setTimeout */
	
	var arrayUtils = __webpack_require__(2);
	var objectUtils = __webpack_require__(11);
	var checkType = __webpack_require__(3);
	var declare = __webpack_require__(12);
	
	var Resolver = declare({
	    constructor: function constructor() {
	        objectUtils.extend(this, {
	            _callbacks: [],
	            _errbacks: [],
	            _status: 'pending',
	            _result: null
	        });
	    },
	    fulfill: function fulfill(value) {
	        var me = this;
	        var status = me._status;
	
	        if (status === 'pending' || status === 'accepted') {
	            me._result = value;
	            me._status = 'fulfilled';
	        }
	
	        if (me._status === 'fulfilled') {
	            me._notify(me._callbacks, me._result);
	            me._callbacks = [];
	            me._errbacks = null;
	        }
	    },
	    reject: function reject(reason) {
	        var me = this;
	        var status = me._status;
	
	        if (status === 'pending' || status === 'accepted') {
	            me._result = reason;
	            me._status = 'rejected';
	        }
	
	        if (me._status === 'rejected') {
	            me._notify(me._errbacks, me._result);
	            me._callbacks = null;
	            me._errbacks = [];
	        }
	    },
	    resolve: function resolve(value) {
	        var me = this;
	        if (me._status === 'pending') {
	            me._status = 'accepted';
	            me._value = value;
	
	            if (me._callbacks && me._callbacks.length || me._errbacks && me._errbacks.length) {
	                me._unwrap(me._value);
	            }
	        }
	    },
	    _unwrap: function _unwrap(value) {
	        var me = this;
	        var unwrapped = false;
	        var then = undefined;
	
	        if (!value || !checkType.isObject(value) && !checkType.isFunction(value)) {
	            me.fulfill(value);
	            return;
	        }
	
	        try {
	            then = value.then;
	            if (checkType.isFunction(then)) {
	                then.call(value, function (value) {
	                    if (!unwrapped) {
	                        unwrapped = true;
	                        me._unwrap(value);
	                    }
	                }, function (reason) {
	                    if (!unwrapped) {
	                        unwrapped = true;
	                        me.reject(reason);
	                    }
	                });
	            } else {
	                me.fulfill(value);
	            }
	        } catch (e) {
	            if (!unwrapped) {
	                me.reject(e);
	            }
	        }
	    },
	    _addCallbacks: function _addCallbacks(callback, errback) {
	        var me = this;
	        var callbackList = me._callbacks;
	        var errbackList = me._errbacks;
	
	        if (callbackList) {
	            callbackList.push(callback);
	        }
	        if (errbackList) {
	            errbackList.push(errback);
	        }
	        switch (me._status) {
	            case 'accepted':
	                me._unwrap(me._value);
	                break;
	            case 'fulfilled':
	                me.fulfill(me._result);
	                break;
	            case 'rejected':
	                me.reject(me._result);
	                break;
	        }
	    },
	    _notify: function _notify(subs, result) {
	        if (subs.length) {
	            Constructor.async(function () {
	                arrayUtils.each(subs, function (sub) {
	                    sub(result);
	                });
	            });
	        }
	    }
	});
	
	function Constructor(fn) {
	    var me = this;
	    if (!checkType.isFunction(fn)) {
	        throw new TypeError('Promise resolver ' + fn + ' is not a function');
	    }
	
	    var resolver = me._resolver = new Resolver();
	
	    try {
	        fn(function (value) {
	            resolver.resolve(value);
	        }, function (reason) {
	            resolver.reject(reason);
	        });
	    } catch (e) {
	        resolver.reject(e);
	    }
	}
	
	objectUtils.extend(Constructor, {
	    Resolver: Resolver,
	    resolve: function resolve(value) {
	        if (value && value.constructor === this) {
	            return value;
	        }
	        return new this(function (resolve) {
	            resolve(value);
	        });
	    },
	    reject: function reject(reason) {
	        var promise = new this(function () {});
	
	        promise._resolver._result = reason;
	        promise._resolver._status = 'rejected';
	        return promise;
	    },
	    all: function all(values) {
	        return new Constructor(function (resolve, reject) {
	            if (!checkType.isArray(values)) {
	                reject(new Error('Promise.all expects an array of values or promises'));
	                return;
	            }
	
	            var remaining = values.length;
	            var i = 0;
	            var length = values.length;
	            var results = [];
	
	            function oneDone(index) {
	                return function (value) {
	                    results[index] = value;
	
	                    remaining--;
	
	                    if (!remaining) {
	                        resolve(results);
	                    }
	                };
	            }
	            if (length < 1) {
	                return resolve(results);
	            }
	            for (; i < length; i++) {
	                Constructor.resolve(values[i]).then(oneDone(i), reject);
	            }
	        });
	    },
	    race: function race(values) {
	        return new Constructor(function (resolve, reject) {
	            if (!checkType.isArray(values)) {
	                reject(new Error('Promise.race expects an array of values or promises'));
	                return;
	            }
	            arrayUtils.each(values, function (value) {
	                Constructor.resolve(value).then(resolve, reject);
	            });
	        });
	    },
	    async: (function () {
	        try {
	            if (setImmediate) {
	                return function (fn) {
	                    setImmediate(fn);
	                };
	            }
	        } catch (e) {}
	        try {
	            return process.nextTick;
	        } catch (e) {}
	        try {} catch (e) {
	            return function (fn) {
	                setTimeout(fn, 0);
	            };
	        }
	        throw 'setTimeout not supported!';
	    })(),
	    _makeCallback: function _makeCallback(promise, resolve, reject, fn) {
	        return function (valueOrReason) {
	            var result;
	
	            try {
	                result = fn(valueOrReason);
	            } catch (e) {
	                reject(e);
	                return;
	            }
	            if (result === promise) {
	                // test suite promises-aplus-tests#2.3.1 requires a TypeError instance
	                reject(new TypeError('Cannot resolve a promise with itself'));
	                return;
	            }
	            resolve(result);
	        };
	    }
	});
	
	var PromiseShim = declare({
	    constructor: Constructor,
	    then: function then(callback, errback) {
	        var resolve = undefined,
	            reject = undefined;
	        var promise = new Constructor(function (res, rej) {
	            resolve = res;
	            reject = rej;
	        });
	
	        this._resolver._addCallbacks(checkType.isFunction(callback) ? Constructor._makeCallback(promise, resolve, reject, callback) : resolve, checkType.isFunction(errback) ? Constructor._makeCallback(promise, resolve, reject, errback) : reject);
	        return promise;
	    },
	    'catch': function _catch(errback) {
	        return this.then(undefined, errback);
	    }
	});
	
	// comment this code block to test {
	if (typeof Promise !== 'undefined' && Promise && !!Promise.resolve) {
	    PromiseShim = Promise;
	}
	// }
	
	module.exports = PromiseShim;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate, __webpack_require__(10)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(10).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9).setImmediate, __webpack_require__(9).clearImmediate))

/***/ },
/* 10 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var checkType = __webpack_require__(3);
	var getType = checkType.getType;
	var isFunction = checkType.isFunction;
	var isObject = checkType.isObject;
	var isPlainObject = checkType.isPlainObject;
	
	var arrayUtils = __webpack_require__(2);
	var contains = arrayUtils.contains;
	var each = arrayUtils.each;
	var isArrayLike = arrayUtils.isArrayLike;
	var toArray = arrayUtils.toArray;
	
	function toPlainObject(obj) {
	    return isPlainObject(obj) ? obj : {};
	}
	function forIn(obj, callback, thisObj) {
	    var plainObj = toPlainObject(obj);
	    for (var key in plainObj) {
	        callback.call(thisObj, plainObj[key], key, obj);
	    }
	}
	
	var keys = Object.keys ? function (obj) {
	    return Object.keys(obj);
	} : function (obj) {
	    var result = [];
	    forIn(obj, function (value, key) {
	        if (!(isFunction(obj) && key === 'prototype')) {
	            result.push(key);
	        }
	    });
	    return result;
	};
	
	function values(obj) {
	    var result = [];
	    forIn(obj, function (value) {
	        return result.push(value);
	    });
	    return result;
	}
	
	function extend(dest) {
	    dest = dest || {};
	    each(toArray(arguments).slice(1), function (source) {
	        if (source) {
	            for (var prop in source) {
	                dest[prop] = source[prop];
	            }
	        }
	    });
	    return dest;
	}
	
	function merge(dest) {
	    dest = dest || {};
	    each(toArray(arguments).slice(1), function (source) {
	        for (var prop in source) {
	            if (getType(source[prop]) !== getType(dest[prop])) {
	                if (isPlainObject(source[prop])) {
	                    dest[prop] = {};
	                    merge(dest[prop], source[prop]);
	                } else {
	                    dest[prop] = source[prop];
	                }
	            } else {
	                if (isPlainObject(source[prop])) {
	                    merge(dest[prop], source[prop]);
	                } else {
	                    dest[prop] = source[prop];
	                }
	            }
	        }
	    });
	    return dest;
	}
	
	var objectUtils = {
	    assign: extend,
	    forIn: forIn,
	    extend: extend,
	    hasKey: function hasKey(obj, key) {
	        return obj.hasOwnProperty(key);
	    },
	    hasValue: function hasValue(obj, value) {
	        return contains(values(obj), value);
	    },
	    isObject: isObject,
	    isPlainObject: isPlainObject,
	    keys: keys,
	    merge: merge,
	    values: values,
	    invert: function invert(obj) {
	        var result = {};
	        forIn(obj, function (value, key) {
	            result[value] = key;
	        });
	        return result;
	    },
	    clone: function clone(obj) {
	        if (isArrayLike(obj)) {
	            return toArray(obj);
	        }
	        if (isPlainObject(obj)) {
	            return merge({}, obj);
	        }
	        return obj;
	    },
	    destroy: function destroy(obj) {
	        for (var p in obj) {
	            delete obj[p];
	        }
	        obj.prototype = null;
	        obj = null;
	    }
	};
	
	module.exports = objectUtils;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var lang = __webpack_require__(13);
	var c3mroMerge = __webpack_require__(15);
	
	module.exports = function () /*name, superClasses, protoObj*/{
	    var uberClass = undefined;
	    var tempConstructor = undefined;
	    var lin = '_linearization';
	    var args = lang.toArray(arguments);
	    var name = lang.isString(args[0]) ? args.shift() : '';
	    var superClasses = args.length > 1 ? args.shift() : [];
	    var protoObj = args[0] ? args.shift() : {};
	    var bases = [];
	    var hasCtor = false;
	    var Tmp = function Tmp() {};
	    var ctor = function ctor() {};
	
	    superClasses = lang.isArray(superClasses) ? superClasses : [superClasses];
	    lang.each(superClasses, function (clazz) {
	        clazz[lin] = clazz[lin] || [clazz];
	        bases.push(clazz[lin]);
	    });
	
	    if (bases.length) {
	        bases.push(superClasses);
	        bases = c3mroMerge.apply(null, bases);
	    }
	
	    tempConstructor = protoObj.constructor;
	    if (tempConstructor !== Object.prototype.constructor) {
	        hasCtor = true;
	        ctor = tempConstructor;
	    }
	
	    ctor[lin] = [ctor].concat(bases);
	    ctor.parents = lang.toArray(bases);
	
	    protoObj.constructor = ctor;
	    while (uberClass = bases.shift()) {
	        protoObj = lang.extend({}, uberClass.prototype, protoObj);
	        Tmp.prototype = protoObj;
	        if (!hasCtor) {
	            protoObj.constructor = ctor;
	        }
	        protoObj = new Tmp();
	    }
	
	    ctor.className = name;
	    ctor.prototype = protoObj;
	    ctor.prototype.constructor = ctor;
	
	    return ctor;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var objectUtils = __webpack_require__(11);
	
	module.exports = objectUtils.extend({
	        global: __webpack_require__(14)
	}, objectUtils, __webpack_require__(2), __webpack_require__(4), __webpack_require__(6), __webpack_require__(3));

/***/ },
/* 14 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, global, self */
	
	var undefStr = 'undefined';
	
	module.exports = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefStr ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) !== undefStr ? global : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) !== undefStr ? self : {};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var arrayUtils = __webpack_require__(2);
	
	function isGoodHead(head, rest) {
	    var isGood = true;
	    arrayUtils.some(rest, function (lin) {
	        if (arrayUtils.indexOf(lin, head) > 0) {
	            isGood = false;
	        }
	    });
	
	    if (isGood) {
	        arrayUtils.each(rest, function (lin) {
	            if (arrayUtils.indexOf(lin, head) === 0) {
	                lin.shift();
	            }
	        });
	    }
	    return isGood;
	}
	
	function eachHead(bases) {
	    var result = [];
	    var badLinearization = 0;
	
	    while (bases.length) {
	        var base = bases.shift();
	        if (!base.length) {
	            continue;
	        }
	
	        if (isGoodHead(base[0], bases)) {
	            result.push(base.shift());
	            badLinearization = 0;
	        } else {
	            badLinearization += 1;
	            if (badLinearization === bases.length) {
	                throw 'Bad Linearization';
	            }
	        }
	        if (base.length) {
	            bases.push(base);
	        }
	    }
	    return result;
	}
	
	module.exports = function () {
	    return eachHead(arrayUtils.map(arrayUtils.toArray(arguments), arrayUtils.toArray));
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var arrayUtils = __webpack_require__(2);
	var checkType = __webpack_require__(3);
	var fmtDate = __webpack_require__(17);
	
	var D2JSON = Date.prototype.toJSON;
	
	if (!checkType.isFunction(D2JSON)) {
	    arrayUtils.each([String.prototype, Number.prototype, Boolean.prototype], function (p) {
	        p.toJSON = function () {
	            return this.valueOf();
	        };
	    });
	    D2JSON = function () {
	        return isFinite(this.valueOf()) ? fmtDate(this) : null;
	    };
	}
	
	var undef = undefined;
	var escapeString = function escapeString( /*String*/str) {
	    return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').replace(/[\f]/g, '\\f').replace(/[\b]/g, '\\b').replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r');
	};
	
	var json = {
	    parse: function parse(str, strict) {
	        /*
	         * @description: 从 JSON 字符串得到一个数据结构
	         */
	        if (strict && !/^([\s\[\{]*(?:"(?:\\.|[^"])*"|-?\d[\d\.]*(?:[Ee][+-]?\d+)?|null|true|false|)[\s\]\}]*(?:,|:|$))+$/.test(str)) {
	            throw 'Invalid characters in JSON';
	        }
	        /* jshint -W061 */
	        return eval('(' + str + ')');
	    },
	    stringify: function stringify(value, replacer, spacer) {
	        /*
	         * @description: 把内置数据类型转为 JSON 字符串
	         */
	        if (checkType.isString(replacer)) {
	            spacer = replacer;
	            replacer = null;
	        }
	        function stringify(it, indent, key) {
	            if (replacer) {
	                it = replacer(key, it);
	            }
	            var val = undefined;
	            if (checkType.isNumber(it)) {
	                return isFinite(it) ? it + '' : 'null';
	            }
	            if (checkType.isBoolean(it)) {
	                return it + '';
	            }
	            if (it === null) {
	                return 'null';
	            }
	            if (checkType.isString(it)) {
	                return escapeString(it);
	            }
	            if (checkType.isFunction(it) || !it) {
	                return undef;
	            }
	            if (checkType.isFunction(it.toJSON)) {
	                return stringify(it.toJSON(key), indent, key);
	            }
	            if (checkType.isDate(it)) {
	                return fmtDate(it);
	            }
	            if (it.valueOf() !== it) {
	                return stringify(it.valueOf(), indent, key);
	            }
	            var nextIndent = spacer ? indent + spacer : '';
	            var sep = spacer ? ' ' : '';
	            var newLine = spacer ? '\n' : '';
	
	            if (checkType.isArray(it)) {
	                var itl = it.length;
	                var res = [];
	                for (key = 0; key < itl; key++) {
	                    var obj = it[key];
	                    val = stringify(obj, nextIndent, key);
	                    if (!checkType.isString(val)) {
	                        val = 'null';
	                    }
	                    res.push(newLine + nextIndent + val);
	                }
	                return '[' + res.join(',') + newLine + indent + ']';
	            }
	            var output = [];
	            for (key in it) {
	                var keyStr = undefined;
	                if (it.hasOwnProperty(key)) {
	                    if (checkType.isNumber(key)) {
	                        keyStr = '"' + key + '"';
	                    } else if (checkType.isString(key)) {
	                        keyStr = escapeString(key);
	                    } else {
	                        continue;
	                    }
	                    val = stringify(it[key], nextIndent, key);
	                    if (!checkType.isString(val)) {
	                        continue;
	                    }
	                    output.push(newLine + nextIndent + keyStr + ':' + sep + val);
	                }
	            }
	            return '{' + output.join(',') + newLine + indent + '}';
	        }
	        return stringify(value, '', '');
	    }
	};
	
	// comment this code block to test {
	if (typeof JSON !== 'undefined' && JSON && !!JSON.parse && !!JSON.stringify) {
	    json = JSON;
	}
	// }
	
	module.exports = json;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var checkType = __webpack_require__(3);
	
	var doubleDigit = function doubleDigit(n) {
	    return n < 10 ? '0' + n : n;
	};
	var lms = function lms(ms) {
	    var str = ms + '';
	    var len = str.length;
	    return len === 3 ? str : len === 2 ? '0' + str : '00' + str;
	};
	
	module.exports = function (date, pattern) {
	    /*
	     * @reference   : https://github.com/dojo/dojo/blob/master/json.js#L105
	     * @description : return stringified date according to given pattern.
	     * @parameter*  : {date  } date, input Date object
	     * @parameter   : {string} pattern, defines pattern for stringify.
	     * @parameter   : {string} pattern, defines pattern for stringify.
	     * @return      : {string} result string.
	     * @syntax      : fmtDate(date, [pattern])
	     * @example     :
	     //    '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}.{Milliseconds}Z' => '2013-10-03T00:57::13.180Z'
	     */
	    if (checkType.isDate(date)) {
	        pattern = pattern || '{FullYear}-{Month}-{Date}T{Hours}:{Minutes}:{Seconds}Z';
	
	        return pattern.replace(/\{(\w+)\}/g, function (t, prop) {
	            var fullProp = 'get' + (prop === 'Year' ? prop : 'UTC' + prop);
	            var num = date[fullProp]() + (prop === 'Month' ? 1 : 0);
	            return prop === 'Milliseconds' ? lms(num) : doubleDigit(num);
	        });
	    } else {
	        throw 'not a Date instance';
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global XMLHttpRequest, ActiveXObject */
	
	function getXHR() {
	    try {
	        return new XMLHttpRequest();
	    } catch (e) {}
	    try {
	        return new ActiveXObject('MSXML2.XMLHTTP');
	    } catch (e) {}
	    try {
	        return new ActiveXObject('Microsoft.XMLHTTP');
	    } catch (e) {}
	    throw 'XHR not supported!';
	}
	
	module.exports = getXHR();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _global = __webpack_require__(14);
	
	var _global2 = _interopRequireDefault(_global);
	
	var _toc = __webpack_require__(20);
	
	var _toc2 = _interopRequireDefault(_toc);
	
	var _utils = __webpack_require__(26);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _object = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by liangwensen on 2/17/16.
	 */
	
	var main = (0, _object.extend)({
	    Toc: _toc2.default,
	    generate: function generate(element, options) {
	        return new _toc2.default(element, options);
	    }
	}, _utils2.default);
	
	_global2.default.tg = _global2.default.tocGenerator = main;
	
	exports.default = main;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _declare = __webpack_require__(12);
	
	var _declare2 = _interopRequireDefault(_declare);
	
	var _class = __webpack_require__(21);
	
	var _class2 = _interopRequireDefault(_class);
	
	var _construct = __webpack_require__(22);
	
	var _construct2 = _interopRequireDefault(_construct);
	
	var _query = __webpack_require__(1);
	
	var _query2 = _interopRequireDefault(_query);
	
	var _sprintf = __webpack_require__(24);
	
	var _sprintf2 = _interopRequireDefault(_sprintf);
	
	var _zeroLang = __webpack_require__(13);
	
	var _zeroLang2 = _interopRequireDefault(_zeroLang);
	
	var _html = __webpack_require__(25);
	
	var _html2 = _interopRequireDefault(_html);
	
	var _utils = __webpack_require__(26);
	
	var _anchor = __webpack_require__(27);
	
	var _anchor2 = _interopRequireDefault(_anchor);
	
	var _link = __webpack_require__(28);
	
	var _link2 = _interopRequireDefault(_link);
	
	var _linkList = __webpack_require__(29);
	
	var _linkList2 = _interopRequireDefault(_linkList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var DEFAULT_OPTIONS = {
	    anchorIdPrefix: 'toc-',
	    hasChildClassName: 'has-child',
	    maxDepth: 3,
	    uniqueIdSeparator: '-',
	    uniqueIdSuffix: '1'
	}; /**
	    * Created by liangwensen on 2/17/16.
	    */
	
	
	var extend = _zeroLang2.default.extend;
	var body = document.body;
	var templateHelper = extend({}, _html2.default, _zeroLang2.default);
	
	var Toc = (0, _declare2.default)({
	    constructor: function constructor(element, options) {
	        var self = this;
	        if (element) {
	            element = _query2.default.one(element);
	        }
	        self._srcElement = element || body;
	        self._options = extend({}, DEFAULT_OPTIONS, options);
	        self._parse()._bindEvents();
	        return self;
	    },
	    _parse: function _parse() {
	        var self = this;
	        var options = self._options;
	        var tocElement = self._outerDomNode = _construct2.default.toDom((0, _linkList2.default)({}, templateHelper));
	
	        var headers = _query2.default.all((0, _utils.getHeaderSelector)(options.maxDepth), self._srcElement);
	        var currentHeaderMeta = undefined;
	        var headerMetaById = {};
	
	        function getHeaderUniqueId(text) {
	            var id = text.replace(/\s+/, options.uniqueIdSeparator);
	            if (!_zeroLang2.default.hasKey(headerMetaById, id)) {
	                return id;
	            }
	            return getHeaderUniqueId(id + options.uniqueIdSuffix);
	        }
	
	        function addToChildren(headerMeta, parentHeaderMeta) {
	            console.log(arguments);
	            var childrenElement = _query2.default.one('ul', parentHeaderMeta.element);
	            if (!childrenElement) {
	                childrenElement = _construct2.default.toDom((0, _linkList2.default)({}, templateHelper));
	                _construct2.default.place(childrenElement, parentHeaderMeta.element);
	            }
	            _construct2.default.place(headerMeta.element, childrenElement);
	            parentHeaderMeta.hasChild = true;
	            headerMeta.parentId = parentHeaderMeta.uniqueId;
	        }
	
	        _zeroLang2.default.each(headers, function (header) {
	            var level = (0, _utils.getHeaderLevel)(header);
	            var text = (0, _utils.getHeaderText)(header);
	            var uniqueId = getHeaderUniqueId(text);
	            var meta = {
	                text: text,
	                uniqueId: uniqueId,
	                level: level,
	                hasChild: false
	            };
	            var linkElement = _construct2.default.toDom((0, _link2.default)(meta, templateHelper));
	            var anchorElement = _construct2.default.toDom((0, _anchor2.default)(meta, templateHelper));
	            meta.element = linkElement;
	            meta.anchorElement = anchorElement;
	            _construct2.default.place(anchorElement, header, 'first'); // add anchor to header
	
	            if (currentHeaderMeta) {
	                if (currentHeaderMeta.level < level) {
	                    // NOTICE that "h2 < h1"
	                    meta.parentId = currentHeaderMeta.uniqueId;
	                    addToChildren(meta, currentHeaderMeta);
	                } else {
	                    var parentMeta = headerMetaById[currentHeaderMeta.parentId];
	                    while (parentMeta) {
	                        if (parentMeta.level >= level) {
	                            parentMeta = headerMetaById[parentMeta.parentId];
	                        } else {
	                            break;
	                        }
	                    }
	                    if (parentMeta) {
	                        addToChildren(meta, parentMeta);
	                    } else {
	                        _construct2.default.place(linkElement, tocElement);
	                    }
	                }
	            } else {
	                _construct2.default.place(linkElement, tocElement);
	            }
	            headerMetaById[uniqueId] = meta;
	            currentHeaderMeta = meta;
	        });
	        _zeroLang2.default.forIn(headerMetaById, function (meta) {
	            if (meta.hasChild) {
	                _class2.default.add(meta.element, options.hasChildClassName);
	            }
	        });
	
	        self._headerMetaById = headerMetaById;
	        return self;
	    },
	    _bindEvents: function _bindEvents() {
	        var self = this;
	        return self;
	    },
	    scrollTo: function scrollTo(uniqueId) {
	        var self = this;
	        var anchorSelector = (0, _sprintf2.default)('[data-unique="%s"]', uniqueId);
	        try {
	            var anchorNode = _query2.default.one(anchorSelector, self._srcElement);
	            if (anchorNode) {
	                anchorNode.scrollIntoView(true);
	            }
	        } catch (e) {}
	        return self;
	    },
	    placeAt: function placeAt(container, position) {
	        var self = this;
	        if (container) {
	            container = _query2.default.one(container);
	        }
	        container = container || body;
	        position = position || '';
	        _construct2.default.place(self._outerDomNode, container, position);
	        return self;
	    },
	    destroy: function destroy() {
	        var self = this;
	        // remove all dom nodes
	        // unbind all events
	        return self;
	    }
	});
	
	exports.default = Toc;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	///* global */
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: dom classList related
	 * @note: if ClassList is supported, use ClassList
	 */
	
	var domQuery = __webpack_require__(1);
	var domUtils = __webpack_require__(5);
	var arrayUtils = __webpack_require__(2);
	var stringUtils = __webpack_require__(6);
	
	var RE_spaces = /\s+/;
	var className = 'className';
	var spaceStr = ' ';
	
	var tmpArray = [''];
	
	function str2array(str) {
	    if (stringUtils.isString(str)) {
	        if (str && !RE_spaces.test(str)) {
	            tmpArray[0] = str;
	            return tmpArray;
	        }
	        var arr = str.split(RE_spaces);
	        if (arr.length && !arr[0]) {
	            arr.shift();
	        }
	        if (arr.length && !arr[arr.length - 1]) {
	            arr.pop();
	        }
	        return arr;
	    }
	    if (!str) {
	        return [];
	    }
	    return arrayUtils.filter(str, function (x) {
	        return x;
	    });
	}
	function fillSpace(str) {
	    return spaceStr + str + spaceStr;
	}
	
	var domClass = {
	    contains: function contains(node, classStr) {
	        node = domQuery.one(node);
	        classStr = stringUtils.trim(classStr);
	        if (domUtils.hasClassList) {
	            return node.classList.contains(classStr);
	        }
	        return stringUtils.hasSubString(fillSpace(node[className]), fillSpace(classStr));
	    },
	    add: function add(node, classStr) {
	        node = domQuery.one(node);
	        classStr = str2array(classStr);
	        if (domUtils.hasClassList) {
	            arrayUtils.each(classStr, function (c) {
	                node.classList.add(c);
	            });
	        } else {
	            (function () {
	                var oldClassName = node[className];
	                var oldLen = undefined,
	                    newLen = undefined;
	                oldClassName = oldClassName ? fillSpace(oldClassName) : spaceStr;
	                oldLen = oldClassName.length;
	                arrayUtils.each(classStr, function (c) {
	                    if (c && oldClassName.indexOf(fillSpace(c)) < 0) {
	                        oldClassName += c + spaceStr;
	                    }
	                });
	                newLen = oldClassName.length;
	                if (oldLen < newLen) {
	                    node[className] = oldClassName.substr(1, newLen - 2);
	                }
	            })();
	        }
	    },
	    remove: function remove(node, classStr) {
	        node = domQuery.one(node);
	        classStr = str2array(classStr);
	        if (domUtils.hasClassList) {
	            arrayUtils.each(classStr, function (c) {
	                node.classList.remove(c);
	            });
	        } else {
	            (function () {
	                var cls = fillSpace(node[className]);
	                arrayUtils.each(classStr, function (c) {
	                    cls = cls.replace(fillSpace(c), spaceStr);
	                });
	                cls = stringUtils.trim(cls);
	                if (node[className] !== cls) {
	                    node[className] = cls;
	                }
	            })();
	        }
	    },
	    clear: function clear(node) {
	        node = domQuery.one(node);
	        node[className] = '';
	    },
	    toggle: function toggle(node, classStr) {
	        node = domQuery.one(node);
	        classStr = str2array(classStr);
	        if (domUtils.hasClassList) {
	            arrayUtils.each(classStr, function (c) {
	                node.classList.toggle(c);
	            });
	        } else {
	            arrayUtils.each(classStr, function (c) {
	                domClass[domClass.contains(node, c) ? 'remove' : 'add'](node, c);
	            });
	        }
	    }
	};
	
	module.exports = domClass;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, document */
	
	/*
	 * @author      : 绝云（wensen.lws）
	 * @description : dom constructure related
	 * @reference   : https://github.com/dojo/dojo/blob/master/dom-construct.js
	 */
	
	var bomUtils = __webpack_require__(23);
	var arrayUtils = __webpack_require__(2);
	var objectUtils = __webpack_require__(11);
	var stringUtils = __webpack_require__(6);
	var checkType = __webpack_require__(3);
	
	var domQuery = __webpack_require__(1);
	
	var queryOne = domQuery.one;
	var win = window;
	var tagWrap = {
	    option: ['select'],
	    tbody: ['table'],
	    thead: ['table'],
	    tfoot: ['table'],
	    tr: ['table', 'tbody'],
	    td: ['table', 'tbody', 'tr'],
	    th: ['table', 'thead', 'tr'],
	    legend: ['fieldset'],
	    caption: ['table'],
	    colgroup: ['table'],
	    col: ['table', 'colgroup'],
	    li: ['ul']
	};
	var RE_tag = /<\s*([\w\:]+)/;
	
	var doc = document || win.document;
	var masterDiv = doc.createElement('div');
	
	objectUtils.forIn(tagWrap, function (tw, param) {
	    tw.pre = param === 'option' ? '<select multiple="multiple">' : '<' + tw.join('><') + '>';
	    tw.post = '</' + tw.reverse().join('></') + '>';
	});
	
	function insertBefore(node, ref) {
	    var parent = ref.parentNode;
	    if (parent) {
	        parent.insertBefore(node, ref);
	    }
	}
	function insertAfter(node, ref) {
	    var parent = ref.parentNode;
	    if (parent) {
	        if (parent.lastChild === ref) {
	            parent.appendChild(node);
	        } else {
	            parent.insertBefore(node, ref.nextSibling);
	        }
	    }
	}
	
	var domConstruct = {
	    toDom: function toDom(frag) {
	        frag += '';
	
	        var match = frag.match(RE_tag);
	        var tag = match ? stringUtils.lc(match[1]) : '';
	        var master = masterDiv; // 每次拷贝缓存好的 div，否则会引入问题
	        var wrap = undefined,
	            i = undefined,
	            fc = undefined,
	            df = undefined;
	
	        if (match && tagWrap[tag]) {
	            wrap = tagWrap[tag];
	            master.innerHTML = wrap.pre + frag + wrap.post;
	            for (i = wrap.length; i; --i) {
	                master = master.firstChild;
	            }
	        } else {
	            master.innerHTML = frag;
	        }
	
	        if (master.childNodes.length === 1) {
	            return master.removeChild(master.firstChild);
	        }
	
	        df = doc.createDocumentFragment();
	        while (fc = master.firstChild) {
	            df.appendChild(fc);
	        }
	        return df;
	    },
	    place: function place(node, refNode, position) {
	        refNode = queryOne(refNode);
	        if (checkType.isString(node)) {
	            node = /^\s*</.test(node) ? domConstruct.toDom(node, refNode.ownerDocument) : queryOne(node);
	        }
	        if (checkType.isNumber(position)) {
	            var childNodes = refNode.childNodes;
	            if (!childNodes.length || childNodes.length <= position) {
	                refNode.appendChild(node);
	            } else {
	                insertBefore(node, childNodes[position < 0 ? 0 : position]);
	            }
	        } else {
	            switch (position) {
	                case 'before':
	                    insertBefore(node, refNode);
	                    break;
	                case 'after':
	                    insertAfter(node, refNode);
	                    break;
	                case 'replace':
	                    refNode.parentNode.replaceChild(node, refNode);
	                    break;
	                case 'only':
	                    domConstruct.empty(refNode);
	                    refNode.appendChild(node);
	                    break;
	                case 'first':
	                    if (refNode.firstChild) {
	                        insertBefore(node, refNode.firstChild);
	                    } else {
	                        refNode.appendChild(node);
	                    }
	                    break;
	                default:
	                    // 'last' or others
	                    refNode.appendChild(node);
	            }
	        }
	    },
	    create: function create( /*DOMNode|String*/tag, /*DOMNode|String?*/refNode, /*String?*/pos) {
	        /*
	         * @reference: 和 dojo/dom-construct 的差别在于，为了去耦合，去除了 attr 相关的处理
	         */
	        if (refNode) {
	            refNode = queryOne(refNode);
	            doc = refNode.ownerDocument;
	        }
	        if (checkType.isString(tag)) {
	            tag = doc.createElement(tag);
	        }
	        if (refNode) {
	            domConstruct.place(tag, refNode, pos);
	        }
	        return tag;
	    },
	    empty: function empty(node) {
	        node = queryOne(node);
	        if ('innerHTML' in node) {
	            try {
	                node.innerHTML = '';
	                return;
	            } catch (e) {}
	        }
	        /*jshint -W084 */
	        for (var c; c = node.lastChild;) {
	            node.removeChild(c);
	        }
	    },
	    destroy: function destroy(node) {
	        node = queryOne(node);
	        if (!node) {
	            return;
	        }
	        var parent = node.parentNode;
	        if (node.firstChild) {
	            domConstruct.empty(node);
	        }
	        if (parent) {
	            if (bomUtils.isIE && parent.canHaveChildren && 'removeNode' in node) {
	                node.removeNode(false);
	            } else {
	                parent.removeChild(node);
	            }
	        } else {
	            try {
	                node.remove();
	            } catch (e) {}
	        }
	    }
	};
	
	module.exports = domConstruct;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, location, navigator, ActiveXObject */
	
	var lang = __webpack_require__(13);
	
	/*
	 * @author      : 绝云 (wensen.lws@alibaba-inc.com)
	 * @description : 记录各种浏览器相关的版本号
	 * @note        : browser only
	 */
	var nav = navigator || {};
	var userAgent = nav.userAgent;
	var platform = nav.platform;
	var plugins = nav.plugins;
	var versions = {};
	var detectedPlatform = undefined;
	var detectedPlugins = undefined;
	
	function setVerInt(versions, key, strVal) {
	    versions[key] = lang.toInteger(strVal);
	}
	function setVer(versions, str, reg) {
	    var matched = str.match(reg);
	    if (matched) {
	        setVerInt(versions, matched[0].match(/\w*/)[0], matched[1] || 0);
	    }
	}
	function detectPlatform(str) {
	    /*
	     * @description : detect platform
	     * @param       : {string} platformStr, platform defined string.
	     * @syntax      : detectPlatform(platformStr)
	     * @return      : {string} platform. (mac|windows|linux...)
	     */
	    if (!str) {
	        return;
	    }
	    var result = lang.lc(str).match(/mac|win|linux|ipad|ipod|iphone|android/);
	    return lang.isArray(result) ? result[0] : result;
	}
	function detectPlugin(arr) {
	    /*
	     * @description : detect plugins (now flash only)
	     * @param       : {array } plugins, plugin list
	     * @syntax      : detectPlugin(plugins)
	     * @return      : {object} { 'flash' : 0|xx }
	     */
	
	    return {
	        flash: (function () {
	            var flash = undefined,
	                v = 0,
	                startV = 13;
	            if (arr && arr.length) {
	                flash = arr['Shockwave Flash'];
	                if (flash && flash.description) {
	                    v = flash.description.match(/\b(\d+)\.\d+\b/)[1] || v;
	                }
	            } else {
	                while (startV--) {
	                    try {
	                        new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startV);
	                        v = startV;
	                        break;
	                    } catch (e) {}
	                }
	            }
	            return lang.toInteger(v);
	        })()
	    };
	}
	function detectVersion(str) {
	    /*
	     * @description : detect versions
	     * @param       : {string} userAgent, window.navigator.userAgent
	     * @syntax      : detectVerion(userAgent)
	     * @return      : {object} { 'flash' : 0|xx }
	     */
	
	    if (!str) {
	        return;
	    }
	    str = lang.lc(str);
	    var ieVer = undefined;
	    var matched = undefined;
	    var result = {};
	
	    // browser result {
	    lang.each([/msie ([\d.]+)/, /firefox\/([\d.]+)/, /chrome\/([\d.]+)/, /crios\/([\d.]+)/, /opera.([\d.]+)/, /adobeair\/([\d.]+)/], function (reg) {
	        setVer(result, str, reg);
	    });
	    // }
	    // chrome {
	    if (result.crios) {
	        result.chrome = result.crios;
	    }
	    // }
	    // safari {
	    matched = str.match(/version\/([\d.]+).*safari/);
	    if (matched) {
	        setVerInt(result, 'safari', matched[1] || 0);
	    }
	    // }
	    // safari mobile {
	    matched = str.match(/version\/([\d.]+).*mobile.*safari/);
	    if (matched) {
	        setVerInt(result, 'mobilesafari', matched[1] || 0);
	    }
	    // }
	    // engine result {
	    lang.each([/trident\/([\d.]+)/, /gecko\/([\d.]+)/, /applewebkit\/([\d.]+)/, /webkit\/([\d.]+)/, // 单独存储 webkit 字段
	    /presto\/([\d.]+)/], function (reg) {
	        setVer(result, str, reg);
	    });
	    // IE {
	    ieVer = result.msie;
	    if (ieVer === 6) {
	        result.trident = 4;
	    } else if (ieVer === 7 || ieVer === 8) {
	        result.trident = 5;
	    }
	    // }
	    // }
	    return result;
	}
	
	detectedPlugins = detectPlugin(plugins);
	detectedPlatform = detectPlatform(platform) || detectPlatform(userAgent) || 'unknown';
	
	lang.extend(versions, detectVersion(userAgent), detectedPlugins);
	
	module.exports = {
	    host: location.host,
	    platform: detectPlatform,
	    plugins: detectedPlugins,
	    userAgent: userAgent,
	    versions: versions,
	    isWebkit: !!versions.webkit,
	    isIE: !!versions.msie,
	    isOpera: !!window.opera,
	    isApple: detectedPlatform.mac || detectedPlatform.ipad || detectedPlatform.ipod || detectedPlatform.iphone
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true, boss: true */
	
	var lang = __webpack_require__(13);
	var abs = Math.abs;
	
	module.exports = function (format) {
	    if (!lang.isString(format)) {
	        throw 'sprintf: The first arguments need to be a valid format string.';
	    }
	
	    var reg = /%(\+)?([0 ]|'(.))?(-)?([0-9]+)?(\.([0-9]+))?([%bcdfosxX])/g;
	    var part = undefined;
	    var parts = [];
	    var paramIndex = 1;
	    var args = lang.toArray(arguments);
	
	    while (part = reg.exec(format)) {
	        if (paramIndex >= args.length && part[8] !== '%') {
	            throw 'sprintf: At least one argument was missing.';
	        }
	
	        parts[parts.length] = {
	            begin: part.index,
	            end: part.index + part[0].length,
	            sign: part[1] === '+',
	            negative: parseFloat(args[paramIndex]) < 0 ? true : false,
	            padding: lang.isUndefined(part[2]) ? ' ' : part[2].substring(0, 1) === "'" ? part[3] : part[2],
	            alignLeft: part[4] === '-',
	            width: !lang.isUndefined(part[5]) ? part[5] : false,
	            precision: !lang.isUndefined(part[7]) ? part[7] : false,
	            type: part[8],
	            data: part[8] !== '%' ? String(args[paramIndex++]) : false
	        };
	    }
	
	    var i,
	        j,
	        preSubStr,
	        origLength,
	        newString = '',
	        start = 0;
	
	    for (i = 0; i < parts.length; i++) {
	        newString += format.substring(start, parts[i].begin);
	
	        start = parts[i].end;
	
	        preSubStr = '';
	        switch (parts[i].type) {
	            case '%':
	                preSubStr = '%';
	                break;
	            case 'b':
	                preSubStr = abs(lang.toInteger(parts[i].data)).toString(2);
	                break;
	            case 'c':
	                preSubStr = String.fromCharCode(abs(lang.toInteger(parts[i].data)));
	                break;
	            case 'd':
	                preSubStr = String(abs(lang.toInteger(parts[i].data)));
	                break;
	            case 'f':
	                preSubStr = parts[i].precision === false ? String(abs(parseFloat(parts[i].data))) : abs(parseFloat(parts[i].data)).toFixed(parts[i].precision);
	                break;
	            case 'o':
	                preSubStr = abs(lang.toInteger(parts[i].data)).toString(8);
	                break;
	            case 's':
	                preSubStr = parts[i].data.substring(0, parts[i].precision ? parts[i].precision : parts[i].data.length);
	                break;
	            case 'x':
	                preSubStr = lang.lc(abs(lang.toInteger(parts[i].data)).toString(16));
	                break;
	            case 'X':
	                preSubStr = lang.uc(abs(lang.toInteger(parts[i].data)).toString(16));
	                break;
	            default:
	                throw 'sprintf: Unknown type "' + parts[i].type + '" detected. This should never happen. Maybe the regex is wrong.';
	        }
	
	        if (parts[i].type === '%') {
	            newString += preSubStr;
	            continue;
	        }
	
	        if (parts[i].width !== false) {
	            if (parts[i].width > preSubStr.length) {
	                origLength = preSubStr.length;
	                for (j = 0; j < parts[i].width - origLength; ++j) {
	                    preSubStr = parts[i].alignLeft === true ? preSubStr + parts[i].padding : parts[i].padding + preSubStr;
	                }
	            }
	        }
	
	        /*jshint -W083 */ // make function in loop
	        if (lang.some(['b', 'd', 'o', 'f', 'x', 'X'], function (type) {
	            return type === parts[i].type;
	        })) {
	            if (parts[i].negative === true) {
	                preSubStr = '-' + preSubStr;
	            } else if (parts[i].sign === true) {
	                preSubStr = '+' + preSubStr;
	            }
	        }
	        newString += preSubStr;
	    }
	
	    newString += format.substring(start, format.length);
	    return newString;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: utils for html
	 */
	
	var objectUtils = __webpack_require__(11);
	
	var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	};
	var unescapeMap = objectUtils.invert(escapeMap);
	
	function createEscaper(map) {
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + objectUtils.keys(map).join('|') + ')';
	    var testRegexp = new RegExp(source);
	    var replaceRegexp = new RegExp(source, 'g');
	
	    function escaper(match) {
	        return map[match];
	    }
	
	    return function (string) {
	        string = string === null ? '' : '' + string;
	        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	}
	
	module.exports = {
	    escape: createEscaper(escapeMap),
	    unescape: createEscaper(unescapeMap)
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getHeaderLevel = getHeaderLevel;
	exports.getHeaderText = getHeaderText;
	exports.getHeaderSelector = getHeaderSelector;
	
	var _number = __webpack_require__(4);
	
	var _sprintf = __webpack_require__(24);
	
	var _sprintf2 = _interopRequireDefault(_sprintf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by liangwensen on 2/17/16.
	 */
	
	function getHeaderLevel(header) {
	    var tagName = header.tagName;
	    return (0, _number.toInteger)(tagName.replace(/h/i, ''));
	}
	
	function getHeaderText(header) {
	    return header.textContent || header.innerText || header.innerHTML;
	}
	
	function getHeaderSelector(level) {
	    var headers = [];
	    for (var i = 1; i <= level; i++) {
	        headers.push((0, _sprintf2.default)('h%d', i));
	    }
	    return headers.join(',');
	}

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = anonymous;
	function anonymous(data, helper
	/**/) {
	  data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {
	    return s;
	  };var _s = '<span class="toc-anchor" data-unique="' + _e(data.uniqueId) + '" style="font-weight: normal !important;">&#9875;</span>';return _s;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = anonymous;
	function anonymous(data, helper
	/**/) {
	  data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {
	    return s;
	  };var _s = '<li class="toc-link level' + _e(data.level) + '" data-unique="' + _e(data.uniqueId) + '"><span class="link-text">' + _e(data.text) + '</span></li>';return _s;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = anonymous;
	function anonymous(data, helper
	/**/) {
	  data = data || {};helper = helper || {};var _e = helper.escape ? helper.escape : function (s) {
	    return s;
	  };var _s = '<ul class="toc-link-list"></ul>';return _s;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map