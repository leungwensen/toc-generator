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
	
	var _event = __webpack_require__(1);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _query = __webpack_require__(3);
	
	var _query2 = _interopRequireDefault(_query);
	
	var _fetch = __webpack_require__(8);
	
	var _fetch2 = _interopRequireDefault(_fetch);
	
	var _global = __webpack_require__(15);
	
	var _global2 = _interopRequireDefault(_global);
	
	var _hashRouter = __webpack_require__(20);
	
	var _hashRouter2 = _interopRequireDefault(_hashRouter);
	
	var _index = __webpack_require__(25);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var mpr = _global2.default.mpr;
	
	(0, _fetch2.default)('../lib/marked-plus-renderer/features.md?raw').then(function (res) {
	    return res.text();
	}).then(function (markdownString) {
	    var containerElement = _query2.default.one('#container');
	    mpr.render(containerElement, markdownString);
	    var toc = new _index2.default.generate(containerElement, {
	        maxDepth: 6
	    });
	    toc.on('click', function (headerMeta) {
	        (0, _hashRouter2.default)(headerMeta.uniqueId);
	    });
	    toc.placeAt(_query2.default.one('#toc'));
	    (0, _hashRouter2.default)({
	        ':uniqueId': function uniqueId(_uniqueId) {
	            toc.scrollTo(_uniqueId);
	        }
	    });
	    _event2.default.on('#destroy-toc', 'click', function () {
	        console.log('destroying toc instance');
	        toc.destroy();
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: event firing
	 * @reference: http://dean.edwards.name/weblog/2005/10/add-event/
	 */
	
	var checkType = __webpack_require__(2);
	var domQuery = __webpack_require__(3);
	var domUtils = __webpack_require__(6);
	
	var doc = document;
	var win = window;
	
	function addEvent(element, type, handler) {
	    element = domQuery.one(element);
	    if (element.addEventListener) {
	        element.addEventListener(type, handler, false);
	    } else {
	        // assign each event handler a unique ID
	        if (!handler.$$guid) {
	            handler.$$guid = addEvent.guid++;
	        }
	        // create a hash table of event types for the element
	        if (!element.events) {
	            element.events = {};
	        }
	        // create a hash table of event handlers for each element/event pair
	        var handlers = element.events[type];
	        if (!handlers) {
	            handlers = element.events[type] = {};
	            // store the existing event handler (if there is one)
	            if (element['on' + type]) {
	                handlers[0] = element["on" + type];
	            }
	        }
	        // store the event handler in the hash table
	        handlers[handler.$$guid] = handler;
	        // assign a global event handler to do all the work
	        element['on' + type] = handleEvent;
	    }
	}
	// a counter used to create unique IDs
	addEvent.guid = 1;
	
	function removeEvent(element, type, handler) {
	    var delegateWrapper = handler._delegateWrapper;
	    element = domQuery.one(element);
	    if (element.removeEventListener) {
	        element.removeEventListener(type, handler, false);
	        element.removeEventListener(type, delegateWrapper, false);
	    } else {
	        // delete the event handler from the hash table
	        if (element.events && element.events[type]) {
	            delete element.events[type][handler.$$guid];
	            delete element.events[type][delegateWrapper.$$guid];
	        }
	    }
	}
	
	function handleEvent(event) {
	    /* jshint validthis:true */
	    var returnValue = true;
	    var elem = this;
	    // grab the event object (IE uses a global event object)
	    event = event || fixEvent((doc.parentWindow || win).event);
	    // get a reference to the hash table of event handlers
	    var handlers = elem.events[event.type];
	    // execute each event handler
	    for (var i in handlers) {
	        elem.$$handleEvent = handlers[i];
	        if (elem.$$handleEvent(event) === false) {
	            returnValue = false;
	        }
	    }
	    return returnValue;
	}
	
	function fixEvent(event) {
	    // add W3C standard event methods
	    event.preventDefault = fixEvent.preventDefault;
	    event.stopPropagation = fixEvent.stopPropagation;
	    return event;
	}
	fixEvent.preventDefault = function () {
	    this.returnValue = false;
	};
	fixEvent.stopPropagation = function () {
	    this.cancelBubble = true;
	};
	
	function delegate(element, type, selector, handler, capture, once) {
	    if (checkType.isFunction(selector)) {
	        addEvent(element, type, selector);
	        return;
	    }
	    element = domQuery.one(element); // delegation is only for one element
	    if (!domUtils.isDomNode(element)) {
	        throw 'cannot bind events to non-elements: ' + element;
	    }
	    function wrapper(e) {
	        // if this event has a delegateTarget, then we add it to the event
	        // object (so that handlers may have a reference to the delegator
	        // element) and fire the callback
	        /*jshint -W084 */
	        if (e.delegateTarget = _getDelegateTarget(element, e.target, selector)) {
	            if (once === true) {
	                removeEvent(element, type, wrapper);
	            }
	            handler.call(element, e);
	        }
	    }
	    handler._delegateWrapper = wrapper;
	    addEvent(element, type, wrapper, capture || false);
	    return handler;
	}
	function _getDelegateTarget(element, target, selector) {
	    while (target && target !== element) {
	        if (domQuery.match(target, selector)) {
	            return target;
	        }
	        target = target.parentElement;
	    }
	    return null;
	}
	
	function once(element, type, selector, callback, capture) {
	    delegate(element, type, selector, callback, capture, true);
	}
	
	module.exports = {
	    on: delegate,
	    off: removeEvent,
	    once: once
	};

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var arrayUtils = __webpack_require__(4);
	var isArrayLike = arrayUtils.isArrayLike;
	var contains = arrayUtils.contains;
	var toArray = arrayUtils.toArray;
	var some = arrayUtils.some;
	var flatten = arrayUtils.flatten;
	
	var checkType = __webpack_require__(2);
	var isString = checkType.isString;
	
	var domUtils = __webpack_require__(6);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(2);
	var numberUtils = __webpack_require__(5);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(2);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var stringUtils = __webpack_require__(7);
	
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var checkType = __webpack_require__(2);
	
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global location */
	// TODO reconstruct
	
	var Promise = __webpack_require__(9);
	var json = __webpack_require__(17);
	var xhr = __webpack_require__(19);
	
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process) {'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global setImmediate, process, setTimeout */
	
	var arrayUtils = __webpack_require__(4);
	var objectUtils = __webpack_require__(12);
	var checkType = __webpack_require__(2);
	var declare = __webpack_require__(13);
	
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate, __webpack_require__(11)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(11).nextTick;
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).setImmediate, __webpack_require__(10).clearImmediate))

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var checkType = __webpack_require__(2);
	var getType = checkType.getType;
	var isFunction = checkType.isFunction;
	var isObject = checkType.isObject;
	var isPlainObject = checkType.isPlainObject;
	
	var arrayUtils = __webpack_require__(4);
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var lang = __webpack_require__(14);
	var c3mroMerge = __webpack_require__(16);
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint esnext: true, loopfunc: true */
	
	var objectUtils = __webpack_require__(12);
	
	module.exports = objectUtils.extend({
	        global: __webpack_require__(15)
	}, objectUtils, __webpack_require__(4), __webpack_require__(5), __webpack_require__(7), __webpack_require__(2));

/***/ },
/* 15 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, global, self */
	
	var undefStr = 'undefined';
	
	module.exports = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefStr ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) !== undefStr ? global : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) !== undefStr ? self : {};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var arrayUtils = __webpack_require__(4);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var arrayUtils = __webpack_require__(4);
	var checkType = __webpack_require__(2);
	var fmtDate = __webpack_require__(18);
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	var checkType = __webpack_require__(2);
	
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
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window */
	// reference: https://github.com/jgallen23/routie/blob/master/lib/routie.js
	
	var HashRoute = __webpack_require__(21);
	var checkType = __webpack_require__(2);
	var objectUtils = __webpack_require__(12);
	var arrayUtils = __webpack_require__(4);
	var domEvent = __webpack_require__(22);
	
	var routes = [];
	var map = {};
	
	function hashRouter(path, fn) {
	    if (checkType.isFunction(fn)) {
	        addHandler(path, fn);
	        hashChanged();
	    } else if (checkType.isObject(path)) {
	        for (var p in path) {
	            addHandler(p, path[p]);
	        }
	        hashChanged();
	    } else if (checkType.isUndefined(fn)) {
	        hashRouter.navigate(path);
	    }
	}
	
	function addHandler(path, fn) {
	    var s = path.split(' ');
	    var name = s.length == 2 ? s[0] : null;
	    path = s.length == 2 ? s[1] : s[0];
	
	    if (!map[path]) {
	        map[path] = new HashRoute(path, name);
	        routes.push(map[path]);
	    }
	    map[path].addHandler(fn);
	}
	function getHash() {
	    return window.location.hash.substring(1);
	}
	function checkRoute(hash, route) {
	    var params = [];
	    if (route.match(hash, params)) {
	        route.apply(params);
	        return true;
	    }
	    return false;
	}
	function hashChanged() {
	    var hash = getHash();
	    arrayUtils.some(routes, function (route) {
	        return checkRoute(hash, route); // FIXME only match one route
	    });
	}
	function clear() {
	    map = {};
	    routes = [];
	}
	function addListener() {
	    domEvent.on(window, 'hashchange', hashChanged);
	}
	function removeListener() {
	    domEvent.off(window, 'hashchange', hashChanged);
	}
	function navigate(path, options) {
	    options = options || {};
	    var silent = options.silent || false;
	
	    if (silent) {
	        removeListener();
	    }
	    setTimeout(function () {
	        window.location.hash = path;
	        if (silent) {
	            setTimeout(function () {
	                addListener();
	            }, 1);
	        }
	    }, 1);
	}
	
	objectUtils.extend(hashRouter, {
	    reload: hashChanged,
	    lookup: function lookup(name, obj) {
	        var result;
	        arrayUtils.some(routes, function (route) {
	            if (route.name === name) {
	                result = route.toURL(obj);
	                return true;
	            }
	        });
	        return result;
	    },
	    remove: function remove(path, fn) {
	        var route = map[path];
	        if (!route) {
	            return;
	        }
	        route.removeHandler(fn);
	    },
	    removeAll: clear,
	    clear: clear,
	    navigate: navigate,
	    addListener: addListener,
	    removeListener: removeListener
	});
	
	addListener();
	
	module.exports = hashRouter;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	///* global */
	// reference: https://github.com/jgallen23/routie/blob/master/lib/routie.js
	
	var declare = __webpack_require__(13);
	var checkType = __webpack_require__(2);
	var arrayUtils = __webpack_require__(4);
	
	var Route = declare({
	    constructor: function HashRoute(path, name) {
	        var me = this;
	        me.name = name;
	        me.path = path;
	        me.keys = [];
	        me.handlers = [];
	        me.params = {};
	        me.regex = pathToRegexp(this.path, this.keys, false, false);
	    },
	    addHandler: function addHandler(fn) {
	        this.handlers.push(fn);
	    },
	    removeHandler: function removeHandler(fn) {
	        arrayUtils.remove(this.handlers, arrayUtils.indexOf(this.handlers, fn));
	    },
	    apply: function apply(params) {
	        var me = this;
	        var handlers = me.handlers;
	        arrayUtils.each(handlers, function (fn) {
	            fn.apply(me, params);
	        });
	    },
	    match: function match(path, params) {
	        var me = this;
	        var m = me.regex.exec(path);
	
	        if (!m) return false;
	
	        for (var i = 1, len = m.length; i < len; ++i) {
	            var key = me.keys[i - 1];
	            var val = checkType.isString(m[i]) ? decodeURIComponent(m[i]) : m[i];
	
	            if (key) {
	                me.params[key.name] = val;
	            }
	            params.push(val);
	        }
	
	        return true;
	    },
	    toURL: function toURL(params) {
	        var path = this.path;
	        for (var param in params) {
	            path = path.replace('/:' + param, '/' + params[param]);
	        }
	        path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
	        if (path.indexOf(':') != -1) {
	            throw new Error('missing parameters for url: ' + path);
	        }
	        return path;
	    }
	});
	
	function pathToRegexp(path, keys, sensitive, strict) {
	    if (checkType.isRegExp(path)) {
	        return path;
	    }
	    if (checkType.isArray(path)) {
	        path = '(' + path.join('|') + ')';
	    }
	    path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/\+/g, '__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
	        keys.push({ name: key, optional: !!optional });
	        slash = slash || '';
	        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || format && '([^/.]+?)' || '([^/]+?)') + ')' + (optional || '');
	    }).replace(/([\/.])/g, '\\$1').replace(/__plus__/g, '(.+)').replace(/\*/g, '(.*)');
	    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
	}
	
	module.exports = Route;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: event firing
	 * @reference: http://dean.edwards.name/weblog/2005/10/add-event/
	 */
	
	var checkType = __webpack_require__(2);
	var domQuery = __webpack_require__(23);
	var domUtils = __webpack_require__(24);
	
	var doc = document;
	var win = window;
	
	function addEvent(element, type, handler) {
	    element = domQuery.one(element);
	    if (element.addEventListener) {
	        element.addEventListener(type, handler, false);
	    } else {
	        // assign each event handler a unique ID
	        if (!handler.$$guid) {
	            handler.$$guid = addEvent.guid++;
	        }
	        // create a hash table of event types for the element
	        if (!element.events) {
	            element.events = {};
	        }
	        // create a hash table of event handlers for each element/event pair
	        var handlers = element.events[type];
	        if (!handlers) {
	            handlers = element.events[type] = {};
	            // store the existing event handler (if there is one)
	            if (element['on' + type]) {
	                handlers[0] = element["on" + type];
	            }
	        }
	        // store the event handler in the hash table
	        handlers[handler.$$guid] = handler;
	        // assign a global event handler to do all the work
	        element['on' + type] = handleEvent;
	    }
	}
	// a counter used to create unique IDs
	addEvent.guid = 1;
	
	function removeEvent(element, type, handler) {
	    var delegateWrapper = handler._delegateWrapper;
	    element = domQuery.one(element);
	    if (element.removeEventListener) {
	        element.removeEventListener(type, handler, false);
	        element.removeEventListener(type, delegateWrapper, false);
	    } else {
	        // delete the event handler from the hash table
	        if (element.events && element.events[type]) {
	            delete element.events[type][handler.$$guid];
	            delete element.events[type][delegateWrapper.$$guid];
	        }
	    }
	}
	
	function handleEvent(event) {
	    /* jshint validthis:true */
	    var returnValue = true;
	    var elem = this;
	    // grab the event object (IE uses a global event object)
	    event = event || fixEvent((doc.parentWindow || win).event);
	    // get a reference to the hash table of event handlers
	    var handlers = elem.events[event.type];
	    // execute each event handler
	    for (var i in handlers) {
	        elem.$$handleEvent = handlers[i];
	        if (elem.$$handleEvent(event) === false) {
	            returnValue = false;
	        }
	    }
	    return returnValue;
	}
	
	function fixEvent(event) {
	    // add W3C standard event methods
	    event.preventDefault = fixEvent.preventDefault;
	    event.stopPropagation = fixEvent.stopPropagation;
	    return event;
	}
	fixEvent.preventDefault = function () {
	    this.returnValue = false;
	};
	fixEvent.stopPropagation = function () {
	    this.cancelBubble = true;
	};
	
	function delegate(element, type, selector, handler, capture, once) {
	    if (checkType.isFunction(selector)) {
	        addEvent(element, type, selector);
	        return;
	    }
	    element = domQuery.one(element); // delegation is only for one element
	    if (!domUtils.isDomNode(element)) {
	        throw 'cannot bind events to non-elements: ' + element;
	    }
	    function wrapper(e) {
	        // if this event has a delegateTarget, then we add it to the event
	        // object (so that handlers may have a reference to the delegator
	        // element) and fire the callback
	        /*jshint -W084 */
	        if (e.delegateTarget = _getDelegateTarget(element, e.target, selector)) {
	            if (once === true) {
	                removeEvent(element, type, wrapper);
	            }
	            handler.call(element, e);
	        }
	    }
	    handler._delegateWrapper = wrapper;
	    addEvent(element, type, wrapper, capture || false);
	    return handler;
	}
	function _getDelegateTarget(element, target, selector) {
	    while (target && target !== element) {
	        if (domQuery.match(target, selector)) {
	            return target;
	        }
	        target = target.parentElement;
	    }
	    return null;
	}
	
	function once(element, type, selector, callback, capture) {
	    delegate(element, type, selector, callback, capture, true);
	}
	
	module.exports = {
	    on: delegate,
	    off: removeEvent,
	    once: once
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var arrayUtils = __webpack_require__(4);
	var isArrayLike = arrayUtils.isArrayLike;
	var contains = arrayUtils.contains;
	var toArray = arrayUtils.toArray;
	var some = arrayUtils.some;
	var flatten = arrayUtils.flatten;
	
	var checkType = __webpack_require__(2);
	var isString = checkType.isString;
	
	var domUtils = __webpack_require__(24);
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global document, window */
	
	var stringUtils = __webpack_require__(7);
	
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _global = __webpack_require__(15);
	
	var _global2 = _interopRequireDefault(_global);
	
	var _toc = __webpack_require__(26);
	
	var _toc2 = _interopRequireDefault(_toc);
	
	var _generate = __webpack_require__(40);
	
	var _generate2 = _interopRequireDefault(_generate);
	
	var _utils = __webpack_require__(42);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _object = __webpack_require__(12);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var main = (0, _object.extend)({
	    Toc: _toc2.default,
	    generate: _generate2.default
	}, _utils2.default); /**
	                      * Created by liangwensen on 2/17/16.
	                      */
	
	_global2.default.tg = _global2.default.tocGenerator = main;
	
	exports.default = main;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _declare = __webpack_require__(13);
	
	var _declare2 = _interopRequireDefault(_declare);
	
	var _class = __webpack_require__(27);
	
	var _class2 = _interopRequireDefault(_class);
	
	var _construct = __webpack_require__(28);
	
	var _construct2 = _interopRequireDefault(_construct);
	
	var _data = __webpack_require__(30);
	
	var _data2 = _interopRequireDefault(_data);
	
	var _event = __webpack_require__(1);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _query = __webpack_require__(3);
	
	var _query2 = _interopRequireDefault(_query);
	
	var _style = __webpack_require__(31);
	
	var _style2 = _interopRequireDefault(_style);
	
	var _event3 = __webpack_require__(32);
	
	var _event4 = _interopRequireDefault(_event3);
	
	var _zeroLang = __webpack_require__(14);
	
	var _zeroLang2 = _interopRequireDefault(_zeroLang);
	
	var _sprintf = __webpack_require__(33);
	
	var _sprintf2 = _interopRequireDefault(_sprintf);
	
	var _templateHelper = __webpack_require__(34);
	
	var _templateHelper2 = _interopRequireDefault(_templateHelper);
	
	var _expander = __webpack_require__(36);
	
	var _expander2 = _interopRequireDefault(_expander);
	
	var _link = __webpack_require__(37);
	
	var _link2 = _interopRequireDefault(_link);
	
	var _linkList = __webpack_require__(38);
	
	var _linkList2 = _interopRequireDefault(_linkList);
	
	var _const = __webpack_require__(39);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var extend = _zeroLang2.default.extend; /**
	                                         * Created by liangwensen on 2/17/16.
	                                         */
	
	var body = document.body;
	
	function addHeaderExpander(header, options) {
	    if (!header._expanderElement) {
	        _construct2.default.place((0, _expander2.default)({
	            uniqueId: header.uniqueId,
	            className: options.expanderClassName
	        }), header.element, 'first');
	        header._expanderElement = _query2.default.one('.' + options.expanderClassName, header.element);
	    }
	}
	
	function toggleHeaderExpanderText(header, options, isExpanded) {
	    header._expanderElement.innerHTML = isExpanded ? options.expanderExpandedText : options.expanderText;
	}
	
	var Toc = (0, _declare2.default)({
	    constructor: function constructor(links, options) {
	        var me = this;
	
	        (0, _event4.default)(me);
	        me._options = extend({}, _const.DEFAULT_OPTIONS, options);
	        me._render(links);
	        me._bindEvents();
	        me._srcElement = options.srcElement || body;
	        return me;
	    },
	    _render: function _render(links) {
	        var me = this;
	        var options = me._options;
	        var tocElement = me._outerDomNode = _construct2.default.toDom((0, _linkList2.default)({}, _templateHelper2.default));
	        var currentHeaderMeta = undefined;
	        var headerMetaById = {};
	
	        function addToChildren(headerMeta, parentHeaderMeta) {
	            var childrenElement = _query2.default.one('ul', parentHeaderMeta.element);
	            if (!childrenElement) {
	                childrenElement = _construct2.default.toDom((0, _linkList2.default)({}, _templateHelper2.default));
	                _construct2.default.place(childrenElement, parentHeaderMeta.element);
	            }
	
	            _construct2.default.place(headerMeta.element, childrenElement);
	            headerMeta.parentId = parentHeaderMeta.uniqueId;
	            parentHeaderMeta.children.push(headerMeta.uniqueId);
	            parentHeaderMeta.childrenElement = childrenElement;
	            addHeaderExpander(parentHeaderMeta, options);
	        }
	
	        _zeroLang2.default.each(links, function (meta) {
	            _zeroLang2.default.extend(meta, {
	                isExpanded: true,
	                expanderClassName: options.expanderClassName,
	                textClassName: options.textClassName,
	                children: []
	            });
	            var level = meta.level;
	            var linkElement = _construct2.default.toDom((0, _link2.default)(meta, _templateHelper2.default));
	            meta.element = linkElement;
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
	            currentHeaderMeta = meta;
	            headerMetaById[meta.uniqueId] = meta;
	        });
	
	        _zeroLang2.default.forIn(headerMetaById, function (meta) {
	            if (meta.children.length) {
	                _class2.default.add(meta.element, options.hasChildClassName);
	            }
	        });
	
	        me._headerMetaById = headerMetaById;
	
	        return me;
	    },
	    _bindEvents: function _bindEvents() {
	        var me = this;
	        var options = me._options;
	
	        _event2.default.on(me._outerDomNode, 'click', '.' + options.expanderClassName, function (e) {
	            var delegateTarget = e.delegateTarget;
	            var uniqueId = _data2.default.get(delegateTarget, 'unique');
	            var headerMeta = me._headerMetaById[uniqueId];
	            me.expandOrCollapse(uniqueId);
	            if (headerMeta.isExpanded) {
	                me.trigger('expanded', headerMeta);
	            } else {
	                me.trigger('collapsed', headerMeta);
	            }
	        });
	
	        _event2.default.on(me._outerDomNode, 'click', '.' + options.textClassName, function (e) {
	            var delegateTarget = e.delegateTarget;
	            var uniqueId = _data2.default.get(delegateTarget, 'unique');
	            me.scrollTo(uniqueId);
	            me.trigger('clicked', me._headerMetaById[uniqueId]);
	        });
	
	        return me;
	    },
	    _unbindEvents: function _unbindEvents() {
	        var me = this;
	        me.trigger('unbind-events');
	        return me;
	    },
	    expand: function expand(id) {
	        var me = this;
	        var header = me._headerMetaById[id];
	        if (header && header.childrenElement) {
	            _style2.default.show(header.childrenElement);
	            toggleHeaderExpanderText(header, me._options, true);
	            header.isExpanded = true;
	        }
	
	        return me;
	    },
	    collapse: function collapse(id) {
	        var me = this;
	        var header = me._headerMetaById[id];
	        if (header && header.childrenElement) {
	            _style2.default.hide(header.childrenElement);
	            toggleHeaderExpanderText(header, me._options);
	            header.isExpanded = false;
	        }
	
	        return me;
	    },
	    expandOrCollapse: function expandOrCollapse(id) {
	        var me = this;
	        var header = me._headerMetaById[id];
	        if (header) {
	            me[header.isExpanded ? 'collapse' : 'expand'](id);
	        }
	
	        return me;
	    },
	    scrollTo: function scrollTo(uniqueId) {
	        var me = this;
	        var anchorSelector = (0, _sprintf2.default)('.toc-anchor[data-unique="%s"]', uniqueId);
	        try {
	            var anchorNode = _query2.default.one(anchorSelector, me._srcElement);
	            if (anchorNode) {
	                anchorNode.scrollIntoView(true);
	            }
	        } catch (e) {}
	
	        return me;
	    },
	    placeAt: function placeAt(container, position) {
	        var me = this;
	        if (container) {
	            container = _query2.default.one(container);
	        }
	
	        container = container || body;
	        position = position || '';
	        _construct2.default.place(me._outerDomNode, container, position);
	        return me;
	    },
	    destroy: function destroy() {
	        var me = this;
	
	        // unbind all events
	        me._unbindEvents();
	
	        _construct2.default.destroy(me._outerDomNode);
	        return me;
	    }
	});
	
	exports.default = Toc;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	///* global */
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: dom classList related
	 * @note: if ClassList is supported, use ClassList
	 */
	
	var domQuery = __webpack_require__(3);
	var domUtils = __webpack_require__(6);
	var arrayUtils = __webpack_require__(4);
	var stringUtils = __webpack_require__(7);
	
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, document */
	
	/*
	 * @author      : 绝云（wensen.lws）
	 * @description : dom constructure related
	 * @reference   : https://github.com/dojo/dojo/blob/master/dom-construct.js
	 */
	
	var bomUtils = __webpack_require__(29);
	var arrayUtils = __webpack_require__(4);
	var objectUtils = __webpack_require__(12);
	var stringUtils = __webpack_require__(7);
	var checkType = __webpack_require__(2);
	
	var domQuery = __webpack_require__(3);
	
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/* global window, location, navigator, ActiveXObject */
	
	var lang = __webpack_require__(14);
	
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	///* global */
	
	var domUtils = __webpack_require__(6);
	var domQuery = __webpack_require__(3);
	
	var queryOne = domQuery.one;
	
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: dom dataSet related
	 * @note: if DataSet is supported, use DataSet
	 */
	
	var dataSetStr = 'dataset';
	var dataPrefix = 'data-';
	
	function toDashed(name) {
	    return name.replace(/([A-Z])/g, function (u) {
	        return '-' + u.toLowerCase();
	    });
	}
	
	var dataset = domUtils.hasDataSet ? {
	    set: function set(node, attr, value) {
	        node = queryOne(node);
	        node[dataSetStr][attr] = value;
	    },
	    get: function get(node, attr) {
	        node = queryOne(node);
	        return node[dataSetStr][attr];
	    },
	    remove: function remove(node, attr) {
	        node = queryOne(node);
	        delete node[dataSetStr][attr];
	    }
	} : {
	    set: function set(node, attr, value) {
	        node = queryOne(node);
	        node.setAttribute(dataPrefix + toDashed(attr), value);
	    },
	    get: function get(node, attr) {
	        node = queryOne(node);
	        return node.getAttribute(dataPrefix + toDashed(attr));
	    },
	    remove: function remove(node, attr) {
	        node = queryOne(node);
	        node.removeAttribute(dataPrefix + toDashed(attr));
	    }
	
	};
	
	module.exports = dataset;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	///* global */
	
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: dom style
	 */
	var arrayUtils = __webpack_require__(4);
	var stringUtils = __webpack_require__(7);
	var bomUtils = __webpack_require__(29);
	
	var domData = __webpack_require__(30);
	var domUtils = __webpack_require__(6);
	var domQuery = __webpack_require__(3);
	
	var ieVersion = bomUtils.versions.msie || 0;
	var astr = 'DXImageTransform.Microsoft.Alpha';
	var RE_pixel = /margin|padding|width|height|max|min|offset/; // |border
	var pixelNamesCache = {
	    left: true,
	    top: true
	};
	var floatAlias = {
	    cssFloat: 1,
	    styleFloat: 1,
	    'float': 1
	};
	
	var getComputedStyle = undefined;
	var toPixel = undefined;
	var domStyle = undefined;
	var getOpacity = undefined;
	var _setOpacity = undefined;
	
	function af(n, f) {
	    try {
	        return n.filters.item(astr);
	    } catch (e) {
	        return f ? {} : null;
	    }
	}
	function isHidden(element) {
	    return domStyle.get(element, 'display') === 'none' || domUtils.contains(element.ownerDocument, element);
	}
	function showHide(elements, show) {
	    var display = undefined,
	        hidden = undefined;
	    var values = [];
	
	    arrayUtils.each(elements, function (elem, index) {
	        if (elem.style) {
	            values[index] = domData.get(elem, 'olddisplay');
	            display = elem.style.display;
	            if (show) {
	                // Reset the inline display of this element to learn if it is
	                // being hidden by cascaded rules or not
	                if (!values[index] && display === 'none') {
	                    elem.style.display = '';
	                }
	
	                // Set elements which have been overridden with display: none
	                // in a stylesheet to whatever the default browser style is
	                // for such an element
	                if (elem.style.display === '' && isHidden(elem)) {
	                    values[index] = domData.set(elem, 'olddisplay', domStyle.get(elem, 'display'));
	                }
	            } else {
	                hidden = isHidden(elem);
	
	                if (display !== 'none' || !hidden) {
	                    domData.set(elem, 'olddisplay', hidden ? display : domStyle.get(elem, 'display'));
	                }
	            }
	        }
	    });
	
	    // Set the display of most of the elements in a second loop
	    // to avoid the constant reflow
	    arrayUtils.each(elements, function (elem, index) {
	        if (elem.style) {
	            if (!show || elem.style.display === 'none' || elem.style.display === '') {
	                elem.style.display = show ? values[index] || '' : 'none';
	            }
	        }
	    });
	    return elements;
	}
	function toStyleValue(node, type, value) {
	    type = stringUtils.lc(type);
	    if (ieVersion || bomUtils.versions.trident) {
	        if (value === 'auto') {
	            if (type === 'height') {
	                return node.offsetHeight;
	            }
	            if (type === 'width') {
	                return node.offsetWidth;
	            }
	        }
	        if (type === 'fontweight') {
	            switch (value) {
	                case 700:
	                    return 'bold';
	                // case 400:
	                default:
	                    return 'normal';
	            }
	        }
	    }
	    if (!(type in pixelNamesCache)) {
	        pixelNamesCache[type] = RE_pixel.test(type);
	    }
	    return pixelNamesCache[type] ? toPixel(node, value) : value;
	}
	
	if (ieVersion && (ieVersion < 9 || ieVersion < 10 && bomUtils.isQuirks)) {
	    getOpacity = function getOpacity(node) {
	        try {
	            return af(node).Opacity / 100; // Number
	        } catch (e) {
	            return 1; // Number
	        }
	    };
	    _setOpacity = function setOpacity( /*DomNode*/node, /*Number*/opacity) {
	        if (opacity === '') {
	            opacity = 1;
	        }
	        var ov = opacity * 100;
	        var fullyOpaque = opacity === 1;
	
	        // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (bug #2661),
	        // but still update the opacity value so we can get a correct reading if it is read later:
	        // af(node, 1).Enabled = !fullyOpaque;
	        if (fullyOpaque) {
	            node.style.zoom = '';
	            if (af(node)) {
	                node.style.filter = node.style.filter.replace(new RegExp('\\s*progid:' + astr + '\\([^\\)]+?\\)', 'i'), '');
	            }
	        } else {
	            node.style.zoom = 1;
	            if (af(node)) {
	                af(node, 1).Opacity = ov;
	            } else {
	                node.style.filter += ' progid:' + astr + '(Opacity=' + ov + ')';
	            }
	            af(node, 1).Enabled = true;
	        }
	
	        if (node.tagName.toLowerCase() === 'tr') {
	            for (var td = node.firstChild; td; td = td.nextSibling) {
	                if (td.tagName.toLowerCase() === 'td') {
	                    _setOpacity(td, opacity);
	                }
	            }
	        }
	        return opacity;
	    };
	} else {
	    getOpacity = function getOpacity(node) {
	        return getComputedStyle(node).opacity;
	    };
	    _setOpacity = function _setOpacity(node, opacity) {
	        node.style.opacity = opacity;
	        return opacity;
	    };
	}
	
	// getComputedStyle {
	if (bomUtils.isWebkit) {
	    getComputedStyle = function getComputedStyle(node) {
	        var style = undefined;
	        if (node.nodeType === 1) {
	            var dv = node.ownerDocument.defaultView;
	            var oldDisplay = undefined;
	            style = dv.getComputedStyle(node, null);
	            if (!style && node.style) {
	                /*
	                 * early version safari (2.0?) has this bug: when element is display:none,
	                 * getComputedStyle returns null
	                 */
	                oldDisplay = node.style.display;
	                node.style.display = '';
	                style = dv.getComputedStyle(node, null);
	            }
	            node.style.display = oldDisplay; // and we should change it back.
	        }
	        return style || {};
	    };
	} else if (ieVersion && ieVersion < 9 || bomUtils.isQuirks) {
	    getComputedStyle = function getComputedStyle(node) {
	        return node.nodeType === 1 && node.currentStyle ? node.currentStyle : {};
	    };
	} else {
	    getComputedStyle = function getComputedStyle(node) {
	        return node.nodeType === 1 ? node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
	    };
	}
	// }
	// toPixel {
	if (ieVersion) {
	    toPixel = function toPixel(element, avalue) {
	        if (!avalue) {
	            return 0;
	        }
	        // on IE7, medium is usually 4 pixels
	        if (avalue === 'medium') {
	            return 4;
	        }
	        // style values can be floats, client code may
	        // want to round this value for integer pixels.
	        if (avalue.slice && avalue.slice(-2) === 'px') {
	            return parseFloat(avalue);
	        }
	        var s = element.style;
	        var rs = element.runtimeStyle;
	        var cs = element.currentStyle;
	        var sLeft = s.left;
	        var rsLeft = rs.left;
	        rs.left = cs.left;
	        try {
	            // 'avalue' may be incompatible with style.left, which can cause IE to throw
	            // this has been observed for border widths using 'thin', 'medium', 'thick' constants
	            // those particular constants could be trapped by a lookup
	            // but perhaps there are more
	            s.left = avalue;
	            avalue = s.pixelLeft;
	        } catch (e) {
	            avalue = 0;
	        }
	        s.left = sLeft;
	        rs.left = rsLeft;
	        return avalue;
	    };
	} else {
	    toPixel = function toPixel(element, value) {
	        return parseFloat(value) || 0;
	    };
	}
	// }
	
	domStyle = {
	    getComputedStyle: getComputedStyle,
	    toPixel: toPixel,
	
	    get: function get(node, name) {
	        var n = domQuery.one(node);
	        var l = arguments.length;
	        var op = name === 'opacity';
	        var style = undefined;
	        if (l === 2 && op) {
	            return getOpacity(n);
	        }
	        name = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
	        style = domStyle.getComputedStyle(n);
	        return l === 1 ? style : toStyleValue(n, name, style[name] || n.style[name]);
	    },
	    set: function set(node, name, value) {
	        var n = domQuery.one(node);
	        var l = arguments.length;
	        var op = name === 'opacity';
	
	        name = floatAlias[name] ? 'cssFloat' in n.style ? 'cssFloat' : 'styleFloat' : name;
	        if (l === 3) {
	            return op ? _setOpacity(n, value) : n.style[name] = value;
	        }
	        for (var x in name) {
	            domStyle.set(node, x, name[x]);
	        }
	        return domStyle.getComputedStyle(n);
	    },
	
	    // TODO use animation-version instead
	    show: function show(node) {
	        showHide(domQuery.all(node), true);
	    },
	    hide: function hide(node) {
	        showHide(domQuery.all(node), false);
	    },
	    toggle: function toggle(node) {
	        return domStyle.get(node, 'display') === 'none' ? domStyle.show(node) : domStyle.hide(node);
	    }
	};
	
	module.exports = domStyle;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	
	// TODO NEED to strengthen
	
	var arrayUtils = __webpack_require__(4);
	
	var event = function event(target) {
	    // if target not defined, it is a global event
	    target = target || this;
	
	    // all events stores in the the collection: *._events
	    var events = target._events = {};
	
	    target.on = function (name, callback, context) {
	        /*
	         * @description: 绑定事件
	         */
	        var list = events[name] || (events[name] = []);
	        list.push({
	            callback: callback,
	            context: context
	        });
	        return target;
	    };
	    target.off = function (name, callback) {
	        /*
	         * @description: 解绑事件
	         */
	        if (!name) {
	            events = {};
	            return target;
	        }
	        var list = events[name] || [];
	        var i = list.length;
	        if (!callback) {
	            list = [];
	        } else {
	            while (i > 0) {
	                i--;
	                if (list[i].callback === callback) {
	                    list.splice(i, 1);
	                }
	            }
	        }
	        events[name] = list;
	        return target;
	    };
	    target.emit = function () {
	        /*
	         * @description: 触发事件
	         */
	        var args = arrayUtils.toArray(arguments);
	        var list = events[args.shift()] || [];
	        arrayUtils.each(list, function (evt) {
	            if (!evt.callback) {
	                throw 'event callback is not defined';
	            }
	            evt.callback.apply(evt.context, args);
	        });
	        return target;
	    };
	    target.trigger = target.emit; // alias
	    return target;
	};
	
	module.exports = event;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true, boss: true */
	
	var lang = __webpack_require__(14);
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _zeroLang = __webpack_require__(14);
	
	var _zeroLang2 = _interopRequireDefault(_zeroLang);
	
	var _html = __webpack_require__(35);
	
	var _html2 = _interopRequireDefault(_html);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by liangwensen on 3/16/16.
	 */
	
	var templateHelper = _zeroLang2.default.extend({}, _html2.default, _zeroLang2.default);
	
	exports.default = templateHelper;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* jshint node: true, esnext: true, loopfunc: true, undef: true, unused: true */
	/*
	 * @author: 绝云（wensen.lws）
	 * @description: utils for html
	 */
	
	var objectUtils = __webpack_require__(12);
	
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
/* 36 */
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
	    };var _s = '<span class="' + _e(data.className) + '" data-unique="' + _e(data.uniqueId) + '">&blacktriangledown;</span>';return _s;
	};

