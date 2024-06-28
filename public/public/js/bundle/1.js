(function () {
'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var setGlobal = function (key, value) {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(global_1, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.16.4',
  mode:  'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var hasOwnProperty = {}.hasOwnProperty;

var has = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
};

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process = global_1.process;
var Deno = global_1.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

/* eslint-disable es/no-symbol -- required for testing */



// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && engineV8Version && engineV8Version < 41;
});

/* eslint-disable es/no-symbol -- required for testing */


var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (nativeSymbol && has(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return typeof $Symbol == 'function' && Object(it) instanceof $Symbol;
};

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
var ordinaryToPrimitive = function (input, pref) {
  var fn, val;
  if (pref === 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (pref !== 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
var toPrimitive = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = input[TO_PRIMITIVE];
  var result;
  if (exoticToPrim !== undefined) {
    if (pref === undefined) pref = 'default';
    result = exoticToPrim.call(input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
var toPropertyKey = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : String(key);
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap || sharedStore.state) {
  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    if (wmhas.call(store$1, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (has(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
}

var defineProperty = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var toString_1 = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

/* global ActiveXObject -- old IE, WSH */








var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

/* eslint-disable es/no-object-getownpropertynames -- safe */

var $getOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var f$6 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$6
};

var path = global_1;

var defineProperty$1 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$1(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var defineProperty$2 = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty$2(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var SPECIES = wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod$1(7)
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var $defineProperty$1 = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable$1.call(properties, key)) $defineProperty$1(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
  objectDefineProperty.f = $defineProperty$1;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor$1;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames$1;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
    }
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = toString_1(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty$1,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$1
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames$1,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE$1]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE$1, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

var defineProperty$3 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$3(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var iterators = {};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$1 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$1 : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

/* eslint-disable no-proto -- safe */



// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$1(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// `String.prototype.codePointAt` methods implementation
var createMethod$2 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString_1(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$2(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$2(true)
};

var charAt = stringMultibyte.charAt;




var STRING_ITERATOR = 'String Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$2(this, {
    type: STRING_ITERATOR,
    string: toString_1(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$2(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$3]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global_1.JSON, 'JSON', true);

// Math[@@toStringTag] property
// https://tc39.es/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

var FAILS_ON_PRIMITIVES = fails(function () { objectGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !correctPrototypeGetter }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return objectGetPrototypeOf(toObject(it));
  }
});

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

var nativePromiseConstructor = global_1.Promise;

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var SPECIES$1 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$1]) {
    defineProperty(Constructor, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var ITERATOR$3 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$3] === it);
};

var ITERATOR$4 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$4]
    || it['@@iterator']
    || iterators[classof(it)];
};

var getIterator = function (it, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(it) : usingIterator;
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

var iteratorClose = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = iterator['return'];
    if (innerResult === undefined) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = innerResult.call(iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'return', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

var ITERATOR$5 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$5] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$5] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var SPECIES$2 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$2]) == undefined ? defaultConstructor : aFunction$1(S);
};

var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

var engineIsNode = classofRaw(global_1.process) == 'process';

var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$1 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global_1.location;
} catch (error) { /* empty */ }

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(String(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var argumentsLength = arguments.length;
    var i = 1;
    while (argumentsLength > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process$1.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$1,
  clear: clear
};

var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global_1.Pebble !== undefined;

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var macrotask = task.set;





var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var document$2 = global_1.document;
var process$2 = global_1.process;
var Promise$1 = global_1.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (engineIsNode && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!engineIsIosPebble && Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise$1;
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (engineIsNode) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
var f$7 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$7
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var engineIsBrowser = typeof window == 'object';

var task$1 = task.set;












var SPECIES$3 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState$3 = internalState.get;
var setInternalState$3 = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var NativePromisePrototype = nativePromiseConstructor && nativePromiseConstructor.prototype;
var PromiseConstructor = nativePromiseConstructor;
var PromiseConstructorPrototype = NativePromisePrototype;
var TypeError$1 = global_1.TypeError;
var document$3 = global_1.document;
var process$3 = global_1.process;
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var SUBCLASSING = false;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced_1(PROMISE, function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$3] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && engineIsBrowser && !NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$3.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (engineIsNode) {
          process$3.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    if (engineIsNode) {
      process$3.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction$1(executor);
    Internal.call(this);
    var state = getInternalState$3(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromiseConstructorPrototype = PromiseConstructor.prototype;
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState$3(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructorPrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = engineIsNode ? process$3.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState$3(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if ( typeof nativePromiseConstructor == 'function' && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
      redefine(NativePromisePrototype, 'catch', PromiseConstructorPrototype['catch'], { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (objectSetPrototypeOf) {
      objectSetPrototypeOf(NativePromisePrototype, PromiseConstructorPrototype);
    }
  }
}

_export({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced:  FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $forEach$1 = arrayIteration.forEach;


var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype$1, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype$1.forEach = arrayForEach;
  }
}

var createProperty = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var SPECIES$4 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$4] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES$5 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$5];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global_1.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global_1.RegExp;

var regexpUnsupportedDotAll = fails(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp$2 = global_1.RegExp;

var regexpUnsupportedNcg = fails(function () {
  var re = $RegExp$2('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */





var getInternalState$4 = internalState.get;



var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState$4(re);
    var str = toString_1(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = patchedExec.call(raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = str.slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = objectCreate(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES$6 = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$6] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

var charAt$1 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$1(S, index).length : 1);
};

var floor$1 = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor$1(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var REPLACE = wellKnownSymbol('replace');
var max$2 = Math.max;
var min$2 = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(toString_1(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString_1(string);

      if (
        typeof replaceValue === 'string' &&
        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
        replaceValue.indexOf('$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = toString_1(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = toString_1(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString_1(result[0]);
        var position = max$2(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = toString_1(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

// @@match logic
fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = toString_1(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject != Object;
var STRICT_METHOD$1 = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$1 }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
var arrayPush = [].push;
var min$3 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString_1(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(toString_1(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString_1(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y$2 ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y$2 ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y$2 ? 0 : q;
        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y$2 ? S.slice(q) : S);
        var e;
        if (
          z === null ||
          (e = min$3(toLength(splitter.lastIndex + (UNSUPPORTED_Y$2 ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$2);

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

// a string of all valid unicode whitespaces
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$3 = function (TYPE) {
  return function ($this) {
    var string = toString_1(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod$3(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod$3(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod$3(3)
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
var defineProperty$4 = objectDefineProperty.f;
var trim = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global_1[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a number');
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys$1.length > j; j++) {
    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
      defineProperty$4(NumberWrapper, key, getOwnPropertyDescriptor$3(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global_1, NUMBER, NumberWrapper);
}

var TO_STRING = 'toString';
var RegExpPrototype$1 = RegExp.prototype;
var nativeToString = RegExpPrototype$1[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = toString_1(R.source);
    var rf = R.flags;
    var f = toString_1(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
_export({ target: 'Array', proto: true }, {
  fill: arrayFill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

var freezing = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;





var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
  var splice = [].splice;
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    objectGetOwnPropertyNames.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice.call(result, i, 1);
          break;
        }
      } return result;
    };

    _export({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});
var internalMetadata_1 = internalMetadata.enable;
var internalMetadata_2 = internalMetadata.fastKey;
var internalMetadata_3 = internalMetadata.getWeakData;
var internalMetadata_4 = internalMetadata.onFreeze;

var onFreeze = internalMetadata.onFreeze;

// eslint-disable-next-line es/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES$1 = fails(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !freezing }, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var $filter = arrayIteration.filter;


var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $includes = arrayIncludes.includes;


// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~toString_1(requireObjectCoercible(this))
      .indexOf(toString_1(notARegexp(searchString)), arguments.length > 1 ? arguments[1] : undefined);
  }
});

/* eslint-disable es/no-array-prototype-indexof -- required for testing */

var $indexOf = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $map = arrayIteration.map;


var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$4 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction$1(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod$4(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod$4(true)
};

var $reduce = arrayReduce.left;




var STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;







// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var $startsWith = ''.startsWith;
var min$4 = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString_1(requireObjectCoercible(this));
    notARegexp(searchString);
    var index = toLength(min$4(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString_1(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var stringTrimForced = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
  from: arrayFrom
});

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES$2 = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
  isExtensible: function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  }
});

var onFreeze$1 = internalMetadata.onFreeze;



// eslint-disable-next-line es/no-object-preventextensions -- safe
var $preventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES$3 = fails(function () { $preventExtensions(1); });

// `Object.preventExtensions` method
// https://tc39.es/ecma262/#sec-object.preventextensions
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !freezing }, {
  preventExtensions: function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze$1(it)) : it;
  }
});

var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');

var max$3 = Math.max;
var min$5 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$5(max$3(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeGetOwnPropertyDescriptor$1(1); });
var FORCED$2 = !descriptors || FAILS_ON_PRIMITIVES$4;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$2, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$1(toIndexedObject(it), key);
  }
});

var getOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
var FAILS_ON_PRIMITIVES$5 = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
  getOwnPropertyNames: getOwnPropertyNames$1
});

var FAILS_ON_PRIMITIVES$6 = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

var defineProperty$5 = objectDefineProperty.f;
var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;







var enforceInternalState = internalState.enforce;





var MATCH$2 = wellKnownSymbol('match');
var NativeRegExp = global_1.RegExp;
var RegExpPrototype$2 = NativeRegExp.prototype;
// TODO: Use only propper RegExpIdentifierName
var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

var BASE_FORCED = descriptors &&
  (!CORRECT_NEW || UNSUPPORTED_Y$3 || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
    re2[MATCH$2] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));

var handleDotAll = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var brackets = false;
  var chr;
  for (; index <= length; index++) {
    chr = string.charAt(index);
    if (chr === '\\') {
      result += chr + string.charAt(++index);
      continue;
    }
    if (!brackets && chr === '.') {
      result += '[\\s\\S]';
    } else {
      if (chr === '[') {
        brackets = true;
      } else if (chr === ']') {
        brackets = false;
      } result += chr;
    }
  } return result;
};

var handleNCG = function (string) {
  var length = string.length;
  var index = 0;
  var result = '';
  var named = [];
  var names = {};
  var brackets = false;
  var ncg = false;
  var groupid = 0;
  var groupname = '';
  var chr;
  for (; index <= length; index++) {
    chr = string.charAt(index);
    if (chr === '\\') {
      chr = chr + string.charAt(++index);
    } else if (chr === ']') {
      brackets = false;
    } else if (!brackets) switch (true) {
      case chr === '[':
        brackets = true;
        break;
      case chr === '(':
        if (IS_NCG.test(string.slice(index + 1))) {
          index += 2;
          ncg = true;
        }
        result += chr;
        groupid++;
        continue;
      case chr === '>' && ncg:
        if (groupname === '' || has(names, groupname)) {
          throw new SyntaxError('Invalid capture group name');
        }
        names[groupname] = true;
        named.push([groupname, groupid]);
        ncg = false;
        groupname = '';
        continue;
    }
    if (ncg) groupname += chr;
    else result += chr;
  } return [result, named];
};

// `RegExp` constructor
// https://tc39.es/ecma262/#sec-regexp-constructor
if (isForced_1('RegExp', BASE_FORCED)) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegexp(pattern);
    var flagsAreUndefined = flags === undefined;
    var groups = [];
    var rawPattern = pattern;
    var rawFlags, dotAll, sticky, handled, result, state;

    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
      return pattern;
    }

    if (patternIsRegExp || pattern instanceof RegExpWrapper) {
      pattern = pattern.source;
      if (flagsAreUndefined) flags = 'flags' in rawPattern ? rawPattern.flags : regexpFlags.call(rawPattern);
    }

    pattern = pattern === undefined ? '' : toString_1(pattern);
    flags = flags === undefined ? '' : toString_1(flags);
    rawPattern = pattern;

    if (regexpUnsupportedDotAll && 'dotAll' in re1) {
      dotAll = !!flags && flags.indexOf('s') > -1;
      if (dotAll) flags = flags.replace(/s/g, '');
    }

    rawFlags = flags;

    if (UNSUPPORTED_Y$3 && 'sticky' in re1) {
      sticky = !!flags && flags.indexOf('y') > -1;
      if (sticky) flags = flags.replace(/y/g, '');
    }

    if (regexpUnsupportedNcg) {
      handled = handleNCG(pattern);
      pattern = handled[0];
      groups = handled[1];
    }

    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$2, RegExpWrapper);

    if (dotAll || sticky || groups.length) {
      state = enforceInternalState(result);
      if (dotAll) {
        state.dotAll = true;
        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
      }
      if (sticky) state.sticky = true;
      if (groups.length) state.groups = groups;
    }

    if (pattern !== rawPattern) try {
      // fails in old engines, but we have no alternatives for unsupported regex syntax
      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
    } catch (error) { /* empty */ }

    return result;
  };

  var proxy = function (key) {
    key in RegExpWrapper || defineProperty$5(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };

  for (var keys$2 = getOwnPropertyNames$2(NativeRegExp), index = 0; keys$2.length > index;) {
    proxy(keys$2[index++]);
  }

  RegExpPrototype$2.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$2;
  redefine(global_1, 'RegExp', RegExpWrapper);
}

// https://tc39.es/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
  nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if ( typeof nativePromiseConstructor == 'function') {
  var method = getBuiltIn('Promise').prototype['finally'];
  if (nativePromiseConstructor.prototype['finally'] !== method) {
    redefine(nativePromiseConstructor.prototype, 'finally', method, { unsafe: true });
  }
}

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableArrayFromJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/array/from */"./node_modules/core-js-pure/stable/array/from.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableArrayIsArrayJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/array/is-array */"./node_modules/core-js-pure/stable/array/is-array.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/date/now.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableDateNowJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/date/now */"./node_modules/core-js-pure/stable/date/now.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/bind.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceBindJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/bind */"./node_modules/core-js-pure/stable/instance/bind.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceConcatJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/concat */"./node_modules/core-js-pure/stable/instance/concat.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/every.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceEveryJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/every */"./node_modules/core-js-pure/stable/instance/every.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/fill.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceFillJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/fill */"./node_modules/core-js-pure/stable/instance/fill.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceFilterJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/filter */"./node_modules/core-js-pure/stable/instance/filter.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceForEachJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/for-each */"./node_modules/core-js-pure/stable/instance/for-each.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceIncludesJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/includes */"./node_modules/core-js-pure/stable/instance/includes.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceIndexOfJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/index-of */"./node_modules/core-js-pure/stable/instance/index-of.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceMapJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/map */"./node_modules/core-js-pure/stable/instance/map.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceReduceJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/reduce */"./node_modules/core-js-pure/stable/instance/reduce.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceReverseJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/reverse */"./node_modules/core-js-pure/stable/instance/reverse.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceSliceJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/slice */"./node_modules/core-js-pure/stable/instance/slice.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/some.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceSomeJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/some */"./node_modules/core-js-pure/stable/instance/some.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/starts-with.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceStartsWithJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/starts-with */"./node_modules/core-js-pure/stable/instance/starts-with.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceTrimJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/trim */"./node_modules/core-js-pure/stable/instance/trim.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/values.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableInstanceValuesJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/instance/values */"./node_modules/core-js-pure/stable/instance/values.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/map.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableMapJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/map */"./node_modules/core-js-pure/stable/map/index.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-properties.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectDefinePropertiesJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/define-properties */"./node_modules/core-js-pure/stable/object/define-properties.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectDefinePropertyJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/define-property */"./node_modules/core-js-pure/stable/object/define-property.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/get-own-property-descriptor */"./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectGetOwnPropertyDescriptorsJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/get-own-property-descriptors */"./node_modules/core-js-pure/stable/object/get-own-property-descriptors.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectGetOwnPropertySymbolsJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/get-own-property-symbols */"./node_modules/core-js-pure/stable/object/get-own-property-symbols.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/object/keys.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableObjectKeysJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/object/keys */"./node_modules/core-js-pure/stable/object/keys.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/parse-float.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableParseFloatJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/parse-float */"./node_modules/core-js-pure/stable/parse-float.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/parse-int.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableParseIntJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/parse-int */"./node_modules/core-js-pure/stable/parse-int.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js":




function node_modulesBabelRuntimeCorejs3CoreJsStablePromiseJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/promise */"./node_modules/core-js-pure/stable/promise/index.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/apply.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableReflectApplyJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/reflect/apply */"./node_modules/core-js-pure/stable/reflect/apply.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/construct.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableReflectConstructJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/reflect/construct */"./node_modules/core-js-pure/stable/reflect/construct.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/delete-property.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableReflectDeletePropertyJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/reflect/delete-property */"./node_modules/core-js-pure/stable/reflect/delete-property.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/get-prototype-of.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableReflectGetPrototypeOfJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/reflect/get-prototype-of */"./node_modules/core-js-pure/stable/reflect/get-prototype-of.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js":




function node_modulesBabelRuntimeCorejs3CoreJsStableSymbolJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/stable/symbol */"./node_modules/core-js-pure/stable/symbol/index.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/array/from.js":




function node_modulesBabelRuntimeCorejs3CoreJsArrayFromJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/array/from */"./node_modules/core-js-pure/features/array/from.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/array/is-array.js":




function node_modulesBabelRuntimeCorejs3CoreJsArrayIsArrayJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/array/is-array */"./node_modules/core-js-pure/features/array/is-array.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js":




function node_modulesBabelRuntimeCorejs3CoreJsGetIteratorMethodJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/get-iterator-method */"./node_modules/core-js-pure/features/get-iterator-method.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/get-iterator.js":




function node_modulesBabelRuntimeCorejs3CoreJsGetIteratorJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/get-iterator */"./node_modules/core-js-pure/features/get-iterator.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/instance/slice.js":




function node_modulesBabelRuntimeCorejs3CoreJsInstanceSliceJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/instance/slice */"./node_modules/core-js-pure/features/instance/slice.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/object/create.js":




function node_modulesBabelRuntimeCorejs3CoreJsObjectCreateJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/object/create */"./node_modules/core-js-pure/features/object/create.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/object/define-property.js":




function node_modulesBabelRuntimeCorejs3CoreJsObjectDefinePropertyJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/object/define-property */"./node_modules/core-js-pure/features/object/define-property.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js":




function node_modulesBabelRuntimeCorejs3CoreJsObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/object/get-own-property-descriptor */"./node_modules/core-js-pure/features/object/get-own-property-descriptor.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/object/get-prototype-of.js":




function node_modulesBabelRuntimeCorejs3CoreJsObjectGetPrototypeOfJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/object/get-prototype-of */"./node_modules/core-js-pure/features/object/get-prototype-of.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/object/set-prototype-of.js":




function node_modulesBabelRuntimeCorejs3CoreJsObjectSetPrototypeOfJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/object/set-prototype-of */"./node_modules/core-js-pure/features/object/set-prototype-of.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/promise.js":




function node_modulesBabelRuntimeCorejs3CoreJsPromiseJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/promise */"./node_modules/core-js-pure/features/promise/index.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/reflect/get.js":




function node_modulesBabelRuntimeCorejs3CoreJsReflectGetJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/reflect/get */"./node_modules/core-js-pure/features/reflect/get.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/symbol.js":




function node_modulesBabelRuntimeCorejs3CoreJsSymbolJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/symbol */"./node_modules/core-js-pure/features/symbol/index.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/core-js/symbol/iterator.js":




function node_modulesBabelRuntimeCorejs3CoreJsSymbolIteratorJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! core-js-pure/features/symbol/iterator */"./node_modules/core-js-pure/features/symbol/iterator.js");

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js":




function node_modulesBabelRuntimeCorejs3HelpersArrayLikeToArrayJs(module,exports){

function _arrayLikeToArray(arr,len){
if(len==null||len>arr.length)len=arr.length;

for(var i=0,arr2=new Array(len);i<len;i++){
arr2[i]=arr[i];
}

return arr2;
}

module.exports=_arrayLikeToArray;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js":




function node_modulesBabelRuntimeCorejs3HelpersArrayWithHolesJs(module,exports,__webpack_require__){

var _Array$isArray=__webpack_require__(/*! @babel/runtime-corejs3/core-js/array/is-array */"./node_modules/@babel/runtime-corejs3/core-js/array/is-array.js");

function _arrayWithHoles(arr){
if(_Array$isArray(arr))return arr;
}

module.exports=_arrayWithHoles;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/arrayWithoutHoles.js":




function node_modulesBabelRuntimeCorejs3HelpersArrayWithoutHolesJs(module,exports,__webpack_require__){

var _Array$isArray=__webpack_require__(/*! @babel/runtime-corejs3/core-js/array/is-array */"./node_modules/@babel/runtime-corejs3/core-js/array/is-array.js");

var arrayLikeToArray=__webpack_require__(/*! ./arrayLikeToArray.js */"./node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr){
if(_Array$isArray(arr))return arrayLikeToArray(arr);
}

module.exports=_arrayWithoutHoles;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/assertThisInitialized.js":




function node_modulesBabelRuntimeCorejs3HelpersAssertThisInitializedJs(module,exports){

function _assertThisInitialized(self){
if(self===void 0){
throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
}

return self;
}

module.exports=_assertThisInitialized;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/asyncToGenerator.js":




function node_modulesBabelRuntimeCorejs3HelpersAsyncToGeneratorJs(module,exports,__webpack_require__){

var _Promise=__webpack_require__(/*! @babel/runtime-corejs3/core-js/promise */"./node_modules/@babel/runtime-corejs3/core-js/promise.js");

function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){
try{
var info=gen[key](arg);
var value=info.value;
}catch(error){
reject(error);
return;
}

if(info.done){
resolve(value);
}else {
_Promise.resolve(value).then(_next,_throw);
}
}

function _asyncToGenerator(fn){
return function(){
var self=this,
args=arguments;
return new _Promise(function(resolve,reject){
var gen=fn.apply(self,args);

function _next(value){
asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value);
}

function _throw(err){
asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err);
}

_next(undefined);
});
};
}

module.exports=_asyncToGenerator;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/classCallCheck.js":




function node_modulesBabelRuntimeCorejs3HelpersClassCallCheckJs(module,exports){

function _classCallCheck(instance,Constructor){
if(!(instance instanceof Constructor)){
throw new TypeError("Cannot call a class as a function");
}
}

module.exports=_classCallCheck;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/createClass.js":




function node_modulesBabelRuntimeCorejs3HelpersCreateClassJs(module,exports,__webpack_require__){

var _Object$defineProperty=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/define-property */"./node_modules/@babel/runtime-corejs3/core-js/object/define-property.js");

function _defineProperties(target,props){
for(var i=0;i<props.length;i++){
var descriptor=props[i];
descriptor.enumerable=descriptor.enumerable||false;
descriptor.configurable=true;
if("value"in descriptor)descriptor.writable=true;

_Object$defineProperty(target,descriptor.key,descriptor);
}
}

function _createClass(Constructor,protoProps,staticProps){
if(protoProps)_defineProperties(Constructor.prototype,protoProps);
if(staticProps)_defineProperties(Constructor,staticProps);
return Constructor;
}

module.exports=_createClass;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/defineProperty.js":




function node_modulesBabelRuntimeCorejs3HelpersDefinePropertyJs(module,exports,__webpack_require__){

var _Object$defineProperty=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/define-property */"./node_modules/@babel/runtime-corejs3/core-js/object/define-property.js");

function _defineProperty(obj,key,value){
if(key in obj){
_Object$defineProperty(obj,key,{
value:value,
enumerable:true,
configurable:true,
writable:true});

}else {
obj[key]=value;
}

return obj;
}

module.exports=_defineProperty;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/get.js":




function node_modulesBabelRuntimeCorejs3HelpersGetJs(module,exports,__webpack_require__){

var _Reflect$get=__webpack_require__(/*! @babel/runtime-corejs3/core-js/reflect/get */"./node_modules/@babel/runtime-corejs3/core-js/reflect/get.js");

var _Object$getOwnPropertyDescriptor=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/get-own-property-descriptor */"./node_modules/@babel/runtime-corejs3/core-js/object/get-own-property-descriptor.js");

var superPropBase=__webpack_require__(/*! ./superPropBase.js */"./node_modules/@babel/runtime-corejs3/helpers/superPropBase.js");

function _get(target,property,receiver){
if(typeof Reflect!=="undefined"&&_Reflect$get){
module.exports=_get=_Reflect$get;
module.exports["default"]=module.exports,module.exports.__esModule=true;
}else {
module.exports=_get=function _get(target,property,receiver){
var base=superPropBase(target,property);
if(!base)return;

var desc=_Object$getOwnPropertyDescriptor(base,property);

if(desc.get){
return desc.get.call(receiver);
}

return desc.value;
};

module.exports["default"]=module.exports,module.exports.__esModule=true;
}

return _get(target,property,receiver||target);
}

module.exports=_get;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/getPrototypeOf.js":




function node_modulesBabelRuntimeCorejs3HelpersGetPrototypeOfJs(module,exports,__webpack_require__){

var _Object$setPrototypeOf=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/set-prototype-of */"./node_modules/@babel/runtime-corejs3/core-js/object/set-prototype-of.js");

var _Object$getPrototypeOf=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/get-prototype-of */"./node_modules/@babel/runtime-corejs3/core-js/object/get-prototype-of.js");

function _getPrototypeOf(o){
module.exports=_getPrototypeOf=_Object$setPrototypeOf?_Object$getPrototypeOf:function _getPrototypeOf(o){
return o.__proto__||_Object$getPrototypeOf(o);
};
module.exports["default"]=module.exports,module.exports.__esModule=true;
return _getPrototypeOf(o);
}

module.exports=_getPrototypeOf;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/inherits.js":




function node_modulesBabelRuntimeCorejs3HelpersInheritsJs(module,exports,__webpack_require__){

var _Object$create=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/create */"./node_modules/@babel/runtime-corejs3/core-js/object/create.js");

var setPrototypeOf=__webpack_require__(/*! ./setPrototypeOf.js */"./node_modules/@babel/runtime-corejs3/helpers/setPrototypeOf.js");

function _inherits(subClass,superClass){
if(typeof superClass!=="function"&&superClass!==null){
throw new TypeError("Super expression must either be null or a function");
}

subClass.prototype=_Object$create(superClass&&superClass.prototype,{
constructor:{
value:subClass,
writable:true,
configurable:true}});


if(superClass)setPrototypeOf(subClass,superClass);
}

module.exports=_inherits;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/iterableToArray.js":




function node_modulesBabelRuntimeCorejs3HelpersIterableToArrayJs(module,exports,__webpack_require__){

var _Symbol=__webpack_require__(/*! @babel/runtime-corejs3/core-js/symbol */"./node_modules/@babel/runtime-corejs3/core-js/symbol.js");

var _getIteratorMethod=__webpack_require__(/*! @babel/runtime-corejs3/core-js/get-iterator-method */"./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js");

var _Array$from=__webpack_require__(/*! @babel/runtime-corejs3/core-js/array/from */"./node_modules/@babel/runtime-corejs3/core-js/array/from.js");

function _iterableToArray(iter){
if(typeof _Symbol!=="undefined"&&_getIteratorMethod(iter)!=null||iter["@@iterator"]!=null)return _Array$from(iter);
}

module.exports=_iterableToArray;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js":




function node_modulesBabelRuntimeCorejs3HelpersIterableToArrayLimitJs(module,exports,__webpack_require__){

var _Symbol=__webpack_require__(/*! @babel/runtime-corejs3/core-js/symbol */"./node_modules/@babel/runtime-corejs3/core-js/symbol.js");

var _getIteratorMethod=__webpack_require__(/*! @babel/runtime-corejs3/core-js/get-iterator-method */"./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js");

function _iterableToArrayLimit(arr,i){
var _i=arr==null?null:typeof _Symbol!=="undefined"&&_getIteratorMethod(arr)||arr["@@iterator"];

if(_i==null)return;
var _arr=[];
var _n=true;
var _d=false;

var _s,_e;

try{
for(_i=_i.call(arr);!(_n=(_s=_i.next()).done);_n=true){
_arr.push(_s.value);

if(i&&_arr.length===i)break;
}
}catch(err){
_d=true;
_e=err;
}finally{
try{
if(!_n&&_i["return"]!=null)_i["return"]();
}finally{
if(_d)throw _e;
}
}

return _arr;
}

module.exports=_iterableToArrayLimit;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js":




function node_modulesBabelRuntimeCorejs3HelpersNonIterableRestJs(module,exports){

function _nonIterableRest(){
throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports=_nonIterableRest;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/nonIterableSpread.js":




function node_modulesBabelRuntimeCorejs3HelpersNonIterableSpreadJs(module,exports){

function _nonIterableSpread(){
throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports=_nonIterableSpread;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/possibleConstructorReturn.js":




function node_modulesBabelRuntimeCorejs3HelpersPossibleConstructorReturnJs(module,exports,__webpack_require__){

var _typeof=__webpack_require__(/*! @babel/runtime-corejs3/helpers/typeof */"./node_modules/@babel/runtime-corejs3/helpers/typeof.js")["default"];

var assertThisInitialized=__webpack_require__(/*! ./assertThisInitialized.js */"./node_modules/@babel/runtime-corejs3/helpers/assertThisInitialized.js");

function _possibleConstructorReturn(self,call){
if(call&&(_typeof(call)==="object"||typeof call==="function")){
return call;
}else if(call!==void 0){
throw new TypeError("Derived constructors may only return object or undefined");
}

return assertThisInitialized(self);
}

module.exports=_possibleConstructorReturn;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/setPrototypeOf.js":




function node_modulesBabelRuntimeCorejs3HelpersSetPrototypeOfJs(module,exports,__webpack_require__){

var _Object$setPrototypeOf=__webpack_require__(/*! @babel/runtime-corejs3/core-js/object/set-prototype-of */"./node_modules/@babel/runtime-corejs3/core-js/object/set-prototype-of.js");

function _setPrototypeOf(o,p){
module.exports=_setPrototypeOf=_Object$setPrototypeOf||function _setPrototypeOf(o,p){
o.__proto__=p;
return o;
};

module.exports["default"]=module.exports,module.exports.__esModule=true;
return _setPrototypeOf(o,p);
}

module.exports=_setPrototypeOf;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js":




function node_modulesBabelRuntimeCorejs3HelpersSlicedToArrayJs(module,exports,__webpack_require__){

var arrayWithHoles=__webpack_require__(/*! ./arrayWithHoles.js */"./node_modules/@babel/runtime-corejs3/helpers/arrayWithHoles.js");

var iterableToArrayLimit=__webpack_require__(/*! ./iterableToArrayLimit.js */"./node_modules/@babel/runtime-corejs3/helpers/iterableToArrayLimit.js");

var unsupportedIterableToArray=__webpack_require__(/*! ./unsupportedIterableToArray.js */"./node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js");

var nonIterableRest=__webpack_require__(/*! ./nonIterableRest.js */"./node_modules/@babel/runtime-corejs3/helpers/nonIterableRest.js");

function _slicedToArray(arr,i){
return arrayWithHoles(arr)||iterableToArrayLimit(arr,i)||unsupportedIterableToArray(arr,i)||nonIterableRest();
}

module.exports=_slicedToArray;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/superPropBase.js":




function node_modulesBabelRuntimeCorejs3HelpersSuperPropBaseJs(module,exports,__webpack_require__){

var getPrototypeOf=__webpack_require__(/*! ./getPrototypeOf.js */"./node_modules/@babel/runtime-corejs3/helpers/getPrototypeOf.js");

function _superPropBase(object,property){
while(!Object.prototype.hasOwnProperty.call(object,property)){
object=getPrototypeOf(object);
if(object===null)break;
}

return object;
}

module.exports=_superPropBase;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/toConsumableArray.js":




function node_modulesBabelRuntimeCorejs3HelpersToConsumableArrayJs(module,exports,__webpack_require__){

var arrayWithoutHoles=__webpack_require__(/*! ./arrayWithoutHoles.js */"./node_modules/@babel/runtime-corejs3/helpers/arrayWithoutHoles.js");

var iterableToArray=__webpack_require__(/*! ./iterableToArray.js */"./node_modules/@babel/runtime-corejs3/helpers/iterableToArray.js");

var unsupportedIterableToArray=__webpack_require__(/*! ./unsupportedIterableToArray.js */"./node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js");

var nonIterableSpread=__webpack_require__(/*! ./nonIterableSpread.js */"./node_modules/@babel/runtime-corejs3/helpers/nonIterableSpread.js");

function _toConsumableArray(arr){
return arrayWithoutHoles(arr)||iterableToArray(arr)||unsupportedIterableToArray(arr)||nonIterableSpread();
}

module.exports=_toConsumableArray;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/typeof.js":




function node_modulesBabelRuntimeCorejs3HelpersTypeofJs(module,exports,__webpack_require__){

var _Symbol=__webpack_require__(/*! @babel/runtime-corejs3/core-js/symbol */"./node_modules/@babel/runtime-corejs3/core-js/symbol.js");

var _Symbol$iterator=__webpack_require__(/*! @babel/runtime-corejs3/core-js/symbol/iterator */"./node_modules/@babel/runtime-corejs3/core-js/symbol/iterator.js");

function _typeof(obj){
"@babel/helpers - typeof";

if(typeof _Symbol==="function"&&typeof _Symbol$iterator==="symbol"){
module.exports=_typeof=function _typeof(obj){
return typeof obj;
};

module.exports["default"]=module.exports,module.exports.__esModule=true;
}else {
module.exports=_typeof=function _typeof(obj){
return obj&&typeof _Symbol==="function"&&obj.constructor===_Symbol&&obj!==_Symbol.prototype?"symbol":typeof obj;
};

module.exports["default"]=module.exports,module.exports.__esModule=true;
}

return _typeof(obj);
}

module.exports=_typeof;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/helpers/unsupportedIterableToArray.js":




function node_modulesBabelRuntimeCorejs3HelpersUnsupportedIterableToArrayJs(module,exports,__webpack_require__){

var _sliceInstanceProperty=__webpack_require__(/*! @babel/runtime-corejs3/core-js/instance/slice */"./node_modules/@babel/runtime-corejs3/core-js/instance/slice.js");

var _Array$from=__webpack_require__(/*! @babel/runtime-corejs3/core-js/array/from */"./node_modules/@babel/runtime-corejs3/core-js/array/from.js");

var arrayLikeToArray=__webpack_require__(/*! ./arrayLikeToArray.js */"./node_modules/@babel/runtime-corejs3/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o,minLen){
var _context;

if(!o)return;
if(typeof o==="string")return arrayLikeToArray(o,minLen);

var n=_sliceInstanceProperty(_context=Object.prototype.toString.call(o)).call(_context,8,-1);

if(n==="Object"&&o.constructor)n=o.constructor.name;
if(n==="Map"||n==="Set")return _Array$from(o);
if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return arrayLikeToArray(o,minLen);
}

module.exports=_unsupportedIterableToArray;
module.exports["default"]=module.exports,module.exports.__esModule=true;

/***/},

/***/"./node_modules/@babel/runtime-corejs3/node_modules/regenerator-runtime/runtime.js":




function node_modulesBabelRuntimeCorejs3Node_modulesRegeneratorRuntimeRuntimeJs(module,exports,__webpack_require__){

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime=function(exports){

var Op=Object.prototype;
var hasOwn=Op.hasOwnProperty;
var undefined$1;// More compressible than void 0.
var $Symbol=typeof Symbol==="function"?Symbol:{};
var iteratorSymbol=$Symbol.iterator||"@@iterator";
var asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator";
var toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";

function define(obj,key,value){
Object.defineProperty(obj,key,{
value:value,
enumerable:true,
configurable:true,
writable:true});

return obj[key];
}
try{
// IE 8 has a broken Object.defineProperty that only works on DOM objects.
define({},"");
}catch(err){
define=function define(obj,key,value){
return obj[key]=value;
};
}

function wrap(innerFn,outerFn,self,tryLocsList){
// If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator;
var generator=Object.create(protoGenerator.prototype);
var context=new Context(tryLocsList||[]);

// The ._invoke method unifies the implementations of the .next,
// .throw, and .return methods.
generator._invoke=makeInvokeMethod(innerFn,self,context);

return generator;
}
exports.wrap=wrap;

// Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.
function tryCatch(fn,obj,arg){
try{
return {type:"normal",arg:fn.call(obj,arg)};
}catch(err){
return {type:"throw",arg:err};
}
}

var GenStateSuspendedStart="suspendedStart";
var GenStateSuspendedYield="suspendedYield";
var GenStateExecuting="executing";
var GenStateCompleted="completed";

// Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.
var ContinueSentinel={};

// Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.
function Generator(){}
function GeneratorFunction(){}
function GeneratorFunctionPrototype(){}

// This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.
var IteratorPrototype={};
define(IteratorPrototype,iteratorSymbol,function(){
return this;
});

var getProto=Object.getPrototypeOf;
var NativeIteratorPrototype=getProto&&getProto(getProto(values([])));
if(NativeIteratorPrototype&&
NativeIteratorPrototype!==Op&&
hasOwn.call(NativeIteratorPrototype,iteratorSymbol)){
// This environment has a native %IteratorPrototype%; use it instead
// of the polyfill.
IteratorPrototype=NativeIteratorPrototype;
}

var Gp=GeneratorFunctionPrototype.prototype=
Generator.prototype=Object.create(IteratorPrototype);
GeneratorFunction.prototype=GeneratorFunctionPrototype;
define(Gp,"constructor",GeneratorFunctionPrototype);
define(GeneratorFunctionPrototype,"constructor",GeneratorFunction);
GeneratorFunction.displayName=define(
GeneratorFunctionPrototype,
toStringTagSymbol,
"GeneratorFunction");


// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype){
["next","throw","return"].forEach(function(method){
define(prototype,method,function(arg){
return this._invoke(method,arg);
});
});
}

exports.isGeneratorFunction=function(genFun){
var ctor=typeof genFun==="function"&&genFun.constructor;
return ctor?
ctor===GeneratorFunction||
// For the native GeneratorFunction constructor, the best we can
// do is to check its .name property.
(ctor.displayName||ctor.name)==="GeneratorFunction":
false;
};

exports.mark=function(genFun){
if(Object.setPrototypeOf){
Object.setPrototypeOf(genFun,GeneratorFunctionPrototype);
}else {
genFun.__proto__=GeneratorFunctionPrototype;
define(genFun,toStringTagSymbol,"GeneratorFunction");
}
genFun.prototype=Object.create(Gp);
return genFun;
};

// Within the body of any async function, `await x` is transformed to
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.
exports.awrap=function(arg){
return {__await:arg};
};

function AsyncIterator(generator,PromiseImpl){
function invoke(method,arg,resolve,reject){
var record=tryCatch(generator[method],generator,arg);
if(record.type==="throw"){
reject(record.arg);
}else {
var result=record.arg;
var value=result.value;
if(value&&
typeof value==="object"&&
hasOwn.call(value,"__await")){
return PromiseImpl.resolve(value.__await).then(function(value){
invoke("next",value,resolve,reject);
},function(err){
invoke("throw",err,resolve,reject);
});
}

return PromiseImpl.resolve(value).then(function(unwrapped){
// When a yielded Promise is resolved, its final value becomes
// the .value of the Promise<{value,done}> result for the
// current iteration.
result.value=unwrapped;
resolve(result);
},function(error){
// If a rejected Promise was yielded, throw the rejection back
// into the async generator function so it can be handled there.
return invoke("throw",error,resolve,reject);
});
}
}

var previousPromise;

function enqueue(method,arg){
function callInvokeWithMethodAndArg(){
return new PromiseImpl(function(resolve,reject){
invoke(method,arg,resolve,reject);
});
}

return previousPromise=
// If enqueue has been called before, then we want to wait until
// all previous Promises have been resolved before calling invoke,
// so that results are always delivered in the correct order. If
// enqueue has not been called before, then it is important to
// call invoke immediately, without waiting on a callback to fire,
// so that the async generator function has the opportunity to do
// any necessary setup in a predictable way. This predictability
// is why the Promise constructor synchronously invokes its
// executor callback, and why async functions synchronously
// execute code before the first await. Since we implement simple
// async functions in terms of async generators, it is especially
// important to get this right, even though it requires care.
previousPromise?previousPromise.then(
callInvokeWithMethodAndArg,
// Avoid propagating failures to Promises returned by later
// invocations of the iterator.
callInvokeWithMethodAndArg):
callInvokeWithMethodAndArg();
}

// Define the unified helper method that is used to implement .next,
// .throw, and .return (see defineIteratorMethods).
this._invoke=enqueue;
}

defineIteratorMethods(AsyncIterator.prototype);
define(AsyncIterator.prototype,asyncIteratorSymbol,function(){
return this;
});
exports.AsyncIterator=AsyncIterator;

// Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.
exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){
if(PromiseImpl===void 0)PromiseImpl=Promise;

var iter=new AsyncIterator(
wrap(innerFn,outerFn,self,tryLocsList),
PromiseImpl);


return exports.isGeneratorFunction(outerFn)?
iter// If outerFn is a generator, return the full iterator.
:iter.next().then(function(result){
return result.done?result.value:iter.next();
});
};

function makeInvokeMethod(innerFn,self,context){
var state=GenStateSuspendedStart;

return function invoke(method,arg){
if(state===GenStateExecuting){
throw new Error("Generator is already running");
}

if(state===GenStateCompleted){
if(method==="throw"){
throw arg;
}

// Be forgiving, per 25.3.3.3.3 of the spec:
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
return doneResult();
}

context.method=method;
context.arg=arg;

while(true){
var delegate=context.delegate;
if(delegate){
var delegateResult=maybeInvokeDelegate(delegate,context);
if(delegateResult){
if(delegateResult===ContinueSentinel)continue;
return delegateResult;
}
}

if(context.method==="next"){
// Setting context._sent for legacy support of Babel's
// function.sent implementation.
context.sent=context._sent=context.arg;

}else if(context.method==="throw"){
if(state===GenStateSuspendedStart){
state=GenStateCompleted;
throw context.arg;
}

context.dispatchException(context.arg);

}else if(context.method==="return"){
context.abrupt("return",context.arg);
}

state=GenStateExecuting;

var record=tryCatch(innerFn,self,context);
if(record.type==="normal"){
// If an exception is thrown from innerFn, we leave state ===
// GenStateExecuting and loop back for another invocation.
state=context.done?
GenStateCompleted:
GenStateSuspendedYield;

if(record.arg===ContinueSentinel){
continue;
}

return {
value:record.arg,
done:context.done};


}else if(record.type==="throw"){
state=GenStateCompleted;
// Dispatch the exception by looping back around to the
// context.dispatchException(context.arg) call above.
context.method="throw";
context.arg=record.arg;
}
}
};
}

// Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.
function maybeInvokeDelegate(delegate,context){
var method=delegate.iterator[context.method];
if(method===undefined$1){
// A .throw or .return when the delegate iterator has no .throw
// method always terminates the yield* loop.
context.delegate=null;

if(context.method==="throw"){
// Note: ["return"] must be used for ES3 parsing compatibility.
if(delegate.iterator["return"]){
// If the delegate iterator has a return method, give it a
// chance to clean up.
context.method="return";
context.arg=undefined$1;
maybeInvokeDelegate(delegate,context);

if(context.method==="throw"){
// If maybeInvokeDelegate(context) changed context.method from
// "return" to "throw", let that override the TypeError below.
return ContinueSentinel;
}
}

context.method="throw";
context.arg=new TypeError(
"The iterator does not provide a 'throw' method");
}

return ContinueSentinel;
}

var record=tryCatch(method,delegate.iterator,context.arg);

if(record.type==="throw"){
context.method="throw";
context.arg=record.arg;
context.delegate=null;
return ContinueSentinel;
}

var info=record.arg;

if(!info){
context.method="throw";
context.arg=new TypeError("iterator result is not an object");
context.delegate=null;
return ContinueSentinel;
}

if(info.done){
// Assign the result of the finished delegate to the temporary
// variable specified by delegate.resultName (see delegateYield).
context[delegate.resultName]=info.value;

// Resume execution at the desired location (see delegateYield).
context.next=delegate.nextLoc;

// If context.method was "throw" but the delegate handled the
// exception, let the outer generator proceed normally. If
// context.method was "next", forget context.arg since it has been
// "consumed" by the delegate iterator. If context.method was
// "return", allow the original .return call to continue in the
// outer generator.
if(context.method!=="return"){
context.method="next";
context.arg=undefined$1;
}

}else {
// Re-yield the result returned by the delegate method.
return info;
}

// The delegate iterator is finished, so forget it and continue with
// the outer generator.
context.delegate=null;
return ContinueSentinel;
}

// Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.
defineIteratorMethods(Gp);

define(Gp,toStringTagSymbol,"Generator");

// A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.
define(Gp,iteratorSymbol,function(){
return this;
});

define(Gp,"toString",function(){
return "[object Generator]";
});

function pushTryEntry(locs){
var entry={tryLoc:locs[0]};

if(1 in locs){
entry.catchLoc=locs[1];
}

if(2 in locs){
entry.finallyLoc=locs[2];
entry.afterLoc=locs[3];
}

this.tryEntries.push(entry);
}

function resetTryEntry(entry){
var record=entry.completion||{};
record.type="normal";
delete record.arg;
entry.completion=record;
}

function Context(tryLocsList){
// The root entry object (effectively a try statement without a catch
// or a finally block) gives us a place to store values thrown from
// locations where there is no enclosing try statement.
this.tryEntries=[{tryLoc:"root"}];
tryLocsList.forEach(pushTryEntry,this);
this.reset(true);
}

exports.keys=function(object){
var keys=[];
for(var key in object){
keys.push(key);
}
keys.reverse();

// Rather than returning an object with a next method, we keep
// things simple and return the next function itself.
return function next(){
while(keys.length){
var key=keys.pop();
if(key in object){
next.value=key;
next.done=false;
return next;
}
}

// To avoid creating an additional object, we just hang the .value
// and .done properties off the next function object itself. This
// also ensures that the minifier will not anonymize the function.
next.done=true;
return next;
};
};

function values(iterable){
if(iterable){
var iteratorMethod=iterable[iteratorSymbol];
if(iteratorMethod){
return iteratorMethod.call(iterable);
}

if(typeof iterable.next==="function"){
return iterable;
}

if(!isNaN(iterable.length)){
var i=-1,next=function next(){
while(++i<iterable.length){
if(hasOwn.call(iterable,i)){
next.value=iterable[i];
next.done=false;
return next;
}
}

next.value=undefined$1;
next.done=true;

return next;
};

return next.next=next;
}
}

// Return an iterator with no values.
return {next:doneResult};
}
exports.values=values;

function doneResult(){
return {value:undefined$1,done:true};
}

Context.prototype={
constructor:Context,

reset:function reset(skipTempReset){
this.prev=0;
this.next=0;
// Resetting context._sent for legacy support of Babel's
// function.sent implementation.
this.sent=this._sent=undefined$1;
this.done=false;
this.delegate=null;

this.method="next";
this.arg=undefined$1;

this.tryEntries.forEach(resetTryEntry);

if(!skipTempReset){
for(var name in this){
// Not sure about the optimal order of these conditions:
if(name.charAt(0)==="t"&&
hasOwn.call(this,name)&&
!isNaN(+name.slice(1))){
this[name]=undefined$1;
}
}
}
},

stop:function stop(){
this.done=true;

var rootEntry=this.tryEntries[0];
var rootRecord=rootEntry.completion;
if(rootRecord.type==="throw"){
throw rootRecord.arg;
}

return this.rval;
},

dispatchException:function dispatchException(exception){
if(this.done){
throw exception;
}

var context=this;
function handle(loc,caught){
record.type="throw";
record.arg=exception;
context.next=loc;

if(caught){
// If the dispatched exception was caught by a catch block,
// then let that catch block handle the exception normally.
context.method="next";
context.arg=undefined$1;
}

return !!caught;
}

for(var i=this.tryEntries.length-1;i>=0;--i){
var entry=this.tryEntries[i];
var record=entry.completion;

if(entry.tryLoc==="root"){
// Exception thrown outside of any try block that could handle
// it, so set the completion value of the entire function to
// throw the exception.
return handle("end");
}

if(entry.tryLoc<=this.prev){
var hasCatch=hasOwn.call(entry,"catchLoc");
var hasFinally=hasOwn.call(entry,"finallyLoc");

if(hasCatch&&hasFinally){
if(this.prev<entry.catchLoc){
return handle(entry.catchLoc,true);
}else if(this.prev<entry.finallyLoc){
return handle(entry.finallyLoc);
}

}else if(hasCatch){
if(this.prev<entry.catchLoc){
return handle(entry.catchLoc,true);
}

}else if(hasFinally){
if(this.prev<entry.finallyLoc){
return handle(entry.finallyLoc);
}

}else {
throw new Error("try statement without catch or finally");
}
}
}
},

abrupt:function abrupt(type,arg){
for(var i=this.tryEntries.length-1;i>=0;--i){
var entry=this.tryEntries[i];
if(entry.tryLoc<=this.prev&&
hasOwn.call(entry,"finallyLoc")&&
this.prev<entry.finallyLoc){
var finallyEntry=entry;
break;
}
}

if(finallyEntry&&(
type==="break"||
type==="continue")&&
finallyEntry.tryLoc<=arg&&
arg<=finallyEntry.finallyLoc){
// Ignore the finally entry if control is not jumping to a
// location outside the try/catch block.
finallyEntry=null;
}

var record=finallyEntry?finallyEntry.completion:{};
record.type=type;
record.arg=arg;

if(finallyEntry){
this.method="next";
this.next=finallyEntry.finallyLoc;
return ContinueSentinel;
}

return this.complete(record);
},

complete:function complete(record,afterLoc){
if(record.type==="throw"){
throw record.arg;
}

if(record.type==="break"||
record.type==="continue"){
this.next=record.arg;
}else if(record.type==="return"){
this.rval=this.arg=record.arg;
this.method="return";
this.next="end";
}else if(record.type==="normal"&&afterLoc){
this.next=afterLoc;
}

return ContinueSentinel;
},

finish:function finish(finallyLoc){
for(var i=this.tryEntries.length-1;i>=0;--i){
var entry=this.tryEntries[i];
if(entry.finallyLoc===finallyLoc){
this.complete(entry.completion,entry.afterLoc);
resetTryEntry(entry);
return ContinueSentinel;
}
}
},

"catch":function _catch(tryLoc){
for(var i=this.tryEntries.length-1;i>=0;--i){
var entry=this.tryEntries[i];
if(entry.tryLoc===tryLoc){
var record=entry.completion;
if(record.type==="throw"){
var thrown=record.arg;
resetTryEntry(entry);
}
return thrown;
}
}

// The context.catch method must only be called with a location
// argument that corresponds to a known catch block.
throw new Error("illegal catch attempt");
},

delegateYield:function delegateYield(iterable,resultName,nextLoc){
this.delegate={
iterator:values(iterable),
resultName:resultName,
nextLoc:nextLoc};


if(this.method==="next"){
// Deliberately forget the last sent value so that we don't
// accidentally pass it on to the delegate.
this.arg=undefined$1;
}

return ContinueSentinel;
}};


// Regardless of whether this script is executing as a CommonJS module
// or not, return the runtime object so that we can declare the variable
// regeneratorRuntime in the outer scope, which allows this module to be
// injected easily by `bin/regenerator --include-runtime script.js`.
return exports;

}(
// If this script is executing as a CommonJS module, use module.exports
// as the regeneratorRuntime namespace. Otherwise create a new empty
// object. Either way, the resulting object will be used to initialize
// the regeneratorRuntime variable at the top of this file.
module.exports);


try{
regeneratorRuntime=runtime;
}catch(accidentalStrictMode){
// This module should not be running in strict mode, so the above
// assignment should always work unless something is misconfigured. Just
// in case runtime.js accidentally runs in strict mode, in modern engines
// we can explicitly access globalThis. In older engines we can escape
// strict mode using a global Function call. This could conceivably fail
// if a Content Security Policy forbids using Function, but in that case
// the proper solution is to fix the accidental strict mode problem. If
// you've misconfigured your bundler to force strict mode and applied a
// CSP to forbid Function, and you're not willing to fix either of those
// problems, please detail your unique predicament in a GitHub issue.
if(typeof globalThis==="object"){
globalThis.regeneratorRuntime=runtime;
}else {
Function("r","regeneratorRuntime = r")(runtime);
}
}


/***/},

/***/"./node_modules/@babel/runtime-corejs3/regenerator/index.js":




function node_modulesBabelRuntimeCorejs3RegeneratorIndexJs(module,exports,__webpack_require__){

module.exports=__webpack_require__(/*! regenerator-runtime */"./node_modules/@babel/runtime-corejs3/node_modules/regenerator-runtime/runtime.js");


/***/},

/***/"./node_modules/canvg/lib/index.es.js":




function node_modulesCanvgLibIndexEsJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process){/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AElement",function(){return AElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AnimateColorElement",function(){return AnimateColorElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AnimateElement",function(){return AnimateElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"AnimateTransformElement",function(){return AnimateTransformElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"BoundingBox",function(){return BoundingBox;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"CB1",function(){return CB1;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"CB2",function(){return CB2;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"CB3",function(){return CB3;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"CB4",function(){return CB4;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Canvg",function(){return Canvg;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"CircleElement",function(){return CircleElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"ClipPathElement",function(){return ClipPathElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"DefsElement",function(){return DefsElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"DescElement",function(){return DescElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Document",function(){return Document;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Element",function(){return Element;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"EllipseElement",function(){return EllipseElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FeColorMatrixElement",function(){return FeColorMatrixElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FeCompositeElement",function(){return FeCompositeElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FeDropShadowElement",function(){return FeDropShadowElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FeGaussianBlurElement",function(){return FeGaussianBlurElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FeMorphologyElement",function(){return FeMorphologyElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FilterElement",function(){return FilterElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Font",function(){return Font;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FontElement",function(){return FontElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"FontFaceElement",function(){return FontFaceElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"GElement",function(){return GElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"GlyphElement",function(){return GlyphElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"GradientElement",function(){return GradientElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"ImageElement",function(){return ImageElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"LineElement",function(){return LineElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"LinearGradientElement",function(){return LinearGradientElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"MarkerElement",function(){return MarkerElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"MaskElement",function(){return MaskElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Matrix",function(){return Matrix;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"MissingGlyphElement",function(){return MissingGlyphElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Mouse",function(){return Mouse;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PSEUDO_ZERO",function(){return PSEUDO_ZERO;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Parser",function(){return Parser;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PathElement",function(){return PathElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PathParser",function(){return PathParser;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PatternElement",function(){return PatternElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Point",function(){return Point;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PolygonElement",function(){return PolygonElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"PolylineElement",function(){return PolylineElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Property",function(){return Property;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"QB1",function(){return QB1;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"QB2",function(){return QB2;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"QB3",function(){return QB3;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"RadialGradientElement",function(){return RadialGradientElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"RectElement",function(){return RectElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"RenderedElement",function(){return RenderedElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Rotate",function(){return Rotate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SVGElement",function(){return SVGElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SVGFontLoader",function(){return SVGFontLoader;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Scale",function(){return Scale;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Screen",function(){return Screen;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Skew",function(){return Skew;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SkewX",function(){return SkewX;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SkewY",function(){return SkewY;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"StopElement",function(){return StopElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"StyleElement",function(){return StyleElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SymbolElement",function(){return SymbolElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TRefElement",function(){return TRefElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TSpanElement",function(){return TSpanElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TextElement",function(){return TextElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TextPathElement",function(){return TextPathElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"TitleElement",function(){return TitleElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Transform",function(){return Transform;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"Translate",function(){return Translate;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"UnknownElement",function(){return UnknownElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"UseElement",function(){return UseElement;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"ViewPort",function(){return ViewPort;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"compressSpaces",function(){return compressSpaces;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"getSelectorSpecificity",function(){return getSelectorSpecificity;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"normalizeAttributeName",function(){return normalizeAttributeName;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"normalizeColor",function(){return normalizeColor;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"parseExternalUrl",function(){return parseExternalUrl;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"presets",function(){return index;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"toNumbers",function(){return toNumbers;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"trimLeft",function(){return trimLeft;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"trimRight",function(){return trimRight;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"vectorMagnitude",function(){return vectorMagnitude;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"vectorsAngle",function(){return vectorsAngle;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"vectorsRatio",function(){return vectorsRatio;});
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/starts-with */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/starts-with.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_0___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/parse-float */"./node_modules/@babel/runtime-corejs3/core-js-stable/parse-float.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/map */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/map.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/slicedToArray */"./node_modules/@babel/runtime-corejs3/helpers/slicedToArray.js");
/* harmony import */var _babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/define-property */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-property.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/define-properties */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/define-properties.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/for-each */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/for-each.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/filter */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/object/keys */"./node_modules/@babel/runtime-corejs3/core-js-stable/object/keys.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */var _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(/*! @babel/runtime-corejs3/regenerator */"./node_modules/@babel/runtime-corejs3/regenerator/index.js");
/* harmony import */var _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */var _babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/asyncToGenerator */"./node_modules/@babel/runtime-corejs3/helpers/asyncToGenerator.js");
/* harmony import */var _babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */var _babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/defineProperty */"./node_modules/@babel/runtime-corejs3/helpers/defineProperty.js");
/* harmony import */var _babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */var _babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/classCallCheck */"./node_modules/@babel/runtime-corejs3/helpers/classCallCheck.js");
/* harmony import */var _babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */var _babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/createClass */"./node_modules/@babel/runtime-corejs3/helpers/createClass.js");
/* harmony import */var _babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/concat */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/concat.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/reduce */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reduce.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_date_now__WEBPACK_IMPORTED_MODULE_19__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/date/now */"./node_modules/@babel/runtime-corejs3/core-js-stable/date/now.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_date_now__WEBPACK_IMPORTED_MODULE_19___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_date_now__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/every */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/every.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/promise */"./node_modules/@babel/runtime-corejs3/core-js-stable/promise.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/bind */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/bind.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */var raf__WEBPACK_IMPORTED_MODULE_23__=__webpack_require__(/*! raf */"./node_modules/raf/index.js");
/* harmony import */var raf__WEBPACK_IMPORTED_MODULE_23___default=/*#__PURE__*/__webpack_require__.n(raf__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/trim */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/trim.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */var rgbcolor__WEBPACK_IMPORTED_MODULE_25__=__webpack_require__(/*! rgbcolor */"./node_modules/rgbcolor/index.js");
/* harmony import */var rgbcolor__WEBPACK_IMPORTED_MODULE_25___default=/*#__PURE__*/__webpack_require__.n(rgbcolor__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/reflect/construct */"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/construct.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */var _babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/inherits */"./node_modules/@babel/runtime-corejs3/helpers/inherits.js");
/* harmony import */var _babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */var _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/possibleConstructorReturn */"./node_modules/@babel/runtime-corejs3/helpers/possibleConstructorReturn.js");
/* harmony import */var _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28__);
/* harmony import */var _babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/getPrototypeOf */"./node_modules/@babel/runtime-corejs3/helpers/getPrototypeOf.js");
/* harmony import */var _babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29__);
/* harmony import */var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_30__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/toConsumableArray */"./node_modules/@babel/runtime-corejs3/helpers/toConsumableArray.js");
/* harmony import */var _babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_30___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_30__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_31__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/some */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/some.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_31___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_31__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/includes */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/includes.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/array/from */"./node_modules/@babel/runtime-corejs3/core-js-stable/array/from.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_34__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/reverse */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/reverse.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_34___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_34__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/index-of */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/index-of.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35__);
/* harmony import */var _babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/get */"./node_modules/@babel/runtime-corejs3/helpers/get.js");
/* harmony import */var _babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_fill__WEBPACK_IMPORTED_MODULE_37__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/fill */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/fill.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_fill__WEBPACK_IMPORTED_MODULE_37___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_fill__WEBPACK_IMPORTED_MODULE_37__);
/* harmony import */var svg_pathdata__WEBPACK_IMPORTED_MODULE_38__=__webpack_require__(/*! svg-pathdata */"./node_modules/svg-pathdata/lib/SVGPathData.module.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_delete_property__WEBPACK_IMPORTED_MODULE_39__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/reflect/delete-property */"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/delete-property.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_delete_property__WEBPACK_IMPORTED_MODULE_39___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_reflect_delete_property__WEBPACK_IMPORTED_MODULE_39__);
/* harmony import */var _babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40__=__webpack_require__(/*! @babel/runtime-corejs3/helpers/assertThisInitialized */"./node_modules/@babel/runtime-corejs3/helpers/assertThisInitialized.js");
/* harmony import */var _babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/values */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/values.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/parse-int */"./node_modules/@babel/runtime-corejs3/core-js-stable/parse-int.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42__);
/* harmony import */var _babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_43__=__webpack_require__(/*! @babel/runtime-corejs3/core-js/get-iterator */"./node_modules/@babel/runtime-corejs3/core-js/get-iterator.js");
/* harmony import */var _babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_43___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_43__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_44__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/array/is-array */"./node_modules/@babel/runtime-corejs3/core-js-stable/array/is-array.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_44___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_44__);
/* harmony import */var _babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_45__=__webpack_require__(/*! @babel/runtime-corejs3/core-js/get-iterator-method */"./node_modules/@babel/runtime-corejs3/core-js/get-iterator-method.js");
/* harmony import */var _babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_45___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_45__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_46__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/symbol */"./node_modules/@babel/runtime-corejs3/core-js-stable/symbol.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_46___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_46__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_47__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/instance/slice */"./node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_47___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_47__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_map__WEBPACK_IMPORTED_MODULE_48__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/map */"./node_modules/@babel/runtime-corejs3/core-js-stable/map.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_map__WEBPACK_IMPORTED_MODULE_48___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_map__WEBPACK_IMPORTED_MODULE_48__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_apply__WEBPACK_IMPORTED_MODULE_49__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/reflect/apply */"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/apply.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_apply__WEBPACK_IMPORTED_MODULE_49___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_reflect_apply__WEBPACK_IMPORTED_MODULE_49__);
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_50__=__webpack_require__(/*! @babel/runtime-corejs3/core-js-stable/reflect/get-prototype-of */"./node_modules/@babel/runtime-corejs3/core-js-stable/reflect/get-prototype-of.js");
/* harmony import */var _babel_runtime_corejs3_core_js_stable_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_50___default=/*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs3_core_js_stable_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_50__);
/* harmony import */var stackblur_canvas__WEBPACK_IMPORTED_MODULE_51__=__webpack_require__(/*! stackblur-canvas */"./node_modules/stackblur-canvas/dist/stackblur-es.js");





















































/**
 * HTML-safe compress white-spaces.
 * @param str - String to compress.
 */
function compressSpaces(str){
return str.replace(/(?!\u3000)\s+/gm,' ');
}
/**
 * HTML-safe left trim.
 * @param str - String to trim.
 */

function trimLeft(str){
return str.replace(/^[\n \t]+/,'');
}
/**
 * HTML-safe right trim.
 * @param str - String to trim.
 */

function trimRight(str){
return str.replace(/[\n \t]+$/,'');
}
/**
 * String to numbers array.
 * @param str - Numbers string.
 */

function toNumbers(str){
var matches=(str||'').match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm)||[];
return _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(matches).call(matches,_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default.a);
}// Microsoft Edge fix

var allUppercase=/^[A-Z-]+$/;
/**
 * Normalize attribute name.
 * @param name - Attribute name.
 */

function normalizeAttributeName(name){
if(allUppercase.test(name)){
return name.toLowerCase();
}

return name;
}
/**
 * Parse external URL.
 * @param url - CSS url string.
 */

function parseExternalUrl(url){
//                                   single quotes [2]
//                                   v           double quotes [3]
//                                   v           v        no quotes [4]
//                                   v           v        v
var urlMatch=url.match(/url\(('([^']+)'|"([^"]+)"|([^'"\)]+))\)/)||[];
return urlMatch[2]||urlMatch[3]||urlMatch[4];
}
/**
 * Transform floats to integers in rgb colors.
 * @param color - Color to normalize.
 */

function normalizeColor(color){
if(!_babel_runtime_corejs3_core_js_stable_instance_starts_with__WEBPACK_IMPORTED_MODULE_0___default()(color).call(color,'rgb')){
return color;
}

var rgbParts=3;
var normalizedColor=color.replace(/\d+(\.\d+)?/g,function(num,isFloat){
return rgbParts--&&isFloat?String(Math.round(_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(num))):num;
});
return normalizedColor;
}

// slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
var attributeRegex=/(\[[^\]]+\])/g;
var idRegex=/(#[^\s\+>~\.\[:]+)/g;
var classRegex=/(\.[^\s\+>~\.\[:]+)/g;
var pseudoElementRegex=/(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
var pseudoClassWithBracketsRegex=/(:[\w-]+\([^\)]*\))/gi;
var pseudoClassRegex=/(:[^\s\+>~\.\[:]+)/g;
var elementRegex=/([^\s\+>~\.\[:]+)/g;

function findSelectorMatch(selector,regex){
var matches=selector.match(regex);

if(!matches){
return [selector,0];
}

return [selector.replace(regex,' '),matches.length];
}
/**
 * Measure selector specificity.
 * @param selector - Selector to measure.
 */


function getSelectorSpecificity(selector){
var specificity=[0,0,0];
var currentSelector=selector.replace(/:not\(([^\)]*)\)/g,'     $1 ').replace(/{[\s\S]*/gm,' ');
var delta=0;

var _findSelectorMatch=findSelectorMatch(currentSelector,attributeRegex);

var _findSelectorMatch2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch,2);

currentSelector=_findSelectorMatch2[0];
delta=_findSelectorMatch2[1];
specificity[1]+=delta;

var _findSelectorMatch3=findSelectorMatch(currentSelector,idRegex);

var _findSelectorMatch4=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch3,2);

currentSelector=_findSelectorMatch4[0];
delta=_findSelectorMatch4[1];
specificity[0]+=delta;

var _findSelectorMatch5=findSelectorMatch(currentSelector,classRegex);

var _findSelectorMatch6=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch5,2);

currentSelector=_findSelectorMatch6[0];
delta=_findSelectorMatch6[1];
specificity[1]+=delta;

var _findSelectorMatch7=findSelectorMatch(currentSelector,pseudoElementRegex);

var _findSelectorMatch8=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch7,2);

currentSelector=_findSelectorMatch8[0];
delta=_findSelectorMatch8[1];
specificity[2]+=delta;

var _findSelectorMatch9=findSelectorMatch(currentSelector,pseudoClassWithBracketsRegex);

var _findSelectorMatch10=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch9,2);

currentSelector=_findSelectorMatch10[0];
delta=_findSelectorMatch10[1];
specificity[1]+=delta;

var _findSelectorMatch11=findSelectorMatch(currentSelector,pseudoClassRegex);

var _findSelectorMatch12=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch11,2);

currentSelector=_findSelectorMatch12[0];
delta=_findSelectorMatch12[1];
specificity[1]+=delta;
currentSelector=currentSelector.replace(/[\*\s\+>~]/g,' ').replace(/[#\.]/g,' ');

var _findSelectorMatch13=findSelectorMatch(currentSelector,elementRegex);

var _findSelectorMatch14=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_findSelectorMatch13,2);

currentSelector=_findSelectorMatch14[0];
delta=_findSelectorMatch14[1];
// lgtm [js/useless-assignment-to-local]
specificity[2]+=delta;
return specificity.join('');
}

var PSEUDO_ZERO=.00000001;
/**
 * Vector magnitude.
 */

function vectorMagnitude(v){
return Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2));
}
/**
 * Ratio between two vectors.
 */

function vectorsRatio(u,v){
return (u[0]*v[0]+u[1]*v[1])/(vectorMagnitude(u)*vectorMagnitude(v));
}
/**
 * Angle between two vectors.
 */

function vectorsAngle(u,v){
return (u[0]*v[1]<u[1]*v[0]?-1:1)*Math.acos(vectorsRatio(u,v));
}
function CB1(t){
return t*t*t;
}
function CB2(t){
return 3*t*t*(1-t);
}
function CB3(t){
return 3*t*(1-t)*(1-t);
}
function CB4(t){
return (1-t)*(1-t)*(1-t);
}
function QB1(t){
return t*t;
}
function QB2(t){
return 2*t*(1-t);
}
function QB3(t){
return (1-t)*(1-t);
}

var Property=/*#__PURE__*/function(){
function Property(document,name,value){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Property);

this.document=document;
this.name=name;
this.value=value;
this.isNormalizedColor=false;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Property,[{
key:"split",
value:function split(){
var _context,_context2;

var separator=arguments.length>0&&arguments[0]!==undefined?arguments[0]:' ';
var document=this.document,
name=this.name;
return _babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context2=compressSpaces(this.getString())).call(_context2).split(separator)).call(_context,function(value){
return new Property(document,name,value);
});
}},
{
key:"hasValue",
value:function hasValue(zeroIsValue){
var value=this.value;
return value!==null&&value!==''&&(zeroIsValue||value!==0)&&typeof value!=='undefined';
}},
{
key:"isString",
value:function isString(regexp){
var value=this.value;
var result=typeof value==='string';

if(!result||!regexp){
return result;
}

return regexp.test(value);
}},
{
key:"isUrlDefinition",
value:function isUrlDefinition(){
return this.isString(/^url\(/);
}},
{
key:"isPixels",
value:function isPixels(){
if(!this.hasValue()){
return false;
}

var asString=this.getString();

switch(true){
case /px$/.test(asString):
case /^[0-9]+$/.test(asString):
return true;

default:
return false;}

}},
{
key:"setValue",
value:function setValue(value){
this.value=value;
return this;
}},
{
key:"getValue",
value:function getValue(def){
if(typeof def==='undefined'||this.hasValue()){
return this.value;
}

return def;
}},
{
key:"getNumber",
value:function getNumber(def){
if(!this.hasValue()){
if(typeof def==='undefined'){
return 0;
}

return _babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(def);
}

var value=this.value;

var n=_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(value);

if(this.isString(/%$/)){
n=n/100.0;
}

return n;
}},
{
key:"getString",
value:function getString(def){
if(typeof def==='undefined'||this.hasValue()){
return typeof this.value==='undefined'?'':String(this.value);
}

return String(def);
}},
{
key:"getColor",
value:function getColor(def){
var color=this.getString(def);

if(this.isNormalizedColor){
return color;
}

this.isNormalizedColor=true;
color=normalizeColor(color);
this.value=color;
return color;
}},
{
key:"getDpi",
value:function getDpi(){
return 96.0;// TODO: compute?
}},
{
key:"getRem",
value:function getRem(){
return this.document.rootEmSize;
}},
{
key:"getEm",
value:function getEm(){
return this.document.emSize;
}},
{
key:"getUnits",
value:function getUnits(){
return this.getString().replace(/[0-9\.\-]/g,'');
}},
{
key:"getPixels",
value:function getPixels(axisOrIsFontSize){
var processPercent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;

if(!this.hasValue()){
return 0;
}

var _ref=typeof axisOrIsFontSize==='boolean'?[undefined,axisOrIsFontSize]:[axisOrIsFontSize],
_ref2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_ref,2),
axis=_ref2[0],
isFontSize=_ref2[1];

var viewPort=this.document.screen.viewPort;

switch(true){
case this.isString(/vmin$/):
return this.getNumber()/100.0*Math.min(viewPort.computeSize('x'),viewPort.computeSize('y'));

case this.isString(/vmax$/):
return this.getNumber()/100.0*Math.max(viewPort.computeSize('x'),viewPort.computeSize('y'));

case this.isString(/vw$/):
return this.getNumber()/100.0*viewPort.computeSize('x');

case this.isString(/vh$/):
return this.getNumber()/100.0*viewPort.computeSize('y');

case this.isString(/rem$/):
return this.getNumber()*this.getRem();

case this.isString(/em$/):
return this.getNumber()*this.getEm();

case this.isString(/ex$/):
return this.getNumber()*this.getEm()/2.0;

case this.isString(/px$/):
return this.getNumber();

case this.isString(/pt$/):
return this.getNumber()*this.getDpi()*(1.0/72.0);

case this.isString(/pc$/):
return this.getNumber()*15;

case this.isString(/cm$/):
return this.getNumber()*this.getDpi()/2.54;

case this.isString(/mm$/):
return this.getNumber()*this.getDpi()/25.4;

case this.isString(/in$/):
return this.getNumber()*this.getDpi();

case this.isString(/%$/)&&isFontSize:
return this.getNumber()*this.getEm();

case this.isString(/%$/):
return this.getNumber()*viewPort.computeSize(axis);

default:
{
var n=this.getNumber();

if(processPercent&&n<1.0){
return n*viewPort.computeSize(axis);
}

return n;
}}

}},
{
key:"getMilliseconds",
value:function getMilliseconds(){
if(!this.hasValue()){
return 0;
}

if(this.isString(/ms$/)){
return this.getNumber();
}

return this.getNumber()*1000;
}},
{
key:"getRadians",
value:function getRadians(){
if(!this.hasValue()){
return 0;
}

switch(true){
case this.isString(/deg$/):
return this.getNumber()*(Math.PI/180.0);

case this.isString(/grad$/):
return this.getNumber()*(Math.PI/200.0);

case this.isString(/rad$/):
return this.getNumber();

default:
return this.getNumber()*(Math.PI/180.0);}

}},
{
key:"getDefinition",
value:function getDefinition(){
var asString=this.getString();
var name=asString.match(/#([^\)'"]+)/);

if(name){
name=name[1];
}

if(!name){
name=asString;
}

return this.document.definitions[name];
}},
{
key:"getFillStyleDefinition",
value:function getFillStyleDefinition(element,opacity){
var def=this.getDefinition();

if(!def){
return null;
}// gradient


if(typeof def.createGradient==='function'){
return def.createGradient(this.document.ctx,element,opacity);
}// pattern


if(typeof def.createPattern==='function'){
if(def.getHrefAttribute().hasValue()){
var patternTransform=def.getAttribute('patternTransform');
def=def.getHrefAttribute().getDefinition();

if(patternTransform.hasValue()){
def.getAttribute('patternTransform',true).setValue(patternTransform.value);
}
}

return def.createPattern(this.document.ctx,element,opacity);
}

return null;
}},
{
key:"getTextBaseline",
value:function getTextBaseline(){
if(!this.hasValue()){
return null;
}

return Property.textBaselineMapping[this.getString()];
}},
{
key:"addOpacity",
value:function addOpacity(opacity){
var value=this.getColor();
var len=value.length;
var commas=0;// Simulate old RGBColor version, which can't parse rgba.

for(var i=0;i<len;i++){
if(value[i]===','){
commas++;
}

if(commas===3){
break;
}
}

if(opacity.hasValue()&&this.isString()&&commas!==3){
var color=new rgbcolor__WEBPACK_IMPORTED_MODULE_25___default.a(value);

if(color.ok){
color.alpha=opacity.getNumber();
value=color.toRGBA();
}
}

return new Property(this.document,this.name,value);
}}],
[{
key:"empty",
value:function empty(document){
return new Property(document,'EMPTY','');
}}]);


return Property;
}();
Property.textBaselineMapping={
'baseline':'alphabetic',
'before-edge':'top',
'text-before-edge':'top',
'middle':'middle',
'central':'middle',
'after-edge':'bottom',
'text-after-edge':'bottom',
'ideographic':'ideographic',
'alphabetic':'alphabetic',
'hanging':'hanging',
'mathematical':'alphabetic'};


var ViewPort=/*#__PURE__*/function(){
function ViewPort(){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,ViewPort);

this.viewPorts=[];
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(ViewPort,[{
key:"clear",
value:function clear(){
this.viewPorts=[];
}},
{
key:"setCurrent",
value:function setCurrent(width,height){
this.viewPorts.push({
width:width,
height:height});

}},
{
key:"removeCurrent",
value:function removeCurrent(){
this.viewPorts.pop();
}},
{
key:"getCurrent",
value:function getCurrent(){
var viewPorts=this.viewPorts;
return viewPorts[viewPorts.length-1];
}},
{
key:"computeSize",
value:function computeSize(d){
if(typeof d==='number'){
return d;
}

if(d==='x'){
return this.width;
}

if(d==='y'){
return this.height;
}

return Math.sqrt(Math.pow(this.width,2)+Math.pow(this.height,2))/Math.sqrt(2);
}},
{
key:"width",
get:function get(){
return this.getCurrent().width;
}},
{
key:"height",
get:function get(){
return this.getCurrent().height;
}}]);


return ViewPort;
}();

var Point=/*#__PURE__*/function(){
function Point(x,y){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Point);

this.x=x;
this.y=y;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Point,[{
key:"angleTo",
value:function angleTo(point){
return Math.atan2(point.y-this.y,point.x-this.x);
}},
{
key:"applyTransform",
value:function applyTransform(transform){
var x=this.x,
y=this.y;
var xp=x*transform[0]+y*transform[2]+transform[4];
var yp=x*transform[1]+y*transform[3]+transform[5];
this.x=xp;
this.y=yp;
}}],
[{
key:"parse",
value:function parse(point){
var defaultValue=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;

var _toNumbers=toNumbers(point),
_toNumbers2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_toNumbers,2),
_toNumbers2$=_toNumbers2[0],
x=_toNumbers2$===void 0?defaultValue:_toNumbers2$,
_toNumbers2$2=_toNumbers2[1],
y=_toNumbers2$2===void 0?defaultValue:_toNumbers2$2;

return new Point(x,y);
}},
{
key:"parseScale",
value:function parseScale(scale){
var defaultValue=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1;

var _toNumbers3=toNumbers(scale),
_toNumbers4=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_toNumbers3,2),
_toNumbers4$=_toNumbers4[0],
x=_toNumbers4$===void 0?defaultValue:_toNumbers4$,
_toNumbers4$2=_toNumbers4[1],
y=_toNumbers4$2===void 0?x:_toNumbers4$2;

return new Point(x,y);
}},
{
key:"parsePath",
value:function parsePath(path){
var points=toNumbers(path);
var len=points.length;
var pathPoints=[];

for(var i=0;i<len;i+=2){
pathPoints.push(new Point(points[i],points[i+1]));
}

return pathPoints;
}}]);


return Point;
}();

var Mouse=/*#__PURE__*/function(){
function Mouse(screen){
var _context,_context2;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Mouse);

this.screen=screen;
this.working=false;
this.events=[];
this.eventElements=[];
this.onClick=_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default()(_context=this.onClick).call(_context,this);
this.onMouseMove=_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default()(_context2=this.onMouseMove).call(_context2,this);
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Mouse,[{
key:"isWorking",
value:function isWorking(){
return this.working;
}},
{
key:"start",
value:function start(){
if(this.working){
return;
}

var screen=this.screen,
onClick=this.onClick,
onMouseMove=this.onMouseMove;
var canvas=screen.ctx.canvas;
canvas.onclick=onClick;
canvas.onmousemove=onMouseMove;
this.working=true;
}},
{
key:"stop",
value:function stop(){
if(!this.working){
return;
}

var canvas=this.screen.ctx.canvas;
this.working=false;
canvas.onclick=null;
canvas.onmousemove=null;
}},
{
key:"hasEvents",
value:function hasEvents(){
return this.working&&this.events.length>0;
}},
{
key:"runEvents",
value:function runEvents(){
if(!this.working){
return;
}

var document=this.screen,
events=this.events,
eventElements=this.eventElements;
var style=document.ctx.canvas.style;

if(style){
style.cursor='';
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(events).call(events,function(_ref,i){
var run=_ref.run;
var element=eventElements[i];

while(element){
run(element);
element=element.parent;
}
});// done running, clear


this.events=[];
this.eventElements=[];
}},
{
key:"checkPath",
value:function checkPath(element,ctx){
if(!this.working||!ctx){
return;
}

var events=this.events,
eventElements=this.eventElements;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(events).call(events,function(_ref2,i){
var x=_ref2.x,
y=_ref2.y;

if(!eventElements[i]&&ctx.isPointInPath&&ctx.isPointInPath(x,y)){
eventElements[i]=element;
}
});
}},
{
key:"checkBoundingBox",
value:function checkBoundingBox(element,boundingBox){
if(!this.working||!boundingBox){
return;
}

var events=this.events,
eventElements=this.eventElements;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(events).call(events,function(_ref3,i){
var x=_ref3.x,
y=_ref3.y;

if(!eventElements[i]&&boundingBox.isPointInBox(x,y)){
eventElements[i]=element;
}
});
}},
{
key:"mapXY",
value:function mapXY(x,y){
var _this$screen=this.screen,
window=_this$screen.window,
ctx=_this$screen.ctx;
var point=new Point(x,y);
var element=ctx.canvas;

while(element){
point.x-=element.offsetLeft;
point.y-=element.offsetTop;
element=element.offsetParent;
}

if(window.scrollX){
point.x+=window.scrollX;
}

if(window.scrollY){
point.y+=window.scrollY;
}

return point;
}},
{
key:"onClick",
value:function onClick(evt){
var _this$mapXY=this.mapXY((evt||event).clientX,(evt||event).clientY),
x=_this$mapXY.x,
y=_this$mapXY.y;

this.events.push({
type:'onclick',
x:x,
y:y,
run:function run(event){
if(event.onClick){
event.onClick();
}
}});

}},
{
key:"onMouseMove",
value:function onMouseMove(evt){
var _this$mapXY2=this.mapXY((evt||event).clientX,(evt||event).clientY),
x=_this$mapXY2.x,
y=_this$mapXY2.y;

this.events.push({
type:'onmousemove',
x:x,
y:y,
run:function run(event){
if(event.onMouseMove){
event.onMouseMove();
}
}});

}}]);


return Mouse;
}();

var defaultWindow=typeof window!=='undefined'?window:null;
var defaultFetch=typeof fetch!=='undefined'?_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default()(fetch).call(fetch,void 0)// `fetch` depends on context: `someObject.fetch(...)` will throw error.
:null;

var Screen=/*#__PURE__*/function(){
function Screen(ctx){
var _ref=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},
_ref$fetch=_ref.fetch,
fetch=_ref$fetch===void 0?defaultFetch:_ref$fetch,
_ref$window=_ref.window,
window=_ref$window===void 0?defaultWindow:_ref$window;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Screen);

this.ctx=ctx;
this.FRAMERATE=30;
this.MAX_VIRTUAL_PIXELS=30000;
this.CLIENT_WIDTH=800;
this.CLIENT_HEIGHT=600;
this.viewPort=new ViewPort();
this.mouse=new Mouse(this);
this.animations=[];
this.waits=[];
this.frameDuration=0;
this.isReadyLock=false;
this.isFirstRender=true;
this.intervalId=null;
this.window=window;
this.fetch=fetch;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Screen,[{
key:"wait",
value:function wait(checker){
this.waits.push(checker);
}},
{
key:"ready",
value:function ready(){
if(!this.readyPromise){
return _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21___default.a.resolve();
}

return this.readyPromise;
}},
{
key:"isReady",
value:function isReady(){
var _context;

if(this.isReadyLock){
return true;
}

var isReadyLock=_babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20___default()(_context=this.waits).call(_context,function(_){
return _();
});

if(isReadyLock){
this.waits=[];

if(this.resolveReady){
this.resolveReady();
}
}

this.isReadyLock=isReadyLock;
return isReadyLock;
}},
{
key:"setDefaults",
value:function setDefaults(ctx){
// initial values and defaults
ctx.strokeStyle='rgba(0,0,0,0)';
ctx.lineCap='butt';
ctx.lineJoin='miter';
ctx.miterLimit=4;
}},
{
key:"setViewBox",
value:function setViewBox(_ref2){
var document=_ref2.document,
ctx=_ref2.ctx,
aspectRatio=_ref2.aspectRatio,
width=_ref2.width,
desiredWidth=_ref2.desiredWidth,
height=_ref2.height,
desiredHeight=_ref2.desiredHeight,
_ref2$minX=_ref2.minX,
minX=_ref2$minX===void 0?0:_ref2$minX,
_ref2$minY=_ref2.minY,
minY=_ref2$minY===void 0?0:_ref2$minY,
refX=_ref2.refX,
refY=_ref2.refY,
_ref2$clip=_ref2.clip,
clip=_ref2$clip===void 0?false:_ref2$clip,
_ref2$clipX=_ref2.clipX,
clipX=_ref2$clipX===void 0?0:_ref2$clipX,
_ref2$clipY=_ref2.clipY,
clipY=_ref2$clipY===void 0?0:_ref2$clipY;
// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
var cleanAspectRatio=compressSpaces(aspectRatio).replace(/^defer\s/,'');// ignore defer

var _cleanAspectRatio$spl=cleanAspectRatio.split(' '),
_cleanAspectRatio$spl2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_cleanAspectRatio$spl,2),
aspectRatioAlign=_cleanAspectRatio$spl2[0],
aspectRatioMeetOrSlice=_cleanAspectRatio$spl2[1];

var align=aspectRatioAlign||'xMidYMid';
var meetOrSlice=aspectRatioMeetOrSlice||'meet';// calculate scale

var scaleX=width/desiredWidth;
var scaleY=height/desiredHeight;
var scaleMin=Math.min(scaleX,scaleY);
var scaleMax=Math.max(scaleX,scaleY);
var finalDesiredWidth=desiredWidth;
var finalDesiredHeight=desiredHeight;

if(meetOrSlice==='meet'){
finalDesiredWidth*=scaleMin;
finalDesiredHeight*=scaleMin;
}

if(meetOrSlice==='slice'){
finalDesiredWidth*=scaleMax;
finalDesiredHeight*=scaleMax;
}

var refXProp=new Property(document,'refX',refX);
var refYProp=new Property(document,'refY',refY);
var hasRefs=refXProp.hasValue()&&refYProp.hasValue();

if(hasRefs){
ctx.translate(-scaleMin*refXProp.getPixels('x'),-scaleMin*refYProp.getPixels('y'));
}

if(clip){
var scaledClipX=scaleMin*clipX;
var scaledClipY=scaleMin*clipY;
ctx.beginPath();
ctx.moveTo(scaledClipX,scaledClipY);
ctx.lineTo(width,scaledClipY);
ctx.lineTo(width,height);
ctx.lineTo(scaledClipX,height);
ctx.closePath();
ctx.clip();
}

if(!hasRefs){
var isMeetMinY=meetOrSlice==='meet'&&scaleMin===scaleY;
var isSliceMaxY=meetOrSlice==='slice'&&scaleMax===scaleY;
var isMeetMinX=meetOrSlice==='meet'&&scaleMin===scaleX;
var isSliceMaxX=meetOrSlice==='slice'&&scaleMax===scaleX;

if(/^xMid/.test(align)&&(isMeetMinY||isSliceMaxY)){
ctx.translate(width/2.0-finalDesiredWidth/2.0,0);
}

if(/YMid$/.test(align)&&(isMeetMinX||isSliceMaxX)){
ctx.translate(0,height/2.0-finalDesiredHeight/2.0);
}

if(/^xMax/.test(align)&&(isMeetMinY||isSliceMaxY)){
ctx.translate(width-finalDesiredWidth,0);
}

if(/YMax$/.test(align)&&(isMeetMinX||isSliceMaxX)){
ctx.translate(0,height-finalDesiredHeight);
}
}// scale


switch(true){
case align==='none':
ctx.scale(scaleX,scaleY);
break;

case meetOrSlice==='meet':
ctx.scale(scaleMin,scaleMin);
break;

case meetOrSlice==='slice':
ctx.scale(scaleMax,scaleMax);
break;}
// translate


ctx.translate(-minX,-minY);
}},
{
key:"start",
value:function start(element){
var _this=this;

var _ref3=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},
_ref3$enableRedraw=_ref3.enableRedraw,
enableRedraw=_ref3$enableRedraw===void 0?false:_ref3$enableRedraw,
_ref3$ignoreMouse=_ref3.ignoreMouse,
ignoreMouse=_ref3$ignoreMouse===void 0?false:_ref3$ignoreMouse,
_ref3$ignoreAnimation=_ref3.ignoreAnimation,
ignoreAnimation=_ref3$ignoreAnimation===void 0?false:_ref3$ignoreAnimation,
_ref3$ignoreDimension=_ref3.ignoreDimensions,
ignoreDimensions=_ref3$ignoreDimension===void 0?false:_ref3$ignoreDimension,
_ref3$ignoreClear=_ref3.ignoreClear,
ignoreClear=_ref3$ignoreClear===void 0?false:_ref3$ignoreClear,
forceRedraw=_ref3.forceRedraw,
scaleWidth=_ref3.scaleWidth,
scaleHeight=_ref3.scaleHeight,
offsetX=_ref3.offsetX,
offsetY=_ref3.offsetY;

var FRAMERATE=this.FRAMERATE,
mouse=this.mouse;
var frameDuration=1000/FRAMERATE;
this.frameDuration=frameDuration;
this.readyPromise=new _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21___default.a(function(resolve){
_this.resolveReady=resolve;
});

if(this.isReady()){
this.render(element,ignoreDimensions,ignoreClear,scaleWidth,scaleHeight,offsetX,offsetY);
}

if(!enableRedraw){
return;
}

var now=_babel_runtime_corejs3_core_js_stable_date_now__WEBPACK_IMPORTED_MODULE_19___default()();

var then=now;
var delta=0;

var tick=function tick(){
now=_babel_runtime_corejs3_core_js_stable_date_now__WEBPACK_IMPORTED_MODULE_19___default()();
delta=now-then;

if(delta>=frameDuration){
then=now-delta%frameDuration;

if(_this.shouldUpdate(ignoreAnimation,forceRedraw)){
_this.render(element,ignoreDimensions,ignoreClear,scaleWidth,scaleHeight,offsetX,offsetY);

mouse.runEvents();
}
}

_this.intervalId=raf__WEBPACK_IMPORTED_MODULE_23___default()(tick);
};

if(!ignoreMouse){
mouse.start();
}

this.intervalId=raf__WEBPACK_IMPORTED_MODULE_23___default()(tick);
}},
{
key:"stop",
value:function stop(){
if(this.intervalId){
raf__WEBPACK_IMPORTED_MODULE_23___default.a.cancel(this.intervalId);
this.intervalId=null;
}

this.mouse.stop();
}},
{
key:"shouldUpdate",
value:function shouldUpdate(ignoreAnimation,forceRedraw){
// need update from animations?
if(!ignoreAnimation){
var _context2;

var frameDuration=this.frameDuration;

var shouldUpdate=_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default()(_context2=this.animations).call(_context2,function(shouldUpdate,animation){
return animation.update(frameDuration)||shouldUpdate;
},false);

if(shouldUpdate){
return true;
}
}// need update from redraw?


if(typeof forceRedraw==='function'&&forceRedraw()){
return true;
}

if(!this.isReadyLock&&this.isReady()){
return true;
}// need update from mouse events?


if(this.mouse.hasEvents()){
return true;
}

return false;
}},
{
key:"render",
value:function render(element,ignoreDimensions,ignoreClear,scaleWidth,scaleHeight,offsetX,offsetY){
var CLIENT_WIDTH=this.CLIENT_WIDTH,
CLIENT_HEIGHT=this.CLIENT_HEIGHT,
viewPort=this.viewPort,
ctx=this.ctx,
isFirstRender=this.isFirstRender;
var canvas=ctx.canvas;
viewPort.clear();

if(canvas.width&&canvas.height){
viewPort.setCurrent(canvas.width,canvas.height);
}else {
viewPort.setCurrent(CLIENT_WIDTH,CLIENT_HEIGHT);
}

var widthStyle=element.getStyle('width');
var heightStyle=element.getStyle('height');

if(!ignoreDimensions&&(isFirstRender||typeof scaleWidth!=='number'&&typeof scaleHeight!=='number')){
// set canvas size
if(widthStyle.hasValue()){
canvas.width=widthStyle.getPixels('x');

if(canvas.style){
canvas.style.width="".concat(canvas.width,"px");
}
}

if(heightStyle.hasValue()){
canvas.height=heightStyle.getPixels('y');

if(canvas.style){
canvas.style.height="".concat(canvas.height,"px");
}
}
}

var cWidth=canvas.clientWidth||canvas.width;
var cHeight=canvas.clientHeight||canvas.height;

if(ignoreDimensions&&widthStyle.hasValue()&&heightStyle.hasValue()){
cWidth=widthStyle.getPixels('x');
cHeight=heightStyle.getPixels('y');
}

viewPort.setCurrent(cWidth,cHeight);

if(typeof offsetX==='number'){
element.getAttribute('x',true).setValue(offsetX);
}

if(typeof offsetY==='number'){
element.getAttribute('y',true).setValue(offsetY);
}

if(typeof scaleWidth==='number'||typeof scaleHeight==='number'){
var _context3,_context4;

var viewBox=toNumbers(element.getAttribute('viewBox').getString());
var xRatio=0;
var yRatio=0;

if(typeof scaleWidth==='number'){
var _widthStyle=element.getStyle('width');

if(_widthStyle.hasValue()){
xRatio=_widthStyle.getPixels('x')/scaleWidth;
}else if(!isNaN(viewBox[2])){
xRatio=viewBox[2]/scaleWidth;
}
}

if(typeof scaleHeight==='number'){
var _heightStyle=element.getStyle('height');

if(_heightStyle.hasValue()){
yRatio=_heightStyle.getPixels('y')/scaleHeight;
}else if(!isNaN(viewBox[3])){
yRatio=viewBox[3]/scaleHeight;
}
}

if(!xRatio){
xRatio=yRatio;
}

if(!yRatio){
yRatio=xRatio;
}

element.getAttribute('width',true).setValue(scaleWidth);
element.getAttribute('height',true).setValue(scaleHeight);
var transformStyle=element.getStyle('transform',true,true);
transformStyle.setValue(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context3=_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context4="".concat(transformStyle.getString()," scale(")).call(_context4,1.0/xRatio,", ")).call(_context3,1.0/yRatio,")"));
}// clear and render


if(!ignoreClear){
ctx.clearRect(0,0,cWidth,cHeight);
}

element.render(ctx);

if(isFirstRender){
this.isFirstRender=false;
}
}}]);


return Screen;
}();
Screen.defaultWindow=defaultWindow;
Screen.defaultFetch=defaultFetch;

var defaultFetch$1=Screen.defaultFetch;
var DefaultDOMParser=typeof DOMParser!=='undefined'?DOMParser:null;

var Parser=/*#__PURE__*/function(){
function Parser(){
var _ref=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},
_ref$fetch=_ref.fetch,
fetch=_ref$fetch===void 0?defaultFetch$1:_ref$fetch,
_ref$DOMParser=_ref.DOMParser,
DOMParser=_ref$DOMParser===void 0?DefaultDOMParser:_ref$DOMParser;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Parser);

this.fetch=fetch;
this.DOMParser=DOMParser;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Parser,[{
key:"parse",
value:function(){
var _parse=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(resource){
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
if(!/^</.test(resource)){
_context.next=2;
break;
}

return _context.abrupt("return",this.parseFromString(resource));

case 2:
return _context.abrupt("return",this.load(resource));

case 3:
case"end":
return _context.stop();}

}
},_callee,this);
}));

function parse(_x){
return _parse.apply(this,arguments);
}

return parse;
}()},
{
key:"parseFromString",
value:function parseFromString(xml){
var parser=new this.DOMParser();

try{
return this.checkDocument(parser.parseFromString(xml,'image/svg+xml'));
}catch(err){
return this.checkDocument(parser.parseFromString(xml,'text/xml'));
}
}},
{
key:"checkDocument",
value:function checkDocument(document){
var parserError=document.getElementsByTagName('parsererror')[0];

if(parserError){
throw new Error(parserError.textContent);
}

return document;
}},
{
key:"load",
value:function(){
var _load=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee2(url){
var response,xml;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee2$(_context2){
while(1){
switch(_context2.prev=_context2.next){
case 0:
_context2.next=2;
return this.fetch(url);

case 2:
response=_context2.sent;
_context2.next=5;
return response.text();

case 5:
xml=_context2.sent;
return _context2.abrupt("return",this.parseFromString(xml));

case 7:
case"end":
return _context2.stop();}

}
},_callee2,this);
}));

function load(_x2){
return _load.apply(this,arguments);
}

return load;
}()}]);


return Parser;
}();

var Translate=/*#__PURE__*/function(){
function Translate(_,point){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Translate);

this.type='translate';
this.point=null;
this.point=Point.parse(point);
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Translate,[{
key:"apply",
value:function apply(ctx){
var _this$point=this.point,
x=_this$point.x,
y=_this$point.y;
ctx.translate(x||0.0,y||0.0);
}},
{
key:"unapply",
value:function unapply(ctx){
var _this$point2=this.point,
x=_this$point2.x,
y=_this$point2.y;
ctx.translate(-1.0*x||0.0,-1.0*y||0.0);
}},
{
key:"applyToPoint",
value:function applyToPoint(point){
var _this$point3=this.point,
x=_this$point3.x,
y=_this$point3.y;
point.applyTransform([1,0,0,1,x||0.0,y||0.0]);
}}]);


return Translate;
}();

var Rotate=/*#__PURE__*/function(){
function Rotate(document,rotate,transformOrigin){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Rotate);

this.type='rotate';
this.angle=null;
this.originX=null;
this.originY=null;
this.cx=0;
this.cy=0;
var numbers=toNumbers(rotate);
this.angle=new Property(document,'angle',numbers[0]);
this.originX=transformOrigin[0];
this.originY=transformOrigin[1];
this.cx=numbers[1]||0;
this.cy=numbers[2]||0;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Rotate,[{
key:"apply",
value:function apply(ctx){
var cx=this.cx,
cy=this.cy,
originX=this.originX,
originY=this.originY,
angle=this.angle;
var x=cx+originX.getPixels('x');
var y=cy+originY.getPixels('y');
ctx.translate(x,y);
ctx.rotate(angle.getRadians());
ctx.translate(-x,-y);
}},
{
key:"unapply",
value:function unapply(ctx){
var cx=this.cx,
cy=this.cy,
angle=this.angle;
ctx.translate(cx,cy);
ctx.rotate(-1.0*angle.getRadians());
ctx.translate(-cx,-cy);
}},
{
key:"applyToPoint",
value:function applyToPoint(point){
var cx=this.cx,
cy=this.cy,
angle=this.angle;
var rad=angle.getRadians();
point.applyTransform([1,0,0,1,cx||0.0,cy||0.0// this.p.y
]);
point.applyTransform([Math.cos(rad),Math.sin(rad),-Math.sin(rad),Math.cos(rad),0,0]);
point.applyTransform([1,0,0,1,-cx||0.0,-cy||0.0// -this.p.y
]);
}}]);


return Rotate;
}();

var Scale=/*#__PURE__*/function(){
function Scale(_,scale){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Scale);

this.type='scale';
this.scale=null;
var scaleSize=Point.parseScale(scale);// Workaround for node-canvas

if(scaleSize.x===0||scaleSize.y===0){
scaleSize.x=PSEUDO_ZERO;
scaleSize.y=PSEUDO_ZERO;
}

this.scale=scaleSize;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Scale,[{
key:"apply",
value:function apply(ctx){
var _this$scale=this.scale,
x=_this$scale.x,
y=_this$scale.y;
ctx.scale(x,y||x);
}},
{
key:"unapply",
value:function unapply(ctx){
var _this$scale2=this.scale,
x=_this$scale2.x,
y=_this$scale2.y;
ctx.scale(1.0/x,1.0/y||x);
}},
{
key:"applyToPoint",
value:function applyToPoint(point){
var _this$scale3=this.scale,
x=_this$scale3.x,
y=_this$scale3.y;
point.applyTransform([x||0.0,0,0,y||0.0,0,0]);
}}]);


return Scale;
}();

var Matrix=/*#__PURE__*/function(){
function Matrix(_,matrix){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Matrix);

this.type='matrix';
this.matrix=[];
this.matrix=toNumbers(matrix);
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Matrix,[{
key:"apply",
value:function apply(ctx){
var matrix=this.matrix;
ctx.transform(matrix[0],matrix[1],matrix[2],matrix[3],matrix[4],matrix[5]);
}},
{
key:"unapply",
value:function unapply(ctx){
var matrix=this.matrix;
var a=matrix[0];
var b=matrix[2];
var c=matrix[4];
var d=matrix[1];
var e=matrix[3];
var f=matrix[5];
var g=0.0;
var h=0.0;
var i=1.0;
var det=1/(a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g));
ctx.transform(det*(e*i-f*h),det*(f*g-d*i),det*(c*h-b*i),det*(a*i-c*g),det*(b*f-c*e),det*(c*d-a*f));
}},
{
key:"applyToPoint",
value:function applyToPoint(point){
point.applyTransform(this.matrix);
}}]);


return Matrix;
}();

function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var Skew=/*#__PURE__*/function(_Matrix){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(Skew,_Matrix);

var _super=_createSuper(Skew);

function Skew(document,skew){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Skew);

_this=_super.call(this,document,skew);
_this.type='skew';
_this.angle=null;
_this.angle=new Property(document,'angle',skew);
return _this;
}

return Skew;
}(Matrix);

function _createSuper$1(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$1();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$1(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var SkewX=/*#__PURE__*/function(_Skew){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(SkewX,_Skew);

var _super=_createSuper$1(SkewX);

function SkewX(document,skew){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,SkewX);

_this=_super.call(this,document,skew);
_this.type='skewX';
_this.matrix=[1,0,Math.tan(_this.angle.getRadians()),1,0,0];
return _this;
}

return SkewX;
}(Skew);

function _createSuper$2(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$2();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$2(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var SkewY=/*#__PURE__*/function(_Skew){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(SkewY,_Skew);

var _super=_createSuper$2(SkewY);

function SkewY(document,skew){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,SkewY);

_this=_super.call(this,document,skew);
_this.type='skewY';
_this.matrix=[1,Math.tan(_this.angle.getRadians()),0,1,0,0];
return _this;
}

return SkewY;
}(Skew);

function parseTransforms(transform){
var _context;

return _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context=compressSpaces(transform)).call(_context).replace(/\)([a-zA-Z])/g,') $1').replace(/\)(\s?,\s?)/g,') ').split(/\s(?=[a-z])/);
}

function parseTransform(transform){
var _transform$split=transform.split('('),
_transform$split2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_transform$split,2),
type=_transform$split2[0],
value=_transform$split2[1];

return [_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(type).call(type),_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(value).call(value).replace(')','')];
}

var Transform=/*#__PURE__*/function(){
function Transform(document,transform,transformOrigin){
var _this=this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Transform);

this.document=document;
this.transforms=[];
var data=parseTransforms(transform);

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(data).call(data,function(transform){
if(transform==='none'){
return;
}

var _parseTransform=parseTransform(transform),
_parseTransform2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_parseTransform,2),
type=_parseTransform2[0],
value=_parseTransform2[1];

var TransformType=Transform.transformTypes[type];

if(typeof TransformType!=='undefined'){
_this.transforms.push(new TransformType(_this.document,value,transformOrigin));
}
});
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Transform,[{
key:"apply",
value:function apply(ctx){
var transforms=this.transforms;
var len=transforms.length;

for(var i=0;i<len;i++){
transforms[i].apply(ctx);
}
}},
{
key:"unapply",
value:function unapply(ctx){
var transforms=this.transforms;
var len=transforms.length;

for(var i=len-1;i>=0;i--){
transforms[i].unapply(ctx);
}
}// TODO: applyToPoint unused ... remove?
},
{
key:"applyToPoint",
value:function applyToPoint(point){
var transforms=this.transforms;
var len=transforms.length;

for(var i=0;i<len;i++){
transforms[i].applyToPoint(point);
}
}}],
[{
key:"fromElement",
value:function fromElement(document,element){
var transformStyle=element.getStyle('transform',false,true);

var _element$getStyle$spl=element.getStyle('transform-origin',false,true).split(),
_element$getStyle$spl2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_element$getStyle$spl,2),
transformOriginXProperty=_element$getStyle$spl2[0],
_element$getStyle$spl3=_element$getStyle$spl2[1],
transformOriginYProperty=_element$getStyle$spl3===void 0?transformOriginXProperty:_element$getStyle$spl3;

var transformOrigin=[transformOriginXProperty,transformOriginYProperty];

if(transformStyle.hasValue()){
return new Transform(document,transformStyle.getString(),transformOrigin);
}

return null;
}}]);


return Transform;
}();
Transform.transformTypes={
translate:Translate,
rotate:Rotate,
scale:Scale,
matrix:Matrix,
skewX:SkewX,
skewY:SkewY};


var Element=/*#__PURE__*/function(){
function Element(document,node){
var _context,
_this=this,
_context4;

var captureTextNodes=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Element);

this.document=document;
this.node=node;
this.captureTextNodes=captureTextNodes;
this.attributes={};
this.styles={};
this.stylesSpecificity={};
this.animationFrozen=false;
this.animationFrozenValue='';
this.parent=null;
this.children=[];

if(!node||node.nodeType!==1){
// ELEMENT_NODE
return;
}// add attributes


_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(node.attributes)).call(_context,function(attribute){
var nodeName=normalizeAttributeName(attribute.nodeName);
_this.attributes[nodeName]=new Property(document,nodeName,attribute.value);
});

this.addStylesFromStyleDefinition();// add inline styles

if(this.getAttribute('style').hasValue()){
var _context2;

var styles=_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context2=this.getAttribute('style').getString().split(';')).call(_context2,function(_){
return _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_).call(_);
});

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(styles).call(styles,function(style){
var _context3;

if(!style){
return;
}

var _style$split$map=_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context3=style.split(':')).call(_context3,function(_){
return _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_).call(_);
}),
_style$split$map2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_style$split$map,2),
name=_style$split$map2[0],
value=_style$split$map2[1];

_this.styles[name]=new Property(document,name,value);
});
}

var definitions=document.definitions;
var id=this.getAttribute('id');// add id

if(id.hasValue()){
if(!definitions[id.getValue()]){
definitions[id.getValue()]=this;
}
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context4=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(node.childNodes)).call(_context4,function(childNode){
if(childNode.nodeType===1){
_this.addChild(childNode);// ELEMENT_NODE

}else if(captureTextNodes&&(childNode.nodeType===3||childNode.nodeType===4)){
var textNode=document.createTextNode(childNode);

if(textNode.getText().length>0){
_this.addChild(textNode);// TEXT_NODE

}
}
});
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Element,[{
key:"getAttribute",
value:function getAttribute(name){
var createIfNotExists=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
var attr=this.attributes[name];

if(!attr&&createIfNotExists){
var _attr=new Property(this.document,name,'');

this.attributes[name]=_attr;
return _attr;
}

return attr||Property.empty(this.document);
}},
{
key:"getHrefAttribute",
value:function getHrefAttribute(){
for(var key in this.attributes){
if(key==='href'||/:href$/.test(key)){
return this.attributes[key];
}
}

return Property.empty(this.document);
}},
{
key:"getStyle",
value:function getStyle(name){
var createIfNotExists=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
var skipAncestors=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
var style=this.styles[name];

if(style){
return style;
}

var attr=this.getAttribute(name);

if(attr&&attr.hasValue()){
this.styles[name]=attr;// move up to me to cache

return attr;
}

if(!skipAncestors){
var parent=this.parent;

if(parent){
var parentStyle=parent.getStyle(name);

if(parentStyle&&parentStyle.hasValue()){
return parentStyle;
}
}
}

if(createIfNotExists){
var _style=new Property(this.document,name,'');

this.styles[name]=_style;
return _style;
}

return style||Property.empty(this.document);
}},
{
key:"render",
value:function render(ctx){
// don't render display=none
// don't render visibility=hidden
if(this.getStyle('display').getString()==='none'||this.getStyle('visibility').getString()==='hidden'){
return;
}

ctx.save();

if(this.getStyle('mask').hasValue()){
// mask
var mask=this.getStyle('mask').getDefinition();

if(mask){
this.applyEffects(ctx);
mask.apply(ctx,this);
}
}else if(this.getStyle('filter').getValue('none')!=='none'){
// filter
var filter=this.getStyle('filter').getDefinition();

if(filter){
this.applyEffects(ctx);
filter.apply(ctx,this);
}
}else {
this.setContext(ctx);
this.renderChildren(ctx);
this.clearContext(ctx);
}

ctx.restore();
}},
{
key:"setContext",
value:function setContext(_){}},
{
key:"applyEffects",
value:function applyEffects(ctx){
// transform
var transform=Transform.fromElement(this.document,this);

if(transform){
transform.apply(ctx);
}// clip


var clipPathStyleProp=this.getStyle('clip-path',false,true);

if(clipPathStyleProp.hasValue()){
var clip=clipPathStyleProp.getDefinition();

if(clip){
clip.apply(ctx);
}
}
}},
{
key:"clearContext",
value:function clearContext(_){}},
{
key:"renderChildren",
value:function renderChildren(ctx){
var _context5;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context5=this.children).call(_context5,function(child){
child.render(ctx);
});
}},
{
key:"addChild",
value:function addChild(childNode){
var _context6;

var child=childNode instanceof Element?childNode:this.document.createElement(childNode);
child.parent=this;

if(!_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32___default()(_context6=Element.ignoreChildTypes).call(_context6,child.type)){
this.children.push(child);
}
}},
{
key:"matchesSelector",
value:function matchesSelector(selector){
var _context7;

var node=this.node;

if(typeof node.matches==='function'){
return node.matches(selector);
}

var styleClasses=node.getAttribute('class');

if(!styleClasses||styleClasses===''){
return false;
}

return _babel_runtime_corejs3_core_js_stable_instance_some__WEBPACK_IMPORTED_MODULE_31___default()(_context7=styleClasses.split(' ')).call(_context7,function(styleClass){
if(".".concat(styleClass)===selector){
return true;
}
});
}},
{
key:"addStylesFromStyleDefinition",
value:function addStylesFromStyleDefinition(){
var _this$document=this.document,
styles=_this$document.styles,
stylesSpecificity=_this$document.stylesSpecificity;

for(var selector in styles){
if(selector[0]!=='@'&&this.matchesSelector(selector)){
var style=styles[selector];
var specificity=stylesSpecificity[selector];

if(style){
for(var name in style){
var existingSpecificity=this.stylesSpecificity[name];

if(typeof existingSpecificity==='undefined'){
existingSpecificity='000';
}

if(specificity>=existingSpecificity){
this.styles[name]=style[name];
this.stylesSpecificity[name]=specificity;
}
}
}
}
}
}},
{
key:"removeStyles",
value:function removeStyles(element,ignoreStyles){
var toRestore=_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default()(ignoreStyles).call(ignoreStyles,function(toRestore,name){
var _context8;

var styleProp=element.getStyle(name);

if(!styleProp.hasValue()){
return toRestore;
}

var value=styleProp.getString();
styleProp.setValue('');
return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context8=[]).call(_context8,_babel_runtime_corejs3_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_30___default()(toRestore),[[name,value]]);
},[]);

return toRestore;
}},
{
key:"restoreStyles",
value:function restoreStyles(element,styles){
_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(styles).call(styles,function(_ref){
var _ref2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_ref,2),
name=_ref2[0],
value=_ref2[1];

element.getStyle(name,true).setValue(value);
});
}}]);


return Element;
}();
Element.ignoreChildTypes=['title'];

function _createSuper$3(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$3();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$3(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var UnknownElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(UnknownElement,_Element);

var _super=_createSuper$3(UnknownElement);

function UnknownElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,UnknownElement);

_this=_super.call(this,document,node,captureTextNodes);

return _this;
}

return UnknownElement;
}(Element);

function wrapFontFamily(fontFamily){
var trimmed=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(fontFamily).call(fontFamily);

return /^('|")/.test(trimmed)?trimmed:"\"".concat(trimmed,"\"");
}

function prepareFontFamily(fontFamily){
var _context;

return typeof process==='undefined'?fontFamily:_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(fontFamily).call(fontFamily).split(',')).call(_context,wrapFontFamily).join(',');
}
/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
 */


function prepareFontStyle(fontStyle){
if(!fontStyle){
return '';
}

var targetFontStyle=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(fontStyle).call(fontStyle).toLowerCase();

switch(targetFontStyle){
case'normal':
case'italic':
case'oblique':
case'inherit':
case'initial':
case'unset':
return targetFontStyle;

default:
if(/^oblique\s+(-|)\d+deg$/.test(targetFontStyle)){
return targetFontStyle;
}

return '';}

}
/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
 */


function prepareFontWeight(fontWeight){
if(!fontWeight){
return '';
}

var targetFontWeight=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(fontWeight).call(fontWeight).toLowerCase();

switch(targetFontWeight){
case'normal':
case'bold':
case'lighter':
case'bolder':
case'inherit':
case'initial':
case'unset':
return targetFontWeight;

default:
if(/^[\d.]+$/.test(targetFontWeight)){
return targetFontWeight;
}

return '';}

}

var Font=/*#__PURE__*/function(){
function Font(fontStyle,fontVariant,fontWeight,fontSize,fontFamily,inherit){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Font);

var inheritFont=inherit?typeof inherit==='string'?Font.parse(inherit):inherit:{};
this.fontFamily=fontFamily||inheritFont.fontFamily;
this.fontSize=fontSize||inheritFont.fontSize;
this.fontStyle=fontStyle||inheritFont.fontStyle;
this.fontWeight=fontWeight||inheritFont.fontWeight;
this.fontVariant=fontVariant||inheritFont.fontVariant;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Font,[{
key:"toString",
value:function toString(){
var _context2;

return _babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context2=[prepareFontStyle(this.fontStyle),this.fontVariant,prepareFontWeight(this.fontWeight),this.fontSize,// Wrap fontFamily only on nodejs and only for canvas.ctx
prepareFontFamily(this.fontFamily)].join(' ')).call(_context2);
}}],
[{
key:"parse",
value:function parse(){
var _context3;

var font=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';
var inherit=arguments.length>1?arguments[1]:undefined;
var fontStyle='';
var fontVariant='';
var fontWeight='';
var fontSize='';
var fontFamily='';

var parts=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context3=compressSpaces(font)).call(_context3).split(' ');

var set={
fontSize:false,
fontStyle:false,
fontWeight:false,
fontVariant:false};


_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(parts).call(parts,function(part){
var _context4,_context5,_context6;

switch(true){
case!set.fontStyle&&_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32___default()(_context4=Font.styles).call(_context4,part):
if(part!=='inherit'){
fontStyle=part;
}

set.fontStyle=true;
break;

case!set.fontVariant&&_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32___default()(_context5=Font.variants).call(_context5,part):
if(part!=='inherit'){
fontVariant=part;
}

set.fontStyle=true;
set.fontVariant=true;
break;

case!set.fontWeight&&_babel_runtime_corejs3_core_js_stable_instance_includes__WEBPACK_IMPORTED_MODULE_32___default()(_context6=Font.weights).call(_context6,part):
if(part!=='inherit'){
fontWeight=part;
}

set.fontStyle=true;
set.fontVariant=true;
set.fontWeight=true;
break;

case!set.fontSize:
if(part!=='inherit'){
var _part$split=part.split('/');

var _part$split2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_part$split,1);

fontSize=_part$split2[0];
}

set.fontStyle=true;
set.fontVariant=true;
set.fontWeight=true;
set.fontSize=true;
break;

default:
if(part!=='inherit'){
fontFamily+=part;
}}


});

return new Font(fontStyle,fontVariant,fontWeight,fontSize,fontFamily,inherit);
}}]);


return Font;
}();
Font.styles='normal|italic|oblique|inherit';
Font.variants='normal|small-caps|inherit';
Font.weights='normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

var BoundingBox=/*#__PURE__*/function(){
function BoundingBox(){
var x1=arguments.length>0&&arguments[0]!==undefined?arguments[0]:Number.NaN;
var y1=arguments.length>1&&arguments[1]!==undefined?arguments[1]:Number.NaN;
var x2=arguments.length>2&&arguments[2]!==undefined?arguments[2]:Number.NaN;
var y2=arguments.length>3&&arguments[3]!==undefined?arguments[3]:Number.NaN;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,BoundingBox);

this.x1=x1;
this.y1=y1;
this.x2=x2;
this.y2=y2;
this.addPoint(x1,y1);
this.addPoint(x2,y2);
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(BoundingBox,[{
key:"addPoint",
value:function addPoint(x,y){
if(typeof x!=='undefined'){
if(isNaN(this.x1)||isNaN(this.x2)){
this.x1=x;
this.x2=x;
}

if(x<this.x1){
this.x1=x;
}

if(x>this.x2){
this.x2=x;
}
}

if(typeof y!=='undefined'){
if(isNaN(this.y1)||isNaN(this.y2)){
this.y1=y;
this.y2=y;
}

if(y<this.y1){
this.y1=y;
}

if(y>this.y2){
this.y2=y;
}
}
}},
{
key:"addX",
value:function addX(x){
this.addPoint(x,null);
}},
{
key:"addY",
value:function addY(y){
this.addPoint(null,y);
}},
{
key:"addBoundingBox",
value:function addBoundingBox(boundingBox){
if(!boundingBox){
return;
}

var x1=boundingBox.x1,
y1=boundingBox.y1,
x2=boundingBox.x2,
y2=boundingBox.y2;
this.addPoint(x1,y1);
this.addPoint(x2,y2);
}},
{
key:"sumCubic",
value:function sumCubic(t,p0,p1,p2,p3){
return Math.pow(1-t,3)*p0+3*Math.pow(1-t,2)*t*p1+3*(1-t)*Math.pow(t,2)*p2+Math.pow(t,3)*p3;
}},
{
key:"bezierCurveAdd",
value:function bezierCurveAdd(forX,p0,p1,p2,p3){
var b=6*p0-12*p1+6*p2;
var a=-3*p0+9*p1-9*p2+3*p3;
var c=3*p1-3*p0;

if(a===0){
if(b===0){
return;
}

var t=-c/b;

if(0<t&&t<1){
if(forX){
this.addX(this.sumCubic(t,p0,p1,p2,p3));
}else {
this.addY(this.sumCubic(t,p0,p1,p2,p3));
}
}

return;
}

var b2ac=Math.pow(b,2)-4*c*a;

if(b2ac<0){
return;
}

var t1=(-b+Math.sqrt(b2ac))/(2*a);

if(0<t1&&t1<1){
if(forX){
this.addX(this.sumCubic(t1,p0,p1,p2,p3));
}else {
this.addY(this.sumCubic(t1,p0,p1,p2,p3));
}
}

var t2=(-b-Math.sqrt(b2ac))/(2*a);

if(0<t2&&t2<1){
if(forX){
this.addX(this.sumCubic(t2,p0,p1,p2,p3));
}else {
this.addY(this.sumCubic(t2,p0,p1,p2,p3));
}
}
}// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
},
{
key:"addBezierCurve",
value:function addBezierCurve(p0x,p0y,p1x,p1y,p2x,p2y,p3x,p3y){
this.addPoint(p0x,p0y);
this.addPoint(p3x,p3y);
this.bezierCurveAdd(true,p0x,p1x,p2x,p3x);
this.bezierCurveAdd(false,p0y,p1y,p2y,p3y);
}},
{
key:"addQuadraticCurve",
value:function addQuadraticCurve(p0x,p0y,p1x,p1y,p2x,p2y){
var cp1x=p0x+2/3*(p1x-p0x);// CP1 = QP0 + 2/3 *(QP1-QP0)

var cp1y=p0y+2/3*(p1y-p0y);// CP1 = QP0 + 2/3 *(QP1-QP0)

var cp2x=cp1x+1/3*(p2x-p0x);// CP2 = CP1 + 1/3 *(QP2-QP0)

var cp2y=cp1y+1/3*(p2y-p0y);// CP2 = CP1 + 1/3 *(QP2-QP0)

this.addBezierCurve(p0x,p0y,cp1x,cp2x,cp1y,cp2y,p2x,p2y);
}},
{
key:"isPointInBox",
value:function isPointInBox(x,y){
var x1=this.x1,
y1=this.y1,
x2=this.x2,
y2=this.y2;
return x1<=x&&x<=x2&&y1<=y&&y<=y2;
}},
{
key:"x",
get:function get(){
return this.x1;
}},
{
key:"y",
get:function get(){
return this.y1;
}},
{
key:"width",
get:function get(){
return this.x2-this.x1;
}},
{
key:"height",
get:function get(){
return this.y2-this.y1;
}}]);


return BoundingBox;
}();

function _createSuper$4(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$4();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$4(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var RenderedElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(RenderedElement,_Element);

var _super=_createSuper$4(RenderedElement);

function RenderedElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,RenderedElement);

_this=_super.apply(this,arguments);
_this.modifiedEmSizeStack=false;
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(RenderedElement,[{
key:"calculateOpacity",
value:function calculateOpacity(){
var opacity=1.0;// tslint:disable-next-line: no-this-assignment

var element=this;

while(element){
var opacityStyle=element.getStyle('opacity',false,true);// no ancestors on style call

if(opacityStyle.hasValue(true)){
opacity*=opacityStyle.getNumber();
}

element=element.parent;
}

return opacity;
}},
{
key:"setContext",
value:function setContext(ctx){
var fromMeasure=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;

if(!fromMeasure){
// causes stack overflow when measuring text with gradients
// fill
var fillStyleProp=this.getStyle('fill');
var fillOpacityStyleProp=this.getStyle('fill-opacity');
var strokeStyleProp=this.getStyle('stroke');
var strokeOpacityProp=this.getStyle('stroke-opacity');

if(fillStyleProp.isUrlDefinition()){
var fillStyle=fillStyleProp.getFillStyleDefinition(this,fillOpacityStyleProp);

if(fillStyle){
ctx.fillStyle=fillStyle;
}
}else if(fillStyleProp.hasValue()){
if(fillStyleProp.getString()==='currentColor'){
fillStyleProp.setValue(this.getStyle('color').getColor());
}

var _fillStyle=fillStyleProp.getColor();

if(_fillStyle!=='inherit'){
ctx.fillStyle=_fillStyle==='none'?'rgba(0,0,0,0)':_fillStyle;
}
}

if(fillOpacityStyleProp.hasValue()){
var _fillStyle2=new Property(this.document,'fill',ctx.fillStyle).addOpacity(fillOpacityStyleProp).getColor();

ctx.fillStyle=_fillStyle2;
}// stroke


if(strokeStyleProp.isUrlDefinition()){
var strokeStyle=strokeStyleProp.getFillStyleDefinition(this,strokeOpacityProp);

if(strokeStyle){
ctx.strokeStyle=strokeStyle;
}
}else if(strokeStyleProp.hasValue()){
if(strokeStyleProp.getString()==='currentColor'){
strokeStyleProp.setValue(this.getStyle('color').getColor());
}

var _strokeStyle=strokeStyleProp.getString();

if(_strokeStyle!=='inherit'){
ctx.strokeStyle=_strokeStyle==='none'?'rgba(0,0,0,0)':_strokeStyle;
}
}

if(strokeOpacityProp.hasValue()){
var _strokeStyle2=new Property(this.document,'stroke',ctx.strokeStyle).addOpacity(strokeOpacityProp).getString();

ctx.strokeStyle=_strokeStyle2;
}

var strokeWidthStyleProp=this.getStyle('stroke-width');

if(strokeWidthStyleProp.hasValue()){
var newLineWidth=strokeWidthStyleProp.getPixels();
ctx.lineWidth=!newLineWidth?PSEUDO_ZERO// browsers don't respect 0 (or node-canvas? :-)
:newLineWidth;
}

var strokeLinecapStyleProp=this.getStyle('stroke-linecap');
var strokeLinejoinStyleProp=this.getStyle('stroke-linejoin');
var strokeMiterlimitProp=this.getStyle('stroke-miterlimit');
var pointOrderStyleProp=this.getStyle('paint-order');
var strokeDasharrayStyleProp=this.getStyle('stroke-dasharray');
var strokeDashoffsetProp=this.getStyle('stroke-dashoffset');

if(strokeLinecapStyleProp.hasValue()){
ctx.lineCap=strokeLinecapStyleProp.getString();
}

if(strokeLinejoinStyleProp.hasValue()){
ctx.lineJoin=strokeLinejoinStyleProp.getString();
}

if(strokeMiterlimitProp.hasValue()){
ctx.miterLimit=strokeMiterlimitProp.getNumber();
}

if(pointOrderStyleProp.hasValue()){
// ?
ctx.paintOrder=pointOrderStyleProp.getValue();
}

if(strokeDasharrayStyleProp.hasValue()&&strokeDasharrayStyleProp.getString()!=='none'){
var gaps=toNumbers(strokeDasharrayStyleProp.getString());

if(typeof ctx.setLineDash!=='undefined'){
ctx.setLineDash(gaps);
}else if(typeof ctx.webkitLineDash!=='undefined'){
ctx.webkitLineDash=gaps;
}else if(typeof ctx.mozDash!=='undefined'&&!(gaps.length===1&&gaps[0]===0)){
ctx.mozDash=gaps;
}

var offset=strokeDashoffsetProp.getPixels();

if(typeof ctx.lineDashOffset!=='undefined'){
ctx.lineDashOffset=offset;
}else if(typeof ctx.webkitLineDashOffset!=='undefined'){
ctx.webkitLineDashOffset=offset;
}else if(typeof ctx.mozDashOffset!=='undefined'){
ctx.mozDashOffset=offset;
}
}
}// font


this.modifiedEmSizeStack=false;

if(typeof ctx.font!=='undefined'){
var fontStyleProp=this.getStyle('font');
var fontStyleStyleProp=this.getStyle('font-style');
var fontVariantStyleProp=this.getStyle('font-variant');
var fontWeightStyleProp=this.getStyle('font-weight');
var fontSizeStyleProp=this.getStyle('font-size');
var fontFamilyStyleProp=this.getStyle('font-family');
var font=new Font(fontStyleStyleProp.getString(),fontVariantStyleProp.getString(),fontWeightStyleProp.getString(),fontSizeStyleProp.hasValue()?"".concat(fontSizeStyleProp.getPixels(true),"px"):'',fontFamilyStyleProp.getString(),Font.parse(fontStyleProp.getString(),ctx.font));
fontStyleStyleProp.setValue(font.fontStyle);
fontVariantStyleProp.setValue(font.fontVariant);
fontWeightStyleProp.setValue(font.fontWeight);
fontSizeStyleProp.setValue(font.fontSize);
fontFamilyStyleProp.setValue(font.fontFamily);
ctx.font=font.toString();

if(fontSizeStyleProp.isPixels()){
this.document.emSize=fontSizeStyleProp.getPixels();
this.modifiedEmSizeStack=true;
}
}

if(!fromMeasure){
// effects
this.applyEffects(ctx);// opacity

ctx.globalAlpha=this.calculateOpacity();
}
}},
{
key:"clearContext",
value:function clearContext(ctx){
_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(RenderedElement.prototype),"clearContext",this).call(this,ctx);

if(this.modifiedEmSizeStack){
this.document.popEmSize();
}
}}]);


return RenderedElement;
}(Element);

function _createSuper$5(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$5();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$5(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TextElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TextElement,_RenderedElement);

var _super=_createSuper$5(TextElement);

function TextElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TextElement);

_this=_super.call(this,document,node,(this instanceof TextElement?this.constructor:void 0)===TextElement?true:captureTextNodes);
_this.type='text';
_this.x=0;
_this.y=0;
_this.measureCache=-1;
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(TextElement,[{
key:"setContext",
value:function setContext(ctx){
var fromMeasure=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;

_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(TextElement.prototype),"setContext",this).call(this,ctx,fromMeasure);

var textBaseline=this.getStyle('dominant-baseline').getTextBaseline()||this.getStyle('alignment-baseline').getTextBaseline();

if(textBaseline){
ctx.textBaseline=textBaseline;
}
}},
{
key:"initializeCoordinates",
value:function initializeCoordinates(ctx){
this.x=this.getAttribute('x').getPixels('x');
this.y=this.getAttribute('y').getPixels('y');
var dxAttr=this.getAttribute('dx');
var dyAttr=this.getAttribute('dy');

if(dxAttr.hasValue()){
this.x+=dxAttr.getPixels('x');
}

if(dyAttr.hasValue()){
this.y+=dyAttr.getPixels('y');
}

this.x+=this.getAnchorDelta(ctx,this,0);
}},
{
key:"getBoundingBox",
value:function getBoundingBox(ctx){
var _context,
_this2=this;

if(this.type!=='text'){
return this.getTElementBoundingBox(ctx);
}

this.initializeCoordinates(ctx);
var boundingBox=null;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=this.children).call(_context,function(_,i){
var childBoundingBox=_this2.getChildBoundingBox(ctx,_this2,_this2,i);

if(!boundingBox){
boundingBox=childBoundingBox;
}else {
boundingBox.addBoundingBox(childBoundingBox);
}
});

return boundingBox;
}},
{
key:"getFontSize",
value:function getFontSize(){
var document=this.document,
parent=this.parent;
var inheritFontSize=Font.parse(document.ctx.font).fontSize;
var fontSize=parent.getStyle('font-size').getNumber(inheritFontSize);
return fontSize;
}},
{
key:"getTElementBoundingBox",
value:function getTElementBoundingBox(ctx){
var fontSize=this.getFontSize();
return new BoundingBox(this.x,this.y-fontSize,this.x+this.measureText(ctx),this.y);
}},
{
key:"getGlyph",
value:function getGlyph(font,text,i){
var char=text[i];
var glyph=null;

if(font.isArabic){
var len=text.length;
var prevChar=text[i-1];
var nextChar=text[i+1];
var arabicForm='isolated';

if((i===0||prevChar===' ')&&i<len-2&&nextChar!==' '){
arabicForm='terminal';
}

if(i>0&&prevChar!==' '&&i<len-2&&nextChar!==' '){
arabicForm='medial';
}

if(i>0&&prevChar!==' '&&(i===len-1||nextChar===' ')){
arabicForm='initial';
}

if(typeof font.glyphs[char]!=='undefined'){
glyph=font.glyphs[char][arabicForm];

if(!glyph&&font.glyphs[char].type==='glyph'){
glyph=font.glyphs[char];
}
}
}else {
glyph=font.glyphs[char];
}

if(!glyph){
glyph=font.missingGlyph;
}

return glyph;
}},
{
key:"getText",
value:function getText(){
return '';
}},
{
key:"getTextFromNode",
value:function getTextFromNode(node){
var textNode=node||this.node;

var childNodes=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(textNode.parentNode.childNodes);

var index=_babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35___default()(childNodes).call(childNodes,textNode);

var lastIndex=childNodes.length-1;
var text=compressSpaces(textNode.value||textNode.text||textNode.textContent||'');

if(index===0){
text=trimLeft(text);
}

if(index===lastIndex){
text=trimRight(text);
}

return text;
}},
{
key:"renderChildren",
value:function renderChildren(ctx){
var _context2,
_this3=this;

if(this.type!=='text'){
this.renderTElementChildren(ctx);
return;
}

this.initializeCoordinates(ctx);

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context2=this.children).call(_context2,function(_,i){
_this3.renderChild(ctx,_this3,_this3,i);
});

var mouse=this.document.screen.mouse;// Do not calc bounding box if mouse is not working.

if(mouse.isWorking()){
mouse.checkBoundingBox(this,this.getBoundingBox(ctx));
}
}},
{
key:"renderTElementChildren",
value:function renderTElementChildren(ctx){
var document=this.document,
parent=this.parent;
var renderText=this.getText();
var customFont=parent.getStyle('font-family').getDefinition();

if(customFont){
var _context3;

var unitsPerEm=customFont.fontFace.unitsPerEm;
var ctxFont=Font.parse(document.ctx.font);
var fontSize=parent.getStyle('font-size').getNumber(ctxFont.fontSize);
var fontStyle=parent.getStyle('font-style').getString(ctxFont.fontStyle);
var scale=fontSize/unitsPerEm;
var text=customFont.isRTL?_babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_34___default()(_context3=renderText.split('')).call(_context3).join(''):renderText;
var dx=toNumbers(parent.getAttribute('dx').getString());
var len=text.length;

for(var i=0;i<len;i++){
var glyph=this.getGlyph(customFont,text,i);
ctx.translate(this.x,this.y);
ctx.scale(scale,-scale);
var lw=ctx.lineWidth;
ctx.lineWidth=ctx.lineWidth*unitsPerEm/fontSize;

if(fontStyle==='italic'){
ctx.transform(1,0,.4,1,0,0);
}

glyph.render(ctx);

if(fontStyle==='italic'){
ctx.transform(1,0,-.4,1,0,0);
}

ctx.lineWidth=lw;
ctx.scale(1/scale,-1/scale);
ctx.translate(-this.x,-this.y);
this.x+=fontSize*(glyph.horizAdvX||customFont.horizAdvX)/unitsPerEm;

if(typeof dx[i]!=='undefined'&&!isNaN(dx[i])){
this.x+=dx[i];
}
}

return;
}

var x=this.x,
y=this.y;

if(ctx.paintOrder==='stroke'){
if(ctx.strokeStyle){
ctx.strokeText(renderText,x,y);
}

if(ctx.fillStyle){
ctx.fillText(renderText,x,y);
}
}else {
if(ctx.fillStyle){
ctx.fillText(renderText,x,y);
}

if(ctx.strokeStyle){
ctx.strokeText(renderText,x,y);
}
}
}},
{
key:"getAnchorDelta",
value:function getAnchorDelta(ctx,parent,startI){
var textAnchor=this.getStyle('text-anchor').getString('start');

if(textAnchor!=='start'){
var children=parent.children;
var len=children.length;
var child=null;
var width=0;

for(var i=startI;i<len;i++){
child=children[i];

if(i>startI&&child.getAttribute('x').hasValue()||child.getAttribute('text-anchor').hasValue()){
break;// new group
}

width+=child.measureTextRecursive(ctx);
}

return -1*(textAnchor==='end'?width:width/2.0);
}

return 0;
}},
{
key:"adjustChildCoordinates",
value:function adjustChildCoordinates(ctx,textParent,parent,i){
var child=parent.children[i];

if(typeof child.measureText!=='function'){
return child;
}

ctx.save();
child.setContext(ctx,true);
var xAttr=child.getAttribute('x');
var yAttr=child.getAttribute('y');
var dxAttr=child.getAttribute('dx');
var dyAttr=child.getAttribute('dy');
var textAnchor=child.getAttribute('text-anchor').getString('start');

if(i===0&&child.type!=='textNode'){
if(!xAttr.hasValue()){
xAttr.setValue(textParent.getAttribute('x').getValue('0'));
}

if(!yAttr.hasValue()){
yAttr.setValue(textParent.getAttribute('y').getValue('0'));
}

if(!dxAttr.hasValue()){
dxAttr.setValue(textParent.getAttribute('dx').getValue('0'));
}

if(!dyAttr.hasValue()){
dyAttr.setValue(textParent.getAttribute('dy').getValue('0'));
}
}

if(xAttr.hasValue()){
child.x=xAttr.getPixels('x')+textParent.getAnchorDelta(ctx,parent,i);

if(textAnchor!=='start'){
var width=child.measureTextRecursive(ctx);
child.x+=-1*(textAnchor==='end'?width:width/2.0);
}

if(dxAttr.hasValue()){
child.x+=dxAttr.getPixels('x');
}
}else {
if(textAnchor!=='start'){
var _width=child.measureTextRecursive(ctx);

textParent.x+=-1*(textAnchor==='end'?_width:_width/2.0);
}

if(dxAttr.hasValue()){
textParent.x+=dxAttr.getPixels('x');
}

child.x=textParent.x;
}

textParent.x=child.x+child.measureText(ctx);

if(yAttr.hasValue()){
child.y=yAttr.getPixels('y');

if(dyAttr.hasValue()){
child.y+=dyAttr.getPixels('y');
}
}else {
if(dyAttr.hasValue()){
textParent.y+=dyAttr.getPixels('y');
}

child.y=textParent.y;
}

textParent.y=child.y;
child.clearContext(ctx);
ctx.restore();
return child;
}},
{
key:"getChildBoundingBox",
value:function getChildBoundingBox(ctx,textParent,parent,i){
var _context4;

var child=this.adjustChildCoordinates(ctx,textParent,parent,i);// not a text node?

if(typeof child.getBoundingBox!=='function'){
return null;
}

var boundingBox=child.getBoundingBox(ctx);

if(!boundingBox){
return null;
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context4=child.children).call(_context4,function(_,i){
var childBoundingBox=textParent.getChildBoundingBox(ctx,textParent,child,i);
boundingBox.addBoundingBox(childBoundingBox);
});

return boundingBox;
}},
{
key:"renderChild",
value:function renderChild(ctx,textParent,parent,i){
var _context5;

var child=this.adjustChildCoordinates(ctx,textParent,parent,i);
child.render(ctx);

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context5=child.children).call(_context5,function(_,i){
textParent.renderChild(ctx,textParent,child,i);
});
}},
{
key:"measureTextRecursive",
value:function measureTextRecursive(ctx){
var _context6;

var width=_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default()(_context6=this.children).call(_context6,function(width,child){
return width+child.measureTextRecursive(ctx);
},this.measureText(ctx));

return width;
}},
{
key:"measureText",
value:function measureText(ctx){
var measureCache=this.measureCache;

if(~measureCache){
return measureCache;
}

var renderText=this.getText();
var measure=this.measureTargetText(ctx,renderText);
this.measureCache=measure;
return measure;
}},
{
key:"measureTargetText",
value:function measureTargetText(ctx,targetText){
if(!targetText.length){
return 0;
}

var parent=this.parent;
var customFont=parent.getStyle('font-family').getDefinition();

if(customFont){
var _context7;

var fontSize=this.getFontSize();
var text=customFont.isRTL?_babel_runtime_corejs3_core_js_stable_instance_reverse__WEBPACK_IMPORTED_MODULE_34___default()(_context7=targetText.split('')).call(_context7).join(''):targetText;
var dx=toNumbers(parent.getAttribute('dx').getString());
var len=text.length;
var _measure=0;

for(var i=0;i<len;i++){
var glyph=this.getGlyph(customFont,text,i);
_measure+=(glyph.horizAdvX||customFont.horizAdvX)*fontSize/customFont.fontFace.unitsPerEm;

if(typeof dx[i]!=='undefined'&&!isNaN(dx[i])){
_measure+=dx[i];
}
}

return _measure;
}

if(!ctx.measureText){
return targetText.length*10;
}

ctx.save();
this.setContext(ctx,true);

var _ctx$measureText=ctx.measureText(targetText),
measure=_ctx$measureText.width;

this.clearContext(ctx);
ctx.restore();
return measure;
}}]);


return TextElement;
}(RenderedElement);

function _createSuper$6(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$6();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$6(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TSpanElement=/*#__PURE__*/function(_TextElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TSpanElement,_TextElement);

var _super=_createSuper$6(TSpanElement);

function TSpanElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TSpanElement);

_this=_super.call(this,document,node,(this instanceof TSpanElement?this.constructor:void 0)===TSpanElement?true:captureTextNodes);
_this.type='tspan';// if this node has children, then they own the text

_this.text=_this.children.length>0?'':_this.getTextFromNode();
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(TSpanElement,[{
key:"getText",
value:function getText(){
return this.text;
}}]);


return TSpanElement;
}(TextElement);

function _createSuper$7(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$7();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$7(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TextNode=/*#__PURE__*/function(_TSpanElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TextNode,_TSpanElement);

var _super=_createSuper$7(TextNode);

function TextNode(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TextNode);

_this=_super.apply(this,arguments);
_this.type='textNode';
return _this;
}

return TextNode;
}(TSpanElement);

function _createSuper$8(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$8();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$8(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var PathParser=/*#__PURE__*/function(_SVGPathData){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(PathParser,_SVGPathData);

var _super=_createSuper$8(PathParser);

function PathParser(path){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,PathParser);

_this=_super.call(this,path// Fix spaces after signs.
.replace(/[+-.]\s+/g,'-')// Remove invalid part.
.replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g,''));
_this.control=null;
_this.start=null;
_this.current=null;
_this.command=null;
_this.commands=_this.commands;
_this.i=-1;
_this.previousCommand=null;
_this.points=[];
_this.angles=[];
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(PathParser,[{
key:"reset",
value:function reset(){
this.i=-1;
this.command=null;
this.previousCommand=null;
this.start=new Point(0,0);
this.control=new Point(0,0);
this.current=new Point(0,0);
this.points=[];
this.angles=[];
}},
{
key:"isEnd",
value:function isEnd(){
var i=this.i,
commands=this.commands;
return i>=commands.length-1;
}},
{
key:"next",
value:function next(){
var command=this.commands[++this.i];
this.previousCommand=this.command;
this.command=command;
return command;
}},
{
key:"getPoint",
value:function getPoint(){
var xProp=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'x';
var yProp=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'y';
var point=new Point(this.command[xProp],this.command[yProp]);
return this.makeAbsolute(point);
}},
{
key:"getAsControlPoint",
value:function getAsControlPoint(xProp,yProp){
var point=this.getPoint(xProp,yProp);
this.control=point;
return point;
}},
{
key:"getAsCurrentPoint",
value:function getAsCurrentPoint(xProp,yProp){
var point=this.getPoint(xProp,yProp);
this.current=point;
return point;
}},
{
key:"getReflectedControlPoint",
value:function getReflectedControlPoint(){
var previousCommand=this.previousCommand.type;

if(previousCommand!==svg_pathdata__WEBPACK_IMPORTED_MODULE_38__["SVGPathData"].CURVE_TO&&previousCommand!==svg_pathdata__WEBPACK_IMPORTED_MODULE_38__["SVGPathData"].SMOOTH_CURVE_TO&&previousCommand!==svg_pathdata__WEBPACK_IMPORTED_MODULE_38__["SVGPathData"].QUAD_TO&&previousCommand!==svg_pathdata__WEBPACK_IMPORTED_MODULE_38__["SVGPathData"].SMOOTH_QUAD_TO){
return this.current;
}// reflect point


var _this$current=this.current,
cx=_this$current.x,
cy=_this$current.y,
_this$control=this.control,
ox=_this$control.x,
oy=_this$control.y;
var point=new Point(2*cx-ox,2*cy-oy);
return point;
}},
{
key:"makeAbsolute",
value:function makeAbsolute(point){
if(this.command.relative){
var _this$current2=this.current,
x=_this$current2.x,
y=_this$current2.y;
point.x+=x;
point.y+=y;
}

return point;
}},
{
key:"addMarker",
value:function addMarker(point,from,priorTo){
var points=this.points,
angles=this.angles;// if the last angle isn't filled in because we didn't have this point yet ...

if(priorTo&&angles.length>0&&!angles[angles.length-1]){
angles[angles.length-1]=points[points.length-1].angleTo(priorTo);
}

this.addMarkerAngle(point,from?from.angleTo(point):null);
}},
{
key:"addMarkerAngle",
value:function addMarkerAngle(point,angle){
this.points.push(point);
this.angles.push(angle);
}},
{
key:"getMarkerPoints",
value:function getMarkerPoints(){
return this.points;
}},
{
key:"getMarkerAngles",
value:function getMarkerAngles(){
var angles=this.angles;
var len=angles.length;

for(var i=0;i<len;i++){
if(!angles[i]){
for(var j=i+1;j<len;j++){
if(angles[j]){
angles[i]=angles[j];
break;
}
}
}
}

return angles;
}}]);


return PathParser;
}(svg_pathdata__WEBPACK_IMPORTED_MODULE_38__["SVGPathData"]);

function _createSuper$9(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$9();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$9(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var PathElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(PathElement,_RenderedElement);

var _super=_createSuper$9(PathElement);

function PathElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,PathElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='path';
_this.pathParser=null;
_this.pathParser=new PathParser(_this.getAttribute('d').getString());
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(PathElement,[{
key:"path",
value:function path(ctx){
var pathParser=this.pathParser;
var boundingBox=new BoundingBox();
pathParser.reset();

if(ctx){
ctx.beginPath();
}

while(!pathParser.isEnd()){
switch(pathParser.next().type){
case PathParser.MOVE_TO:
this.pathM(ctx,boundingBox);
break;

case PathParser.LINE_TO:
this.pathL(ctx,boundingBox);
break;

case PathParser.HORIZ_LINE_TO:
this.pathH(ctx,boundingBox);
break;

case PathParser.VERT_LINE_TO:
this.pathV(ctx,boundingBox);
break;

case PathParser.CURVE_TO:
this.pathC(ctx,boundingBox);
break;

case PathParser.SMOOTH_CURVE_TO:
this.pathS(ctx,boundingBox);
break;

case PathParser.QUAD_TO:
this.pathQ(ctx,boundingBox);
break;

case PathParser.SMOOTH_QUAD_TO:
this.pathT(ctx,boundingBox);
break;

case PathParser.ARC:
this.pathA(ctx,boundingBox);
break;

case PathParser.CLOSE_PATH:
this.pathZ(ctx,boundingBox);
break;}

}

return boundingBox;
}},
{
key:"getBoundingBox",
value:function getBoundingBox(_){
return this.path();
}},
{
key:"getMarkers",
value:function getMarkers(){
var pathParser=this.pathParser;
var points=pathParser.getMarkerPoints();
var angles=pathParser.getMarkerAngles();

var markers=_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(points).call(points,function(point,i){
return [point,angles[i]];
});

return markers;
}},
{
key:"renderChildren",
value:function renderChildren(ctx){
this.path(ctx);
this.document.screen.mouse.checkPath(this,ctx);
var fillRuleStyleProp=this.getStyle('fill-rule');

if(ctx.fillStyle!==''){
if(fillRuleStyleProp.getString('inherit')!=='inherit'){
_babel_runtime_corejs3_core_js_stable_instance_fill__WEBPACK_IMPORTED_MODULE_37___default()(ctx).call(ctx,fillRuleStyleProp.getString());
}else {
_babel_runtime_corejs3_core_js_stable_instance_fill__WEBPACK_IMPORTED_MODULE_37___default()(ctx).call(ctx);
}
}

if(ctx.strokeStyle!==''){
ctx.stroke();
}

var markers=this.getMarkers();

if(markers){
var markersLastIndex=markers.length-1;
var markerStartStyleProp=this.getStyle('marker-start');
var markerMidStyleProp=this.getStyle('marker-mid');
var markerEndStyleProp=this.getStyle('marker-end');

if(markerStartStyleProp.isUrlDefinition()){
var marker=markerStartStyleProp.getDefinition();

var _markers$=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(markers[0],2),
point=_markers$[0],
angle=_markers$[1];

marker.render(ctx,point,angle);
}

if(markerMidStyleProp.isUrlDefinition()){
var _marker=markerMidStyleProp.getDefinition();

for(var i=1;i<markersLastIndex;i++){
var _markers$i=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(markers[i],2),
_point=_markers$i[0],
_angle=_markers$i[1];

_marker.render(ctx,_point,_angle);
}
}

if(markerEndStyleProp.isUrlDefinition()){
var _marker2=markerEndStyleProp.getDefinition();

var _markers$markersLastI=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(markers[markersLastIndex],2),
_point2=_markers$markersLastI[0],
_angle2=_markers$markersLastI[1];

_marker2.render(ctx,_point2,_angle2);
}
}
}},
{
key:"pathM",
value:function pathM(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathM=PathElement.pathM(pathParser),
point=_PathElement$pathM.point;

var x=point.x,
y=point.y;
pathParser.addMarker(point);
boundingBox.addPoint(x,y);

if(ctx){
ctx.moveTo(x,y);
}
}},
{
key:"pathL",
value:function pathL(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathL=PathElement.pathL(pathParser),
current=_PathElement$pathL.current,
point=_PathElement$pathL.point;

var x=point.x,
y=point.y;
pathParser.addMarker(point,current);
boundingBox.addPoint(x,y);

if(ctx){
ctx.lineTo(x,y);
}
}},
{
key:"pathH",
value:function pathH(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathH=PathElement.pathH(pathParser),
current=_PathElement$pathH.current,
point=_PathElement$pathH.point;

var x=point.x,
y=point.y;
pathParser.addMarker(point,current);
boundingBox.addPoint(x,y);

if(ctx){
ctx.lineTo(x,y);
}
}},
{
key:"pathV",
value:function pathV(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathV=PathElement.pathV(pathParser),
current=_PathElement$pathV.current,
point=_PathElement$pathV.point;

var x=point.x,
y=point.y;
pathParser.addMarker(point,current);
boundingBox.addPoint(x,y);

if(ctx){
ctx.lineTo(x,y);
}
}},
{
key:"pathC",
value:function pathC(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathC=PathElement.pathC(pathParser),
current=_PathElement$pathC.current,
point=_PathElement$pathC.point,
controlPoint=_PathElement$pathC.controlPoint,
currentPoint=_PathElement$pathC.currentPoint;

pathParser.addMarker(currentPoint,controlPoint,point);
boundingBox.addBezierCurve(current.x,current.y,point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);

if(ctx){
ctx.bezierCurveTo(point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}
}},
{
key:"pathS",
value:function pathS(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathS=PathElement.pathS(pathParser),
current=_PathElement$pathS.current,
point=_PathElement$pathS.point,
controlPoint=_PathElement$pathS.controlPoint,
currentPoint=_PathElement$pathS.currentPoint;

pathParser.addMarker(currentPoint,controlPoint,point);
boundingBox.addBezierCurve(current.x,current.y,point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);

if(ctx){
ctx.bezierCurveTo(point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}
}},
{
key:"pathQ",
value:function pathQ(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathQ=PathElement.pathQ(pathParser),
current=_PathElement$pathQ.current,
controlPoint=_PathElement$pathQ.controlPoint,
currentPoint=_PathElement$pathQ.currentPoint;

pathParser.addMarker(currentPoint,controlPoint,controlPoint);
boundingBox.addQuadraticCurve(current.x,current.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);

if(ctx){
ctx.quadraticCurveTo(controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}
}},
{
key:"pathT",
value:function pathT(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathT=PathElement.pathT(pathParser),
current=_PathElement$pathT.current,
controlPoint=_PathElement$pathT.controlPoint,
currentPoint=_PathElement$pathT.currentPoint;

pathParser.addMarker(currentPoint,controlPoint,controlPoint);
boundingBox.addQuadraticCurve(current.x,current.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);

if(ctx){
ctx.quadraticCurveTo(controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}
}},
{
key:"pathA",
value:function pathA(ctx,boundingBox){
var pathParser=this.pathParser;

var _PathElement$pathA=PathElement.pathA(pathParser),
currentPoint=_PathElement$pathA.currentPoint,
rX=_PathElement$pathA.rX,
rY=_PathElement$pathA.rY,
sweepFlag=_PathElement$pathA.sweepFlag,
xAxisRotation=_PathElement$pathA.xAxisRotation,
centp=_PathElement$pathA.centp,
a1=_PathElement$pathA.a1,
ad=_PathElement$pathA.ad;// for markers


var dir=1-sweepFlag?1.0:-1.0;
var ah=a1+dir*(ad/2.0);
var halfWay=new Point(centp.x+rX*Math.cos(ah),centp.y+rY*Math.sin(ah));
pathParser.addMarkerAngle(halfWay,ah-dir*Math.PI/2);
pathParser.addMarkerAngle(currentPoint,ah-dir*Math.PI);
boundingBox.addPoint(currentPoint.x,currentPoint.y);// TODO: this is too naive, make it better

if(ctx&&!isNaN(a1)&&!isNaN(ad)){
var r=rX>rY?rX:rY;
var sx=rX>rY?1:rX/rY;
var sy=rX>rY?rY/rX:1;
ctx.translate(centp.x,centp.y);
ctx.rotate(xAxisRotation);
ctx.scale(sx,sy);
ctx.arc(0,0,r,a1,a1+ad,Boolean(1-sweepFlag));
ctx.scale(1/sx,1/sy);
ctx.rotate(-xAxisRotation);
ctx.translate(-centp.x,-centp.y);
}
}},
{
key:"pathZ",
value:function pathZ(ctx,boundingBox){
PathElement.pathZ(this.pathParser);

if(ctx){
// only close path if it is not a straight line
if(boundingBox.x1!==boundingBox.x2&&boundingBox.y1!==boundingBox.y2){
ctx.closePath();
}
}
}}],
[{
key:"pathM",
value:function pathM(pathParser){
var point=pathParser.getAsCurrentPoint();
pathParser.start=pathParser.current;
return {
point:point};

}},
{
key:"pathL",
value:function pathL(pathParser){
var current=pathParser.current;
var point=pathParser.getAsCurrentPoint();
return {
current:current,
point:point};

}},
{
key:"pathH",
value:function pathH(pathParser){
var current=pathParser.current,
command=pathParser.command;
var point=new Point((command.relative?current.x:0)+command.x,current.y);
pathParser.current=point;
return {
current:current,
point:point};

}},
{
key:"pathV",
value:function pathV(pathParser){
var current=pathParser.current,
command=pathParser.command;
var point=new Point(current.x,(command.relative?current.y:0)+command.y);
pathParser.current=point;
return {
current:current,
point:point};

}},
{
key:"pathC",
value:function pathC(pathParser){
var current=pathParser.current;
var point=pathParser.getPoint('x1','y1');
var controlPoint=pathParser.getAsControlPoint('x2','y2');
var currentPoint=pathParser.getAsCurrentPoint();
return {
current:current,
point:point,
controlPoint:controlPoint,
currentPoint:currentPoint};

}},
{
key:"pathS",
value:function pathS(pathParser){
var current=pathParser.current;
var point=pathParser.getReflectedControlPoint();
var controlPoint=pathParser.getAsControlPoint('x2','y2');
var currentPoint=pathParser.getAsCurrentPoint();
return {
current:current,
point:point,
controlPoint:controlPoint,
currentPoint:currentPoint};

}},
{
key:"pathQ",
value:function pathQ(pathParser){
var current=pathParser.current;
var controlPoint=pathParser.getAsControlPoint('x1','y1');
var currentPoint=pathParser.getAsCurrentPoint();
return {
current:current,
controlPoint:controlPoint,
currentPoint:currentPoint};

}},
{
key:"pathT",
value:function pathT(pathParser){
var current=pathParser.current;
var controlPoint=pathParser.getReflectedControlPoint();
pathParser.control=controlPoint;
var currentPoint=pathParser.getAsCurrentPoint();
return {
current:current,
controlPoint:controlPoint,
currentPoint:currentPoint};

}},
{
key:"pathA",
value:function pathA(pathParser){
var current=pathParser.current,
command=pathParser.command;
var rX=command.rX,
rY=command.rY,
xRot=command.xRot,
lArcFlag=command.lArcFlag,
sweepFlag=command.sweepFlag;
var xAxisRotation=xRot*(Math.PI/180.0);
var currentPoint=pathParser.getAsCurrentPoint();// Conversion from endpoint to center parameterization
// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
// x1', y1'

var currp=new Point(Math.cos(xAxisRotation)*(current.x-currentPoint.x)/2.0+Math.sin(xAxisRotation)*(current.y-currentPoint.y)/2.0,-Math.sin(xAxisRotation)*(current.x-currentPoint.x)/2.0+Math.cos(xAxisRotation)*(current.y-currentPoint.y)/2.0);// adjust radii

var l=Math.pow(currp.x,2)/Math.pow(rX,2)+Math.pow(currp.y,2)/Math.pow(rY,2);

if(l>1){
rX*=Math.sqrt(l);
rY*=Math.sqrt(l);
}// cx', cy'


var s=(lArcFlag===sweepFlag?-1:1)*Math.sqrt((Math.pow(rX,2)*Math.pow(rY,2)-Math.pow(rX,2)*Math.pow(currp.y,2)-Math.pow(rY,2)*Math.pow(currp.x,2))/(Math.pow(rX,2)*Math.pow(currp.y,2)+Math.pow(rY,2)*Math.pow(currp.x,2)));

if(isNaN(s)){
s=0;
}

var cpp=new Point(s*rX*currp.y/rY,s*-rY*currp.x/rX);// cx, cy

var centp=new Point((current.x+currentPoint.x)/2.0+Math.cos(xAxisRotation)*cpp.x-Math.sin(xAxisRotation)*cpp.y,(current.y+currentPoint.y)/2.0+Math.sin(xAxisRotation)*cpp.x+Math.cos(xAxisRotation)*cpp.y);// initial angle

var a1=vectorsAngle([1,0],[(currp.x-cpp.x)/rX,(currp.y-cpp.y)/rY]);// θ1
// angle delta

var u=[(currp.x-cpp.x)/rX,(currp.y-cpp.y)/rY];
var v=[(-currp.x-cpp.x)/rX,(-currp.y-cpp.y)/rY];
var ad=vectorsAngle(u,v);// Δθ

if(vectorsRatio(u,v)<=-1){
ad=Math.PI;
}

if(vectorsRatio(u,v)>=1){
ad=0;
}

return {
currentPoint:currentPoint,
rX:rX,
rY:rY,
sweepFlag:sweepFlag,
xAxisRotation:xAxisRotation,
centp:centp,
a1:a1,
ad:ad};

}},
{
key:"pathZ",
value:function pathZ(pathParser){
pathParser.current=pathParser.start;
}}]);


return PathElement;
}(RenderedElement);

function _createSuper$a(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$a();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$a(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var SVGElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(SVGElement,_RenderedElement);

var _super=_createSuper$a(SVGElement);

function SVGElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,SVGElement);

_this=_super.apply(this,arguments);
_this.type='svg';
_this.root=false;
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(SVGElement,[{
key:"setContext",
value:function setContext(ctx){
var document=this.document;
var screen=document.screen,
window=document.window;
var canvas=ctx.canvas;
screen.setDefaults(ctx);

if(canvas.style&&typeof ctx.font!=='undefined'&&window&&typeof window.getComputedStyle!=='undefined'){
ctx.font=window.getComputedStyle(canvas).getPropertyValue('font');
var fontSizeProp=new Property(document,'fontSize',Font.parse(ctx.font).fontSize);

if(fontSizeProp.hasValue()){
document.rootEmSize=fontSizeProp.getPixels('y');
document.emSize=document.rootEmSize;
}
}// create new view port


if(!this.getAttribute('x').hasValue()){
this.getAttribute('x',true).setValue(0);
}

if(!this.getAttribute('y').hasValue()){
this.getAttribute('y',true).setValue(0);
}

var _screen$viewPort=screen.viewPort,
width=_screen$viewPort.width,
height=_screen$viewPort.height;

if(!this.getStyle('width').hasValue()){
this.getStyle('width',true).setValue('100%');
}

if(!this.getStyle('height').hasValue()){
this.getStyle('height',true).setValue('100%');
}

if(!this.getStyle('color').hasValue()){
this.getStyle('color',true).setValue('black');
}

var refXAttr=this.getAttribute('refX');
var refYAttr=this.getAttribute('refY');
var viewBoxAttr=this.getAttribute('viewBox');
var viewBox=viewBoxAttr.hasValue()?toNumbers(viewBoxAttr.getString()):null;
var clip=!this.root&&this.getStyle('overflow').getValue('hidden')!=='visible';
var minX=0;
var minY=0;
var clipX=0;
var clipY=0;

if(viewBox){
minX=viewBox[0];
minY=viewBox[1];
}

if(!this.root){
width=this.getStyle('width').getPixels('x');
height=this.getStyle('height').getPixels('y');

if(this.type==='marker'){
clipX=minX;
clipY=minY;
minX=0;
minY=0;
}
}

screen.viewPort.setCurrent(width,height);

if(this.node// is not temporary SVGElement
&&this.getStyle('transform',false,true).hasValue()&&!this.getStyle('transform-origin',false,true).hasValue()){
this.getStyle('transform-origin',true,true).setValue('50% 50%');
}

_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(SVGElement.prototype),"setContext",this).call(this,ctx);

ctx.translate(this.getAttribute('x').getPixels('x'),this.getAttribute('y').getPixels('y'));

if(viewBox){
width=viewBox[2];
height=viewBox[3];
}

document.setViewBox({
ctx:ctx,
aspectRatio:this.getAttribute('preserveAspectRatio').getString(),
width:screen.viewPort.width,
desiredWidth:width,
height:screen.viewPort.height,
desiredHeight:height,
minX:minX,
minY:minY,
refX:refXAttr.getValue(),
refY:refYAttr.getValue(),
clip:clip,
clipX:clipX,
clipY:clipY});


if(viewBox){
screen.viewPort.removeCurrent();
screen.viewPort.setCurrent(width,height);
}
}},
{
key:"clearContext",
value:function clearContext(ctx){
_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(SVGElement.prototype),"clearContext",this).call(this,ctx);

this.document.screen.viewPort.removeCurrent();
}
/**
     * Resize SVG to fit in given size.
     * @param width
     * @param height
     * @param preserveAspectRatio
     */},

{
key:"resize",
value:function resize(width){
var height=arguments.length>1&&arguments[1]!==undefined?arguments[1]:width;
var preserveAspectRatio=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
var widthAttr=this.getAttribute('width',true);
var heightAttr=this.getAttribute('height',true);
var viewBoxAttr=this.getAttribute('viewBox');
var styleAttr=this.getAttribute('style');
var originWidth=widthAttr.getNumber(0);
var originHeight=heightAttr.getNumber(0);

if(preserveAspectRatio){
if(typeof preserveAspectRatio==='string'){
this.getAttribute('preserveAspectRatio',true).setValue(preserveAspectRatio);
}else {
var preserveAspectRatioAttr=this.getAttribute('preserveAspectRatio');

if(preserveAspectRatioAttr.hasValue()){
preserveAspectRatioAttr.setValue(preserveAspectRatioAttr.getString().replace(/^\s*(\S.*\S)\s*$/,'$1'));
}
}
}

widthAttr.setValue(width);
heightAttr.setValue(height);

if(!viewBoxAttr.hasValue()){
var _context;

viewBoxAttr.setValue(_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context="0 0 ".concat(originWidth||width," ")).call(_context,originHeight||height));
}

if(styleAttr.hasValue()){
var widthStyle=this.getStyle('width');
var heightStyle=this.getStyle('height');

if(widthStyle.hasValue()){
widthStyle.setValue("".concat(width,"px"));
}

if(heightStyle.hasValue()){
heightStyle.setValue("".concat(height,"px"));
}
}
}}]);


return SVGElement;
}(RenderedElement);

function _createSuper$b(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$b();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$b(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var RectElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(RectElement,_PathElement);

var _super=_createSuper$b(RectElement);

function RectElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,RectElement);

_this=_super.apply(this,arguments);
_this.type='rect';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(RectElement,[{
key:"path",
value:function path(ctx){
var x=this.getAttribute('x').getPixels('x');
var y=this.getAttribute('y').getPixels('y');
var width=this.getStyle('width',false,true).getPixels('x');
var height=this.getStyle('height',false,true).getPixels('y');
var rxAttr=this.getAttribute('rx');
var ryAttr=this.getAttribute('ry');
var rx=rxAttr.getPixels('x');
var ry=ryAttr.getPixels('y');

if(rxAttr.hasValue()&&!ryAttr.hasValue()){
ry=rx;
}

if(ryAttr.hasValue()&&!rxAttr.hasValue()){
rx=ry;
}

rx=Math.min(rx,width/2.0);
ry=Math.min(ry,height/2.0);

if(ctx){
var KAPPA=4*((Math.sqrt(2)-1)/3);
ctx.beginPath();// always start the path so we don't fill prior paths

if(height>0&&width>0){
ctx.moveTo(x+rx,y);
ctx.lineTo(x+width-rx,y);
ctx.bezierCurveTo(x+width-rx+KAPPA*rx,y,x+width,y+ry-KAPPA*ry,x+width,y+ry);
ctx.lineTo(x+width,y+height-ry);
ctx.bezierCurveTo(x+width,y+height-ry+KAPPA*ry,x+width-rx+KAPPA*rx,y+height,x+width-rx,y+height);
ctx.lineTo(x+rx,y+height);
ctx.bezierCurveTo(x+rx-KAPPA*rx,y+height,x,y+height-ry+KAPPA*ry,x,y+height-ry);
ctx.lineTo(x,y+ry);
ctx.bezierCurveTo(x,y+ry-KAPPA*ry,x+rx-KAPPA*rx,y,x+rx,y);
ctx.closePath();
}
}

return new BoundingBox(x,y,x+width,y+height);
}},
{
key:"getMarkers",
value:function getMarkers(){
return null;
}}]);


return RectElement;
}(PathElement);

function _createSuper$c(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$c();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$c(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var CircleElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(CircleElement,_PathElement);

var _super=_createSuper$c(CircleElement);

function CircleElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,CircleElement);

_this=_super.apply(this,arguments);
_this.type='circle';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(CircleElement,[{
key:"path",
value:function path(ctx){
var cx=this.getAttribute('cx').getPixels('x');
var cy=this.getAttribute('cy').getPixels('y');
var r=this.getAttribute('r').getPixels();

if(ctx&&r>0){
ctx.beginPath();
ctx.arc(cx,cy,r,0,Math.PI*2,false);
ctx.closePath();
}

return new BoundingBox(cx-r,cy-r,cx+r,cy+r);
}},
{
key:"getMarkers",
value:function getMarkers(){
return null;
}}]);


return CircleElement;
}(PathElement);

function _createSuper$d(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$d();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$d(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var EllipseElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(EllipseElement,_PathElement);

var _super=_createSuper$d(EllipseElement);

function EllipseElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,EllipseElement);

_this=_super.apply(this,arguments);
_this.type='ellipse';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(EllipseElement,[{
key:"path",
value:function path(ctx){
var KAPPA=4*((Math.sqrt(2)-1)/3);
var rx=this.getAttribute('rx').getPixels('x');
var ry=this.getAttribute('ry').getPixels('y');
var cx=this.getAttribute('cx').getPixels('x');
var cy=this.getAttribute('cy').getPixels('y');

if(ctx&&rx>0&&ry>0){
ctx.beginPath();
ctx.moveTo(cx+rx,cy);
ctx.bezierCurveTo(cx+rx,cy+KAPPA*ry,cx+KAPPA*rx,cy+ry,cx,cy+ry);
ctx.bezierCurveTo(cx-KAPPA*rx,cy+ry,cx-rx,cy+KAPPA*ry,cx-rx,cy);
ctx.bezierCurveTo(cx-rx,cy-KAPPA*ry,cx-KAPPA*rx,cy-ry,cx,cy-ry);
ctx.bezierCurveTo(cx+KAPPA*rx,cy-ry,cx+rx,cy-KAPPA*ry,cx+rx,cy);
ctx.closePath();
}

return new BoundingBox(cx-rx,cy-ry,cx+rx,cy+ry);
}},
{
key:"getMarkers",
value:function getMarkers(){
return null;
}}]);


return EllipseElement;
}(PathElement);

function _createSuper$e(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$e();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$e(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var LineElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(LineElement,_PathElement);

var _super=_createSuper$e(LineElement);

function LineElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,LineElement);

_this=_super.apply(this,arguments);
_this.type='line';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(LineElement,[{
key:"getPoints",
value:function getPoints(){
return [new Point(this.getAttribute('x1').getPixels('x'),this.getAttribute('y1').getPixels('y')),new Point(this.getAttribute('x2').getPixels('x'),this.getAttribute('y2').getPixels('y'))];
}},
{
key:"path",
value:function path(ctx){
var _this$getPoints=this.getPoints(),
_this$getPoints2=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_this$getPoints,2),
_this$getPoints2$=_this$getPoints2[0],
x0=_this$getPoints2$.x,
y0=_this$getPoints2$.y,
_this$getPoints2$2=_this$getPoints2[1],
x1=_this$getPoints2$2.x,
y1=_this$getPoints2$2.y;

if(ctx){
ctx.beginPath();
ctx.moveTo(x0,y0);
ctx.lineTo(x1,y1);
}

return new BoundingBox(x0,y0,x1,y1);
}},
{
key:"getMarkers",
value:function getMarkers(){
var _this$getPoints3=this.getPoints(),
_this$getPoints4=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(_this$getPoints3,2),
p0=_this$getPoints4[0],
p1=_this$getPoints4[1];

var a=p0.angleTo(p1);
return [[p0,a],[p1,a]];
}}]);


return LineElement;
}(PathElement);

function _createSuper$f(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$f();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$f(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var PolylineElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(PolylineElement,_PathElement);

var _super=_createSuper$f(PolylineElement);

function PolylineElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,PolylineElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='polyline';
_this.points=[];
_this.points=Point.parsePath(_this.getAttribute('points').getString());
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(PolylineElement,[{
key:"path",
value:function path(ctx){
var points=this.points;

var _points=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(points,1),
_points$=_points[0],
x0=_points$.x,
y0=_points$.y;

var boundingBox=new BoundingBox(x0,y0);

if(ctx){
ctx.beginPath();
ctx.moveTo(x0,y0);
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(points).call(points,function(_ref){
var x=_ref.x,
y=_ref.y;
boundingBox.addPoint(x,y);

if(ctx){
ctx.lineTo(x,y);
}
});

return boundingBox;
}},
{
key:"getMarkers",
value:function getMarkers(){
var points=this.points;
var lastIndex=points.length-1;
var markers=[];

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(points).call(points,function(point,i){
if(i===lastIndex){
return;
}

markers.push([point,point.angleTo(points[i+1])]);
});

if(markers.length>0){
markers.push([points[points.length-1],markers[markers.length-1][1]]);
}

return markers;
}}]);


return PolylineElement;
}(PathElement);

function _createSuper$g(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$g();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$g(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var PolygonElement=/*#__PURE__*/function(_PolylineElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(PolygonElement,_PolylineElement);

var _super=_createSuper$g(PolygonElement);

function PolygonElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,PolygonElement);

_this=_super.apply(this,arguments);
_this.type='polygon';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(PolygonElement,[{
key:"path",
value:function path(ctx){
var boundingBox=_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(PolygonElement.prototype),"path",this).call(this,ctx);

var _this$points=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(this.points,1),
_this$points$=_this$points[0],
x=_this$points$.x,
y=_this$points$.y;

if(ctx){
ctx.lineTo(x,y);
ctx.closePath();
}

return boundingBox;
}}]);


return PolygonElement;
}(PolylineElement);

function _createSuper$h(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$h();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$h(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var PatternElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(PatternElement,_Element);

var _super=_createSuper$h(PatternElement);

function PatternElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,PatternElement);

_this=_super.apply(this,arguments);
_this.type='pattern';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(PatternElement,[{
key:"createPattern",
value:function createPattern(ctx,_,parentOpacityProp){
var width=this.getStyle('width').getPixels('x',true);
var height=this.getStyle('height').getPixels('y',true);// render me using a temporary svg element

var patternSvg=new SVGElement(this.document,null);
patternSvg.attributes.viewBox=new Property(this.document,'viewBox',this.getAttribute('viewBox').getValue());
patternSvg.attributes.width=new Property(this.document,'width',"".concat(width,"px"));
patternSvg.attributes.height=new Property(this.document,'height',"".concat(height,"px"));
patternSvg.attributes.transform=new Property(this.document,'transform',this.getAttribute('patternTransform').getValue());
patternSvg.children=this.children;
var patternCanvas=this.document.createCanvas(width,height);
var patternCtx=patternCanvas.getContext('2d');
var xAttr=this.getAttribute('x');
var yAttr=this.getAttribute('y');

if(xAttr.hasValue()&&yAttr.hasValue()){
patternCtx.translate(xAttr.getPixels('x',true),yAttr.getPixels('y',true));
}

if(parentOpacityProp.hasValue()){
this.styles['fill-opacity']=parentOpacityProp;
}else {
_babel_runtime_corejs3_core_js_stable_reflect_delete_property__WEBPACK_IMPORTED_MODULE_39___default()(this.styles,'fill-opacity');
}// render 3x3 grid so when we transform there's no white space on edges


for(var x=-1;x<=1;x++){
for(var y=-1;y<=1;y++){
patternCtx.save();
patternSvg.attributes.x=new Property(this.document,'x',x*patternCanvas.width);
patternSvg.attributes.y=new Property(this.document,'y',y*patternCanvas.height);
patternSvg.render(patternCtx);
patternCtx.restore();
}
}

var pattern=ctx.createPattern(patternCanvas,'repeat');
return pattern;
}}]);


return PatternElement;
}(Element);

function _createSuper$i(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$i();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$i(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var MarkerElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(MarkerElement,_Element);

var _super=_createSuper$i(MarkerElement);

function MarkerElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,MarkerElement);

_this=_super.apply(this,arguments);
_this.type='marker';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(MarkerElement,[{
key:"render",
value:function render(ctx,point,angle){
if(!point){
return;
}

var x=point.x,
y=point.y;
var orient=this.getAttribute('orient').getValue('auto');
var markerUnits=this.getAttribute('markerUnits').getValue('strokeWidth');
ctx.translate(x,y);

if(orient==='auto'){
ctx.rotate(angle);
}

if(markerUnits==='strokeWidth'){
ctx.scale(ctx.lineWidth,ctx.lineWidth);
}

ctx.save();// render me using a temporary svg element

var markerSvg=new SVGElement(this.document,null);
markerSvg.type=this.type;
markerSvg.attributes.viewBox=new Property(this.document,'viewBox',this.getAttribute('viewBox').getValue());
markerSvg.attributes.refX=new Property(this.document,'refX',this.getAttribute('refX').getValue());
markerSvg.attributes.refY=new Property(this.document,'refY',this.getAttribute('refY').getValue());
markerSvg.attributes.width=new Property(this.document,'width',this.getAttribute('markerWidth').getValue());
markerSvg.attributes.height=new Property(this.document,'height',this.getAttribute('markerHeight').getValue());
markerSvg.attributes.overflow=new Property(this.document,'overflow',this.getAttribute('overflow').getValue());
markerSvg.attributes.fill=new Property(this.document,'fill',this.getAttribute('fill').getColor('black'));
markerSvg.attributes.stroke=new Property(this.document,'stroke',this.getAttribute('stroke').getValue('none'));
markerSvg.children=this.children;
markerSvg.render(ctx);
ctx.restore();

if(markerUnits==='strokeWidth'){
ctx.scale(1/ctx.lineWidth,1/ctx.lineWidth);
}

if(orient==='auto'){
ctx.rotate(-angle);
}

ctx.translate(-x,-y);
}}]);


return MarkerElement;
}(Element);

function _createSuper$j(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$j();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$j(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var DefsElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(DefsElement,_Element);

var _super=_createSuper$j(DefsElement);

function DefsElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,DefsElement);

_this=_super.apply(this,arguments);
_this.type='defs';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(DefsElement,[{
key:"render",
value:function render(){// NOOP
}}]);


return DefsElement;
}(Element);

function _createSuper$k(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$k();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$k(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var GElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(GElement,_RenderedElement);

var _super=_createSuper$k(GElement);

function GElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,GElement);

_this=_super.apply(this,arguments);
_this.type='g';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(GElement,[{
key:"getBoundingBox",
value:function getBoundingBox(ctx){
var _context;

var boundingBox=new BoundingBox();

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=this.children).call(_context,function(child){
boundingBox.addBoundingBox(child.getBoundingBox(ctx));
});

return boundingBox;
}}]);


return GElement;
}(RenderedElement);

function _createSuper$l(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$l();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$l(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var GradientElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(GradientElement,_Element);

var _super=_createSuper$l(GradientElement);

function GradientElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,GradientElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.attributesToInherit=['gradientUnits'];
_this.stops=[];

var _assertThisInitialize=_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default()(_this),
stops=_assertThisInitialize.stops,
children=_assertThisInitialize.children;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(children).call(children,function(child){
if(child.type==='stop'){
stops.push(child);
}
});

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(GradientElement,[{
key:"getGradientUnits",
value:function getGradientUnits(){
return this.getAttribute('gradientUnits').getString('objectBoundingBox');
}},
{
key:"createGradient",
value:function createGradient(ctx,element,parentOpacityProp){
var _this2=this;

// tslint:disable-next-line: no-this-assignment
var stopsContainer=this;

if(this.getHrefAttribute().hasValue()){
stopsContainer=this.getHrefAttribute().getDefinition();
this.inheritStopContainer(stopsContainer);
}

var _stopsContainer=stopsContainer,
stops=_stopsContainer.stops;
var gradient=this.getGradient(ctx,element);

if(!gradient){
return this.addParentOpacity(parentOpacityProp,stops[stops.length-1].color);
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(stops).call(stops,function(stop){
gradient.addColorStop(stop.offset,_this2.addParentOpacity(parentOpacityProp,stop.color));
});

if(this.getAttribute('gradientTransform').hasValue()){
// render as transformed pattern on temporary canvas
var document=this.document;
var _document$screen=document.screen,
MAX_VIRTUAL_PIXELS=_document$screen.MAX_VIRTUAL_PIXELS,
viewPort=_document$screen.viewPort;

var _viewPort$viewPorts=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(viewPort.viewPorts,1),
rootView=_viewPort$viewPorts[0];

var rect=new RectElement(document,null);
rect.attributes.x=new Property(document,'x',-MAX_VIRTUAL_PIXELS/3.0);
rect.attributes.y=new Property(document,'y',-MAX_VIRTUAL_PIXELS/3.0);
rect.attributes.width=new Property(document,'width',MAX_VIRTUAL_PIXELS);
rect.attributes.height=new Property(document,'height',MAX_VIRTUAL_PIXELS);
var group=new GElement(document,null);
group.attributes.transform=new Property(document,'transform',this.getAttribute('gradientTransform').getValue());
group.children=[rect];
var patternSvg=new SVGElement(document,null);
patternSvg.attributes.x=new Property(document,'x',0);
patternSvg.attributes.y=new Property(document,'y',0);
patternSvg.attributes.width=new Property(document,'width',rootView.width);
patternSvg.attributes.height=new Property(document,'height',rootView.height);
patternSvg.children=[group];
var patternCanvas=document.createCanvas(rootView.width,rootView.height);
var patternCtx=patternCanvas.getContext('2d');
patternCtx.fillStyle=gradient;
patternSvg.render(patternCtx);
return patternCtx.createPattern(patternCanvas,'no-repeat');
}

return gradient;
}},
{
key:"inheritStopContainer",
value:function inheritStopContainer(stopsContainer){
var _context,
_this3=this;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=this.attributesToInherit).call(_context,function(attributeToInherit){
if(!_this3.getAttribute(attributeToInherit).hasValue()&&stopsContainer.getAttribute(attributeToInherit).hasValue()){
_this3.getAttribute(attributeToInherit,true).setValue(stopsContainer.getAttribute(attributeToInherit).getValue());
}
});
}},
{
key:"addParentOpacity",
value:function addParentOpacity(parentOpacityProp,color){
if(parentOpacityProp.hasValue()){
var colorProp=new Property(this.document,'color',color);
return colorProp.addOpacity(parentOpacityProp).getColor();
}

return color;
}}]);


return GradientElement;
}(Element);

function _createSuper$m(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$m();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$m(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var LinearGradientElement=/*#__PURE__*/function(_GradientElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(LinearGradientElement,_GradientElement);

var _super=_createSuper$m(LinearGradientElement);

function LinearGradientElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,LinearGradientElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='linearGradient';

_this.attributesToInherit.push('x1','y1','x2','y2');

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(LinearGradientElement,[{
key:"getGradient",
value:function getGradient(ctx,element){
var isBoundingBoxUnits=this.getGradientUnits()==='objectBoundingBox';
var boundingBox=isBoundingBoxUnits?element.getBoundingBox(ctx):null;

if(isBoundingBoxUnits&&!boundingBox){
return null;
}

if(!this.getAttribute('x1').hasValue()&&!this.getAttribute('y1').hasValue()&&!this.getAttribute('x2').hasValue()&&!this.getAttribute('y2').hasValue()){
this.getAttribute('x1',true).setValue(0);
this.getAttribute('y1',true).setValue(0);
this.getAttribute('x2',true).setValue(1);
this.getAttribute('y2',true).setValue(0);
}

var x1=isBoundingBoxUnits?boundingBox.x+boundingBox.width*this.getAttribute('x1').getNumber():this.getAttribute('x1').getPixels('x');
var y1=isBoundingBoxUnits?boundingBox.y+boundingBox.height*this.getAttribute('y1').getNumber():this.getAttribute('y1').getPixels('y');
var x2=isBoundingBoxUnits?boundingBox.x+boundingBox.width*this.getAttribute('x2').getNumber():this.getAttribute('x2').getPixels('x');
var y2=isBoundingBoxUnits?boundingBox.y+boundingBox.height*this.getAttribute('y2').getNumber():this.getAttribute('y2').getPixels('y');

if(x1===x2&&y1===y2){
return null;
}

return ctx.createLinearGradient(x1,y1,x2,y2);
}}]);


return LinearGradientElement;
}(GradientElement);

function _createSuper$n(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$n();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$n(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var RadialGradientElement=/*#__PURE__*/function(_GradientElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(RadialGradientElement,_GradientElement);

var _super=_createSuper$n(RadialGradientElement);

function RadialGradientElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,RadialGradientElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='radialGradient';

_this.attributesToInherit.push('cx','cy','r','fx','fy','fr');

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(RadialGradientElement,[{
key:"getGradient",
value:function getGradient(ctx,element){
var isBoundingBoxUnits=this.getGradientUnits()==='objectBoundingBox';
var boundingBox=element.getBoundingBox(ctx);

if(isBoundingBoxUnits&&!boundingBox){
return null;
}

if(!this.getAttribute('cx').hasValue()){
this.getAttribute('cx',true).setValue('50%');
}

if(!this.getAttribute('cy').hasValue()){
this.getAttribute('cy',true).setValue('50%');
}

if(!this.getAttribute('r').hasValue()){
this.getAttribute('r',true).setValue('50%');
}

var cx=isBoundingBoxUnits?boundingBox.x+boundingBox.width*this.getAttribute('cx').getNumber():this.getAttribute('cx').getPixels('x');
var cy=isBoundingBoxUnits?boundingBox.y+boundingBox.height*this.getAttribute('cy').getNumber():this.getAttribute('cy').getPixels('y');
var fx=cx;
var fy=cy;

if(this.getAttribute('fx').hasValue()){
fx=isBoundingBoxUnits?boundingBox.x+boundingBox.width*this.getAttribute('fx').getNumber():this.getAttribute('fx').getPixels('x');
}

if(this.getAttribute('fy').hasValue()){
fy=isBoundingBoxUnits?boundingBox.y+boundingBox.height*this.getAttribute('fy').getNumber():this.getAttribute('fy').getPixels('y');
}

var r=isBoundingBoxUnits?(boundingBox.width+boundingBox.height)/2.0*this.getAttribute('r').getNumber():this.getAttribute('r').getPixels();
var fr=this.getAttribute('fr').getPixels();
return ctx.createRadialGradient(fx,fy,fr,cx,cy,r);
}}]);


return RadialGradientElement;
}(GradientElement);

function _createSuper$o(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$o();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$o(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var StopElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(StopElement,_Element);

var _super=_createSuper$o(StopElement);

function StopElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,StopElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='stop';
var offset=Math.max(0,Math.min(1,_this.getAttribute('offset').getNumber()));

var stopOpacity=_this.getStyle('stop-opacity');

var stopColor=_this.getStyle('stop-color',true);

if(stopColor.getString()===''){
stopColor.setValue('#000');
}

if(stopOpacity.hasValue()){
stopColor=stopColor.addOpacity(stopOpacity);
}

_this.offset=offset;
_this.color=stopColor.getColor();
return _this;
}

return StopElement;
}(Element);

function _createSuper$p(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$p();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$p(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var AnimateElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(AnimateElement,_Element);

var _super=_createSuper$p(AnimateElement);

function AnimateElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,AnimateElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='animate';
_this.duration=0;
_this.initialValue=null;
_this.initialUnits='';
_this.removed=false;
_this.frozen=false;
document.screen.animations.push(_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default()(_this));
_this.begin=_this.getAttribute('begin').getMilliseconds();
_this.maxDuration=_this.begin+_this.getAttribute('dur').getMilliseconds();
_this.from=_this.getAttribute('from');
_this.to=_this.getAttribute('to');
_this.values=_this.getAttribute('values');

if(_babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41___default()(_this).hasValue()){
_babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41___default()(_this).setValue(_babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41___default()(_this).getString().split(';'));
}

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(AnimateElement,[{
key:"getProperty",
value:function getProperty(){
var attributeType=this.getAttribute('attributeType').getString();
var attributeName=this.getAttribute('attributeName').getString();

if(attributeType==='CSS'){
return this.parent.getStyle(attributeName,true);
}

return this.parent.getAttribute(attributeName,true);
}},
{
key:"calcValue",
value:function calcValue(){
var _context;

var initialUnits=this.initialUnits;

var _this$getProgress=this.getProgress(),
progress=_this$getProgress.progress,
from=_this$getProgress.from,
to=_this$getProgress.to;// tween value linearly


var newValue=from.getNumber()+(to.getNumber()-from.getNumber())*progress;

if(initialUnits==='%'){
newValue*=100.0;// numValue() returns 0-1 whereas properties are 0-100
}

return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context="".concat(newValue)).call(_context,initialUnits);
}},
{
key:"update",
value:function update(delta){
var parent=this.parent;
var prop=this.getProperty();// set initial value

if(!this.initialValue){
this.initialValue=prop.getString();
this.initialUnits=prop.getUnits();
}// if we're past the end time


if(this.duration>this.maxDuration){
var fill=this.getAttribute('fill').getString('remove');// loop for indefinitely repeating animations

if(this.getAttribute('repeatCount').getString()==='indefinite'||this.getAttribute('repeatDur').getString()==='indefinite'){
this.duration=0;
}else if(fill==='freeze'&&!this.frozen){
this.frozen=true;
parent.animationFrozen=true;
parent.animationFrozenValue=prop.getString();
}else if(fill==='remove'&&!this.removed){
this.removed=true;
prop.setValue(parent.animationFrozen?parent.animationFrozenValue:this.initialValue);
return true;
}

return false;
}

this.duration+=delta;// if we're past the begin time

var updated=false;

if(this.begin<this.duration){
var newValue=this.calcValue();// tween

var typeAttr=this.getAttribute('type');

if(typeAttr.hasValue()){
var _context2;

// for transform, etc.
var type=typeAttr.getString();
newValue=_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context2="".concat(type,"(")).call(_context2,newValue,")");
}

prop.setValue(newValue);
updated=true;
}

return updated;
}},
{
key:"getProgress",
value:function getProgress(){
var document=this.document,
values=_babel_runtime_corejs3_core_js_stable_instance_values__WEBPACK_IMPORTED_MODULE_41___default()(this);

var result={
progress:(this.duration-this.begin)/(this.maxDuration-this.begin)};


if(values.hasValue()){
var p=result.progress*(values.getValue().length-1);
var lb=Math.floor(p);
var ub=Math.ceil(p);
result.from=new Property(document,'from',_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(values.getValue()[lb]));
result.to=new Property(document,'to',_babel_runtime_corejs3_core_js_stable_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(values.getValue()[ub]));
result.progress=(p-lb)/(ub-lb);
}else {
result.from=this.from;
result.to=this.to;
}

return result;
}}]);


return AnimateElement;
}(Element);

function _createSuper$q(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$q();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$q(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var AnimateColorElement=/*#__PURE__*/function(_AnimateElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(AnimateColorElement,_AnimateElement);

var _super=_createSuper$q(AnimateColorElement);

function AnimateColorElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,AnimateColorElement);

_this=_super.apply(this,arguments);
_this.type='animateColor';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(AnimateColorElement,[{
key:"calcValue",
value:function calcValue(){
var _this$getProgress=this.getProgress(),
progress=_this$getProgress.progress,
from=_this$getProgress.from,
to=_this$getProgress.to;

var colorFrom=new rgbcolor__WEBPACK_IMPORTED_MODULE_25___default.a(from.getColor());
var colorTo=new rgbcolor__WEBPACK_IMPORTED_MODULE_25___default.a(to.getColor());

if(colorFrom.ok&&colorTo.ok){
var _context,_context2;

// tween color linearly
var r=colorFrom.r+(colorTo.r-colorFrom.r)*progress;
var g=colorFrom.g+(colorTo.g-colorFrom.g)*progress;
var b=colorFrom.b+(colorTo.b-colorFrom.b)*progress;// ? alpha

return _babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context=_babel_runtime_corejs3_core_js_stable_instance_concat__WEBPACK_IMPORTED_MODULE_17___default()(_context2="rgb(".concat(_babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42___default()(r,10),", ")).call(_context2,_babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42___default()(g,10),", ")).call(_context,_babel_runtime_corejs3_core_js_stable_parse_int__WEBPACK_IMPORTED_MODULE_42___default()(b,10),")");
}

return this.getAttribute('from').getColor();
}}]);


return AnimateColorElement;
}(AnimateElement);

function _createSuper$r(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$r();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$r(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var AnimateTransformElement=/*#__PURE__*/function(_AnimateElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(AnimateTransformElement,_AnimateElement);

var _super=_createSuper$r(AnimateTransformElement);

function AnimateTransformElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,AnimateTransformElement);

_this=_super.apply(this,arguments);
_this.type='animateTransform';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(AnimateTransformElement,[{
key:"calcValue",
value:function calcValue(){
var _this$getProgress=this.getProgress(),
progress=_this$getProgress.progress,
from=_this$getProgress.from,
to=_this$getProgress.to;// tween value linearly


var transformFrom=toNumbers(from.getString());
var transformTo=toNumbers(to.getString());

var newValue=_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(transformFrom).call(transformFrom,function(from,i){
var to=transformTo[i];
return from+(to-from)*progress;
}).join(' ');

return newValue;
}}]);


return AnimateTransformElement;
}(AnimateElement);

function _createForOfIteratorHelper(o,allowArrayLike){var it;if(typeof _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_46___default.a==="undefined"||_babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_45___default()(o)==null){if(_babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_44___default()(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function F(){};return {s:F,n:function n(){if(i>=o.length)return {done:true};return {done:false,value:o[i++]};},e:function e(_e){throw _e;},f:F};}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion=true,didErr=false,err;return {s:function s(){it=_babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_43___default()(o);},n:function n(){var step=it.next();normalCompletion=step.done;return step;},e:function e(_e2){didErr=true;err=_e2;},f:function f(){try{if(!normalCompletion&&it.return!=null)it.return();}finally{if(didErr)throw err;}}};}

function _unsupportedIterableToArray(o,minLen){var _context;if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=_babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_47___default()(_context=Object.prototype.toString.call(o)).call(_context,8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen);}

function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i];}return arr2;}

function _createSuper$s(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$s();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$s(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FontElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FontElement,_Element);

var _super=_createSuper$s(FontElement);

function FontElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FontElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='font';
_this.glyphs={};
_this.horizAdvX=_this.getAttribute('horiz-adv-x').getNumber();
var definitions=document.definitions;

var _assertThisInitialize=_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default()(_this),
children=_assertThisInitialize.children;

var _iterator=_createForOfIteratorHelper(children),
_step;

try{
for(_iterator.s();!(_step=_iterator.n()).done;){
var child=_step.value;

switch(child.type){
case'font-face':
{
_this.fontFace=child;
var fontFamilyStyle=child.getStyle('font-family');

if(fontFamilyStyle.hasValue()){
definitions[fontFamilyStyle.getString()]=_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default()(_this);
}

break;
}

case'missing-glyph':
_this.missingGlyph=child;
break;

case'glyph':
{
var glyph=child;

if(glyph.arabicForm){
_this.isRTL=true;
_this.isArabic=true;

if(typeof _this.glyphs[glyph.unicode]==='undefined'){
_this.glyphs[glyph.unicode]={};
}

_this.glyphs[glyph.unicode][glyph.arabicForm]=glyph;
}else {
_this.glyphs[glyph.unicode]=glyph;
}

break;
}

default:}

}
}catch(err){
_iterator.e(err);
}finally{
_iterator.f();
}

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FontElement,[{
key:"render",
value:function render(){// NO RENDER
}}]);


return FontElement;
}(Element);

function _createSuper$t(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$t();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$t(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FontFaceElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FontFaceElement,_Element);

var _super=_createSuper$t(FontFaceElement);

function FontFaceElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FontFaceElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='font-face';
_this.ascent=_this.getAttribute('ascent').getNumber();
_this.descent=_this.getAttribute('descent').getNumber();
_this.unitsPerEm=_this.getAttribute('units-per-em').getNumber();
return _this;
}

return FontFaceElement;
}(Element);

function _createSuper$u(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$u();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$u(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var MissingGlyphElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(MissingGlyphElement,_PathElement);

var _super=_createSuper$u(MissingGlyphElement);

function MissingGlyphElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,MissingGlyphElement);

_this=_super.apply(this,arguments);
_this.type='missing-glyph';
_this.horizAdvX=0;
return _this;
}

return MissingGlyphElement;
}(PathElement);

function _createSuper$v(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$v();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$v(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var GlyphElement=/*#__PURE__*/function(_PathElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(GlyphElement,_PathElement);

var _super=_createSuper$v(GlyphElement);

function GlyphElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,GlyphElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='glyph';
_this.horizAdvX=_this.getAttribute('horiz-adv-x').getNumber();
_this.unicode=_this.getAttribute('unicode').getString();
_this.arabicForm=_this.getAttribute('arabic-form').getString();
return _this;
}

return GlyphElement;
}(PathElement);

function _createSuper$w(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$w();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$w(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TRefElement=/*#__PURE__*/function(_TextElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TRefElement,_TextElement);

var _super=_createSuper$w(TRefElement);

function TRefElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TRefElement);

_this=_super.apply(this,arguments);
_this.type='tref';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(TRefElement,[{
key:"getText",
value:function getText(){
var element=this.getHrefAttribute().getDefinition();

if(element){
var firstChild=element.children[0];

if(firstChild){
return firstChild.getText();
}
}

return '';
}}]);


return TRefElement;
}(TextElement);

function _createSuper$x(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$x();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$x(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var AElement=/*#__PURE__*/function(_TextElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(AElement,_TextElement);

var _super=_createSuper$x(AElement);

function AElement(document,node,captureTextNodes){
var _context;

var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,AElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='a';
var childNodes=node.childNodes;
var firstChild=childNodes[0];

var hasText=childNodes.length>0&&_babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20___default()(_context=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(childNodes)).call(_context,function(node){
return node.nodeType===3;
});

_this.hasText=hasText;
_this.text=hasText?_this.getTextFromNode(firstChild):'';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(AElement,[{
key:"getText",
value:function getText(){
return this.text;
}},
{
key:"renderChildren",
value:function renderChildren(ctx){
if(this.hasText){
// render as text element
_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(AElement.prototype),"renderChildren",this).call(this,ctx);

var document=this.document,
x=this.x,
y=this.y;
var mouse=document.screen.mouse;
var fontSize=new Property(document,'fontSize',Font.parse(document.ctx.font).fontSize);// Do not calc bounding box if mouse is not working.

if(mouse.isWorking()){
mouse.checkBoundingBox(this,new BoundingBox(x,y-fontSize.getPixels('y'),x+this.measureText(ctx),y));
}
}else if(this.children.length>0){
// render as temporary group
var g=new GElement(this.document,null);
g.children=this.children;
g.parent=this;
g.render(ctx);
}
}},
{
key:"onClick",
value:function onClick(){
var window=this.document.window;

if(window){
window.open(this.getHrefAttribute().getString());
}
}},
{
key:"onMouseMove",
value:function onMouseMove(){
var ctx=this.document.ctx;
ctx.canvas.style.cursor='pointer';
}}]);


return AElement;
}(TextElement);

function _createForOfIteratorHelper$1(o,allowArrayLike){var it;if(typeof _babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_46___default.a==="undefined"||_babel_runtime_corejs3_core_js_get_iterator_method__WEBPACK_IMPORTED_MODULE_45___default()(o)==null){if(_babel_runtime_corejs3_core_js_stable_array_is_array__WEBPACK_IMPORTED_MODULE_44___default()(o)||(it=_unsupportedIterableToArray$1(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function F(){};return {s:F,n:function n(){if(i>=o.length)return {done:true};return {done:false,value:o[i++]};},e:function e(_e){throw _e;},f:F};}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion=true,didErr=false,err;return {s:function s(){it=_babel_runtime_corejs3_core_js_get_iterator__WEBPACK_IMPORTED_MODULE_43___default()(o);},n:function n(){var step=it.next();normalCompletion=step.done;return step;},e:function e(_e2){didErr=true;err=_e2;},f:function f(){try{if(!normalCompletion&&it.return!=null)it.return();}finally{if(didErr)throw err;}}};}

function _unsupportedIterableToArray$1(o,minLen){var _context5;if(!o)return;if(typeof o==="string")return _arrayLikeToArray$1(o,minLen);var n=_babel_runtime_corejs3_core_js_stable_instance_slice__WEBPACK_IMPORTED_MODULE_47___default()(_context5=Object.prototype.toString.call(o)).call(_context5,8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return _babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray$1(o,minLen);}

function _arrayLikeToArray$1(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i];}return arr2;}

function ownKeys(object,enumerableOnly){var keys=_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(object);if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default.a){var symbols=_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default()(object);if(enumerableOnly)symbols=_babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9___default()(symbols).call(symbols,function(sym){return _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}

function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){var _context3;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context3=ownKeys(Object(source),true)).call(_context3,function(key){_babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14___default()(target,key,source[key]);});}else if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default.a){_babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default()(target,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default()(source));}else {var _context4;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context4=ownKeys(Object(source))).call(_context4,function(key){_babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4___default()(target,key,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(source,key));});}}return target;}

function _createSuper$y(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$y();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$y(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TextPathElement=/*#__PURE__*/function(_TextElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TextPathElement,_TextElement);

var _super=_createSuper$y(TextPathElement);

function TextPathElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TextPathElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='textPath';
_this.textWidth=0;
_this.textHeight=0;
_this.pathLength=-1;
_this.glyphInfo=null;
_this.letterSpacingCache=[];
_this.measuresCache=new _babel_runtime_corejs3_core_js_stable_map__WEBPACK_IMPORTED_MODULE_48___default.a([['',0]]);

var pathElement=_this.getHrefAttribute().getDefinition();

_this.text=_this.getTextFromNode();
_this.dataArray=_this.parsePathData(pathElement);
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(TextPathElement,[{
key:"getText",
value:function getText(){
return this.text;
}},
{
key:"path",
value:function path(ctx){
var dataArray=this.dataArray;

if(ctx){
ctx.beginPath();
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(dataArray).call(dataArray,function(_ref){
var type=_ref.type,
points=_ref.points;

switch(type){
case PathParser.LINE_TO:
if(ctx){
ctx.lineTo(points[0],points[1]);
}

break;

case PathParser.MOVE_TO:
if(ctx){
ctx.moveTo(points[0],points[1]);
}

break;

case PathParser.CURVE_TO:
if(ctx){
ctx.bezierCurveTo(points[0],points[1],points[2],points[3],points[4],points[5]);
}

break;

case PathParser.QUAD_TO:
if(ctx){
ctx.quadraticCurveTo(points[0],points[1],points[2],points[3]);
}

break;

case PathParser.ARC:
{
var _points=_babel_runtime_corejs3_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_3___default()(points,8),
cx=_points[0],
cy=_points[1],
rx=_points[2],
ry=_points[3],
theta=_points[4],
dTheta=_points[5],
psi=_points[6],
fs=_points[7];

var r=rx>ry?rx:ry;
var scaleX=rx>ry?1:rx/ry;
var scaleY=rx>ry?ry/rx:1;

if(ctx){
ctx.translate(cx,cy);
ctx.rotate(psi);
ctx.scale(scaleX,scaleY);
ctx.arc(0,0,r,theta,theta+dTheta,Boolean(1-fs));
ctx.scale(1/scaleX,1/scaleY);
ctx.rotate(-psi);
ctx.translate(-cx,-cy);
}

break;
}

case PathParser.CLOSE_PATH:
if(ctx){
ctx.closePath();
}

break;}

});
}},
{
key:"renderChildren",
value:function renderChildren(ctx){
this.setTextData(ctx);
ctx.save();
var textDecoration=this.parent.getStyle('text-decoration').getString();
var fontSize=this.getFontSize();
var glyphInfo=this.glyphInfo;
var fill=ctx.fillStyle;

if(textDecoration==='underline'){
ctx.beginPath();
}

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(glyphInfo).call(glyphInfo,function(glyph,i){
var p0=glyph.p0,
p1=glyph.p1,
rotation=glyph.rotation,
partialText=glyph.text;
ctx.save();
ctx.translate(p0.x,p0.y);
ctx.rotate(rotation);

if(ctx.fillStyle){
ctx.fillText(partialText,0,0);
}

if(ctx.strokeStyle){
ctx.strokeText(partialText,0,0);
}

ctx.restore();

if(textDecoration==='underline'){
if(i===0){
ctx.moveTo(p0.x,p0.y+fontSize/8);
}

ctx.lineTo(p1.x,p1.y+fontSize/5);
}//// To assist with debugging visually, uncomment following
//
// ctx.beginPath();
// if (i % 2)
// 	ctx.strokeStyle = 'red';
// else
// 	ctx.strokeStyle = 'green';
// ctx.moveTo(p0.x, p0.y);
// ctx.lineTo(p1.x, p1.y);
// ctx.stroke();
// ctx.closePath();

});

if(textDecoration==='underline'){
ctx.lineWidth=fontSize/20;
ctx.strokeStyle=fill;
ctx.stroke();
ctx.closePath();
}

ctx.restore();
}},
{
key:"getLetterSpacingAt",
value:function getLetterSpacingAt(){
var idx=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;
return this.letterSpacingCache[idx]||0;
}},
{
key:"findSegmentToFitChar",
value:function findSegmentToFitChar(ctx,anchor,textFullWidth,fullPathWidth,spacesNumber,inputOffset,dy,c,charI){
var offset=inputOffset;
var glyphWidth=this.measureText(ctx,c);

if(c===' '&&anchor==='justify'&&textFullWidth<fullPathWidth){
glyphWidth+=(fullPathWidth-textFullWidth)/spacesNumber;
}

if(charI>-1){
offset+=this.getLetterSpacingAt(charI);
}

var splineStep=this.textHeight/20;
var p0=this.getEquidistantPointOnPath(offset,splineStep,0);
var p1=this.getEquidistantPointOnPath(offset+glyphWidth,splineStep,0);
var segment={
p0:p0,
p1:p1};

var rotation=p0&&p1?Math.atan2(p1.y-p0.y,p1.x-p0.x):0;

if(dy){
var dyX=Math.cos(Math.PI/2+rotation)*dy;
var dyY=Math.cos(-rotation)*dy;
segment.p0=_objectSpread(_objectSpread({},p0),{},{
x:p0.x+dyX,
y:p0.y+dyY});

segment.p1=_objectSpread(_objectSpread({},p1),{},{
x:p1.x+dyX,
y:p1.y+dyY});

}

offset+=glyphWidth;
return {
offset:offset,
segment:segment,
rotation:rotation};

}},
{
key:"measureText",
value:function measureText(ctx,text){
var measuresCache=this.measuresCache;
var targetText=text||this.getText();

if(measuresCache.has(targetText)){
return measuresCache.get(targetText);
}

var measure=this.measureTargetText(ctx,targetText);
measuresCache.set(targetText,measure);
return measure;
}// This method supposes what all custom fonts already loaded.
// If some font will be loaded after this method call, <textPath> will not be rendered correctly.
// You need to call this method manually to update glyphs cache.
},
{
key:"setTextData",
value:function setTextData(ctx){
var _context,
_this2=this;

if(this.glyphInfo){
return;
}

var renderText=this.getText();
var chars=renderText.split('');
var spacesNumber=renderText.split(' ').length-1;

var dx=_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context=this.parent.getAttribute('dx').split()).call(_context,function(_){
return _.getPixels('x');
});

var dy=this.parent.getAttribute('dy').getPixels('y');
var anchor=this.parent.getStyle('text-anchor').getString('start');
var thisSpacing=this.getStyle('letter-spacing');
var parentSpacing=this.parent.getStyle('letter-spacing');
var letterSpacing=0;

if(!thisSpacing.hasValue()||thisSpacing.getValue()==='inherit'){
letterSpacing=parentSpacing.getPixels();
}else if(thisSpacing.hasValue()){
if(thisSpacing.getValue()!=='initial'&&thisSpacing.getValue()!=='unset'){
letterSpacing=thisSpacing.getPixels();
}
}// fill letter-spacing cache


var letterSpacingCache=[];
var textLen=renderText.length;
this.letterSpacingCache=letterSpacingCache;

for(var i=0;i<textLen;i++){
letterSpacingCache.push(typeof dx[i]!=='undefined'?dx[i]:letterSpacing);
}

var dxSum=_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default()(letterSpacingCache).call(letterSpacingCache,function(acc,cur,i){
return i===0?0:acc+cur||0;
},0);

var textWidth=this.measureText(ctx);
var textFullWidth=Math.max(textWidth+dxSum,0);
this.textWidth=textWidth;
this.textHeight=this.getFontSize();
this.glyphInfo=[];
var fullPathWidth=this.getPathLength();
var startOffset=this.getStyle('startOffset').getNumber(0)*fullPathWidth;
var offset=0;

if(anchor==='middle'||anchor==='center'){
offset=-textFullWidth/2;
}

if(anchor==='end'||anchor==='right'){
offset=-textFullWidth;
}

offset+=startOffset;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(chars).call(chars,function(char,i){
// Find such segment what distance between p0 and p1 is approx. width of glyph
var _this2$findSegmentToF=_this2.findSegmentToFitChar(ctx,anchor,textFullWidth,fullPathWidth,spacesNumber,offset,dy,char,i),
nextOffset=_this2$findSegmentToF.offset,
segment=_this2$findSegmentToF.segment,
rotation=_this2$findSegmentToF.rotation;

offset=nextOffset;

if(!segment.p0||!segment.p1){
return;
}// const width = this.getLineLength(
// 	segment.p0.x,
// 	segment.p0.y,
// 	segment.p1.x,
// 	segment.p1.y
// );
// Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
// Can foresee having a rough pair table built in that the developer can override as needed.
// Or use "dx" attribute of the <text> node as a naive replacement
// const kern = 0;
// placeholder for future implementation
// const midpoint = this.getPointOnLine(
// 	kern + width / 2.0,
// 	segment.p0.x, segment.p0.y, segment.p1.x, segment.p1.y
// );


_this2.glyphInfo.push({
// transposeX: midpoint.x,
// transposeY: midpoint.y,
text:chars[i],
p0:segment.p0,
p1:segment.p1,
rotation:rotation});

});
}},
{
key:"parsePathData",
value:function parsePathData(path){
this.pathLength=-1;// reset path length

if(!path){
return [];
}

var pathCommands=[];
var pathParser=path.pathParser;
pathParser.reset();// convert l, H, h, V, and v to L

while(!pathParser.isEnd()){
var current=pathParser.current;
var startX=current?current.x:0;
var startY=current?current.y:0;
var command=pathParser.next();
var nextCommandType=command.type;
var points=[];

switch(command.type){
case PathParser.MOVE_TO:
this.pathM(pathParser,points);
break;

case PathParser.LINE_TO:
nextCommandType=this.pathL(pathParser,points);
break;

case PathParser.HORIZ_LINE_TO:
nextCommandType=this.pathH(pathParser,points);
break;

case PathParser.VERT_LINE_TO:
nextCommandType=this.pathV(pathParser,points);
break;

case PathParser.CURVE_TO:
this.pathC(pathParser,points);
break;

case PathParser.SMOOTH_CURVE_TO:
nextCommandType=this.pathS(pathParser,points);
break;

case PathParser.QUAD_TO:
this.pathQ(pathParser,points);
break;

case PathParser.SMOOTH_QUAD_TO:
nextCommandType=this.pathT(pathParser,points);
break;

case PathParser.ARC:
points=this.pathA(pathParser);
break;

case PathParser.CLOSE_PATH:
PathElement.pathZ(pathParser);
break;}


if(command.type!==PathParser.CLOSE_PATH){
pathCommands.push({
type:nextCommandType,
points:points,
start:{
x:startX,
y:startY},

pathLength:this.calcLength(startX,startY,nextCommandType,points)});

}else {
pathCommands.push({
type:PathParser.CLOSE_PATH,
points:[],
pathLength:0});

}
}

return pathCommands;
}},
{
key:"pathM",
value:function pathM(pathParser,points){
var _PathElement$pathM$po=PathElement.pathM(pathParser).point,
x=_PathElement$pathM$po.x,
y=_PathElement$pathM$po.y;
points.push(x,y);
}},
{
key:"pathL",
value:function pathL(pathParser,points){
var _PathElement$pathL$po=PathElement.pathL(pathParser).point,
x=_PathElement$pathL$po.x,
y=_PathElement$pathL$po.y;
points.push(x,y);
return PathParser.LINE_TO;
}},
{
key:"pathH",
value:function pathH(pathParser,points){
var _PathElement$pathH$po=PathElement.pathH(pathParser).point,
x=_PathElement$pathH$po.x,
y=_PathElement$pathH$po.y;
points.push(x,y);
return PathParser.LINE_TO;
}},
{
key:"pathV",
value:function pathV(pathParser,points){
var _PathElement$pathV$po=PathElement.pathV(pathParser).point,
x=_PathElement$pathV$po.x,
y=_PathElement$pathV$po.y;
points.push(x,y);
return PathParser.LINE_TO;
}},
{
key:"pathC",
value:function pathC(pathParser,points){
var _PathElement$pathC=PathElement.pathC(pathParser),
point=_PathElement$pathC.point,
controlPoint=_PathElement$pathC.controlPoint,
currentPoint=_PathElement$pathC.currentPoint;

points.push(point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}},
{
key:"pathS",
value:function pathS(pathParser,points){
var _PathElement$pathS=PathElement.pathS(pathParser),
point=_PathElement$pathS.point,
controlPoint=_PathElement$pathS.controlPoint,
currentPoint=_PathElement$pathS.currentPoint;

points.push(point.x,point.y,controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
return PathParser.CURVE_TO;
}},
{
key:"pathQ",
value:function pathQ(pathParser,points){
var _PathElement$pathQ=PathElement.pathQ(pathParser),
controlPoint=_PathElement$pathQ.controlPoint,
currentPoint=_PathElement$pathQ.currentPoint;

points.push(controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
}},
{
key:"pathT",
value:function pathT(pathParser,points){
var _PathElement$pathT=PathElement.pathT(pathParser),
controlPoint=_PathElement$pathT.controlPoint,
currentPoint=_PathElement$pathT.currentPoint;

points.push(controlPoint.x,controlPoint.y,currentPoint.x,currentPoint.y);
return PathParser.QUAD_TO;
}},
{
key:"pathA",
value:function pathA(pathParser){
var _PathElement$pathA=PathElement.pathA(pathParser),
rX=_PathElement$pathA.rX,
rY=_PathElement$pathA.rY,
sweepFlag=_PathElement$pathA.sweepFlag,
xAxisRotation=_PathElement$pathA.xAxisRotation,
centp=_PathElement$pathA.centp,
a1=_PathElement$pathA.a1,
ad=_PathElement$pathA.ad;

if(sweepFlag===0&&ad>0){
ad=ad-2*Math.PI;
}

if(sweepFlag===1&&ad<0){
ad=ad+2*Math.PI;
}

return [centp.x,centp.y,rX,rY,a1,ad,xAxisRotation,sweepFlag];
}},
{
key:"calcLength",
value:function calcLength(x,y,commandType,points){
var len=0;
var p1=null;
var p2=null;
var t=0;

switch(commandType){
case PathParser.LINE_TO:
return this.getLineLength(x,y,points[0],points[1]);

case PathParser.CURVE_TO:
// Approximates by breaking curve into 100 line segments
len=0.0;
p1=this.getPointOnCubicBezier(0,x,y,points[0],points[1],points[2],points[3],points[4],points[5]);

for(t=0.01;t<=1;t+=0.01){
p2=this.getPointOnCubicBezier(t,x,y,points[0],points[1],points[2],points[3],points[4],points[5]);
len+=this.getLineLength(p1.x,p1.y,p2.x,p2.y);
p1=p2;
}

return len;

case PathParser.QUAD_TO:
// Approximates by breaking curve into 100 line segments
len=0.0;
p1=this.getPointOnQuadraticBezier(0,x,y,points[0],points[1],points[2],points[3]);

for(t=0.01;t<=1;t+=0.01){
p2=this.getPointOnQuadraticBezier(t,x,y,points[0],points[1],points[2],points[3]);
len+=this.getLineLength(p1.x,p1.y,p2.x,p2.y);
p1=p2;
}

return len;

case PathParser.ARC:
// Approximates by breaking curve into line segments
len=0.0;
var start=points[4];// 4 = theta

var dTheta=points[5];// 5 = dTheta

var end=points[4]+dTheta;
var inc=Math.PI/180.0;// 1 degree resolution

if(Math.abs(start-end)<inc){
inc=Math.abs(start-end);
}// Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi


p1=this.getPointOnEllipticalArc(points[0],points[1],points[2],points[3],start,0);

if(dTheta<0){
// clockwise
for(t=start-inc;t>end;t-=inc){
p2=this.getPointOnEllipticalArc(points[0],points[1],points[2],points[3],t,0);
len+=this.getLineLength(p1.x,p1.y,p2.x,p2.y);
p1=p2;
}
}else {
// counter-clockwise
for(t=start+inc;t<end;t+=inc){
p2=this.getPointOnEllipticalArc(points[0],points[1],points[2],points[3],t,0);
len+=this.getLineLength(p1.x,p1.y,p2.x,p2.y);
p1=p2;
}
}

p2=this.getPointOnEllipticalArc(points[0],points[1],points[2],points[3],end,0);
len+=this.getLineLength(p1.x,p1.y,p2.x,p2.y);
return len;}


return 0;
}},
{
key:"getPointOnLine",
value:function getPointOnLine(dist,P1x,P1y,P2x,P2y){
var fromX=arguments.length>5&&arguments[5]!==undefined?arguments[5]:P1x;
var fromY=arguments.length>6&&arguments[6]!==undefined?arguments[6]:P1y;
var m=(P2y-P1y)/(P2x-P1x+PSEUDO_ZERO);
var run=Math.sqrt(dist*dist/(1+m*m));

if(P2x<P1x){
run*=-1;
}

var rise=m*run;
var pt=null;

if(P2x===P1x){
// vertical line
pt={
x:fromX,
y:fromY+rise};

}else if((fromY-P1y)/(fromX-P1x+PSEUDO_ZERO)===m){
pt={
x:fromX+run,
y:fromY+rise};

}else {
var ix=0;
var iy=0;
var len=this.getLineLength(P1x,P1y,P2x,P2y);

if(len<PSEUDO_ZERO){
return null;
}

var u=(fromX-P1x)*(P2x-P1x)+(fromY-P1y)*(P2y-P1y);
u=u/(len*len);
ix=P1x+u*(P2x-P1x);
iy=P1y+u*(P2y-P1y);
var pRise=this.getLineLength(fromX,fromY,ix,iy);
var pRun=Math.sqrt(dist*dist-pRise*pRise);
run=Math.sqrt(pRun*pRun/(1+m*m));

if(P2x<P1x){
run*=-1;
}

rise=m*run;
pt={
x:ix+run,
y:iy+rise};

}

return pt;
}},
{
key:"getPointOnPath",
value:function getPointOnPath(distance){
var fullLen=this.getPathLength();
var cumulativePathLength=0;
var p=null;

if(distance<-0.00005||distance-0.00005>fullLen){
return null;
}

var dataArray=this.dataArray;

var _iterator=_createForOfIteratorHelper$1(dataArray),
_step;

try{
for(_iterator.s();!(_step=_iterator.n()).done;){
var command=_step.value;

if(command&&(command.pathLength<0.00005||cumulativePathLength+command.pathLength+0.00005<distance)){
cumulativePathLength+=command.pathLength;
continue;
}

var delta=distance-cumulativePathLength;
var currentT=0;

switch(command.type){
case PathParser.LINE_TO:
p=this.getPointOnLine(delta,command.start.x,command.start.y,command.points[0],command.points[1],command.start.x,command.start.y);
break;

case PathParser.ARC:
var start=command.points[4];// 4 = theta

var dTheta=command.points[5];// 5 = dTheta

var end=command.points[4]+dTheta;
currentT=start+delta/command.pathLength*dTheta;

if(dTheta<0&&currentT<end||dTheta>=0&&currentT>end){
break;
}

p=this.getPointOnEllipticalArc(command.points[0],command.points[1],command.points[2],command.points[3],currentT,command.points[6]);
break;

case PathParser.CURVE_TO:
currentT=delta/command.pathLength;

if(currentT>1){
currentT=1;
}

p=this.getPointOnCubicBezier(currentT,command.start.x,command.start.y,command.points[0],command.points[1],command.points[2],command.points[3],command.points[4],command.points[5]);
break;

case PathParser.QUAD_TO:
currentT=delta/command.pathLength;

if(currentT>1){
currentT=1;
}

p=this.getPointOnQuadraticBezier(currentT,command.start.x,command.start.y,command.points[0],command.points[1],command.points[2],command.points[3]);
break;

default:}


if(p){
return p;
}

break;
}
}catch(err){
_iterator.e(err);
}finally{
_iterator.f();
}

return null;
}},
{
key:"getLineLength",
value:function getLineLength(x1,y1,x2,y2){
return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}},
{
key:"getPathLength",
value:function getPathLength(){
if(this.pathLength===-1){
var _context2;

this.pathLength=_babel_runtime_corejs3_core_js_stable_instance_reduce__WEBPACK_IMPORTED_MODULE_18___default()(_context2=this.dataArray).call(_context2,function(length,command){
return command.pathLength>0?length+command.pathLength:length;
},0);
}

return this.pathLength;
}},
{
key:"getPointOnCubicBezier",
value:function getPointOnCubicBezier(pct,P1x,P1y,P2x,P2y,P3x,P3y,P4x,P4y){
var x=P4x*CB1(pct)+P3x*CB2(pct)+P2x*CB3(pct)+P1x*CB4(pct);
var y=P4y*CB1(pct)+P3y*CB2(pct)+P2y*CB3(pct)+P1y*CB4(pct);
return {
x:x,
y:y};

}},
{
key:"getPointOnQuadraticBezier",
value:function getPointOnQuadraticBezier(pct,P1x,P1y,P2x,P2y,P3x,P3y){
var x=P3x*QB1(pct)+P2x*QB2(pct)+P1x*QB3(pct);
var y=P3y*QB1(pct)+P2y*QB2(pct)+P1y*QB3(pct);
return {
x:x,
y:y};

}},
{
key:"getPointOnEllipticalArc",
value:function getPointOnEllipticalArc(cx,cy,rx,ry,theta,psi){
var cosPsi=Math.cos(psi);
var sinPsi=Math.sin(psi);
var pt={
x:rx*Math.cos(theta),
y:ry*Math.sin(theta)};

return {
x:cx+(pt.x*cosPsi-pt.y*sinPsi),
y:cy+(pt.x*sinPsi+pt.y*cosPsi)};

}// TODO need some optimisations. possibly build cache only for curved segments?
},
{
key:"buildEquidistantCache",
value:function buildEquidistantCache(inputStep,inputPrecision){
var fullLen=this.getPathLength();
var precision=inputPrecision||0.25;// accuracy vs performance

var step=inputStep||fullLen/100;

if(!this.equidistantCache||this.equidistantCache.step!==step||this.equidistantCache.precision!==precision){
// Prepare cache
this.equidistantCache={
step:step,
precision:precision,
points:[]};
// Calculate points

var s=0;

for(var l=0;l<=fullLen;l+=precision){
var p0=this.getPointOnPath(l);
var p1=this.getPointOnPath(l+precision);

if(!p0||!p1){
continue;
}

s+=this.getLineLength(p0.x,p0.y,p1.x,p1.y);

if(s>=step){
this.equidistantCache.points.push({
x:p0.x,
y:p0.y,
distance:l});

s-=step;
}
}
}
}},
{
key:"getEquidistantPointOnPath",
value:function getEquidistantPointOnPath(targetDistance,step,precision){
this.buildEquidistantCache(step,precision);

if(targetDistance<0||targetDistance-this.getPathLength()>0.00005){
return null;
}

var idx=Math.round(targetDistance/this.getPathLength()*(this.equidistantCache.points.length-1));
return this.equidistantCache.points[idx]||null;
}}]);


return TextPathElement;
}(TextElement);

function _createSuper$z(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$z();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$z(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var ImageElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(ImageElement,_RenderedElement);

var _super=_createSuper$z(ImageElement);

function ImageElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,ImageElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='image';
_this.loaded=false;

var href=_this.getHrefAttribute().getString();

if(!href){
return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(_this);
}

var isSvg=/\.svg$/.test(href);
document.images.push(_babel_runtime_corejs3_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_40___default()(_this));

if(!isSvg){
_this.loadImage(href);
}else {
_this.loadSvg(href);
}

_this.isSvg=isSvg;
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(ImageElement,[{
key:"loadImage",
value:function(){
var _loadImage=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(href){
var image;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
_context.prev=0;
_context.next=3;
return this.document.createImage(href);

case 3:
image=_context.sent;
this.image=image;
_context.next=10;
break;

case 7:
_context.prev=7;
_context.t0=_context["catch"](0);
// tslint:disable-next-line: no-console
console.error("Error while loading image \"".concat(href,"\":"),_context.t0);

case 10:
this.loaded=true;

case 11:
case"end":
return _context.stop();}

}
},_callee,this,[[0,7]]);
}));

function loadImage(_x){
return _loadImage.apply(this,arguments);
}

return loadImage;
}()},
{
key:"loadSvg",
value:function(){
var _loadSvg=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee2(href){
var response,svg;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee2$(_context2){
while(1){
switch(_context2.prev=_context2.next){
case 0:
_context2.prev=0;
_context2.next=3;
return this.document.fetch(href);

case 3:
response=_context2.sent;
_context2.next=6;
return response.text();

case 6:
svg=_context2.sent;
this.image=svg;
_context2.next=13;
break;

case 10:
_context2.prev=10;
_context2.t0=_context2["catch"](0);
// tslint:disable-next-line: no-console
console.error("Error while loading image \"".concat(href,"\":"),_context2.t0);

case 13:
this.loaded=true;

case 14:
case"end":
return _context2.stop();}

}
},_callee2,this,[[0,10]]);
}));

function loadSvg(_x2){
return _loadSvg.apply(this,arguments);
}

return loadSvg;
}()},
{
key:"renderChildren",
value:function renderChildren(ctx){
var document=this.document,
image=this.image,
loaded=this.loaded;
var x=this.getAttribute('x').getPixels('x');
var y=this.getAttribute('y').getPixels('y');
var width=this.getStyle('width').getPixels('x');
var height=this.getStyle('height').getPixels('y');

if(!loaded||!image||!width||!height){
return;
}

ctx.save();

if(this.isSvg){
document.canvg.forkString(ctx,this.image,{
ignoreMouse:true,
ignoreAnimation:true,
ignoreDimensions:true,
ignoreClear:true,
offsetX:x,
offsetY:y,
scaleWidth:width,
scaleHeight:height}).
render();
}else {
var _image=this.image;
ctx.translate(x,y);
document.setViewBox({
ctx:ctx,
aspectRatio:this.getAttribute('preserveAspectRatio').getString(),
width:width,
desiredWidth:_image.width,
height:height,
desiredHeight:_image.height});


if(this.loaded){
if(typeof _image.complete==='undefined'||_image.complete){
ctx.drawImage(_image,0,0);
}
}
}

ctx.restore();
}},
{
key:"getBoundingBox",
value:function getBoundingBox(){
var x=this.getAttribute('x').getPixels('x');
var y=this.getAttribute('y').getPixels('y');
var width=this.getStyle('width').getPixels('x');
var height=this.getStyle('height').getPixels('y');
return new BoundingBox(x,y,x+width,y+height);
}}]);


return ImageElement;
}(RenderedElement);

function _createSuper$A(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$A();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$A(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var SymbolElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(SymbolElement,_RenderedElement);

var _super=_createSuper$A(SymbolElement);

function SymbolElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,SymbolElement);

_this=_super.apply(this,arguments);
_this.type='symbol';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(SymbolElement,[{
key:"render",
value:function render(_){// NO RENDER
}}]);


return SymbolElement;
}(RenderedElement);

var SVGFontLoader=/*#__PURE__*/function(){
function SVGFontLoader(document){
_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,SVGFontLoader);

this.document=document;
this.loaded=false;
document.fonts.push(this);
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(SVGFontLoader,[{
key:"load",
value:function(){
var _load=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(fontFamily,url){
var _context,document,svgDocument,fonts;

return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context2){
while(1){
switch(_context2.prev=_context2.next){
case 0:
_context2.prev=0;
document=this.document;
_context2.next=4;
return document.canvg.parser.load(url);

case 4:
svgDocument=_context2.sent;
fonts=svgDocument.getElementsByTagName('font');

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(fonts)).call(_context,function(fontNode){
var font=document.createElement(fontNode);
document.definitions[fontFamily]=font;
});

_context2.next=12;
break;

case 9:
_context2.prev=9;
_context2.t0=_context2["catch"](0);
// tslint:disable-next-line: no-console
console.error("Error while loading font \"".concat(url,"\":"),_context2.t0);

case 12:
this.loaded=true;

case 13:
case"end":
return _context2.stop();}

}
},_callee,this,[[0,9]]);
}));

function load(_x,_x2){
return _load.apply(this,arguments);
}

return load;
}()}]);


return SVGFontLoader;
}();

function _createSuper$B(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$B();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$B(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var StyleElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(StyleElement,_Element);

var _super=_createSuper$B(StyleElement);

function StyleElement(document,node,captureTextNodes){
var _context;

var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,StyleElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='style';
var css=compressSpaces(_babel_runtime_corejs3_core_js_stable_instance_map__WEBPACK_IMPORTED_MODULE_2___default()(_context=_babel_runtime_corejs3_core_js_stable_array_from__WEBPACK_IMPORTED_MODULE_33___default()(node.childNodes)).call(_context,function(_){
return _.data;
}).join('').replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm,'')// remove comments
.replace(/@import.*;/g,'')// remove imports
);
var cssDefs=css.split('}');

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(cssDefs).call(cssDefs,function(_){
var def=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_).call(_);

if(!def){
return;
}

var cssParts=def.split('{');
var cssClasses=cssParts[0].split(',');
var cssProps=cssParts[1].split(';');

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(cssClasses).call(cssClasses,function(_){
var cssClass=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_).call(_);

if(!cssClass){
return;
}

var props=document.styles[cssClass]||{};

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(cssProps).call(cssProps,function(cssProp){
var _context2,_context3;

var prop=_babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35___default()(cssProp).call(cssProp,':');

var name=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context2=cssProp.substr(0,prop)).call(_context2);

var value=_babel_runtime_corejs3_core_js_stable_instance_trim__WEBPACK_IMPORTED_MODULE_24___default()(_context3=cssProp.substr(prop+1,cssProp.length-prop)).call(_context3);

if(name&&value){
props[name]=new Property(document,name,value);
}
});

document.styles[cssClass]=props;
document.stylesSpecificity[cssClass]=getSelectorSpecificity(cssClass);

if(cssClass==='@font-face'){
//  && !nodeEnv
var fontFamily=props['font-family'].getString().replace(/"|'/g,'');
var srcs=props.src.getString().split(',');

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(srcs).call(srcs,function(src){
if(_babel_runtime_corejs3_core_js_stable_instance_index_of__WEBPACK_IMPORTED_MODULE_35___default()(src).call(src,'format("svg")')>0){
var url=parseExternalUrl(src);

if(url){
new SVGFontLoader(document).load(fontFamily,url);
}
}
});
}
});
});

return _this;
}

return StyleElement;
}(Element);
StyleElement.parseExternalUrl=parseExternalUrl;

function _createSuper$C(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$C();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$C(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var UseElement=/*#__PURE__*/function(_RenderedElement){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(UseElement,_RenderedElement);

var _super=_createSuper$C(UseElement);

function UseElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,UseElement);

_this=_super.apply(this,arguments);
_this.type='use';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(UseElement,[{
key:"setContext",
value:function setContext(ctx){
_babel_runtime_corejs3_helpers_get__WEBPACK_IMPORTED_MODULE_36___default()(_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(UseElement.prototype),"setContext",this).call(this,ctx);

var xAttr=this.getAttribute('x');
var yAttr=this.getAttribute('y');

if(xAttr.hasValue()){
ctx.translate(xAttr.getPixels('x'),0);
}

if(yAttr.hasValue()){
ctx.translate(0,yAttr.getPixels('y'));
}
}},
{
key:"path",
value:function path(ctx){
var element=this.element;

if(element){
element.path(ctx);
}
}},
{
key:"renderChildren",
value:function renderChildren(ctx){
var document=this.document,
element=this.element;

if(element){
var tempSvg=element;

if(element.type==='symbol'){
// render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
tempSvg=new SVGElement(document,null);
tempSvg.attributes.viewBox=new Property(document,'viewBox',element.getAttribute('viewBox').getString());
tempSvg.attributes.preserveAspectRatio=new Property(document,'preserveAspectRatio',element.getAttribute('preserveAspectRatio').getString());
tempSvg.attributes.overflow=new Property(document,'overflow',element.getAttribute('overflow').getString());
tempSvg.children=element.children;// element is still the parent of the children

element.styles.opacity=new Property(document,'opacity',this.calculateOpacity());
}

if(tempSvg.type==='svg'){
var widthStyle=this.getStyle('width',false,true);
var heightStyle=this.getStyle('height',false,true);// if symbol or svg, inherit width/height from me

if(widthStyle.hasValue()){
tempSvg.attributes.width=new Property(document,'width',widthStyle.getString());
}

if(heightStyle.hasValue()){
tempSvg.attributes.height=new Property(document,'height',heightStyle.getString());
}
}

var oldParent=tempSvg.parent;
tempSvg.parent=this;
tempSvg.render(ctx);
tempSvg.parent=oldParent;
}
}},
{
key:"getBoundingBox",
value:function getBoundingBox(ctx){
var element=this.element;

if(element){
return element.getBoundingBox(ctx);
}

return null;
}},
{
key:"elementTransform",
value:function elementTransform(){
var document=this.document,
element=this.element;
return Transform.fromElement(document,element);
}},
{
key:"element",
get:function get(){
if(!this._element){
this._element=this.getHrefAttribute().getDefinition();
}

return this._element;
}}]);


return UseElement;
}(RenderedElement);

function _createSuper$D(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$D();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$D(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

function imGet(img,x,y,width,_,rgba){
return img[y*width*4+x*4+rgba];
}

function imSet(img,x,y,width,_,rgba,val){
img[y*width*4+x*4+rgba]=val;
}

function m(matrix,i,v){
var mi=matrix[i];
return mi*v;
}

function c(a,m1,m2,m3){
return m1+Math.cos(a)*m2+Math.sin(a)*m3;
}

var FeColorMatrixElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FeColorMatrixElement,_Element);

var _super=_createSuper$D(FeColorMatrixElement);

function FeColorMatrixElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FeColorMatrixElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='feColorMatrix';
var matrix=toNumbers(_this.getAttribute('values').getString());

switch(_this.getAttribute('type').getString('matrix')){
// http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
case'saturate':
{
var s=matrix[0];
matrix=[0.213+0.787*s,0.715-0.715*s,0.072-0.072*s,0,0,0.213-0.213*s,0.715+0.285*s,0.072-0.072*s,0,0,0.213-0.213*s,0.715-0.715*s,0.072+0.928*s,0,0,0,0,0,1,0,0,0,0,0,1];
break;
}

case'hueRotate':
{
var a=matrix[0]*Math.PI/180.0;
matrix=[c(a,0.213,0.787,-0.213),c(a,0.715,-0.715,-0.715),c(a,0.072,-0.072,0.928),0,0,c(a,0.213,-0.213,0.143),c(a,0.715,0.285,0.140),c(a,0.072,-0.072,-0.283),0,0,c(a,0.213,-0.213,-0.787),c(a,0.715,-0.715,0.715),c(a,0.072,0.928,0.072),0,0,0,0,0,1,0,0,0,0,0,1];
break;
}

case'luminanceToAlpha':
matrix=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2125,0.7154,0.0721,0,0,0,0,0,0,1];
break;}


_this.matrix=matrix;
_this.includeOpacity=_this.getAttribute('includeOpacity').hasValue();
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FeColorMatrixElement,[{
key:"apply",
value:function apply(ctx,_,__,width,height){
// assuming x==0 && y==0 for now
var includeOpacity=this.includeOpacity,
matrix=this.matrix;
var srcData=ctx.getImageData(0,0,width,height);

for(var y=0;y<height;y++){
for(var x=0;x<width;x++){
var r=imGet(srcData.data,x,y,width,height,0);
var g=imGet(srcData.data,x,y,width,height,1);
var b=imGet(srcData.data,x,y,width,height,2);
var a=imGet(srcData.data,x,y,width,height,3);
var nr=m(matrix,0,r)+m(matrix,1,g)+m(matrix,2,b)+m(matrix,3,a)+m(matrix,4,1);
var ng=m(matrix,5,r)+m(matrix,6,g)+m(matrix,7,b)+m(matrix,8,a)+m(matrix,9,1);
var nb=m(matrix,10,r)+m(matrix,11,g)+m(matrix,12,b)+m(matrix,13,a)+m(matrix,14,1);
var na=m(matrix,15,r)+m(matrix,16,g)+m(matrix,17,b)+m(matrix,18,a)+m(matrix,19,1);

if(includeOpacity){
nr=ng=nb=0;
na*=a/255;
}

imSet(srcData.data,x,y,width,height,0,nr);
imSet(srcData.data,x,y,width,height,1,ng);
imSet(srcData.data,x,y,width,height,2,nb);
imSet(srcData.data,x,y,width,height,3,na);
}
}

ctx.clearRect(0,0,width,height);
ctx.putImageData(srcData,0,0);
}}]);


return FeColorMatrixElement;
}(Element);

function _createSuper$E(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$E();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$E(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var MaskElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(MaskElement,_Element);

var _super=_createSuper$E(MaskElement);

function MaskElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,MaskElement);

_this=_super.apply(this,arguments);
_this.type='mask';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(MaskElement,[{
key:"apply",
value:function apply(ctx,element){
var document=this.document;// render as temp svg

var x=this.getAttribute('x').getPixels('x');
var y=this.getAttribute('y').getPixels('y');
var width=this.getStyle('width').getPixels('x');
var height=this.getStyle('height').getPixels('y');

if(!width&&!height){
var _context;

var boundingBox=new BoundingBox();

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=this.children).call(_context,function(child){
boundingBox.addBoundingBox(child.getBoundingBox(ctx));
});

x=Math.floor(boundingBox.x1);
y=Math.floor(boundingBox.y1);
width=Math.floor(boundingBox.width);
height=Math.floor(boundingBox.height);
}

var ignoredStyles=this.removeStyles(element,MaskElement.ignoreStyles);
var maskCanvas=document.createCanvas(x+width,y+height);
var maskCtx=maskCanvas.getContext('2d');
document.screen.setDefaults(maskCtx);
this.renderChildren(maskCtx);// convert mask to alpha with a fake node
// TODO: refactor out apply from feColorMatrix

new FeColorMatrixElement(document,{
nodeType:1,
childNodes:[],
attributes:[{
nodeName:'type',
value:'luminanceToAlpha'},
{
nodeName:'includeOpacity',
value:'true'}]}).

apply(maskCtx,0,0,x+width,y+height);
var tmpCanvas=document.createCanvas(x+width,y+height);
var tmpCtx=tmpCanvas.getContext('2d');
document.screen.setDefaults(tmpCtx);
element.render(tmpCtx);
tmpCtx.globalCompositeOperation='destination-in';
tmpCtx.fillStyle=maskCtx.createPattern(maskCanvas,'no-repeat');
tmpCtx.fillRect(0,0,x+width,y+height);
ctx.fillStyle=tmpCtx.createPattern(tmpCanvas,'no-repeat');
ctx.fillRect(0,0,x+width,y+height);// reassign mask

this.restoreStyles(element,ignoredStyles);
}},
{
key:"render",
value:function render(_){// NO RENDER
}}]);


return MaskElement;
}(Element);
MaskElement.ignoreStyles=['mask','transform','clip-path'];

function _createSuper$F(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$F();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$F(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var noop=function noop(){};

var ClipPathElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(ClipPathElement,_Element);

var _super=_createSuper$F(ClipPathElement);

function ClipPathElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,ClipPathElement);

_this=_super.apply(this,arguments);
_this.type='clipPath';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(ClipPathElement,[{
key:"apply",
value:function apply(ctx){
var _context;

var document=this.document;

var contextProto=_babel_runtime_corejs3_core_js_stable_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_50___default()(ctx);

var beginPath=ctx.beginPath,
closePath=ctx.closePath;

if(contextProto){
contextProto.beginPath=noop;
contextProto.closePath=noop;
}

_babel_runtime_corejs3_core_js_stable_reflect_apply__WEBPACK_IMPORTED_MODULE_49___default()(beginPath,ctx,[]);

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context=this.children).call(_context,function(child){
if(typeof child.path==='undefined'){
return;
}

var transform=typeof child.elementTransform!=='undefined'?child.elementTransform():null;// handle <use />

if(!transform){
transform=Transform.fromElement(document,child);
}

if(transform){
transform.apply(ctx);
}

child.path(ctx);

if(contextProto){
contextProto.closePath=closePath;
}

if(transform){
transform.unapply(ctx);
}
});

_babel_runtime_corejs3_core_js_stable_reflect_apply__WEBPACK_IMPORTED_MODULE_49___default()(closePath,ctx,[]);

ctx.clip();

if(contextProto){
contextProto.beginPath=beginPath;
contextProto.closePath=closePath;
}
}},
{
key:"render",
value:function render(_){// NO RENDER
}}]);


return ClipPathElement;
}(Element);

function _createSuper$G(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$G();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$G(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FilterElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FilterElement,_Element);

var _super=_createSuper$G(FilterElement);

function FilterElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FilterElement);

_this=_super.apply(this,arguments);
_this.type='filter';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FilterElement,[{
key:"apply",
value:function apply(ctx,element){
// render as temp svg
var document=this.document,
children=this.children;
var boundingBox=element.getBoundingBox(ctx);

if(!boundingBox){
return;
}

var px=0;
var py=0;

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(children).call(children,function(child){
var efd=child.extraFilterDistance||0;
px=Math.max(px,efd);
py=Math.max(py,efd);
});

var width=Math.floor(boundingBox.width);
var height=Math.floor(boundingBox.height);
var tmpCanvasWidth=width+2*px;
var tmpCanvasHeight=height+2*py;

if(tmpCanvasWidth<1||tmpCanvasHeight<1){
return;
}

var x=Math.floor(boundingBox.x);
var y=Math.floor(boundingBox.y);
var ignoredStyles=this.removeStyles(element,FilterElement.ignoreStyles);
var tmpCanvas=document.createCanvas(tmpCanvasWidth,tmpCanvasHeight);
var tmpCtx=tmpCanvas.getContext('2d');
document.screen.setDefaults(tmpCtx);
tmpCtx.translate(-x+px,-y+py);
element.render(tmpCtx);// apply filters

_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(children).call(children,function(child){
if(typeof child.apply==='function'){
child.apply(tmpCtx,0,0,tmpCanvasWidth,tmpCanvasHeight);
}
});// render on me


ctx.drawImage(tmpCanvas,0,0,tmpCanvasWidth,tmpCanvasHeight,x-px,y-py,tmpCanvasWidth,tmpCanvasHeight);
this.restoreStyles(element,ignoredStyles);
}},
{
key:"render",
value:function render(_){// NO RENDER
}}]);


return FilterElement;
}(Element);
FilterElement.ignoreStyles=['filter','transform','clip-path'];

function _createSuper$H(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$H();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$H(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FeDropShadowElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FeDropShadowElement,_Element);

var _super=_createSuper$H(FeDropShadowElement);

function FeDropShadowElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FeDropShadowElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='feDropShadow';

_this.addStylesFromStyleDefinition();

return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FeDropShadowElement,[{
key:"apply",
value:function apply(_,__,___,____,_____){// TODO: implement
}}]);


return FeDropShadowElement;
}(Element);

function _createSuper$I(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$I();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$I(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FeMorphologyElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FeMorphologyElement,_Element);

var _super=_createSuper$I(FeMorphologyElement);

function FeMorphologyElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FeMorphologyElement);

_this=_super.apply(this,arguments);
_this.type='feMorphology';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FeMorphologyElement,[{
key:"apply",
value:function apply(_,__,___,____,_____){// TODO: implement
}}]);


return FeMorphologyElement;
}(Element);

function _createSuper$J(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$J();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$J(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FeCompositeElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FeCompositeElement,_Element);

var _super=_createSuper$J(FeCompositeElement);

function FeCompositeElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FeCompositeElement);

_this=_super.apply(this,arguments);
_this.type='feComposite';
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FeCompositeElement,[{
key:"apply",
value:function apply(_,__,___,____,_____){// TODO: implement
}}]);


return FeCompositeElement;
}(Element);

function _createSuper$K(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$K();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$K(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var FeGaussianBlurElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(FeGaussianBlurElement,_Element);

var _super=_createSuper$K(FeGaussianBlurElement);

function FeGaussianBlurElement(document,node,captureTextNodes){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,FeGaussianBlurElement);

_this=_super.call(this,document,node,captureTextNodes);
_this.type='feGaussianBlur';
_this.blurRadius=Math.floor(_this.getAttribute('stdDeviation').getNumber());
_this.extraFilterDistance=_this.blurRadius;
return _this;
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(FeGaussianBlurElement,[{
key:"apply",
value:function apply(ctx,x,y,width,height){
var document=this.document,
blurRadius=this.blurRadius;
var body=document.window?document.window.document.body:null;
var canvas=ctx.canvas;// StackBlur requires canvas be on document

canvas.id=document.getUniqueId();

if(body){
canvas.style.display='none';
body.appendChild(canvas);
}

Object(stackblur_canvas__WEBPACK_IMPORTED_MODULE_51__["canvasRGBA"])(canvas,x,y,width,height,blurRadius);

if(body){
body.removeChild(canvas);
}
}}]);


return FeGaussianBlurElement;
}(Element);

function _createSuper$L(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$L();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$L(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var TitleElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(TitleElement,_Element);

var _super=_createSuper$L(TitleElement);

function TitleElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,TitleElement);

_this=_super.apply(this,arguments);
_this.type='title';
return _this;
}

return TitleElement;
}(Element);

function _createSuper$M(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct$M();return function _createSuperInternal(){var Super=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_babel_runtime_corejs3_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_29___default()(this).constructor;result=_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Super,arguments,NewTarget);}else {result=Super.apply(this,arguments);}return _babel_runtime_corejs3_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_28___default()(this,result);};}

function _isNativeReflectConstruct$M(){if(typeof Reflect==="undefined"||!_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a)return false;if(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default.a.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_26___default()(Date,[],function(){}));return true;}catch(e){return false;}}

var DescElement=/*#__PURE__*/function(_Element){
_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_27___default()(DescElement,_Element);

var _super=_createSuper$M(DescElement);

function DescElement(){
var _this;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,DescElement);

_this=_super.apply(this,arguments);
_this.type='desc';
return _this;
}

return DescElement;
}(Element);

var elementTypes={
'svg':SVGElement,
'rect':RectElement,
'circle':CircleElement,
'ellipse':EllipseElement,
'line':LineElement,
'polyline':PolylineElement,
'polygon':PolygonElement,
'path':PathElement,
'pattern':PatternElement,
'marker':MarkerElement,
'defs':DefsElement,
'linearGradient':LinearGradientElement,
'radialGradient':RadialGradientElement,
'stop':StopElement,
'animate':AnimateElement,
'animateColor':AnimateColorElement,
'animateTransform':AnimateTransformElement,
'font':FontElement,
'font-face':FontFaceElement,
'missing-glyph':MissingGlyphElement,
'glyph':GlyphElement,
'text':TextElement,
'tspan':TSpanElement,
'tref':TRefElement,
'a':AElement,
'textPath':TextPathElement,
'image':ImageElement,
'g':GElement,
'symbol':SymbolElement,
'style':StyleElement,
'use':UseElement,
'mask':MaskElement,
'clipPath':ClipPathElement,
'filter':FilterElement,
'feDropShadow':FeDropShadowElement,
'feMorphology':FeMorphologyElement,
'feComposite':FeCompositeElement,
'feColorMatrix':FeColorMatrixElement,
'feGaussianBlur':FeGaussianBlurElement,
'title':TitleElement,
'desc':DescElement};


function ownKeys$1(object,enumerableOnly){var keys=_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(object);if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default.a){var symbols=_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default()(object);if(enumerableOnly)symbols=_babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9___default()(symbols).call(symbols,function(sym){return _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}

function _objectSpread$1(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){var _context5;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context5=ownKeys$1(Object(source),true)).call(_context5,function(key){_babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14___default()(target,key,source[key]);});}else if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default.a){_babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default()(target,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default()(source));}else {var _context6;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context6=ownKeys$1(Object(source))).call(_context6,function(key){_babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4___default()(target,key,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(source,key));});}}return target;}

function createCanvas(width,height){
var canvas=document.createElement('canvas');
canvas.width=width;
canvas.height=height;
return canvas;
}

function createImage(_x){
return _createImage.apply(this,arguments);
}

function _createImage(){
_createImage=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(src){
var anonymousCrossOrigin,
image,
_args=arguments;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context7){
while(1){
switch(_context7.prev=_context7.next){
case 0:
anonymousCrossOrigin=_args.length>1&&_args[1]!==undefined?_args[1]:false;
image=document.createElement('img');

if(anonymousCrossOrigin){
image.crossOrigin='Anonymous';
}

return _context7.abrupt("return",new _babel_runtime_corejs3_core_js_stable_promise__WEBPACK_IMPORTED_MODULE_21___default.a(function(resolve,reject){
image.onload=function(){
resolve(image);
};

image.onerror=function(){
reject();
};

image.src=src;
}));

case 4:
case"end":
return _context7.stop();}

}
},_callee);
}));
return _createImage.apply(this,arguments);
}

var Document=/*#__PURE__*/function(){
function Document(canvg){
var _context,_context2;

var _ref=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{},
_ref$rootEmSize=_ref.rootEmSize,
rootEmSize=_ref$rootEmSize===void 0?12:_ref$rootEmSize,
_ref$emSize=_ref.emSize,
emSize=_ref$emSize===void 0?12:_ref$emSize,
_ref$createCanvas=_ref.createCanvas,
createCanvas=_ref$createCanvas===void 0?Document.createCanvas:_ref$createCanvas,
_ref$createImage=_ref.createImage,
createImage=_ref$createImage===void 0?Document.createImage:_ref$createImage,
anonymousCrossOrigin=_ref.anonymousCrossOrigin;

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Document);

this.canvg=canvg;
this.definitions={};
this.styles={};
this.stylesSpecificity={};
this.images=[];
this.fonts=[];
this.emSizeStack=[];
this.uniqueId=0;
this.screen=canvg.screen;
this.rootEmSize=rootEmSize;
this.emSize=emSize;
this.createCanvas=createCanvas;
this.createImage=this.bindCreateImage(createImage,anonymousCrossOrigin);
this.screen.wait(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default()(_context=this.isImagesLoaded).call(_context,this));
this.screen.wait(_babel_runtime_corejs3_core_js_stable_instance_bind__WEBPACK_IMPORTED_MODULE_22___default()(_context2=this.isFontsLoaded).call(_context2,this));
}

_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Document,[{
key:"bindCreateImage",
value:function bindCreateImage(createImage,anonymousCrossOrigin){
if(typeof anonymousCrossOrigin==='boolean'){
return function(source,forceAnonymousCrossOrigin){
return createImage(source,typeof forceAnonymousCrossOrigin==='boolean'?forceAnonymousCrossOrigin:anonymousCrossOrigin);
};
}

return createImage;
}},
{
key:"popEmSize",
value:function popEmSize(){
var emSizeStack=this.emSizeStack;
emSizeStack.pop();
}},
{
key:"getUniqueId",
value:function getUniqueId(){
return "canvg".concat(++this.uniqueId);
}},
{
key:"isImagesLoaded",
value:function isImagesLoaded(){
var _context3;

return _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20___default()(_context3=this.images).call(_context3,function(_){
return _.loaded;
});
}},
{
key:"isFontsLoaded",
value:function isFontsLoaded(){
var _context4;

return _babel_runtime_corejs3_core_js_stable_instance_every__WEBPACK_IMPORTED_MODULE_20___default()(_context4=this.fonts).call(_context4,function(_){
return _.loaded;
});
}},
{
key:"createDocumentElement",
value:function createDocumentElement(document){
var documentElement=this.createElement(document.documentElement);
documentElement.root=true;
documentElement.addStylesFromStyleDefinition();
this.documentElement=documentElement;
return documentElement;
}},
{
key:"createElement",
value:function createElement(node){
var elementType=node.nodeName.replace(/^[^:]+:/,'');
var ElementType=Document.elementTypes[elementType];

if(typeof ElementType!=='undefined'){
return new ElementType(this,node);
}

return new UnknownElement(this,node);
}},
{
key:"createTextNode",
value:function createTextNode(node){
return new TextNode(this,node);
}},
{
key:"setViewBox",
value:function setViewBox(config){
this.screen.setViewBox(_objectSpread$1({
document:this},
config));
}},
{
key:"window",
get:function get(){
return this.screen.window;
}},
{
key:"fetch",
get:function get(){
return this.screen.fetch;
}},
{
key:"ctx",
get:function get(){
return this.screen.ctx;
}},
{
key:"emSize",
get:function get(){
var emSizeStack=this.emSizeStack;
return emSizeStack[emSizeStack.length-1];
},
set:function set(value){
var emSizeStack=this.emSizeStack;
emSizeStack.push(value);
}}]);


return Document;
}();
Document.createCanvas=createCanvas;
Document.createImage=createImage;
Document.elementTypes=elementTypes;

function ownKeys$2(object,enumerableOnly){var keys=_babel_runtime_corejs3_core_js_stable_object_keys__WEBPACK_IMPORTED_MODULE_11___default()(object);if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default.a){var symbols=_babel_runtime_corejs3_core_js_stable_object_get_own_property_symbols__WEBPACK_IMPORTED_MODULE_10___default()(object);if(enumerableOnly)symbols=_babel_runtime_corejs3_core_js_stable_instance_filter__WEBPACK_IMPORTED_MODULE_9___default()(symbols).call(symbols,function(sym){return _babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}

function _objectSpread$2(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){var _context3;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context3=ownKeys$2(Object(source),true)).call(_context3,function(key){_babel_runtime_corejs3_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_14___default()(target,key,source[key]);});}else if(_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default.a){_babel_runtime_corejs3_core_js_stable_object_define_properties__WEBPACK_IMPORTED_MODULE_5___default()(target,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_6___default()(source));}else {var _context4;_babel_runtime_corejs3_core_js_stable_instance_for_each__WEBPACK_IMPORTED_MODULE_7___default()(_context4=ownKeys$2(Object(source))).call(_context4,function(key){_babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_4___default()(target,key,_babel_runtime_corejs3_core_js_stable_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_8___default()(source,key));});}}return target;}
/**
 * SVG renderer on canvas.
 */

var Canvg=/*#__PURE__*/function(){
/**
   * Main constructor.
   * @param ctx - Rendering context.
   * @param svg - SVG Document.
   * @param options - Rendering options.
   */
function Canvg(ctx,svg){
var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};

_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_15___default()(this,Canvg);

this.parser=new Parser(options);
this.screen=new Screen(ctx,options);
this.options=options;
var document=new Document(this,options);
var documentElement=document.createDocumentElement(svg);
this.document=document;
this.documentElement=documentElement;
}
/**
   * Create Canvg instance from SVG source string or URL.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   */


_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_16___default()(Canvg,[{
key:"fork",

/**
     * Create new Canvg instance with inherited options.
     * @param ctx - Rendering context.
     * @param svg - SVG source string or URL.
     * @param options - Rendering options.
     */
value:function fork(ctx,svg){
var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};
return Canvg.from(ctx,svg,_objectSpread$2(_objectSpread$2({},this.options),options));
}
/**
     * Create new Canvg instance with inherited options.
     * @param ctx - Rendering context.
     * @param svg - SVG source string.
     * @param options - Rendering options.
     */},

{
key:"forkString",
value:function forkString(ctx,svg){
var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};
return Canvg.fromString(ctx,svg,_objectSpread$2(_objectSpread$2({},this.options),options));
}
/**
     * Document is ready promise.
     */},

{
key:"ready",
value:function ready(){
return this.screen.ready();
}
/**
     * Document is ready value.
     */},

{
key:"isReady",
value:function isReady(){
return this.screen.isReady();
}
/**
     * Render only first frame, ignoring animations and mouse.
     * @param options - Rendering options.
     */},

{
key:"render",
value:function(){
var _render=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(){
var options,
_args=arguments;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
options=_args.length>0&&_args[0]!==undefined?_args[0]:{};
this.start(_objectSpread$2({
enableRedraw:true,
ignoreAnimation:true,
ignoreMouse:true},
options));
_context.next=4;
return this.ready();

case 4:
this.stop();

case 5:
case"end":
return _context.stop();}

}
},_callee,this);
}));

function render(){
return _render.apply(this,arguments);
}

return render;
}()
/**
     * Start rendering.
     * @param options - Render options.
     */},

{
key:"start",
value:function start(){
var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};
var documentElement=this.documentElement,
screen=this.screen,
baseOptions=this.options;
screen.start(documentElement,_objectSpread$2(_objectSpread$2({
enableRedraw:true},
baseOptions),options));
}
/**
     * Stop rendering.
     */},

{
key:"stop",
value:function stop(){
this.screen.stop();
}
/**
     * Resize SVG to fit in given size.
     * @param width
     * @param height
     * @param preserveAspectRatio
     */},

{
key:"resize",
value:function resize(width){
var height=arguments.length>1&&arguments[1]!==undefined?arguments[1]:width;
var preserveAspectRatio=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;
this.documentElement.resize(width,height,preserveAspectRatio);
}}],
[{
key:"from",
value:function(){
var _from=_babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee2(ctx,svg){
var options,
parser,
svgDocument,
_args2=arguments;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee2$(_context2){
while(1){
switch(_context2.prev=_context2.next){
case 0:
options=_args2.length>2&&_args2[2]!==undefined?_args2[2]:{};
parser=new Parser(options);
_context2.next=4;
return parser.parse(svg);

case 4:
svgDocument=_context2.sent;
return _context2.abrupt("return",new Canvg(ctx,svgDocument,options));

case 6:
case"end":
return _context2.stop();}

}
},_callee2);
}));

function from(_x,_x2){
return _from.apply(this,arguments);
}

return from;
}()
/**
     * Create Canvg instance from SVG source string.
     * @param ctx - Rendering context.
     * @param svg - SVG source string.
     * @param options - Rendering options.
     */},

{
key:"fromString",
value:function fromString(ctx,svg){
var options=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{};
var parser=new Parser(options);
var svgDocument=parser.parseFromString(svg);
return new Canvg(ctx,svgDocument,options);
}}]);


return Canvg;
}();

/**
 * Options preset for `OffscreenCanvas`.
 * @param config - Preset requirements.
 * @param config.DOMParser - XML/HTML parser from string into DOM Document.
 */
function offscreen(){
var _ref=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},
DOMParserFallback=_ref.DOMParser;

var preset={
window:null,
ignoreAnimation:true,
ignoreMouse:true,
DOMParser:DOMParserFallback,
createCanvas:function createCanvas(width,height){
return new OffscreenCanvas(width,height);
},
createImage:function createImage(url){
return _babel_runtime_corejs3_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_13___default()(/*#__PURE__*/_babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.mark(function _callee(){
var response,blob,img;
return _babel_runtime_corejs3_regenerator__WEBPACK_IMPORTED_MODULE_12___default.a.wrap(function _callee$(_context){
while(1){
switch(_context.prev=_context.next){
case 0:
_context.next=2;
return fetch(url);

case 2:
response=_context.sent;
_context.next=5;
return response.blob();

case 5:
blob=_context.sent;
_context.next=8;
return createImageBitmap(blob);

case 8:
img=_context.sent;
return _context.abrupt("return",img);

case 10:
case"end":
return _context.stop();}

}
},_callee);
}))();
}};


if(typeof DOMParser!=='undefined'||typeof DOMParserFallback==='undefined'){
_babel_runtime_corejs3_core_js_stable_reflect_delete_property__WEBPACK_IMPORTED_MODULE_39___default()(preset,'DOMParser');
}

return preset;
}

/**
 * Options preset for `node-canvas`.
 * @param config - Preset requirements.
 * @param config.DOMParser - XML/HTML parser from string into DOM Document.
 * @param config.canvas - `node-canvas` exports.
 * @param config.fetch - WHATWG-compatible `fetch` function.
 */
function node(_ref){
var DOMParser=_ref.DOMParser,
canvas=_ref.canvas,
fetch=_ref.fetch;
return {
window:null,
ignoreAnimation:true,
ignoreMouse:true,
DOMParser:DOMParser,
fetch:fetch,
createCanvas:canvas.createCanvas,
createImage:canvas.loadImage};

}

var index=/*#__PURE__*/Object.freeze({
__proto__:null,
offscreen:offscreen,
node:node});


/* harmony default export */__webpack_exports__["default"]=Canvg;



/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(/*! ./../../process/browser.js */"./node_modules/process/browser.js"));

/***/},

/***/"./node_modules/core-js-pure/es/array/from.js":




function node_modulesCoreJsPureEsArrayFromJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
__webpack_require__(/*! ../../modules/es.array.from */"./node_modules/core-js-pure/modules/es.array.from.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Array.from;


/***/},

/***/"./node_modules/core-js-pure/es/array/is-array.js":




function node_modulesCoreJsPureEsArrayIsArrayJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.array.is-array */"./node_modules/core-js-pure/modules/es.array.is-array.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Array.isArray;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/concat.js":




function node_modulesCoreJsPureEsArrayVirtualConcatJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.concat */"./node_modules/core-js-pure/modules/es.array.concat.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').concat;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/every.js":




function node_modulesCoreJsPureEsArrayVirtualEveryJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.every */"./node_modules/core-js-pure/modules/es.array.every.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').every;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/fill.js":




function node_modulesCoreJsPureEsArrayVirtualFillJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.fill */"./node_modules/core-js-pure/modules/es.array.fill.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').fill;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/filter.js":




function node_modulesCoreJsPureEsArrayVirtualFilterJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.filter */"./node_modules/core-js-pure/modules/es.array.filter.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').filter;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/for-each.js":




function node_modulesCoreJsPureEsArrayVirtualForEachJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.for-each */"./node_modules/core-js-pure/modules/es.array.for-each.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').forEach;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/includes.js":




function node_modulesCoreJsPureEsArrayVirtualIncludesJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.includes */"./node_modules/core-js-pure/modules/es.array.includes.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').includes;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/index-of.js":




function node_modulesCoreJsPureEsArrayVirtualIndexOfJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.index-of */"./node_modules/core-js-pure/modules/es.array.index-of.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').indexOf;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/map.js":




function node_modulesCoreJsPureEsArrayVirtualMapJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.map */"./node_modules/core-js-pure/modules/es.array.map.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').map;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/reduce.js":




function node_modulesCoreJsPureEsArrayVirtualReduceJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.reduce */"./node_modules/core-js-pure/modules/es.array.reduce.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').reduce;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/reverse.js":




function node_modulesCoreJsPureEsArrayVirtualReverseJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.reverse */"./node_modules/core-js-pure/modules/es.array.reverse.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').reverse;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/slice.js":




function node_modulesCoreJsPureEsArrayVirtualSliceJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.slice */"./node_modules/core-js-pure/modules/es.array.slice.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').slice;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/some.js":




function node_modulesCoreJsPureEsArrayVirtualSomeJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.some */"./node_modules/core-js-pure/modules/es.array.some.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').some;


/***/},

/***/"./node_modules/core-js-pure/es/array/virtual/values.js":




function node_modulesCoreJsPureEsArrayVirtualValuesJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../../modules/es.object.to-string */"./node_modules/core-js-pure/modules/es.object.to-string.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Array').values;


/***/},

/***/"./node_modules/core-js-pure/es/date/now.js":




function node_modulesCoreJsPureEsDateNowJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.date.now */"./node_modules/core-js-pure/modules/es.date.now.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Date.now;


/***/},

/***/"./node_modules/core-js-pure/es/function/virtual/bind.js":




function node_modulesCoreJsPureEsFunctionVirtualBindJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.function.bind */"./node_modules/core-js-pure/modules/es.function.bind.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('Function').bind;


/***/},

/***/"./node_modules/core-js-pure/es/get-iterator-method.js":




function node_modulesCoreJsPureEsGetIteratorMethodJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
var getIteratorMethod=__webpack_require__(/*! ../internals/get-iterator-method */"./node_modules/core-js-pure/internals/get-iterator-method.js");

module.exports=getIteratorMethod;


/***/},

/***/"./node_modules/core-js-pure/es/get-iterator.js":




function node_modulesCoreJsPureEsGetIteratorJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
var getIterator=__webpack_require__(/*! ../internals/get-iterator */"./node_modules/core-js-pure/internals/get-iterator.js");

module.exports=getIterator;


/***/},

/***/"./node_modules/core-js-pure/es/instance/bind.js":




function node_modulesCoreJsPureEsInstanceBindJs(module,exports,__webpack_require__){

var bind=__webpack_require__(/*! ../function/virtual/bind */"./node_modules/core-js-pure/es/function/virtual/bind.js");

var FunctionPrototype=Function.prototype;

module.exports=function(it){
var own=it.bind;
return it===FunctionPrototype||it instanceof Function&&own===FunctionPrototype.bind?bind:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/concat.js":




function node_modulesCoreJsPureEsInstanceConcatJs(module,exports,__webpack_require__){

var concat=__webpack_require__(/*! ../array/virtual/concat */"./node_modules/core-js-pure/es/array/virtual/concat.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.concat;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.concat?concat:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/every.js":




function node_modulesCoreJsPureEsInstanceEveryJs(module,exports,__webpack_require__){

var every=__webpack_require__(/*! ../array/virtual/every */"./node_modules/core-js-pure/es/array/virtual/every.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.every;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.every?every:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/fill.js":




function node_modulesCoreJsPureEsInstanceFillJs(module,exports,__webpack_require__){

var fill=__webpack_require__(/*! ../array/virtual/fill */"./node_modules/core-js-pure/es/array/virtual/fill.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.fill;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.fill?fill:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/filter.js":




function node_modulesCoreJsPureEsInstanceFilterJs(module,exports,__webpack_require__){

var filter=__webpack_require__(/*! ../array/virtual/filter */"./node_modules/core-js-pure/es/array/virtual/filter.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.filter;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.filter?filter:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/includes.js":




function node_modulesCoreJsPureEsInstanceIncludesJs(module,exports,__webpack_require__){

var arrayIncludes=__webpack_require__(/*! ../array/virtual/includes */"./node_modules/core-js-pure/es/array/virtual/includes.js");
var stringIncludes=__webpack_require__(/*! ../string/virtual/includes */"./node_modules/core-js-pure/es/string/virtual/includes.js");

var ArrayPrototype=Array.prototype;
var StringPrototype=String.prototype;

module.exports=function(it){
var own=it.includes;
if(it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.includes)return arrayIncludes;
if(typeof it==='string'||it===StringPrototype||it instanceof String&&own===StringPrototype.includes){
return stringIncludes;
}return own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/index-of.js":




function node_modulesCoreJsPureEsInstanceIndexOfJs(module,exports,__webpack_require__){

var indexOf=__webpack_require__(/*! ../array/virtual/index-of */"./node_modules/core-js-pure/es/array/virtual/index-of.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.indexOf;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.indexOf?indexOf:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/map.js":




function node_modulesCoreJsPureEsInstanceMapJs(module,exports,__webpack_require__){

var map=__webpack_require__(/*! ../array/virtual/map */"./node_modules/core-js-pure/es/array/virtual/map.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.map;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.map?map:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/reduce.js":




function node_modulesCoreJsPureEsInstanceReduceJs(module,exports,__webpack_require__){

var reduce=__webpack_require__(/*! ../array/virtual/reduce */"./node_modules/core-js-pure/es/array/virtual/reduce.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.reduce;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.reduce?reduce:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/reverse.js":




function node_modulesCoreJsPureEsInstanceReverseJs(module,exports,__webpack_require__){

var reverse=__webpack_require__(/*! ../array/virtual/reverse */"./node_modules/core-js-pure/es/array/virtual/reverse.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.reverse;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.reverse?reverse:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/slice.js":




function node_modulesCoreJsPureEsInstanceSliceJs(module,exports,__webpack_require__){

var slice=__webpack_require__(/*! ../array/virtual/slice */"./node_modules/core-js-pure/es/array/virtual/slice.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.slice;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.slice?slice:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/some.js":




function node_modulesCoreJsPureEsInstanceSomeJs(module,exports,__webpack_require__){

var some=__webpack_require__(/*! ../array/virtual/some */"./node_modules/core-js-pure/es/array/virtual/some.js");

var ArrayPrototype=Array.prototype;

module.exports=function(it){
var own=it.some;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.some?some:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/starts-with.js":




function node_modulesCoreJsPureEsInstanceStartsWithJs(module,exports,__webpack_require__){

var startsWith=__webpack_require__(/*! ../string/virtual/starts-with */"./node_modules/core-js-pure/es/string/virtual/starts-with.js");

var StringPrototype=String.prototype;

module.exports=function(it){
var own=it.startsWith;
return typeof it==='string'||it===StringPrototype||
it instanceof String&&own===StringPrototype.startsWith?startsWith:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/instance/trim.js":




function node_modulesCoreJsPureEsInstanceTrimJs(module,exports,__webpack_require__){

var trim=__webpack_require__(/*! ../string/virtual/trim */"./node_modules/core-js-pure/es/string/virtual/trim.js");

var StringPrototype=String.prototype;

module.exports=function(it){
var own=it.trim;
return typeof it==='string'||it===StringPrototype||
it instanceof String&&own===StringPrototype.trim?trim:own;
};


/***/},

/***/"./node_modules/core-js-pure/es/map/index.js":




function node_modulesCoreJsPureEsMapIndexJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.map */"./node_modules/core-js-pure/modules/es.map.js");
__webpack_require__(/*! ../../modules/es.object.to-string */"./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Map;


/***/},

/***/"./node_modules/core-js-pure/es/object/create.js":




function node_modulesCoreJsPureEsObjectCreateJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.create */"./node_modules/core-js-pure/modules/es.object.create.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

var Object=path.Object;

module.exports=function create(P,D){
return Object.create(P,D);
};


/***/},

/***/"./node_modules/core-js-pure/es/object/define-properties.js":




function node_modulesCoreJsPureEsObjectDefinePropertiesJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.define-properties */"./node_modules/core-js-pure/modules/es.object.define-properties.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

var Object=path.Object;

var defineProperties=module.exports=function defineProperties(T,D){
return Object.defineProperties(T,D);
};

if(Object.defineProperties.sham)defineProperties.sham=true;


/***/},

/***/"./node_modules/core-js-pure/es/object/define-property.js":




function node_modulesCoreJsPureEsObjectDefinePropertyJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.define-property */"./node_modules/core-js-pure/modules/es.object.define-property.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

var Object=path.Object;

var defineProperty=module.exports=function defineProperty(it,key,desc){
return Object.defineProperty(it,key,desc);
};

if(Object.defineProperty.sham)defineProperty.sham=true;


/***/},

/***/"./node_modules/core-js-pure/es/object/get-own-property-descriptor.js":




function node_modulesCoreJsPureEsObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.get-own-property-descriptor */"./node_modules/core-js-pure/modules/es.object.get-own-property-descriptor.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

var Object=path.Object;

var getOwnPropertyDescriptor=module.exports=function getOwnPropertyDescriptor(it,key){
return Object.getOwnPropertyDescriptor(it,key);
};

if(Object.getOwnPropertyDescriptor.sham)getOwnPropertyDescriptor.sham=true;


/***/},

/***/"./node_modules/core-js-pure/es/object/get-own-property-descriptors.js":




function node_modulesCoreJsPureEsObjectGetOwnPropertyDescriptorsJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.get-own-property-descriptors */"./node_modules/core-js-pure/modules/es.object.get-own-property-descriptors.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Object.getOwnPropertyDescriptors;


/***/},

/***/"./node_modules/core-js-pure/es/object/get-own-property-symbols.js":




function node_modulesCoreJsPureEsObjectGetOwnPropertySymbolsJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.symbol */"./node_modules/core-js-pure/modules/es.symbol.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Object.getOwnPropertySymbols;


/***/},

/***/"./node_modules/core-js-pure/es/object/get-prototype-of.js":




function node_modulesCoreJsPureEsObjectGetPrototypeOfJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.get-prototype-of */"./node_modules/core-js-pure/modules/es.object.get-prototype-of.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Object.getPrototypeOf;


/***/},

/***/"./node_modules/core-js-pure/es/object/keys.js":




function node_modulesCoreJsPureEsObjectKeysJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.keys */"./node_modules/core-js-pure/modules/es.object.keys.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Object.keys;


/***/},

/***/"./node_modules/core-js-pure/es/object/set-prototype-of.js":




function node_modulesCoreJsPureEsObjectSetPrototypeOfJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.object.set-prototype-of */"./node_modules/core-js-pure/modules/es.object.set-prototype-of.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Object.setPrototypeOf;


/***/},

/***/"./node_modules/core-js-pure/es/parse-float.js":




function node_modulesCoreJsPureEsParseFloatJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../modules/es.parse-float */"./node_modules/core-js-pure/modules/es.parse-float.js");
var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.parseFloat;


/***/},

/***/"./node_modules/core-js-pure/es/parse-int.js":




function node_modulesCoreJsPureEsParseIntJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../modules/es.parse-int */"./node_modules/core-js-pure/modules/es.parse-int.js");
var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.parseInt;


/***/},

/***/"./node_modules/core-js-pure/es/promise/index.js":




function node_modulesCoreJsPureEsPromiseIndexJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.aggregate-error */"./node_modules/core-js-pure/modules/es.aggregate-error.js");
__webpack_require__(/*! ../../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.object.to-string */"./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.promise */"./node_modules/core-js-pure/modules/es.promise.js");
__webpack_require__(/*! ../../modules/es.promise.all-settled */"./node_modules/core-js-pure/modules/es.promise.all-settled.js");
__webpack_require__(/*! ../../modules/es.promise.any */"./node_modules/core-js-pure/modules/es.promise.any.js");
__webpack_require__(/*! ../../modules/es.promise.finally */"./node_modules/core-js-pure/modules/es.promise.finally.js");
__webpack_require__(/*! ../../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Promise;


/***/},

/***/"./node_modules/core-js-pure/es/reflect/apply.js":




function node_modulesCoreJsPureEsReflectApplyJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.reflect.apply */"./node_modules/core-js-pure/modules/es.reflect.apply.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Reflect.apply;


/***/},

/***/"./node_modules/core-js-pure/es/reflect/construct.js":




function node_modulesCoreJsPureEsReflectConstructJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.reflect.construct */"./node_modules/core-js-pure/modules/es.reflect.construct.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Reflect.construct;


/***/},

/***/"./node_modules/core-js-pure/es/reflect/delete-property.js":




function node_modulesCoreJsPureEsReflectDeletePropertyJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.reflect.delete-property */"./node_modules/core-js-pure/modules/es.reflect.delete-property.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Reflect.deleteProperty;


/***/},

/***/"./node_modules/core-js-pure/es/reflect/get-prototype-of.js":




function node_modulesCoreJsPureEsReflectGetPrototypeOfJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.reflect.get-prototype-of */"./node_modules/core-js-pure/modules/es.reflect.get-prototype-of.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Reflect.getPrototypeOf;


/***/},

/***/"./node_modules/core-js-pure/es/reflect/get.js":




function node_modulesCoreJsPureEsReflectGetJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.reflect.get */"./node_modules/core-js-pure/modules/es.reflect.get.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Reflect.get;


/***/},

/***/"./node_modules/core-js-pure/es/string/virtual/includes.js":




function node_modulesCoreJsPureEsStringVirtualIncludesJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.string.includes */"./node_modules/core-js-pure/modules/es.string.includes.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('String').includes;


/***/},

/***/"./node_modules/core-js-pure/es/string/virtual/starts-with.js":




function node_modulesCoreJsPureEsStringVirtualStartsWithJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.string.starts-with */"./node_modules/core-js-pure/modules/es.string.starts-with.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('String').startsWith;


/***/},

/***/"./node_modules/core-js-pure/es/string/virtual/trim.js":




function node_modulesCoreJsPureEsStringVirtualTrimJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../../modules/es.string.trim */"./node_modules/core-js-pure/modules/es.string.trim.js");
var entryVirtual=__webpack_require__(/*! ../../../internals/entry-virtual */"./node_modules/core-js-pure/internals/entry-virtual.js");

module.exports=entryVirtual('String').trim;


/***/},

/***/"./node_modules/core-js-pure/es/symbol/index.js":




function node_modulesCoreJsPureEsSymbolIndexJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.array.concat */"./node_modules/core-js-pure/modules/es.array.concat.js");
__webpack_require__(/*! ../../modules/es.object.to-string */"./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.symbol */"./node_modules/core-js-pure/modules/es.symbol.js");
__webpack_require__(/*! ../../modules/es.symbol.async-iterator */"./node_modules/core-js-pure/modules/es.symbol.async-iterator.js");
__webpack_require__(/*! ../../modules/es.symbol.description */"./node_modules/core-js-pure/modules/es.symbol.description.js");
__webpack_require__(/*! ../../modules/es.symbol.has-instance */"./node_modules/core-js-pure/modules/es.symbol.has-instance.js");
__webpack_require__(/*! ../../modules/es.symbol.is-concat-spreadable */"./node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js");
__webpack_require__(/*! ../../modules/es.symbol.iterator */"./node_modules/core-js-pure/modules/es.symbol.iterator.js");
__webpack_require__(/*! ../../modules/es.symbol.match */"./node_modules/core-js-pure/modules/es.symbol.match.js");
__webpack_require__(/*! ../../modules/es.symbol.match-all */"./node_modules/core-js-pure/modules/es.symbol.match-all.js");
__webpack_require__(/*! ../../modules/es.symbol.replace */"./node_modules/core-js-pure/modules/es.symbol.replace.js");
__webpack_require__(/*! ../../modules/es.symbol.search */"./node_modules/core-js-pure/modules/es.symbol.search.js");
__webpack_require__(/*! ../../modules/es.symbol.species */"./node_modules/core-js-pure/modules/es.symbol.species.js");
__webpack_require__(/*! ../../modules/es.symbol.split */"./node_modules/core-js-pure/modules/es.symbol.split.js");
__webpack_require__(/*! ../../modules/es.symbol.to-primitive */"./node_modules/core-js-pure/modules/es.symbol.to-primitive.js");
__webpack_require__(/*! ../../modules/es.symbol.to-string-tag */"./node_modules/core-js-pure/modules/es.symbol.to-string-tag.js");
__webpack_require__(/*! ../../modules/es.symbol.unscopables */"./node_modules/core-js-pure/modules/es.symbol.unscopables.js");
__webpack_require__(/*! ../../modules/es.json.to-string-tag */"./node_modules/core-js-pure/modules/es.json.to-string-tag.js");
__webpack_require__(/*! ../../modules/es.math.to-string-tag */"./node_modules/core-js-pure/modules/es.math.to-string-tag.js");
__webpack_require__(/*! ../../modules/es.reflect.to-string-tag */"./node_modules/core-js-pure/modules/es.reflect.to-string-tag.js");
var path=__webpack_require__(/*! ../../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=path.Symbol;


/***/},

/***/"./node_modules/core-js-pure/es/symbol/iterator.js":




function node_modulesCoreJsPureEsSymbolIteratorJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
__webpack_require__(/*! ../../modules/es.object.to-string */"./node_modules/core-js-pure/modules/es.object.to-string.js");
__webpack_require__(/*! ../../modules/es.string.iterator */"./node_modules/core-js-pure/modules/es.string.iterator.js");
__webpack_require__(/*! ../../modules/es.symbol.iterator */"./node_modules/core-js-pure/modules/es.symbol.iterator.js");
var WrappedWellKnownSymbolModule=__webpack_require__(/*! ../../internals/well-known-symbol-wrapped */"./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js");

module.exports=WrappedWellKnownSymbolModule.f('iterator');


/***/},

/***/"./node_modules/core-js-pure/features/array/from.js":




function node_modulesCoreJsPureFeaturesArrayFromJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/array/from */"./node_modules/core-js-pure/stable/array/from.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/array/is-array.js":




function node_modulesCoreJsPureFeaturesArrayIsArrayJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/array/is-array */"./node_modules/core-js-pure/stable/array/is-array.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/get-iterator-method.js":




function node_modulesCoreJsPureFeaturesGetIteratorMethodJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../stable/get-iterator-method */"./node_modules/core-js-pure/stable/get-iterator-method.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/get-iterator.js":




function node_modulesCoreJsPureFeaturesGetIteratorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../stable/get-iterator */"./node_modules/core-js-pure/stable/get-iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/instance/slice.js":




function node_modulesCoreJsPureFeaturesInstanceSliceJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/instance/slice */"./node_modules/core-js-pure/stable/instance/slice.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/object/create.js":




function node_modulesCoreJsPureFeaturesObjectCreateJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/object/create */"./node_modules/core-js-pure/stable/object/create.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/object/define-property.js":




function node_modulesCoreJsPureFeaturesObjectDefinePropertyJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/object/define-property */"./node_modules/core-js-pure/stable/object/define-property.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/object/get-own-property-descriptor.js":




function node_modulesCoreJsPureFeaturesObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/object/get-own-property-descriptor */"./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/object/get-prototype-of.js":




function node_modulesCoreJsPureFeaturesObjectGetPrototypeOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/object/get-prototype-of */"./node_modules/core-js-pure/stable/object/get-prototype-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/object/set-prototype-of.js":




function node_modulesCoreJsPureFeaturesObjectSetPrototypeOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/object/set-prototype-of */"./node_modules/core-js-pure/stable/object/set-prototype-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/promise/index.js":




function node_modulesCoreJsPureFeaturesPromiseIndexJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/promise */"./node_modules/core-js-pure/stable/promise/index.js");
__webpack_require__(/*! ../../modules/esnext.aggregate-error */"./node_modules/core-js-pure/modules/esnext.aggregate-error.js");
// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.promise.all-settled */"./node_modules/core-js-pure/modules/esnext.promise.all-settled.js");
__webpack_require__(/*! ../../modules/esnext.promise.try */"./node_modules/core-js-pure/modules/esnext.promise.try.js");
__webpack_require__(/*! ../../modules/esnext.promise.any */"./node_modules/core-js-pure/modules/esnext.promise.any.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/reflect/get.js":




function node_modulesCoreJsPureFeaturesReflectGetJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/reflect/get */"./node_modules/core-js-pure/stable/reflect/get.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/symbol/index.js":




function node_modulesCoreJsPureFeaturesSymbolIndexJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/symbol */"./node_modules/core-js-pure/stable/symbol/index.js");
__webpack_require__(/*! ../../modules/esnext.symbol.async-dispose */"./node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js");
__webpack_require__(/*! ../../modules/esnext.symbol.dispose */"./node_modules/core-js-pure/modules/esnext.symbol.dispose.js");
__webpack_require__(/*! ../../modules/esnext.symbol.matcher */"./node_modules/core-js-pure/modules/esnext.symbol.matcher.js");
__webpack_require__(/*! ../../modules/esnext.symbol.metadata */"./node_modules/core-js-pure/modules/esnext.symbol.metadata.js");
__webpack_require__(/*! ../../modules/esnext.symbol.observable */"./node_modules/core-js-pure/modules/esnext.symbol.observable.js");
// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.symbol.pattern-match */"./node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js");
// TODO: Remove from `core-js@4`
__webpack_require__(/*! ../../modules/esnext.symbol.replace-all */"./node_modules/core-js-pure/modules/esnext.symbol.replace-all.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/features/symbol/iterator.js":




function node_modulesCoreJsPureFeaturesSymbolIteratorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../stable/symbol/iterator */"./node_modules/core-js-pure/stable/symbol/iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/internals/a-function.js":




function node_modulesCoreJsPureInternalsAFunctionJs(module,exports){

module.exports=function(it){
if(typeof it!='function'){
throw TypeError(String(it)+' is not a function');
}return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/a-possible-prototype.js":




function node_modulesCoreJsPureInternalsAPossiblePrototypeJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");

module.exports=function(it){
if(!isObject(it)&&it!==null){
throw TypeError("Can't set "+String(it)+' as a prototype');
}return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/add-to-unscopables.js":




function node_modulesCoreJsPureInternalsAddToUnscopablesJs(module,exports){

module.exports=function(){/* empty */};


/***/},

/***/"./node_modules/core-js-pure/internals/an-instance.js":




function node_modulesCoreJsPureInternalsAnInstanceJs(module,exports){

module.exports=function(it,Constructor,name){
if(!(it instanceof Constructor)){
throw TypeError('Incorrect '+(name?name+' ':'')+'invocation');
}return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/an-object.js":




function node_modulesCoreJsPureInternalsAnObjectJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");

module.exports=function(it){
if(!isObject(it)){
throw TypeError(String(it)+' is not an object');
}return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-fill.js":




function node_modulesCoreJsPureInternalsArrayFillJs(module,exports,__webpack_require__){

var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var toAbsoluteIndex=__webpack_require__(/*! ../internals/to-absolute-index */"./node_modules/core-js-pure/internals/to-absolute-index.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports=function fill(value/* , start = 0, end = @length */){
var O=toObject(this);
var length=toLength(O.length);
var argumentsLength=arguments.length;
var index=toAbsoluteIndex(argumentsLength>1?arguments[1]:undefined,length);
var end=argumentsLength>2?arguments[2]:undefined;
var endPos=end===undefined?length:toAbsoluteIndex(end,length);
while(endPos>index){O[index++]=value;}
return O;
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-for-each.js":




function node_modulesCoreJsPureInternalsArrayForEachJs(module,exports,__webpack_require__){

var $forEach=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").forEach;
var arrayMethodIsStrict=__webpack_require__(/*! ../internals/array-method-is-strict */"./node_modules/core-js-pure/internals/array-method-is-strict.js");

var STRICT_METHOD=arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports=!STRICT_METHOD?function forEach(callbackfn/* , thisArg */){
return $forEach(this,callbackfn,arguments.length>1?arguments[1]:undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
}:[].forEach;


/***/},

/***/"./node_modules/core-js-pure/internals/array-from.js":




function node_modulesCoreJsPureInternalsArrayFromJs(module,exports,__webpack_require__){

var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var callWithSafeIterationClosing=__webpack_require__(/*! ../internals/call-with-safe-iteration-closing */"./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod=__webpack_require__(/*! ../internals/is-array-iterator-method */"./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var createProperty=__webpack_require__(/*! ../internals/create-property */"./node_modules/core-js-pure/internals/create-property.js");
var getIterator=__webpack_require__(/*! ../internals/get-iterator */"./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod=__webpack_require__(/*! ../internals/get-iterator-method */"./node_modules/core-js-pure/internals/get-iterator-method.js");

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports=function from(arrayLike/* , mapfn = undefined, thisArg = undefined */){
var O=toObject(arrayLike);
var C=typeof this=='function'?this:Array;
var argumentsLength=arguments.length;
var mapfn=argumentsLength>1?arguments[1]:undefined;
var mapping=mapfn!==undefined;
var iteratorMethod=getIteratorMethod(O);
var index=0;
var length,result,step,iterator,next,value;
if(mapping)mapfn=bind(mapfn,argumentsLength>2?arguments[2]:undefined,2);
// if the target is not iterable or it's an array with the default iterator - use a simple case
if(iteratorMethod!=undefined&&!(C==Array&&isArrayIteratorMethod(iteratorMethod))){
iterator=getIterator(O,iteratorMethod);
next=iterator.next;
result=new C();
for(;!(step=next.call(iterator)).done;index++){
value=mapping?callWithSafeIterationClosing(iterator,mapfn,[step.value,index],true):step.value;
createProperty(result,index,value);
}
}else {
length=toLength(O.length);
result=new C(length);
for(;length>index;index++){
value=mapping?mapfn(O[index],index):O[index];
createProperty(result,index,value);
}
}
result.length=index;
return result;
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-includes.js":




function node_modulesCoreJsPureInternalsArrayIncludesJs(module,exports,__webpack_require__){

var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var toAbsoluteIndex=__webpack_require__(/*! ../internals/to-absolute-index */"./node_modules/core-js-pure/internals/to-absolute-index.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod=function createMethod(IS_INCLUDES){
return function($this,el,fromIndex){
var O=toIndexedObject($this);
var length=toLength(O.length);
var index=toAbsoluteIndex(fromIndex,length);
var value;
// Array#includes uses SameValueZero equality algorithm
// eslint-disable-next-line no-self-compare -- NaN check
if(IS_INCLUDES&&el!=el)while(length>index){
value=O[index++];
// eslint-disable-next-line no-self-compare -- NaN check
if(value!=value)return true;
// Array#indexOf ignores holes, Array#includes - not
}else for(;length>index;index++){
if((IS_INCLUDES||index in O)&&O[index]===el)return IS_INCLUDES||index||0;
}return !IS_INCLUDES&&-1;
};
};

module.exports={
// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
includes:createMethod(true),
// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
indexOf:createMethod(false)};



/***/},

/***/"./node_modules/core-js-pure/internals/array-iteration.js":




function node_modulesCoreJsPureInternalsArrayIterationJs(module,exports,__webpack_require__){

var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var IndexedObject=__webpack_require__(/*! ../internals/indexed-object */"./node_modules/core-js-pure/internals/indexed-object.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var arraySpeciesCreate=__webpack_require__(/*! ../internals/array-species-create */"./node_modules/core-js-pure/internals/array-species-create.js");

var push=[].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod=function createMethod(TYPE){
var IS_MAP=TYPE==1;
var IS_FILTER=TYPE==2;
var IS_SOME=TYPE==3;
var IS_EVERY=TYPE==4;
var IS_FIND_INDEX=TYPE==6;
var IS_FILTER_REJECT=TYPE==7;
var NO_HOLES=TYPE==5||IS_FIND_INDEX;
return function($this,callbackfn,that,specificCreate){
var O=toObject($this);
var self=IndexedObject(O);
var boundFunction=bind(callbackfn,that,3);
var length=toLength(self.length);
var index=0;
var create=specificCreate||arraySpeciesCreate;
var target=IS_MAP?create($this,length):IS_FILTER||IS_FILTER_REJECT?create($this,0):undefined;
var value,result;
for(;length>index;index++){if(NO_HOLES||index in self){
value=self[index];
result=boundFunction(value,index,O);
if(TYPE){
if(IS_MAP)target[index]=result;// map
else if(result)switch(TYPE){
case 3:return true;// some
case 5:return value;// find
case 6:return index;// findIndex
case 2:push.call(target,value);// filter
}else switch(TYPE){
case 4:return false;// every
case 7:push.call(target,value);// filterReject
}
}
}}
return IS_FIND_INDEX?-1:IS_SOME||IS_EVERY?IS_EVERY:target;
};
};

module.exports={
// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
forEach:createMethod(0),
// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
map:createMethod(1),
// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
filter:createMethod(2),
// `Array.prototype.some` method
// https://tc39.es/ecma262/#sec-array.prototype.some
some:createMethod(3),
// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
every:createMethod(4),
// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
find:createMethod(5),
// `Array.prototype.findIndex` method
// https://tc39.es/ecma262/#sec-array.prototype.findIndex
findIndex:createMethod(6),
// `Array.prototype.filterReject` method
// https://github.com/tc39/proposal-array-filtering
filterReject:createMethod(7)};



/***/},

/***/"./node_modules/core-js-pure/internals/array-method-has-species-support.js":




function node_modulesCoreJsPureInternalsArrayMethodHasSpeciesSupportJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION=__webpack_require__(/*! ../internals/engine-v8-version */"./node_modules/core-js-pure/internals/engine-v8-version.js");

var SPECIES=wellKnownSymbol('species');

module.exports=function(METHOD_NAME){
// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/677
return V8_VERSION>=51||!fails(function(){
var array=[];
var constructor=array.constructor={};
constructor[SPECIES]=function(){
return {foo:1};
};
return array[METHOD_NAME](Boolean).foo!==1;
});
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-method-is-strict.js":




function node_modulesCoreJsPureInternalsArrayMethodIsStrictJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

module.exports=function(METHOD_NAME,argument){
var method=[][METHOD_NAME];
return !!method&&fails(function(){
// eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
method.call(null,argument||function(){throw 1;},1);
});
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-reduce.js":




function node_modulesCoreJsPureInternalsArrayReduceJs(module,exports,__webpack_require__){

var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var IndexedObject=__webpack_require__(/*! ../internals/indexed-object */"./node_modules/core-js-pure/internals/indexed-object.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod=function createMethod(IS_RIGHT){
return function(that,callbackfn,argumentsLength,memo){
aFunction(callbackfn);
var O=toObject(that);
var self=IndexedObject(O);
var length=toLength(O.length);
var index=IS_RIGHT?length-1:0;
var i=IS_RIGHT?-1:1;
if(argumentsLength<2)while(true){
if(index in self){
memo=self[index];
index+=i;
break;
}
index+=i;
if(IS_RIGHT?index<0:length<=index){
throw TypeError('Reduce of empty array with no initial value');
}
}
for(;IS_RIGHT?index>=0:length>index;index+=i){if(index in self){
memo=callbackfn(memo,self[index],index,O);
}}
return memo;
};
};

module.exports={
// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
left:createMethod(false),
// `Array.prototype.reduceRight` method
// https://tc39.es/ecma262/#sec-array.prototype.reduceright
right:createMethod(true)};



/***/},

/***/"./node_modules/core-js-pure/internals/array-species-constructor.js":




function node_modulesCoreJsPureInternalsArraySpeciesConstructorJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES=wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports=function(originalArray){
var C;
if(isArray(originalArray)){
C=originalArray.constructor;
// cross-realm fallback
if(typeof C=='function'&&(C===Array||isArray(C.prototype)))C=undefined;else
if(isObject(C)){
C=C[SPECIES];
if(C===null)C=undefined;
}
}return C===undefined?Array:C;
};


/***/},

/***/"./node_modules/core-js-pure/internals/array-species-create.js":




function node_modulesCoreJsPureInternalsArraySpeciesCreateJs(module,exports,__webpack_require__){

var arraySpeciesConstructor=__webpack_require__(/*! ../internals/array-species-constructor */"./node_modules/core-js-pure/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports=function(originalArray,length){
return new(arraySpeciesConstructor(originalArray))(length===0?0:length);
};


/***/},

/***/"./node_modules/core-js-pure/internals/call-with-safe-iteration-closing.js":




function node_modulesCoreJsPureInternalsCallWithSafeIterationClosingJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var iteratorClose=__webpack_require__(/*! ../internals/iterator-close */"./node_modules/core-js-pure/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports=function(iterator,fn,value,ENTRIES){
try{
return ENTRIES?fn(anObject(value)[0],value[1]):fn(value);
}catch(error){
iteratorClose(iterator,'throw',error);
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/check-correctness-of-iteration.js":




function node_modulesCoreJsPureInternalsCheckCorrectnessOfIterationJs(module,exports,__webpack_require__){

var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR=wellKnownSymbol('iterator');
var SAFE_CLOSING=false;

try{
var called=0;
var iteratorWithReturn={
next:function next(){
return {done:!!called++};
},
'return':function _return(){
SAFE_CLOSING=true;
}};

iteratorWithReturn[ITERATOR]=function(){
return this;
};
// eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
Array.from(iteratorWithReturn,function(){throw 2;});
}catch(error){/* empty */}

module.exports=function(exec,SKIP_CLOSING){
if(!SKIP_CLOSING&&!SAFE_CLOSING)return false;
var ITERATION_SUPPORT=false;
try{
var object={};
object[ITERATOR]=function(){
return {
next:function next(){
return {done:ITERATION_SUPPORT=true};
}};

};
exec(object);
}catch(error){/* empty */}
return ITERATION_SUPPORT;
};


/***/},

/***/"./node_modules/core-js-pure/internals/classof-raw.js":




function node_modulesCoreJsPureInternalsClassofRawJs(module,exports){

var toString={}.toString;

module.exports=function(it){
return toString.call(it).slice(8,-1);
};


/***/},

/***/"./node_modules/core-js-pure/internals/classof.js":




function node_modulesCoreJsPureInternalsClassofJs(module,exports,__webpack_require__){

var TO_STRING_TAG_SUPPORT=__webpack_require__(/*! ../internals/to-string-tag-support */"./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classofRaw=__webpack_require__(/*! ../internals/classof-raw */"./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG=wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS=classofRaw(function(){return arguments;}())=='Arguments';

// fallback for IE11 Script Access Denied error
var tryGet=function tryGet(it,key){
try{
return it[key];
}catch(error){/* empty */}
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports=TO_STRING_TAG_SUPPORT?classofRaw:function(it){
var O,tag,result;
return it===undefined?'Undefined':it===null?'Null'
// @@toStringTag case
:typeof(tag=tryGet(O=Object(it),TO_STRING_TAG))=='string'?tag
// builtinTag case
:CORRECT_ARGUMENTS?classofRaw(O)
// ES3 arguments fallback
:(result=classofRaw(O))=='Object'&&typeof O.callee=='function'?'Arguments':result;
};


/***/},

/***/"./node_modules/core-js-pure/internals/collection-strong.js":




function node_modulesCoreJsPureInternalsCollectionStrongJs(module,exports,__webpack_require__){

var defineProperty=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js").f;
var create=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");
var redefineAll=__webpack_require__(/*! ../internals/redefine-all */"./node_modules/core-js-pure/internals/redefine-all.js");
var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var anInstance=__webpack_require__(/*! ../internals/an-instance */"./node_modules/core-js-pure/internals/an-instance.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");
var defineIterator=__webpack_require__(/*! ../internals/define-iterator */"./node_modules/core-js-pure/internals/define-iterator.js");
var setSpecies=__webpack_require__(/*! ../internals/set-species */"./node_modules/core-js-pure/internals/set-species.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var fastKey=__webpack_require__(/*! ../internals/internal-metadata */"./node_modules/core-js-pure/internals/internal-metadata.js").fastKey;
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");

var setInternalState=InternalStateModule.set;
var internalStateGetterFor=InternalStateModule.getterFor;

module.exports={
getConstructor:function getConstructor(wrapper,CONSTRUCTOR_NAME,IS_MAP,ADDER){
var C=wrapper(function(that,iterable){
anInstance(that,C,CONSTRUCTOR_NAME);
setInternalState(that,{
type:CONSTRUCTOR_NAME,
index:create(null),
first:undefined,
last:undefined,
size:0});

if(!DESCRIPTORS)that.size=0;
if(iterable!=undefined)iterate(iterable,that[ADDER],{that:that,AS_ENTRIES:IS_MAP});
});

var getInternalState=internalStateGetterFor(CONSTRUCTOR_NAME);

var define=function define(that,key,value){
var state=getInternalState(that);
var entry=getEntry(that,key);
var previous,index;
// change existing entry
if(entry){
entry.value=value;
// create new entry
}else {
state.last=entry={
index:index=fastKey(key,true),
key:key,
value:value,
previous:previous=state.last,
next:undefined,
removed:false};

if(!state.first)state.first=entry;
if(previous)previous.next=entry;
if(DESCRIPTORS)state.size++;else
that.size++;
// add to index
if(index!=='F')state.index[index]=entry;
}return that;
};

var getEntry=function getEntry(that,key){
var state=getInternalState(that);
// fast case
var index=fastKey(key);
var entry;
if(index!=='F')return state.index[index];
// frozen object case
for(entry=state.first;entry;entry=entry.next){
if(entry.key==key)return entry;
}
};

redefineAll(C.prototype,{
// `{ Map, Set }.prototype.clear()` methods
// https://tc39.es/ecma262/#sec-map.prototype.clear
// https://tc39.es/ecma262/#sec-set.prototype.clear
clear:function clear(){
var that=this;
var state=getInternalState(that);
var data=state.index;
var entry=state.first;
while(entry){
entry.removed=true;
if(entry.previous)entry.previous=entry.previous.next=undefined;
delete data[entry.index];
entry=entry.next;
}
state.first=state.last=undefined;
if(DESCRIPTORS)state.size=0;else
that.size=0;
},
// `{ Map, Set }.prototype.delete(key)` methods
// https://tc39.es/ecma262/#sec-map.prototype.delete
// https://tc39.es/ecma262/#sec-set.prototype.delete
'delete':function _delete(key){
var that=this;
var state=getInternalState(that);
var entry=getEntry(that,key);
if(entry){
var next=entry.next;
var prev=entry.previous;
delete state.index[entry.index];
entry.removed=true;
if(prev)prev.next=next;
if(next)next.previous=prev;
if(state.first==entry)state.first=next;
if(state.last==entry)state.last=prev;
if(DESCRIPTORS)state.size--;else
that.size--;
}return !!entry;
},
// `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
// https://tc39.es/ecma262/#sec-map.prototype.foreach
// https://tc39.es/ecma262/#sec-set.prototype.foreach
forEach:function forEach(callbackfn/* , that = undefined */){
var state=getInternalState(this);
var boundFunction=bind(callbackfn,arguments.length>1?arguments[1]:undefined,3);
var entry;
while(entry=entry?entry.next:state.first){
boundFunction(entry.value,entry.key,this);
// revert to the last existing entry
while(entry&&entry.removed){entry=entry.previous;}
}
},
// `{ Map, Set}.prototype.has(key)` methods
// https://tc39.es/ecma262/#sec-map.prototype.has
// https://tc39.es/ecma262/#sec-set.prototype.has
has:function has(key){
return !!getEntry(this,key);
}});


redefineAll(C.prototype,IS_MAP?{
// `Map.prototype.get(key)` method
// https://tc39.es/ecma262/#sec-map.prototype.get
get:function get(key){
var entry=getEntry(this,key);
return entry&&entry.value;
},
// `Map.prototype.set(key, value)` method
// https://tc39.es/ecma262/#sec-map.prototype.set
set:function set(key,value){
return define(this,key===0?0:key,value);
}}:
{
// `Set.prototype.add(value)` method
// https://tc39.es/ecma262/#sec-set.prototype.add
add:function add(value){
return define(this,value=value===0?0:value,value);
}});

if(DESCRIPTORS)defineProperty(C.prototype,'size',{
get:function get(){
return getInternalState(this).size;
}});

return C;
},
setStrong:function setStrong(C,CONSTRUCTOR_NAME,IS_MAP){
var ITERATOR_NAME=CONSTRUCTOR_NAME+' Iterator';
var getInternalCollectionState=internalStateGetterFor(CONSTRUCTOR_NAME);
var getInternalIteratorState=internalStateGetterFor(ITERATOR_NAME);
// `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
// https://tc39.es/ecma262/#sec-map.prototype.entries
// https://tc39.es/ecma262/#sec-map.prototype.keys
// https://tc39.es/ecma262/#sec-map.prototype.values
// https://tc39.es/ecma262/#sec-map.prototype-@@iterator
// https://tc39.es/ecma262/#sec-set.prototype.entries
// https://tc39.es/ecma262/#sec-set.prototype.keys
// https://tc39.es/ecma262/#sec-set.prototype.values
// https://tc39.es/ecma262/#sec-set.prototype-@@iterator
defineIterator(C,CONSTRUCTOR_NAME,function(iterated,kind){
setInternalState(this,{
type:ITERATOR_NAME,
target:iterated,
state:getInternalCollectionState(iterated),
kind:kind,
last:undefined});

},function(){
var state=getInternalIteratorState(this);
var kind=state.kind;
var entry=state.last;
// revert to the last existing entry
while(entry&&entry.removed){entry=entry.previous;}
// get next entry
if(!state.target||!(state.last=entry=entry?entry.next:state.state.first)){
// or finish the iteration
state.target=undefined;
return {value:undefined,done:true};
}
// return step by kind
if(kind=='keys')return {value:entry.key,done:false};
if(kind=='values')return {value:entry.value,done:false};
return {value:[entry.key,entry.value],done:false};
},IS_MAP?'entries':'values',!IS_MAP,true);

// `{ Map, Set }.prototype[@@species]` accessors
// https://tc39.es/ecma262/#sec-get-map-@@species
// https://tc39.es/ecma262/#sec-get-set-@@species
setSpecies(CONSTRUCTOR_NAME);
}};



/***/},

/***/"./node_modules/core-js-pure/internals/collection.js":




function node_modulesCoreJsPureInternalsCollectionJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ./export */"./node_modules/core-js-pure/internals/export.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var InternalMetadataModule=__webpack_require__(/*! ../internals/internal-metadata */"./node_modules/core-js-pure/internals/internal-metadata.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");
var anInstance=__webpack_require__(/*! ../internals/an-instance */"./node_modules/core-js-pure/internals/an-instance.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");
var defineProperty=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js").f;
var forEach=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").forEach;
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");

var setInternalState=InternalStateModule.set;
var internalStateGetterFor=InternalStateModule.getterFor;

module.exports=function(CONSTRUCTOR_NAME,wrapper,common){
var IS_MAP=CONSTRUCTOR_NAME.indexOf('Map')!==-1;
var IS_WEAK=CONSTRUCTOR_NAME.indexOf('Weak')!==-1;
var ADDER=IS_MAP?'set':'add';
var NativeConstructor=global[CONSTRUCTOR_NAME];
var NativePrototype=NativeConstructor&&NativeConstructor.prototype;
var exported={};
var Constructor;

if(!DESCRIPTORS||typeof NativeConstructor!='function'||
!(IS_WEAK||NativePrototype.forEach&&!fails(function(){new NativeConstructor().entries().next();})))
{
// create collection constructor
Constructor=common.getConstructor(wrapper,CONSTRUCTOR_NAME,IS_MAP,ADDER);
InternalMetadataModule.enable();
}else {
Constructor=wrapper(function(target,iterable){
setInternalState(anInstance(target,Constructor,CONSTRUCTOR_NAME),{
type:CONSTRUCTOR_NAME,
collection:new NativeConstructor()});

if(iterable!=undefined)iterate(iterable,target[ADDER],{that:target,AS_ENTRIES:IS_MAP});
});

var getInternalState=internalStateGetterFor(CONSTRUCTOR_NAME);

forEach(['add','clear','delete','forEach','get','has','set','keys','values','entries'],function(KEY){
var IS_ADDER=KEY=='add'||KEY=='set';
if(KEY in NativePrototype&&!(IS_WEAK&&KEY=='clear')){
createNonEnumerableProperty(Constructor.prototype,KEY,function(a,b){
var collection=getInternalState(this).collection;
if(!IS_ADDER&&IS_WEAK&&!isObject(a))return KEY=='get'?undefined:false;
var result=collection[KEY](a===0?0:a,b);
return IS_ADDER?this:result;
});
}
});

IS_WEAK||defineProperty(Constructor.prototype,'size',{
configurable:true,
get:function get(){
return getInternalState(this).collection.size;
}});

}

setToStringTag(Constructor,CONSTRUCTOR_NAME,false,true);

exported[CONSTRUCTOR_NAME]=Constructor;
$({global:true,forced:true},exported);

if(!IS_WEAK)common.setStrong(Constructor,CONSTRUCTOR_NAME,IS_MAP);

return Constructor;
};


/***/},

/***/"./node_modules/core-js-pure/internals/correct-is-regexp-logic.js":




function node_modulesCoreJsPureInternalsCorrectIsRegexpLogicJs(module,exports,__webpack_require__){

var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var MATCH=wellKnownSymbol('match');

module.exports=function(METHOD_NAME){
var regexp=/./;
try{
'/./'[METHOD_NAME](regexp);
}catch(error1){
try{
regexp[MATCH]=false;
return '/./'[METHOD_NAME](regexp);
}catch(error2){/* empty */}
}return false;
};


/***/},

/***/"./node_modules/core-js-pure/internals/correct-prototype-getter.js":




function node_modulesCoreJsPureInternalsCorrectPrototypeGetterJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

module.exports=!fails(function(){
function F(){/* empty */}
F.prototype.constructor=null;
// eslint-disable-next-line es/no-object-getprototypeof -- required for testing
return Object.getPrototypeOf(new F())!==F.prototype;
});


/***/},

/***/"./node_modules/core-js-pure/internals/create-iterator-constructor.js":




function node_modulesCoreJsPureInternalsCreateIteratorConstructorJs(module,exports,__webpack_require__){

var IteratorPrototype=__webpack_require__(/*! ../internals/iterators-core */"./node_modules/core-js-pure/internals/iterators-core.js").IteratorPrototype;
var create=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");

var returnThis=function returnThis(){return this;};

module.exports=function(IteratorConstructor,NAME,next){
var TO_STRING_TAG=NAME+' Iterator';
IteratorConstructor.prototype=create(IteratorPrototype,{next:createPropertyDescriptor(1,next)});
setToStringTag(IteratorConstructor,TO_STRING_TAG,false,true);
Iterators[TO_STRING_TAG]=returnThis;
return IteratorConstructor;
};


/***/},

/***/"./node_modules/core-js-pure/internals/create-non-enumerable-property.js":




function node_modulesCoreJsPureInternalsCreateNonEnumerablePropertyJs(module,exports,__webpack_require__){

var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports=DESCRIPTORS?function(object,key,value){
return definePropertyModule.f(object,key,createPropertyDescriptor(1,value));
}:function(object,key,value){
object[key]=value;
return object;
};


/***/},

/***/"./node_modules/core-js-pure/internals/create-property-descriptor.js":




function node_modulesCoreJsPureInternalsCreatePropertyDescriptorJs(module,exports){

module.exports=function(bitmap,value){
return {
enumerable:!(bitmap&1),
configurable:!(bitmap&2),
writable:!(bitmap&4),
value:value};

};


/***/},

/***/"./node_modules/core-js-pure/internals/create-property.js":




function node_modulesCoreJsPureInternalsCreatePropertyJs(module,exports,__webpack_require__){

var toPropertyKey=__webpack_require__(/*! ../internals/to-property-key */"./node_modules/core-js-pure/internals/to-property-key.js");
var definePropertyModule=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");

module.exports=function(object,key,value){
var propertyKey=toPropertyKey(key);
if(propertyKey in object)definePropertyModule.f(object,propertyKey,createPropertyDescriptor(0,value));else
object[propertyKey]=value;
};


/***/},

/***/"./node_modules/core-js-pure/internals/define-iterator.js":




function node_modulesCoreJsPureInternalsDefineIteratorJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var createIteratorConstructor=__webpack_require__(/*! ../internals/create-iterator-constructor */"./node_modules/core-js-pure/internals/create-iterator-constructor.js");
var getPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf=__webpack_require__(/*! ../internals/object-set-prototype-of */"./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var redefine=__webpack_require__(/*! ../internals/redefine */"./node_modules/core-js-pure/internals/redefine.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");
var IteratorsCore=__webpack_require__(/*! ../internals/iterators-core */"./node_modules/core-js-pure/internals/iterators-core.js");

var IteratorPrototype=IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS=IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR=wellKnownSymbol('iterator');
var KEYS='keys';
var VALUES='values';
var ENTRIES='entries';

var returnThis=function returnThis(){return this;};

module.exports=function(Iterable,NAME,IteratorConstructor,next,DEFAULT,IS_SET,FORCED){
createIteratorConstructor(IteratorConstructor,NAME,next);

var getIterationMethod=function getIterationMethod(KIND){
if(KIND===DEFAULT&&defaultIterator)return defaultIterator;
if(!BUGGY_SAFARI_ITERATORS&&KIND in IterablePrototype)return IterablePrototype[KIND];
switch(KIND){
case KEYS:return function keys(){return new IteratorConstructor(this,KIND);};
case VALUES:return function values(){return new IteratorConstructor(this,KIND);};
case ENTRIES:return function entries(){return new IteratorConstructor(this,KIND);};}
return function(){return new IteratorConstructor(this);};
};

var TO_STRING_TAG=NAME+' Iterator';
var INCORRECT_VALUES_NAME=false;
var IterablePrototype=Iterable.prototype;
var nativeIterator=IterablePrototype[ITERATOR]||
IterablePrototype['@@iterator']||
DEFAULT&&IterablePrototype[DEFAULT];
var defaultIterator=!BUGGY_SAFARI_ITERATORS&&nativeIterator||getIterationMethod(DEFAULT);
var anyNativeIterator=NAME=='Array'?IterablePrototype.entries||nativeIterator:nativeIterator;
var CurrentIteratorPrototype,methods,KEY;

// fix native
if(anyNativeIterator){
CurrentIteratorPrototype=getPrototypeOf(anyNativeIterator.call(new Iterable()));
if(IteratorPrototype!==Object.prototype&&CurrentIteratorPrototype.next){
if(!IS_PURE&&getPrototypeOf(CurrentIteratorPrototype)!==IteratorPrototype){
if(setPrototypeOf){
setPrototypeOf(CurrentIteratorPrototype,IteratorPrototype);
}else if(typeof CurrentIteratorPrototype[ITERATOR]!='function'){
createNonEnumerableProperty(CurrentIteratorPrototype,ITERATOR,returnThis);
}
}
// Set @@toStringTag to native iterators
setToStringTag(CurrentIteratorPrototype,TO_STRING_TAG,true,true);
if(IS_PURE)Iterators[TO_STRING_TAG]=returnThis;
}
}

// fix Array.prototype.{ values, @@iterator }.name in V8 / FF
if(DEFAULT==VALUES&&nativeIterator&&nativeIterator.name!==VALUES){
INCORRECT_VALUES_NAME=true;
defaultIterator=function values(){return nativeIterator.call(this);};
}

// define iterator
if((!IS_PURE||FORCED)&&IterablePrototype[ITERATOR]!==defaultIterator){
createNonEnumerableProperty(IterablePrototype,ITERATOR,defaultIterator);
}
Iterators[NAME]=defaultIterator;

// export additional methods
if(DEFAULT){
methods={
values:getIterationMethod(VALUES),
keys:IS_SET?defaultIterator:getIterationMethod(KEYS),
entries:getIterationMethod(ENTRIES)};

if(FORCED)for(KEY in methods){
if(BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME||!(KEY in IterablePrototype)){
redefine(IterablePrototype,KEY,methods[KEY]);
}
}else $({target:NAME,proto:true,forced:BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME},methods);
}

return methods;
};


/***/},

/***/"./node_modules/core-js-pure/internals/define-well-known-symbol.js":




function node_modulesCoreJsPureInternalsDefineWellKnownSymbolJs(module,exports,__webpack_require__){

var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var wrappedWellKnownSymbolModule=__webpack_require__(/*! ../internals/well-known-symbol-wrapped */"./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js");
var defineProperty=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js").f;

module.exports=function(NAME){
var Symbol=path.Symbol||(path.Symbol={});
if(!has(Symbol,NAME))defineProperty(Symbol,NAME,{
value:wrappedWellKnownSymbolModule.f(NAME)});

};


/***/},

/***/"./node_modules/core-js-pure/internals/descriptors.js":




function node_modulesCoreJsPureInternalsDescriptorsJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports=!fails(function(){
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
return Object.defineProperty({},1,{get:function get(){return 7;}})[1]!=7;
});


/***/},

/***/"./node_modules/core-js-pure/internals/document-create-element.js":




function node_modulesCoreJsPureInternalsDocumentCreateElementJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");

var document=global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS=isObject(document)&&isObject(document.createElement);

module.exports=function(it){
return EXISTS?document.createElement(it):{};
};


/***/},

/***/"./node_modules/core-js-pure/internals/dom-iterables.js":




function node_modulesCoreJsPureInternalsDomIterablesJs(module,exports){

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports={
CSSRuleList:0,
CSSStyleDeclaration:0,
CSSValueList:0,
ClientRectList:0,
DOMRectList:0,
DOMStringList:0,
DOMTokenList:1,
DataTransferItemList:0,
FileList:0,
HTMLAllCollection:0,
HTMLCollection:0,
HTMLFormElement:0,
HTMLSelectElement:0,
MediaList:0,
MimeTypeArray:0,
NamedNodeMap:0,
NodeList:1,
PaintRequestList:0,
Plugin:0,
PluginArray:0,
SVGLengthList:0,
SVGNumberList:0,
SVGPathSegList:0,
SVGPointList:0,
SVGStringList:0,
SVGTransformList:0,
SourceBufferList:0,
StyleSheetList:0,
TextTrackCueList:0,
TextTrackList:0,
TouchList:0};



/***/},

/***/"./node_modules/core-js-pure/internals/engine-is-browser.js":




function node_modulesCoreJsPureInternalsEngineIsBrowserJs(module,exports){

module.exports=typeof window=='object';


/***/},

/***/"./node_modules/core-js-pure/internals/engine-is-ios-pebble.js":




function node_modulesCoreJsPureInternalsEngineIsIosPebbleJs(module,exports,__webpack_require__){

var userAgent=__webpack_require__(/*! ../internals/engine-user-agent */"./node_modules/core-js-pure/internals/engine-user-agent.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

module.exports=/ipad|iphone|ipod/i.test(userAgent)&&global.Pebble!==undefined;


/***/},

/***/"./node_modules/core-js-pure/internals/engine-is-ios.js":




function node_modulesCoreJsPureInternalsEngineIsIosJs(module,exports,__webpack_require__){

var userAgent=__webpack_require__(/*! ../internals/engine-user-agent */"./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/},

/***/"./node_modules/core-js-pure/internals/engine-is-node.js":




function node_modulesCoreJsPureInternalsEngineIsNodeJs(module,exports,__webpack_require__){

var classof=__webpack_require__(/*! ../internals/classof-raw */"./node_modules/core-js-pure/internals/classof-raw.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

module.exports=classof(global.process)=='process';


/***/},

/***/"./node_modules/core-js-pure/internals/engine-is-webos-webkit.js":




function node_modulesCoreJsPureInternalsEngineIsWebosWebkitJs(module,exports,__webpack_require__){

var userAgent=__webpack_require__(/*! ../internals/engine-user-agent */"./node_modules/core-js-pure/internals/engine-user-agent.js");

module.exports=/web0s(?!.*chrome)/i.test(userAgent);


/***/},

/***/"./node_modules/core-js-pure/internals/engine-user-agent.js":




function node_modulesCoreJsPureInternalsEngineUserAgentJs(module,exports,__webpack_require__){

var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");

module.exports=getBuiltIn('navigator','userAgent')||'';


/***/},

/***/"./node_modules/core-js-pure/internals/engine-v8-version.js":




function node_modulesCoreJsPureInternalsEngineV8VersionJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var userAgent=__webpack_require__(/*! ../internals/engine-user-agent */"./node_modules/core-js-pure/internals/engine-user-agent.js");

var process=global.process;
var Deno=global.Deno;
var versions=process&&process.versions||Deno&&Deno.version;
var v8=versions&&versions.v8;
var match,version;

if(v8){
match=v8.split('.');
version=match[0]<4?1:match[0]+match[1];
}else if(userAgent){
match=userAgent.match(/Edge\/(\d+)/);
if(!match||match[1]>=74){
match=userAgent.match(/Chrome\/(\d+)/);
if(match)version=match[1];
}
}

module.exports=version&&+version;


/***/},

/***/"./node_modules/core-js-pure/internals/entry-virtual.js":




function node_modulesCoreJsPureInternalsEntryVirtualJs(module,exports,__webpack_require__){

var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");

module.exports=function(CONSTRUCTOR){
return path[CONSTRUCTOR+'Prototype'];
};


/***/},

/***/"./node_modules/core-js-pure/internals/enum-bug-keys.js":




function node_modulesCoreJsPureInternalsEnumBugKeysJs(module,exports){

// IE8- don't enum bug keys
module.exports=[
'constructor',
'hasOwnProperty',
'isPrototypeOf',
'propertyIsEnumerable',
'toLocaleString',
'toString',
'valueOf'];



/***/},

/***/"./node_modules/core-js-pure/internals/export.js":




function node_modulesCoreJsPureInternalsExportJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var getOwnPropertyDescriptor=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;
var isForced=__webpack_require__(/*! ../internals/is-forced */"./node_modules/core-js-pure/internals/is-forced.js");
var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");
var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");

var wrapConstructor=function wrapConstructor(NativeConstructor){
var Wrapper=function Wrapper(a,b,c){
if(this instanceof NativeConstructor){
switch(arguments.length){
case 0:return new NativeConstructor();
case 1:return new NativeConstructor(a);
case 2:return new NativeConstructor(a,b);}
return new NativeConstructor(a,b,c);
}return NativeConstructor.apply(this,arguments);
};
Wrapper.prototype=NativeConstructor.prototype;
return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports=function(options,source){
var TARGET=options.target;
var GLOBAL=options.global;
var STATIC=options.stat;
var PROTO=options.proto;

var nativeSource=GLOBAL?global:STATIC?global[TARGET]:(global[TARGET]||{}).prototype;

var target=GLOBAL?path:path[TARGET]||createNonEnumerableProperty(path,TARGET,{})[TARGET];
var targetPrototype=target.prototype;

var FORCED,USE_NATIVE,VIRTUAL_PROTOTYPE;
var key,sourceProperty,targetProperty,nativeProperty,resultProperty,descriptor;

for(key in source){
FORCED=isForced(GLOBAL?key:TARGET+(STATIC?'.':'#')+key,options.forced);
// contains in native
USE_NATIVE=!FORCED&&nativeSource&&has(nativeSource,key);

targetProperty=target[key];

if(USE_NATIVE)if(options.noTargetGet){
descriptor=getOwnPropertyDescriptor(nativeSource,key);
nativeProperty=descriptor&&descriptor.value;
}else nativeProperty=nativeSource[key];

// export native or implementation
sourceProperty=USE_NATIVE&&nativeProperty?nativeProperty:source[key];

if(USE_NATIVE&&typeof targetProperty===typeof sourceProperty)continue;

// bind timers to global for call from export context
if(options.bind&&USE_NATIVE)resultProperty=bind(sourceProperty,global);
// wrap global constructors for prevent changs in this version
else if(options.wrap&&USE_NATIVE)resultProperty=wrapConstructor(sourceProperty);
// make static versions for prototype methods
else if(PROTO&&typeof sourceProperty=='function')resultProperty=bind(Function.call,sourceProperty);
// default case
else resultProperty=sourceProperty;

// add a flag to not completely full polyfills
if(options.sham||sourceProperty&&sourceProperty.sham||targetProperty&&targetProperty.sham){
createNonEnumerableProperty(resultProperty,'sham',true);
}

createNonEnumerableProperty(target,key,resultProperty);

if(PROTO){
VIRTUAL_PROTOTYPE=TARGET+'Prototype';
if(!has(path,VIRTUAL_PROTOTYPE)){
createNonEnumerableProperty(path,VIRTUAL_PROTOTYPE,{});
}
// export virtual prototype methods
createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE],key,sourceProperty);
// export real prototype methods
if(options.real&&targetPrototype&&!targetPrototype[key]){
createNonEnumerableProperty(targetPrototype,key,sourceProperty);
}
}
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/fails.js":




function node_modulesCoreJsPureInternalsFailsJs(module,exports){

module.exports=function(exec){
try{
return !!exec();
}catch(error){
return true;
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/freezing.js":




function node_modulesCoreJsPureInternalsFreezingJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

module.exports=!fails(function(){
// eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
return Object.isExtensible(Object.preventExtensions({}));
});


/***/},

/***/"./node_modules/core-js-pure/internals/function-bind-context.js":




function node_modulesCoreJsPureInternalsFunctionBindContextJs(module,exports,__webpack_require__){

var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");

// optional / simple context binding
module.exports=function(fn,that,length){
aFunction(fn);
if(that===undefined)return fn;
switch(length){
case 0:return function(){
return fn.call(that);
};
case 1:return function(a){
return fn.call(that,a);
};
case 2:return function(a,b){
return fn.call(that,a,b);
};
case 3:return function(a,b,c){
return fn.call(that,a,b,c);
};}

return function(){
return fn.apply(that,arguments);
};
};


/***/},

/***/"./node_modules/core-js-pure/internals/function-bind.js":




function node_modulesCoreJsPureInternalsFunctionBindJs(module,exports,__webpack_require__){

var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");

var slice=[].slice;
var factories={};

var construct=function construct(C,argsLength,args){
if(!(argsLength in factories)){
for(var list=[],i=0;i<argsLength;i++){list[i]='a['+i+']';}
// eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
factories[argsLength]=Function('C,a','return new C('+list.join(',')+')');
}return factories[argsLength](C,args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports=Function.bind||function bind(that/* , ...args */){
var fn=aFunction(this);
var partArgs=slice.call(arguments,1);
var boundFunction=function bound(){
var args=partArgs.concat(slice.call(arguments));
return this instanceof boundFunction?construct(fn,args.length,args):fn.apply(that,args);
};
if(isObject(fn.prototype))boundFunction.prototype=fn.prototype;
return boundFunction;
};


/***/},

/***/"./node_modules/core-js-pure/internals/get-built-in.js":




function node_modulesCoreJsPureInternalsGetBuiltInJs(module,exports,__webpack_require__){

var path=__webpack_require__(/*! ../internals/path */"./node_modules/core-js-pure/internals/path.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

var aFunction=function aFunction(variable){
return typeof variable=='function'?variable:undefined;
};

module.exports=function(namespace,method){
return arguments.length<2?aFunction(path[namespace])||aFunction(global[namespace]):
path[namespace]&&path[namespace][method]||global[namespace]&&global[namespace][method];
};


/***/},

/***/"./node_modules/core-js-pure/internals/get-iterator-method.js":




function node_modulesCoreJsPureInternalsGetIteratorMethodJs(module,exports,__webpack_require__){

var classof=__webpack_require__(/*! ../internals/classof */"./node_modules/core-js-pure/internals/classof.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var ITERATOR=wellKnownSymbol('iterator');

module.exports=function(it){
if(it!=undefined)return it[ITERATOR]||
it['@@iterator']||
Iterators[classof(it)];
};


/***/},

/***/"./node_modules/core-js-pure/internals/get-iterator.js":




function node_modulesCoreJsPureInternalsGetIteratorJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var getIteratorMethod=__webpack_require__(/*! ../internals/get-iterator-method */"./node_modules/core-js-pure/internals/get-iterator-method.js");

module.exports=function(it,usingIterator){
var iteratorMethod=arguments.length<2?getIteratorMethod(it):usingIterator;
if(typeof iteratorMethod!='function'){
throw TypeError(String(it)+' is not iterable');
}return anObject(iteratorMethod.call(it));
};


/***/},

/***/"./node_modules/core-js-pure/internals/global.js":




function node_modulesCoreJsPureInternalsGlobalJs(module,exports,__webpack_require__){

/* WEBPACK VAR INJECTION */(function(global){var check=function check(it){
return it&&it.Math==Math&&it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports=
// eslint-disable-next-line es/no-global-this -- safe
check(typeof globalThis=='object'&&globalThis)||
check(typeof window=='object'&&window)||
// eslint-disable-next-line no-restricted-globals -- safe
check(typeof self=='object'&&self)||
check(typeof global=='object'&&global)||
// eslint-disable-next-line no-new-func -- fallback
function(){return this;}()||Function('return this')();

/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(/*! ./../../webpack/buildin/global.js */"./node_modules/webpack/buildin/global.js"));

/***/},

/***/"./node_modules/core-js-pure/internals/has.js":




function node_modulesCoreJsPureInternalsHasJs(module,exports,__webpack_require__){

var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");

var hasOwnProperty={}.hasOwnProperty;

module.exports=Object.hasOwn||function hasOwn(it,key){
return hasOwnProperty.call(toObject(it),key);
};


/***/},

/***/"./node_modules/core-js-pure/internals/hidden-keys.js":




function node_modulesCoreJsPureInternalsHiddenKeysJs(module,exports){

module.exports={};


/***/},

/***/"./node_modules/core-js-pure/internals/host-report-errors.js":




function node_modulesCoreJsPureInternalsHostReportErrorsJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

module.exports=function(a,b){
var console=global.console;
if(console&&console.error){
arguments.length===1?console.error(a):console.error(a,b);
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/html.js":




function node_modulesCoreJsPureInternalsHtmlJs(module,exports,__webpack_require__){

var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");

module.exports=getBuiltIn('document','documentElement');


/***/},

/***/"./node_modules/core-js-pure/internals/ie8-dom-define.js":




function node_modulesCoreJsPureInternalsIe8DomDefineJs(module,exports,__webpack_require__){

var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var createElement=__webpack_require__(/*! ../internals/document-create-element */"./node_modules/core-js-pure/internals/document-create-element.js");

// Thank's IE8 for his funny defineProperty
module.exports=!DESCRIPTORS&&!fails(function(){
// eslint-disable-next-line es/no-object-defineproperty -- requied for testing
return Object.defineProperty(createElement('div'),'a',{
get:function get(){return 7;}}).
a!=7;
});


/***/},

/***/"./node_modules/core-js-pure/internals/indexed-object.js":




function node_modulesCoreJsPureInternalsIndexedObjectJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var classof=__webpack_require__(/*! ../internals/classof-raw */"./node_modules/core-js-pure/internals/classof-raw.js");

var split=''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports=fails(function(){
// throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
// eslint-disable-next-line no-prototype-builtins -- safe
return !Object('z').propertyIsEnumerable(0);
})?function(it){
return classof(it)=='String'?split.call(it,''):Object(it);
}:Object;


/***/},

/***/"./node_modules/core-js-pure/internals/inspect-source.js":




function node_modulesCoreJsPureInternalsInspectSourceJs(module,exports,__webpack_require__){

var store=__webpack_require__(/*! ../internals/shared-store */"./node_modules/core-js-pure/internals/shared-store.js");

var functionToString=Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if(typeof store.inspectSource!='function'){
store.inspectSource=function(it){
return functionToString.call(it);
};
}

module.exports=store.inspectSource;


/***/},

/***/"./node_modules/core-js-pure/internals/internal-metadata.js":




function node_modulesCoreJsPureInternalsInternalMetadataJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var hiddenKeys=__webpack_require__(/*! ../internals/hidden-keys */"./node_modules/core-js-pure/internals/hidden-keys.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var defineProperty=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js").f;
var getOwnPropertyNamesModule=__webpack_require__(/*! ../internals/object-get-own-property-names */"./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternalModule=__webpack_require__(/*! ../internals/object-get-own-property-names-external */"./node_modules/core-js-pure/internals/object-get-own-property-names-external.js");
var uid=__webpack_require__(/*! ../internals/uid */"./node_modules/core-js-pure/internals/uid.js");
var FREEZING=__webpack_require__(/*! ../internals/freezing */"./node_modules/core-js-pure/internals/freezing.js");

var REQUIRED=false;
var METADATA=uid('meta');
var id=0;

// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible=Object.isExtensible||function(){
return true;
};

var setMetadata=function setMetadata(it){
defineProperty(it,METADATA,{value:{
objectID:'O'+id++,// object ID
weakData:{}// weak collections IDs
}});
};

var fastKey=function fastKey(it,create){
// return a primitive with prefix
if(!isObject(it))return typeof it=='symbol'?it:(typeof it=='string'?'S':'P')+it;
if(!has(it,METADATA)){
// can't set metadata to uncaught frozen object
if(!isExtensible(it))return 'F';
// not necessary to add metadata
if(!create)return 'E';
// add missing metadata
setMetadata(it);
// return object ID
}return it[METADATA].objectID;
};

var getWeakData=function getWeakData(it,create){
if(!has(it,METADATA)){
// can't set metadata to uncaught frozen object
if(!isExtensible(it))return true;
// not necessary to add metadata
if(!create)return false;
// add missing metadata
setMetadata(it);
// return the store of weak collections IDs
}return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze=function onFreeze(it){
if(FREEZING&&REQUIRED&&isExtensible(it)&&!has(it,METADATA))setMetadata(it);
return it;
};

var enable=function enable(){
meta.enable=function(){/* empty */};
REQUIRED=true;
var getOwnPropertyNames=getOwnPropertyNamesModule.f;
var splice=[].splice;
var test={};
test[METADATA]=1;

// prevent exposing of metadata key
if(getOwnPropertyNames(test).length){
getOwnPropertyNamesModule.f=function(it){
var result=getOwnPropertyNames(it);
for(var i=0,length=result.length;i<length;i++){
if(result[i]===METADATA){
splice.call(result,i,1);
break;
}
}return result;
};

$({target:'Object',stat:true,forced:true},{
getOwnPropertyNames:getOwnPropertyNamesExternalModule.f});

}
};

var meta=module.exports={
enable:enable,
fastKey:fastKey,
getWeakData:getWeakData,
onFreeze:onFreeze};


hiddenKeys[METADATA]=true;


/***/},

/***/"./node_modules/core-js-pure/internals/internal-state.js":




function node_modulesCoreJsPureInternalsInternalStateJs(module,exports,__webpack_require__){

var NATIVE_WEAK_MAP=__webpack_require__(/*! ../internals/native-weak-map */"./node_modules/core-js-pure/internals/native-weak-map.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var objectHas=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var shared=__webpack_require__(/*! ../internals/shared-store */"./node_modules/core-js-pure/internals/shared-store.js");
var sharedKey=__webpack_require__(/*! ../internals/shared-key */"./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys=__webpack_require__(/*! ../internals/hidden-keys */"./node_modules/core-js-pure/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED='Object already initialized';
var WeakMap=global.WeakMap;
var set,get,has;

var enforce=function enforce(it){
return has(it)?get(it):set(it,{});
};

var getterFor=function getterFor(TYPE){
return function(it){
var state;
if(!isObject(it)||(state=get(it)).type!==TYPE){
throw TypeError('Incompatible receiver, '+TYPE+' required');
}return state;
};
};

if(NATIVE_WEAK_MAP||shared.state){
var store=shared.state||(shared.state=new WeakMap());
var wmget=store.get;
var wmhas=store.has;
var wmset=store.set;
set=function set(it,metadata){
if(wmhas.call(store,it))throw new TypeError(OBJECT_ALREADY_INITIALIZED);
metadata.facade=it;
wmset.call(store,it,metadata);
return metadata;
};
get=function get(it){
return wmget.call(store,it)||{};
};
has=function has(it){
return wmhas.call(store,it);
};
}else {
var STATE=sharedKey('state');
hiddenKeys[STATE]=true;
set=function set(it,metadata){
if(objectHas(it,STATE))throw new TypeError(OBJECT_ALREADY_INITIALIZED);
metadata.facade=it;
createNonEnumerableProperty(it,STATE,metadata);
return metadata;
};
get=function get(it){
return objectHas(it,STATE)?it[STATE]:{};
};
has=function has(it){
return objectHas(it,STATE);
};
}

module.exports={
set:set,
get:get,
has:has,
enforce:enforce,
getterFor:getterFor};



/***/},

/***/"./node_modules/core-js-pure/internals/is-array-iterator-method.js":




function node_modulesCoreJsPureInternalsIsArrayIteratorMethodJs(module,exports,__webpack_require__){

var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");

var ITERATOR=wellKnownSymbol('iterator');
var ArrayPrototype=Array.prototype;

// check on default Array iterator
module.exports=function(it){
return it!==undefined&&(Iterators.Array===it||ArrayPrototype[ITERATOR]===it);
};


/***/},

/***/"./node_modules/core-js-pure/internals/is-array.js":




function node_modulesCoreJsPureInternalsIsArrayJs(module,exports,__webpack_require__){

var classof=__webpack_require__(/*! ../internals/classof-raw */"./node_modules/core-js-pure/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports=Array.isArray||function isArray(arg){
return classof(arg)=='Array';
};


/***/},

/***/"./node_modules/core-js-pure/internals/is-data-descriptor.js":




function node_modulesCoreJsPureInternalsIsDataDescriptorJs(module,exports,__webpack_require__){

var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");

module.exports=function(descriptor){
return descriptor!==undefined&&(has(descriptor,'value')||has(descriptor,'writable'));
};


/***/},

/***/"./node_modules/core-js-pure/internals/is-forced.js":




function node_modulesCoreJsPureInternalsIsForcedJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

var replacement=/#|\.prototype\./;

var isForced=function isForced(feature,detection){
var value=data[normalize(feature)];
return value==POLYFILL?true:
value==NATIVE?false:
typeof detection=='function'?fails(detection):
!!detection;
};

var normalize=isForced.normalize=function(string){
return String(string).replace(replacement,'.').toLowerCase();
};

var data=isForced.data={};
var NATIVE=isForced.NATIVE='N';
var POLYFILL=isForced.POLYFILL='P';

module.exports=isForced;


/***/},

/***/"./node_modules/core-js-pure/internals/is-object.js":




function node_modulesCoreJsPureInternalsIsObjectJs(module,exports){

module.exports=function(it){
return typeof it==='object'?it!==null:typeof it==='function';
};


/***/},

/***/"./node_modules/core-js-pure/internals/is-pure.js":




function node_modulesCoreJsPureInternalsIsPureJs(module,exports){

module.exports=true;


/***/},

/***/"./node_modules/core-js-pure/internals/is-regexp.js":




function node_modulesCoreJsPureInternalsIsRegexpJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var classof=__webpack_require__(/*! ../internals/classof-raw */"./node_modules/core-js-pure/internals/classof-raw.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var MATCH=wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports=function(it){
var isRegExp;
return isObject(it)&&((isRegExp=it[MATCH])!==undefined?!!isRegExp:classof(it)=='RegExp');
};


/***/},

/***/"./node_modules/core-js-pure/internals/is-symbol.js":




function node_modulesCoreJsPureInternalsIsSymbolJs(module,exports,__webpack_require__){

var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var USE_SYMBOL_AS_UID=__webpack_require__(/*! ../internals/use-symbol-as-uid */"./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

module.exports=USE_SYMBOL_AS_UID?function(it){
return typeof it=='symbol';
}:function(it){
var $Symbol=getBuiltIn('Symbol');
return typeof $Symbol=='function'&&Object(it)instanceof $Symbol;
};


/***/},

/***/"./node_modules/core-js-pure/internals/iterate.js":




function node_modulesCoreJsPureInternalsIterateJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var isArrayIteratorMethod=__webpack_require__(/*! ../internals/is-array-iterator-method */"./node_modules/core-js-pure/internals/is-array-iterator-method.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var getIterator=__webpack_require__(/*! ../internals/get-iterator */"./node_modules/core-js-pure/internals/get-iterator.js");
var getIteratorMethod=__webpack_require__(/*! ../internals/get-iterator-method */"./node_modules/core-js-pure/internals/get-iterator-method.js");
var iteratorClose=__webpack_require__(/*! ../internals/iterator-close */"./node_modules/core-js-pure/internals/iterator-close.js");

var Result=function Result(stopped,result){
this.stopped=stopped;
this.result=result;
};

module.exports=function(iterable,unboundFunction,options){
var that=options&&options.that;
var AS_ENTRIES=!!(options&&options.AS_ENTRIES);
var IS_ITERATOR=!!(options&&options.IS_ITERATOR);
var INTERRUPTED=!!(options&&options.INTERRUPTED);
var fn=bind(unboundFunction,that,1+AS_ENTRIES+INTERRUPTED);
var iterator,iterFn,index,length,result,next,step;

var stop=function stop(condition){
if(iterator)iteratorClose(iterator,'return',condition);
return new Result(true,condition);
};

var callFn=function callFn(value){
if(AS_ENTRIES){
anObject(value);
return INTERRUPTED?fn(value[0],value[1],stop):fn(value[0],value[1]);
}return INTERRUPTED?fn(value,stop):fn(value);
};

if(IS_ITERATOR){
iterator=iterable;
}else {
iterFn=getIteratorMethod(iterable);
if(typeof iterFn!='function')throw TypeError('Target is not iterable');
// optimisation for array iterators
if(isArrayIteratorMethod(iterFn)){
for(index=0,length=toLength(iterable.length);length>index;index++){
result=callFn(iterable[index]);
if(result&&result instanceof Result)return result;
}return new Result(false);
}
iterator=getIterator(iterable,iterFn);
}

next=iterator.next;
while(!(step=next.call(iterator)).done){
try{
result=callFn(step.value);
}catch(error){
iteratorClose(iterator,'throw',error);
}
if(typeof result=='object'&&result&&result instanceof Result)return result;
}return new Result(false);
};


/***/},

/***/"./node_modules/core-js-pure/internals/iterator-close.js":




function node_modulesCoreJsPureInternalsIteratorCloseJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");

module.exports=function(iterator,kind,value){
var innerResult,innerError;
anObject(iterator);
try{
innerResult=iterator['return'];
if(innerResult===undefined){
if(kind==='throw')throw value;
return value;
}
innerResult=innerResult.call(iterator);
}catch(error){
innerError=true;
innerResult=error;
}
if(kind==='throw')throw value;
if(innerError)throw innerResult;
anObject(innerResult);
return value;
};


/***/},

/***/"./node_modules/core-js-pure/internals/iterators-core.js":




function node_modulesCoreJsPureInternalsIteratorsCoreJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var getPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");

var ITERATOR=wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS=false;

var returnThis=function returnThis(){return this;};

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype,PrototypeOfArrayIteratorPrototype,arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if([].keys){
arrayIterator=[].keys();
// Safari 8 has buggy iterators w/o `next`
if(!('next'in arrayIterator))BUGGY_SAFARI_ITERATORS=true;else
{
PrototypeOfArrayIteratorPrototype=getPrototypeOf(getPrototypeOf(arrayIterator));
if(PrototypeOfArrayIteratorPrototype!==Object.prototype)IteratorPrototype=PrototypeOfArrayIteratorPrototype;
}
}

var NEW_ITERATOR_PROTOTYPE=IteratorPrototype==undefined||fails(function(){
var test={};
// FF44- legacy iterators case
return IteratorPrototype[ITERATOR].call(test)!==test;
});

if(NEW_ITERATOR_PROTOTYPE)IteratorPrototype={};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if((!IS_PURE||NEW_ITERATOR_PROTOTYPE)&&!has(IteratorPrototype,ITERATOR)){
createNonEnumerableProperty(IteratorPrototype,ITERATOR,returnThis);
}

module.exports={
IteratorPrototype:IteratorPrototype,
BUGGY_SAFARI_ITERATORS:BUGGY_SAFARI_ITERATORS};



/***/},

/***/"./node_modules/core-js-pure/internals/iterators.js":




function node_modulesCoreJsPureInternalsIteratorsJs(module,exports){

module.exports={};


/***/},

/***/"./node_modules/core-js-pure/internals/microtask.js":




function node_modulesCoreJsPureInternalsMicrotaskJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var getOwnPropertyDescriptor=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;
var macrotask=__webpack_require__(/*! ../internals/task */"./node_modules/core-js-pure/internals/task.js").set;
var IS_IOS=__webpack_require__(/*! ../internals/engine-is-ios */"./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_IOS_PEBBLE=__webpack_require__(/*! ../internals/engine-is-ios-pebble */"./node_modules/core-js-pure/internals/engine-is-ios-pebble.js");
var IS_WEBOS_WEBKIT=__webpack_require__(/*! ../internals/engine-is-webos-webkit */"./node_modules/core-js-pure/internals/engine-is-webos-webkit.js");
var IS_NODE=__webpack_require__(/*! ../internals/engine-is-node */"./node_modules/core-js-pure/internals/engine-is-node.js");

var MutationObserver=global.MutationObserver||global.WebKitMutationObserver;
var document=global.document;
var process=global.process;
var Promise=global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor=getOwnPropertyDescriptor(global,'queueMicrotask');
var queueMicrotask=queueMicrotaskDescriptor&&queueMicrotaskDescriptor.value;

var flush,head,last,notify,toggle,node,promise,then;

// modern engines have queueMicrotask method
if(!queueMicrotask){
flush=function flush(){
var parent,fn;
if(IS_NODE&&(parent=process.domain))parent.exit();
while(head){
fn=head.fn;
head=head.next;
try{
fn();
}catch(error){
if(head)notify();else
last=undefined;
throw error;
}
}last=undefined;
if(parent)parent.enter();
};

// browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
// also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
if(!IS_IOS&&!IS_NODE&&!IS_WEBOS_WEBKIT&&MutationObserver&&document){
toggle=true;
node=document.createTextNode('');
new MutationObserver(flush).observe(node,{characterData:true});
notify=function notify(){
node.data=toggle=!toggle;
};
// environments with maybe non-completely correct, but existent Promise
}else if(!IS_IOS_PEBBLE&&Promise&&Promise.resolve){
// Promise.resolve without an argument throws an error in LG WebOS 2
promise=Promise.resolve(undefined);
// workaround of WebKit ~ iOS Safari 10.1 bug
promise.constructor=Promise;
then=promise.then;
notify=function notify(){
then.call(promise,flush);
};
// Node.js without promises
}else if(IS_NODE){
notify=function notify(){
process.nextTick(flush);
};
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
}else {
notify=function notify(){
// strange IE + webpack dev server bug - use .call(global)
macrotask.call(global,flush);
};
}
}

module.exports=queueMicrotask||function(fn){
var task={fn:fn,next:undefined};
if(last)last.next=task;
if(!head){
head=task;
notify();
}last=task;
};


/***/},

/***/"./node_modules/core-js-pure/internals/native-promise-constructor.js":




function node_modulesCoreJsPureInternalsNativePromiseConstructorJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

module.exports=global.Promise;


/***/},

/***/"./node_modules/core-js-pure/internals/native-symbol.js":




function node_modulesCoreJsPureInternalsNativeSymbolJs(module,exports,__webpack_require__){

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION=__webpack_require__(/*! ../internals/engine-v8-version */"./node_modules/core-js-pure/internals/engine-v8-version.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports=!!Object.getOwnPropertySymbols&&!fails(function(){
var symbol=Symbol();
// Chrome 38 Symbol has incorrect toString conversion
// `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
return !String(symbol)||!(Object(symbol)instanceof Symbol)||
// Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
!Symbol.sham&&V8_VERSION&&V8_VERSION<41;
});


/***/},

/***/"./node_modules/core-js-pure/internals/native-weak-map.js":




function node_modulesCoreJsPureInternalsNativeWeakMapJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var inspectSource=__webpack_require__(/*! ../internals/inspect-source */"./node_modules/core-js-pure/internals/inspect-source.js");

var WeakMap=global.WeakMap;

module.exports=typeof WeakMap==='function'&&/native code/.test(inspectSource(WeakMap));


/***/},

/***/"./node_modules/core-js-pure/internals/new-promise-capability.js":




function node_modulesCoreJsPureInternalsNewPromiseCapabilityJs(module,exports,__webpack_require__){

var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");

var PromiseCapability=function PromiseCapability(C){
var resolve,reject;
this.promise=new C(function($$resolve,$$reject){
if(resolve!==undefined||reject!==undefined)throw TypeError('Bad Promise constructor');
resolve=$$resolve;
reject=$$reject;
});
this.resolve=aFunction(resolve);
this.reject=aFunction(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f=function(C){
return new PromiseCapability(C);
};


/***/},

/***/"./node_modules/core-js-pure/internals/not-a-regexp.js":




function node_modulesCoreJsPureInternalsNotARegexpJs(module,exports,__webpack_require__){

var isRegExp=__webpack_require__(/*! ../internals/is-regexp */"./node_modules/core-js-pure/internals/is-regexp.js");

module.exports=function(it){
if(isRegExp(it)){
throw TypeError("The method doesn't accept regular expressions");
}return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/number-parse-float.js":




function node_modulesCoreJsPureInternalsNumberParseFloatJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var trim=__webpack_require__(/*! ../internals/string-trim */"./node_modules/core-js-pure/internals/string-trim.js").trim;
var whitespaces=__webpack_require__(/*! ../internals/whitespaces */"./node_modules/core-js-pure/internals/whitespaces.js");

var $parseFloat=global.parseFloat;
var FORCED=1/$parseFloat(whitespaces+'-0')!==-Infinity;

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
module.exports=FORCED?function parseFloat(string){
var trimmedString=trim(toString(string));
var result=$parseFloat(trimmedString);
return result===0&&trimmedString.charAt(0)=='-'?-0:result;
}:$parseFloat;


/***/},

/***/"./node_modules/core-js-pure/internals/number-parse-int.js":




function node_modulesCoreJsPureInternalsNumberParseIntJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var trim=__webpack_require__(/*! ../internals/string-trim */"./node_modules/core-js-pure/internals/string-trim.js").trim;
var whitespaces=__webpack_require__(/*! ../internals/whitespaces */"./node_modules/core-js-pure/internals/whitespaces.js");

var $parseInt=global.parseInt;
var hex=/^[+-]?0[Xx]/;
var FORCED=$parseInt(whitespaces+'08')!==8||$parseInt(whitespaces+'0x16')!==22;

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports=FORCED?function parseInt(string,radix){
var S=trim(toString(string));
return $parseInt(S,radix>>>0||(hex.test(S)?16:10));
}:$parseInt;


/***/},

/***/"./node_modules/core-js-pure/internals/object-create.js":




function node_modulesCoreJsPureInternalsObjectCreateJs(module,exports,__webpack_require__){

/* global ActiveXObject -- old IE, WSH */
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var defineProperties=__webpack_require__(/*! ../internals/object-define-properties */"./node_modules/core-js-pure/internals/object-define-properties.js");
var enumBugKeys=__webpack_require__(/*! ../internals/enum-bug-keys */"./node_modules/core-js-pure/internals/enum-bug-keys.js");
var hiddenKeys=__webpack_require__(/*! ../internals/hidden-keys */"./node_modules/core-js-pure/internals/hidden-keys.js");
var html=__webpack_require__(/*! ../internals/html */"./node_modules/core-js-pure/internals/html.js");
var documentCreateElement=__webpack_require__(/*! ../internals/document-create-element */"./node_modules/core-js-pure/internals/document-create-element.js");
var sharedKey=__webpack_require__(/*! ../internals/shared-key */"./node_modules/core-js-pure/internals/shared-key.js");

var GT='>';
var LT='<';
var PROTOTYPE='prototype';
var SCRIPT='script';
var IE_PROTO=sharedKey('IE_PROTO');

var EmptyConstructor=function EmptyConstructor(){/* empty */};

var scriptTag=function scriptTag(content){
return LT+SCRIPT+GT+content+LT+'/'+SCRIPT+GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX=function NullProtoObjectViaActiveX(activeXDocument){
activeXDocument.write(scriptTag(''));
activeXDocument.close();
var temp=activeXDocument.parentWindow.Object;
activeXDocument=null;// avoid memory leak
return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame=function NullProtoObjectViaIFrame(){
// Thrash, waste and sodomy: IE GC bug
var iframe=documentCreateElement('iframe');
var JS='java'+SCRIPT+':';
var iframeDocument;
iframe.style.display='none';
html.appendChild(iframe);
// https://github.com/zloirock/core-js/issues/475
iframe.src=String(JS);
iframeDocument=iframe.contentWindow.document;
iframeDocument.open();
iframeDocument.write(scriptTag('document.F=Object'));
iframeDocument.close();
return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var _NullProtoObject=function NullProtoObject(){
try{
activeXDocument=new ActiveXObject('htmlfile');
}catch(error){/* ignore */}
_NullProtoObject=typeof document!='undefined'?
document.domain&&activeXDocument?
NullProtoObjectViaActiveX(activeXDocument)// old IE
:NullProtoObjectViaIFrame():
NullProtoObjectViaActiveX(activeXDocument);// WSH
var length=enumBugKeys.length;
while(length--){delete _NullProtoObject[PROTOTYPE][enumBugKeys[length]];}
return _NullProtoObject();
};

hiddenKeys[IE_PROTO]=true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports=Object.create||function create(O,Properties){
var result;
if(O!==null){
EmptyConstructor[PROTOTYPE]=anObject(O);
result=new EmptyConstructor();
EmptyConstructor[PROTOTYPE]=null;
// add "__proto__" for Object.getPrototypeOf polyfill
result[IE_PROTO]=O;
}else result=_NullProtoObject();
return Properties===undefined?result:defineProperties(result,Properties);
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-define-properties.js":




function node_modulesCoreJsPureInternalsObjectDefinePropertiesJs(module,exports,__webpack_require__){

var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var definePropertyModule=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var objectKeys=__webpack_require__(/*! ../internals/object-keys */"./node_modules/core-js-pure/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports=DESCRIPTORS?Object.defineProperties:function defineProperties(O,Properties){
anObject(O);
var keys=objectKeys(Properties);
var length=keys.length;
var index=0;
var key;
while(length>index){definePropertyModule.f(O,key=keys[index++],Properties[key]);}
return O;
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-define-property.js":




function node_modulesCoreJsPureInternalsObjectDefinePropertyJs(module,exports,__webpack_require__){

var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var IE8_DOM_DEFINE=__webpack_require__(/*! ../internals/ie8-dom-define */"./node_modules/core-js-pure/internals/ie8-dom-define.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var toPropertyKey=__webpack_require__(/*! ../internals/to-property-key */"./node_modules/core-js-pure/internals/to-property-key.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty=Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f=DESCRIPTORS?$defineProperty:function defineProperty(O,P,Attributes){
anObject(O);
P=toPropertyKey(P);
anObject(Attributes);
if(IE8_DOM_DEFINE)try{
return $defineProperty(O,P,Attributes);
}catch(error){/* empty */}
if('get'in Attributes||'set'in Attributes)throw TypeError('Accessors not supported');
if('value'in Attributes)O[P]=Attributes.value;
return O;
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js":




function node_modulesCoreJsPureInternalsObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var propertyIsEnumerableModule=__webpack_require__(/*! ../internals/object-property-is-enumerable */"./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey=__webpack_require__(/*! ../internals/to-property-key */"./node_modules/core-js-pure/internals/to-property-key.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var IE8_DOM_DEFINE=__webpack_require__(/*! ../internals/ie8-dom-define */"./node_modules/core-js-pure/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f=DESCRIPTORS?$getOwnPropertyDescriptor:function getOwnPropertyDescriptor(O,P){
O=toIndexedObject(O);
P=toPropertyKey(P);
if(IE8_DOM_DEFINE)try{
return $getOwnPropertyDescriptor(O,P);
}catch(error){/* empty */}
if(has(O,P))return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O,P),O[P]);
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-get-own-property-names-external.js":




function node_modulesCoreJsPureInternalsObjectGetOwnPropertyNamesExternalJs(module,exports,__webpack_require__){

/* eslint-disable es/no-object-getownpropertynames -- safe */
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var $getOwnPropertyNames=__webpack_require__(/*! ../internals/object-get-own-property-names */"./node_modules/core-js-pure/internals/object-get-own-property-names.js").f;

var toString={}.toString;

var windowNames=typeof window=='object'&&window&&Object.getOwnPropertyNames?
Object.getOwnPropertyNames(window):[];

var getWindowNames=function getWindowNames(it){
try{
return $getOwnPropertyNames(it);
}catch(error){
return windowNames.slice();
}
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f=function getOwnPropertyNames(it){
return windowNames&&toString.call(it)=='[object Window]'?
getWindowNames(it):
$getOwnPropertyNames(toIndexedObject(it));
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-get-own-property-names.js":




function node_modulesCoreJsPureInternalsObjectGetOwnPropertyNamesJs(module,exports,__webpack_require__){

var internalObjectKeys=__webpack_require__(/*! ../internals/object-keys-internal */"./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys=__webpack_require__(/*! ../internals/enum-bug-keys */"./node_modules/core-js-pure/internals/enum-bug-keys.js");

var hiddenKeys=enumBugKeys.concat('length','prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){
return internalObjectKeys(O,hiddenKeys);
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-get-own-property-symbols.js":




function node_modulesCoreJsPureInternalsObjectGetOwnPropertySymbolsJs(module,exports){

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f=Object.getOwnPropertySymbols;


/***/},

/***/"./node_modules/core-js-pure/internals/object-get-prototype-of.js":




function node_modulesCoreJsPureInternalsObjectGetPrototypeOfJs(module,exports,__webpack_require__){

var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var sharedKey=__webpack_require__(/*! ../internals/shared-key */"./node_modules/core-js-pure/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER=__webpack_require__(/*! ../internals/correct-prototype-getter */"./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var IE_PROTO=sharedKey('IE_PROTO');
var ObjectPrototype=Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports=CORRECT_PROTOTYPE_GETTER?Object.getPrototypeOf:function(O){
O=toObject(O);
if(has(O,IE_PROTO))return O[IE_PROTO];
if(typeof O.constructor=='function'&&O instanceof O.constructor){
return O.constructor.prototype;
}return O instanceof Object?ObjectPrototype:null;
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-keys-internal.js":




function node_modulesCoreJsPureInternalsObjectKeysInternalJs(module,exports,__webpack_require__){

var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var indexOf=__webpack_require__(/*! ../internals/array-includes */"./node_modules/core-js-pure/internals/array-includes.js").indexOf;
var hiddenKeys=__webpack_require__(/*! ../internals/hidden-keys */"./node_modules/core-js-pure/internals/hidden-keys.js");

module.exports=function(object,names){
var O=toIndexedObject(object);
var i=0;
var result=[];
var key;
for(key in O){!has(hiddenKeys,key)&&has(O,key)&&result.push(key);}
// Don't enum bug & hidden keys
while(names.length>i){if(has(O,key=names[i++])){
~indexOf(result,key)||result.push(key);
}}
return result;
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-keys.js":




function node_modulesCoreJsPureInternalsObjectKeysJs(module,exports,__webpack_require__){

var internalObjectKeys=__webpack_require__(/*! ../internals/object-keys-internal */"./node_modules/core-js-pure/internals/object-keys-internal.js");
var enumBugKeys=__webpack_require__(/*! ../internals/enum-bug-keys */"./node_modules/core-js-pure/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports=Object.keys||function keys(O){
return internalObjectKeys(O,enumBugKeys);
};


/***/},

/***/"./node_modules/core-js-pure/internals/object-property-is-enumerable.js":




function node_modulesCoreJsPureInternalsObjectPropertyIsEnumerableJs(module,exports,__webpack_require__){

var $propertyIsEnumerable={}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG=getOwnPropertyDescriptor&&!$propertyIsEnumerable.call({1:2},1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f=NASHORN_BUG?function propertyIsEnumerable(V){
var descriptor=getOwnPropertyDescriptor(this,V);
return !!descriptor&&descriptor.enumerable;
}:$propertyIsEnumerable;


/***/},

/***/"./node_modules/core-js-pure/internals/object-set-prototype-of.js":




function node_modulesCoreJsPureInternalsObjectSetPrototypeOfJs(module,exports,__webpack_require__){

/* eslint-disable no-proto -- safe */
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var aPossiblePrototype=__webpack_require__(/*! ../internals/a-possible-prototype */"./node_modules/core-js-pure/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports=Object.setPrototypeOf||('__proto__'in{}?function(){
var CORRECT_SETTER=false;
var test={};
var setter;
try{
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
setter=Object.getOwnPropertyDescriptor(Object.prototype,'__proto__').set;
setter.call(test,[]);
CORRECT_SETTER=test instanceof Array;
}catch(error){/* empty */}
return function setPrototypeOf(O,proto){
anObject(O);
aPossiblePrototype(proto);
if(CORRECT_SETTER)setter.call(O,proto);else
O.__proto__=proto;
return O;
};
}():undefined);


/***/},

/***/"./node_modules/core-js-pure/internals/object-to-string.js":




function node_modulesCoreJsPureInternalsObjectToStringJs(module,exports,__webpack_require__){

var TO_STRING_TAG_SUPPORT=__webpack_require__(/*! ../internals/to-string-tag-support */"./node_modules/core-js-pure/internals/to-string-tag-support.js");
var classof=__webpack_require__(/*! ../internals/classof */"./node_modules/core-js-pure/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports=TO_STRING_TAG_SUPPORT?{}.toString:function toString(){
return '[object '+classof(this)+']';
};


/***/},

/***/"./node_modules/core-js-pure/internals/ordinary-to-primitive.js":




function node_modulesCoreJsPureInternalsOrdinaryToPrimitiveJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports=function(input,pref){
var fn,val;
if(pref==='string'&&typeof(fn=input.toString)=='function'&&!isObject(val=fn.call(input)))return val;
if(typeof(fn=input.valueOf)=='function'&&!isObject(val=fn.call(input)))return val;
if(pref!=='string'&&typeof(fn=input.toString)=='function'&&!isObject(val=fn.call(input)))return val;
throw TypeError("Can't convert object to primitive value");
};


/***/},

/***/"./node_modules/core-js-pure/internals/own-keys.js":




function node_modulesCoreJsPureInternalsOwnKeysJs(module,exports,__webpack_require__){

var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var getOwnPropertyNamesModule=__webpack_require__(/*! ../internals/object-get-own-property-names */"./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule=__webpack_require__(/*! ../internals/object-get-own-property-symbols */"./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");

// all object keys, includes non-enumerable and symbols
module.exports=getBuiltIn('Reflect','ownKeys')||function ownKeys(it){
var keys=getOwnPropertyNamesModule.f(anObject(it));
var getOwnPropertySymbols=getOwnPropertySymbolsModule.f;
return getOwnPropertySymbols?keys.concat(getOwnPropertySymbols(it)):keys;
};


/***/},

/***/"./node_modules/core-js-pure/internals/path.js":




function node_modulesCoreJsPureInternalsPathJs(module,exports){

module.exports={};


/***/},

/***/"./node_modules/core-js-pure/internals/perform.js":




function node_modulesCoreJsPureInternalsPerformJs(module,exports){

module.exports=function(exec){
try{
return {error:false,value:exec()};
}catch(error){
return {error:true,value:error};
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/promise-resolve.js":




function node_modulesCoreJsPureInternalsPromiseResolveJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var newPromiseCapability=__webpack_require__(/*! ../internals/new-promise-capability */"./node_modules/core-js-pure/internals/new-promise-capability.js");

module.exports=function(C,x){
anObject(C);
if(isObject(x)&&x.constructor===C)return x;
var promiseCapability=newPromiseCapability.f(C);
var resolve=promiseCapability.resolve;
resolve(x);
return promiseCapability.promise;
};


/***/},

/***/"./node_modules/core-js-pure/internals/redefine-all.js":




function node_modulesCoreJsPureInternalsRedefineAllJs(module,exports,__webpack_require__){

var redefine=__webpack_require__(/*! ../internals/redefine */"./node_modules/core-js-pure/internals/redefine.js");

module.exports=function(target,src,options){
for(var key in src){
if(options&&options.unsafe&&target[key])target[key]=src[key];else
redefine(target,key,src[key],options);
}return target;
};


/***/},

/***/"./node_modules/core-js-pure/internals/redefine.js":




function node_modulesCoreJsPureInternalsRedefineJs(module,exports,__webpack_require__){

var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");

module.exports=function(target,key,value,options){
if(options&&options.enumerable)target[key]=value;else
createNonEnumerableProperty(target,key,value);
};


/***/},

/***/"./node_modules/core-js-pure/internals/require-object-coercible.js":




function node_modulesCoreJsPureInternalsRequireObjectCoercibleJs(module,exports){

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports=function(it){
if(it==undefined)throw TypeError("Can't call method on "+it);
return it;
};


/***/},

/***/"./node_modules/core-js-pure/internals/set-global.js":




function node_modulesCoreJsPureInternalsSetGlobalJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");

module.exports=function(key,value){
try{
// eslint-disable-next-line es/no-object-defineproperty -- safe
Object.defineProperty(global,key,{value:value,configurable:true,writable:true});
}catch(error){
global[key]=value;
}return value;
};


/***/},

/***/"./node_modules/core-js-pure/internals/set-species.js":




function node_modulesCoreJsPureInternalsSetSpeciesJs(module,exports,__webpack_require__){

var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var definePropertyModule=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");

var SPECIES=wellKnownSymbol('species');

module.exports=function(CONSTRUCTOR_NAME){
var Constructor=getBuiltIn(CONSTRUCTOR_NAME);
var defineProperty=definePropertyModule.f;

if(DESCRIPTORS&&Constructor&&!Constructor[SPECIES]){
defineProperty(Constructor,SPECIES,{
configurable:true,
get:function get(){return this;}});

}
};


/***/},

/***/"./node_modules/core-js-pure/internals/set-to-string-tag.js":




function node_modulesCoreJsPureInternalsSetToStringTagJs(module,exports,__webpack_require__){

var TO_STRING_TAG_SUPPORT=__webpack_require__(/*! ../internals/to-string-tag-support */"./node_modules/core-js-pure/internals/to-string-tag-support.js");
var defineProperty=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js").f;
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var toString=__webpack_require__(/*! ../internals/object-to-string */"./node_modules/core-js-pure/internals/object-to-string.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG=wellKnownSymbol('toStringTag');

module.exports=function(it,TAG,STATIC,SET_METHOD){
if(it){
var target=STATIC?it:it.prototype;
if(!has(target,TO_STRING_TAG)){
defineProperty(target,TO_STRING_TAG,{configurable:true,value:TAG});
}
if(SET_METHOD&&!TO_STRING_TAG_SUPPORT){
createNonEnumerableProperty(target,'toString',toString);
}
}
};


/***/},

/***/"./node_modules/core-js-pure/internals/shared-key.js":




function node_modulesCoreJsPureInternalsSharedKeyJs(module,exports,__webpack_require__){

var shared=__webpack_require__(/*! ../internals/shared */"./node_modules/core-js-pure/internals/shared.js");
var uid=__webpack_require__(/*! ../internals/uid */"./node_modules/core-js-pure/internals/uid.js");

var keys=shared('keys');

module.exports=function(key){
return keys[key]||(keys[key]=uid(key));
};


/***/},

/***/"./node_modules/core-js-pure/internals/shared-store.js":




function node_modulesCoreJsPureInternalsSharedStoreJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var setGlobal=__webpack_require__(/*! ../internals/set-global */"./node_modules/core-js-pure/internals/set-global.js");

var SHARED='__core-js_shared__';
var store=global[SHARED]||setGlobal(SHARED,{});

module.exports=store;


/***/},

/***/"./node_modules/core-js-pure/internals/shared.js":




function node_modulesCoreJsPureInternalsSharedJs(module,exports,__webpack_require__){

var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");
var store=__webpack_require__(/*! ../internals/shared-store */"./node_modules/core-js-pure/internals/shared-store.js");

(module.exports=function(key,value){
return store[key]||(store[key]=value!==undefined?value:{});
})('versions',[]).push({
version:'3.16.4',
mode:IS_PURE?'pure':'global',
copyright:'© 2021 Denis Pushkarev (zloirock.ru)'});



/***/},

/***/"./node_modules/core-js-pure/internals/species-constructor.js":




function node_modulesCoreJsPureInternalsSpeciesConstructorJs(module,exports,__webpack_require__){

var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var SPECIES=wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports=function(O,defaultConstructor){
var C=anObject(O).constructor;
var S;
return C===undefined||(S=anObject(C)[SPECIES])==undefined?defaultConstructor:aFunction(S);
};


/***/},

/***/"./node_modules/core-js-pure/internals/string-multibyte.js":




function node_modulesCoreJsPureInternalsStringMultibyteJs(module,exports,__webpack_require__){

var toInteger=__webpack_require__(/*! ../internals/to-integer */"./node_modules/core-js-pure/internals/to-integer.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");

// `String.prototype.codePointAt` methods implementation
var createMethod=function createMethod(CONVERT_TO_STRING){
return function($this,pos){
var S=toString(requireObjectCoercible($this));
var position=toInteger(pos);
var size=S.length;
var first,second;
if(position<0||position>=size)return CONVERT_TO_STRING?'':undefined;
first=S.charCodeAt(position);
return first<0xD800||first>0xDBFF||position+1===size||
(second=S.charCodeAt(position+1))<0xDC00||second>0xDFFF?
CONVERT_TO_STRING?S.charAt(position):first:
CONVERT_TO_STRING?S.slice(position,position+2):(first-0xD800<<10)+(second-0xDC00)+0x10000;
};
};

module.exports={
// `String.prototype.codePointAt` method
// https://tc39.es/ecma262/#sec-string.prototype.codepointat
codeAt:createMethod(false),
// `String.prototype.at` method
// https://github.com/mathiasbynens/String.prototype.at
charAt:createMethod(true)};



/***/},

/***/"./node_modules/core-js-pure/internals/string-trim-forced.js":




function node_modulesCoreJsPureInternalsStringTrimForcedJs(module,exports,__webpack_require__){

var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var whitespaces=__webpack_require__(/*! ../internals/whitespaces */"./node_modules/core-js-pure/internals/whitespaces.js");

var non="\u200B\x85\u180E";

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports=function(METHOD_NAME){
return fails(function(){
return !!whitespaces[METHOD_NAME]()||non[METHOD_NAME]()!=non||whitespaces[METHOD_NAME].name!==METHOD_NAME;
});
};


/***/},

/***/"./node_modules/core-js-pure/internals/string-trim.js":




function node_modulesCoreJsPureInternalsStringTrimJs(module,exports,__webpack_require__){

var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var whitespaces=__webpack_require__(/*! ../internals/whitespaces */"./node_modules/core-js-pure/internals/whitespaces.js");

var whitespace='['+whitespaces+']';
var ltrim=RegExp('^'+whitespace+whitespace+'*');
var rtrim=RegExp(whitespace+whitespace+'*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod=function createMethod(TYPE){
return function($this){
var string=toString(requireObjectCoercible($this));
if(TYPE&1)string=string.replace(ltrim,'');
if(TYPE&2)string=string.replace(rtrim,'');
return string;
};
};

module.exports={
// `String.prototype.{ trimLeft, trimStart }` methods
// https://tc39.es/ecma262/#sec-string.prototype.trimstart
start:createMethod(1),
// `String.prototype.{ trimRight, trimEnd }` methods
// https://tc39.es/ecma262/#sec-string.prototype.trimend
end:createMethod(2),
// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
trim:createMethod(3)};



/***/},

/***/"./node_modules/core-js-pure/internals/task.js":




function node_modulesCoreJsPureInternalsTaskJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var bind=__webpack_require__(/*! ../internals/function-bind-context */"./node_modules/core-js-pure/internals/function-bind-context.js");
var html=__webpack_require__(/*! ../internals/html */"./node_modules/core-js-pure/internals/html.js");
var createElement=__webpack_require__(/*! ../internals/document-create-element */"./node_modules/core-js-pure/internals/document-create-element.js");
var IS_IOS=__webpack_require__(/*! ../internals/engine-is-ios */"./node_modules/core-js-pure/internals/engine-is-ios.js");
var IS_NODE=__webpack_require__(/*! ../internals/engine-is-node */"./node_modules/core-js-pure/internals/engine-is-node.js");

var set=global.setImmediate;
var clear=global.clearImmediate;
var process=global.process;
var MessageChannel=global.MessageChannel;
var Dispatch=global.Dispatch;
var counter=0;
var queue={};
var ONREADYSTATECHANGE='onreadystatechange';
var location,defer,channel,port;

try{
// Deno throws a ReferenceError on `location` access without `--location` flag
location=global.location;
}catch(error){/* empty */}

var run=function run(id){
// eslint-disable-next-line no-prototype-builtins -- safe
if(queue.hasOwnProperty(id)){
var fn=queue[id];
delete queue[id];
fn();
}
};

var runner=function runner(id){
return function(){
run(id);
};
};

var listener=function listener(event){
run(event.data);
};

var post=function post(id){
// old engines have not location.origin
global.postMessage(String(id),location.protocol+'//'+location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!set||!clear){
set=function setImmediate(fn){
var args=[];
var argumentsLength=arguments.length;
var i=1;
while(argumentsLength>i){args.push(arguments[i++]);}
queue[++counter]=function(){
// eslint-disable-next-line no-new-func -- spec requirement
(typeof fn=='function'?fn:Function(fn)).apply(undefined,args);
};
defer(counter);
return counter;
};
clear=function clearImmediate(id){
delete queue[id];
};
// Node.js 0.8-
if(IS_NODE){
defer=function defer(id){
process.nextTick(runner(id));
};
// Sphere (JS game engine) Dispatch API
}else if(Dispatch&&Dispatch.now){
defer=function defer(id){
Dispatch.now(runner(id));
};
// Browsers with MessageChannel, includes WebWorkers
// except iOS - https://github.com/zloirock/core-js/issues/624
}else if(MessageChannel&&!IS_IOS){
channel=new MessageChannel();
port=channel.port2;
channel.port1.onmessage=listener;
defer=bind(port.postMessage,port,1);
// Browsers with postMessage, skip WebWorkers
// IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
}else if(
global.addEventListener&&
typeof postMessage=='function'&&
!global.importScripts&&
location&&location.protocol!=='file:'&&
!fails(post))
{
defer=post;
global.addEventListener('message',listener,false);
// IE8-
}else if(ONREADYSTATECHANGE in createElement('script')){
defer=function defer(id){
html.appendChild(createElement('script'))[ONREADYSTATECHANGE]=function(){
html.removeChild(this);
run(id);
};
};
// Rest old browsers
}else {
defer=function defer(id){
setTimeout(runner(id),0);
};
}
}

module.exports={
set:set,
clear:clear};



/***/},

/***/"./node_modules/core-js-pure/internals/to-absolute-index.js":




function node_modulesCoreJsPureInternalsToAbsoluteIndexJs(module,exports,__webpack_require__){

var toInteger=__webpack_require__(/*! ../internals/to-integer */"./node_modules/core-js-pure/internals/to-integer.js");

var max=Math.max;
var min=Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports=function(index,length){
var integer=toInteger(index);
return integer<0?max(integer+length,0):min(integer,length);
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-indexed-object.js":




function node_modulesCoreJsPureInternalsToIndexedObjectJs(module,exports,__webpack_require__){

// toObject with fallback for non-array-like ES3 strings
var IndexedObject=__webpack_require__(/*! ../internals/indexed-object */"./node_modules/core-js-pure/internals/indexed-object.js");
var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");

module.exports=function(it){
return IndexedObject(requireObjectCoercible(it));
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-integer.js":




function node_modulesCoreJsPureInternalsToIntegerJs(module,exports){

var ceil=Math.ceil;
var floor=Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports=function(argument){
return isNaN(argument=+argument)?0:(argument>0?floor:ceil)(argument);
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-length.js":




function node_modulesCoreJsPureInternalsToLengthJs(module,exports,__webpack_require__){

var toInteger=__webpack_require__(/*! ../internals/to-integer */"./node_modules/core-js-pure/internals/to-integer.js");

var min=Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports=function(argument){
return argument>0?min(toInteger(argument),0x1FFFFFFFFFFFFF):0;// 2 ** 53 - 1 == 9007199254740991
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-object.js":




function node_modulesCoreJsPureInternalsToObjectJs(module,exports,__webpack_require__){

var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports=function(argument){
return Object(requireObjectCoercible(argument));
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-primitive.js":




function node_modulesCoreJsPureInternalsToPrimitiveJs(module,exports,__webpack_require__){

var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var isSymbol=__webpack_require__(/*! ../internals/is-symbol */"./node_modules/core-js-pure/internals/is-symbol.js");
var ordinaryToPrimitive=__webpack_require__(/*! ../internals/ordinary-to-primitive */"./node_modules/core-js-pure/internals/ordinary-to-primitive.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_PRIMITIVE=wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports=function(input,pref){
if(!isObject(input)||isSymbol(input))return input;
var exoticToPrim=input[TO_PRIMITIVE];
var result;
if(exoticToPrim!==undefined){
if(pref===undefined)pref='default';
result=exoticToPrim.call(input,pref);
if(!isObject(result)||isSymbol(result))return result;
throw TypeError("Can't convert object to primitive value");
}
if(pref===undefined)pref='number';
return ordinaryToPrimitive(input,pref);
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-property-key.js":




function node_modulesCoreJsPureInternalsToPropertyKeyJs(module,exports,__webpack_require__){

var toPrimitive=__webpack_require__(/*! ../internals/to-primitive */"./node_modules/core-js-pure/internals/to-primitive.js");
var isSymbol=__webpack_require__(/*! ../internals/is-symbol */"./node_modules/core-js-pure/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports=function(argument){
var key=toPrimitive(argument,'string');
return isSymbol(key)?key:String(key);
};


/***/},

/***/"./node_modules/core-js-pure/internals/to-string-tag-support.js":




function node_modulesCoreJsPureInternalsToStringTagSupportJs(module,exports,__webpack_require__){

var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG=wellKnownSymbol('toStringTag');
var test={};

test[TO_STRING_TAG]='z';

module.exports=String(test)==='[object z]';


/***/},

/***/"./node_modules/core-js-pure/internals/to-string.js":




function node_modulesCoreJsPureInternalsToStringJs(module,exports,__webpack_require__){

var isSymbol=__webpack_require__(/*! ../internals/is-symbol */"./node_modules/core-js-pure/internals/is-symbol.js");

module.exports=function(argument){
if(isSymbol(argument))throw TypeError('Cannot convert a Symbol value to a string');
return String(argument);
};


/***/},

/***/"./node_modules/core-js-pure/internals/uid.js":




function node_modulesCoreJsPureInternalsUidJs(module,exports){

var id=0;
var postfix=Math.random();

module.exports=function(key){
return 'Symbol('+String(key===undefined?'':key)+')_'+(++id+postfix).toString(36);
};


/***/},

/***/"./node_modules/core-js-pure/internals/use-symbol-as-uid.js":




function node_modulesCoreJsPureInternalsUseSymbolAsUidJs(module,exports,__webpack_require__){

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL=__webpack_require__(/*! ../internals/native-symbol */"./node_modules/core-js-pure/internals/native-symbol.js");

module.exports=NATIVE_SYMBOL&&
!Symbol.sham&&
typeof Symbol.iterator=='symbol';


/***/},

/***/"./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js":




function node_modulesCoreJsPureInternalsWellKnownSymbolWrappedJs(module,exports,__webpack_require__){

var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

exports.f=wellKnownSymbol;


/***/},

/***/"./node_modules/core-js-pure/internals/well-known-symbol.js":




function node_modulesCoreJsPureInternalsWellKnownSymbolJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var shared=__webpack_require__(/*! ../internals/shared */"./node_modules/core-js-pure/internals/shared.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var uid=__webpack_require__(/*! ../internals/uid */"./node_modules/core-js-pure/internals/uid.js");
var NATIVE_SYMBOL=__webpack_require__(/*! ../internals/native-symbol */"./node_modules/core-js-pure/internals/native-symbol.js");
var USE_SYMBOL_AS_UID=__webpack_require__(/*! ../internals/use-symbol-as-uid */"./node_modules/core-js-pure/internals/use-symbol-as-uid.js");

var WellKnownSymbolsStore=shared('wks');
var Symbol=global.Symbol;
var createWellKnownSymbol=USE_SYMBOL_AS_UID?Symbol:Symbol&&Symbol.withoutSetter||uid;

module.exports=function(name){
if(!has(WellKnownSymbolsStore,name)||!(NATIVE_SYMBOL||typeof WellKnownSymbolsStore[name]=='string')){
if(NATIVE_SYMBOL&&has(Symbol,name)){
WellKnownSymbolsStore[name]=Symbol[name];
}else {
WellKnownSymbolsStore[name]=createWellKnownSymbol('Symbol.'+name);
}
}return WellKnownSymbolsStore[name];
};


/***/},

/***/"./node_modules/core-js-pure/internals/whitespaces.js":




function node_modulesCoreJsPureInternalsWhitespacesJs(module,exports){

// a string of all valid unicode whitespaces
module.exports="\t\n\x0B\f\r \xA0\u1680\u2000\u2001\u2002"+
"\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";


/***/},

/***/"./node_modules/core-js-pure/modules/es.aggregate-error.js":




function node_modulesCoreJsPureModulesEsAggregateErrorJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var getPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var setPrototypeOf=__webpack_require__(/*! ../internals/object-set-prototype-of */"./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var create=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");

var $AggregateError=function AggregateError(errors,message){
var that=this;
if(!(that instanceof $AggregateError))return new $AggregateError(errors,message);
if(setPrototypeOf){
// eslint-disable-next-line unicorn/error-message -- expected
that=setPrototypeOf(new Error(undefined),getPrototypeOf(that));
}
if(message!==undefined)createNonEnumerableProperty(that,'message',toString(message));
var errorsArray=[];
iterate(errors,errorsArray.push,{that:errorsArray});
createNonEnumerableProperty(that,'errors',errorsArray);
return that;
};

$AggregateError.prototype=create(Error.prototype,{
constructor:createPropertyDescriptor(5,$AggregateError),
message:createPropertyDescriptor(5,''),
name:createPropertyDescriptor(5,'AggregateError')});


// `AggregateError` constructor
// https://tc39.es/ecma262/#sec-aggregate-error-constructor
$({global:true},{
AggregateError:$AggregateError});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.concat.js":




function node_modulesCoreJsPureModulesEsArrayConcatJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var createProperty=__webpack_require__(/*! ../internals/create-property */"./node_modules/core-js-pure/internals/create-property.js");
var arraySpeciesCreate=__webpack_require__(/*! ../internals/array-species-create */"./node_modules/core-js-pure/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport=__webpack_require__(/*! ../internals/array-method-has-species-support */"./node_modules/core-js-pure/internals/array-method-has-species-support.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var V8_VERSION=__webpack_require__(/*! ../internals/engine-v8-version */"./node_modules/core-js-pure/internals/engine-v8-version.js");

var IS_CONCAT_SPREADABLE=wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER=0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED='Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT=V8_VERSION>=51||!fails(function(){
var array=[];
array[IS_CONCAT_SPREADABLE]=false;
return array.concat()[0]!==array;
});

var SPECIES_SUPPORT=arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable=function isConcatSpreadable(O){
if(!isObject(O))return false;
var spreadable=O[IS_CONCAT_SPREADABLE];
return spreadable!==undefined?!!spreadable:isArray(O);
};

var FORCED=!IS_CONCAT_SPREADABLE_SUPPORT||!SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({target:'Array',proto:true,forced:FORCED},{
// eslint-disable-next-line no-unused-vars -- required for `.length`
concat:function concat(arg){
var O=toObject(this);
var A=arraySpeciesCreate(O,0);
var n=0;
var i,k,length,len,E;
for(i=-1,length=arguments.length;i<length;i++){
E=i===-1?O:arguments[i];
if(isConcatSpreadable(E)){
len=toLength(E.length);
if(n+len>MAX_SAFE_INTEGER)throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
for(k=0;k<len;k++,n++){if(k in E)createProperty(A,n,E[k]);}
}else {
if(n>=MAX_SAFE_INTEGER)throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
createProperty(A,n++,E);
}
}
A.length=n;
return A;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.every.js":




function node_modulesCoreJsPureModulesEsArrayEveryJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $every=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").every;
var arrayMethodIsStrict=__webpack_require__(/*! ../internals/array-method-is-strict */"./node_modules/core-js-pure/internals/array-method-is-strict.js");

var STRICT_METHOD=arrayMethodIsStrict('every');

// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
$({target:'Array',proto:true,forced:!STRICT_METHOD},{
every:function every(callbackfn/* , thisArg */){
return $every(this,callbackfn,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.fill.js":




function node_modulesCoreJsPureModulesEsArrayFillJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var fill=__webpack_require__(/*! ../internals/array-fill */"./node_modules/core-js-pure/internals/array-fill.js");
var addToUnscopables=__webpack_require__(/*! ../internals/add-to-unscopables */"./node_modules/core-js-pure/internals/add-to-unscopables.js");

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$({target:'Array',proto:true},{
fill:fill});


// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');


/***/},

/***/"./node_modules/core-js-pure/modules/es.array.filter.js":




function node_modulesCoreJsPureModulesEsArrayFilterJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $filter=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").filter;
var arrayMethodHasSpeciesSupport=__webpack_require__(/*! ../internals/array-method-has-species-support */"./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT=arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({target:'Array',proto:true,forced:!HAS_SPECIES_SUPPORT},{
filter:function filter(callbackfn/* , thisArg */){
return $filter(this,callbackfn,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.for-each.js":




function node_modulesCoreJsPureModulesEsArrayForEachJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var forEach=__webpack_require__(/*! ../internals/array-for-each */"./node_modules/core-js-pure/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({target:'Array',proto:true,forced:[].forEach!=forEach},{
forEach:forEach});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.from.js":




function node_modulesCoreJsPureModulesEsArrayFromJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var from=__webpack_require__(/*! ../internals/array-from */"./node_modules/core-js-pure/internals/array-from.js");
var checkCorrectnessOfIteration=__webpack_require__(/*! ../internals/check-correctness-of-iteration */"./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");

var INCORRECT_ITERATION=!checkCorrectnessOfIteration(function(iterable){
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({target:'Array',stat:true,forced:INCORRECT_ITERATION},{
from:from});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.includes.js":




function node_modulesCoreJsPureModulesEsArrayIncludesJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $includes=__webpack_require__(/*! ../internals/array-includes */"./node_modules/core-js-pure/internals/array-includes.js").includes;
var addToUnscopables=__webpack_require__(/*! ../internals/add-to-unscopables */"./node_modules/core-js-pure/internals/add-to-unscopables.js");

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({target:'Array',proto:true},{
includes:function includes(el/* , fromIndex = 0 */){
return $includes(this,el,arguments.length>1?arguments[1]:undefined);
}});


// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/},

/***/"./node_modules/core-js-pure/modules/es.array.index-of.js":




function node_modulesCoreJsPureModulesEsArrayIndexOfJs(module,exports,__webpack_require__){

/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $indexOf=__webpack_require__(/*! ../internals/array-includes */"./node_modules/core-js-pure/internals/array-includes.js").indexOf;
var arrayMethodIsStrict=__webpack_require__(/*! ../internals/array-method-is-strict */"./node_modules/core-js-pure/internals/array-method-is-strict.js");

var nativeIndexOf=[].indexOf;

var NEGATIVE_ZERO=!!nativeIndexOf&&1/[1].indexOf(1,-0)<0;
var STRICT_METHOD=arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({target:'Array',proto:true,forced:NEGATIVE_ZERO||!STRICT_METHOD},{
indexOf:function indexOf(searchElement/* , fromIndex = 0 */){
return NEGATIVE_ZERO
// convert -0 to +0
?nativeIndexOf.apply(this,arguments)||0:
$indexOf(this,searchElement,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.is-array.js":




function node_modulesCoreJsPureModulesEsArrayIsArrayJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({target:'Array',stat:true},{
isArray:isArray});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.iterator.js":




function node_modulesCoreJsPureModulesEsArrayIteratorJs(module,exports,__webpack_require__){

var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var addToUnscopables=__webpack_require__(/*! ../internals/add-to-unscopables */"./node_modules/core-js-pure/internals/add-to-unscopables.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator=__webpack_require__(/*! ../internals/define-iterator */"./node_modules/core-js-pure/internals/define-iterator.js");

var ARRAY_ITERATOR='Array Iterator';
var setInternalState=InternalStateModule.set;
var getInternalState=InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports=defineIterator(Array,'Array',function(iterated,kind){
setInternalState(this,{
type:ARRAY_ITERATOR,
target:toIndexedObject(iterated),// target
index:0,// next index
kind:kind// kind
});
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
},function(){
var state=getInternalState(this);
var target=state.target;
var kind=state.kind;
var index=state.index++;
if(!target||index>=target.length){
state.target=undefined;
return {value:undefined,done:true};
}
if(kind=='keys')return {value:index,done:false};
if(kind=='values')return {value:target[index],done:false};
return {value:[index,target[index]],done:false};
},'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments=Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/},

/***/"./node_modules/core-js-pure/modules/es.array.map.js":




function node_modulesCoreJsPureModulesEsArrayMapJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $map=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").map;
var arrayMethodHasSpeciesSupport=__webpack_require__(/*! ../internals/array-method-has-species-support */"./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT=arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({target:'Array',proto:true,forced:!HAS_SPECIES_SUPPORT},{
map:function map(callbackfn/* , thisArg */){
return $map(this,callbackfn,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.reduce.js":




function node_modulesCoreJsPureModulesEsArrayReduceJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $reduce=__webpack_require__(/*! ../internals/array-reduce */"./node_modules/core-js-pure/internals/array-reduce.js").left;
var arrayMethodIsStrict=__webpack_require__(/*! ../internals/array-method-is-strict */"./node_modules/core-js-pure/internals/array-method-is-strict.js");
var CHROME_VERSION=__webpack_require__(/*! ../internals/engine-v8-version */"./node_modules/core-js-pure/internals/engine-v8-version.js");
var IS_NODE=__webpack_require__(/*! ../internals/engine-is-node */"./node_modules/core-js-pure/internals/engine-is-node.js");

var STRICT_METHOD=arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG=!IS_NODE&&CHROME_VERSION>79&&CHROME_VERSION<83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({target:'Array',proto:true,forced:!STRICT_METHOD||CHROME_BUG},{
reduce:function reduce(callbackfn/* , initialValue */){
return $reduce(this,callbackfn,arguments.length,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.reverse.js":




function node_modulesCoreJsPureModulesEsArrayReverseJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");

var nativeReverse=[].reverse;
var test=[1,2];

// `Array.prototype.reverse` method
// https://tc39.es/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({target:'Array',proto:true,forced:String(test)===String(test.reverse())},{
reverse:function reverse(){
// eslint-disable-next-line no-self-assign -- dirty hack
if(isArray(this))this.length=this.length;
return nativeReverse.call(this);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.slice.js":




function node_modulesCoreJsPureModulesEsArraySliceJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");
var toAbsoluteIndex=__webpack_require__(/*! ../internals/to-absolute-index */"./node_modules/core-js-pure/internals/to-absolute-index.js");
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var createProperty=__webpack_require__(/*! ../internals/create-property */"./node_modules/core-js-pure/internals/create-property.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var arrayMethodHasSpeciesSupport=__webpack_require__(/*! ../internals/array-method-has-species-support */"./node_modules/core-js-pure/internals/array-method-has-species-support.js");

var HAS_SPECIES_SUPPORT=arrayMethodHasSpeciesSupport('slice');

var SPECIES=wellKnownSymbol('species');
var nativeSlice=[].slice;
var max=Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({target:'Array',proto:true,forced:!HAS_SPECIES_SUPPORT},{
slice:function slice(start,end){
var O=toIndexedObject(this);
var length=toLength(O.length);
var k=toAbsoluteIndex(start,length);
var fin=toAbsoluteIndex(end===undefined?length:end,length);
// inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
var Constructor,result,n;
if(isArray(O)){
Constructor=O.constructor;
// cross-realm fallback
if(typeof Constructor=='function'&&(Constructor===Array||isArray(Constructor.prototype))){
Constructor=undefined;
}else if(isObject(Constructor)){
Constructor=Constructor[SPECIES];
if(Constructor===null)Constructor=undefined;
}
if(Constructor===Array||Constructor===undefined){
return nativeSlice.call(O,k,fin);
}
}
result=new(Constructor===undefined?Array:Constructor)(max(fin-k,0));
for(n=0;k<fin;k++,n++){if(k in O)createProperty(result,n,O[k]);}
result.length=n;
return result;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.array.some.js":




function node_modulesCoreJsPureModulesEsArraySomeJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $some=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").some;
var arrayMethodIsStrict=__webpack_require__(/*! ../internals/array-method-is-strict */"./node_modules/core-js-pure/internals/array-method-is-strict.js");

var STRICT_METHOD=arrayMethodIsStrict('some');

// `Array.prototype.some` method
// https://tc39.es/ecma262/#sec-array.prototype.some
$({target:'Array',proto:true,forced:!STRICT_METHOD},{
some:function some(callbackfn/* , thisArg */){
return $some(this,callbackfn,arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.date.now.js":




function node_modulesCoreJsPureModulesEsDateNowJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");

// `Date.now` method
// https://tc39.es/ecma262/#sec-date.now
$({target:'Date',stat:true},{
now:function now(){
return new Date().getTime();
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.function.bind.js":




function node_modulesCoreJsPureModulesEsFunctionBindJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var bind=__webpack_require__(/*! ../internals/function-bind */"./node_modules/core-js-pure/internals/function-bind.js");

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
$({target:'Function',proto:true},{
bind:bind});



/***/},

/***/"./node_modules/core-js-pure/modules/es.json.to-string-tag.js":




function node_modulesCoreJsPureModulesEsJsonToStringTagJs(module,exports,__webpack_require__){

var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");

// JSON[@@toStringTag] property
// https://tc39.es/ecma262/#sec-json-@@tostringtag
setToStringTag(global.JSON,'JSON',true);


/***/},

/***/"./node_modules/core-js-pure/modules/es.map.js":




function node_modulesCoreJsPureModulesEsMapJs(module,exports,__webpack_require__){

var collection=__webpack_require__(/*! ../internals/collection */"./node_modules/core-js-pure/internals/collection.js");
var collectionStrong=__webpack_require__(/*! ../internals/collection-strong */"./node_modules/core-js-pure/internals/collection-strong.js");

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
module.exports=collection('Map',function(init){
return function Map(){return init(this,arguments.length?arguments[0]:undefined);};
},collectionStrong);


/***/},

/***/"./node_modules/core-js-pure/modules/es.math.to-string-tag.js":




function node_modulesCoreJsPureModulesEsMathToStringTagJs(module,exports){

// empty


/***/},

/***/"./node_modules/core-js-pure/modules/es.object.create.js":




function node_modulesCoreJsPureModulesEsObjectCreateJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var create=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({target:'Object',stat:true,sham:!DESCRIPTORS},{
create:create});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.define-properties.js":




function node_modulesCoreJsPureModulesEsObjectDefinePropertiesJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var defineProperties=__webpack_require__(/*! ../internals/object-define-properties */"./node_modules/core-js-pure/internals/object-define-properties.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
$({target:'Object',stat:true,forced:!DESCRIPTORS,sham:!DESCRIPTORS},{
defineProperties:defineProperties});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.define-property.js":




function node_modulesCoreJsPureModulesEsObjectDefinePropertyJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var objectDefinePropertyModile=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
$({target:'Object',stat:true,forced:!DESCRIPTORS,sham:!DESCRIPTORS},{
defineProperty:objectDefinePropertyModile.f});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.get-own-property-descriptor.js":




function node_modulesCoreJsPureModulesEsObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var nativeGetOwnPropertyDescriptor=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");

var FAILS_ON_PRIMITIVES=fails(function(){nativeGetOwnPropertyDescriptor(1);});
var FORCED=!DESCRIPTORS||FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
$({target:'Object',stat:true,forced:FORCED,sham:!DESCRIPTORS},{
getOwnPropertyDescriptor:function getOwnPropertyDescriptor(it,key){
return nativeGetOwnPropertyDescriptor(toIndexedObject(it),key);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.get-own-property-descriptors.js":




function node_modulesCoreJsPureModulesEsObjectGetOwnPropertyDescriptorsJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var ownKeys=__webpack_require__(/*! ../internals/own-keys */"./node_modules/core-js-pure/internals/own-keys.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var getOwnPropertyDescriptorModule=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var createProperty=__webpack_require__(/*! ../internals/create-property */"./node_modules/core-js-pure/internals/create-property.js");

// `Object.getOwnPropertyDescriptors` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
$({target:'Object',stat:true,sham:!DESCRIPTORS},{
getOwnPropertyDescriptors:function getOwnPropertyDescriptors(object){
var O=toIndexedObject(object);
var getOwnPropertyDescriptor=getOwnPropertyDescriptorModule.f;
var keys=ownKeys(O);
var result={};
var index=0;
var key,descriptor;
while(keys.length>index){
descriptor=getOwnPropertyDescriptor(O,key=keys[index++]);
if(descriptor!==undefined)createProperty(result,key,descriptor);
}
return result;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.get-prototype-of.js":




function node_modulesCoreJsPureModulesEsObjectGetPrototypeOfJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var nativeGetPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var CORRECT_PROTOTYPE_GETTER=__webpack_require__(/*! ../internals/correct-prototype-getter */"./node_modules/core-js-pure/internals/correct-prototype-getter.js");

var FAILS_ON_PRIMITIVES=fails(function(){nativeGetPrototypeOf(1);});

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
$({target:'Object',stat:true,forced:FAILS_ON_PRIMITIVES,sham:!CORRECT_PROTOTYPE_GETTER},{
getPrototypeOf:function getPrototypeOf(it){
return nativeGetPrototypeOf(toObject(it));
}});




/***/},

/***/"./node_modules/core-js-pure/modules/es.object.keys.js":




function node_modulesCoreJsPureModulesEsObjectKeysJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var nativeKeys=__webpack_require__(/*! ../internals/object-keys */"./node_modules/core-js-pure/internals/object-keys.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

var FAILS_ON_PRIMITIVES=fails(function(){nativeKeys(1);});

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({target:'Object',stat:true,forced:FAILS_ON_PRIMITIVES},{
keys:function keys(it){
return nativeKeys(toObject(it));
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.set-prototype-of.js":




function node_modulesCoreJsPureModulesEsObjectSetPrototypeOfJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var setPrototypeOf=__webpack_require__(/*! ../internals/object-set-prototype-of */"./node_modules/core-js-pure/internals/object-set-prototype-of.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({target:'Object',stat:true},{
setPrototypeOf:setPrototypeOf});



/***/},

/***/"./node_modules/core-js-pure/modules/es.object.to-string.js":




function node_modulesCoreJsPureModulesEsObjectToStringJs(module,exports){

// empty


/***/},

/***/"./node_modules/core-js-pure/modules/es.parse-float.js":




function node_modulesCoreJsPureModulesEsParseFloatJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var parseFloatImplementation=__webpack_require__(/*! ../internals/number-parse-float */"./node_modules/core-js-pure/internals/number-parse-float.js");

// `parseFloat` method
// https://tc39.es/ecma262/#sec-parsefloat-string
$({global:true,forced:parseFloat!=parseFloatImplementation},{
parseFloat:parseFloatImplementation});



/***/},

/***/"./node_modules/core-js-pure/modules/es.parse-int.js":




function node_modulesCoreJsPureModulesEsParseIntJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var parseIntImplementation=__webpack_require__(/*! ../internals/number-parse-int */"./node_modules/core-js-pure/internals/number-parse-int.js");

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({global:true,forced:parseInt!=parseIntImplementation},{
parseInt:parseIntImplementation});



/***/},

/***/"./node_modules/core-js-pure/modules/es.promise.all-settled.js":




function node_modulesCoreJsPureModulesEsPromiseAllSettledJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var newPromiseCapabilityModule=__webpack_require__(/*! ../internals/new-promise-capability */"./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform=__webpack_require__(/*! ../internals/perform */"./node_modules/core-js-pure/internals/perform.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");

// `Promise.allSettled` method
// https://tc39.es/ecma262/#sec-promise.allsettled
$({target:'Promise',stat:true},{
allSettled:function allSettled(iterable){
var C=this;
var capability=newPromiseCapabilityModule.f(C);
var resolve=capability.resolve;
var reject=capability.reject;
var result=perform(function(){
var promiseResolve=aFunction(C.resolve);
var values=[];
var counter=0;
var remaining=1;
iterate(iterable,function(promise){
var index=counter++;
var alreadyCalled=false;
values.push(undefined);
remaining++;
promiseResolve.call(C,promise).then(function(value){
if(alreadyCalled)return;
alreadyCalled=true;
values[index]={status:'fulfilled',value:value};
--remaining||resolve(values);
},function(error){
if(alreadyCalled)return;
alreadyCalled=true;
values[index]={status:'rejected',reason:error};
--remaining||resolve(values);
});
});
--remaining||resolve(values);
});
if(result.error)reject(result.value);
return capability.promise;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.promise.any.js":




function node_modulesCoreJsPureModulesEsPromiseAnyJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var newPromiseCapabilityModule=__webpack_require__(/*! ../internals/new-promise-capability */"./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform=__webpack_require__(/*! ../internals/perform */"./node_modules/core-js-pure/internals/perform.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");

var PROMISE_ANY_ERROR='No one promise resolved';

// `Promise.any` method
// https://tc39.es/ecma262/#sec-promise.any
$({target:'Promise',stat:true},{
any:function any(iterable){
var C=this;
var capability=newPromiseCapabilityModule.f(C);
var resolve=capability.resolve;
var reject=capability.reject;
var result=perform(function(){
var promiseResolve=aFunction(C.resolve);
var errors=[];
var counter=0;
var remaining=1;
var alreadyResolved=false;
iterate(iterable,function(promise){
var index=counter++;
var alreadyRejected=false;
errors.push(undefined);
remaining++;
promiseResolve.call(C,promise).then(function(value){
if(alreadyRejected||alreadyResolved)return;
alreadyResolved=true;
resolve(value);
},function(error){
if(alreadyRejected||alreadyResolved)return;
alreadyRejected=true;
errors[index]=error;
--remaining||reject(new(getBuiltIn('AggregateError'))(errors,PROMISE_ANY_ERROR));
});
});
--remaining||reject(new(getBuiltIn('AggregateError'))(errors,PROMISE_ANY_ERROR));
});
if(result.error)reject(result.value);
return capability.promise;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.promise.finally.js":




function node_modulesCoreJsPureModulesEsPromiseFinallyJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");
var NativePromise=__webpack_require__(/*! ../internals/native-promise-constructor */"./node_modules/core-js-pure/internals/native-promise-constructor.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var speciesConstructor=__webpack_require__(/*! ../internals/species-constructor */"./node_modules/core-js-pure/internals/species-constructor.js");
var promiseResolve=__webpack_require__(/*! ../internals/promise-resolve */"./node_modules/core-js-pure/internals/promise-resolve.js");
var redefine=__webpack_require__(/*! ../internals/redefine */"./node_modules/core-js-pure/internals/redefine.js");

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC=!!NativePromise&&fails(function(){
NativePromise.prototype['finally'].call({then:function then(){/* empty */}},function(){/* empty */});
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
$({target:'Promise',proto:true,real:true,forced:NON_GENERIC},{
'finally':function _finally(onFinally){
var C=speciesConstructor(this,getBuiltIn('Promise'));
var isFunction=typeof onFinally=='function';
return this.then(
isFunction?function(x){
return promiseResolve(C,onFinally()).then(function(){return x;});
}:onFinally,
isFunction?function(e){
return promiseResolve(C,onFinally()).then(function(){throw e;});
}:onFinally);

}});


// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
if(!IS_PURE&&typeof NativePromise=='function'){
var method=getBuiltIn('Promise').prototype['finally'];
if(NativePromise.prototype['finally']!==method){
redefine(NativePromise.prototype,'finally',method,{unsafe:true});
}
}


/***/},

/***/"./node_modules/core-js-pure/modules/es.promise.js":




function node_modulesCoreJsPureModulesEsPromiseJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var NativePromise=__webpack_require__(/*! ../internals/native-promise-constructor */"./node_modules/core-js-pure/internals/native-promise-constructor.js");
var redefine=__webpack_require__(/*! ../internals/redefine */"./node_modules/core-js-pure/internals/redefine.js");
var redefineAll=__webpack_require__(/*! ../internals/redefine-all */"./node_modules/core-js-pure/internals/redefine-all.js");
var setPrototypeOf=__webpack_require__(/*! ../internals/object-set-prototype-of */"./node_modules/core-js-pure/internals/object-set-prototype-of.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");
var setSpecies=__webpack_require__(/*! ../internals/set-species */"./node_modules/core-js-pure/internals/set-species.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var anInstance=__webpack_require__(/*! ../internals/an-instance */"./node_modules/core-js-pure/internals/an-instance.js");
var inspectSource=__webpack_require__(/*! ../internals/inspect-source */"./node_modules/core-js-pure/internals/inspect-source.js");
var iterate=__webpack_require__(/*! ../internals/iterate */"./node_modules/core-js-pure/internals/iterate.js");
var checkCorrectnessOfIteration=__webpack_require__(/*! ../internals/check-correctness-of-iteration */"./node_modules/core-js-pure/internals/check-correctness-of-iteration.js");
var speciesConstructor=__webpack_require__(/*! ../internals/species-constructor */"./node_modules/core-js-pure/internals/species-constructor.js");
var task=__webpack_require__(/*! ../internals/task */"./node_modules/core-js-pure/internals/task.js").set;
var microtask=__webpack_require__(/*! ../internals/microtask */"./node_modules/core-js-pure/internals/microtask.js");
var promiseResolve=__webpack_require__(/*! ../internals/promise-resolve */"./node_modules/core-js-pure/internals/promise-resolve.js");
var hostReportErrors=__webpack_require__(/*! ../internals/host-report-errors */"./node_modules/core-js-pure/internals/host-report-errors.js");
var newPromiseCapabilityModule=__webpack_require__(/*! ../internals/new-promise-capability */"./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform=__webpack_require__(/*! ../internals/perform */"./node_modules/core-js-pure/internals/perform.js");
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");
var isForced=__webpack_require__(/*! ../internals/is-forced */"./node_modules/core-js-pure/internals/is-forced.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var IS_BROWSER=__webpack_require__(/*! ../internals/engine-is-browser */"./node_modules/core-js-pure/internals/engine-is-browser.js");
var IS_NODE=__webpack_require__(/*! ../internals/engine-is-node */"./node_modules/core-js-pure/internals/engine-is-node.js");
var V8_VERSION=__webpack_require__(/*! ../internals/engine-v8-version */"./node_modules/core-js-pure/internals/engine-v8-version.js");

var SPECIES=wellKnownSymbol('species');
var PROMISE='Promise';
var getInternalState=InternalStateModule.get;
var setInternalState=InternalStateModule.set;
var getInternalPromiseState=InternalStateModule.getterFor(PROMISE);
var NativePromisePrototype=NativePromise&&NativePromise.prototype;
var PromiseConstructor=NativePromise;
var PromiseConstructorPrototype=NativePromisePrototype;
var TypeError=global.TypeError;
var document=global.document;
var process=global.process;
var newPromiseCapability=newPromiseCapabilityModule.f;
var newGenericPromiseCapability=newPromiseCapability;
var DISPATCH_EVENT=!!(document&&document.createEvent&&global.dispatchEvent);
var NATIVE_REJECTION_EVENT=typeof PromiseRejectionEvent=='function';
var UNHANDLED_REJECTION='unhandledrejection';
var REJECTION_HANDLED='rejectionhandled';
var PENDING=0;
var FULFILLED=1;
var REJECTED=2;
var HANDLED=1;
var UNHANDLED=2;
var SUBCLASSING=false;
var Internal,OwnPromiseCapability,PromiseWrapper,nativeThen;

var FORCED=isForced(PROMISE,function(){
var PROMISE_CONSTRUCTOR_SOURCE=inspectSource(PromiseConstructor);
var GLOBAL_CORE_JS_PROMISE=PROMISE_CONSTRUCTOR_SOURCE!==String(PromiseConstructor);
// V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
// https://bugs.chromium.org/p/chromium/issues/detail?id=830565
// We can't detect it synchronously, so just check versions
if(!GLOBAL_CORE_JS_PROMISE&&V8_VERSION===66)return true;
// We need Promise#finally in the pure version for preventing prototype pollution
if(IS_PURE&&!PromiseConstructorPrototype['finally'])return true;
// We can't use @@species feature detection in V8 since it causes
// deoptimization and performance degradation
// https://github.com/zloirock/core-js/issues/679
if(V8_VERSION>=51&&/native code/.test(PROMISE_CONSTRUCTOR_SOURCE))return false;
// Detect correctness of subclassing with @@species support
var promise=new PromiseConstructor(function(resolve){resolve(1);});
var FakePromise=function FakePromise(exec){
exec(function(){/* empty */},function(){/* empty */});
};
var constructor=promise.constructor={};
constructor[SPECIES]=FakePromise;
SUBCLASSING=promise.then(function(){/* empty */})instanceof FakePromise;
if(!SUBCLASSING)return true;
// Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return !GLOBAL_CORE_JS_PROMISE&&IS_BROWSER&&!NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION=FORCED||!checkCorrectnessOfIteration(function(iterable){
PromiseConstructor.all(iterable)['catch'](function(){/* empty */});
});

// helpers
var isThenable=function isThenable(it){
var then;
return isObject(it)&&typeof(then=it.then)=='function'?then:false;
};

var notify=function notify(state,isReject){
if(state.notified)return;
state.notified=true;
var chain=state.reactions;
microtask(function(){
var value=state.value;
var ok=state.state==FULFILLED;
var index=0;
// variable length - can't use forEach
while(chain.length>index){
var reaction=chain[index++];
var handler=ok?reaction.ok:reaction.fail;
var resolve=reaction.resolve;
var reject=reaction.reject;
var domain=reaction.domain;
var result,then,exited;
try{
if(handler){
if(!ok){
if(state.rejection===UNHANDLED)onHandleUnhandled(state);
state.rejection=HANDLED;
}
if(handler===true)result=value;else
{
if(domain)domain.enter();
result=handler(value);// can throw
if(domain){
domain.exit();
exited=true;
}
}
if(result===reaction.promise){
reject(TypeError('Promise-chain cycle'));
}else if(then=isThenable(result)){
then.call(result,resolve,reject);
}else resolve(result);
}else reject(value);
}catch(error){
if(domain&&!exited)domain.exit();
reject(error);
}
}
state.reactions=[];
state.notified=false;
if(isReject&&!state.rejection)onUnhandled(state);
});
};

var dispatchEvent=function dispatchEvent(name,promise,reason){
var event,handler;
if(DISPATCH_EVENT){
event=document.createEvent('Event');
event.promise=promise;
event.reason=reason;
event.initEvent(name,false,true);
global.dispatchEvent(event);
}else event={promise:promise,reason:reason};
if(!NATIVE_REJECTION_EVENT&&(handler=global['on'+name]))handler(event);else
if(name===UNHANDLED_REJECTION)hostReportErrors('Unhandled promise rejection',reason);
};

var onUnhandled=function onUnhandled(state){
task.call(global,function(){
var promise=state.facade;
var value=state.value;
var IS_UNHANDLED=isUnhandled(state);
var result;
if(IS_UNHANDLED){
result=perform(function(){
if(IS_NODE){
process.emit('unhandledRejection',value,promise);
}else dispatchEvent(UNHANDLED_REJECTION,promise,value);
});
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
state.rejection=IS_NODE||isUnhandled(state)?UNHANDLED:HANDLED;
if(result.error)throw result.value;
}
});
};

var isUnhandled=function isUnhandled(state){
return state.rejection!==HANDLED&&!state.parent;
};

var onHandleUnhandled=function onHandleUnhandled(state){
task.call(global,function(){
var promise=state.facade;
if(IS_NODE){
process.emit('rejectionHandled',promise);
}else dispatchEvent(REJECTION_HANDLED,promise,state.value);
});
};

var bind=function bind(fn,state,unwrap){
return function(value){
fn(state,value,unwrap);
};
};

var internalReject=function internalReject(state,value,unwrap){
if(state.done)return;
state.done=true;
if(unwrap)state=unwrap;
state.value=value;
state.state=REJECTED;
notify(state,true);
};

var internalResolve=function internalResolve(state,value,unwrap){
if(state.done)return;
state.done=true;
if(unwrap)state=unwrap;
try{
if(state.facade===value)throw TypeError("Promise can't be resolved itself");
var then=isThenable(value);
if(then){
microtask(function(){
var wrapper={done:false};
try{
then.call(value,
bind(internalResolve,wrapper,state),
bind(internalReject,wrapper,state));

}catch(error){
internalReject(wrapper,error,state);
}
});
}else {
state.value=value;
state.state=FULFILLED;
notify(state,false);
}
}catch(error){
internalReject({done:false},error,state);
}
};

// constructor polyfill
if(FORCED){
// 25.4.3.1 Promise(executor)
PromiseConstructor=function Promise(executor){
anInstance(this,PromiseConstructor,PROMISE);
aFunction(executor);
Internal.call(this);
var state=getInternalState(this);
try{
executor(bind(internalResolve,state),bind(internalReject,state));
}catch(error){
internalReject(state,error);
}
};
PromiseConstructorPrototype=PromiseConstructor.prototype;
// eslint-disable-next-line no-unused-vars -- required for `.length`
Internal=function Promise(executor){
setInternalState(this,{
type:PROMISE,
done:false,
notified:false,
parent:false,
reactions:[],
rejection:false,
state:PENDING,
value:undefined});

};
Internal.prototype=redefineAll(PromiseConstructorPrototype,{
// `Promise.prototype.then` method
// https://tc39.es/ecma262/#sec-promise.prototype.then
then:function then(onFulfilled,onRejected){
var state=getInternalPromiseState(this);
var reaction=newPromiseCapability(speciesConstructor(this,PromiseConstructor));
reaction.ok=typeof onFulfilled=='function'?onFulfilled:true;
reaction.fail=typeof onRejected=='function'&&onRejected;
reaction.domain=IS_NODE?process.domain:undefined;
state.parent=true;
state.reactions.push(reaction);
if(state.state!=PENDING)notify(state,false);
return reaction.promise;
},
// `Promise.prototype.catch` method
// https://tc39.es/ecma262/#sec-promise.prototype.catch
'catch':function _catch(onRejected){
return this.then(undefined,onRejected);
}});

OwnPromiseCapability=function OwnPromiseCapability(){
var promise=new Internal();
var state=getInternalState(promise);
this.promise=promise;
this.resolve=bind(internalResolve,state);
this.reject=bind(internalReject,state);
};
newPromiseCapabilityModule.f=newPromiseCapability=function newPromiseCapability(C){
return C===PromiseConstructor||C===PromiseWrapper?
new OwnPromiseCapability(C):
newGenericPromiseCapability(C);
};

if(!IS_PURE&&typeof NativePromise=='function'&&NativePromisePrototype!==Object.prototype){
nativeThen=NativePromisePrototype.then;

if(!SUBCLASSING){
// make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
redefine(NativePromisePrototype,'then',function then(onFulfilled,onRejected){
var that=this;
return new PromiseConstructor(function(resolve,reject){
nativeThen.call(that,resolve,reject);
}).then(onFulfilled,onRejected);
// https://github.com/zloirock/core-js/issues/640
},{unsafe:true});

// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
redefine(NativePromisePrototype,'catch',PromiseConstructorPrototype['catch'],{unsafe:true});
}

// make `.constructor === Promise` work for native promise-based APIs
try{
delete NativePromisePrototype.constructor;
}catch(error){/* empty */}

// make `instanceof Promise` work for native promise-based APIs
if(setPrototypeOf){
setPrototypeOf(NativePromisePrototype,PromiseConstructorPrototype);
}
}
}

$({global:true,wrap:true,forced:FORCED},{
Promise:PromiseConstructor});


setToStringTag(PromiseConstructor,PROMISE,false,true);
setSpecies(PROMISE);

PromiseWrapper=getBuiltIn(PROMISE);

// statics
$({target:PROMISE,stat:true,forced:FORCED},{
// `Promise.reject` method
// https://tc39.es/ecma262/#sec-promise.reject
reject:function reject(r){
var capability=newPromiseCapability(this);
capability.reject.call(undefined,r);
return capability.promise;
}});


$({target:PROMISE,stat:true,forced:IS_PURE||FORCED},{
// `Promise.resolve` method
// https://tc39.es/ecma262/#sec-promise.resolve
resolve:function resolve(x){
return promiseResolve(IS_PURE&&this===PromiseWrapper?PromiseConstructor:this,x);
}});


$({target:PROMISE,stat:true,forced:INCORRECT_ITERATION},{
// `Promise.all` method
// https://tc39.es/ecma262/#sec-promise.all
all:function all(iterable){
var C=this;
var capability=newPromiseCapability(C);
var resolve=capability.resolve;
var reject=capability.reject;
var result=perform(function(){
var $promiseResolve=aFunction(C.resolve);
var values=[];
var counter=0;
var remaining=1;
iterate(iterable,function(promise){
var index=counter++;
var alreadyCalled=false;
values.push(undefined);
remaining++;
$promiseResolve.call(C,promise).then(function(value){
if(alreadyCalled)return;
alreadyCalled=true;
values[index]=value;
--remaining||resolve(values);
},reject);
});
--remaining||resolve(values);
});
if(result.error)reject(result.value);
return capability.promise;
},
// `Promise.race` method
// https://tc39.es/ecma262/#sec-promise.race
race:function race(iterable){
var C=this;
var capability=newPromiseCapability(C);
var reject=capability.reject;
var result=perform(function(){
var $promiseResolve=aFunction(C.resolve);
iterate(iterable,function(promise){
$promiseResolve.call(C,promise).then(capability.resolve,reject);
});
});
if(result.error)reject(result.value);
return capability.promise;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.apply.js":




function node_modulesCoreJsPureModulesEsReflectApplyJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

var nativeApply=getBuiltIn('Reflect','apply');
var functionApply=Function.apply;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST=!fails(function(){
nativeApply(function(){/* empty */});
});

// `Reflect.apply` method
// https://tc39.es/ecma262/#sec-reflect.apply
$({target:'Reflect',stat:true,forced:OPTIONAL_ARGUMENTS_LIST},{
apply:function apply(target,thisArgument,argumentsList){
aFunction(target);
anObject(argumentsList);
return nativeApply?
nativeApply(target,thisArgument,argumentsList):
functionApply.call(target,thisArgument,argumentsList);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.construct.js":




function node_modulesCoreJsPureModulesEsReflectConstructJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var aFunction=__webpack_require__(/*! ../internals/a-function */"./node_modules/core-js-pure/internals/a-function.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var create=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");
var bind=__webpack_require__(/*! ../internals/function-bind */"./node_modules/core-js-pure/internals/function-bind.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");

var nativeConstruct=getBuiltIn('Reflect','construct');

// `Reflect.construct` method
// https://tc39.es/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG=fails(function(){
function F(){/* empty */}
return !(nativeConstruct(function(){/* empty */},[],F)instanceof F);
});
var ARGS_BUG=!fails(function(){
nativeConstruct(function(){/* empty */});
});
var FORCED=NEW_TARGET_BUG||ARGS_BUG;

$({target:'Reflect',stat:true,forced:FORCED,sham:FORCED},{
construct:function construct(Target,args/* , newTarget */){
aFunction(Target);
anObject(args);
var newTarget=arguments.length<3?Target:aFunction(arguments[2]);
if(ARGS_BUG&&!NEW_TARGET_BUG)return nativeConstruct(Target,args,newTarget);
if(Target==newTarget){
// w/o altered newTarget, optimization for 0-4 arguments
switch(args.length){
case 0:return new Target();
case 1:return new Target(args[0]);
case 2:return new Target(args[0],args[1]);
case 3:return new Target(args[0],args[1],args[2]);
case 4:return new Target(args[0],args[1],args[2],args[3]);}

// w/o altered newTarget, lot of arguments case
var $args=[null];
$args.push.apply($args,args);
return new(bind.apply(Target,$args))();
}
// with altered newTarget, not support built-in constructors
var proto=newTarget.prototype;
var instance=create(isObject(proto)?proto:Object.prototype);
var result=Function.apply.call(Target,instance,args);
return isObject(result)?result:instance;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.delete-property.js":




function node_modulesCoreJsPureModulesEsReflectDeletePropertyJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var getOwnPropertyDescriptor=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;

// `Reflect.deleteProperty` method
// https://tc39.es/ecma262/#sec-reflect.deleteproperty
$({target:'Reflect',stat:true},{
deleteProperty:function deleteProperty(target,propertyKey){
var descriptor=getOwnPropertyDescriptor(anObject(target),propertyKey);
return descriptor&&!descriptor.configurable?false:delete target[propertyKey];
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.get-prototype-of.js":




function node_modulesCoreJsPureModulesEsReflectGetPrototypeOfJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var objectGetPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");
var CORRECT_PROTOTYPE_GETTER=__webpack_require__(/*! ../internals/correct-prototype-getter */"./node_modules/core-js-pure/internals/correct-prototype-getter.js");

// `Reflect.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-reflect.getprototypeof
$({target:'Reflect',stat:true,sham:!CORRECT_PROTOTYPE_GETTER},{
getPrototypeOf:function getPrototypeOf(target){
return objectGetPrototypeOf(anObject(target));
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.get.js":




function node_modulesCoreJsPureModulesEsReflectGetJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var isDataDescriptor=__webpack_require__(/*! ../internals/is-data-descriptor */"./node_modules/core-js-pure/internals/is-data-descriptor.js");
var getOwnPropertyDescriptorModule=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var getPrototypeOf=__webpack_require__(/*! ../internals/object-get-prototype-of */"./node_modules/core-js-pure/internals/object-get-prototype-of.js");

// `Reflect.get` method
// https://tc39.es/ecma262/#sec-reflect.get
function get(target,propertyKey/* , receiver */){
var receiver=arguments.length<3?target:arguments[2];
var descriptor,prototype;
if(anObject(target)===receiver)return target[propertyKey];
descriptor=getOwnPropertyDescriptorModule.f(target,propertyKey);
if(descriptor)return isDataDescriptor(descriptor)?
descriptor.value:
descriptor.get===undefined?undefined:descriptor.get.call(receiver);
if(isObject(prototype=getPrototypeOf(target)))return get(prototype,propertyKey,receiver);
}

$({target:'Reflect',stat:true},{
get:get});



/***/},

/***/"./node_modules/core-js-pure/modules/es.reflect.to-string-tag.js":




function node_modulesCoreJsPureModulesEsReflectToStringTagJs(module,exports){

// empty


/***/},

/***/"./node_modules/core-js-pure/modules/es.string.includes.js":




function node_modulesCoreJsPureModulesEsStringIncludesJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var notARegExp=__webpack_require__(/*! ../internals/not-a-regexp */"./node_modules/core-js-pure/internals/not-a-regexp.js");
var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var correctIsRegExpLogic=__webpack_require__(/*! ../internals/correct-is-regexp-logic */"./node_modules/core-js-pure/internals/correct-is-regexp-logic.js");

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({target:'String',proto:true,forced:!correctIsRegExpLogic('includes')},{
includes:function includes(searchString/* , position = 0 */){
return !!~toString(requireObjectCoercible(this)).
indexOf(toString(notARegExp(searchString)),arguments.length>1?arguments[1]:undefined);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.string.iterator.js":




function node_modulesCoreJsPureModulesEsStringIteratorJs(module,exports,__webpack_require__){

var charAt=__webpack_require__(/*! ../internals/string-multibyte */"./node_modules/core-js-pure/internals/string-multibyte.js").charAt;
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");
var defineIterator=__webpack_require__(/*! ../internals/define-iterator */"./node_modules/core-js-pure/internals/define-iterator.js");

var STRING_ITERATOR='String Iterator';
var setInternalState=InternalStateModule.set;
var getInternalState=InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String,'String',function(iterated){
setInternalState(this,{
type:STRING_ITERATOR,
string:toString(iterated),
index:0});

// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
},function next(){
var state=getInternalState(this);
var string=state.string;
var index=state.index;
var point;
if(index>=string.length)return {value:undefined,done:true};
point=charAt(string,index);
state.index+=point.length;
return {value:point,done:false};
});


/***/},

/***/"./node_modules/core-js-pure/modules/es.string.starts-with.js":




function node_modulesCoreJsPureModulesEsStringStartsWithJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var getOwnPropertyDescriptor=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js").f;
var toLength=__webpack_require__(/*! ../internals/to-length */"./node_modules/core-js-pure/internals/to-length.js");
var toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var notARegExp=__webpack_require__(/*! ../internals/not-a-regexp */"./node_modules/core-js-pure/internals/not-a-regexp.js");
var requireObjectCoercible=__webpack_require__(/*! ../internals/require-object-coercible */"./node_modules/core-js-pure/internals/require-object-coercible.js");
var correctIsRegExpLogic=__webpack_require__(/*! ../internals/correct-is-regexp-logic */"./node_modules/core-js-pure/internals/correct-is-regexp-logic.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");

// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var $startsWith=''.startsWith;
var min=Math.min;

var CORRECT_IS_REGEXP_LOGIC=correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG=!IS_PURE&&!CORRECT_IS_REGEXP_LOGIC&&!!function(){
var descriptor=getOwnPropertyDescriptor(String.prototype,'startsWith');
return descriptor&&!descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({target:'String',proto:true,forced:!MDN_POLYFILL_BUG&&!CORRECT_IS_REGEXP_LOGIC},{
startsWith:function startsWith(searchString/* , position = 0 */){
var that=toString(requireObjectCoercible(this));
notARegExp(searchString);
var index=toLength(min(arguments.length>1?arguments[1]:undefined,that.length));
var search=toString(searchString);
return $startsWith?
$startsWith.call(that,search,index):
that.slice(index,index+search.length)===search;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.string.trim.js":




function node_modulesCoreJsPureModulesEsStringTrimJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var $trim=__webpack_require__(/*! ../internals/string-trim */"./node_modules/core-js-pure/internals/string-trim.js").trim;
var forcedStringTrimMethod=__webpack_require__(/*! ../internals/string-trim-forced */"./node_modules/core-js-pure/internals/string-trim-forced.js");

// `String.prototype.trim` method
// https://tc39.es/ecma262/#sec-string.prototype.trim
$({target:'String',proto:true,forced:forcedStringTrimMethod('trim')},{
trim:function trim(){
return $trim(this);
}});



/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.async-iterator.js":




function node_modulesCoreJsPureModulesEsSymbolAsyncIteratorJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.asyncIterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.description.js":




function node_modulesCoreJsPureModulesEsSymbolDescriptionJs(module,exports){

// empty


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.has-instance.js":




function node_modulesCoreJsPureModulesEsSymbolHasInstanceJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.hasInstance` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.is-concat-spreadable.js":




function node_modulesCoreJsPureModulesEsSymbolIsConcatSpreadableJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.iterator.js":




function node_modulesCoreJsPureModulesEsSymbolIteratorJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.js":




function node_modulesCoreJsPureModulesEsSymbolJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var getBuiltIn=__webpack_require__(/*! ../internals/get-built-in */"./node_modules/core-js-pure/internals/get-built-in.js");
var IS_PURE=__webpack_require__(/*! ../internals/is-pure */"./node_modules/core-js-pure/internals/is-pure.js");
var DESCRIPTORS=__webpack_require__(/*! ../internals/descriptors */"./node_modules/core-js-pure/internals/descriptors.js");
var NATIVE_SYMBOL=__webpack_require__(/*! ../internals/native-symbol */"./node_modules/core-js-pure/internals/native-symbol.js");
var fails=__webpack_require__(/*! ../internals/fails */"./node_modules/core-js-pure/internals/fails.js");
var has=__webpack_require__(/*! ../internals/has */"./node_modules/core-js-pure/internals/has.js");
var isArray=__webpack_require__(/*! ../internals/is-array */"./node_modules/core-js-pure/internals/is-array.js");
var isObject=__webpack_require__(/*! ../internals/is-object */"./node_modules/core-js-pure/internals/is-object.js");
var isSymbol=__webpack_require__(/*! ../internals/is-symbol */"./node_modules/core-js-pure/internals/is-symbol.js");
var anObject=__webpack_require__(/*! ../internals/an-object */"./node_modules/core-js-pure/internals/an-object.js");
var toObject=__webpack_require__(/*! ../internals/to-object */"./node_modules/core-js-pure/internals/to-object.js");
var toIndexedObject=__webpack_require__(/*! ../internals/to-indexed-object */"./node_modules/core-js-pure/internals/to-indexed-object.js");
var toPropertyKey=__webpack_require__(/*! ../internals/to-property-key */"./node_modules/core-js-pure/internals/to-property-key.js");
var $toString=__webpack_require__(/*! ../internals/to-string */"./node_modules/core-js-pure/internals/to-string.js");
var createPropertyDescriptor=__webpack_require__(/*! ../internals/create-property-descriptor */"./node_modules/core-js-pure/internals/create-property-descriptor.js");
var nativeObjectCreate=__webpack_require__(/*! ../internals/object-create */"./node_modules/core-js-pure/internals/object-create.js");
var objectKeys=__webpack_require__(/*! ../internals/object-keys */"./node_modules/core-js-pure/internals/object-keys.js");
var getOwnPropertyNamesModule=__webpack_require__(/*! ../internals/object-get-own-property-names */"./node_modules/core-js-pure/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternal=__webpack_require__(/*! ../internals/object-get-own-property-names-external */"./node_modules/core-js-pure/internals/object-get-own-property-names-external.js");
var getOwnPropertySymbolsModule=__webpack_require__(/*! ../internals/object-get-own-property-symbols */"./node_modules/core-js-pure/internals/object-get-own-property-symbols.js");
var getOwnPropertyDescriptorModule=__webpack_require__(/*! ../internals/object-get-own-property-descriptor */"./node_modules/core-js-pure/internals/object-get-own-property-descriptor.js");
var definePropertyModule=__webpack_require__(/*! ../internals/object-define-property */"./node_modules/core-js-pure/internals/object-define-property.js");
var propertyIsEnumerableModule=__webpack_require__(/*! ../internals/object-property-is-enumerable */"./node_modules/core-js-pure/internals/object-property-is-enumerable.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var redefine=__webpack_require__(/*! ../internals/redefine */"./node_modules/core-js-pure/internals/redefine.js");
var shared=__webpack_require__(/*! ../internals/shared */"./node_modules/core-js-pure/internals/shared.js");
var sharedKey=__webpack_require__(/*! ../internals/shared-key */"./node_modules/core-js-pure/internals/shared-key.js");
var hiddenKeys=__webpack_require__(/*! ../internals/hidden-keys */"./node_modules/core-js-pure/internals/hidden-keys.js");
var uid=__webpack_require__(/*! ../internals/uid */"./node_modules/core-js-pure/internals/uid.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");
var wrappedWellKnownSymbolModule=__webpack_require__(/*! ../internals/well-known-symbol-wrapped */"./node_modules/core-js-pure/internals/well-known-symbol-wrapped.js");
var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");
var setToStringTag=__webpack_require__(/*! ../internals/set-to-string-tag */"./node_modules/core-js-pure/internals/set-to-string-tag.js");
var InternalStateModule=__webpack_require__(/*! ../internals/internal-state */"./node_modules/core-js-pure/internals/internal-state.js");
var $forEach=__webpack_require__(/*! ../internals/array-iteration */"./node_modules/core-js-pure/internals/array-iteration.js").forEach;

var HIDDEN=sharedKey('hidden');
var SYMBOL='Symbol';
var PROTOTYPE='prototype';
var TO_PRIMITIVE=wellKnownSymbol('toPrimitive');
var setInternalState=InternalStateModule.set;
var getInternalState=InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype=Object[PROTOTYPE];
var $Symbol=global.Symbol;
var $stringify=getBuiltIn('JSON','stringify');
var nativeGetOwnPropertyDescriptor=getOwnPropertyDescriptorModule.f;
var nativeDefineProperty=definePropertyModule.f;
var nativeGetOwnPropertyNames=getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable=propertyIsEnumerableModule.f;
var AllSymbols=shared('symbols');
var ObjectPrototypeSymbols=shared('op-symbols');
var StringToSymbolRegistry=shared('string-to-symbol-registry');
var SymbolToStringRegistry=shared('symbol-to-string-registry');
var WellKnownSymbolsStore=shared('wks');
var QObject=global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER=!QObject||!QObject[PROTOTYPE]||!QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor=DESCRIPTORS&&fails(function(){
return nativeObjectCreate(nativeDefineProperty({},'a',{
get:function get(){return nativeDefineProperty(this,'a',{value:7}).a;}})).
a!=7;
})?function(O,P,Attributes){
var ObjectPrototypeDescriptor=nativeGetOwnPropertyDescriptor(ObjectPrototype,P);
if(ObjectPrototypeDescriptor)delete ObjectPrototype[P];
nativeDefineProperty(O,P,Attributes);
if(ObjectPrototypeDescriptor&&O!==ObjectPrototype){
nativeDefineProperty(ObjectPrototype,P,ObjectPrototypeDescriptor);
}
}:nativeDefineProperty;

var wrap=function wrap(tag,description){
var symbol=AllSymbols[tag]=nativeObjectCreate($Symbol[PROTOTYPE]);
setInternalState(symbol,{
type:SYMBOL,
tag:tag,
description:description});

if(!DESCRIPTORS)symbol.description=description;
return symbol;
};

var $defineProperty=function defineProperty(O,P,Attributes){
if(O===ObjectPrototype)$defineProperty(ObjectPrototypeSymbols,P,Attributes);
anObject(O);
var key=toPropertyKey(P);
anObject(Attributes);
if(has(AllSymbols,key)){
if(!Attributes.enumerable){
if(!has(O,HIDDEN))nativeDefineProperty(O,HIDDEN,createPropertyDescriptor(1,{}));
O[HIDDEN][key]=true;
}else {
if(has(O,HIDDEN)&&O[HIDDEN][key])O[HIDDEN][key]=false;
Attributes=nativeObjectCreate(Attributes,{enumerable:createPropertyDescriptor(0,false)});
}return setSymbolDescriptor(O,key,Attributes);
}return nativeDefineProperty(O,key,Attributes);
};

var $defineProperties=function defineProperties(O,Properties){
anObject(O);
var properties=toIndexedObject(Properties);
var keys=objectKeys(properties).concat($getOwnPropertySymbols(properties));
$forEach(keys,function(key){
if(!DESCRIPTORS||$propertyIsEnumerable.call(properties,key))$defineProperty(O,key,properties[key]);
});
return O;
};

var $create=function create(O,Properties){
return Properties===undefined?nativeObjectCreate(O):$defineProperties(nativeObjectCreate(O),Properties);
};

var $propertyIsEnumerable=function propertyIsEnumerable(V){
var P=toPropertyKey(V);
var enumerable=nativePropertyIsEnumerable.call(this,P);
if(this===ObjectPrototype&&has(AllSymbols,P)&&!has(ObjectPrototypeSymbols,P))return false;
return enumerable||!has(this,P)||!has(AllSymbols,P)||has(this,HIDDEN)&&this[HIDDEN][P]?enumerable:true;
};

var $getOwnPropertyDescriptor=function getOwnPropertyDescriptor(O,P){
var it=toIndexedObject(O);
var key=toPropertyKey(P);
if(it===ObjectPrototype&&has(AllSymbols,key)&&!has(ObjectPrototypeSymbols,key))return;
var descriptor=nativeGetOwnPropertyDescriptor(it,key);
if(descriptor&&has(AllSymbols,key)&&!(has(it,HIDDEN)&&it[HIDDEN][key])){
descriptor.enumerable=true;
}
return descriptor;
};

var $getOwnPropertyNames=function getOwnPropertyNames(O){
var names=nativeGetOwnPropertyNames(toIndexedObject(O));
var result=[];
$forEach(names,function(key){
if(!has(AllSymbols,key)&&!has(hiddenKeys,key))result.push(key);
});
return result;
};

var $getOwnPropertySymbols=function getOwnPropertySymbols(O){
var IS_OBJECT_PROTOTYPE=O===ObjectPrototype;
var names=nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE?ObjectPrototypeSymbols:toIndexedObject(O));
var result=[];
$forEach(names,function(key){
if(has(AllSymbols,key)&&(!IS_OBJECT_PROTOTYPE||has(ObjectPrototype,key))){
result.push(AllSymbols[key]);
}
});
return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if(!NATIVE_SYMBOL){
$Symbol=function Symbol(){
if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
var description=!arguments.length||arguments[0]===undefined?undefined:$toString(arguments[0]);
var tag=uid(description);
var setter=function setter(value){
if(this===ObjectPrototype)setter.call(ObjectPrototypeSymbols,value);
if(has(this,HIDDEN)&&has(this[HIDDEN],tag))this[HIDDEN][tag]=false;
setSymbolDescriptor(this,tag,createPropertyDescriptor(1,value));
};
if(DESCRIPTORS&&USE_SETTER)setSymbolDescriptor(ObjectPrototype,tag,{configurable:true,set:setter});
return wrap(tag,description);
};

redefine($Symbol[PROTOTYPE],'toString',function toString(){
return getInternalState(this).tag;
});

redefine($Symbol,'withoutSetter',function(description){
return wrap(uid(description),description);
});

propertyIsEnumerableModule.f=$propertyIsEnumerable;
definePropertyModule.f=$defineProperty;
getOwnPropertyDescriptorModule.f=$getOwnPropertyDescriptor;
getOwnPropertyNamesModule.f=getOwnPropertyNamesExternal.f=$getOwnPropertyNames;
getOwnPropertySymbolsModule.f=$getOwnPropertySymbols;

wrappedWellKnownSymbolModule.f=function(name){
return wrap(wellKnownSymbol(name),name);
};

if(DESCRIPTORS){
// https://github.com/tc39/proposal-Symbol-description
nativeDefineProperty($Symbol[PROTOTYPE],'description',{
configurable:true,
get:function description(){
return getInternalState(this).description;
}});

if(!IS_PURE){
redefine(ObjectPrototype,'propertyIsEnumerable',$propertyIsEnumerable,{unsafe:true});
}
}
}

$({global:true,wrap:true,forced:!NATIVE_SYMBOL,sham:!NATIVE_SYMBOL},{
Symbol:$Symbol});


$forEach(objectKeys(WellKnownSymbolsStore),function(name){
defineWellKnownSymbol(name);
});

$({target:SYMBOL,stat:true,forced:!NATIVE_SYMBOL},{
// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
'for':function _for(key){
var string=$toString(key);
if(has(StringToSymbolRegistry,string))return StringToSymbolRegistry[string];
var symbol=$Symbol(string);
StringToSymbolRegistry[string]=symbol;
SymbolToStringRegistry[symbol]=string;
return symbol;
},
// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
keyFor:function keyFor(sym){
if(!isSymbol(sym))throw TypeError(sym+' is not a symbol');
if(has(SymbolToStringRegistry,sym))return SymbolToStringRegistry[sym];
},
useSetter:function useSetter(){USE_SETTER=true;},
useSimple:function useSimple(){USE_SETTER=false;}});


$({target:'Object',stat:true,forced:!NATIVE_SYMBOL,sham:!DESCRIPTORS},{
// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
create:$create,
// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
defineProperty:$defineProperty,
// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
defineProperties:$defineProperties,
// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
getOwnPropertyDescriptor:$getOwnPropertyDescriptor});


$({target:'Object',stat:true,forced:!NATIVE_SYMBOL},{
// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
getOwnPropertyNames:$getOwnPropertyNames,
// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
getOwnPropertySymbols:$getOwnPropertySymbols});


// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({target:'Object',stat:true,forced:fails(function(){getOwnPropertySymbolsModule.f(1);})},{
getOwnPropertySymbols:function getOwnPropertySymbols(it){
return getOwnPropertySymbolsModule.f(toObject(it));
}});


// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if($stringify){
var FORCED_JSON_STRINGIFY=!NATIVE_SYMBOL||fails(function(){
var symbol=$Symbol();
// MS Edge converts symbol values to JSON as {}
return $stringify([symbol])!='[null]'
// WebKit converts symbol values to JSON as null
||$stringify({a:symbol})!='{}'
// V8 throws on boxed symbols
||$stringify(Object(symbol))!='{}';
});

$({target:'JSON',stat:true,forced:FORCED_JSON_STRINGIFY},{
// eslint-disable-next-line no-unused-vars -- required for `.length`
stringify:function stringify(it,replacer,space){
var args=[it];
var index=1;
var $replacer;
while(arguments.length>index){args.push(arguments[index++]);}
$replacer=replacer;
if(!isObject(replacer)&&it===undefined||isSymbol(it))return;// IE8 returns string on undefined
if(!isArray(replacer))replacer=function replacer(key,value){
if(typeof $replacer=='function')value=$replacer.call(this,key,value);
if(!isSymbol(value))return value;
};
args[1]=replacer;
return $stringify.apply(null,args);
}});

}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if(!$Symbol[PROTOTYPE][TO_PRIMITIVE]){
createNonEnumerableProperty($Symbol[PROTOTYPE],TO_PRIMITIVE,$Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol,SYMBOL);

hiddenKeys[HIDDEN]=true;


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.match-all.js":




function node_modulesCoreJsPureModulesEsSymbolMatchAllJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.matchAll` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.matchall
defineWellKnownSymbol('matchAll');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.match.js":




function node_modulesCoreJsPureModulesEsSymbolMatchJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.match` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.replace.js":




function node_modulesCoreJsPureModulesEsSymbolReplaceJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.replace` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.search.js":




function node_modulesCoreJsPureModulesEsSymbolSearchJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.search` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.species.js":




function node_modulesCoreJsPureModulesEsSymbolSpeciesJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.species` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.split.js":




function node_modulesCoreJsPureModulesEsSymbolSplitJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.split` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.to-primitive.js":




function node_modulesCoreJsPureModulesEsSymbolToPrimitiveJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.toPrimitive` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.to-string-tag.js":




function node_modulesCoreJsPureModulesEsSymbolToStringTagJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.toStringTag` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');


/***/},

/***/"./node_modules/core-js-pure/modules/es.symbol.unscopables.js":




function node_modulesCoreJsPureModulesEsSymbolUnscopablesJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.unscopables` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.aggregate-error.js":




function node_modulesCoreJsPureModulesEsnextAggregateErrorJs(module,exports,__webpack_require__){

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ./es.aggregate-error */"./node_modules/core-js-pure/modules/es.aggregate-error.js");


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.promise.all-settled.js":




function node_modulesCoreJsPureModulesEsnextPromiseAllSettledJs(module,exports,__webpack_require__){

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ./es.promise.all-settled.js */"./node_modules/core-js-pure/modules/es.promise.all-settled.js");


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.promise.any.js":




function node_modulesCoreJsPureModulesEsnextPromiseAnyJs(module,exports,__webpack_require__){

// TODO: Remove from `core-js@4`
__webpack_require__(/*! ./es.promise.any */"./node_modules/core-js-pure/modules/es.promise.any.js");


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.promise.try.js":




function node_modulesCoreJsPureModulesEsnextPromiseTryJs(module,exports,__webpack_require__){

var $=__webpack_require__(/*! ../internals/export */"./node_modules/core-js-pure/internals/export.js");
var newPromiseCapabilityModule=__webpack_require__(/*! ../internals/new-promise-capability */"./node_modules/core-js-pure/internals/new-promise-capability.js");
var perform=__webpack_require__(/*! ../internals/perform */"./node_modules/core-js-pure/internals/perform.js");

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$({target:'Promise',stat:true},{
'try':function _try(callbackfn){
var promiseCapability=newPromiseCapabilityModule.f(this);
var result=perform(callbackfn);
(result.error?promiseCapability.reject:promiseCapability.resolve)(result.value);
return promiseCapability.promise;
}});



/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.async-dispose.js":




function node_modulesCoreJsPureModulesEsnextSymbolAsyncDisposeJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.dispose.js":




function node_modulesCoreJsPureModulesEsnextSymbolDisposeJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.matcher.js":




function node_modulesCoreJsPureModulesEsnextSymbolMatcherJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.matcher` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('matcher');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.metadata.js":




function node_modulesCoreJsPureModulesEsnextSymbolMetadataJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.metadata` well-known symbol
// https://github.com/tc39/proposal-decorators
defineWellKnownSymbol('metadata');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.observable.js":




function node_modulesCoreJsPureModulesEsnextSymbolObservableJs(module,exports,__webpack_require__){

var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.pattern-match.js":




function node_modulesCoreJsPureModulesEsnextSymbolPatternMatchJs(module,exports,__webpack_require__){

// TODO: remove from `core-js@4`
var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/},

/***/"./node_modules/core-js-pure/modules/esnext.symbol.replace-all.js":




function node_modulesCoreJsPureModulesEsnextSymbolReplaceAllJs(module,exports,__webpack_require__){

// TODO: remove from `core-js@4`
var defineWellKnownSymbol=__webpack_require__(/*! ../internals/define-well-known-symbol */"./node_modules/core-js-pure/internals/define-well-known-symbol.js");

defineWellKnownSymbol('replaceAll');


/***/},

/***/"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js":




function node_modulesCoreJsPureModulesWebDomCollectionsIteratorJs(module,exports,__webpack_require__){

__webpack_require__(/*! ./es.array.iterator */"./node_modules/core-js-pure/modules/es.array.iterator.js");
var DOMIterables=__webpack_require__(/*! ../internals/dom-iterables */"./node_modules/core-js-pure/internals/dom-iterables.js");
var global=__webpack_require__(/*! ../internals/global */"./node_modules/core-js-pure/internals/global.js");
var classof=__webpack_require__(/*! ../internals/classof */"./node_modules/core-js-pure/internals/classof.js");
var createNonEnumerableProperty=__webpack_require__(/*! ../internals/create-non-enumerable-property */"./node_modules/core-js-pure/internals/create-non-enumerable-property.js");
var Iterators=__webpack_require__(/*! ../internals/iterators */"./node_modules/core-js-pure/internals/iterators.js");
var wellKnownSymbol=__webpack_require__(/*! ../internals/well-known-symbol */"./node_modules/core-js-pure/internals/well-known-symbol.js");

var TO_STRING_TAG=wellKnownSymbol('toStringTag');

for(var COLLECTION_NAME in DOMIterables){
var Collection=global[COLLECTION_NAME];
var CollectionPrototype=Collection&&Collection.prototype;
if(CollectionPrototype&&classof(CollectionPrototype)!==TO_STRING_TAG){
createNonEnumerableProperty(CollectionPrototype,TO_STRING_TAG,COLLECTION_NAME);
}
Iterators[COLLECTION_NAME]=Iterators.Array;
}


/***/},

/***/"./node_modules/core-js-pure/stable/array/from.js":




function node_modulesCoreJsPureStableArrayFromJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/array/from */"./node_modules/core-js-pure/es/array/from.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/array/is-array.js":




function node_modulesCoreJsPureStableArrayIsArrayJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/array/is-array */"./node_modules/core-js-pure/es/array/is-array.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/array/virtual/for-each.js":




function node_modulesCoreJsPureStableArrayVirtualForEachJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../../es/array/virtual/for-each */"./node_modules/core-js-pure/es/array/virtual/for-each.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/array/virtual/values.js":




function node_modulesCoreJsPureStableArrayVirtualValuesJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../../es/array/virtual/values */"./node_modules/core-js-pure/es/array/virtual/values.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/date/now.js":




function node_modulesCoreJsPureStableDateNowJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/date/now */"./node_modules/core-js-pure/es/date/now.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/get-iterator-method.js":




function node_modulesCoreJsPureStableGetIteratorMethodJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../es/get-iterator-method */"./node_modules/core-js-pure/es/get-iterator-method.js");
__webpack_require__(/*! ../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/get-iterator.js":




function node_modulesCoreJsPureStableGetIteratorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../es/get-iterator */"./node_modules/core-js-pure/es/get-iterator.js");
__webpack_require__(/*! ../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/bind.js":




function node_modulesCoreJsPureStableInstanceBindJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/bind */"./node_modules/core-js-pure/es/instance/bind.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/concat.js":




function node_modulesCoreJsPureStableInstanceConcatJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/concat */"./node_modules/core-js-pure/es/instance/concat.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/every.js":




function node_modulesCoreJsPureStableInstanceEveryJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/every */"./node_modules/core-js-pure/es/instance/every.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/fill.js":




function node_modulesCoreJsPureStableInstanceFillJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/fill */"./node_modules/core-js-pure/es/instance/fill.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/filter.js":




function node_modulesCoreJsPureStableInstanceFilterJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/filter */"./node_modules/core-js-pure/es/instance/filter.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/for-each.js":




function node_modulesCoreJsPureStableInstanceForEachJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");
var forEach=__webpack_require__(/*! ../array/virtual/for-each */"./node_modules/core-js-pure/stable/array/virtual/for-each.js");
var classof=__webpack_require__(/*! ../../internals/classof */"./node_modules/core-js-pure/internals/classof.js");
var ArrayPrototype=Array.prototype;

var DOMIterables={
DOMTokenList:true,
NodeList:true};


module.exports=function(it){
var own=it.forEach;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.forEach
// eslint-disable-next-line no-prototype-builtins -- safe
||DOMIterables.hasOwnProperty(classof(it))?forEach:own;
};


/***/},

/***/"./node_modules/core-js-pure/stable/instance/includes.js":




function node_modulesCoreJsPureStableInstanceIncludesJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/includes */"./node_modules/core-js-pure/es/instance/includes.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/index-of.js":




function node_modulesCoreJsPureStableInstanceIndexOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/index-of */"./node_modules/core-js-pure/es/instance/index-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/map.js":




function node_modulesCoreJsPureStableInstanceMapJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/map */"./node_modules/core-js-pure/es/instance/map.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/reduce.js":




function node_modulesCoreJsPureStableInstanceReduceJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/reduce */"./node_modules/core-js-pure/es/instance/reduce.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/reverse.js":




function node_modulesCoreJsPureStableInstanceReverseJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/reverse */"./node_modules/core-js-pure/es/instance/reverse.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/slice.js":




function node_modulesCoreJsPureStableInstanceSliceJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/slice */"./node_modules/core-js-pure/es/instance/slice.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/some.js":




function node_modulesCoreJsPureStableInstanceSomeJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/some */"./node_modules/core-js-pure/es/instance/some.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/starts-with.js":




function node_modulesCoreJsPureStableInstanceStartsWithJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/starts-with */"./node_modules/core-js-pure/es/instance/starts-with.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/trim.js":




function node_modulesCoreJsPureStableInstanceTrimJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/instance/trim */"./node_modules/core-js-pure/es/instance/trim.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/instance/values.js":




function node_modulesCoreJsPureStableInstanceValuesJs(module,exports,__webpack_require__){

__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");
var values=__webpack_require__(/*! ../array/virtual/values */"./node_modules/core-js-pure/stable/array/virtual/values.js");
var classof=__webpack_require__(/*! ../../internals/classof */"./node_modules/core-js-pure/internals/classof.js");
var ArrayPrototype=Array.prototype;

var DOMIterables={
DOMTokenList:true,
NodeList:true};


module.exports=function(it){
var own=it.values;
return it===ArrayPrototype||it instanceof Array&&own===ArrayPrototype.values
// eslint-disable-next-line no-prototype-builtins -- safe
||DOMIterables.hasOwnProperty(classof(it))?values:own;
};


/***/},

/***/"./node_modules/core-js-pure/stable/map/index.js":




function node_modulesCoreJsPureStableMapIndexJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/map */"./node_modules/core-js-pure/es/map/index.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/create.js":




function node_modulesCoreJsPureStableObjectCreateJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/create */"./node_modules/core-js-pure/es/object/create.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/define-properties.js":




function node_modulesCoreJsPureStableObjectDefinePropertiesJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/define-properties */"./node_modules/core-js-pure/es/object/define-properties.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/define-property.js":




function node_modulesCoreJsPureStableObjectDefinePropertyJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/define-property */"./node_modules/core-js-pure/es/object/define-property.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/get-own-property-descriptor.js":




function node_modulesCoreJsPureStableObjectGetOwnPropertyDescriptorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/get-own-property-descriptor */"./node_modules/core-js-pure/es/object/get-own-property-descriptor.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/get-own-property-descriptors.js":




function node_modulesCoreJsPureStableObjectGetOwnPropertyDescriptorsJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/get-own-property-descriptors */"./node_modules/core-js-pure/es/object/get-own-property-descriptors.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/get-own-property-symbols.js":




function node_modulesCoreJsPureStableObjectGetOwnPropertySymbolsJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/get-own-property-symbols */"./node_modules/core-js-pure/es/object/get-own-property-symbols.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/get-prototype-of.js":




function node_modulesCoreJsPureStableObjectGetPrototypeOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/get-prototype-of */"./node_modules/core-js-pure/es/object/get-prototype-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/keys.js":




function node_modulesCoreJsPureStableObjectKeysJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/keys */"./node_modules/core-js-pure/es/object/keys.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/object/set-prototype-of.js":




function node_modulesCoreJsPureStableObjectSetPrototypeOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/object/set-prototype-of */"./node_modules/core-js-pure/es/object/set-prototype-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/parse-float.js":




function node_modulesCoreJsPureStableParseFloatJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../es/parse-float */"./node_modules/core-js-pure/es/parse-float.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/parse-int.js":




function node_modulesCoreJsPureStableParseIntJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../es/parse-int */"./node_modules/core-js-pure/es/parse-int.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/promise/index.js":




function node_modulesCoreJsPureStablePromiseIndexJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/promise */"./node_modules/core-js-pure/es/promise/index.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/reflect/apply.js":




function node_modulesCoreJsPureStableReflectApplyJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/reflect/apply */"./node_modules/core-js-pure/es/reflect/apply.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/reflect/construct.js":




function node_modulesCoreJsPureStableReflectConstructJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/reflect/construct */"./node_modules/core-js-pure/es/reflect/construct.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/reflect/delete-property.js":




function node_modulesCoreJsPureStableReflectDeletePropertyJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/reflect/delete-property */"./node_modules/core-js-pure/es/reflect/delete-property.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/reflect/get-prototype-of.js":




function node_modulesCoreJsPureStableReflectGetPrototypeOfJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/reflect/get-prototype-of */"./node_modules/core-js-pure/es/reflect/get-prototype-of.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/reflect/get.js":




function node_modulesCoreJsPureStableReflectGetJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/reflect/get */"./node_modules/core-js-pure/es/reflect/get.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/symbol/index.js":




function node_modulesCoreJsPureStableSymbolIndexJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/symbol */"./node_modules/core-js-pure/es/symbol/index.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/core-js-pure/stable/symbol/iterator.js":




function node_modulesCoreJsPureStableSymbolIteratorJs(module,exports,__webpack_require__){

var parent=__webpack_require__(/*! ../../es/symbol/iterator */"./node_modules/core-js-pure/es/symbol/iterator.js");
__webpack_require__(/*! ../../modules/web.dom-collections.iterator */"./node_modules/core-js-pure/modules/web.dom-collections.iterator.js");

module.exports=parent;


/***/},

/***/"./node_modules/performance-now/lib/performance-now.js":




function node_modulesPerformanceNowLibPerformanceNowJs(module,exports,__webpack_require__){

/* WEBPACK VAR INJECTION */(function(process){// Generated by CoffeeScript 1.12.2
(function(){
var getNanoSeconds,hrtime,loadTime,moduleLoadTime,nodeLoadTime,upTime;

if(typeof performance!=="undefined"&&performance!==null&&performance.now){
module.exports=function(){
return performance.now();
};
}else if(typeof process!=="undefined"&&process!==null&&process.hrtime){
module.exports=function(){
return (getNanoSeconds()-nodeLoadTime)/1e6;
};
hrtime=process.hrtime;
getNanoSeconds=function getNanoSeconds(){
var hr;
hr=hrtime();
return hr[0]*1e9+hr[1];
};
moduleLoadTime=getNanoSeconds();
upTime=process.uptime()*1e9;
nodeLoadTime=moduleLoadTime-upTime;
}else if(Date.now){
module.exports=function(){
return Date.now()-loadTime;
};
loadTime=Date.now();
}else {
module.exports=function(){
return new Date().getTime()-loadTime;
};
loadTime=new Date().getTime();
}

}).call(this);



/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(/*! ./../../process/browser.js */"./node_modules/process/browser.js"));

/***/},

/***/"./node_modules/raf/index.js":




function node_modulesRafIndexJs(module,exports,__webpack_require__){

/* WEBPACK VAR INJECTION */(function(global){var now=__webpack_require__(/*! performance-now */"./node_modules/performance-now/lib/performance-now.js"),
root=typeof window==='undefined'?global:window,
vendors=['moz','webkit'],
suffix='AnimationFrame',
raf=root['request'+suffix],
caf=root['cancel'+suffix]||root['cancelRequest'+suffix];

for(var i=0;!raf&&i<vendors.length;i++){
raf=root[vendors[i]+'Request'+suffix];
caf=root[vendors[i]+'Cancel'+suffix]||
root[vendors[i]+'CancelRequest'+suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf||!caf){
var last=0,
id=0,
queue=[],
frameDuration=1000/60;

raf=function raf(callback){
if(queue.length===0){
var _now=now(),
next=Math.max(0,frameDuration-(_now-last));
last=next+_now;
setTimeout(function(){
var cp=queue.slice(0);
// Clear queue here to prevent
// callbacks from appending listeners
// to the current frame's queue
queue.length=0;
for(var i=0;i<cp.length;i++){
if(!cp[i].cancelled){
try{
cp[i].callback(last);
}catch(e){
setTimeout(function(){throw e;},0);
}
}
}
},Math.round(next));
}
queue.push({
handle:++id,
callback:callback,
cancelled:false});

return id;
};

caf=function caf(handle){
for(var i=0;i<queue.length;i++){
if(queue[i].handle===handle){
queue[i].cancelled=true;
}
}
};
}

module.exports=function(fn){
// Wrap in a new function to prevent
// `cancel` potentially being assigned
// to the native rAF function
return raf.call(root,fn);
};
module.exports.cancel=function(){
caf.apply(root,arguments);
};
module.exports.polyfill=function(object){
if(!object){
object=root;
}
object.requestAnimationFrame=raf;
object.cancelAnimationFrame=caf;
};

/* WEBPACK VAR INJECTION */}).call(this,__webpack_require__(/*! ./../webpack/buildin/global.js */"./node_modules/webpack/buildin/global.js"));

/***/},

/***/"./node_modules/rgbcolor/index.js":




function node_modulesRgbcolorIndexJs(module,exports){

/*
	Based on rgbcolor.js by Stoyan Stefanov <sstoo@gmail.com>
	http://www.phpied.com/rgb-color-parser-in-javascript/
*/

module.exports=function(color_string){
this.ok=false;
this.alpha=1.0;

// strip any leading #
if(color_string.charAt(0)=='#'){// remove # if any
color_string=color_string.substr(1,6);
}

color_string=color_string.replace(/ /g,'');
color_string=color_string.toLowerCase();

// before getting into regexps, try simple matches
// and overwrite the input
var simple_colors={
aliceblue:'f0f8ff',
antiquewhite:'faebd7',
aqua:'00ffff',
aquamarine:'7fffd4',
azure:'f0ffff',
beige:'f5f5dc',
bisque:'ffe4c4',
black:'000000',
blanchedalmond:'ffebcd',
blue:'0000ff',
blueviolet:'8a2be2',
brown:'a52a2a',
burlywood:'deb887',
cadetblue:'5f9ea0',
chartreuse:'7fff00',
chocolate:'d2691e',
coral:'ff7f50',
cornflowerblue:'6495ed',
cornsilk:'fff8dc',
crimson:'dc143c',
cyan:'00ffff',
darkblue:'00008b',
darkcyan:'008b8b',
darkgoldenrod:'b8860b',
darkgray:'a9a9a9',
darkgreen:'006400',
darkkhaki:'bdb76b',
darkmagenta:'8b008b',
darkolivegreen:'556b2f',
darkorange:'ff8c00',
darkorchid:'9932cc',
darkred:'8b0000',
darksalmon:'e9967a',
darkseagreen:'8fbc8f',
darkslateblue:'483d8b',
darkslategray:'2f4f4f',
darkturquoise:'00ced1',
darkviolet:'9400d3',
deeppink:'ff1493',
deepskyblue:'00bfff',
dimgray:'696969',
dodgerblue:'1e90ff',
feldspar:'d19275',
firebrick:'b22222',
floralwhite:'fffaf0',
forestgreen:'228b22',
fuchsia:'ff00ff',
gainsboro:'dcdcdc',
ghostwhite:'f8f8ff',
gold:'ffd700',
goldenrod:'daa520',
gray:'808080',
green:'008000',
greenyellow:'adff2f',
honeydew:'f0fff0',
hotpink:'ff69b4',
indianred:'cd5c5c',
indigo:'4b0082',
ivory:'fffff0',
khaki:'f0e68c',
lavender:'e6e6fa',
lavenderblush:'fff0f5',
lawngreen:'7cfc00',
lemonchiffon:'fffacd',
lightblue:'add8e6',
lightcoral:'f08080',
lightcyan:'e0ffff',
lightgoldenrodyellow:'fafad2',
lightgrey:'d3d3d3',
lightgreen:'90ee90',
lightpink:'ffb6c1',
lightsalmon:'ffa07a',
lightseagreen:'20b2aa',
lightskyblue:'87cefa',
lightslateblue:'8470ff',
lightslategray:'778899',
lightsteelblue:'b0c4de',
lightyellow:'ffffe0',
lime:'00ff00',
limegreen:'32cd32',
linen:'faf0e6',
magenta:'ff00ff',
maroon:'800000',
mediumaquamarine:'66cdaa',
mediumblue:'0000cd',
mediumorchid:'ba55d3',
mediumpurple:'9370d8',
mediumseagreen:'3cb371',
mediumslateblue:'7b68ee',
mediumspringgreen:'00fa9a',
mediumturquoise:'48d1cc',
mediumvioletred:'c71585',
midnightblue:'191970',
mintcream:'f5fffa',
mistyrose:'ffe4e1',
moccasin:'ffe4b5',
navajowhite:'ffdead',
navy:'000080',
oldlace:'fdf5e6',
olive:'808000',
olivedrab:'6b8e23',
orange:'ffa500',
orangered:'ff4500',
orchid:'da70d6',
palegoldenrod:'eee8aa',
palegreen:'98fb98',
paleturquoise:'afeeee',
palevioletred:'d87093',
papayawhip:'ffefd5',
peachpuff:'ffdab9',
peru:'cd853f',
pink:'ffc0cb',
plum:'dda0dd',
powderblue:'b0e0e6',
purple:'800080',
rebeccapurple:'663399',
red:'ff0000',
rosybrown:'bc8f8f',
royalblue:'4169e1',
saddlebrown:'8b4513',
salmon:'fa8072',
sandybrown:'f4a460',
seagreen:'2e8b57',
seashell:'fff5ee',
sienna:'a0522d',
silver:'c0c0c0',
skyblue:'87ceeb',
slateblue:'6a5acd',
slategray:'708090',
snow:'fffafa',
springgreen:'00ff7f',
steelblue:'4682b4',
tan:'d2b48c',
teal:'008080',
thistle:'d8bfd8',
tomato:'ff6347',
turquoise:'40e0d0',
violet:'ee82ee',
violetred:'d02090',
wheat:'f5deb3',
white:'ffffff',
whitesmoke:'f5f5f5',
yellow:'ffff00',
yellowgreen:'9acd32'};

color_string=simple_colors[color_string]||color_string;
// emd of simple type-in colors

// array of color definition objects
var color_defs=[
{
re:/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
example:['rgba(123, 234, 45, 0.8)','rgba(255,234,245,1.0)'],
process:function process(bits){
return [
parseInt(bits[1]),
parseInt(bits[2]),
parseInt(bits[3]),
parseFloat(bits[4])];

}},

{
re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
example:['rgb(123, 234, 45)','rgb(255,234,245)'],
process:function process(bits){
return [
parseInt(bits[1]),
parseInt(bits[2]),
parseInt(bits[3])];

}},

{
re:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
example:['#00ff00','336699'],
process:function process(bits){
return [
parseInt(bits[1],16),
parseInt(bits[2],16),
parseInt(bits[3],16)];

}},

{
re:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
example:['#fb0','f0f'],
process:function process(bits){
return [
parseInt(bits[1]+bits[1],16),
parseInt(bits[2]+bits[2],16),
parseInt(bits[3]+bits[3],16)];

}}];



// search through the definitions to find a match
for(var i=0;i<color_defs.length;i++){
var re=color_defs[i].re;
var processor=color_defs[i].process;
var bits=re.exec(color_string);
if(bits){
var channels=processor(bits);
this.r=channels[0];
this.g=channels[1];
this.b=channels[2];
if(channels.length>3){
this.alpha=channels[3];
}
this.ok=true;
}

}

// validate/cleanup values
this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r;
this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g;
this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b;
this.alpha=this.alpha<0?0:this.alpha>1.0||isNaN(this.alpha)?1.0:this.alpha;

// some getters
this.toRGB=function(){
return 'rgb('+this.r+', '+this.g+', '+this.b+')';
};
this.toRGBA=function(){
return 'rgba('+this.r+', '+this.g+', '+this.b+', '+this.alpha+')';
};
this.toHex=function(){
var r=this.r.toString(16);
var g=this.g.toString(16);
var b=this.b.toString(16);
if(r.length==1)r='0'+r;
if(g.length==1)g='0'+g;
if(b.length==1)b='0'+b;
return '#'+r+g+b;
};

// help
this.getHelpXML=function(){

var examples=new Array();
// add regexps
for(var i=0;i<color_defs.length;i++){
var example=color_defs[i].example;
for(var j=0;j<example.length;j++){
examples[examples.length]=example[j];
}
}
// add type-in colors
for(var sc in simple_colors){
examples[examples.length]=sc;
}

var xml=document.createElement('ul');
xml.setAttribute('id','rgbcolor-examples');
for(var i=0;i<examples.length;i++){
try{
var list_item=document.createElement('li');
var list_color=new RGBColor(examples[i]);
var example_div=document.createElement('div');
example_div.style.cssText=
'margin: 3px; '+
'border: 1px solid black; '+
'background:'+list_color.toHex()+'; '+
'color:'+list_color.toHex();

example_div.appendChild(document.createTextNode('test'));
var list_item_value=document.createTextNode(
' '+examples[i]+' -> '+list_color.toRGB()+' -> '+list_color.toHex());

list_item.appendChild(example_div);
list_item.appendChild(list_item_value);
xml.appendChild(list_item);

}catch(e){}
}
return xml;

};

};


/***/},

/***/"./node_modules/stackblur-canvas/dist/stackblur-es.js":




function node_modulesStackblurCanvasDistStackblurEsJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"BlurStack",function(){return BlurStack;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"canvasRGB",function(){return processCanvasRGB;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"canvasRGBA",function(){return processCanvasRGBA;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"image",function(){return processImage;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"imageDataRGB",function(){return processImageDataRGB;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"imageDataRGBA",function(){return processImageDataRGBA;});
function _typeof(obj){
"@babel/helpers - typeof";

if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){
_typeof=function _typeof(obj){
return typeof obj;
};
}else {
_typeof=function _typeof(obj){
return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;
};
}

return _typeof(obj);
}

function _classCallCheck(instance,Constructor){
if(!(instance instanceof Constructor)){
throw new TypeError("Cannot call a class as a function");
}
}

/* eslint-disable no-bitwise -- used for calculations */

/* eslint-disable unicorn/prefer-query-selector -- aiming at
  backward-compatibility */

/**
* StackBlur - a fast almost Gaussian Blur For Canvas
*
* In case you find this class useful - especially in commercial projects -
* I am not totally unhappy for a small donation to my PayPal account
* mario@quasimondo.de
*
* Or support me on flattr:
* {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
*
* @module StackBlur
* @author Mario Klingemann
* Contact: mario@quasimondo.com
* Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
* Twitter: @quasimondo
*
* @copyright (c) 2010 Mario Klingemann
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
var mulTable=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
var shgTable=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];
/**
 * @param {string|HTMLImageElement} img
 * @param {string|HTMLCanvasElement} canvas
 * @param {Float} radius
 * @param {boolean} blurAlphaChannel
 * @param {boolean} useOffset
 * @param {boolean} skipStyles
 * @returns {undefined}
 */

function processImage(img,canvas,radius,blurAlphaChannel,useOffset,skipStyles){
if(typeof img==='string'){
img=document.getElementById(img);
}

if(!img||!('naturalWidth'in img)){
return;
}

var dimensionType=useOffset?'offset':'natural';
var w=img[dimensionType+'Width'];
var h=img[dimensionType+'Height'];

if(typeof canvas==='string'){
canvas=document.getElementById(canvas);
}

if(!canvas||!('getContext'in canvas)){
return;
}

if(!skipStyles){
canvas.style.width=w+'px';
canvas.style.height=h+'px';
}

canvas.width=w;
canvas.height=h;
var context=canvas.getContext('2d');
context.clearRect(0,0,w,h);
context.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,0,0,w,h);

if(isNaN(radius)||radius<1){
return;
}

if(blurAlphaChannel){
processCanvasRGBA(canvas,0,0,w,h,radius);
}else {
processCanvasRGB(canvas,0,0,w,h,radius);
}
}
/**
 * @param {string|HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @throws {Error|TypeError}
 * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
 */


function getImageDataFromCanvas(canvas,topX,topY,width,height){
if(typeof canvas==='string'){
canvas=document.getElementById(canvas);
}

if(!canvas||_typeof(canvas)!=='object'||!('getContext'in canvas)){
throw new TypeError('Expecting canvas with `getContext` method '+'in processCanvasRGB(A) calls!');
}

var context=canvas.getContext('2d');

try{
return context.getImageData(topX,topY,width,height);
}catch(e){
throw new Error('unable to access image data: '+e);
}
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGBA(canvas,topX,topY,width,height,radius){
if(isNaN(radius)||radius<1){
return;
}

radius|=0;
var imageData=getImageDataFromCanvas(canvas,topX,topY,width,height);
imageData=processImageDataRGBA(imageData,topX,topY,width,height,radius);
canvas.getContext('2d').putImageData(imageData,topX,topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGBA(imageData,topX,topY,width,height,radius){
var pixels=imageData.data;
var div=2*radius+1;// const w4 = width << 2;

var widthMinus1=width-1;
var heightMinus1=height-1;
var radiusPlus1=radius+1;
var sumFactor=radiusPlus1*(radiusPlus1+1)/2;
var stackStart=new BlurStack();
var stack=stackStart;
var stackEnd;

for(var i=1;i<div;i++){
stack=stack.next=new BlurStack();

if(i===radiusPlus1){
stackEnd=stack;
}
}

stack.next=stackStart;
var stackIn=null,
stackOut=null,
yw=0,
yi=0;
var mulSum=mulTable[radius];
var shgSum=shgTable[radius];

for(var y=0;y<height;y++){
stack=stackStart;
var pr=pixels[yi],
pg=pixels[yi+1],
pb=pixels[yi+2],
pa=pixels[yi+3];

for(var _i=0;_i<radiusPlus1;_i++){
stack.r=pr;
stack.g=pg;
stack.b=pb;
stack.a=pa;
stack=stack.next;
}

var rInSum=0,
gInSum=0,
bInSum=0,
aInSum=0,
rOutSum=radiusPlus1*pr,
gOutSum=radiusPlus1*pg,
bOutSum=radiusPlus1*pb,
aOutSum=radiusPlus1*pa,
rSum=sumFactor*pr,
gSum=sumFactor*pg,
bSum=sumFactor*pb,
aSum=sumFactor*pa;

for(var _i2=1;_i2<radiusPlus1;_i2++){
var p=yi+((widthMinus1<_i2?widthMinus1:_i2)<<2);
var r=pixels[p],
g=pixels[p+1],
b=pixels[p+2],
a=pixels[p+3];
var rbs=radiusPlus1-_i2;
rSum+=(stack.r=r)*rbs;
gSum+=(stack.g=g)*rbs;
bSum+=(stack.b=b)*rbs;
aSum+=(stack.a=a)*rbs;
rInSum+=r;
gInSum+=g;
bInSum+=b;
aInSum+=a;
stack=stack.next;
}

stackIn=stackStart;
stackOut=stackEnd;

for(var x=0;x<width;x++){
var paInitial=aSum*mulSum>>shgSum;
pixels[yi+3]=paInitial;

if(paInitial!==0){
var _a2=255/paInitial;

pixels[yi]=(rSum*mulSum>>shgSum)*_a2;
pixels[yi+1]=(gSum*mulSum>>shgSum)*_a2;
pixels[yi+2]=(bSum*mulSum>>shgSum)*_a2;
}else {
pixels[yi]=pixels[yi+1]=pixels[yi+2]=0;
}

rSum-=rOutSum;
gSum-=gOutSum;
bSum-=bOutSum;
aSum-=aOutSum;
rOutSum-=stackIn.r;
gOutSum-=stackIn.g;
bOutSum-=stackIn.b;
aOutSum-=stackIn.a;

var _p=x+radius+1;

_p=yw+(_p<widthMinus1?_p:widthMinus1)<<2;
rInSum+=stackIn.r=pixels[_p];
gInSum+=stackIn.g=pixels[_p+1];
bInSum+=stackIn.b=pixels[_p+2];
aInSum+=stackIn.a=pixels[_p+3];
rSum+=rInSum;
gSum+=gInSum;
bSum+=bInSum;
aSum+=aInSum;
stackIn=stackIn.next;
var _stackOut=stackOut,
_r=_stackOut.r,
_g=_stackOut.g,
_b=_stackOut.b,
_a=_stackOut.a;
rOutSum+=_r;
gOutSum+=_g;
bOutSum+=_b;
aOutSum+=_a;
rInSum-=_r;
gInSum-=_g;
bInSum-=_b;
aInSum-=_a;
stackOut=stackOut.next;
yi+=4;
}

yw+=width;
}

for(var _x=0;_x<width;_x++){
yi=_x<<2;

var _pr=pixels[yi],
_pg=pixels[yi+1],
_pb=pixels[yi+2],
_pa=pixels[yi+3],
_rOutSum=radiusPlus1*_pr,
_gOutSum=radiusPlus1*_pg,
_bOutSum=radiusPlus1*_pb,
_aOutSum=radiusPlus1*_pa,
_rSum=sumFactor*_pr,
_gSum=sumFactor*_pg,
_bSum=sumFactor*_pb,
_aSum=sumFactor*_pa;

stack=stackStart;

for(var _i3=0;_i3<radiusPlus1;_i3++){
stack.r=_pr;
stack.g=_pg;
stack.b=_pb;
stack.a=_pa;
stack=stack.next;
}

var yp=width;
var _gInSum=0,
_bInSum=0,
_aInSum=0,
_rInSum=0;

for(var _i4=1;_i4<=radius;_i4++){
yi=yp+_x<<2;

var _rbs=radiusPlus1-_i4;

_rSum+=(stack.r=_pr=pixels[yi])*_rbs;
_gSum+=(stack.g=_pg=pixels[yi+1])*_rbs;
_bSum+=(stack.b=_pb=pixels[yi+2])*_rbs;
_aSum+=(stack.a=_pa=pixels[yi+3])*_rbs;
_rInSum+=_pr;
_gInSum+=_pg;
_bInSum+=_pb;
_aInSum+=_pa;
stack=stack.next;

if(_i4<heightMinus1){
yp+=width;
}
}

yi=_x;
stackIn=stackStart;
stackOut=stackEnd;

for(var _y=0;_y<height;_y++){
var _p2=yi<<2;

pixels[_p2+3]=_pa=_aSum*mulSum>>shgSum;

if(_pa>0){
_pa=255/_pa;
pixels[_p2]=(_rSum*mulSum>>shgSum)*_pa;
pixels[_p2+1]=(_gSum*mulSum>>shgSum)*_pa;
pixels[_p2+2]=(_bSum*mulSum>>shgSum)*_pa;
}else {
pixels[_p2]=pixels[_p2+1]=pixels[_p2+2]=0;
}

_rSum-=_rOutSum;
_gSum-=_gOutSum;
_bSum-=_bOutSum;
_aSum-=_aOutSum;
_rOutSum-=stackIn.r;
_gOutSum-=stackIn.g;
_bOutSum-=stackIn.b;
_aOutSum-=stackIn.a;
_p2=_x+((_p2=_y+radiusPlus1)<heightMinus1?_p2:heightMinus1)*width<<2;
_rSum+=_rInSum+=stackIn.r=pixels[_p2];
_gSum+=_gInSum+=stackIn.g=pixels[_p2+1];
_bSum+=_bInSum+=stackIn.b=pixels[_p2+2];
_aSum+=_aInSum+=stackIn.a=pixels[_p2+3];
stackIn=stackIn.next;
_rOutSum+=_pr=stackOut.r;
_gOutSum+=_pg=stackOut.g;
_bOutSum+=_pb=stackOut.b;
_aOutSum+=_pa=stackOut.a;
_rInSum-=_pr;
_gInSum-=_pg;
_bInSum-=_pb;
_aInSum-=_pa;
stackOut=stackOut.next;
yi+=width;
}
}

return imageData;
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGB(canvas,topX,topY,width,height,radius){
if(isNaN(radius)||radius<1){
return;
}

radius|=0;
var imageData=getImageDataFromCanvas(canvas,topX,topY,width,height);
imageData=processImageDataRGB(imageData,topX,topY,width,height,radius);
canvas.getContext('2d').putImageData(imageData,topX,topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGB(imageData,topX,topY,width,height,radius){
var pixels=imageData.data;
var div=2*radius+1;// const w4 = width << 2;

var widthMinus1=width-1;
var heightMinus1=height-1;
var radiusPlus1=radius+1;
var sumFactor=radiusPlus1*(radiusPlus1+1)/2;
var stackStart=new BlurStack();
var stack=stackStart;
var stackEnd;

for(var i=1;i<div;i++){
stack=stack.next=new BlurStack();

if(i===radiusPlus1){
stackEnd=stack;
}
}

stack.next=stackStart;
var stackIn=null;
var stackOut=null;
var mulSum=mulTable[radius];
var shgSum=shgTable[radius];
var p,rbs;
var yw=0,
yi=0;

for(var y=0;y<height;y++){
var pr=pixels[yi],
pg=pixels[yi+1],
pb=pixels[yi+2],
rOutSum=radiusPlus1*pr,
gOutSum=radiusPlus1*pg,
bOutSum=radiusPlus1*pb,
rSum=sumFactor*pr,
gSum=sumFactor*pg,
bSum=sumFactor*pb;
stack=stackStart;

for(var _i5=0;_i5<radiusPlus1;_i5++){
stack.r=pr;
stack.g=pg;
stack.b=pb;
stack=stack.next;
}

var rInSum=0,
gInSum=0,
bInSum=0;

for(var _i6=1;_i6<radiusPlus1;_i6++){
p=yi+((widthMinus1<_i6?widthMinus1:_i6)<<2);
rSum+=(stack.r=pr=pixels[p])*(rbs=radiusPlus1-_i6);
gSum+=(stack.g=pg=pixels[p+1])*rbs;
bSum+=(stack.b=pb=pixels[p+2])*rbs;
rInSum+=pr;
gInSum+=pg;
bInSum+=pb;
stack=stack.next;
}

stackIn=stackStart;
stackOut=stackEnd;

for(var x=0;x<width;x++){
pixels[yi]=rSum*mulSum>>shgSum;
pixels[yi+1]=gSum*mulSum>>shgSum;
pixels[yi+2]=bSum*mulSum>>shgSum;
rSum-=rOutSum;
gSum-=gOutSum;
bSum-=bOutSum;
rOutSum-=stackIn.r;
gOutSum-=stackIn.g;
bOutSum-=stackIn.b;
p=yw+((p=x+radius+1)<widthMinus1?p:widthMinus1)<<2;
rInSum+=stackIn.r=pixels[p];
gInSum+=stackIn.g=pixels[p+1];
bInSum+=stackIn.b=pixels[p+2];
rSum+=rInSum;
gSum+=gInSum;
bSum+=bInSum;
stackIn=stackIn.next;
rOutSum+=pr=stackOut.r;
gOutSum+=pg=stackOut.g;
bOutSum+=pb=stackOut.b;
rInSum-=pr;
gInSum-=pg;
bInSum-=pb;
stackOut=stackOut.next;
yi+=4;
}

yw+=width;
}

for(var _x2=0;_x2<width;_x2++){
yi=_x2<<2;

var _pr2=pixels[yi],
_pg2=pixels[yi+1],
_pb2=pixels[yi+2],
_rOutSum2=radiusPlus1*_pr2,
_gOutSum2=radiusPlus1*_pg2,
_bOutSum2=radiusPlus1*_pb2,
_rSum2=sumFactor*_pr2,
_gSum2=sumFactor*_pg2,
_bSum2=sumFactor*_pb2;

stack=stackStart;

for(var _i7=0;_i7<radiusPlus1;_i7++){
stack.r=_pr2;
stack.g=_pg2;
stack.b=_pb2;
stack=stack.next;
}

var _rInSum2=0,
_gInSum2=0,
_bInSum2=0;

for(var _i8=1,yp=width;_i8<=radius;_i8++){
yi=yp+_x2<<2;
_rSum2+=(stack.r=_pr2=pixels[yi])*(rbs=radiusPlus1-_i8);
_gSum2+=(stack.g=_pg2=pixels[yi+1])*rbs;
_bSum2+=(stack.b=_pb2=pixels[yi+2])*rbs;
_rInSum2+=_pr2;
_gInSum2+=_pg2;
_bInSum2+=_pb2;
stack=stack.next;

if(_i8<heightMinus1){
yp+=width;
}
}

yi=_x2;
stackIn=stackStart;
stackOut=stackEnd;

for(var _y2=0;_y2<height;_y2++){
p=yi<<2;
pixels[p]=_rSum2*mulSum>>shgSum;
pixels[p+1]=_gSum2*mulSum>>shgSum;
pixels[p+2]=_bSum2*mulSum>>shgSum;
_rSum2-=_rOutSum2;
_gSum2-=_gOutSum2;
_bSum2-=_bOutSum2;
_rOutSum2-=stackIn.r;
_gOutSum2-=stackIn.g;
_bOutSum2-=stackIn.b;
p=_x2+((p=_y2+radiusPlus1)<heightMinus1?p:heightMinus1)*width<<2;
_rSum2+=_rInSum2+=stackIn.r=pixels[p];
_gSum2+=_gInSum2+=stackIn.g=pixels[p+1];
_bSum2+=_bInSum2+=stackIn.b=pixels[p+2];
stackIn=stackIn.next;
_rOutSum2+=_pr2=stackOut.r;
_gOutSum2+=_pg2=stackOut.g;
_bOutSum2+=_pb2=stackOut.b;
_rInSum2-=_pr2;
_gInSum2-=_pg2;
_bInSum2-=_pb2;
stackOut=stackOut.next;
yi+=width;
}
}

return imageData;
}
/**
 *
 */


var BlurStack=
/**
 * Set properties.
 */
function BlurStack(){
_classCallCheck(this,BlurStack);

this.r=0;
this.g=0;
this.b=0;
this.a=0;
this.next=null;
};




/***/},

/***/"./node_modules/svg-pathdata/lib/SVGPathData.module.js":




function node_modulesSvgPathdataLibSVGPathDataModuleJs(module,__webpack_exports__,__webpack_require__){
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"COMMAND_ARG_COUNTS",function(){return N;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SVGPathData",function(){return f;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SVGPathDataParser",function(){return _;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"SVGPathDataTransformer",function(){return u;});
/* harmony export (binding) */__webpack_require__.d(__webpack_exports__,"encodeSVGPath",function(){return e;});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var _t=function t(r,e){return (_t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,r){t.__proto__=r;}||function(t,r){for(var e in r){r.hasOwnProperty(e)&&(t[e]=r[e]);}})(r,e);};function r(r,e){function i(){this.constructor=r;}_t(r,e),r.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i());}function e(t){var r="";Array.isArray(t)||(t=[t]);for(var e=0;e<t.length;e++){var i=t[e];if(i.type===f.CLOSE_PATH)r+="z";else if(i.type===f.HORIZ_LINE_TO)r+=(i.relative?"h":"H")+i.x;else if(i.type===f.VERT_LINE_TO)r+=(i.relative?"v":"V")+i.y;else if(i.type===f.MOVE_TO)r+=(i.relative?"m":"M")+i.x+" "+i.y;else if(i.type===f.LINE_TO)r+=(i.relative?"l":"L")+i.x+" "+i.y;else if(i.type===f.CURVE_TO)r+=(i.relative?"c":"C")+i.x1+" "+i.y1+" "+i.x2+" "+i.y2+" "+i.x+" "+i.y;else if(i.type===f.SMOOTH_CURVE_TO)r+=(i.relative?"s":"S")+i.x2+" "+i.y2+" "+i.x+" "+i.y;else if(i.type===f.QUAD_TO)r+=(i.relative?"q":"Q")+i.x1+" "+i.y1+" "+i.x+" "+i.y;else if(i.type===f.SMOOTH_QUAD_TO)r+=(i.relative?"t":"T")+i.x+" "+i.y;else {if(i.type!==f.ARC)throw new Error('Unexpected command type "'+i.type+'" at index '+e+".");r+=(i.relative?"a":"A")+i.rX+" "+i.rY+" "+i.xRot+" "+ +i.lArcFlag+" "+ +i.sweepFlag+" "+i.x+" "+i.y;}}return r;}function i(t,r){var e=t[0],i=t[1];return [e*Math.cos(r)-i*Math.sin(r),e*Math.sin(r)+i*Math.cos(r)];}function a(){for(var t=[],r=0;r<arguments.length;r++){t[r]=arguments[r];}for(var e=0;e<t.length;e++){if("number"!=typeof t[e])throw new Error("assertNumbers arguments["+e+"] is not a number. "+typeof t[e]+" == typeof "+t[e]);}return !0;}var n=Math.PI;function o(t,r,e){t.lArcFlag=0===t.lArcFlag?0:1,t.sweepFlag=0===t.sweepFlag?0:1;var a=t.rX,o=t.rY,s=t.x,u=t.y;a=Math.abs(t.rX),o=Math.abs(t.rY);var h=i([(r-s)/2,(e-u)/2],-t.xRot/180*n),c=h[0],y=h[1],p=Math.pow(c,2)/Math.pow(a,2)+Math.pow(y,2)/Math.pow(o,2);1<p&&(a*=Math.sqrt(p),o*=Math.sqrt(p)),t.rX=a,t.rY=o;var m=Math.pow(a,2)*Math.pow(y,2)+Math.pow(o,2)*Math.pow(c,2),O=(t.lArcFlag!==t.sweepFlag?1:-1)*Math.sqrt(Math.max(0,(Math.pow(a,2)*Math.pow(o,2)-m)/m)),T=a*y/o*O,v=-o*c/a*O,l=i([T,v],t.xRot/180*n);t.cX=l[0]+(r+s)/2,t.cY=l[1]+(e+u)/2,t.phi1=Math.atan2((y-v)/o,(c-T)/a),t.phi2=Math.atan2((-y-v)/o,(-c-T)/a),0===t.sweepFlag&&t.phi2>t.phi1&&(t.phi2-=2*n),1===t.sweepFlag&&t.phi2<t.phi1&&(t.phi2+=2*n),t.phi1*=180/n,t.phi2*=180/n;}function s(t,r,e){a(t,r,e);var i=t*t+r*r-e*e;if(0>i)return [];if(0===i)return [[t*e/(t*t+r*r),r*e/(t*t+r*r)]];var n=Math.sqrt(i);return [[(t*e+r*n)/(t*t+r*r),(r*e-t*n)/(t*t+r*r)],[(t*e-r*n)/(t*t+r*r),(r*e+t*n)/(t*t+r*r)]];}var u,h=Math.PI/180;function c(t,r,e){return (1-e)*t+e*r;}function y(t,r,e,i){return t+Math.cos(i/180*n)*r+Math.sin(i/180*n)*e;}function p(t,r,e,i){var a=r-t,n=e-r,o=3*a+3*(i-e)-6*n,s=6*(n-a),u=3*a;return Math.abs(o)<1e-6?[-u/s]:function(t,r,e){void 0===e&&(e=1e-6);var i=t*t/4-r;if(i<-e)return [];if(i<=e)return [-t/2];var a=Math.sqrt(i);return [-t/2-a,-t/2+a];}(s/o,u/o,1e-6);}function m(t,r,e,i,a){var n=1-a;return t*(n*n*n)+r*(3*n*n*a)+e*(3*n*a*a)+i*(a*a*a);}!function(t){function r(){return u(function(t,r,e){return t.relative&&(void 0!==t.x1&&(t.x1+=r),void 0!==t.y1&&(t.y1+=e),void 0!==t.x2&&(t.x2+=r),void 0!==t.y2&&(t.y2+=e),void 0!==t.x&&(t.x+=r),void 0!==t.y&&(t.y+=e),t.relative=!1),t;});}function e(){var t=NaN,r=NaN,e=NaN,i=NaN;return u(function(a,n,o){return a.type&f.SMOOTH_CURVE_TO&&(a.type=f.CURVE_TO,t=isNaN(t)?n:t,r=isNaN(r)?o:r,a.x1=a.relative?n-t:2*n-t,a.y1=a.relative?o-r:2*o-r),a.type&f.CURVE_TO?(t=a.relative?n+a.x2:a.x2,r=a.relative?o+a.y2:a.y2):(t=NaN,r=NaN),a.type&f.SMOOTH_QUAD_TO&&(a.type=f.QUAD_TO,e=isNaN(e)?n:e,i=isNaN(i)?o:i,a.x1=a.relative?n-e:2*n-e,a.y1=a.relative?o-i:2*o-i),a.type&f.QUAD_TO?(e=a.relative?n+a.x1:a.x1,i=a.relative?o+a.y1:a.y1):(e=NaN,i=NaN),a;});}function n(){var t=NaN,r=NaN;return u(function(e,i,a){if(e.type&f.SMOOTH_QUAD_TO&&(e.type=f.QUAD_TO,t=isNaN(t)?i:t,r=isNaN(r)?a:r,e.x1=e.relative?i-t:2*i-t,e.y1=e.relative?a-r:2*a-r),e.type&f.QUAD_TO){t=e.relative?i+e.x1:e.x1,r=e.relative?a+e.y1:e.y1;var n=e.x1,o=e.y1;e.type=f.CURVE_TO,e.x1=((e.relative?0:i)+2*n)/3,e.y1=((e.relative?0:a)+2*o)/3,e.x2=(e.x+2*n)/3,e.y2=(e.y+2*o)/3;}else t=NaN,r=NaN;return e;});}function u(t){var r=0,e=0,i=NaN,a=NaN;return function(n){if(isNaN(i)&&!(n.type&f.MOVE_TO))throw new Error("path must start with moveto");var o=t(n,r,e,i,a);return n.type&f.CLOSE_PATH&&(r=i,e=a),void 0!==n.x&&(r=n.relative?r+n.x:n.x),void 0!==n.y&&(e=n.relative?e+n.y:n.y),n.type&f.MOVE_TO&&(i=r,a=e),o;};}function O(t,r,e,i,n,o){return a(t,r,e,i,n,o),u(function(a,s,u,h){var c=a.x1,y=a.x2,p=a.relative&&!isNaN(h),m=void 0!==a.x?a.x:p?0:s,O=void 0!==a.y?a.y:p?0:u;function T(t){return t*t;}a.type&f.HORIZ_LINE_TO&&0!==r&&(a.type=f.LINE_TO,a.y=a.relative?0:u),a.type&f.VERT_LINE_TO&&0!==e&&(a.type=f.LINE_TO,a.x=a.relative?0:s),void 0!==a.x&&(a.x=a.x*t+O*e+(p?0:n)),void 0!==a.y&&(a.y=m*r+a.y*i+(p?0:o)),void 0!==a.x1&&(a.x1=a.x1*t+a.y1*e+(p?0:n)),void 0!==a.y1&&(a.y1=c*r+a.y1*i+(p?0:o)),void 0!==a.x2&&(a.x2=a.x2*t+a.y2*e+(p?0:n)),void 0!==a.y2&&(a.y2=y*r+a.y2*i+(p?0:o));var v=t*i-r*e;if(void 0!==a.xRot&&(1!==t||0!==r||0!==e||1!==i))if(0===v)delete a.rX,delete a.rY,delete a.xRot,delete a.lArcFlag,delete a.sweepFlag,a.type=f.LINE_TO;else {var l=a.xRot*Math.PI/180,_=Math.sin(l),N=Math.cos(l),x=1/T(a.rX),d=1/T(a.rY),A=T(N)*x+T(_)*d,E=2*_*N*(x-d),C=T(_)*x+T(N)*d,M=A*i*i-E*r*i+C*r*r,R=E*(t*i+r*e)-2*(A*e*i+C*t*r),g=A*e*e-E*t*e+C*t*t,I=(Math.atan2(R,M-g)+Math.PI)%Math.PI/2,S=Math.sin(I),L=Math.cos(I);a.rX=Math.abs(v)/Math.sqrt(M*T(L)+R*S*L+g*T(S)),a.rY=Math.abs(v)/Math.sqrt(M*T(S)-R*S*L+g*T(L)),a.xRot=180*I/Math.PI;}return void 0!==a.sweepFlag&&0>v&&(a.sweepFlag=+!a.sweepFlag),a;});}function T(){return function(t){var r={};for(var e in t){r[e]=t[e];}return r;};}t.ROUND=function(t){function r(r){return Math.round(r*t)/t;}return void 0===t&&(t=1e13),a(t),function(t){return void 0!==t.x1&&(t.x1=r(t.x1)),void 0!==t.y1&&(t.y1=r(t.y1)),void 0!==t.x2&&(t.x2=r(t.x2)),void 0!==t.y2&&(t.y2=r(t.y2)),void 0!==t.x&&(t.x=r(t.x)),void 0!==t.y&&(t.y=r(t.y)),void 0!==t.rX&&(t.rX=r(t.rX)),void 0!==t.rY&&(t.rY=r(t.rY)),t;};},t.TO_ABS=r,t.TO_REL=function(){return u(function(t,r,e){return t.relative||(void 0!==t.x1&&(t.x1-=r),void 0!==t.y1&&(t.y1-=e),void 0!==t.x2&&(t.x2-=r),void 0!==t.y2&&(t.y2-=e),void 0!==t.x&&(t.x-=r),void 0!==t.y&&(t.y-=e),t.relative=!0),t;});},t.NORMALIZE_HVZ=function(t,r,e){return void 0===t&&(t=!0),void 0===r&&(r=!0),void 0===e&&(e=!0),u(function(i,a,n,o,s){if(isNaN(o)&&!(i.type&f.MOVE_TO))throw new Error("path must start with moveto");return r&&i.type&f.HORIZ_LINE_TO&&(i.type=f.LINE_TO,i.y=i.relative?0:n),e&&i.type&f.VERT_LINE_TO&&(i.type=f.LINE_TO,i.x=i.relative?0:a),t&&i.type&f.CLOSE_PATH&&(i.type=f.LINE_TO,i.x=i.relative?o-a:o,i.y=i.relative?s-n:s),i.type&f.ARC&&(0===i.rX||0===i.rY)&&(i.type=f.LINE_TO,delete i.rX,delete i.rY,delete i.xRot,delete i.lArcFlag,delete i.sweepFlag),i;});},t.NORMALIZE_ST=e,t.QT_TO_C=n,t.INFO=u,t.SANITIZE=function(t){void 0===t&&(t=0),a(t);var r=NaN,e=NaN,i=NaN,n=NaN;return u(function(a,o,s,u,h){var c=Math.abs,y=!1,p=0,m=0;if(a.type&f.SMOOTH_CURVE_TO&&(p=isNaN(r)?0:o-r,m=isNaN(e)?0:s-e),a.type&(f.CURVE_TO|f.SMOOTH_CURVE_TO)?(r=a.relative?o+a.x2:a.x2,e=a.relative?s+a.y2:a.y2):(r=NaN,e=NaN),a.type&f.SMOOTH_QUAD_TO?(i=isNaN(i)?o:2*o-i,n=isNaN(n)?s:2*s-n):a.type&f.QUAD_TO?(i=a.relative?o+a.x1:a.x1,n=a.relative?s+a.y1:a.y2):(i=NaN,n=NaN),a.type&f.LINE_COMMANDS||a.type&f.ARC&&(0===a.rX||0===a.rY||!a.lArcFlag)||a.type&f.CURVE_TO||a.type&f.SMOOTH_CURVE_TO||a.type&f.QUAD_TO||a.type&f.SMOOTH_QUAD_TO){var O=void 0===a.x?0:a.relative?a.x:a.x-o,T=void 0===a.y?0:a.relative?a.y:a.y-s;p=isNaN(i)?void 0===a.x1?p:a.relative?a.x:a.x1-o:i-o,m=isNaN(n)?void 0===a.y1?m:a.relative?a.y:a.y1-s:n-s;var v=void 0===a.x2?0:a.relative?a.x:a.x2-o,l=void 0===a.y2?0:a.relative?a.y:a.y2-s;c(O)<=t&&c(T)<=t&&c(p)<=t&&c(m)<=t&&c(v)<=t&&c(l)<=t&&(y=!0);}return a.type&f.CLOSE_PATH&&c(o-u)<=t&&c(s-h)<=t&&(y=!0),y?[]:a;});},t.MATRIX=O,t.ROTATE=function(t,r,e){void 0===r&&(r=0),void 0===e&&(e=0),a(t,r,e);var i=Math.sin(t),n=Math.cos(t);return O(n,i,-i,n,r-r*n+e*i,e-r*i-e*n);},t.TRANSLATE=function(t,r){return void 0===r&&(r=0),a(t,r),O(1,0,0,1,t,r);},t.SCALE=function(t,r){return void 0===r&&(r=t),a(t,r),O(t,0,0,r,0,0);},t.SKEW_X=function(t){return a(t),O(1,0,Math.atan(t),1,0,0);},t.SKEW_Y=function(t){return a(t),O(1,Math.atan(t),0,1,0,0);},t.X_AXIS_SYMMETRY=function(t){return void 0===t&&(t=0),a(t),O(-1,0,0,1,t,0);},t.Y_AXIS_SYMMETRY=function(t){return void 0===t&&(t=0),a(t),O(1,0,0,-1,0,t);},t.A_TO_C=function(){return u(function(t,r,e){return f.ARC===t.type?function(t,r,e){var a,n,s,u;t.cX||o(t,r,e);for(var y=Math.min(t.phi1,t.phi2),p=Math.max(t.phi1,t.phi2)-y,m=Math.ceil(p/90),O=new Array(m),T=r,v=e,l=0;l<m;l++){var _=c(t.phi1,t.phi2,l/m),N=c(t.phi1,t.phi2,(l+1)/m),x=N-_,d=4/3*Math.tan(x*h/4),A=[Math.cos(_*h)-d*Math.sin(_*h),Math.sin(_*h)+d*Math.cos(_*h)],E=A[0],C=A[1],M=[Math.cos(N*h),Math.sin(N*h)],R=M[0],g=M[1],I=[R+d*Math.sin(N*h),g-d*Math.cos(N*h)],S=I[0],L=I[1];O[l]={relative:t.relative,type:f.CURVE_TO};var H=function H(r,e){var a=i([r*t.rX,e*t.rY],t.xRot),n=a[0],o=a[1];return [t.cX+n,t.cY+o];};a=H(E,C),O[l].x1=a[0],O[l].y1=a[1],n=H(S,L),O[l].x2=n[0],O[l].y2=n[1],s=H(R,g),O[l].x=s[0],O[l].y=s[1],t.relative&&(O[l].x1-=T,O[l].y1-=v,O[l].x2-=T,O[l].y2-=v,O[l].x-=T,O[l].y-=v),T=(u=[O[l].x,O[l].y])[0],v=u[1];}return O;}(t,t.relative?0:r,t.relative?0:e):t;});},t.ANNOTATE_ARCS=function(){return u(function(t,r,e){return t.relative&&(r=0,e=0),f.ARC===t.type&&o(t,r,e),t;});},t.CLONE=T,t.CALCULATE_BOUNDS=function(){var t=function t(_t2){var r={};for(var e in _t2){r[e]=_t2[e];}return r;},i=r(),a=n(),h=e(),c=u(function(r,e,n){var u=h(a(i(t(r))));function O(t){t>c.maxX&&(c.maxX=t),t<c.minX&&(c.minX=t);}function T(t){t>c.maxY&&(c.maxY=t),t<c.minY&&(c.minY=t);}if(u.type&f.DRAWING_COMMANDS&&(O(e),T(n)),u.type&f.HORIZ_LINE_TO&&O(u.x),u.type&f.VERT_LINE_TO&&T(u.y),u.type&f.LINE_TO&&(O(u.x),T(u.y)),u.type&f.CURVE_TO){O(u.x),T(u.y);for(var v=0,l=p(e,u.x1,u.x2,u.x);v<l.length;v++){0<(w=l[v])&&1>w&&O(m(e,u.x1,u.x2,u.x,w));}for(var _=0,N=p(n,u.y1,u.y2,u.y);_<N.length;_++){0<(w=N[_])&&1>w&&T(m(n,u.y1,u.y2,u.y,w));}}if(u.type&f.ARC){O(u.x),T(u.y),o(u,e,n);for(var x=u.xRot/180*Math.PI,d=Math.cos(x)*u.rX,A=Math.sin(x)*u.rX,E=-Math.sin(x)*u.rY,C=Math.cos(x)*u.rY,M=u.phi1<u.phi2?[u.phi1,u.phi2]:-180>u.phi2?[u.phi2+360,u.phi1+360]:[u.phi2,u.phi1],R=M[0],g=M[1],I=function I(t){var r=t[0],e=t[1],i=180*Math.atan2(e,r)/Math.PI;return i<R?i+360:i;},S=0,L=s(E,-d,0).map(I);S<L.length;S++){(w=L[S])>R&&w<g&&O(y(u.cX,d,E,w));}for(var H=0,U=s(C,-A,0).map(I);H<U.length;H++){var w;(w=U[H])>R&&w<g&&T(y(u.cY,A,C,w));}}return r;});return c.minX=1/0,c.maxX=-1/0,c.minY=1/0,c.maxY=-1/0,c;};}(u||(u={}));var O,T=function(){function t(){}return t.prototype.round=function(t){return this.transform(u.ROUND(t));},t.prototype.toAbs=function(){return this.transform(u.TO_ABS());},t.prototype.toRel=function(){return this.transform(u.TO_REL());},t.prototype.normalizeHVZ=function(t,r,e){return this.transform(u.NORMALIZE_HVZ(t,r,e));},t.prototype.normalizeST=function(){return this.transform(u.NORMALIZE_ST());},t.prototype.qtToC=function(){return this.transform(u.QT_TO_C());},t.prototype.aToC=function(){return this.transform(u.A_TO_C());},t.prototype.sanitize=function(t){return this.transform(u.SANITIZE(t));},t.prototype.translate=function(t,r){return this.transform(u.TRANSLATE(t,r));},t.prototype.scale=function(t,r){return this.transform(u.SCALE(t,r));},t.prototype.rotate=function(t,r,e){return this.transform(u.ROTATE(t,r,e));},t.prototype.matrix=function(t,r,e,i,a,n){return this.transform(u.MATRIX(t,r,e,i,a,n));},t.prototype.skewX=function(t){return this.transform(u.SKEW_X(t));},t.prototype.skewY=function(t){return this.transform(u.SKEW_Y(t));},t.prototype.xSymmetry=function(t){return this.transform(u.X_AXIS_SYMMETRY(t));},t.prototype.ySymmetry=function(t){return this.transform(u.Y_AXIS_SYMMETRY(t));},t.prototype.annotateArcs=function(){return this.transform(u.ANNOTATE_ARCS());},t;}(),v=function v(t){return " "===t||"\t"===t||"\r"===t||"\n"===t;},l=function l(t){return "0".charCodeAt(0)<=t.charCodeAt(0)&&t.charCodeAt(0)<="9".charCodeAt(0);},_=function(t){function e(){var r=t.call(this)||this;return r.curNumber="",r.curCommandType=-1,r.curCommandRelative=!1,r.canParseCommandOrComma=!0,r.curNumberHasExp=!1,r.curNumberHasExpDigits=!1,r.curNumberHasDecimal=!1,r.curArgs=[],r;}return r(e,t),e.prototype.finish=function(t){if(void 0===t&&(t=[]),this.parse(" ",t),0!==this.curArgs.length||!this.canParseCommandOrComma)throw new SyntaxError("Unterminated command at the path end.");return t;},e.prototype.parse=function(t,r){var e=this;void 0===r&&(r=[]);for(var i=function i(t){r.push(t),e.curArgs.length=0,e.canParseCommandOrComma=!0;},a=0;a<t.length;a++){var n=t[a],o=!(this.curCommandType!==f.ARC||3!==this.curArgs.length&&4!==this.curArgs.length||1!==this.curNumber.length||"0"!==this.curNumber&&"1"!==this.curNumber),s=l(n)&&("0"===this.curNumber&&"0"===n||o);if(!l(n)||s){if("e"!==n&&"E"!==n){if("-"!==n&&"+"!==n||!this.curNumberHasExp||this.curNumberHasExpDigits){if("."!==n||this.curNumberHasExp||this.curNumberHasDecimal||o){if(this.curNumber&&-1!==this.curCommandType){var u=Number(this.curNumber);if(isNaN(u))throw new SyntaxError("Invalid number ending at "+a);if(this.curCommandType===f.ARC)if(0===this.curArgs.length||1===this.curArgs.length){if(0>u)throw new SyntaxError('Expected positive number, got "'+u+'" at index "'+a+'"');}else if((3===this.curArgs.length||4===this.curArgs.length)&&"0"!==this.curNumber&&"1"!==this.curNumber)throw new SyntaxError('Expected a flag, got "'+this.curNumber+'" at index "'+a+'"');this.curArgs.push(u),this.curArgs.length===N[this.curCommandType]&&(f.HORIZ_LINE_TO===this.curCommandType?i({type:f.HORIZ_LINE_TO,relative:this.curCommandRelative,x:u}):f.VERT_LINE_TO===this.curCommandType?i({type:f.VERT_LINE_TO,relative:this.curCommandRelative,y:u}):this.curCommandType===f.MOVE_TO||this.curCommandType===f.LINE_TO||this.curCommandType===f.SMOOTH_QUAD_TO?(i({type:this.curCommandType,relative:this.curCommandRelative,x:this.curArgs[0],y:this.curArgs[1]}),f.MOVE_TO===this.curCommandType&&(this.curCommandType=f.LINE_TO)):this.curCommandType===f.CURVE_TO?i({type:f.CURVE_TO,relative:this.curCommandRelative,x1:this.curArgs[0],y1:this.curArgs[1],x2:this.curArgs[2],y2:this.curArgs[3],x:this.curArgs[4],y:this.curArgs[5]}):this.curCommandType===f.SMOOTH_CURVE_TO?i({type:f.SMOOTH_CURVE_TO,relative:this.curCommandRelative,x2:this.curArgs[0],y2:this.curArgs[1],x:this.curArgs[2],y:this.curArgs[3]}):this.curCommandType===f.QUAD_TO?i({type:f.QUAD_TO,relative:this.curCommandRelative,x1:this.curArgs[0],y1:this.curArgs[1],x:this.curArgs[2],y:this.curArgs[3]}):this.curCommandType===f.ARC&&i({type:f.ARC,relative:this.curCommandRelative,rX:this.curArgs[0],rY:this.curArgs[1],xRot:this.curArgs[2],lArcFlag:this.curArgs[3],sweepFlag:this.curArgs[4],x:this.curArgs[5],y:this.curArgs[6]})),this.curNumber="",this.curNumberHasExpDigits=!1,this.curNumberHasExp=!1,this.curNumberHasDecimal=!1,this.canParseCommandOrComma=!0;}if(!v(n))if(","===n&&this.canParseCommandOrComma)this.canParseCommandOrComma=!1;else if("+"!==n&&"-"!==n&&"."!==n){if(s)this.curNumber=n,this.curNumberHasDecimal=!1;else {if(0!==this.curArgs.length)throw new SyntaxError("Unterminated command at index "+a+".");if(!this.canParseCommandOrComma)throw new SyntaxError('Unexpected character "'+n+'" at index '+a+". Command cannot follow comma");if(this.canParseCommandOrComma=!1,"z"!==n&&"Z"!==n){if("h"===n||"H"===n)this.curCommandType=f.HORIZ_LINE_TO,this.curCommandRelative="h"===n;else if("v"===n||"V"===n)this.curCommandType=f.VERT_LINE_TO,this.curCommandRelative="v"===n;else if("m"===n||"M"===n)this.curCommandType=f.MOVE_TO,this.curCommandRelative="m"===n;else if("l"===n||"L"===n)this.curCommandType=f.LINE_TO,this.curCommandRelative="l"===n;else if("c"===n||"C"===n)this.curCommandType=f.CURVE_TO,this.curCommandRelative="c"===n;else if("s"===n||"S"===n)this.curCommandType=f.SMOOTH_CURVE_TO,this.curCommandRelative="s"===n;else if("q"===n||"Q"===n)this.curCommandType=f.QUAD_TO,this.curCommandRelative="q"===n;else if("t"===n||"T"===n)this.curCommandType=f.SMOOTH_QUAD_TO,this.curCommandRelative="t"===n;else {if("a"!==n&&"A"!==n)throw new SyntaxError('Unexpected character "'+n+'" at index '+a+".");this.curCommandType=f.ARC,this.curCommandRelative="a"===n;}}else r.push({type:f.CLOSE_PATH}),this.canParseCommandOrComma=!0,this.curCommandType=-1;}}else this.curNumber=n,this.curNumberHasDecimal="."===n;}else this.curNumber+=n,this.curNumberHasDecimal=!0;}else this.curNumber+=n;}else this.curNumber+=n,this.curNumberHasExp=!0;}else this.curNumber+=n,this.curNumberHasExpDigits=this.curNumberHasExp;}return r;},e.prototype.transform=function(t){return Object.create(this,{parse:{value:function value(r,e){void 0===e&&(e=[]);for(var i=0,a=Object.getPrototypeOf(this).parse.call(this,r);i<a.length;i++){var n=a[i],o=t(n);Array.isArray(o)?e.push.apply(e,o):e.push(o);}return e;}}});},e;}(T),f=function(t){function i(r){var e=t.call(this)||this;return e.commands="string"==typeof r?i.parse(r):r,e;}return r(i,t),i.prototype.encode=function(){return i.encode(this.commands);},i.prototype.getBounds=function(){var t=u.CALCULATE_BOUNDS();return this.transform(t),t;},i.prototype.transform=function(t){for(var r=[],e=0,i=this.commands;e<i.length;e++){var a=t(i[e]);Array.isArray(a)?r.push.apply(r,a):r.push(a);}return this.commands=r,this;},i.encode=function(t){return e(t);},i.parse=function(t){var r=new _(),e=[];return r.parse(t,e),r.finish(e),e;},i.CLOSE_PATH=1,i.MOVE_TO=2,i.HORIZ_LINE_TO=4,i.VERT_LINE_TO=8,i.LINE_TO=16,i.CURVE_TO=32,i.SMOOTH_CURVE_TO=64,i.QUAD_TO=128,i.SMOOTH_QUAD_TO=256,i.ARC=512,i.LINE_COMMANDS=i.LINE_TO|i.HORIZ_LINE_TO|i.VERT_LINE_TO,i.DRAWING_COMMANDS=i.HORIZ_LINE_TO|i.VERT_LINE_TO|i.LINE_TO|i.CURVE_TO|i.SMOOTH_CURVE_TO|i.QUAD_TO|i.SMOOTH_QUAD_TO|i.ARC,i;}(T),N=((O={})[f.MOVE_TO]=2,O[f.LINE_TO]=2,O[f.HORIZ_LINE_TO]=1,O[f.VERT_LINE_TO]=1,O[f.CLOSE_PATH]=0,O[f.QUAD_TO]=4,O[f.SMOOTH_QUAD_TO]=2,O[f.CURVE_TO]=6,O[f.SMOOTH_CURVE_TO]=4,O[f.ARC]=7,O);



/***/}}]);

}());