/***/ },
/* 37 */
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
	    };var _s = '<li class="toc-link level' + _e(data.level) + '"><span class="' + _e(data.textClassName) + '" data-unique="' + _e(data.uniqueId) + '">' + _e(data.text) + '</span></li>';return _s;
	};

/***/ },
/* 38 */
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

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Created by liangwensen on 3/16/16.
	 */
	
	var DEFAULT_OPTIONS = {
	    expanderClassName: 'link-expander',
	    expanderExpandedText: '&blacktriangledown;',
	    expanderText: '&blacktriangleright;',
	    hasChildClassName: 'has-child',
	    maxDepth: 3,
	    textClassName: 'link-text',
	    uniqueIdSeparator: '-',
	    uniqueIdSuffix: '1',
	    uniqueIdPrefix: '/'
	};
	
	exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _construct = __webpack_require__(28);
	
	var _construct2 = _interopRequireDefault(_construct);
	
	var _data = __webpack_require__(30);
	
	var _data2 = _interopRequireDefault(_data);
	
	var _event = __webpack_require__(1);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _query = __webpack_require__(3);
	
	var _query2 = _interopRequireDefault(_query);
	
	var _zeroLang = __webpack_require__(14);
	
	var _zeroLang2 = _interopRequireDefault(_zeroLang);
	
	var _toc = __webpack_require__(26);
	
	var _toc2 = _interopRequireDefault(_toc);
	
	var _anchor = __webpack_require__(41);
	
	var _anchor2 = _interopRequireDefault(_anchor);
	
	var _templateHelper = __webpack_require__(34);
	
	var _templateHelper2 = _interopRequireDefault(_templateHelper);
	
	var _const = __webpack_require__(39);
	
	var _utils = __webpack_require__(42);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Created by liangwensen on 3/16/16.
	 */
	
	var body = document.body;
	
	function locationCallback(e) {
	    var delegateTarget = e.delegateTarget;
	    var uniqueId = _data2.default.get(delegateTarget, 'unique');
	    _zeroLang2.default.global.location = '#' + uniqueId;
	    delegateTarget.scrollIntoView(true);
	}
	
	function generate(element, options) {
	    options = _zeroLang2.default.extend({}, _const.DEFAULT_OPTIONS, options);
	    if (element) {
	        element = _query2.default.one(element);
	    }
	    element = element || body;
	
	    var links = [];
	    var headers = _query2.default.all((0, _utils.getHeaderSelector)(options.maxDepth), element);
	    var headerMetaById = {};
	
	    function getHeaderUniqueId(text) {
	        var id = text.replace(/\s+/g, options.uniqueIdSeparator).replace(/\\/g, options.uniqueIdSeparator).replace(/\//g, options.uniqueIdSeparator);
	        var resultId = options.uniqueIdPrefix + id;
	        if (!_zeroLang2.default.hasKey(headerMetaById, resultId)) {
	            return resultId;
	        }
	        return getHeaderUniqueId(id + options.uniqueIdSuffix);
	    }
	
	    _zeroLang2.default.each(headers, function (header) {
	        var level = (0, _utils.getHeaderLevel)(header);
	        var text = (0, _utils.getHeaderText)(header);
	        var uniqueId = getHeaderUniqueId(text);
	        var meta = {
	            text: text,
	            uniqueId: uniqueId,
	            level: level
	        };
	        var anchorElement = _construct2.default.toDom((0, _anchor2.default)(meta, _templateHelper2.default));
	        meta.anchorElement = anchorElement;
	        _construct2.default.place(anchorElement, header, 'first'); // add anchor to header
	
	        headerMetaById[uniqueId] = meta;
	        links.push(meta);
	    });
	
	    var toc = new _toc2.default(links, _zeroLang2.default.extend({
	        srcElement: element
	    }, options));
	
	    _event2.default.on(element, 'click', '.toc-anchor', locationCallback);
	    toc.on('unbind-events', function () {
	        _event2.default.off(element, 'click', locationCallback);
	        // remove all dom nodes
	        _zeroLang2.default.each(_query2.default.all('.toc-anchor', element), function (anchor) {
	            _construct2.default.destroy(anchor);
	        });
	    });
	
	    return toc;
	}
	
	exports.default = generate;

/***/ },
/* 41 */
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getHeaderLevel = getHeaderLevel;
	exports.getHeaderText = getHeaderText;
	exports.getHeaderSelector = getHeaderSelector;
	
	var _number = __webpack_require__(5);
	
	var _sprintf = __webpack_require__(33);
	
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

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map