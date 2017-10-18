(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-05-20T17:23Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "2.2.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = document.createElement( "script" );
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-10-17
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[i] = nidselect + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( (parent = document.defaultView) && parent.top !== parent ) {
		// Support: IE 11
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( (oldCache = uniqueCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {

						// Inject the element directly into the jQuery object
						this.length = 1;
						this[ 0 ] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

				// Always skip document fragments
				if ( cur.nodeType < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner.nodeType ) {
			owner[ this.expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, this.expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ this.expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :
			owner[ this.expando ] && owner[ this.expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key === undefined ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

				if ( data !== undefined ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName( "tbody" )[ 0 ] ||
			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =

			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		},
		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv.style.cssText = div.style.cssText =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			documentElement.appendChild( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

			documentElement.removeChild( container );
			div.removeChild( marginDiv );

			return ret;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = dataPriv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {

			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = dataPriv.access(
					elem,
					"olddisplay",
					defaultDisplay( elem.nodeName )
				);
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				dataPriv.set(
					elem,
					"olddisplay",
					hidden ? display : jQuery.css( elem, "display" )
				);
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
		opt.duration : opt.duration in jQuery.fx.speeds ?
			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window.clearInterval( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
 */
var AllSubstringsIndexStrategy = exports.AllSubstringsIndexStrategy = function () {
  function AllSubstringsIndexStrategy() {
    _classCallCheck(this, AllSubstringsIndexStrategy);
  }

  _createClass(AllSubstringsIndexStrategy, [{
    key: 'expandToken',


    /**
     * @inheritDocs
     */
    value: function expandToken(token) {
      var expandedTokens = [];
      var string;

      for (var i = 0, length = token.length; i < length; ++i) {
        string = '';

        for (var j = i; j < length; ++j) {
          string += token.charAt(j);
          expandedTokens.push(string);
        }
      }

      return expandedTokens;
    }
  }]);

  return AllSubstringsIndexStrategy;
}();

;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Indexes for exact word matches.
 */
var ExactWordIndexStrategy = exports.ExactWordIndexStrategy = function () {
  function ExactWordIndexStrategy() {
    _classCallCheck(this, ExactWordIndexStrategy);
  }

  _createClass(ExactWordIndexStrategy, [{
    key: 'expandToken',


    /**
     * @inheritDocs
     */
    value: function expandToken(token) {
      return token ? [token] : [];
    }
  }]);

  return ExactWordIndexStrategy;
}();

;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
 */
var PrefixIndexStrategy = exports.PrefixIndexStrategy = function () {
  function PrefixIndexStrategy() {
    _classCallCheck(this, PrefixIndexStrategy);
  }

  _createClass(PrefixIndexStrategy, [{
    key: 'expandToken',


    /**
     * @inheritDocs
     */
    value: function expandToken(token) {
      var expandedTokens = [];
      var string = '';

      for (var i = 0, length = token.length; i < length; ++i) {
        string += token.charAt(i);
        expandedTokens.push(string);
      }

      return expandedTokens;
    }
  }]);

  return PrefixIndexStrategy;
}();

;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AllSubstringsIndexStrategy = require('./AllSubstringsIndexStrategy');

Object.defineProperty(exports, 'AllSubstringsIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _AllSubstringsIndexStrategy.AllSubstringsIndexStrategy;
  }
});

var _ExactWordIndexStrategy = require('./ExactWordIndexStrategy');

Object.defineProperty(exports, 'ExactWordIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _ExactWordIndexStrategy.ExactWordIndexStrategy;
  }
});

var _PrefixIndexStrategy = require('./PrefixIndexStrategy');

Object.defineProperty(exports, 'PrefixIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _PrefixIndexStrategy.PrefixIndexStrategy;
  }
});

},{"./AllSubstringsIndexStrategy":3,"./ExactWordIndexStrategy":4,"./PrefixIndexStrategy":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Enforces case-sensitive text matches.
 */
var CaseSensitiveSanitizer = exports.CaseSensitiveSanitizer = function () {
  function CaseSensitiveSanitizer() {
    _classCallCheck(this, CaseSensitiveSanitizer);
  }

  _createClass(CaseSensitiveSanitizer, [{
    key: 'sanitize',


    /**
     * @inheritDocs
     */
    value: function sanitize(text) {
      return text ? text.trim() : '';
    }
  }]);

  return CaseSensitiveSanitizer;
}();

;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Sanitizes text by converting to a locale-friendly lower-case version and triming leading and trailing whitespace.
 */
var LowerCaseSanitizer = exports.LowerCaseSanitizer = function () {
  function LowerCaseSanitizer() {
    _classCallCheck(this, LowerCaseSanitizer);
  }

  _createClass(LowerCaseSanitizer, [{
    key: 'sanitize',


    /**
     * @inheritDocs
     */
    value: function sanitize(text) {
      return text ? text.toLocaleLowerCase().trim() : '';
    }
  }]);

  return LowerCaseSanitizer;
}();

;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CaseSensitiveSanitizer = require('./CaseSensitiveSanitizer');

Object.defineProperty(exports, 'CaseSensitiveSanitizer', {
  enumerable: true,
  get: function get() {
    return _CaseSensitiveSanitizer.CaseSensitiveSanitizer;
  }
});

var _LowerCaseSanitizer = require('./LowerCaseSanitizer');

Object.defineProperty(exports, 'LowerCaseSanitizer', {
  enumerable: true,
  get: function get() {
    return _LowerCaseSanitizer.LowerCaseSanitizer;
  }
});

},{"./CaseSensitiveSanitizer":7,"./LowerCaseSanitizer":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Search = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getNestedFieldValue = require('./getNestedFieldValue');

var _getNestedFieldValue2 = _interopRequireDefault(_getNestedFieldValue);

var _index = require('./IndexStrategy/index');

var _index2 = require('./Sanitizer/index');

var _index3 = require('./SearchIndex/index');

var _index4 = require('./Tokenizer/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Simple client-side searching within a set of documents.
 *
 * <p>Documents can be searched by any number of fields. Indexing and search strategies are highly customizable.
 */
var Search = exports.Search = function () {

  /**
   * Constructor.
   * @param uidFieldName Field containing values that uniquely identify search documents; this field's values are used
   *                     to ensure that a search result set does not contain duplicate objects.
   */


  /**
   * Array containing either a property name or a path (list of property names) to a nested value
   */
  function Search(uidFieldName) {
    _classCallCheck(this, Search);

    if (!uidFieldName) {
      throw Error('js-search requires a uid field name constructor parameter');
    }

    this._uidFieldName = uidFieldName;

    // Set default/recommended strategies
    this._indexStrategy = new _index.PrefixIndexStrategy();
    this._searchIndex = new _index3.TfIdfSearchIndex(uidFieldName);
    this._sanitizer = new _index2.LowerCaseSanitizer();
    this._tokenizer = new _index4.SimpleTokenizer();

    this._documents = [];
    this._searchableFields = [];
  }

  /**
   * Override the default index strategy.
   * @param value Custom index strategy
   * @throws Error if documents have already been indexed by this search instance
   */


  _createClass(Search, [{
    key: 'addDocument',


    /**
     * Add a searchable document to the index. Document will automatically be indexed for search.
     * @param document
     */
    value: function addDocument(document) {
      this.addDocuments([document]);
    }

    /**
     * Adds searchable documents to the index. Documents will automatically be indexed for search.
     * @param document
     */

  }, {
    key: 'addDocuments',
    value: function addDocuments(documents) {
      this._documents = this._documents.concat(documents);
      this.indexDocuments_(documents, this._searchableFields);
    }

    /**
     * Add a new searchable field to the index. Existing documents will automatically be indexed using this new field.
     *
     * @param field Searchable field or field path. Pass a string to index a top-level field and an array of strings for nested fields.
     */

  }, {
    key: 'addIndex',
    value: function addIndex(field) {
      this._searchableFields.push(field);
      this.indexDocuments_(this._documents, [field]);
    }

    /**
     * Search all documents for ones matching the specified query text.
     * @param query
     * @returns {Array<Object>}
     */

  }, {
    key: 'search',
    value: function search(query) {
      var tokens = this._tokenizer.tokenize(this._sanitizer.sanitize(query));

      return this._searchIndex.search(tokens, this._documents);
    }

    /**
     * @param documents
     * @param _searchableFields Array containing property names and paths (lists of property names) to nested values
     * @private
     */

  }, {
    key: 'indexDocuments_',
    value: function indexDocuments_(documents, _searchableFields) {
      this._initialized = true;

      var indexStrategy = this._indexStrategy;
      var sanitizer = this._sanitizer;
      var searchIndex = this._searchIndex;
      var tokenizer = this._tokenizer;
      var uidFieldName = this._uidFieldName;

      for (var di = 0, numDocuments = documents.length; di < numDocuments; di++) {
        var doc = documents[di];
        var uid;

        if (uidFieldName instanceof Array) {
          uid = (0, _getNestedFieldValue2.default)(doc, uidFieldName);
        } else {
          uid = doc[uidFieldName];
        }

        for (var sfi = 0, numSearchableFields = _searchableFields.length; sfi < numSearchableFields; sfi++) {
          var fieldValue;
          var searchableField = _searchableFields[sfi];

          if (searchableField instanceof Array) {
            fieldValue = (0, _getNestedFieldValue2.default)(doc, searchableField);
          } else {
            fieldValue = doc[searchableField];
          }

          if (fieldValue != null && typeof fieldValue !== 'string' && fieldValue.toString) {
            fieldValue = fieldValue.toString();
          }

          if (typeof fieldValue === 'string') {
            var fieldTokens = tokenizer.tokenize(sanitizer.sanitize(fieldValue));

            for (var fti = 0, numFieldValues = fieldTokens.length; fti < numFieldValues; fti++) {
              var fieldToken = fieldTokens[fti];
              var expandedTokens = indexStrategy.expandToken(fieldToken);

              for (var eti = 0, nummExpandedTokens = expandedTokens.length; eti < nummExpandedTokens; eti++) {
                var expandedToken = expandedTokens[eti];

                searchIndex.indexDocument(expandedToken, uid, doc);
              }
            }
          }
        }
      }
    }
  }, {
    key: 'indexStrategy',
    set: function set(value) {
      if (this._initialized) {
        throw Error('IIndexStrategy cannot be set after initialization');
      }

      this._indexStrategy = value;
    },
    get: function get() {
      return this._indexStrategy;
    }

    /**
     * Override the default text sanitizing strategy.
     * @param value Custom text sanitizing strategy
     * @throws Error if documents have already been indexed by this search instance
     */

  }, {
    key: 'sanitizer',
    set: function set(value) {
      if (this._initialized) {
        throw Error('ISanitizer cannot be set after initialization');
      }

      this._sanitizer = value;
    },
    get: function get() {
      return this._sanitizer;
    }

    /**
     * Override the default search index strategy.
     * @param value Custom search index strategy
     * @throws Error if documents have already been indexed
     */

  }, {
    key: 'searchIndex',
    set: function set(value) {
      if (this._initialized) {
        throw Error('ISearchIndex cannot be set after initialization');
      }

      this._searchIndex = value;
    },
    get: function get() {
      return this._searchIndex;
    }

    /**
     * Override the default text tokenizing strategy.
     * @param value Custom text tokenizing strategy
     * @throws Error if documents have already been indexed by this search instance
     */

  }, {
    key: 'tokenizer',
    set: function set(value) {
      if (this._initialized) {
        throw Error('ITokenizer cannot be set after initialization');
      }

      this._tokenizer = value;
    },
    get: function get() {
      return this._tokenizer;
    }
  }]);

  return Search;
}();

},{"./IndexStrategy/index":6,"./Sanitizer/index":9,"./SearchIndex/index":13,"./Tokenizer/index":19,"./getNestedFieldValue":20}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TfIdfSearchIndex = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _getNestedFieldValue = require('../getNestedFieldValue');

var _getNestedFieldValue2 = _interopRequireDefault(_getNestedFieldValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Search index capable of returning results matching a set of tokens and ranked according to TF-IDF.
 */
var TfIdfSearchIndex = exports.TfIdfSearchIndex = function () {
  function TfIdfSearchIndex(uidFieldName) {
    _classCallCheck(this, TfIdfSearchIndex);

    this._uidFieldName = uidFieldName;
    this._tokenToIdfCache = {};
    this._tokenMap = {};
  }

  /**
   * @inheritDocs
   */


  _createClass(TfIdfSearchIndex, [{
    key: 'indexDocument',
    value: function indexDocument(token, uid, doc) {
      this._tokenToIdfCache = {}; // New index invalidates previous IDF caches

      var tokenMap = this._tokenMap;
      var tokenDatum;

      if (_typeof(tokenMap[token]) !== 'object') {
        tokenMap[token] = tokenDatum = {
          $numDocumentOccurrences: 0,
          $totalNumOccurrences: 1,
          $uidMap: {}
        };
      } else {
        tokenDatum = tokenMap[token];
        tokenDatum.$totalNumOccurrences++;
      }

      var uidMap = tokenDatum.$uidMap;

      if (_typeof(uidMap[uid]) !== 'object') {
        tokenDatum.$numDocumentOccurrences++;
        uidMap[uid] = {
          $document: doc,
          $numTokenOccurrences: 1
        };
      } else {
        uidMap[uid].$numTokenOccurrences++;
      }
    }

    /**
     * @inheritDocs
     */

  }, {
    key: 'search',
    value: function search(tokens, corpus) {
      var uidToDocumentMap = {};

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token = tokens[i];
        var tokenMetadata = this._tokenMap[token];

        // Short circuit if no matches were found for any given token.
        if (!tokenMetadata) {
          return [];
        }

        if (i === 0) {
          var keys = Object.keys(tokenMetadata.$uidMap);
          for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
            var uid = keys[j];

            uidToDocumentMap[uid] = tokenMetadata.$uidMap[uid].$document;
          }
        } else {
          var keys = Object.keys(uidToDocumentMap);
          for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
            var uid = keys[j];

            if (_typeof(tokenMetadata.$uidMap[uid]) !== 'object') {
              delete uidToDocumentMap[uid];
            }
          }
        }
      }

      var documents = [];

      for (var uid in uidToDocumentMap) {
        documents.push(uidToDocumentMap[uid]);
      }

      var calculateTfIdf = this._createCalculateTfIdf();

      // Return documents sorted by TF-IDF
      return documents.sort(function (documentA, documentB) {
        return calculateTfIdf(tokens, documentB, corpus) - calculateTfIdf(tokens, documentA, corpus);
      });
    }
  }, {
    key: '_createCalculateIdf',
    value: function _createCalculateIdf() {
      var tokenMap = this._tokenMap;
      var tokenToIdfCache = this._tokenToIdfCache;

      return function calculateIdf(token, documents) {
        if (!tokenToIdfCache[token]) {
          var numDocumentsWithToken = typeof tokenMap[token] !== 'undefined' ? tokenMap[token].$numDocumentOccurrences : 0;

          tokenToIdfCache[token] = 1 + Math.log(documents.length / (1 + numDocumentsWithToken));
        }

        return tokenToIdfCache[token];
      };
    }
  }, {
    key: '_createCalculateTfIdf',
    value: function _createCalculateTfIdf() {
      var tokenMap = this._tokenMap;
      var uidFieldName = this._uidFieldName;
      var calculateIdf = this._createCalculateIdf();

      return function calculateTfIdf(tokens, document, documents) {
        var score = 0;

        for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
          var token = tokens[i];

          var inverseDocumentFrequency = calculateIdf(token, documents);

          if (inverseDocumentFrequency === Infinity) {
            inverseDocumentFrequency = 0;
          }

          var uid;
          if (uidFieldName instanceof Array) {
            uid = document && (0, _getNestedFieldValue2.default)(document, uidFieldName);
          } else {
            uid = document && document[uidFieldName];
          }

          var termFrequency = typeof tokenMap[token] !== 'undefined' && typeof tokenMap[token].$uidMap[uid] !== 'undefined' ? tokenMap[token].$uidMap[uid].$numTokenOccurrences : 0;

          score += termFrequency * inverseDocumentFrequency;
        }

        return score;
      };
    }
  }]);

  return TfIdfSearchIndex;
}();

;

},{"../getNestedFieldValue":20}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Search index capable of returning results matching a set of tokens but without any meaningful rank or order.
 */
var UnorderedSearchIndex = exports.UnorderedSearchIndex = function () {
  function UnorderedSearchIndex() {
    _classCallCheck(this, UnorderedSearchIndex);

    this._tokenToUidToDocumentMap = {};
  }

  /**
   * @inheritDocs
   */


  _createClass(UnorderedSearchIndex, [{
    key: 'indexDocument',
    value: function indexDocument(token, uid, doc) {
      if (_typeof(this._tokenToUidToDocumentMap[token]) !== 'object') {
        this._tokenToUidToDocumentMap[token] = {};
      }

      this._tokenToUidToDocumentMap[token][uid] = doc;
    }

    /**
     * @inheritDocs
     */

  }, {
    key: 'search',
    value: function search(tokens, corpus) {
      var intersectingDocumentMap = {};

      var tokenToUidToDocumentMap = this._tokenToUidToDocumentMap;

      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token = tokens[i];
        var documentMap = tokenToUidToDocumentMap[token];

        // Short circuit if no matches were found for any given token.
        if (!documentMap) {
          return [];
        }

        if (i === 0) {
          var keys = Object.keys(documentMap);

          for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
            var uid = keys[j];

            intersectingDocumentMap[uid] = documentMap[uid];
          }
        } else {
          var keys = Object.keys(intersectingDocumentMap);

          for (var j = 0, numKeys = keys.length; j < numKeys; j++) {
            var uid = keys[j];

            if (_typeof(documentMap[uid]) !== 'object') {
              delete intersectingDocumentMap[uid];
            }
          }
        }
      }

      var keys = Object.keys(intersectingDocumentMap);
      var documents = [];

      for (var i = 0, numKeys = keys.length; i < numKeys; i++) {
        var uid = keys[i];

        documents.push(intersectingDocumentMap[uid]);
      }

      return documents;
    }
  }]);

  return UnorderedSearchIndex;
}();

;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TfIdfSearchIndex = require('./TfIdfSearchIndex');

Object.defineProperty(exports, 'TfIdfSearchIndex', {
  enumerable: true,
  get: function get() {
    return _TfIdfSearchIndex.TfIdfSearchIndex;
  }
});

var _UnorderedSearchIndex = require('./UnorderedSearchIndex');

Object.defineProperty(exports, 'UnorderedSearchIndex', {
  enumerable: true,
  get: function get() {
    return _UnorderedSearchIndex.UnorderedSearchIndex;
  }
});

},{"./TfIdfSearchIndex":11,"./UnorderedSearchIndex":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var StopWordsMap = exports.StopWordsMap = {
  a: true,
  able: true,
  about: true,
  across: true,
  after: true,
  all: true,
  almost: true,
  also: true,
  am: true,
  among: true,
  an: true,
  and: true,
  any: true,
  are: true,
  as: true,
  at: true,
  be: true,
  because: true,
  been: true,
  but: true,
  by: true,
  can: true,
  cannot: true,
  could: true,
  dear: true,
  did: true,
  'do': true,
  does: true,
  either: true,
  'else': true,
  ever: true,
  every: true,
  'for': true,
  from: true,
  'get': true,
  got: true,
  had: true,
  has: true,
  have: true,
  he: true,
  her: true,
  hers: true,
  him: true,
  his: true,
  how: true,
  however: true,
  i: true,
  'if': true,
  'in': true,
  into: true,
  is: true,
  it: true,
  its: true,
  just: true,
  least: true,
  let: true,
  like: true,
  likely: true,
  may: true,
  me: true,
  might: true,
  most: true,
  must: true,
  my: true,
  neither: true,
  no: true,
  nor: true,
  not: true,
  of: true,
  off: true,
  often: true,
  on: true,
  only: true,
  or: true,
  other: true,
  our: true,
  own: true,
  rather: true,
  said: true,
  say: true,
  says: true,
  she: true,
  should: true,
  since: true,
  so: true,
  some: true,
  than: true,
  that: true,
  the: true,
  their: true,
  them: true,
  then: true,
  there: true,
  these: true,
  they: true,
  'this': true,
  tis: true,
  to: true,
  too: true,
  twas: true,
  us: true,
  wants: true,
  was: true,
  we: true,
  were: true,
  what: true,
  when: true,
  where: true,
  which: true,
  'while': true,
  who: true,
  whom: true,
  why: true,
  will: true,
  'with': true,
  would: true,
  yet: true,
  you: true,
  your: true
};

// Prevent false positives for inherited properties
StopWordsMap.constructor = false;
StopWordsMap.hasOwnProperty = false;
StopWordsMap.isPrototypeOf = false;
StopWordsMap.propertyIsEnumerable = false;
StopWordsMap.toLocaleString = false;
StopWordsMap.toString = false;
StopWordsMap.valueOf = false;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenHighlighter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./IndexStrategy/index');

var _index2 = require('./Sanitizer/index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This utility highlights the occurrences of tokens within a string of text. It can be used to give visual indicators
 * of match criteria within searchable fields.
 *
 * <p>For performance purposes this highlighter only works with full-word or prefix token indexes.
 */
var TokenHighlighter = exports.TokenHighlighter = function () {

  /**
   * Constructor.
   *
   * @param opt_indexStrategy Index strategy used by Search
   * @param opt_sanitizer Sanitizer used by Search
   * @param opt_wrapperTagName Optional wrapper tag name; defaults to 'mark' (e.g. <mark>)
   */
  function TokenHighlighter(opt_indexStrategy, opt_sanitizer, opt_wrapperTagName) {
    _classCallCheck(this, TokenHighlighter);

    this._indexStrategy = opt_indexStrategy || new _index.PrefixIndexStrategy();
    this._sanitizer = opt_sanitizer || new _index2.LowerCaseSanitizer();
    this._wrapperTagName = opt_wrapperTagName || 'mark';
  }

  /**
   * Highlights token occurrences within a string by wrapping them with a DOM element.
   *
   * @param text e.g. "john wayne"
   * @param tokens e.g. ["wa"]
   * @returns {string} e.g. "john <mark>wa</mark>yne"
   */


  _createClass(TokenHighlighter, [{
    key: 'highlight',
    value: function highlight(text, tokens) {
      var tagsLength = this._wrapText('').length;

      var tokenDictionary = {};

      // Create a token map for easier lookup below.
      for (var i = 0, numTokens = tokens.length; i < numTokens; i++) {
        var token = this._sanitizer.sanitize(tokens[i]);
        var expandedTokens = this._indexStrategy.expandToken(token);

        for (var j = 0, numExpandedTokens = expandedTokens.length; j < numExpandedTokens; j++) {
          var expandedToken = expandedTokens[j];

          if (!tokenDictionary[expandedToken]) {
            tokenDictionary[expandedToken] = [token];
          } else {
            tokenDictionary[expandedToken].push(token);
          }
        }
      }

      // Track actualCurrentWord and sanitizedCurrentWord separately in case we encounter nested tags.
      var actualCurrentWord = '';
      var sanitizedCurrentWord = '';
      var currentWordStartIndex = 0;

      // Note this assumes either prefix or full word matching.
      for (var i = 0, textLength = text.length; i < textLength; i++) {
        var character = text.charAt(i);

        if (character === ' ') {
          actualCurrentWord = '';
          sanitizedCurrentWord = '';
          currentWordStartIndex = i + 1;
        } else {
          actualCurrentWord += character;
          sanitizedCurrentWord += this._sanitizer.sanitize(character);
        }

        if (tokenDictionary[sanitizedCurrentWord] && tokenDictionary[sanitizedCurrentWord].indexOf(sanitizedCurrentWord) >= 0) {

          actualCurrentWord = this._wrapText(actualCurrentWord);
          text = text.substring(0, currentWordStartIndex) + actualCurrentWord + text.substring(i + 1);

          i += tagsLength;
          textLength += tagsLength;
        }
      }

      return text;
    }

    /**
     * @param text to wrap
     * @returns Text wrapped by wrapper tag (e.g. "foo" becomes "<mark>foo</mark>")
     * @private
     */

  }, {
    key: '_wrapText',
    value: function _wrapText(text) {
      var tagName = this._wrapperTagName;
      return '<' + tagName + '>' + text + '</' + tagName + '>';
    }
  }]);

  return TokenHighlighter;
}();

;

},{"./IndexStrategy/index":6,"./Sanitizer/index":9}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var REGEX = /[^a-zа-яё0-9\-']+/i;

/**
 * Simple tokenizer that splits strings on whitespace characters and returns an array of all non-empty substrings.
 */


var SimpleTokenizer = exports.SimpleTokenizer = function () {
  function SimpleTokenizer() {
    _classCallCheck(this, SimpleTokenizer);
  }

  _createClass(SimpleTokenizer, [{
    key: 'tokenize',


    /**
     * @inheritDocs
     */
    value: function tokenize(text) {
      return text.split(REGEX).filter(function (text) {
        return text;
      } // Filter empty tokens
      );
    }
  }]);

  return SimpleTokenizer;
}();

;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Stemming is the process of reducing search tokens to their root (or stem) so that searches for different forms of a
 * word will match. For example "search", "searching" and "searched" are all reduced to the stem "search".
 *
 * <p>This stemming tokenizer converts tokens (words) to their stem forms before returning them. It requires an
 * external stemming function to be provided; for this purpose I recommend the NPM 'porter-stemmer' library.
 *
 * <p>For more information see http : //tartarus.org/~martin/PorterStemmer/
 */
var StemmingTokenizer = exports.StemmingTokenizer = function () {

  /**
   * Constructor.
   *
   * @param stemmingFunction Function capable of accepting a word and returning its stem.
   * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
   */
  function StemmingTokenizer(stemmingFunction, decoratedTokenizer) {
    _classCallCheck(this, StemmingTokenizer);

    this._stemmingFunction = stemmingFunction;
    this._tokenizer = decoratedTokenizer;
  }

  /**
   * @inheritDocs
   */


  _createClass(StemmingTokenizer, [{
    key: 'tokenize',
    value: function tokenize(text) {
      return this._tokenizer.tokenize(text).map(this._stemmingFunction);
    }
  }]);

  return StemmingTokenizer;
}();

;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StopWordsTokenizer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StopWordsMap = require('../StopWordsMap');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Stop words are very common (e.g. "a", "and", "the") and are often not semantically meaningful in the context of a
 * search. This tokenizer removes stop words from a set of tokens before passing the remaining tokens along for
 * indexing or searching purposes.
 */
var StopWordsTokenizer = exports.StopWordsTokenizer = function () {

  /**
   * Constructor.
   *
   * @param decoratedIndexStrategy Index strategy to be run after all stop words have been removed.
   */
  function StopWordsTokenizer(decoratedTokenizer) {
    _classCallCheck(this, StopWordsTokenizer);

    this._tokenizer = decoratedTokenizer;
  }

  /**
   * @inheritDocs
   */


  _createClass(StopWordsTokenizer, [{
    key: 'tokenize',
    value: function tokenize(text) {
      return this._tokenizer.tokenize(text).filter(function (token) {
        return !_StopWordsMap.StopWordsMap[token];
      });
    }
  }]);

  return StopWordsTokenizer;
}();

;

},{"../StopWordsMap":14}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleTokenizer = require('./SimpleTokenizer');

Object.defineProperty(exports, 'SimpleTokenizer', {
  enumerable: true,
  get: function get() {
    return _SimpleTokenizer.SimpleTokenizer;
  }
});

var _StemmingTokenizer = require('./StemmingTokenizer');

Object.defineProperty(exports, 'StemmingTokenizer', {
  enumerable: true,
  get: function get() {
    return _StemmingTokenizer.StemmingTokenizer;
  }
});

var _StopWordsTokenizer = require('./StopWordsTokenizer');

Object.defineProperty(exports, 'StopWordsTokenizer', {
  enumerable: true,
  get: function get() {
    return _StopWordsTokenizer.StopWordsTokenizer;
  }
});

},{"./SimpleTokenizer":16,"./StemmingTokenizer":17,"./StopWordsTokenizer":18}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getNestedFieldValue;
/**
 * Find and return a nested object value.
 *
 * @param object to crawl
 * @param path Property path
 * @returns {any}
 */
function getNestedFieldValue(object, path) {
  path = path || [];
  object = object || {};

  var value = object;

  // walk down the property path
  for (var i = 0; i < path.length; i++) {
    value = value[path[i]];

    if (value == null) {
      return null;
    }
  }

  return value;
}

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./IndexStrategy/index');

Object.defineProperty(exports, 'AllSubstringsIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _index.AllSubstringsIndexStrategy;
  }
});
Object.defineProperty(exports, 'ExactWordIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _index.ExactWordIndexStrategy;
  }
});
Object.defineProperty(exports, 'PrefixIndexStrategy', {
  enumerable: true,
  get: function get() {
    return _index.PrefixIndexStrategy;
  }
});

var _index2 = require('./Sanitizer/index');

Object.defineProperty(exports, 'CaseSensitiveSanitizer', {
  enumerable: true,
  get: function get() {
    return _index2.CaseSensitiveSanitizer;
  }
});
Object.defineProperty(exports, 'LowerCaseSanitizer', {
  enumerable: true,
  get: function get() {
    return _index2.LowerCaseSanitizer;
  }
});

var _index3 = require('./SearchIndex/index');

Object.defineProperty(exports, 'TfIdfSearchIndex', {
  enumerable: true,
  get: function get() {
    return _index3.TfIdfSearchIndex;
  }
});
Object.defineProperty(exports, 'UnorderedSearchIndex', {
  enumerable: true,
  get: function get() {
    return _index3.UnorderedSearchIndex;
  }
});

var _index4 = require('./Tokenizer/index');

Object.defineProperty(exports, 'SimpleTokenizer', {
  enumerable: true,
  get: function get() {
    return _index4.SimpleTokenizer;
  }
});
Object.defineProperty(exports, 'StemmingTokenizer', {
  enumerable: true,
  get: function get() {
    return _index4.StemmingTokenizer;
  }
});
Object.defineProperty(exports, 'StopWordsTokenizer', {
  enumerable: true,
  get: function get() {
    return _index4.StopWordsTokenizer;
  }
});

var _Search = require('./Search');

Object.defineProperty(exports, 'Search', {
  enumerable: true,
  get: function get() {
    return _Search.Search;
  }
});

var _StopWordsMap = require('./StopWordsMap');

Object.defineProperty(exports, 'StopWordsMap', {
  enumerable: true,
  get: function get() {
    return _StopWordsMap.StopWordsMap;
  }
});

var _TokenHighlighter = require('./TokenHighlighter');

Object.defineProperty(exports, 'TokenHighlighter', {
  enumerable: true,
  get: function get() {
    return _TokenHighlighter.TokenHighlighter;
  }
});

},{"./IndexStrategy/index":6,"./Sanitizer/index":9,"./Search":10,"./SearchIndex/index":13,"./StopWordsMap":14,"./TokenHighlighter":15,"./Tokenizer/index":19}],22:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":23}],23:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
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
    var timeout = runTimeout(cleanUpNextTick);
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
    runClearTimeout(timeout);
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
        runTimeout(drainQueue);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],24:[function(require,module,exports){
/*! UIkit 3.0.0-beta.30 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define('uikit', ['jquery'], factory) :
	(global.UIkit = factory(global.jQuery));
}(this, (function ($) { 'use strict';

var $__default = 'default' in $ ? $['default'] : $;

var docEl = document.documentElement;
var win = $__default(window);
var doc = $__default(document);
var docElement = $__default(docEl);

var isRtl = docEl.getAttribute('dir') === 'rtl';

function isReady() {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !docEl.doScroll;
}

function ready(fn) {

    var handle = function () {
        off(document, 'DOMContentLoaded', handle);
        off(window, 'load', handle);
        fn();
    };

    if (isReady()) {
        fn();
    } else {
        on(document, 'DOMContentLoaded', handle);
        on(window, 'load', handle);
    }

}

function on(el, type, listener, useCapture) {
    if ( useCapture === void 0 ) useCapture = false;

    type.split(' ').forEach(function (type) { return toNode(el).addEventListener(type, listener, useCapture); });
}

function off(el, type, listener, useCapture) {
    if ( useCapture === void 0 ) useCapture = false;

    type.split(' ').forEach(function (type) { return toNode(el).removeEventListener(type, listener, useCapture); });
}

function one(el, type, listener, useCapture, condition) {

    var handler = function (e) {
        var result = !condition || condition(e);
        if (result) {
            off(el, type, handler, useCapture);
            listener(e, result);
        }
    };

    on(el, type, handler, useCapture);
}

function trigger(element, event) {
    var e = createEvent(event);
    toNode(element).dispatchEvent(e);
    return e;
}

function $trigger(element, event, data, local) {
    if ( local === void 0 ) local = false;

    var e = event instanceof $.Event ? event : $.Event(event);
    $__default(element)[local ? 'triggerHandler' : 'trigger'](e, data);
    return e;
}

var transitioncancel = 'transitioncancel';
function transition(element, props, duration, transition) {
    if ( duration === void 0 ) duration = 400;
    if ( transition === void 0 ) transition = 'linear';


    return promise(function (resolve, reject) {

        element = $__default(element);

        for (var name in props) {
            element.css(name, element.css(name));
        }

        var timer = setTimeout(function () { return element.trigger(transitionend); }, duration);

        one(element, (transitionend + " " + transitioncancel), function (ref) {
            var type = ref.type;

            clearTimeout(timer);
            element.removeClass('uk-transition').css('transition', '');
            type === transitioncancel ? reject() : resolve();
        }, false, function (ref) {
            var target = ref.target;

            return element.is(target);
        });

        element
            .addClass('uk-transition')
            .css('transition', ("all " + duration + "ms " + transition))
            .css(props);

    });

}

var Transition = {

    start: transition,

    stop: function stop(element) {
        trigger(element, transitionend);
        return promise.resolve();
    },

    cancel: function cancel(element) {
        trigger(element, transitioncancel);
        return promise.resolve();
    },

    inProgress: function inProgress(element) {
        return $__default(element).hasClass('uk-transition');
    }

};

var animationcancel = 'animationcancel';
var animationprefix = 'uk-animation-';
var clsCancelAnimation = 'uk-cancel-animation';
function animate(element, animation, duration, origin, out) {
    var arguments$1 = arguments;
    if ( duration === void 0 ) duration = 200;


    return promise(function (resolve, reject) {

        element = $__default(element);

        if (element.hasClass(clsCancelAnimation)) {
            requestAnimationFrame(function () { return promise.resolve().then(function () { return animate.apply(null, arguments$1).then(resolve, reject); }
                ); }
            );
            return;
        }

        var cls = animation + " " + animationprefix + (out ? 'leave' : 'enter');

        if (animation.lastIndexOf(animationprefix, 0) === 0) {

            if (origin) {
                cls += " " + animationprefix + origin;
            }

            if (out) {
                cls += " " + animationprefix + "reverse";
            }

        }

        reset();

        one(element, ((animationend || 'animationend') + " " + animationcancel), function (ref) {
            var type = ref.type;


            var hasReset = false;

            type === animationcancel ? reject() : resolve();

            requestAnimationFrame(function () {
                if (!hasReset) {
                    element.addClass(clsCancelAnimation);

                    requestAnimationFrame(function () { return element.removeClass(clsCancelAnimation); });
                }
            });

            promise.resolve().then(function () {
                hasReset = true;
                reset();
            });

        }, false, function (ref) {
            var target = ref.target;

            return element.is(target);
        });

        element
            .css('animation-duration', (duration + "ms"))
            .addClass(cls);

        if (!animationend) {
            requestAnimationFrame(function () { return Animation.cancel(element); });
        }

        function reset() {
            element.css('animation-duration', '');
            removeClass(element, (animationprefix + "\\S*"));
        }

    });

}

var inProgress = new RegExp((animationprefix + "(enter|leave)"));
var Animation = {

    in: function in$1(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, false);
    },

    out: function out(element, animation, duration, origin) {
        return animate(element, animation, duration, origin, true);
    },

    inProgress: function inProgress$1(element) {
        return inProgress.test($__default(element).attr('class'));
    },

    cancel: function cancel(element) {
        trigger(element, animationcancel);
        return promise.resolve();
    }

};

function isJQuery(obj) {
    return obj instanceof $__default;
}

function isWithin(element, selector) {
    element = $__default(element);
    return element.is(selector)
        ? true
        : isString(selector)
            ? element.parents(selector).length
            : toNode(selector).contains(element[0]);
}

function attrFilter(element, attr, pattern, replacement) {
    element = $__default(element);
    return element.attr(attr, function (i, value) { return value ? value.replace(pattern, replacement) : value; });
}

function removeClass(element, cls) {
    return attrFilter(element, 'class', new RegExp(("(^|\\s)" + cls + "(?!\\S)"), 'g'), '');
}

function createEvent(e, bubbles, cancelable, data) {
    if ( bubbles === void 0 ) bubbles = true;
    if ( cancelable === void 0 ) cancelable = false;
    if ( data === void 0 ) data = false;

    if (isString(e)) {
        var event = document.createEvent('Event');
        event.initEvent(e, bubbles, cancelable);
        e = event;
    }

    if (data) {
        assign(e, data);
    }

    return e;
}

function isInView(element, offsetTop, offsetLeft) {
    if ( offsetTop === void 0 ) offsetTop = 0;
    if ( offsetLeft === void 0 ) offsetLeft = 0;


    var rect = toNode(element).getBoundingClientRect();

    return rect.bottom >= -1 * offsetTop
        && rect.right >= -1 * offsetLeft
        && rect.top <= window.innerHeight + offsetTop
        && rect.left <= window.innerWidth + offsetLeft;
}

function scrolledOver(element) {

    element = toNode(element);

    var height = element.offsetHeight,
        top = positionTop(element),
        vp = window.innerHeight,
        vh = vp + Math.min(0, top - vp),
        diff = Math.max(0, vp - (docHeight() - (top + height)));

    return clamp(((vh + window.pageYOffset - top) / ((vh + (height - (diff < vp ? diff : 0)) ) / 100)) / 100);
}

function positionTop(element) {
    var top = 0;

    do {

        top += element.offsetTop;

    } while (element = element.offsetParent);

    return top;
}

function docHeight() {
    return Math.max(docEl.offsetHeight, docEl.scrollHeight);
}

function getIndex(index, elements, current) {
    if ( current === void 0 ) current = 0;


    elements = $__default(elements);

    var length = $__default(elements).length;

    index = (isNumber(index)
        ? index
        : index === 'next'
            ? current + 1
            : index === 'previous'
                ? current - 1
                : isString(index)
                    ? parseInt(index, 10)
                    : elements.index(index)
    ) % length;

    return index < 0 ? index + length : index;
}

var voidElements = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    menuitem: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};
function isVoidElement(element) {
    return voidElements[toNode(element).tagName.toLowerCase()];
}

var Dimensions = {

    ratio: function ratio(dimensions, prop, value) {

        var aProp = prop === 'width' ? 'height' : 'width';

        return ( obj = {}, obj[aProp] = Math.round(value * dimensions[aProp] / dimensions[prop]), obj[prop] = value, obj );
        var obj;
    },

    contain: function contain(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = assign({}, dimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] > maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    },

    cover: function cover(dimensions, maxDimensions) {
        var this$1 = this;

        dimensions = this.contain(dimensions, maxDimensions);

        $.each(dimensions, function (prop) { return dimensions = dimensions[prop] < maxDimensions[prop] ? this$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions; });

        return dimensions;
    }

};

function query(selector, context) {
    var selectors = getContextSelectors(selector);
    return selectors ? selectors.reduce(function (context, selector) { return toJQuery(selector, context); }, context) : toJQuery(selector);
}

function preventClick() {

    var timer = setTimeout(function () { return trigger(doc, 'click'); }, 0);

    one(doc, 'click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(timer);
    }, true);

}

function getData(el, attribute) {
    el = toNode(el);
    for (var i = 0, attrs = [attribute, ("data-" + attribute)]; i < attrs.length; i++) {
        if (el.hasAttribute(attrs[i])) {
            return el.getAttribute(attrs[i]);
        }
    }
}

function bind(fn, context) {
    return function (a) {
        var l = arguments.length;
        return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function promise(executor) {

    if (hasPromise) {
        return new Promise(executor);
    }

    var def = $__default.Deferred();

    executor(def.resolve, def.reject);

    return def;
}

promise.resolve = function (value) {
    return promise(function (resolve) {
        resolve(value);
    });
};

promise.reject = function (value) {
    return promise(function (_, reject) {
        reject(value);
    });
};

promise.all = function (iterable) {
    return hasPromise
        ? Promise.all(iterable)
        : $__default.when.apply($__default, iterable);
};

function classify(str) {
    return str.replace(/(?:^|[-_\/])(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; });
}

function hyphenate(str) {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

var camelizeRE = /-(\w)/g;
function camelize(str) {
    return str.replace(camelizeRE, toUpper)
}

function toUpper(_, c) {
    return c ? c.toUpperCase() : ''
}

var isArray = Array.isArray;

function isFunction(obj) {
    return typeof obj === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

function isBoolean(value) {
    return typeof value === 'boolean';
}

function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function isUndefined(value) {
    return value === undefined;
}

function isContextSelector(selector) {
    return isString(selector) && selector.match(/^[!>+-]/);
}

function getContextSelectors(selector) {
    return isContextSelector(selector) && selector.split(/(?=\s[!>+-])/g).map(function (value) { return value.trim(); });
}

var contextSelectors = {'!': 'closest', '+': 'nextAll', '-': 'prevAll'};
function toJQuery(element, context) {

    if (element === true) {
        return null;
    }

    try {

        if (context && isContextSelector(element) && element[0] !== '>') {

            var fn = contextSelectors[element[0]], selector = element.substr(1);

            context = $__default(context);

            if (fn === 'closest') {
                context = context.parent();
                selector = selector || '*';
            }

            element = context[fn](selector);

        } else {
            element = $__default(element, context);
        }

    } catch (e) {
        return null;
    }

    return element.length ? element : null;
}

function toNode(element) {
    return element && (isJQuery(element) ? element[0] : element);
}

function toBoolean(value) {
    return isBoolean(value)
        ? value
        : value === 'true' || value === '1' || value === ''
            ? true
            : value === 'false' || value === '0'
                ? false
                : value;
}

function toNumber(value) {
    var number = Number(value);
    return !isNaN(number) ? number : false;
}

function toList(value) {
    return isArray(value)
        ? value
        : isString(value)
            ? value.split(',').map(function (value) { return $.isNumeric(value)
                ? toNumber(value)
                : toBoolean(value.trim()); })
            : [value];
}

var vars = {};
function toMedia(value) {

    if (isString(value)) {
        if (value[0] === '@') {
            var name = "media-" + (value.substr(1));
            value = vars[name] || (vars[name] = parseFloat(getCssVar(name)));
        } else if (isNaN(value)) {
            return value;
        }
    }

    return value && !isNaN(value) ? ("(min-width: " + value + "px)") : false;
}

function coerce(type, value, context) {

    if (type === Boolean) {
        return toBoolean(value);
    } else if (type === Number) {
        return toNumber(value);
    } else if (type === 'jQuery') {
        return query(value, context);
    } else if (type === 'list') {
        return toList(value);
    } else if (type === 'media') {
        return toMedia(value);
    }

    return type ? type(value) : value;
}

function toMs(time) {
    return !time
        ? 0
        : time.substr(-2) === 'ms'
            ? parseFloat(time)
            : parseFloat(time) * 1000;
}

function swap(value, a, b) {
    return value.replace(new RegExp((a + "|" + b), 'mg'), function (match) {
        return match === a ? b : a
    });
}

var assign = Object.assign || function (target) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    target = Object(target);
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        if (source !== null) {
            for (var key in source) {
                if (hasOwn(source, key)) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
};

function clamp(number, min, max) {
    if ( min === void 0 ) min = 0;
    if ( max === void 0 ) max = 1;

    return Math.min(Math.max(number, min), max);
}

function noop() {}

var Observer = window.MutationObserver || window.WebKitMutationObserver;
var requestAnimationFrame = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 1000 / 60); };

var hasTouchEvents = 'ontouchstart' in window;
var hasPointerEvents = window.PointerEvent;
var hasPromise = 'Promise' in window;
var hasTouch = 'ontouchstart' in window
    || window.DocumentTouch && document instanceof DocumentTouch
    || navigator.msPointerEnabled && navigator.msMaxTouchPoints // IE 10
    || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

var pointerDown = !hasTouch ? 'mousedown' : ("mousedown " + (hasTouchEvents ? 'touchstart' : 'pointerdown'));
var pointerMove = !hasTouch ? 'mousemove' : ("mousemove " + (hasTouchEvents ? 'touchmove' : 'pointermove'));
var pointerUp = !hasTouch ? 'mouseup' :  ("mouseup " + (hasTouchEvents ? 'touchend' : 'pointerup'));
var pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
var pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

var transitionend = prefix('transition', 'transition-end');
var animationstart = prefix('animation', 'animation-start');
var animationend = prefix('animation', 'animation-end');

function getStyle(element, property, pseudoElt) {
    return (window.getComputedStyle(toNode(element), pseudoElt) || {})[property];
}

function getCssVar(name) {

    /* usage in css:  .var-name:before { content:"xyz" } */

    var val, doc = document.documentElement,
        element = doc.appendChild(document.createElement('div'));

    element.classList.add(("var-" + name));

    try {

        val = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
        val = JSON.parse(val);

    } catch (e) {}

    doc.removeChild(element);

    return val || undefined;
}

function getImage(src) {

    return promise(function (resolve, reject) {
        var img = new Image();

        img.onerror = reject;
        img.onload = function () { return resolve(img); };

        img.src = src;
    });

}

function prefix(name, event) {

    var ucase = classify(name),
        lowered = classify(event).toLowerCase(),
        classified = classify(event),
        element = document.body || document.documentElement,
        names = ( obj = {}, obj[name] = lowered, obj[("Webkit" + ucase)] = ("webkit" + classified), obj[("Moz" + ucase)] = lowered, obj[("o" + ucase)] = ("o" + classified + " o" + lowered), obj );
    var obj;

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }
}

/*
    Based on:
    Copyright (c) 2016 Wilson Page wilsonpage@me.com
    https://github.com/wilsonpage/fastdom
*/

var fastdom = {

    reads: [],
    writes: [],

    measure: function measure(task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
    },

    mutate: function mutate(task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
    },

    clear: function clear(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },

    flush: function flush() {

        runTasks(this.reads);
        runTasks(this.writes.splice(0, this.writes.length));

        this.scheduled = false;

        if (this.reads.length || this.writes.length) {
            scheduleFlush();
        }

    }

};

function scheduleFlush() {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        requestAnimationFrame(fastdom.flush.bind(fastdom));
    }
}

function runTasks(tasks) {
    var task;
    while (task = tasks.shift()) {
        task();
    }
}

function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

function MouseTracker() {}

MouseTracker.prototype = {

    positions: [],
    position: null,

    init: function init() {
        var this$1 = this;


        this.positions = [];
        this.position = null;

        var ticking = false;
        this.handler = function (e) {

            if (!ticking) {
                setTimeout(function () {

                    var time = Date.now(), length = this$1.positions.length;
                    if (length && (time - this$1.positions[length - 1].time > 100)) {
                        this$1.positions.splice(0, length);
                    }

                    this$1.positions.push({time: time, x: e.pageX, y: e.pageY});

                    if (this$1.positions.length > 5) {
                        this$1.positions.shift();
                    }

                    ticking = false;
                }, 5);
            }

            ticking = true;
        };

        doc.on('mousemove', this.handler);

    },

    cancel: function cancel() {
        if (this.handler) {
            doc.off('mousemove', this.handler);
        }
    },

    movesTo: function movesTo(target) {

        if (this.positions.length < 2) {
            return false;
        }

        var p = getDimensions(target),
            position = this.positions[this.positions.length - 1],
            prevPos = this.positions[0];

        if (p.left <= position.x && position.x <= p.right && p.top <= position.y && position.y <= p.bottom) {
            return false;
        }

        var points = [
            [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
            [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
        ];

        if (p.right <= position.x) {

        } else if (p.left >= position.x) {
            points[0].reverse();
            points[1].reverse();
        } else if (p.bottom <= position.y) {
            points[0].reverse();
        } else if (p.top >= position.y) {
            points[1].reverse();
        }

        return !!points.reduce(function (result, point) {
            return result + (slope(prevPos, point[0]) < slope(position, point[0]) && slope(prevPos, point[1]) > slope(position, point[1]));
        }, 0);
    }

};

function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
}

var strats = {};

// concat strategy
strats.args =
strats.created =
strats.events =
strats.init =
strats.ready =
strats.connected =
strats.disconnected =
strats.destroy = function (parentVal, childVal) {

    parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;

    return childVal
        ? parentVal
            ? parentVal.concat(childVal)
            : isArray(childVal)
                ? childVal
                : [childVal]
        : parentVal;
};

// update strategy
strats.update = function (parentVal, childVal) {
    return strats.args(parentVal, isFunction(childVal) ? {read: childVal} : childVal);
};

// property strategy
strats.props = function (parentVal, childVal) {

    if (isArray(childVal)) {
        childVal = childVal.reduce(function (value, key) {
            value[key] = String;
            return value;
        }, {});
    }

    return strats.methods(parentVal, childVal);
};

// extend strategy
strats.computed =
strats.defaults =
strats.methods = function (parentVal, childVal) {
    return childVal
        ? parentVal
            ? assign({}, parentVal, childVal)
            : childVal
        : parentVal;
};

// default strategy
var defaultStrat = function (parentVal, childVal) {
    return isUndefined(childVal) ? parentVal : childVal;
};

function mergeOptions(parent, child) {

    var options = {}, key;

    if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
            parent = mergeOptions(parent, child.mixins[i]);
        }
    }

    for (key in parent) {
        mergeKey(key);
    }

    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeKey(key);
        }
    }

    function mergeKey(key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key]);
    }

    return options;
}

var id = 0;

var Player = function Player(el) {
    this.id = ++id;
    this.el = toNode(el);
};

Player.prototype.isVideo = function isVideo () {
    return this.isYoutube() || this.isVimeo() || this.isHTML5();
};

Player.prototype.isHTML5 = function isHTML5 () {
    return this.el.tagName === 'VIDEO';
};

Player.prototype.isIFrame = function isIFrame () {
    return this.el.tagName === 'IFRAME';
};

Player.prototype.isYoutube = function isYoutube () {
    return this.isIFrame() && !!this.el.src.match(/\/\/.*?youtube\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
};

Player.prototype.isVimeo = function isVimeo () {
    return this.isIFrame() && !!this.el.src.match(/vimeo\.com\/video\/.*/);
};

Player.prototype.enableApi = function enableApi () {
        var this$1 = this;


    if (this.ready) {
        return this.ready;
    }

    var youtube = this.isYoutube(), vimeo = this.isVimeo(), poller;

    if (youtube || vimeo) {

        return this.ready = promise(function (resolve) {

            one(this$1.el, 'load', function () {
                if (youtube) {
                    var listener = function () { return post(this$1.el, {event: 'listening', id: this$1.id}); };
                    poller = setInterval(listener, 100);
                    listener();
                }
            });

            listen(function (data) { return youtube && data.id === this$1.id && data.event === 'onReady' || vimeo && Number(data.player_id) === this$1.id; })
                .then(function () {
                    resolve();
                    poller && clearInterval(poller);
                });

            this$1.el.setAttribute('src', ("" + (this$1.el.src) + (~this$1.el.src.indexOf('?') ? '&' : '?') + (youtube ? 'enablejsapi=1' : ("api=1&player_id=" + id))));

        });

    }

    return promise.resolve();

};

Player.prototype.play = function play () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'playVideo', method: 'play'}); });
    } else if (this.isHTML5()) {
        this.el.play();
    }
};

Player.prototype.pause = function pause () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'pauseVideo', method: 'pause'}); });
    } else if (this.isHTML5()) {
        this.el.pause();
    }
};

Player.prototype.mute = function mute () {
        var this$1 = this;


    if (!this.isVideo()) {
        return;
    }

    if (this.isIFrame()) {
        this.enableApi().then(function () { return post(this$1.el, {func: 'mute', method: 'setVolume', value: 0}); });
    } else if (this.isHTML5()) {
        this.el.muted = true;
        this.el.setAttribute('muted', '');
    }

};

function post(el, cmd) {
    try {
        el.contentWindow.postMessage(JSON.stringify(assign({event: 'command'}, cmd)), '*');
    } catch (e) {}
}

function listen(cb) {

    return promise(function (resolve) {

        one(window, 'message', function (_, data) { return resolve(data); }, false, function (ref) {
            var data = ref.data;


            if (!data || !isString(data)) {
                return;
            }

            try {
                data = JSON.parse(data);
            } catch(err) {
                return;
            }

            return data && cb(data);

        });

    });

}

var dirs = {
        x: ['width', 'left', 'right'],
        y: ['height', 'top', 'bottom']
    };
var docEl$1 = document.documentElement;

function position(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {

    elAttach = getPos(elAttach);
    targetAttach = getPos(targetAttach);

    var flipped = {element: elAttach, target: targetAttach};

    if (!element) {
        return flipped;
    }

    var dim = getDimensions(element),
        targetDim = getDimensions(target),
        position = targetDim;

    moveTo(position, elAttach, dim, -1);
    moveTo(position, targetAttach, targetDim, 1);

    elOffset = getOffsets(elOffset, dim.width, dim.height);
    targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

    elOffset['x'] += targetOffset['x'];
    elOffset['y'] += targetOffset['y'];

    position.left += elOffset['x'];
    position.top += elOffset['y'];

    boundary = getDimensions(boundary || window);

    if (flip) {
        $.each(dirs, function (dir, ref) {
            var prop = ref[0];
            var align = ref[1];
            var alignFlip = ref[2];


            if (!(flip === true || ~flip.indexOf(dir))) {
                return;
            }

            var elemOffset = elAttach[dir] === align
                    ? -dim[prop]
                    : elAttach[dir] === alignFlip
                        ? dim[prop]
                        : 0,
                targetOffset = targetAttach[dir] === align
                    ? targetDim[prop]
                    : targetAttach[dir] === alignFlip
                        ? -targetDim[prop]
                        : 0;

            if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {

                var centerOffset = dim[prop] / 2,
                    centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;

                elAttach[dir] === 'center' && (
                    apply(centerOffset, centerTargetOffset)
                    || apply(-centerOffset, -centerTargetOffset)
                ) || apply(elemOffset, targetOffset);

            }

            function apply(elemOffset, targetOffset) {

                var newVal = position[align] + elemOffset + targetOffset - elOffset[dir] * 2;

                if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                    position[align] = newVal;

                    ['element', 'target'].forEach(function (el) {
                        flipped[el][dir] = !elemOffset
                            ? flipped[el][dir]
                            : flipped[el][dir] === dirs[dir][1]
                                ? dirs[dir][2]
                                : dirs[dir][1];
                    });

                    return true;
                }

            }

        });
    }

    offset(element, position);

    return flipped;
}

function getDimensions(element) {

    element = toNode(element);

    var window = getWindow(element), top = window.pageYOffset, left = window.pageXOffset;

    if (!element.ownerDocument) {
        return {
            top: top,
            left: left,
            height: window.innerHeight,
            width: window.innerWidth,
            bottom: top + window.innerHeight,
            right: left + window.innerWidth,
        }
    }

    var display = false;
    if (!element.offsetHeight) {
        display = element.style.display;
        element.style.display = 'block';
    }

    var rect = element.getBoundingClientRect();

    if (display !== false) {
        element.style.display = display;
    }

    return {
        height: rect.height,
        width: rect.width,
        top: rect.top + top,
        left: rect.left + left,
        bottom: rect.bottom + top,
        right: rect.right + left,
    }
}

function offset(element, ref) {
    var left = ref.left;
    var top = ref.top;

    $__default(element).offset({left: left - docEl$1.clientLeft, top: top - docEl$1.clientTop});
}

function offsetTop(element) {
    element = toNode(element);
    return element.getBoundingClientRect().top + getWindow(element).pageYOffset;
}

function getWindow(element) {
    return element && element.ownerDocument ? element.ownerDocument.defaultView : window;
}

function moveTo(position, attach, dim, factor) {
    $.each(dirs, function (dir, ref) {
        var prop = ref[0];
        var align = ref[1];
        var alignFlip = ref[2];

        if (attach[dir] === alignFlip) {
            position[align] += dim[prop] * factor;
        } else if (attach[dir] === 'center') {
            position[align] += dim[prop] * factor / 2;
        }
    });
}

function getPos(pos) {

    var x = /left|center|right/, y = /top|center|bottom/;

    pos = (pos || '').split(' ');

    if (pos.length === 1) {
        pos = x.test(pos[0])
            ? pos.concat(['center'])
            : y.test(pos[0])
                ? ['center'].concat(pos)
                : ['center', 'center'];
    }

    return {
        x: x.test(pos[0]) ? pos[0] : 'center',
        y: y.test(pos[1]) ? pos[1] : 'center'
    };
}

function getOffsets(offsets, width, height) {

    offsets = (offsets || '').split(' ');

    return {
        x: offsets[0] ? parseFloat(offsets[0]) * (offsets[0][offsets[0].length - 1] === '%' ? width / 100 : 1) : 0,
        y: offsets[1] ? parseFloat(offsets[1]) * (offsets[1][offsets[1].length - 1] === '%' ? height / 100 : 1) : 0
    };
}

function flipPosition(pos) {
    switch (pos) {
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        case 'top':
            return 'bottom';
        case 'bottom':
            return 'top';
        default:
            return pos;
    }
}

/*
    Based on:
    Copyright (c) 2010-2016 Thomas Fuchs
    http://zeptojs.com/
*/

var touch = {};
var clickTimeout;
var swipeTimeout;
var tapTimeout;
var clicked;

function swipeDirection(ref) {
    var x1 = ref.x1;
    var x2 = ref.x2;
    var y1 = ref.y1;
    var y2 = ref.y2;

    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function cancelAll() {
    clickTimeout && clearTimeout(clickTimeout);
    swipeTimeout && clearTimeout(swipeTimeout);
    tapTimeout && clearTimeout(tapTimeout);
    clickTimeout = swipeTimeout = tapTimeout = null;
    touch = {};
}

ready(function () {

    on(document, 'click', function () { return clicked = true; }, true);

    on(document, pointerDown, function (e) {

        var ref = e.touches ? e.touches[0] : e;
        var target = ref.target;
        var pageX = ref.pageX;
        var pageY = ref.pageY;
        var now = Date.now();

        touch.el = 'tagName' in target ? target : target.parentNode;

        clickTimeout && clearTimeout(clickTimeout);

        touch.x1 = pageX;
        touch.y1 = pageY;

        if (touch.last && now - touch.last <= 250) {
            touch = {};
        }

        touch.last = now;

        clicked = e.button > 0;

    });

    on(document, pointerMove, function (e) {

        var ref = e.touches ? e.touches[0] : e;
        var pageX = ref.pageX;
        var pageY = ref.pageY;

        touch.x2 = pageX;
        touch.y2 = pageY;
    });

    on(document, pointerUp, function (ref) {
        var target = ref.target;


        // swipe
        if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {

            swipeTimeout = setTimeout(function () {
                if (touch.el) {
                    trigger(touch.el, 'swipe');
                    trigger(touch.el, ("swipe" + (swipeDirection(touch))));
                }
                touch = {};
            });

        // normal tap
        } else if ('last' in touch) {

            tapTimeout = setTimeout(function () { return touch.el && trigger(touch.el, 'tap'); });

            // trigger single click after 350ms of inactivity
            if (touch.el && isWithin(target, touch.el)) {
                clickTimeout = setTimeout(function () {
                    clickTimeout = null;
                    if (touch.el && !clicked) {
                        trigger(touch.el, 'click');
                    }
                    touch = {};
                }, 350);
            }

        } else {
            touch = {};
        }
    });

    on(document, 'touchcancel', cancelAll);
    on(window, 'scroll', cancelAll);
});

var touching = false;
on(document, 'touchstart', function () { return touching = true; }, true);
on(document, 'click', function () {touching = false;});
on(document, 'touchcancel', function () { return touching = false; }, true);

function isTouch(e) {
    return touching || (e.originalEvent || e).pointerType === 'touch';
}



var util = Object.freeze({
	win: win,
	doc: doc,
	docElement: docElement,
	isRtl: isRtl,
	isReady: isReady,
	ready: ready,
	on: on,
	off: off,
	one: one,
	trigger: trigger,
	$trigger: $trigger,
	transition: transition,
	Transition: Transition,
	animate: animate,
	Animation: Animation,
	isJQuery: isJQuery,
	isWithin: isWithin,
	attrFilter: attrFilter,
	removeClass: removeClass,
	createEvent: createEvent,
	isInView: isInView,
	scrolledOver: scrolledOver,
	docHeight: docHeight,
	getIndex: getIndex,
	isVoidElement: isVoidElement,
	Dimensions: Dimensions,
	query: query,
	preventClick: preventClick,
	getData: getData,
	Observer: Observer,
	requestAnimationFrame: requestAnimationFrame,
	hasPromise: hasPromise,
	hasTouch: hasTouch,
	pointerDown: pointerDown,
	pointerMove: pointerMove,
	pointerUp: pointerUp,
	pointerEnter: pointerEnter,
	pointerLeave: pointerLeave,
	transitionend: transitionend,
	animationstart: animationstart,
	animationend: animationend,
	getStyle: getStyle,
	getCssVar: getCssVar,
	getImage: getImage,
	fastdom: fastdom,
	$: $__default,
	bind: bind,
	hasOwn: hasOwn,
	promise: promise,
	classify: classify,
	hyphenate: hyphenate,
	camelize: camelize,
	isArray: isArray,
	isFunction: isFunction,
	isObject: isObject,
	isPlainObject: isPlainObject,
	isBoolean: isBoolean,
	isString: isString,
	isNumber: isNumber,
	isUndefined: isUndefined,
	isContextSelector: isContextSelector,
	getContextSelectors: getContextSelectors,
	toJQuery: toJQuery,
	toNode: toNode,
	toBoolean: toBoolean,
	toNumber: toNumber,
	toList: toList,
	toMedia: toMedia,
	coerce: coerce,
	toMs: toMs,
	swap: swap,
	assign: assign,
	clamp: clamp,
	noop: noop,
	ajax: $.ajax,
	each: $.each,
	Event: $.Event,
	isNumeric: $.isNumeric,
	MouseTracker: MouseTracker,
	mergeOptions: mergeOptions,
	Player: Player,
	position: position,
	getDimensions: getDimensions,
	offset: offset,
	offsetTop: offsetTop,
	flipPosition: flipPosition,
	isTouch: isTouch
});

var boot = function (UIkit) {

    var doc = document.documentElement;
    var connect = UIkit.connect;
    var disconnect = UIkit.disconnect;

    if (Observer) {

        if (document.body) {

            init();

        } else {

            (new Observer(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(doc, {childList: true, subtree: true});

        }

    } else {

        ready(function () {
            apply(document.body, connect);
            on(doc, 'DOMNodeInserted', function (e) { return apply(e.target, connect); });
            on(doc, 'DOMNodeRemoved', function (e) { return apply(e.target, disconnect); });
        });

    }

    function init() {

        apply(document.body, connect);

        fastdom.flush();

        (new Observer(function (mutations) { return mutations.forEach(function (ref) {
                var addedNodes = ref.addedNodes;
                var removedNodes = ref.removedNodes;
                var target = ref.target;


                for (var i = 0; i < addedNodes.length; i++) {
                    apply(addedNodes[i], connect);
                }

                for (i = 0; i < removedNodes.length; i++) {
                    apply(removedNodes[i], disconnect);
                }

                UIkit.update('update', target, true);

            }); }
        )).observe(doc, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href']});

        UIkit._initialized = true;
    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE || node.hasAttribute('uk-no-boot')) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            var next = node.nextSibling;
            apply(node, fn);
            node = next;
        }
    }

};

var globalAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.use = function (plugin) {

        if (plugin.installed) {
            return;
        }

        plugin.call(null, this);
        plugin.installed = true;

        return this;
    };

    UIkit.mixin = function (mixin, component) {
        component = (isString(component) ? UIkit.components[component] : component) || this;
        mixin = mergeOptions({}, mixin);
        mixin.mixins = component.options.mixins;
        delete component.options.mixins;
        component.options = mergeOptions(mixin, component.options);
    };

    UIkit.extend = function (options) {

        options = options || {};

        var Super = this, name = options.name || Super.options.name;
        var Sub = createClass(name || 'UIkitComponent');

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);

        Sub['super'] = Super;
        Sub.extend = Super.extend;

        return Sub;
    };

    UIkit.update = function (e, element, parents) {
        if ( parents === void 0 ) parents = false;


        e = createEvent(e || 'update');

        if (!element) {

            update(UIkit.instances, e);
            return;

        }

        element = toNode(element);

        if (parents) {

            do {

                update(element[DATA], e);
                element = element.parentNode;

            } while (element)

        } else {

            apply(element, function (element) { return update(element[DATA], e); });

        }

    };

    var container;
    Object.defineProperty(UIkit, 'container', {

        get: function get() {
            return container || document.body;
        },

        set: function set(element) {
            container = element;
        }

    });

    function createClass(name) {
        return new Function(("return function " + (classify(name)) + " (options) { this._init(options); }"))();
    }

    function apply(node, fn) {

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        fn(node);
        node = node.firstChild;
        while (node) {
            apply(node, fn);
            node = node.nextSibling;
        }
    }

    function update(data, e) {

        if (!data) {
            return;
        }

        for (var name in data) {
            if (data[name]._isReady) {
                data[name]._callUpdate(e);
            }
        }

    }

};

var hooksAPI = function (UIkit) {

    UIkit.prototype._callHook = function (hook) {
        var this$1 = this;


        var handlers = this.$options[hook];

        if (handlers) {
            handlers.forEach(function (handler) { return handler.call(this$1); });
        }
    };

    UIkit.prototype._callReady = function () {

        if (this._isReady) {
            return;
        }

        this._isReady = true;
        this._callHook('ready');
        this._callUpdate();
    };

    UIkit.prototype._callConnected = function () {
        var this$1 = this;


        if (this._connected) {
            return;
        }

        if (!~UIkit.elements.indexOf(this.$options.el)) {
            UIkit.elements.push(this.$options.el);
        }

        UIkit.instances[this._uid] = this;

        this._initEvents();

        this._callHook('connected');
        this._connected = true;

        this._initObserver();

        if (!this._isReady) {
            ready(function () { return this$1._callReady(); });
        }

        this._callUpdate();
    };

    UIkit.prototype._callDisconnected = function () {

        if (!this._connected) {
            return;
        }

        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }

        var index = UIkit.elements.indexOf(this.$options.el);

        if (~index) {
            UIkit.elements.splice(index, 1);
        }

        delete UIkit.instances[this._uid];

        this._initEvents(true);
        this._callHook('disconnected');

        this._connected = false;

    };

    UIkit.prototype._callUpdate = function (e) {
        var this$1 = this;


        e = createEvent(e || 'update');

        if (e.type === 'update') {
            this._computeds = {};
        }

        var updates = this.$options.update;

        if (!updates) {
            return;
        }

        updates.forEach(function (update, i) {

            if (e.type !== 'update' && (!update.events || !~update.events.indexOf(e.type))) {
                return;
            }

            if (update.read && !~fastdom.reads.indexOf(this$1._frames.reads[i])) {
                this$1._frames.reads[i] = fastdom.measure(function () {
                    update.read.call(this$1, e);
                    delete this$1._frames.reads[i];
                });
            }

            if (update.write && !~fastdom.writes.indexOf(this$1._frames.writes[i])) {
                this$1._frames.writes[i] = fastdom.mutate(function () {
                    update.write.call(this$1, e);
                    delete this$1._frames.writes[i];
                });
            }

        });

    };

};

var stateAPI = function (UIkit) {

    var uid = 0;

    UIkit.prototype.props = {};

    UIkit.prototype._init = function (options) {

        options = options || {};
        options = this.$options = mergeOptions(this.constructor.options, options, this);

        this.$el = null;
        this.$name = UIkit.prefix + hyphenate(this.$options.name);
        this.$props = {};

        this._frames = {reads: {}, writes: {}};

        this._uid = uid++;
        this._initData();
        this._initMethods();
        this._initComputeds();
        this._callHook('created');

        if (options.el) {
            this.$mount(options.el);
        }
    };

    UIkit.prototype._initData = function () {
        var this$1 = this;


        var ref = this.$options;
        var defaults = ref.defaults;
        var data = ref.data; if ( data === void 0 ) data = {};
        var args = ref.args; if ( args === void 0 ) args = [];
        var props = ref.props; if ( props === void 0 ) props = {};
        var el = ref.el;

        if (args.length && isArray(data)) {
            data = data.slice(0, args.length).reduce(function (data, value, index) {
                if (isPlainObject(value)) {
                    assign(data, value);
                } else {
                    data[args[index]] = value;
                }
                return data;
            }, {});
        }

        for (var key in defaults) {
            this$1.$props[key] = this$1[key] = hasOwn(data, key) && !isUndefined(data[key])
                ? coerce(props[key], data[key], el)
                : isArray(defaults[key])
                    ? defaults[key].concat()
                    : defaults[key];
        }
    };

    UIkit.prototype._initMethods = function () {
        var this$1 = this;


        var methods = this.$options.methods;

        if (methods) {
            for (var key in methods) {
                this$1[key] = bind(methods[key], this$1);
            }
        }
    };

    UIkit.prototype._initComputeds = function () {
        var this$1 = this;


        var computed = this.$options.computed;

        this._computeds = {};

        if (computed) {
            for (var key in computed) {
                registerComputed(this$1, key, computed[key]);
            }
        }
    };

    UIkit.prototype._initProps = function (props) {
        var this$1 = this;


        this._computeds = {};
        assign(this.$props, props || getProps(this.$options, this.$name));

        var exclude = [this.$options.computed, this.$options.methods];
        for (var key in this$1.$props) {
            if (notIn(exclude, key)) {
                this$1[key] = this$1.$props[key];
            }
        }
    };

    UIkit.prototype._initEvents = function (unbind) {
        var this$1 = this;


        var events = this.$options.events;

        if (events) {

            events.forEach(function (event) {

                if (!hasOwn(event, 'handler')) {
                    for (var key in event) {
                        registerEvent(this$1, unbind, event[key], key);
                    }
                } else {
                    registerEvent(this$1, unbind, event);
                }

            });
        }
    };

    UIkit.prototype._initObserver = function () {
        var this$1 = this;


        var ref = this.$options;
        var attrs = ref.attrs;
        var props = ref.props;
        var el = ref.el;
        if (this._observer || !props || !attrs || !Observer) {
            return;
        }

        attrs = isArray(attrs) ? attrs : Object.keys(props).map(function (key) { return hyphenate(key); });

        this._observer = new Observer(function () {

            var data = getProps(this$1.$options, this$1.$name);
            if (attrs.some(function (key) { return !equals(data[key], this$1.$props[key]); })) {
                this$1.$reset(data);
            }

        });

        this._observer.observe(el, {attributes: true, attributeFilter: attrs.concat([this.$name, ("data-" + (this.$name))])});
    };

    function getProps(opts, name) {

        var data = {};
        var args = opts.args; if ( args === void 0 ) args = [];
        var props = opts.props; if ( props === void 0 ) props = {};
        var el = opts.el;
        var key, prop;

        if (!props) {
            return data;
        }

        for (key in props) {
            prop = hyphenate(key);
            if (el.hasAttribute(prop)) {

                var value = coerce(props[key], el.getAttribute(prop), el);

                if (prop === 'target' && (!value || value.lastIndexOf('_', 0) === 0)) {
                    continue;
                }

                data[key] = value;
            }
        }

        var options = parseOptions(getData(el, name), args);

        for (key in options) {
            prop = camelize(key);
            if (props[prop] !== undefined) {
                data[prop] = coerce(props[prop], options[key], el);
            }
        }

        return data;
    }

    function parseOptions(options, args) {
        if ( args === void 0 ) args = [];


        try {

            return !options
                ? {}
                : options[0] === '{'
                    ? JSON.parse(options)
                    : args.length && !~options.indexOf(':')
                        ? (( obj = {}, obj[args[0]] = options, obj ))
                        : options.split(';').reduce(function (options, option) {
                            var ref = option.split(/:(.+)/);
                            var key = ref[0];
                            var value = ref[1];
                            if (key && value) {
                                options[key.trim()] = value.trim();
                            }
                            return options;
                        }, {});
            var obj;

        } catch (e) {
            return {};
        }

    }

    function registerComputed(component, key, cb) {
        Object.defineProperty(component, key, {

            enumerable: true,

            get: function get() {

                if (!hasOwn(component._computeds, key)) {
                    component._computeds[key] = cb.call(component);
                }

                return component._computeds[key];
            },

            set: function set(value) {
                component._computeds[key] = value;
            }

        });
    }

    function registerEvent(component, unbind, event, key) {

        if (!isPlainObject(event)) {
            event = ({name: key, handler: event});
        }

        var name = event.name;
        var el = event.el;
        var delegate = event.delegate;
        var self = event.self;
        var filter = event.filter;
        var handler = event.handler;
        var namespace = "." + (component.$options.name) + "." + (component._uid);

        el = el && el.call(component) || component.$el;

        name = name.split(' ').map(function (name) { return (name + "." + namespace); }).join(' ');

        if (unbind) {

            el.off(name);

        } else {

            if (filter && !filter.call(component)) {
                return;
            }

            handler = isString(handler) ? component[handler] : bind(handler, component);

            if (self) {
                handler = selfFilter(handler, component);
            }

            if (delegate) {
                el.on(name, isString(delegate) ? delegate : delegate.call(component), handler);
            } else {
                el.on(name, handler);
            }
        }

    }

    function selfFilter(handler, context) {
        return function selfHandler(e) {
            if (e.target === e.currentTarget) {
                return handler.call(context, e)
            }
        }
    }

    function notIn(options, key) {
        return options.every(function (arr) { return !arr || !hasOwn(arr, key); });
    }

    function equals(a, b) {
        return isUndefined(a) || a === b || isJQuery(a) && isJQuery(b) && a.is(b);
    }

};

var instanceAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {

        var name = this.$options.name;

        if (!el[DATA]) {
            el[DATA] = {};
        }

        if (el[DATA][name]) {
            return;
        }

        el[DATA][name] = this;

        this.$options.el = this.$options.el || el;
        this.$el = $__default(el);

        this._initProps();

        this._callHook('init');

        if (document.documentElement.contains(el)) {
            this._callConnected();
        }
    };

    UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    UIkit.prototype.$update = function (e, parents) {
        UIkit.update(e, this.$options.el, parents);
    };

    UIkit.prototype.$reset = function (data) {
        this._callDisconnected();
        this._initProps(data);
        this._callConnected();
    };

    UIkit.prototype.$destroy = function (remove) {
        if ( remove === void 0 ) remove = false;


        var ref = this.$options;
        var el = ref.el;
        var name = ref.name;

        if (el) {
            this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el || !el[DATA]) {
            return;
        }

        delete el[DATA][name];

        if (!Object.keys(el[DATA]).length) {
            delete el[DATA];
        }

        if (remove) {
            this.$el.remove();
        }
    };

};

var componentAPI = function (UIkit) {

    var DATA = UIkit.data;

    UIkit.components = {};

    UIkit.component = function (id, options) {

        var name = camelize(id);

        if (isPlainObject(options)) {
            options.name = name;
            options = UIkit.extend(options);
        } else if (isUndefined(options)) {
            return UIkit.components[name]
        } else {
            options.options.name = name;
        }

        UIkit.components[name] = options;

        UIkit[name] = function (element, data) {
            var i = arguments.length, argsArray = Array(i);
            while ( i-- ) argsArray[i] = arguments[i];


            if (isPlainObject(element)) {
                return new UIkit.components[name]({data: element});
            }

            if (UIkit.components[name].options.functional) {
                return new UIkit.components[name]({data: [].concat( argsArray )});
            }

            return element && element.nodeType ? init(element) : $__default(element).toArray().map(init)[0];

            function init(element) {
                return UIkit.getComponent(element, name) || new UIkit.components[name]({el: element, data: data || {}});
            }

        };

        if (UIkit._initialized && !options.options.functional) {
            fastdom.measure(function () { return UIkit[name](("[uk-" + id + "],[data-uk-" + id + "]")); });
        }

        return UIkit.components[name];
    };

    UIkit.getComponents = function (element) { return element && (element = isJQuery(element) ? element[0] : element) && element[DATA] || {}; };
    UIkit.getComponent = function (element, name) { return UIkit.getComponents(element)[name]; };

    UIkit.connect = function (node) {

        var name;

        if (node[DATA]) {
            for (name in node[DATA]) {
                node[DATA][name]._callConnected();
            }
        }

        for (var i = 0; i < node.attributes.length; i++) {

            name = node.attributes[i].name;

            if (name.lastIndexOf('uk-', 0) === 0 || name.lastIndexOf('data-uk-', 0) === 0) {

                name = camelize(name.replace('data-uk-', '').replace('uk-', ''));

                if (UIkit[name]) {
                    UIkit[name](node);
                }
            }
        }

    };

    UIkit.disconnect = function (node) {
        for (var name in node[DATA]) {
            node[DATA][name]._callDisconnected();
        }
    };

};

var supportsMultiple;
var supportsForce;

var classAPI = function (UIkit) {

    UIkit.prototype.$addClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        apply(this.$options.el, args, 'add');
    };

    UIkit.prototype.$removeClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        apply(this.$options.el, args, 'remove');
    };

    UIkit.prototype.$hasClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return (args = getArgs(args, this.$options.el)) && args[0].contains(args[1]);
    };

    UIkit.prototype.$toggleClass = function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        args = getArgs(args, this.$options.el);

        var force = args && !isString(args[args.length - 1]) ? args.pop() : undefined;

        for (var i = 1; i < (args && args.length); i++) {
            args[0] && supportsForce
                ? args[0].toggle(args[i], force)
                : (args[0][(!isUndefined(force) ? force : !args[0].contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    };

    function apply(el, args, fn) {
        (args = getArgs(args, el)) && (supportsMultiple
            ? args[0][fn].apply(args[0], args.slice(1))
            : args.slice(1).forEach(function (cls) { return args[0][fn](cls); }));
    }

    function getArgs(args, el) {

        isString(args[0]) && args.unshift(el);
        args[0] = (toNode(args[0]) || {}).classList;

        args.forEach(function (arg, i) { return i > 0 && isString(arg) && ~arg.indexOf(' ') && Array.prototype.splice.apply(args, [i, 1].concat(args[i].split(' '))); }
        );

        return args[0] && args[1] && args.length > 1 && args;
    }

};

(function() {

    var list = document.createElement('_').classList;
    if (list) {
        list.add('a', 'b');
        list.toggle('c', false);
        supportsMultiple = list.contains('b');
        supportsForce = !list.contains('c');
    }
    list = null;

})();

var UIkit$2 = function (options) {
    this._init(options);
};

UIkit$2.util = util;
UIkit$2.data = '__uikit__';
UIkit$2.prefix = 'uk-';
UIkit$2.options = {};
UIkit$2.instances = {};
UIkit$2.elements = [];

globalAPI(UIkit$2);
hooksAPI(UIkit$2);
stateAPI(UIkit$2);
instanceAPI(UIkit$2);
componentAPI(UIkit$2);
classAPI(UIkit$2);

var Class = {

    init: function init() {
        this.$addClass(this.$name);
    }

};

var Togglable = {

    props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        origin: String,
        transition: String,
        queued: Boolean
    },

    defaults: {
        cls: false,
        animation: [false],
        duration: 200,
        origin: false,
        transition: 'linear',
        queued: false,

        initProps: {
            overflow: '',
            height: '',
            paddingTop: '',
            paddingBottom: '',
            marginTop: '',
            marginBottom: ''
        },

        hideProps: {
            overflow: 'hidden',
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }

    },

    computed: {

        hasAnimation: function hasAnimation() {
            return !!this.animation[0];
        },

        hasTransition: function hasTransition() {
            return this.hasAnimation && this.animation[0] === true;
        }

    },

    methods: {

        toggleElement: function toggleElement(targets, show, animate) {
            var this$1 = this;

            return promise(function (resolve) {

                targets = $__default(targets).toArray();

                var all = function (targets) { return promise.all(targets.map(function (el) { return this$1._toggleElement(el, show, animate); })); },
                    toggled = targets.filter(function (el) { return this$1.isToggled(el); }),
                    untoggled = targets.filter(function (el) { return !~toggled.indexOf(el); }),
                    p;

                if (!this$1.queued || !isUndefined(animate) || !isUndefined(show) || !this$1.hasAnimation || targets.length < 2) {

                    p = all(untoggled.concat(toggled));

                } else {

                    var body = document.body,
                        scroll = body.scrollTop,
                        el = toggled[0],
                        inProgress = Animation.inProgress(el) && this$1.$hasClass(el, 'uk-animation-leave')
                            || Transition.inProgress(el) && el.style.height === '0px';

                    p = all(toggled);

                    if (!inProgress) {
                        p = p.then(function () {
                            var p = all(untoggled);
                            body.scrollTop = scroll;
                            return p;
                        });
                    }

                }

                p.then(resolve, noop);

            });
        },

        toggleNow: function toggleNow(targets, show) {
            var this$1 = this;

            return promise(function (resolve) { return promise.all($__default(targets).toArray().map(function (el) { return this$1._toggleElement(el, show, false); })).then(resolve, noop); });
        },

        isToggled: function isToggled(el) {
            el = el && $__default(el) || this.$el;
            return this.cls ? el.hasClass(this.cls.split(' ')[0]) : !el.attr('hidden');
        },

        updateAria: function updateAria(el) {
            if (this.cls === false) {
                el.attr('aria-hidden', !this.isToggled(el));
            }
        },

        _toggleElement: function _toggleElement(el, show, animate) {
            var this$1 = this;


            el = $__default(el);

            show = isBoolean(show)
                ? show
                : Animation.inProgress(el)
                    ? this.$hasClass(el, 'uk-animation-leave')
                    : Transition.inProgress(el)
                        ? el[0].style.height === '0px'
                        : !this.isToggled(el);

            if ($trigger(el, ("before" + (show ? 'show' : 'hide')), [this]).result === false) {
                return promise.reject();
            }

            var def = (animate === false || !this.hasAnimation
                ? this._toggleImmediate
                : this.hasTransition
                    ? this._toggleHeight
                    : this._toggleAnimation
            )(el, show);

            var e = $.Event(show ? 'show' : 'hide');
            e.preventDefault(); // workaround for Prototype and MooTools: it keeps jQuery from calling show or hide on the Element itself
            $trigger(el, e, [this]);

            return def.then(function () {
                $trigger(el, show ? 'shown' : 'hidden', [this$1]);
                UIkit$2.update(null, el);
            });
        },

        _toggle: function _toggle(el, toggled) {

            el = $__default(el);

            if (this.cls) {
                el.toggleClass(this.cls, ~this.cls.indexOf(' ') ? undefined : toggled);
            } else {
                el.attr('hidden', !toggled);
            }

            el.find('[autofocus]:visible').focus();

            this.updateAria(el);
            UIkit$2.update(null, el);
        },

        _toggleImmediate: function _toggleImmediate(el, show) {
            this._toggle(el, show);
            return promise.resolve();
        },

        _toggleHeight: function _toggleHeight(el, show) {
            var this$1 = this;


            var children = el.children(),
                inProgress = Transition.inProgress(el),
                inner = children.length ? parseFloat(children.first().css('margin-top')) + parseFloat(children.last().css('margin-bottom')) : 0,
                height = el[0].offsetHeight ? el.height() + (inProgress ? 0 : inner) : 0,
                endHeight;

            Transition.cancel(el);

            if (!this.isToggled(el)) {
                this._toggle(el, true);
            }

            el.height('');

            // Update child components first
            fastdom.flush();

            endHeight = el.height() + (inProgress ? 0 : inner);
            el.height(height);

            return (show
                ? Transition.start(el, assign({}, this.initProps, {overflow: 'hidden', height: endHeight}), Math.round(this.duration * (1 - height / endHeight)), this.transition)
                : Transition.start(el, this.hideProps, Math.round(this.duration * (height / endHeight)), this.transition).then(function () { return this$1._toggle(el, false); })
            ).then(function () { return el.css(this$1.initProps); });

        },

        _toggleAnimation: function _toggleAnimation(el, show) {
            var this$1 = this;


            if (Animation.inProgress(el)) {
                return Animation.cancel(el).then(function () {

                    if (Animation.inProgress(el)) {
                        return promise.resolve().then(function () { return this$1._toggleAnimation(el, show); });
                    }

                    return this$1._toggleAnimation(el, show);
                });
            }

            if (show) {
                this._toggle(el, true);
                return Animation.in(el, this.animation[0], this.duration, this.origin);
            }

            return Animation.out(el, this.animation[1] || this.animation[0], this.duration, this.origin).then(function () { return this$1._toggle(el, false); });
        }

    }

};

var active;

var Modal = {

    mixins: [Class, Togglable],

    props: {
        clsPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean,
        container: Boolean
    },

    defaults: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false,
        container: true
    },

    computed: {

        body: function body() {
            return $__default(document.body);
        },

        panel: function panel() {
            return this.$el.find(("." + (this.clsPanel)));
        },

        container: function container() {
            return toNode(this.$props.container === true && UIkit$2.container || this.$props.container && toJQuery(this.$props.container));
        },

        transitionElement: function transitionElement() {
            return this.panel;
        },

        transitionDuration: function transitionDuration() {
            return toMs(this.transitionElement.css('transition-duration'));
        },

        component: function component() {
            return UIkit$2[this.$options.name];
        }

    },

    events: [

        {

            name: 'click',

            delegate: function delegate() {
                return this.selClose;
            },

            handler: function handler(e) {
                e.preventDefault();
                this.hide();
            }

        },

        {

            name: 'toggle',

            handler: function handler(e) {
                e.preventDefault();
                this.toggle();
            }

        },

        {

            name: 'show',

            self: true,

            handler: function handler() {

                if (!docElement.hasClass(this.clsPage)) {
                    this.scrollbarWidth = window.innerWidth - docElement[0].offsetWidth;
                    this.body.css('overflow-y', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                }

                docElement.addClass(this.clsPage);

            }

        },

        {

            name: 'hidden',

            self: true,

            handler: function handler() {
                if (this.component.active === this) {
                    docElement.removeClass(this.clsPage);
                    this.body.css('overflow-y', '');
                    this.component.active = null;
                }
            }

        }

    ],

    methods: {

        toggle: function toggle() {
            return this.isToggled() ? this.hide() : this.show();
        },

        show: function show() {
            var this$1 = this;


            if (this.isToggled()) {
                return;
            }

            if (this.container && !this.$el.parent().is(this.container)) {
                this.container.appendChild(this.$el[0]);
                return promise(function (resolve) { return requestAnimationFrame(function () { return resolve(this$1.show()); }
                    ); }
                )
            }

            var prev = active && active !== this && active;

            active = this;
            this.component.active = this;

            if (prev) {
                if (this.stack) {
                    this.prev = prev;
                } else {
                    prev.hide().then(this.show);
                    return;
                }
            } else {
                requestAnimationFrame(function () { return register(this$1.$options.name); }); // TODO improve
            }

            return this.toggleNow(this.$el, true);
        },

        hide: function hide() {

            if (!this.isToggled()) {
                return;
            }

            active = active && active !== this && active || this.prev;

            if (!active) {
                deregister(this.$options.name);
            }

            return this.toggleNow(this.$el, false);
        },

        getActive: function getActive() {
            return active;
        },

        _toggleImmediate: function _toggleImmediate(el, show) {
            var this$1 = this;


            requestAnimationFrame(function () { return this$1._toggle(el, show); });

            return this.transitionDuration ? promise(function (resolve, reject) {

                if (this$1._transition) {
                    this$1.transitionElement.off(transitionend, this$1._transition.handler);
                    this$1._transition.reject();
                }

                this$1._transition = {
                    reject: reject,
                    handler: function () {
                        resolve();
                        this$1._transition = null;
                    }
                };

                this$1.transitionElement.one(transitionend, this$1._transition.handler);

            }) : promise.resolve();

        },
    }

};

function register(name) {
    doc.on(( obj = {}, obj[("click." + name)] = function (e) {
            if (active && active.bgClose && !e.isDefaultPrevented() && !isWithin(e.target, active.panel)) {
                active.hide();
            }
        }, obj[("keydown." + name)] = function (e) {
            if (e.keyCode === 27 && active && active.escClose) {
                e.preventDefault();
                active.hide();
            }
        }, obj ));
    var obj;
}

function deregister(name) {
    doc.off(("click." + name)).off(("keydown." + name));
}

var Position = {

    props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String
    },

    defaults: {
        pos: !isRtl ? 'bottom-left' : 'bottom-right',
        flip: true,
        offset: false,
        clsPos: ''
    },

    computed: {

        pos: function pos() {
            return (this.$props.pos + (!~this.$props.pos.indexOf('-') ? '-center' : '')).split('-');
        },

        dir: function dir() {
            return this.pos[0];
        },

        align: function align() {
            return this.pos[1];
        }

    },

    methods: {

        positionAt: function positionAt(element, target, boundary) {

            removeClass(element, ((this.clsPos) + "-(top|bottom|left|right)(-[a-z]+)?")).css({top: '', left: ''});

            var offset = toNumber(this.offset) || 0,
                axis = this.getAxis(),
                flipped = position(
                    element,
                    target,
                    axis === 'x' ? ((flipPosition(this.dir)) + " " + (this.align)) : ((this.align) + " " + (flipPosition(this.dir))),
                    axis === 'x' ? ((this.dir) + " " + (this.align)) : ((this.align) + " " + (this.dir)),
                    axis === 'x' ? ("" + (this.dir === 'left' ? -1 * offset : offset)) : (" " + (this.dir === 'top' ? -1 * offset : offset)),
                    null,
                    this.flip,
                    boundary
                );

            this.dir = axis === 'x' ? flipped.target.x : flipped.target.y;
            this.align = axis === 'x' ? flipped.target.y : flipped.target.x;

            element.toggleClass(((this.clsPos) + "-" + (this.dir) + "-" + (this.align)), this.offset === false);

        },

        getAxis: function getAxis() {
            return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
        }

    }

};

var mixin = function (UIkit) {

    UIkit.mixin.class = Class;
    UIkit.mixin.modal = Modal;
    UIkit.mixin.position = Position;
    UIkit.mixin.togglable = Togglable;

};

var Accordion = function (UIkit) {

    UIkit.component('accordion', {

        mixins: [Class, Togglable],

        props: {
            targets: String,
            active: null,
            collapsible: Boolean,
            multiple: Boolean,
            toggle: String,
            content: String,
            transition: String
        },

        defaults: {
            targets: '> *',
            active: false,
            animation: [true],
            collapsible: true,
            multiple: false,
            clsOpen: 'uk-open',
            toggle: '> .uk-accordion-title',
            content: '> .uk-accordion-content',
            transition: 'ease'
        },

        computed: {

            items: function items() {
                var this$1 = this;

                var items = $__default(this.targets, this.$el);
                this._changed = !this._items
                    || items.length !== this._items.length
                    || items.toArray().some(function (el, i) { return el !== this$1._items.get(i); });
                return this._items = items;
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.targets) + " " + (this.$props.toggle));
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.toggle(this.items.find(this.$props.toggle).index(e.currentTarget));
                }

            }

        ],

        update: function update() {
            var this$1 = this;


            if (!this.items.length || !this._changed) {
                return;
            }

            this.items.each(function (i, el) {
                el = $__default(el);
                this$1.toggleNow(el.find(this$1.content), el.hasClass(this$1.clsOpen));
            });

            var active = this.active !== false && toJQuery(this.items.eq(Number(this.active))) || !this.collapsible && toJQuery(this.items.eq(0));
            if (active && !active.hasClass(this.clsOpen)) {
                this.toggle(active, false);
            }

        },

        methods: {

            toggle: function toggle(item, animate) {
                var this$1 = this;


                var index = getIndex(item, this.items),
                    active = this.items.filter(("." + (this.clsOpen)));

                item = this.items.eq(index);

                item.add(!this.multiple && active).each(function (i, el) {

                    el = $__default(el);

                    var isItem = el.is(item), state = isItem && !el.hasClass(this$1.clsOpen);

                    if (!state && isItem && !this$1.collapsible && active.length < 2) {
                        return;
                    }

                    el.toggleClass(this$1.clsOpen, state);

                    var content = el[0]._wrapper ? el[0]._wrapper.children().first() : el.find(this$1.content);

                    if (!el[0]._wrapper) {
                        el[0]._wrapper = content.wrap('<div>').parent().attr('hidden', state);
                    }

                    this$1._toggleImmediate(content, true);
                    this$1.toggleElement(el[0]._wrapper, state, animate).then(function () {
                        if (el.hasClass(this$1.clsOpen) === state) {

                            if (!state) {
                                this$1._toggleImmediate(content, false);
                            }

                            el[0]._wrapper = null;
                            content.unwrap();
                        }
                    });

                });
            }

        }

    });

};

var Alert = function (UIkit) {

    UIkit.component('alert', {

        attrs: true,

        mixins: [Class, Togglable],

        args: 'animation',

        props: {
            close: String
        },

        defaults: {
            animation: [true],
            selClose: '.uk-alert-close',
            duration: 150,
            hideProps: assign({opacity: 0}, Togglable.defaults.hideProps)
        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return this.selClose;
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.close();
                }

            }

        ],

        methods: {

            close: function close() {
                var this$1 = this;

                this.toggleElement(this.$el).then(function () { return this$1.$destroy(true); });
            }

        }

    });

};

var Cover = function (UIkit) {

    UIkit.component('cover', {

        mixins: [Class],

        props: {
            width: Number,
            height: Number
        },

        computed: {

            el: function el() {
                return this.$el[0];
            },

            parent: function parent() {
                return this.el.parentNode;
            }

        },

        ready: function ready() {

            if (this.$el.is('iframe')) {
                this.$el.css('pointerEvents', 'none');
            }

            var player = new Player(this.$el);

            if (player.isVideo()) {
                player.mute();
            }

        },

        update: {

            write: function write() {

                if (this.el.offsetHeight === 0) {
                    return;
                }

                this.$el
                    .css({width: '', height: ''})
                    .css(Dimensions.cover(
                        {width: this.width || this.el.clientWidth, height: this.height || this.el.clientHeight},
                        {width: this.parent.offsetWidth, height: this.parent.offsetHeight}
                    ));

            },

            events: ['load', 'resize']

        },

        events: {

            loadedmetadata: function loadedmetadata() {
                this.$emit();
            }

        }

    });

};

var Drop = function (UIkit) {

    var active;

    UIkit.component('drop', {

        mixins: [Position, Togglable],

        args: 'pos',

        props: {
            mode: 'list',
            toggle: Boolean,
            boundary: 'jQuery',
            boundaryAlign: Boolean,
            delayShow: Number,
            delayHide: Number,
            clsDrop: String
        },

        defaults: {
            mode: ['click', 'hover'],
            toggle: '- :first',
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: ['uk-animation-fade'],
            cls: 'uk-open'
        },

        init: function init() {
            this.tracker = new MouseTracker();
            this.clsDrop = this.clsDrop || ("uk-" + (this.$options.name));
            this.clsPos = this.clsDrop;

            this.$addClass(this.clsDrop);
        },

        ready: function ready() {

            this.updateAria(this.$el);

            if (this.toggle) {
                this.toggle = UIkit.toggle(query(this.toggle, this.$el), {target: this.$el, mode: this.mode});
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ("." + (this.clsDrop) + "-close");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide(false);
                }

            },

            {

                name: 'click',

                delegate: function delegate() {
                    return 'a[href^="#"]';
                },

                handler: function handler(e) {

                    if (e.isDefaultPrevented()) {
                        return;
                    }

                    var id = e.target.hash;

                    if (!id) {
                        e.preventDefault();
                    }

                    if (!id || !isWithin(id, this.$el)) {
                        this.hide(false);
                    }
                }

            },

            {

                name: 'beforescroll',

                handler: function handler() {
                    this.hide(false);
                }

            },

            {

                name: 'toggle',

                handler: function handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.isToggled()) {
                        this.hide(false);
                    } else {
                        this.show(toggle, false);
                    }
                }

            },

            {

                name: pointerEnter,

                filter: function filter() {
                    return ~this.mode.indexOf('hover');
                },

                handler: function handler(e) {

                    if (isTouch(e)) {
                        return;
                    }

                    if (active
                        && active !== this
                        && active.toggle
                        && ~active.toggle.mode.indexOf('hover')
                        && !isWithin(e.target, active.$el)
                        && !isWithin(e.target, active.toggle.$el)
                    ) {
                        active.hide(false);
                    }

                    e.preventDefault();
                    this.show(this.toggle);
                }

            },

            {

                name: 'toggleshow',

                handler: function handler(e, toggle) {

                    if (toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();
                    this.show(toggle || this.toggle);
                }

            },

            {

                name: ("togglehide " + pointerLeave),

                handler: function handler(e, toggle) {

                    if (isTouch(e) || toggle && !this.$el.is(toggle.target)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.toggle && ~this.toggle.mode.indexOf('hover')) {
                        this.hide();
                    }
                }

            },

            {

                name: 'beforeshow',

                self: true,

                handler: function handler() {
                    this.clearTimers();
                }

            },

            {

                name: 'show',

                self: true,

                handler: function handler() {
                    this.tracker.init();
                    this.toggle.$el.addClass(this.cls).attr('aria-expanded', 'true');
                    registerEvent();
                }

            },

            {

                name: 'beforehide',

                self: true,

                handler: function handler() {
                    this.clearTimers();
                }

            },

            {

                name: 'hide',

                handler: function handler(ref) {
                    var target = ref.target;


                    if (!this.$el.is(target)) {
                        active = active === null && isWithin(target, this.$el) && this.isToggled() ? this : active;
                        return;
                    }

                    active = this.isActive() ? null : active;
                    this.toggle.$el.removeClass(this.cls).attr('aria-expanded', 'false').blur().find('a, button').blur();
                    this.tracker.cancel();
                }

            }

        ],

        update: {

            write: function write() {

                if (this.isToggled() && !Animation.inProgress(this.$el)) {
                    this.position();
                }

            },

            events: ['resize']

        },

        methods: {

            show: function show(toggle, delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var show = function () {
                        if (!this$1.isToggled()) {
                            this$1.position();
                            this$1.toggleElement(this$1.$el, true);
                        }
                    },
                    tryShow = function () {

                        this$1.toggle = toggle || this$1.toggle;

                        this$1.clearTimers();

                        if (this$1.isActive()) {
                            return;
                        } else if (delay && active && active !== this$1 && active.isDelaying) {
                            this$1.showTimer = setTimeout(this$1.show, 10);
                            return;
                        } else if (this$1.isParentOf(active)) {

                            if (active.hideTimer) {
                                active.hide(false);
                            } else {
                                return;
                            }

                        } else if (active && !this$1.isChildOf(active) && !this$1.isParentOf(active)) {

                            var prev;
                            while (active && active !== prev && !this$1.isChildOf(active)) {
                                prev = active;
                                active.hide(false);
                            }

                        }

                        if (delay && this$1.delayShow) {
                            this$1.showTimer = setTimeout(show, this$1.delayShow);
                        } else {
                            show();
                        }

                        active = this$1;
                    };

                if (toggle && this.toggle && !this.toggle.$el.is(toggle.$el)) {

                    this.$el.one('hide', tryShow);
                    this.hide(false);

                } else {
                    tryShow();
                }
            },

            hide: function hide(delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var hide = function () { return this$1.toggleNow(this$1.$el, false); };

                this.clearTimers();

                this.isDelaying = this.tracker.movesTo(this.$el);

                if (delay && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide, this.hoverIdle);
                } else if (delay && this.delayHide) {
                    this.hideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers: function clearTimers() {
                clearTimeout(this.showTimer);
                clearTimeout(this.hideTimer);
                this.showTimer = null;
                this.hideTimer = null;
                this.isDelaying = false;
            },

            isActive: function isActive() {
                return active === this;
            },

            isChildOf: function isChildOf(drop) {
                return drop && drop !== this && isWithin(this.$el, drop.$el);
            },

            isParentOf: function isParentOf(drop) {
                return drop && drop !== this && isWithin(drop.$el, this.$el);
            },

            position: function position() {

                removeClass(this.$el, ((this.clsDrop) + "-(stack|boundary)")).css({top: '', left: ''});

                this.$el.show().toggleClass(((this.clsDrop) + "-boundary"), this.boundaryAlign);

                var boundary = getDimensions(this.boundary), alignTo = this.boundaryAlign ? boundary : getDimensions(this.toggle.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    this.$el.css(prop, alignTo[prop]);
                } else if (this.$el.outerWidth() > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    this.$addClass(((this.clsDrop) + "-stack"));
                    this.$el.trigger('stack', [this]);
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

                this.$el[0].style.display = '';

            }

        }

    });

    UIkit.drop.getActive = function () { return active; };

    var registered;
    function registerEvent() {

        if (registered) {
            return;
        }

        registered = true;
        doc.on('click', function (e) {
            var prev;

            if (e.isDefaultPrevented()) {
                return;
            }

            while (active && active !== prev && !isWithin(e.target, active.$el) && !(active.toggle && isWithin(e.target, active.toggle.$el))) {
                prev = active;
                active.hide(false);
            }
        });
    }

};

var Dropdown = function (UIkit) {

    UIkit.component('dropdown', UIkit.components.drop.extend({name: 'dropdown'}));

};

var FormCustom = function (UIkit) {

    UIkit.component('form-custom', {

        mixins: [Class],

        args: 'target',

        props: {
            target: Boolean
        },

        defaults: {
            target: false
        },

        computed: {

            input: function input() {
                return this.$el.find(':input:first');
            },

            state: function state() {
                return this.input.next();
            },

            target: function target() {
                return this.$props.target && query(this.$props.target === true ? '> :input:first + :first' : this.$props.target, this.$el)
            }

        },

        connected: function connected() {
            this.input.trigger('change');
        },

        events: [

            {

                name: 'focusin focusout mouseenter mouseleave',

                delegate: ':input:first',

                handler: function handler(ref) {
                    var type = ref.type;

                    this.state.toggleClass(("uk-" + (~type.indexOf('focus') ? 'focus' : 'hover')), ~['focusin', 'mouseenter'].indexOf(type));
                }

            },

            {

                name: 'change',

                handler: function handler() {
                    this.target && this.target[this.target.is(':input') ? 'val' : 'text'](
                        this.input[0].files && this.input[0].files[0]
                            ? this.input[0].files[0].name
                            : this.input.is('select')
                                ? this.input.find('option:selected').text()
                                : this.input.val()
                    );
                }

            }

        ]

    });

};

var Gif = function (UIkit) {

    UIkit.component('gif', {

        update: {

            read: function read() {

                var inview = isInView(this.$el);

                if (!this.isInView && inview) {
                    this.$el[0].src = this.$el[0].src;
                }

                this.isInView = inview;
            },

            events: ['scroll', 'load', 'resize']
        }

    });

};

var Grid = function (UIkit) {

    UIkit.component('grid', UIkit.components.margin.extend({

        mixins: [Class],

        name: 'grid',

        defaults: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack'
        },

        update: {

            write: function write() {

                this.$toggleClass(this.clsStack, this.stacks);

            },

            events: ['load', 'resize']

        }

    }));

};

var HeightMatch = function (UIkit) {

    UIkit.component('height-match', {

        args: 'target',

        props: {
            target: String,
            row: Boolean
        },

        defaults: {
            target: '> *',
            row: true
        },

        computed: {

            elements: function elements() {
                return $__default(this.target, this.$el);
            }

        },

        update: {

            read: function read() {
                var this$1 = this;


                var lastOffset = false;

                this.elements.css('minHeight', '');

                this.rows = !this.row
                    ? [this.match(this.elements)]
                    : this.elements.toArray().reduce(function (rows, el) {

                        if (lastOffset !== el.offsetTop) {
                            rows.push([el]);
                        } else {
                            rows[rows.length - 1].push(el);
                        }

                        lastOffset = el.offsetTop;

                        return rows;

                    }, []).map(function (elements) { return this$1.match($__default(elements)); });
            },

            write: function write() {

                this.rows.forEach(function (ref) {
                        var height = ref.height;
                        var elements = ref.elements;

                        return elements && elements.each(function (_, el) { return el.style.minHeight = height + "px"; }
                    );
                }
                );

            },

            events: ['load', 'resize']

        },

        methods: {

            match: function match(elements) {

                if (elements.length < 2) {
                    return {};
                }

                var max = 0, heights = [];

                elements = elements
                    .each(function (_, el) {

                        var $el, style, hidden;

                        if (el.offsetHeight === 0) {
                            $el = $__default(el);
                            style = $el.attr('style') || null;
                            hidden = $el.attr('hidden') || null;

                            $el.attr({
                                style: (style + ";display:block !important;"),
                                hidden: null
                            });
                        }

                        max = Math.max(max, el.offsetHeight);
                        heights.push(el.offsetHeight);

                        if ($el) {
                            $el.attr({style: style, hidden: hidden});
                        }

                    })
                    .filter(function (i) { return heights[i] < max; });

                return {height: max, elements: elements};
            }
        }

    });

};

var HeightViewport = function (UIkit) {

    UIkit.component('height-viewport', {

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean
        },

        defaults: {
            expand: false,
            offsetTop: false,
            offsetBottom: false
        },

        update: {

            write: function write() {

                this.$el.css('boxSizing', 'border-box');

                var viewport = window.innerHeight, height, offset = 0;

                if (this.expand) {

                    this.$el.css({height: '', minHeight: ''});

                    var diff = viewport - document.documentElement.offsetHeight;

                    if (diff > 0) {
                        this.$el.css('min-height', height = this.$el.outerHeight() + diff);
                    }

                } else {

                    var top = offsetTop(this.$el);

                    if (top < viewport / 2 && this.offsetTop) {
                        offset += top;
                    }

                    if (this.offsetBottom === true) {

                        offset += this.$el.next().outerHeight() || 0;

                    } else if ($.isNumeric(this.offsetBottom)) {

                        offset += (viewport / 100) * this.offsetBottom;

                    } else if (this.offsetBottom && this.offsetBottom.substr(-2) === 'px') {

                        offset += parseFloat(this.offsetBottom);

                    } else if (isString(this.offsetBottom)) {

                        var el = query(this.offsetBottom, this.$el);
                        offset += el && el.outerHeight() || 0;

                    }

                    this.$el.css('min-height', height = offset ? ("calc(100vh - " + offset + "px)") : '100vh');

                }

                // IE 10-11 fix (min-height on a flex container won't apply to its flex items)
                this.$el.height('');
                if (height && viewport - offset >= this.$el.outerHeight()) {
                    this.$el.css('height', height);
                }

            },

            events: ['load', 'resize']

        }

    });

};

var Hover = function (UIkit) {

    ready(function () {

        if (!hasTouch) {
            return;
        }

        var cls = 'uk-hover';

        docElement.on('tap', function (ref) {
            var target = ref.target;

            return $__default(("." + cls)).filter(function (_, el) { return !isWithin(target, el); }).removeClass(cls);
        });

        Object.defineProperty(UIkit, 'hoverSelector', {

            set: function set(selector) {
                docElement.on('tap', selector, function (ref) {
                    var currentTarget = ref.currentTarget;

                    return currentTarget.classList.add(cls);
                });
            }

        });

        UIkit.hoverSelector = '.uk-animation-toggle, .uk-transition-toggle, [uk-hover]';

    });

};

var closeIcon = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"1\" y1=\"1\" x2=\"13\" y2=\"13\"></line><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13\" y1=\"1\" x2=\"1\" y2=\"13\"></line></svg>";

var closeLarge = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"1\" y1=\"1\" x2=\"19\" y2=\"19\"></line><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"19\" y1=\"1\" x2=\"1\" y2=\"19\"></line></svg>";

var marker = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"4\" width=\"1\" height=\"11\"></rect><rect x=\"4\" y=\"9\" width=\"11\" height=\"1\"></rect></svg>";

var navbarToggleIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect y=\"9\" width=\"20\" height=\"2\"></rect><rect y=\"3\" width=\"20\" height=\"2\"></rect><rect y=\"15\" width=\"20\" height=\"2\"></rect></svg>";

var overlayIcon = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"19\" y=\"0\" width=\"1\" height=\"40\"></rect><rect x=\"0\" y=\"19\" width=\"40\" height=\"1\"></rect></svg>";

var paginationNext = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 6 6 1 11\"></polyline></svg>";

var paginationPrevious = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"6 1 1 6 6 11\"></polyline></svg>";

var searchIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"></circle><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"></path></svg>";

var searchLarge = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" cx=\"17.5\" cy=\"17.5\" r=\"16.5\"></circle><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" x1=\"38\" y1=\"39\" x2=\"29\" y2=\"30\"></line></svg>";

var searchNavbar = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10.5\" cy=\"10.5\" r=\"9.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"23\" y1=\"23\" x2=\"17\" y2=\"17\"/></svg>";

var slidenavNext = "<svg width=\"11\" height=\"20\" viewBox=\"0 0 11 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 10 10 1 19\"></polyline></svg>";

var slidenavNextLarge = "<svg width=\"18\" height=\"34\" viewBox=\"0 0 18 34\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"1 1 17 17 1 33\"></polyline></svg>";

var slidenavPrevious = "<svg width=\"11\" height=\"20\" viewBox=\"0 0 11 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"10 1 1 10 10 19\"></polyline></svg>";

var slidenavPreviousLarge = "<svg width=\"18\" height=\"34\" viewBox=\"0 0 18 34\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"17 1 1 17 17 33\"></polyline></svg>";

var spinner = "<svg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"15\" cy=\"15\" r=\"14\"></circle></svg>";

var totop = "<svg width=\"18\" height=\"10\" viewBox=\"0 0 18 10\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 9 9 1 17 9 \"></polyline></svg>";

var Icon = function (UIkit) {

    var parsed = {},
        icons = {
            spinner: spinner,
            totop: totop,
            marker: marker,
            'close-icon': closeIcon,
            'close-large': closeLarge,
            'navbar-toggle-icon': navbarToggleIcon,
            'overlay-icon': overlayIcon,
            'pagination-next': paginationNext,
            'pagination-previous': paginationPrevious,
            'search-icon': searchIcon,
            'search-large': searchLarge,
            'search-navbar': searchNavbar,
            'slidenav-next': slidenavNext,
            'slidenav-next-large': slidenavNextLarge,
            'slidenav-previous': slidenavPrevious,
            'slidenav-previous-large': slidenavPreviousLarge
        };

    UIkit.component('icon', UIkit.components.svg.extend({

        attrs: ['icon', 'ratio'],

        mixins: [Class],

        name: 'icon',

        args: 'icon',

        props: ['icon'],

        defaults: {exclude: ['id', 'style', 'class', 'src', 'icon']},

        init: function init() {
            this.$addClass('uk-icon');

            if (isRtl) {
                this.icon = swap(swap(this.icon, 'left', 'right'), 'previous', 'next');
            }
        },

        disconnected: function disconnected() {
            delete this.delay;
        },

        update: {

            read: function read() {

                if (this.delay) {
                    var icon = this.getIcon();

                    if (icon) {
                        this.delay(icon);
                        delete this.delay;
                    }
                }
            },

            events: ['load']

        },

        methods: {

            getSvg: function getSvg() {
                var this$1 = this;


                var icon = this.getIcon();

                if (!icon) {

                    if (document.readyState !== 'complete') {
                        return promise(function (resolve) {
                            this$1.delay = resolve;
                        });
                    }

                    return promise.reject('Icon not found.');

                }

                return promise.resolve(icon);
            },

            getIcon: function getIcon() {

                if (!icons[this.icon]) {
                    return null;
                }

                if (!parsed[this.icon]) {
                    parsed[this.icon] = this.parse(icons[this.icon]);
                }

                return parsed[this.icon];
            }

        }

    }));

    [
        'marker',
        'navbar-toggle-icon',
        'overlay-icon',
        'pagination-previous',
        'pagination-next',
        'totop'
    ].forEach(function (name) { return registerComponent(name); });

    [
        'slidenav-previous',
        'slidenav-next'
    ].forEach(function (name) { return registerComponent(name, {

        init: function init() {
            this.$addClass('uk-slidenav');

            if (this.$hasClass('uk-slidenav-large')) {
                this.icon += '-large';
            }
        }

    }); });

    registerComponent('search-icon', {

        init: function init() {
            if (this.$hasClass('uk-search-icon') && this.$el.parents('.uk-search-large').length) {
                this.icon = 'search-large';
            } else if (this.$el.parents('.uk-search-navbar').length) {
                this.icon = 'search-navbar';
            }
        }

    });

    registerComponent('close', {

        init: function init() {
            this.icon = "close-" + (this.$hasClass('uk-close-large') ? 'large' : 'icon');
        }

    });

    registerComponent('spinner', {

        connected: function connected() {
            var this$1 = this;

            this.svg.then(function (svg) { return this$1.ratio !== 1 && $__default(svg).find('circle').css('stroke-width', 1 / this$1.ratio); }, noop);
        }

    });

    UIkit.icon.add = function (added) {
        assign(icons, added);
        Object.keys(added).forEach(function (name) { return delete parsed[name]; });

        if (UIkit._initialized) {
            $.each(UIkit.instances, function (_, component) {
                if (component.$options.name === 'icon') {
                    component.$reset();
                }
            });
        }
    };

    function registerComponent(name, mixin$$1) {

        UIkit.component(name, UIkit.components.icon.extend({

            name: name,

            mixins: mixin$$1 ? [mixin$$1] : [],

            defaults: {
                icon: name
            }

        }));
    }

};

var Margin = function (UIkit) {

    UIkit.component('margin', {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        defaults: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        computed: {

            items: function items() {
                return this.$el[0].children;
            }

        },

        update: {

            read: function read() {
                var this$1 = this;


                if (!this.items.length || this.$el[0].offsetHeight === 0) {
                    this.rows = false;
                    return;
                }

                this.stacks = true;

                var rows = [[]];

                for (var i = 0; i < this.items.length; i++) {

                    var el = this$1.items[i],
                        dim = el.getBoundingClientRect();

                    if (!dim.height) {
                        continue;
                    }

                    for (var j = rows.length - 1; j >= 0; j--) {

                        var row = rows[j];

                        if (!row[0]) {
                            row.push(el);
                            break;
                        }

                        var leftDim = row[0].getBoundingClientRect();

                        if (dim.top >= Math.floor(leftDim.bottom)) {
                            rows.push([el]);
                            break;
                        }

                        if (Math.floor(dim.bottom) > leftDim.top) {

                            this$1.stacks = false;

                            if (dim.left < leftDim.left && !isRtl) {
                                row.unshift(el);
                                break;
                            }

                            row.push(el);
                            break;
                        }

                        if (j === 0) {
                            rows.unshift([el]);
                            break;
                        }

                    }

                }

                this.rows = rows;

            },

            write: function write() {
                var this$1 = this;


                this.rows && this.rows.forEach(function (row, i) { return row.forEach(function (el, j) {
                        this$1.$toggleClass(el, this$1.margin, i !== 0);
                        this$1.$toggleClass(el, this$1.firstColumn, j === 0);
                    }); }
                );

            },

            events: ['load', 'resize']

        }

    });

};

var Modal$1 = function (UIkit) {

    UIkit.component('modal', {

        mixins: [Modal],

        defaults: {
            clsPage: 'uk-modal-page',
            clsPanel: 'uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'
        },

        events: [

            {
                name: 'show',

                self: true,

                handler: function handler() {

                    if (this.panel.hasClass('uk-margin-auto-vertical')) {
                        this.$el.addClass('uk-flex');
                    } else {
                        this.$el.css('display', 'block');
                    }

                    this.$el.height(); // force reflow
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function handler() {

                    this.$el.css('display', '').removeClass('uk-flex');

                }
            }

        ]

    });

    UIkit.component('overflow-auto', {

        mixins: [Class],

        computed: {

            modal: function modal() {
                return this.$el.closest('.uk-modal');
            },

            panel: function panel() {
                return this.$el.closest('.uk-modal-dialog');
            }

        },

        connected: function connected() {
            this.$el.css('min-height', 150);
        },

        update: {

            write: function write() {
                var current = this.$el.css('max-height');

                this.$el.css('max-height', 150).css('max-height', Math.max(150, 150 + this.modal.height() - this.panel.outerHeight(true)));
                if (current !== this.$el.css('max-height')) {
                    this.$el.trigger('resize');
                }
            },

            events: ['load', 'resize']

        }

    });

    UIkit.modal.dialog = function (content, options) {

        var dialog = UIkit.modal((" <div class=\"uk-modal\"> <div class=\"uk-modal-dialog\">" + content + "</div> </div> "), options);

        dialog.$el.on('hidden', function (e) {
            if (e.target === e.currentTarget) {
                dialog.$destroy(true);
            }
        });
        dialog.show();

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            function (resolve) { return UIkit.modal.dialog((" <div class=\"uk-modal-body\">" + (isString(message) ? message : $__default(message).html()) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button> </div> "), options).$el.on('hide', resolve); }
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(
            function (resolve, reject) { return UIkit.modal.dialog((" <div class=\"uk-modal-body\">" + (isString(message) ? message : $__default(message).html()) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button> </div> "), options).$el.on('click', '.uk-modal-footer button', function (e) { return $__default(e.target).index() === 0 ? reject() : resolve(); }); }
        );
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return promise(function (resolve) {

            var resolved = false,
                prompt = UIkit.modal.dialog((" <form class=\"uk-form-stacked\"> <div class=\"uk-modal-body\"> <label>" + (isString(message) ? message : $__default(message).html()) + "</label> <input class=\"uk-input\" type=\"text\" autofocus> </div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary\" type=\"submit\">" + (options.labels.ok) + "</button> </div> </form> "), options),
                input = prompt.$el.find('input').val(value);

            prompt.$el
                .on('submit', 'form', function (e) {
                    e.preventDefault();
                    resolve(input.val());
                    resolved = true;
                    prompt.hide();
                })
                .on('hide', function () {
                    if (!resolved) {
                        resolve(null);
                    }
                });

        });
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    };

};

var Nav = function (UIkit) {

    UIkit.component('nav', UIkit.components.accordion.extend({

        name: 'nav',

        defaults: {
            targets: '> .uk-parent',
            toggle: '> a',
            content: 'ul:first'
        }

    }));

};

var Navbar = function (UIkit) {

    UIkit.component('navbar', {

        mixins: [Class],

        props: {
            dropdown: String,
            mode: 'list',
            align: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            clsDrop: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            dropbarMode: String,
            dropbarAnchor: 'jQuery',
            duration: Number
        },

        defaults: {
            dropdown: '.uk-navbar-nav > li',
            align: !isRtl ? 'left' : 'right',
            clsDrop: 'uk-navbar-dropdown',
            mode: undefined,
            offset: undefined,
            delayShow: undefined,
            delayHide: undefined,
            boundaryAlign: undefined,
            flip: 'x',
            boundary: true,
            dropbar: false,
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
        },

        computed: {

            boundary: function boundary() {
                return (this.$props.boundary === true || this.boundaryAlign) ? this.$el : this.$props.boundary
            },

            pos: function pos() {
                return ("bottom-" + (this.align));
            }

        },

        ready: function ready() {

            if (this.dropbar) {
                UIkit.navbarDropbar(
                    query(this.dropbar, this.$el) || $__default('<div></div>').insertAfter(this.dropbarAnchor || this.$el),
                    {clsDrop: this.clsDrop, mode: this.dropbarMode, duration: this.duration, navbar: this}
                );
            }

        },

        update: function update() {

            UIkit.drop(
                $__default(((this.dropdown) + " ." + (this.clsDrop)), this.$el).filter(function (_, el) { return !UIkit.getComponent(el, 'dropdown'); }),
                assign({}, this.$props, {boundary: this.boundary, pos: this.pos})
            );

        },

        events: [

            {
                name: pointerEnter,

                delegate: function delegate() {
                    return this.dropdown;
                },

                handler: function handler(ref) {
                    var currentTarget = ref.currentTarget;

                    var active = this.getActive();
                    if (active && active.toggle && !isWithin(active.toggle.$el, currentTarget) && !active.tracker.movesTo(active.$el)) {
                        active.hide(false);
                    }
                }

            }

        ],

        methods: {

            getActive: function getActive() {
                var active = UIkit.drop.getActive();
                return active && !~active.mode.indexOf('click') && isWithin(active.toggle.$el, this.$el) && active;
            }

        }

    });

    UIkit.component('navbar-dropbar', {

        mixins: [Class],

        defaults: {
            clsDrop: '',
            mode: 'slide',
            navbar: null,
            duration: 200
        },

        init: function init() {

            if (this.mode === 'slide') {
                this.$addClass('uk-navbar-dropbar-slide');
            }

        },

        events: [

            {
                name: 'beforeshow',

                el: function el() {
                    return this.navbar.$el;
                },

                handler: function handler(_, drop) {
                    var $el = drop.$el;
                    var dir = drop.dir;
                    if (dir === 'bottom' && !isWithin($el, this.$el)) {
                        $el.appendTo(this.$el);
                        drop.show();
                        return false;
                    }
                }
            },

            {
                name: 'mouseleave',

                handler: function handler() {
                    var active = this.navbar.getActive();

                    if (active && !this.$el.is(':hover')) {
                        active.hide();
                    }
                }
            },

            {
                name: 'beforeshow',

                handler: function handler(e, ref) {
                    var $el = ref.$el;

                    this.clsDrop && $el.addClass(((this.clsDrop) + "-dropbar"));
                    this.transitionTo($el.outerHeight(true));
                }
            },

            {
                name: 'beforehide',

                handler: function handler(e, ref) {
                    var $el = ref.$el;


                    var active = this.navbar.getActive();

                    if (this.$el.is(':hover') && active && active.$el.is($el)) {
                        return false;
                    }
                }
            },

            {
                name: 'hide',

                handler: function handler(e, ref) {
                    var $el = ref.$el;


                    var active = this.navbar.getActive();

                    if (!active || active && active.$el.is($el)) {
                        this.transitionTo(0);
                    }
                }
            }

        ],

        methods: {

            transitionTo: function transitionTo(height) {
                this.$el.height(this.$el[0].offsetHeight ? this.$el.height() : 0);
                Transition.cancel(this.$el);
                return Transition.start(this.$el, {height: height}, this.duration).then(null, noop);
            }

        }

    });

};

var scroll;

var Offcanvas = function (UIkit) {

    UIkit.component('offcanvas', {

        mixins: [Modal],

        args: 'mode',

        props: {
            content: String,
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        defaults: {
            content: '.uk-offcanvas-content:first',
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsContainer: 'uk-offcanvas-container',
            clsPanel: 'uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsContent: 'uk-offcanvas-content',
            clsContentAnimation: 'uk-offcanvas-content-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            selClose: '.uk-offcanvas-close'
        },

        computed: {

            content: function content() {
                return $__default(query(this.$props.content, this.$el));
            },

            clsFlip: function clsFlip() {
                return this.flip ? this.$props.clsFlip : '';
            },

            clsOverlay: function clsOverlay() {
                return this.overlay ? this.$props.clsOverlay : '';
            },

            clsMode: function clsMode() {
                return ((this.$props.clsMode) + "-" + (this.mode));
            },

            clsSidebarAnimation: function clsSidebarAnimation() {
                return this.mode === 'none' || this.mode === 'reveal' ? '' : this.$props.clsSidebarAnimation;
            },

            clsContentAnimation: function clsContentAnimation() {
                return this.mode !== 'push' && this.mode !== 'reveal' ? '' : this.$props.clsContentAnimation
            },

            transitionElement: function transitionElement() {
                return this.mode === 'reveal' ? this.panel.parent() : this.panel;
            }

        },

        update: {

            write: function write() {

                if (this.isToggled()) {

                    if (this.overlay || this.clsContentAnimation) {
                        this.content.width(window.innerWidth - this.scrollbarWidth);
                    }

                    if (this.overlay) {
                        this.content.height(window.innerHeight);
                        scroll && this.content.scrollTop(scroll.y);
                    }

                }

            },

            events: ['resize']

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return 'a[href^="#"]';
                },

                handler: function handler(ref) {
                    var currentTarget = ref.currentTarget;

                    if (currentTarget.hash && this.content.find(currentTarget.hash).length) {
                        scroll = null;
                        this.hide();
                    }
                }

            },

            {

                name: 'beforescroll',

                filter: function filter() {
                    return this.overlay;
                },

                handler: function handler(_, scroll, target) {
                    if (scroll && target && this.isToggled() && this.content.find(target).length) {
                        this.$el.one('hidden', function () { return scroll.scrollTo(target); });
                        return false;
                    }
                }

            },

            {
                name: 'show',

                self: true,

                handler: function handler() {

                    scroll = scroll || {x: window.pageXOffset, y: window.pageYOffset};

                    if (this.mode === 'reveal' && !this.panel.parent().hasClass(this.clsMode)) {
                        this.panel.wrap('<div>').parent().addClass(this.clsMode);
                    }

                    docElement.css('overflow-y', (!this.clsContentAnimation || this.flip) && this.scrollbarWidth && this.overlay ? 'scroll' : '');

                    this.body.addClass(((this.clsContainer) + " " + (this.clsFlip) + " " + (this.clsOverlay))).height();
                    this.content.addClass(this.clsContentAnimation);
                    this.panel.addClass(((this.clsSidebarAnimation) + " " + (this.mode !== 'reveal' ? this.clsMode : '')));
                    this.$el.addClass(this.clsOverlay).css('display', 'block').height();

                }
            },

            {
                name: 'hide',

                self: true,

                handler: function handler() {
                    this.content.removeClass(this.clsContentAnimation);

                    if (this.mode === 'none' || this.getActive() && this.getActive() !== this) {
                        this.panel.trigger(transitionend);
                    }
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function handler() {

                    if (this.mode === 'reveal') {
                        this.panel.unwrap();
                    }

                    if (!this.overlay) {
                        scroll = {x: window.pageXOffset, y: window.pageYOffset};
                    } else if (!scroll) {
                        var ref = this.content[0];
                        var x = ref.scrollLeft;
                        var y = ref.scrollTop;
                        scroll = {x: x, y: y};
                    }

                    this.panel.removeClass(((this.clsSidebarAnimation) + " " + (this.clsMode)));
                    this.$el.removeClass(this.clsOverlay).css('display', '');
                    this.body.removeClass(((this.clsContainer) + " " + (this.clsFlip) + " " + (this.clsOverlay))).scrollTop(scroll.y);

                    docElement.css('overflow-y', '');
                    this.content.width('').height('');

                    window.scrollTo(scroll.x, scroll.y);

                    scroll = null;

                }
            },

            {
                name: 'swipeLeft swipeRight',

                handler: function handler(e) {

                    if (this.isToggled() && isTouch(e) && (e.type === 'swipeLeft' && !this.flip || e.type === 'swipeRight' && this.flip)) {
                        this.hide();
                    }

                }
            }

        ]

    });

};

var Responsive = function (UIkit) {

    UIkit.component('responsive', {

        props: ['width', 'height'],

        init: function init() {
            this.$addClass('uk-responsive-width');
        },

        update: {

            read: function read() {

                this.dim = this.$el.is(':visible') && this.width && this.height
                    ? {width: this.$el.parent().width(), height: this.height}
                    : false;

            },

            write: function write() {

                if (this.dim) {
                    this.$el.height(Dimensions.contain({height: this.height, width: this.width}, this.dim).height);
                }

            },

            events: ['load', 'resize']

        }

    });

};

var Scroll = function (UIkit) {

    UIkit.component('scroll', {

        props: {
            duration: Number,
            easing: String,
            offset: Number
        },

        defaults: {
            duration: 1000,
            easing: 'easeOutExpo',
            offset: 0
        },

        methods: {

            scrollTo: function scrollTo(el) {
                var this$1 = this;


                var target = offsetTop($__default(el)) - this.offset,
                    document = docHeight(),
                    viewport = window.innerHeight;

                if (target + viewport > document) {
                    target = document - viewport;
                }

                if ($trigger(this.$el, 'beforescroll', [this, el]).result === false) {
                    return;
                }

                $__default('html,body')
                    .stop()
                    .animate({scrollTop: Math.round(target)}, this.duration, this.easing)
                    .promise()
                    .then(function () { return this$1.$el.trigger('scrolled', [this$1, el]); });

            }

        },

        events: {

            click: function click(e) {

                if (e.isDefaultPrevented()) {
                    return;
                }

                e.preventDefault();
                this.scrollTo($__default(this.$el[0].hash).length ? this.$el[0].hash : 'body');
            }

        }

    });

    $__default.easing.easeOutExpo = $__default.easing.easeOutExpo || function (x, t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

};

var Scrollspy = function (UIkit) {

    UIkit.component('scrollspy', {

        args: 'cls',

        props: {
            cls: 'list',
            target: String,
            hidden: Boolean,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        defaults: {
            cls: ['uk-scrollspy-inview'],
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

        computed: {

            elements: function elements() {
                return this.target && $__default(this.target, this.$el) || this.$el;
            }

        },

        update: [

            {

                write: function write() {
                    if (this.hidden) {
                        this.elements.filter((":not(." + (this.inViewClass) + ")")).css('visibility', 'hidden');
                    }
                }

            },

            {

                read: function read() {
                    var this$1 = this;

                    this.elements.each(function (_, el) {

                        if (!el._scrollspy) {
                            var cls = $__default(el).attr('uk-scrollspy-class');
                            el._scrollspy = {toggles: cls && cls.split(',') || this$1.cls};
                        }

                        el._scrollspy.show = isInView(el, this$1.offsetTop, this$1.offsetLeft);

                    });
                },

                write: function write() {
                    var this$1 = this;


                    var index = this.elements.length === 1 ? 1 : 0;

                    this.elements.each(function (i, el) {

                        var $el = $__default(el), data = el._scrollspy, cls = data.toggles[i] || data.toggles[0];

                        if (data.show) {

                            if (!data.inview && !data.timer) {

                                var show = function () {
                                    $el.css('visibility', '')
                                        .addClass(this$1.inViewClass)
                                        .toggleClass(cls)
                                        .trigger('inview');

                                    this$1.$update();

                                    data.inview = true;
                                    delete data.timer;
                                };

                                if (this$1.delay && index) {
                                    data.timer = setTimeout(show, this$1.delay * index);
                                } else {
                                    show();
                                }

                                index++;

                            }

                        } else {

                            if (data.inview && this$1.repeat) {

                                if (data.timer) {
                                    clearTimeout(data.timer);
                                    delete data.timer;
                                }

                                $el.removeClass(this$1.inViewClass)
                                    .toggleClass(cls)
                                    .css('visibility', this$1.hidden ? 'hidden' : '')
                                    .trigger('outview');

                                this$1.$update();

                                data.inview = false;

                            }

                        }

                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

};

var ScrollspyNav = function (UIkit) {

    UIkit.component('scrollspy-nav', {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean,
            offset: Number
        },

        defaults: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true,
            offset: 0
        },

        computed: {

            links: function links() {
                return this.$el.find('a[href^="#"]').filter(function (i, el) { return el.hash; });
            },

            elements: function elements() {
                return this.closest ? this.links.closest(this.closest) : this.links;
            },

            targets: function targets() {
                return $__default(this.links.toArray().map(function (el) { return el.hash; }).join(','));
            }

        },

        update: [

            {

                read: function read() {
                    if (this.scroll) {
                        UIkit.scroll(this.links, {offset: this.offset || 0});
                    }
                }

            },

            {

                read: function read() {
                    var this$1 = this;


                    var scroll = window.pageYOffset + this.offset + 1, max = docHeight() - window.innerHeight + this.offset;

                    this.active = false;

                    this.targets.each(function (i, el) {

                        var top = offsetTop(el), last = i + 1 === this$1.targets.length;
                        if (!this$1.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                            return false;
                        }

                        if (!last && offsetTop(this$1.targets.eq(i + 1)) <= scroll) {
                            return;
                        }

                        if (scroll >= max) {
                            for (var j = this$1.targets.length - 1; j > i; j--) {
                                if (isInView(this$1.targets[j])) {
                                    el = this$1.targets[j];
                                    break;
                                }
                            }
                        }

                        return !(this$1.active = toJQuery(this$1.links.filter(("[href=\"#" + (el.id) + "\"]"))));

                    });

                },

                write: function write() {

                    this.links.blur();
                    this.elements.removeClass(this.cls);

                    if (this.active) {
                        this.$el.trigger('active', [
                            this.active,
                            (this.closest ? this.active.closest(this.closest) : this.active).addClass(this.cls)
                        ]);
                    }

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

};

var Sticky = function (UIkit) {

    UIkit.component('sticky', {

        mixins: [Class],

        attrs: true,

        props: {
            top: null,
            bottom: Boolean,
            offset: Number,
            animation: String,
            clsActive: String,
            clsInactive: String,
            clsFixed: String,
            clsBelow: String,
            selTarget: String,
            widthElement: 'jQuery',
            showOnUp: Boolean,
            media: 'media',
            target: Number
        },

        defaults: {
            top: 0,
            bottom: false,
            offset: 0,
            animation: '',
            clsActive: 'uk-active',
            clsInactive: '',
            clsFixed: 'uk-sticky-fixed',
            clsBelow: 'uk-sticky-below',
            selTarget: '',
            widthElement: false,
            showOnUp: false,
            media: false,
            target: false
        },

        computed: {

            selTarget: function selTarget() {
                return this.$props.selTarget && toJQuery(this.$props.selTarget, this.$el) || this.$el;
            }

        },

        connected: function connected() {

            this.placeholder = $__default('<div class="uk-sticky-placeholder"></div>');
            this.widthElement = this.$props.widthElement || this.placeholder;

            if (!this.isActive) {
                this.hide();
            }
        },

        disconnected: function disconnected() {

            if (this.isActive) {
                this.isActive = false;
                this.hide();
                this.$removeClass(this.clsInactive);
            }

            this.placeholder.remove();
            this.placeholder = null;
            this.widthElement = null;
        },

        ready: function ready() {
            var this$1 = this;


            if (!(this.target && location.hash && window.pageYOffset > 0)) {
                return;
            }

            var target = query(location.hash);

            if (target) {
                requestAnimationFrame(function () {

                    var top = offsetTop(target),
                        elTop = offsetTop(this$1.$el),
                        elHeight = this$1.$el[0].offsetHeight;

                    if (elTop + elHeight >= top && elTop <= top + target[0].offsetHeight) {
                        window.scrollTo(0, top - elHeight - this$1.target - this$1.offset);
                    }

                });
            }

        },

        events: [

            {
                name: 'active',

                handler: function handler() {
                    this.$addClass(this.selTarget, this.clsActive);
                    this.$removeClass(this.selTarget, this.clsInactive);
                }

            },

            {
                name: 'inactive',

                handler: function handler() {
                    this.$addClass(this.selTarget, this.clsInactive);
                    this.$removeClass(this.selTarget, this.clsActive);
                }

            }

        ],

        update: [

            {

                write: function write() {
                    var this$1 = this;


                    var outerHeight = (this.isActive ? this.placeholder : this.$el)[0].offsetHeight, el;

                    this.placeholder
                        .css('height', this.$el.css('position') !== 'absolute' ? outerHeight : '')
                        .css(this.$el.css(['marginTop', 'marginBottom', 'marginLeft', 'marginRight']));

                    if (!document.documentElement.contains(this.placeholder[0])) {
                        this.placeholder.insertAfter(this.$el).attr('hidden', true);
                    }

                    this.width = this.widthElement.attr('hidden', null)[0].offsetWidth;
                    this.widthElement.attr('hidden', !this.isActive);

                    this.topOffset = offsetTop(this.isActive ? this.placeholder : this.$el);
                    this.bottomOffset = this.topOffset + outerHeight;

                    ['top', 'bottom'].forEach(function (prop) {

                        this$1[prop] = this$1.$props[prop];

                        if (!this$1[prop]) {
                            return;
                        }

                        if ($.isNumeric(this$1[prop])) {

                            this$1[prop] = this$1[(prop + "Offset")] + parseFloat(this$1[prop]);

                        } else {

                            if (isString(this$1[prop]) && this$1[prop].match(/^-?\d+vh$/)) {
                                this$1[prop] = window.innerHeight * parseFloat(this$1[prop]) / 100;
                            } else {

                                el = this$1[prop] === true ? this$1.$el.parent() : query(this$1[prop], this$1.$el);

                                if (el) {
                                    this$1[prop] = offsetTop(el) + el[0].offsetHeight;
                                }

                            }

                        }

                    });

                    this.top = Math.max(parseFloat(this.top), this.topOffset) - this.offset;
                    this.bottom = this.bottom && this.bottom - outerHeight;
                    this.inactive = this.media && !window.matchMedia(this.media).matches;

                    if (this.isActive) {
                        this.update();
                    }
                },

                events: ['load', 'resize']

            },

            {

                read: function read() {
                    this.offsetTop = offsetTop(this.$el);
                    this.scroll = window.pageYOffset;
                    this.visible = this.$el.is(':visible');
                },

                write: function write(ref) {
                    var this$1 = this;
                    if ( ref === void 0 ) ref = {};
                    var dir = ref.dir;


                    var scroll = this.scroll;

                    if (scroll < 0 || !this.visible || this.disabled || this.showOnUp && !dir) {
                        return;
                    }

                    if (this.inactive
                        || scroll < this.top
                        || this.showOnUp && (scroll <= this.top || dir ==='down' || dir === 'up' && !this.isActive && scroll <= this.bottomOffset)
                    ) {

                        if (!this.isActive) {
                            return;
                        }

                        this.isActive = false;

                        if (this.animation && scroll > this.topOffset) {
                            Animation.cancel(this.$el).then(function () { return Animation.out(this$1.$el, this$1.animation).then(function () { return this$1.hide(); }, noop); });
                        } else {
                            this.hide();
                        }

                    } else if (this.isActive) {

                        this.update();

                    } else if (this.animation) {

                        Animation.cancel(this.$el).then(function () {
                            this$1.show();
                            Animation.in(this$1.$el, this$1.animation).then(null, noop);
                        });

                    } else {
                        this.show();
                    }

                },

                events: ['scroll']

            } ],

        methods: {

            show: function show() {

                this.isActive = true;
                this.update();
                this.placeholder.attr('hidden', null);

            },

            hide: function hide() {

                if (!this.isActive || this.$hasClass(this.selTarget, this.clsActive)) {
                    this.$el.trigger('inactive');
                }

                this.$removeClass(this.clsFixed, this.clsBelow);
                this.$el.css({position: '', top: '', width: ''});
                this.placeholder.attr('hidden', true);

            },

            update: function update() {
                var this$1 = this;


                var top = Math.max(0, this.offset), active = this.scroll > this.top;

                if (this.bottom && this.scroll > this.bottom - this.offset) {
                    top = this.bottom - this.scroll;
                }

                this.$el.css({
                    position: 'fixed',
                    top: (top + "px"),
                    width: this.width
                });

                if (this.$hasClass(this.selTarget, this.clsActive)) {

                    if (!active) {
                        this.$el.trigger('inactive');
                    }

                } else {

                    if (active) {
                        this.$el.trigger('active');
                    }
                }

                this.$toggleClass(this.clsBelow, this.scroll > this.bottomOffset);

                if (this.showOnUp) {
                    requestAnimationFrame(function () { return this$1.$addClass(this$1.clsFixed); });
                } else {
                    this.$addClass(this.clsFixed);
                }
            }

        }

    });

};

var svgs = {};
var parser = new DOMParser();

var Svg = function (UIkit) {

    UIkit.component('svg', {

        attrs: true,

        props: {
            id: String,
            icon: String,
            src: String,
            style: String,
            width: Number,
            height: Number,
            ratio: Number,
            'class': String
        },

        defaults: {
            ratio: 1,
            id: false,
            exclude: ['src'],
            'class': ''
        },

        init: function init() {
            this.class += ' uk-svg';
        },

        connected: function connected() {
            var this$1 = this;


            if (!this.icon && this.src && ~this.src.indexOf('#')) {

                var parts = this.src.split('#');

                if (parts.length > 1) {
                    this.src = parts[0];
                    this.icon = parts[1];
                }
            }

            this.width = this.$props.width;
            this.height = this.$props.height;

            this.svg = this.getSvg().then(function (doc) { return promise(function (resolve, reject) {

                var svg, el;

                if (!doc) {
                    reject('SVG not found.');
                    return;
                }

                if (!this$1.icon) {
                    el = doc.documentElement.cloneNode(true);
                } else {
                    svg = doc.getElementById(this$1.icon);

                    if (!svg) {

                        // fallback if SVG has no symbols
                        if (!doc.querySelector('symbol')) {
                            el = doc.documentElement.cloneNode(true);
                        }

                    } else {

                        var html = svg.outerHTML;

                        // IE workaround
                        if (!html) {
                            var div = document.createElement('div');
                            div.appendChild(svg.cloneNode(true));
                            html = div.innerHTML;
                        }

                        html = html
                            .replace(/<symbol/g, ("<svg" + (!~html.indexOf('xmlns') ? ' xmlns="http://www.w3.org/2000/svg"' : '')))
                            .replace(/symbol>/g, 'svg>');

                        el = parser.parseFromString(html, 'image/svg+xml').documentElement;
                    }

                }

                if (!el) {
                    reject('SVG not found.');
                    return;
                }

                var dimensions = el.getAttribute('viewBox'); // jQuery workaround, el.attr('viewBox')

                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this$1.width = this$1.width || dimensions[2];
                    this$1.height = this$1.height || dimensions[3];
                }

                this$1.width *= this$1.ratio;
                this$1.height *= this$1.ratio;

                for (var prop in this$1.$options.props) {
                    if (this$1[prop] && !~this$1.exclude.indexOf(prop)) {
                        el.setAttribute(prop, this$1[prop]);
                    }
                }

                if (!this$1.id) {
                    el.removeAttribute('id');
                }

                if (this$1.width && !this$1.height) {
                    el.removeAttribute('height');
                }

                if (this$1.height && !this$1.width) {
                    el.removeAttribute('width');
                }

                var root = this$1.$el[0];
                if (isVoidElement(root) || root.tagName === 'CANVAS') {

                    this$1.$el.attr({hidden: true, id: null});

                    if (root.nextSibling) {

                        if (el.isEqualNode(root.nextSibling)) {
                            el = root.nextSibling;
                        } else {
                            root.parentNode.insertBefore(el, root.nextSibling);
                        }

                    } else {
                        root.parentNode.appendChild(el);
                    }
                } else {

                    if (root.lastChild && el.isEqualNode(root.lastChild)) {
                        el = root.lastChild;
                    } else {
                        root.appendChild(el);
                    }

                }

                resolve(el);

            }); });

        },

        disconnected: function disconnected() {

            if (isVoidElement(this.$el)) {
                this.$el.attr({hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(function (svg) { return svg.parentNode && svg.parentNode.removeChild(svg); }, noop);
                this.svg = null;
            }
        },

        methods: {

            getSvg: function getSvg() {
                var this$1 = this;


                if (!this.src) {
                    return promise.reject();
                }

                if (svgs[this.src]) {
                    return svgs[this.src];
                }

                svgs[this.src] = promise(function (resolve, reject) {

                    if (this$1.src.lastIndexOf('data:', 0) === 0) {
                        resolve(this$1.parse(decodeURIComponent(this$1.src.split(',')[1])));
                    } else {

                        $.ajax(this$1.src, {dataType: 'html'}).then(function (doc) {
                            resolve(this$1.parse(doc));
                        }, function () {
                            reject('SVG not found.');
                        });

                    }

                });

                return svgs[this.src];

            },

            parse: function parse(doc) {
                var parsed = parser.parseFromString(doc, 'image/svg+xml');
                return parsed.documentElement && parsed.documentElement.nodeName === 'svg' ? parsed : null;
            }

        }

    });

};

var Switcher = function (UIkit) {

    UIkit.component('switcher', {

        mixins: [Togglable],

        args: 'connect',

        props: {
            connect: String,
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        defaults: {
            connect: false,
            toggle: ' > *',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        computed: {

            connects: function connects() {
                return query(this.connect, this.$el) || $__default(this.$el.next(("." + (this.clsContainer))));
            },

            toggles: function toggles() {
                return $__default(this.toggle, this.$el);
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.toggle) + ":not(.uk-disabled)");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show(e.currentTarget);
                }

            },

            {
                name: 'click',

                el: function el() {
                    return this.connects;
                },

                delegate: function delegate() {
                    return ("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show($__default(e.currentTarget)[e.currentTarget.hasAttribute(this.attrItem) ? 'attr' : 'data'](this.attrItem));
                }
            },

            {
                name: 'swipeRight swipeLeft',

                filter: function filter() {
                    return this.swiping;
                },

                el: function el() {
                    return this.connects;
                },

                handler: function handler(e) {
                    if (!isTouch(e)) {
                        return;
                    }

                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                    }
                }
            }

        ],

        update: function update() {

            this.updateAria(this.connects.children());
            this.show(toJQuery(this.toggles.filter(("." + (this.cls) + ":first"))) || toJQuery(this.toggles.eq(this.active)) || this.toggles.first());

        },

        methods: {

            show: function show(item) {
                var this$1 = this;


                var length = this.toggles.length,
                    prev = this.connects.children(("." + (this.cls))).index(),
                    hasPrev = prev >= 0,
                    index = getIndex(item, this.toggles, prev),
                    dir = item === 'previous' ? -1 : 1,
                    toggle;

                for (var i = 0; i < length; i++, index = (index + dir + length) % length) {
                    if (!this$1.toggles.eq(index).is('.uk-disabled, [disabled]')) {
                        toggle = this$1.toggles.eq(index);
                        break;
                    }
                }

                if (!toggle || prev >= 0 && toggle.hasClass(this.cls) || prev === index) {
                    return;
                }

                this.toggles.removeClass(this.cls).attr('aria-expanded', false);
                toggle.addClass(this.cls).attr('aria-expanded', true);

                if (!hasPrev) {
                    this.toggleNow(this.connects.children((":nth-child(" + (index + 1) + ")")));
                } else {
                    this.toggleElement(this.connects.children((":nth-child(" + (prev + 1) + "),:nth-child(" + (index + 1) + ")")));
                }
            }

        }

    });

};

var Tab = function (UIkit) {

    UIkit.component('tab', UIkit.components.switcher.extend({

        mixins: [Class],

        name: 'tab',

        props: {
            media: 'media'
        },

        defaults: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        init: function init() {

            var cls = this.$hasClass('uk-tab-left') && 'uk-tab-left' || this.$hasClass('uk-tab-right') && 'uk-tab-right';

            if (cls) {
                UIkit.toggle(this.$el, {cls: cls, mode: 'media', media: this.media});
            }
        }

    }));

};

var Toggle = function (UIkit) {

    UIkit.component('toggle', {

        mixins: [UIkit.mixin.togglable],

        args: 'target',

        props: {
            href: String,
            target: null,
            mode: 'list',
            media: 'media'
        },

        defaults: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
            media: false
        },

        computed: {

            target: function target() {
                return query(this.$props.target || this.href, this.$el) || this.$el;
            }

        },

        events: [

            {

                name: (pointerEnter + " " + pointerLeave),

                filter: function filter() {
                    return ~this.mode.indexOf('hover');
                },

                handler: function handler(e) {
                    if (!isTouch(e)) {
                        this.toggle(("toggle" + (e.type === pointerEnter ? 'show' : 'hide')));
                    }
                }

            },

            {

                name: 'click',

                filter: function filter() {
                    return ~this.mode.indexOf('click') || hasTouch;
                },

                handler: function handler(e) {

                    if (!isTouch(e) && !~this.mode.indexOf('click')) {
                        return;
                    }

                    // TODO better isToggled handling
                    var link = $__default(e.target).closest('a[href]')[0];
                    if ($__default(e.target).closest('a[href="#"], button').length
                        || link && (
                            this.cls
                            || !this.target.is(':visible')
                            || link.hash && this.target.is(link.hash)
                        )
                    ) {
                        e.preventDefault();
                    }

                    this.toggle();
                }

            }
        ],

        update: {

            write: function write() {

                if (!~this.mode.indexOf('media') || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (window.matchMedia(this.media).matches ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize']

        },

        methods: {

            toggle: function toggle(type) {
                if (!$trigger(this.target, type || 'toggle', [this], true).isDefaultPrevented()) {
                    this.toggleElement(this.target);
                }
            }

        }

    });

};

var Leader = function (UIkit) {

    UIkit.component('leader', {

        mixins: [Class],

        props: {
            fill: String,
            media: 'media'
        },

        defaults: {
            fill: '',
            media: false,
            clsWrapper: 'uk-leader-fill',
            clsHide: 'uk-leader-hide',
            attrFill: 'data-fill'
        },

        computed: {

            fill: function fill() {
                return this.$props.fill || getCssVar('leader-fill');
            }

        },

        connected: function connected() {
            this.wrapper = this.$el.wrapInner(("<span class=\"" + (this.clsWrapper) + "\">")).children().first();
        },

        disconnected: function disconnected() {
            this.wrapper.contents().unwrap();
        },

        update: [

            {

                read: function read() {
                    var prev = this._width;
                    this._width = Math.floor(this.$el[0].offsetWidth / 2);
                    this._changed = prev !== this._width;
                    this._hide = this.media && !window.matchMedia(this.media).matches;
                },

                write: function write() {

                    this.wrapper.toggleClass(this.clsHide, this._hide);

                    if (this._changed) {
                        this.wrapper.attr(this.attrFill, new Array(this._width).join(this.fill));
                    }

               },

                events: ['load', 'resize']

            }
        ]
    });

};

var Video = function (UIkit) {

    UIkit.component('video', {

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        defaults: {automute: false, autoplay: true},

        computed: {

            el: function el() {
                return this.$el[0];
            }

        },

        ready: function ready() {
            this.player = new Player(this.el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: {

            write: function write() {

                if (!this.player || !this.autoplay) {
                    return;
                }

                if (this.el.offsetHeight === 0 || this.$el.css('visibility') === 'hidden') {
                    this.player.pause();
                } else {
                    this.player.play();
                }

            },

            events: ['load']

        },

    });

};

var core = function (UIkit) {

    var scroll = 0, started = 0;

    on(window, 'load resize', UIkit.update);
    on(window, 'scroll', function (e) {
        e.dir = scroll < window.pageYOffset ? 'down' : 'up';
        scroll = window.pageYOffset;
        UIkit.update(e);
        fastdom.flush();
    });

    animationstart && on(document, animationstart, function (ref) {
        var target = ref.target;

        if ((getStyle(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
            started++;
            document.body.style.overflowX = 'hidden';
            setTimeout(function () {
                if (!--started) {
                    document.body.style.overflowX = '';
                }
            }, toMs(getStyle(target, 'animationDuration')) + 100);
        }
    }, true);

    // core components
    UIkit.use(Toggle);
    UIkit.use(Accordion);
    UIkit.use(Alert);
    UIkit.use(Video);
    UIkit.use(Cover);
    UIkit.use(Drop);
    UIkit.use(Dropdown);
    UIkit.use(FormCustom);
    UIkit.use(HeightMatch);
    UIkit.use(HeightViewport);
    UIkit.use(Hover);
    UIkit.use(Margin);
    UIkit.use(Gif);
    UIkit.use(Grid);
    UIkit.use(Leader);
    UIkit.use(Modal$1);
    UIkit.use(Nav);
    UIkit.use(Navbar);
    UIkit.use(Offcanvas);
    UIkit.use(Responsive);
    UIkit.use(Scroll);
    UIkit.use(Scrollspy);
    UIkit.use(ScrollspyNav);
    UIkit.use(Sticky);
    UIkit.use(Svg);
    UIkit.use(Icon);
    UIkit.use(Switcher);
    UIkit.use(Tab);

};

UIkit$2.version = '3.0.0-beta.30';

mixin(UIkit$2);
core(UIkit$2);

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.component('countdown', {

        mixins: [UIkit.mixin.class],

        attrs: true,

        props: {
            date: String,
            clsWrapper: String
        },

        defaults: {
            date: '',
            clsWrapper: '.uk-countdown-%unit%'
        },

        computed: {

            date: function date() {
                return Date.parse(this.$props.date);
            },

            days: function days() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'days'));
            },

            hours: function hours() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'hours'));
            },

            minutes: function minutes() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'minutes'));
            },

            seconds: function seconds() {
                return this.$el.find(this.clsWrapper.replace('%unit%', 'seconds'));
            },

            units: function units() {
                var this$1 = this;

                return ['days', 'hours', 'minutes', 'seconds'].filter(function (unit) { return this$1[unit].length; });
            }

        },

        connected: function connected() {
            this.start();
        },

        disconnected: function disconnected() {
            var this$1 = this;

            this.stop();
            this.units.forEach(function (unit) { return this$1[unit].empty(); });
        },

        update: {

            write: function write() {
                var this$1 = this;


                var timespan = getTimeSpan(this.date);

                if (timespan.total <= 0) {

                    this.stop();

                    timespan.days
                        = timespan.hours
                        = timespan.minutes
                        = timespan.seconds
                        = 0;
                }

                this.units.forEach(function (unit) {

                    var digits = String(Math.floor(timespan[unit]));

                    digits = digits.length < 2 ? ("0" + digits) : digits;

                    if (this$1[unit].text() !== digits) {
                        var el = this$1[unit];
                        digits = digits.split('');

                        if (digits.length !== el.children().length) {
                            el.empty().append(digits.map(function () { return '<span></span>'; }).join(''));
                        }

                        digits.forEach(function (digit, i) { return el[0].childNodes[i].innerText = digit; });
                    }

                });

            }

        },

        methods: {

            start: function start() {
                var this$1 = this;


                this.stop();

                if (this.date && this.units.length) {
                    this.$emit();
                    this.timer = setInterval(function () { return this$1.$emit(); }, 1000);
                }

            },

            stop: function stop() {

                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }

            }

        }

    });

    function getTimeSpan(date) {

        var total = date - Date.now();

        return {
            total: total,
            seconds: total / 1000 % 60,
            minutes: total / 1000 / 60 % 60,
            hours: total / 1000 / 60 / 60 % 24,
            days: total / 1000 / 60 / 60 / 24
        };
    }

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

function plugin$2(UIkit) {

    if (plugin$2.installed) {
        return;
    }

    var ref = UIkit.util;
    var $$$1 = ref.$;
    var doc = ref.doc;
    var fastdom = ref.fastdom;
    var getIndex = ref.getIndex;
    var noop = ref.noop;
    var on = ref.on;
    var off = ref.off;
    var pointerDown = ref.pointerDown;
    var pointerMove = ref.pointerMove;
    var pointerUp = ref.pointerUp;
    var preventClick = ref.preventClick;
    var promise = ref.promise;
    var requestAnimationFrame = ref.requestAnimationFrame;
    var Transition = ref.Transition;

    UIkit.mixin.slideshow = {

        attrs: true,

        props: {
            autoplay: Number,
            animation: String,
            transition: String,
            duration: Number
        },

        defaults: {
            autoplay: 0,
            animation: 'slide',
            transition: 'linear',
            duration: 400,
            index: 0,
            stack: [],
            threshold: 10,
            percent: 0,
            clsActive: 'uk-active'
        },

        computed: {

            slides: function slides() {
                return this.list.children(("." + (this.clsItem)));
            },

            forwardDuration: function forwardDuration() {
                return this.duration / 4;
            }

        },

        init: function init() {
            var this$1 = this;

            ['start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {

                    e = e.originalEvent || e;

                    this$1.prevPos = this$1.pos;
                    this$1.pos = (e.touches && e.touches[0] || e).pageX;

                    fn(e);
                };
            });
        },

        connected: function connected() {
            this.startAutoplay();
        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ("[" + (this.attrItem) + "]");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show($$$1(e.currentTarget).blur().attr(this.attrItem));
                }

            },

            {

                name: pointerDown,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: 'start'
            },

            {

                name: pointerDown,
                handler: 'stopAutoplay'
            },

            {
                name: 'mouseenter',

                filter: function filter() {
                    return this.autoplay;
                },

                handler: function handler() {
                    this.isHovering = true;
                }
            },

            {
                name: 'mouseleave',

                filter: function filter() {
                    return this.autoplay;
                },

                handler: function handler() {
                    this.isHovering = false;
                }
            } ],

        methods: {

            start: function start(e) {

                if (e.button && e.button !== 0 || this.slides.length < 2) {
                    return;
                }

                e.preventDefault();

                var percent = 0;
                if (this.stack.length) {

                    this.percent = this._animation.percent();

                    var dir = this._animation.dir;
                    percent = this.percent * dir;

                    this.stack.splice(0, this.stack.length);

                    this._animation.cancel();
                    this._animation.translate(Math.abs(percent));

                    this.index = this.getIndex(this.index - dir);
                    this.touching = true;
                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                var el = this.slides.eq(this.index);

                this.touch = {
                    el: el,
                    start: this.pos + (percent ? el.outerWidth() * percent : 0)
                };

            },

            move: function move(e) {
                var this$1 = this;


                e.preventDefault();

                var ref = this.touch;
                var start = ref.start;
                var el = ref.el;

                if (this.pos === this.prevPos || (!this.touching && Math.abs(start - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - start) / el.outerWidth();

                if (this.percent === percent) {
                    return;
                }

                var changed = trunc(this.percent) !== trunc(percent),
                    index = this.getIndex(this.index - trunc(percent)),
                    current = this.slides.eq(index),
                    dir = percent < 0 ? 1 : -1,
                    nextIndex = getIndex(percent < 0 ? 'next' : 'previous', this.slides, index),
                    next = this.slides.eq(nextIndex);

                this.slides.each(function (i, el) { return this$1.$toggleClass(el, this$1.clsActive, i === index || i === nextIndex); });

                if (changed && this._animation) {
                    this._animation.reset();
                }

                this._animation = new Transitioner(this.animation, this.transition, current, next, dir, noop);
                this._animation.translate(Math.abs(percent % 1));

                this.percent = percent;

                UIkit.update(null, current);
                UIkit.update(null, next);
            },

            end: function end(e) {

                e.preventDefault();

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent) % 1;
                    this.index = this.getIndex(this.index - trunc(percent));

                    if (this.percent < 0.2) {
                        this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;
                    }

                    this.show(percent > 0 ? 'previous': 'next', true);

                    preventClick();

                }

                this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;

            },

            show: function show(index, force) {
                var this$1 = this;
                if ( force === void 0 ) force = false;


                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this.stack.length === 2) {
                        this._animation.forward(this.forwardDuration);
                    }

                    return;
                }

                var hasPrev = this.slides.hasClass('uk-active'),
                    dir = index === 'next'
                            ? 1
                            : index === 'previous'
                                ? -1
                                : index < this.index
                                    ? -1
                                    : 1;

                index = this.getIndex(index);

                if (hasPrev && index === this.index) {
                    this.stack[force ? 'shift' : 'pop']();
                    return;
                }

                var prev = hasPrev && this.slides.eq(this.index),
                    next = this.slides.eq(index);

                this.$el.trigger('beforeitemshow', [this, next]);
                prev && this.$el.trigger('beforeitemhide', [this, prev]);

                this.index = index;

                this.$addClass(next, this.clsActive);

                this._animation = new Transitioner(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, function () {

                    prev && this$1.$removeClass(prev, this$1.clsActive);

                    this$1.stack.shift();
                    if (this$1.stack.length) {
                        requestAnimationFrame(function () { return this$1.show(this$1.stack.shift(), true); });
                    } else {
                        this$1._animation = null;
                    }

                    this$1.$el.trigger('itemshown', [this$1, next]);
                    UIkit.update(null, next);

                    if (prev) {
                        this$1.$el.trigger('itemhidden', [this$1, prev]);
                        UIkit.update(null, prev);
                    }

                });

                this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                this.$el.trigger('itemshow', [this, next]);

                if (prev) {
                    this.$el.trigger('itemhide', [this, prev]);
                    UIkit.update(null, prev);
                }

                UIkit.update(null, next);
                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
            },

            getIndex: function getIndex$1(index) {
                if ( index === void 0 ) index = this.index;

                return getIndex(index, this.slides, this.index);
            },

            startAutoplay: function startAutoplay() {
                var this$1 = this;


                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(function () {!this$1.isHovering && this$1.show('next');}, this.autoplay);
                }

            },

            stopAutoplay: function stopAutoplay() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };

    var diff = 0.2;
    var Animations = {

        fade: {

            show: function show() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        slide: {

            show: function show(dir) {
                return [
                    {transform: ("translate3d(" + (dir * -100) + "%, 0, 0)")},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent: function percent(current) {
                return Math.abs(current.css('transform').split(',')[4] / current.outerWidth());
            },

            translate: function translate(percent, dir) {
                return [
                    {transform: ("translate3d(" + (dir * -100 * percent) + "%, 0, 0)")},
                    {transform: ("translate3d(" + (dir * 100 * (1 - percent)) + "%, 0, 0)")}
                ];
            }

        },

        scale: {

            show: function show() {
                return [
                    {opacity: 0, transform: ("scale3d(" + (1 - diff) + ", " + (1 - diff) + ", 1)")},
                    {opacity: 1, transform: 'scale3d(1, 1, 1)'}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                var scale1 = 1 - diff * percent,
                    scale2 = 1 - diff + diff * percent;

                return [
                    {opacity: 1 - percent, transform: ("scale3d(" + scale1 + ", " + scale1 + ", 1)")},
                    {opacity: percent, transform: ("scale3d(" + scale2 + ", " + scale2 + ", 1)")}
                ];
            }

        },

        swipe: {

            show: function show(dir) {

                if (dir < 0) {
                    return [
                        {opacity: 1, transform: "translate3d(100%, 0, 0)", zIndex: 0},
                        {opacity: 1, transform: "scale3d(1, 1, 1) translate3d(0, 0, 0)", zIndex: -1} ];
                } else {
                    return [
                        {opacity: 0.3, transform: ("scale3d(" + (1 - diff) + ", " + (1 - diff) + ", 1) translate3d(-20%, 0, 0)"), zIndex: -1},
                        {opacity: 1, transform: 'translate3d(0, 0, 0)', zIndex: 0}
                    ];
                }


            },

            percent: function percent(current, next, dir) {

                var el = dir < 0 ? current : next,
                    percent = Math.abs(el.css('transform').split(',')[4] / el.outerWidth());

                return dir < 0 ? percent : 1 - percent;
            },

            translate: function translate(percent, dir) {
                var scale;

                if (dir < 0) {
                    scale = 1 - diff * (1 - percent);
                    return [
                        {opacity: 1, transform: ("translate3d(" + (100 * percent) + "%, 0, 0)"), zIndex: 0},
                        {opacity: 0.3 + 0.7 * percent, transform: ("scale3d(" + scale + ", " + scale + ", 1) translate3d(" + (-20 * (1 - percent)) + "%, 0, 0)"), zIndex: -1} ];
                } else {
                    scale = 1 - diff * percent;
                    return [
                        {opacity: 1 - 0.7 * percent, transform: ("scale3d(" + scale + ", " + scale + ", 1) translate3d(" + (-20 * percent) + "%, 0, 0)"), zIndex: -1},
                        {opacity: 1, transform: ("translate3d(" + (100 * (1 - percent)) + "%, 0, 0)"), zIndex: 0}
                    ];
                }

            }

        },

    };

    function Transitioner (animation, transition, current, next, dir, cb) {

        animation = animation in Animations ? Animations[animation] : Animations.slide;

        var props = animation.show(dir);

        return {

            dir: dir,
            current: current,
            next: next,

            show: function show(duration, percent) {
                var this$1 = this;
                if ( percent === void 0 ) percent = 0;


                duration -= Math.round(duration * percent);

                this.translate(percent);

                return promise.all([
                    Transition.start(current, props[0], duration, transition),
                    Transition.start(next, props[1], duration, transition)
                ]).then(function () {
                    this$1.reset();
                    cb();
                }, noop);
            },

            stop: function stop() {
                return promise.all([
                    Transition.stop(next),
                    Transition.stop(current)
                ]);
            },

            cancel: function cancel() {
                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]);
            },

            reset: function reset() {
                for (var prop in props[0]) {
                    $$$1([next[0], current[0]]).css(prop, '');
                }
            },

            forward: function forward(duration) {
                var this$1 = this;


                var percent = this.percent();

                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]).then(function () { return this$1.show(duration, percent); });

            },

            translate: function translate(percent) {

                var props = animation.translate(percent, dir);
                current.css(props[0]);
                next.css(props[1]);

            },

            percent: function percent() {
                return animation.percent(current, next, dir);
            }

        }

    }

    // polyfill for Math.trunc (IE)
    function trunc(x) {
        return ~~x;
    }

}

function plugin$1(UIkit) {

    if (plugin$1.installed) {
        return;
    }

    UIkit.use(plugin$2);

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var $$$1 = util.$;
    var $trigger = util.$trigger;
    var Animation = util.Animation;
    var ajax$$1 = util.ajax;
    var assign = util.assign;
    var doc = util.doc;
    var docElement = util.docElement;
    var getData = util.getData;
    var getImage = util.getImage;
    var pointerDown = util.pointerDown;
    var pointerMove = util.pointerMove;
    var Transition = util.Transition;

    UIkit.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String
        },

        defaults: {
            animation: undefined,
            toggle: 'a'
        },

        computed: {

            toggles: function toggles() {
                var this$1 = this;

                var toggles = $$$1(this.toggle, this.$el);

                this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.toArray().some(function (el, i) { return el !== this$1._toggles.get(i); });

                return this._toggles = toggles;
            }

        },

        disconnected: function disconnected() {

            if (this.panel) {
                this.panel.$destroy(true);
                this.panel = null;
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.toggle) + ":not(.uk-disabled)");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show(this.toggles.index($$$1(e.currentTarget).blur()));
                }

            }

        ],

        update: function update() {

            if (this.panel && this.animation) {
                this.panel.$props.animation = this.animation;
                this.panel.$emit();
            }

            if (!this.toggles.length || !this._changed || !this.panel) {
                return;
            }

            this.panel.$destroy(true);
            this._init();

        },

        methods: {

            _init: function _init() {
                return this.panel = this.panel || UIkit.lightboxPanel({
                        animation: this.animation,
                        items: this.toggles.toArray().reduce(function (items, el) {
                            items.push(['href', 'caption', 'type'].reduce(function (obj, attr) {
                                obj[attr === 'href' ? 'source' : attr] = getData(el, attr);
                                return obj;
                            }, {}));
                            return items;
                        }, [])
                    });
            },

            show: function show(index) {

                if (!this.panel) {
                    this._init();
                }

                return this.panel.show(index);

            },

            hide: function hide() {

                return this.panel && this.panel.hide();

            }

        }

    });

    UIkit.component('lightbox-panel', {

        mixins: [mixin.togglable, mixin.slideshow],

        functional: true,

        defaults: {
            preload: 1,
            delayControls: 3000,
            items: [],
            cls: 'uk-open',
            clsPage: 'uk-lightbox-page',
            clsItem: 'uk-lightbox-item',
            attrItem: 'uk-lightbox-item',
            template: " <div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close uk-toggle=\"!.uk-lightbox\"></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium\" href=\"#\" uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium\" href=\"#\" uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center\"></div> </div>"
        },

        computed: {

            container: function container() {
                return $$$1(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            }

        },

        created: function created() {
            var this$1 = this;


            this.$mount($$$1(this.template).appendTo(this.container)[0]);

            this.list = this.$el.find('.uk-lightbox-items');
            this.toolbars = this.$el.find('.uk-lightbox-toolbar');
            this.nav = this.$el.find('a[uk-lightbox-item]');
            this.caption = this.$el.find('.uk-lightbox-caption');

            this.items.forEach(function (el, i) { return this$1.list.append(("<li class=\"" + (this$1.clsItem) + " item-" + i + "\"></li>")); });

        },

        events: [

            {

                name: (pointerMove + " " + pointerDown + " keydown"),

                handler: 'showControls'

            },

            {

                name: 'click',

                self: true,

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'click',

                self: true,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'show',

                self: true,

                handler: function handler() {

                    this.$addClass(docElement, this.clsPage);

                }
            },

            {

                name: 'shown',

                self: true,

                handler: function handler() {

                    this.$addClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler: function handler() {

                    this.$removeClass(this.caption, 'uk-animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);

                }
            },

            {

                name: 'hidden',

                self: true,

                handler: function handler() {

                    this.$removeClass(docElement, this.clsPage);

                }
            },

            {

                name: 'keydown',

                el: function el() {
                    return doc;
                },

                handler: function handler(e) {

                    if (!this.isToggled(this.$el)) {
                        return;
                    }

                    switch (e.keyCode) {
                        case 27:
                            this.hide();
                            break;
                        case 37:
                            this.show('previous');
                            break;
                        case 39:
                            this.show('next');
                            break;
                    }
                }
            },

            {

                name: 'toggle',

                handler: function handler(e) {
                    e.preventDefault();
                    this.toggle();
                }

            },

            {

                name: 'beforeitemshow',

                self: true,

                handler: function handler() {
                    if (!this.isToggled()) {
                        this.toggleNow(this.$el, true);
                    }
                }

            },

            {

                name: 'itemshow',

                self: true,

                handler: function handler() {
                    var this$1 = this;


                    var caption = this.getItem().caption;
                    this.caption.toggle(!!caption).html(caption);

                    for (var i = 0; i <= this.preload; i++) {
                        this$1.loadItem(this$1.getIndex(this$1.index + i));
                        this$1.loadItem(this$1.getIndex(this$1.index - i));
                    }

                }

            },

            {

                name: 'itemload',

                handler: function handler(_, item) {
                    var this$1 = this;


                    var source = item.source;
                    var type = item.type;
                    var matches;

                    this.setItem(item, '<span uk-spinner></span>');

                    if (!source) {
                        return;
                    }

                    // Image
                    if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)$/i)) {

                        getImage(source).then(
                            function (img) { return this$1.setItem(item, ("<img width=\"" + (img.width) + "\" height=\"" + (img.height) + "\" src=\"" + source + "\">")); },
                            function () { return this$1.setError(item); }
                        );

                    // Video
                    } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)$/i)) {

                        var video = $$$1('<video controls playsinline uk-video></video>')
                            .on('loadedmetadata', function () { return this$1.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight})); })
                            .on('error', function () { return this$1.setError(item); })
                            .attr('src', source);

                    // Iframe
                    } else if (type === 'iframe') {

                        this.setItem(item, ("<iframe class=\"uk-lightbox-iframe\" src=\"" + source + "\" frameborder=\"0\" allowfullscreen></iframe>"));

                    // Youtube
                    } else if (matches = source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/youtu\.be\/(.*)/)) {

                        var id = matches[1],
                            setIframe = function (width, height) {
                                if ( width === void 0 ) width = 640;
                                if ( height === void 0 ) height = 450;

                                return this$1.setItem(item, getIframe(("//www.youtube.com/embed/" + id), width, height));
                        };

                        getImage(("//img.youtube.com/vi/" + id + "/maxresdefault.jpg")).then(
                            function (img) {
                                //youtube default 404 thumb, fall back to lowres
                                if (img.width === 120 && img.height === 90) {
                                    getImage(("//img.youtube.com/vi/" + id + "/0.jpg")).then(
                                        function (img) { return setIframe(img.width, img.height); },
                                        setIframe
                                    );
                                } else {
                                    setIframe(img.width, img.height);
                                }
                            },
                            setIframe
                        );

                    // Vimeo
                    } else if (matches = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {

                        ajax$$1({type: 'GET', url: ("//vimeo.com/api/oembed.json?url=" + (encodeURI(source))), jsonp: 'callback', dataType: 'jsonp'})
                            .then(function (ref) {
                                var height = ref.height;
                                var width = ref.width;

                                return this$1.setItem(item, getIframe(("//player.vimeo.com/video/" + (matches[2])), width, height));
                        });

                    } else {

                        return;

                    }

                    return true;

                }

            }

        ],

        methods: {

            toggle: function toggle() {
                return this.isToggled() ? this.hide() : this.show();
            },

            hide: function hide() {

                if (this.isToggled()) {
                    this.toggleNow(this.$el, false);
                }

                this.slides
                    .removeClass(this.clsActive)
                    .each(function (_, el) { return Transition.stop(el); });

                delete this.index;
                delete this.percent;
                delete this._animation;

            },

            loadItem: function loadItem(index) {
                if ( index === void 0 ) index = this.index;


                var item = this.getItem(index);

                if (item.content) {
                    return;
                }

                if (!$trigger(this.$el, 'itemload', [item], true).result) {
                    this.setError(item);
                }
            },

            getItem: function getItem(index) {
                if ( index === void 0 ) index = this.index;

                return this.items[index] || {};
            },

            setItem: function setItem(item, content) {
                assign(item, {content: content});
                var el = this.slides.eq(this.items.indexOf(item)).html(content);
                this.$el.trigger('itemloaded', [this, el]);
                UIkit.update(null, el);
            },

            setError: function setError(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            showControls: function showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                if (!this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom');

                this.nav.attr('hidden', this.items.length <= 1);

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade');
                }

            },

            hideControls: function hideControls() {

                if (this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'uk-animation-slide-top', 'out');
                animate(this.toolbars.eq(1), 'uk-animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav, 'uk-animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir) {
        if ( dir === void 0 ) dir = 'in';

        el.each(function (i) { return Animation[dir](el.eq(i).attr('hidden', false), animation).then(function () { dir === 'out' && el.eq(i).attr('hidden', true);}); });
    }

    function getIframe(src, width, height) {
        return ("<iframe src=\"" + src + "\" width=\"" + width + "\" height=\"" + height + "\" style=\"max-width: 100%; box-sizing: border-box;\" uk-video uk-responsive></iframe>");
    }

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$1);
}

function plugin$3(UIkit) {

    if (plugin$3.installed) {
        return;
    }

    var ref = UIkit.util;
    var $$$1 = ref.$;
    var each$$1 = ref.each;
    var pointerEnter = ref.pointerEnter;
    var pointerLeave = ref.pointerLeave;
    var Transition = ref.Transition;
    var containers = {};

    UIkit.component('notification', {

        functional: true,

        args: ['message', 'status'],

        defaults: {
            message: '',
            status: '',
            timeout: 5000,
            group: null,
            pos: 'top-center',
            onClose: null,
            clsClose: 'uk-notification-close',
            clsMsg: 'uk-notification-message'
        },

        created: function created() {

            if (!containers[this.pos]) {
                containers[this.pos] = $$$1(("<div class=\"uk-notification uk-notification-" + (this.pos) + "\"></div>")).appendTo(UIkit.container);
            }

            this.$mount($$$1(
                ("<div class=\"" + (this.clsMsg) + (this.status ? (" " + (this.clsMsg) + "-" + (this.status)) : '') + "\"> <a href=\"#\" class=\"" + (this.clsClose) + "\" data-uk-close></a> <div>" + (this.message) + "</div> </div>")
            ).appendTo(containers[this.pos].show())[0]);

        },

        ready: function ready() {
            var this$1 = this;


            var marginBottom = parseInt(this.$el.css('margin-bottom'), 10);

            Transition.start(
                this.$el.css({opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}),
                {opacity: 1, marginTop: 0, marginBottom: marginBottom}
            ).then(function () {
                if (this$1.timeout) {
                    this$1.timer = setTimeout(this$1.close, this$1.timeout);
                }
            });

        },

        events: ( obj = {

            click: function click(e) {
                if ($$$1(e.target).closest('a[href="#"]').length) {
                    e.preventDefault();
                }
                this.close();
            }

        }, obj[pointerEnter] = function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            }, obj[pointerLeave] = function () {
                if (this.timeout) {
                    this.timer = setTimeout(this.close, this.timeout);
                }
            }, obj ),

        methods: {

            close: function close(immediate) {
                var this$1 = this;


                var remove = function () {

                    this$1.onClose && this$1.onClose();
                    this$1.$el.trigger('close', [this$1]).remove();

                    if (!containers[this$1.pos].children().length) {
                        containers[this$1.pos].hide();
                    }

                };

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                if (immediate) {
                    remove();
                } else {
                    Transition.start(this.$el, {opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}).then(remove);
                }
            }

        }

    });
    var obj;

    UIkit.notification.closeAll = function (group, immediate) {
        each$$1(UIkit.instances, function (_, component) {
            if (component.$options.name === 'notification' && (!group || group === component.group)) {
                component.close(immediate);
            }
        });
    };

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$3);
}

function plugin$4(UIkit) {

    if (plugin$4.installed) {
        return;
    }

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var $$$1 = util.$;
    var assign = util.assign;
    var doc = util.docElement;
    var docHeight = util.docHeight;
    var fastdom = util.fastdom;
    var getDimensions = util.getDimensions;
    var isWithin = util.isWithin;
    var offset = util.offset;
    var offsetTop = util.offsetTop;
    var pointerDown = util.pointerDown;
    var pointerMove = util.pointerMove;
    var pointerUp = util.pointerUp;
    var preventClick = util.preventClick;
    var promise = util.promise;
    var win = util.win;

    UIkit.component('sortable', {

        mixins: [mixin.class],

        props: {
            group: String,
            animation: Number,
            threshold: Number,
            clsItem: String,
            clsPlaceholder: String,
            clsDrag: String,
            clsDragState: String,
            clsBase: String,
            clsNoDrag: String,
            clsEmpty: String,
            clsCustom: String,
            handle: String
        },

        defaults: {
            group: false,
            animation: 150,
            threshold: 5,
            clsItem: 'uk-sortable-item',
            clsPlaceholder: 'uk-sortable-placeholder',
            clsDrag: 'uk-sortable-drag',
            clsDragState: 'uk-drag',
            clsBase: 'uk-sortable',
            clsNoDrag: 'uk-sortable-nodrag',
            clsEmpty: 'uk-sortable-empty',
            clsCustom: '',
            handle: false
        },

        init: function init() {
            var this$1 = this;

            ['init', 'start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {
                    e = e.originalEvent || e;
                    this$1.scrollY = window.scrollY;
                    var ref = e.touches && e.touches[0] || e;
                    var x = ref.pageX;
                    var y = ref.pageY;
                    this$1.pos = {x: x, y: y};

                    fn(e);
                };
            });
        },

        events: ( obj = {}, obj[pointerDown] = 'init', obj ),

        update: {

            write: function write() {
                var this$1 = this;


                if (this.clsEmpty) {
                    this.$toggleClass(this.clsEmpty, !this.$el.children().length);
                }

                if (!this.drag) {
                    return;
                }

                offset(this.drag, {top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

                var top = offsetTop(this.drag), bottom = top + this.drag[0].offsetHeight;

                if (top > 0 && top < this.scrollY) {
                    setTimeout(function () { return win.scrollTop(this$1.scrollY - 5); }, 5);
                } else if (bottom < docHeight() && bottom > window.innerHeight + this.scrollY) {
                    setTimeout(function () { return win.scrollTop(this$1.scrollY + 5); }, 5);
                }

            }

        },

        methods: {

            init: function init(e) {

                var target = $$$1(e.target), placeholder = this.$el.children().filter(function (i, el) { return isWithin(e.target, el); });

                if (!placeholder.length
                    || target.is(':input')
                    || this.handle && !isWithin(target, this.handle)
                    || e.button && e.button !== 0
                    || isWithin(target, ("." + (this.clsNoDrag)))
                    || e.defaultPrevented
                ) {
                    return;
                }

                e.preventDefault();

                this.touched = [this];
                this.placeholder = placeholder;
                this.origin = assign({target: target, index: this.placeholder.index()}, this.pos);

                doc.on(pointerMove, this.move);
                doc.on(pointerUp, this.end);
                win.on('scroll', this.scroll);

                if (!this.threshold) {
                    this.start(e);
                }

            },

            start: function start(e) {

                this.drag = $$$1(this.placeholder[0].outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'))
                    .attr('uk-no-boot', '')
                    .addClass(((this.clsDrag) + " " + (this.clsCustom)))
                    .css({
                        boxSizing: 'border-box',
                        width: this.placeholder.outerWidth(),
                        height: this.placeholder.outerHeight()
                    })
                    .css(this.placeholder.css(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']))
                    .appendTo(UIkit.container);

                this.drag.children().first().height(this.placeholder.children().height());

                var ref = getDimensions(this.placeholder);
                var left = ref.left;
                var top = ref.top;
                assign(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

                this.placeholder.addClass(this.clsPlaceholder);
                this.$el.children().addClass(this.clsItem);
                doc.addClass(this.clsDragState);

                this.$el.trigger('start', [this, this.placeholder, this.drag]);

                this.move(e);
            },

            move: function move(e) {

                if (!this.drag) {

                    if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                        this.start(e);
                    }

                    return;
                }

                this.$emit();

                var target = e.type === 'mousemove' ? e.target : document.elementFromPoint(this.pos.x - document.body.scrollLeft, this.pos.y - document.body.scrollTop),
                    sortable = getSortable(target),
                    previous = getSortable(this.placeholder[0]),
                    move = sortable !== previous;

                if (!sortable || isWithin(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                    return;
                }

                target = sortable.$el.is(target.parentNode) && $$$1(target) || sortable.$el.children().has(target);

                if (move) {
                    previous.remove(this.placeholder);
                } else if (!target.length) {
                    return;
                }

                sortable.insert(this.placeholder, target);

                if (!~this.touched.indexOf(sortable)) {
                    this.touched.push(sortable);
                }

            },

            scroll: function scroll() {
                var scroll = window.scrollY;
                if (scroll !== this.scrollY) {
                    this.pos.y += scroll - this.scrollY;
                    this.scrollY = scroll;
                    this.$emit();
                }
            },

            end: function end(e) {

                doc.off(pointerMove, this.move);
                doc.off(pointerUp, this.end);
                win.off('scroll', this.scroll);

                if (!this.drag) {

                    if (e.type !== 'mouseup' && isWithin(e.target, 'a[href]')) {
                        location.href = $$$1(e.target).closest('a[href]').attr('href');
                    }

                    return;
                }

                preventClick();

                var sortable = getSortable(this.placeholder[0]);

                if (this === sortable) {
                    if (this.origin.index !== this.placeholder.index()) {
                        this.$el.trigger('change', [this, this.placeholder, 'moved']);
                    }
                } else {
                    sortable.$el.trigger('change', [sortable, this.placeholder, 'added']);
                    this.$el.trigger('change', [this, this.placeholder, 'removed']);
                }

                this.$el.trigger('stop', [this]);

                this.drag.remove();
                this.drag = null;

                var classes = this.touched.map(function (sortable) { return ((sortable.clsPlaceholder) + " " + (sortable.clsItem)); }).join(' ');
                this.touched.forEach(function (sortable) { return sortable.$el.children().removeClass(classes); });

                doc.removeClass(this.clsDragState);

            },

            insert: function insert(element, target) {
                var this$1 = this;


                this.$el.children().addClass(this.clsItem);

                var insert = function () {

                    if (target.length) {

                        if (!this$1.$el.has(element).length || element.prevAll().filter(target).length) {
                            element.insertBefore(target);
                        } else {
                            element.insertAfter(target);
                        }

                    } else {
                        this$1.$el.append(element);
                    }

                };

                if (this.animation) {
                    this.animate(insert);
                } else {
                    insert();
                }

            },

            remove: function remove(element) {

                if (!this.$el.has(element).length) {
                    return;
                }

                if (this.animation) {
                    this.animate(function () { return element.detach(); });
                } else {
                    element.detach();
                }

            },

            animate: function animate(action) {
                var this$1 = this;


                var props = [],
                    children = this.$el.children().toArray().map(function (el) {
                        el = $$$1(el);
                        props.push(assign({
                            position: 'absolute',
                            pointerEvents: 'none',
                            width: el.outerWidth(),
                            height: el.outerHeight()
                        }, el.position()));
                        return el;
                    }),
                    reset = {position: '', width: '', height: '', pointerEvents: '', top: '', left: ''};

                action();

                children.forEach(function (el) { return el.stop(); });
                this.$el.children().css(reset);
                this.$update('update', true);
                fastdom.flush();

                this.$el.css('min-height', this.$el.height());

                var positions = children.map(function (el) { return el.position(); });
                promise.all(children.map(function (el, i) { return el.css(props[i]).animate(positions[i], this$1.animation).promise(); }))
                    .then(function () {
                        this$1.$el.css('min-height', '').children().css(reset);
                        this$1.$update('update', true);
                        fastdom.flush();
                    });

            }

        }

    });
    var obj;

    function getSortable(element) {
        return UIkit.getComponent(element, 'sortable') || element.parentNode && getSortable(element.parentNode);
    }

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$4);
}

function plugin$5(UIkit) {

    if (plugin$5.installed) {
        return;
    }

    var util = UIkit.util;
    var mixin = UIkit.mixin;
    var $$$1 = util.$;
    var doc = util.doc;
    var fastdom = util.fastdom;
    var flipPosition = util.flipPosition;
    var isTouch = util.isTouch;
    var isWithin = util.isWithin;
    var pointerDown = util.pointerDown;
    var pointerEnter = util.pointerEnter;
    var pointerLeave = util.pointerLeave;

    var actives = [];

    UIkit.component('tooltip', {

        attrs: true,

        mixins: [mixin.togglable, mixin.position],

        props: {
            delay: Number,
            container: Boolean,
            title: String
        },

        defaults: {
            pos: 'top',
            title: '',
            delay: 0,
            animation: ['uk-animation-scale-up'],
            duration: 100,
            cls: 'uk-active',
            clsPos: 'uk-tooltip',
            container: true,
        },

        computed: {

            container: function container() {
                return $$$1(this.$props.container === true && UIkit.container || this.$props.container || UIkit.container);
            }

        },

        connected: function connected() {
            var this$1 = this;

            fastdom.mutate(function () { return this$1.$el.removeAttr('title').attr('aria-expanded', false); });
        },

        disconnected: function disconnected() {
            this.hide();
        },

        methods: {

            show: function show() {
                var this$1 = this;


                if (~actives.indexOf(this)) {
                    return;
                }

                actives.forEach(function (active) { return active.hide(); });
                actives.push(this);

                doc.on(("click." + (this.$options.name)), function (e) {
                    if (!isWithin(e.target, this$1.$el)) {
                        this$1.hide();
                    }
                });

                clearTimeout(this.showTimer);

                this.tooltip = $$$1(("<div class=\"" + (this.clsPos) + "\" aria-hidden=\"true\"><div class=\"" + (this.clsPos) + "-inner\">" + (this.title) + "</div></div>")).appendTo(this.container);

                this.$el.attr('aria-expanded', true);

                this.positionAt(this.tooltip, this.$el);
                this.origin = this.getAxis() === 'y' ? ((flipPosition(this.dir)) + "-" + (this.align)) : ((this.align) + "-" + (flipPosition(this.dir)));

                this.showTimer = setTimeout(function () {
                    this$1.toggleElement(this$1.tooltip, true);

                    this$1.hideTimer = setInterval(function () {
                        if (!this$1.$el.is(':visible')) {
                            this$1.hide();
                        }
                    }, 150);

                }, this.delay);
            },

            hide: function hide() {

                var index = actives.indexOf(this);

                if (!~index || this.$el.is('input') && this.$el[0] === document.activeElement) {
                    return;
                }

                actives.splice(index, 1);

                clearTimeout(this.showTimer);
                clearInterval(this.hideTimer);
                this.$el.attr('aria-expanded', false);
                this.toggleElement(this.tooltip, false);
                this.tooltip && this.tooltip.remove();
                this.tooltip = false;
                doc.off(("click." + (this.$options.name)));

            }

        },

        events: ( obj = {

            'blur': 'hide'

        }, obj[("focus " + pointerEnter + " " + pointerDown)] = function (e) {
                if (e.type !== pointerDown || !isTouch(e)) {
                    this.show();
                }
            }, obj[pointerLeave] = function (e) {
                if (!isTouch(e)) {
                    this.hide();
                }
            }, obj )

    });
    var obj;

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$5);
}

function plugin$6(UIkit) {

    if (plugin$6.installed) {
        return;
    }

    var ref = UIkit.util;
    var $$$1 = ref.$;
    var ajax$$1 = ref.ajax;
    var on = ref.on;

    UIkit.component('upload', {

        props: {
            allow: String,
            clsDragover: String,
            concurrent: Number,
            dataType: String,
            mime: String,
            msgInvalidMime: String,
            msgInvalidName: String,
            multiple: Boolean,
            name: String,
            params: Object,
            type: String,
            url: String
        },

        defaults: {
            allow: false,
            clsDragover: 'uk-dragover',
            concurrent: 1,
            dataType: undefined,
            mime: false,
            msgInvalidMime: 'Invalid File Type: %s',
            msgInvalidName: 'Invalid File Name: %s',
            multiple: false,
            name: 'files[]',
            params: {},
            type: 'POST',
            url: '',
            abort: null,
            beforeAll: null,
            beforeSend: null,
            complete: null,
            completeAll: null,
            error: null,
            fail: function fail(msg) {
                alert(msg);
            },
            load: null,
            loadEnd: null,
            loadStart: null,
            progress: null
        },

        events: {

            change: function change(e) {

                if (!$$$1(e.target).is('input[type="file"]')) {
                    return;
                }

                e.preventDefault();

                if (e.target.files) {
                    this.upload(e.target.files);
                }

                e.target.value = '';
            },

            drop: function drop(e) {
                e.preventDefault();
                e.stopPropagation();

                var transfer = e.originalEvent.dataTransfer;

                if (!transfer || !transfer.files) {
                    return;
                }

                this.$removeClass(this.clsDragover);

                this.upload(transfer.files);
            },

            dragenter: function dragenter(e) {
                e.preventDefault();
                e.stopPropagation();
            },

            dragover: function dragover(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$addClass(this.clsDragover);
            },

            dragleave: function dragleave(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$removeClass(this.clsDragover);
            }

        },

        methods: {

            upload: function upload(files) {
                var this$1 = this;


                if (!files.length) {
                    return;
                }

                this.$el.trigger('upload', [files]);

                for (var i = 0; i < files.length; i++) {

                    if (this$1.allow) {
                        if (!match(this$1.allow, files[i].name)) {
                            this$1.fail(this$1.msgInvalidName.replace(/%s/, this$1.allow));
                            return;
                        }
                    }

                    if (this$1.mime) {
                        if (!match(this$1.mime, files[i].type)) {
                            this$1.fail(this$1.msgInvalidMime.replace(/%s/, this$1.mime));
                            return;
                        }
                    }

                }

                if (!this.multiple) {
                    files = [files[0]];
                }

                this.beforeAll && this.beforeAll(this, files);

                var chunks = chunk(files, this.concurrent),
                    upload = function (files) {

                        var data = new FormData();

                        files.forEach(function (file) { return data.append(this$1.name, file); });

                        for (var key in this$1.params) {
                            data.append(key, this$1.params[key]);
                        }

                        ajax$$1({
                            data: data,
                            url: this$1.url,
                            type: this$1.type,
                            dataType: this$1.dataType,
                            beforeSend: this$1.beforeSend,
                            complete: [this$1.complete, function (xhr, status) {
                                if (chunks.length) {
                                    upload(chunks.shift());
                                } else {
                                    this$1.completeAll && this$1.completeAll(xhr);
                                }

                                if (status === 'abort') {
                                    this$1.abort && this$1.abort(xhr);
                                }
                            }],
                            cache: false,
                            contentType: false,
                            processData: false,
                            xhr: function () {
                                var xhr = $$$1.ajaxSettings.xhr();
                                xhr.upload && this$1.progress && on(xhr.upload, 'progress', this$1.progress);
                                ['loadStart', 'load', 'loadEnd', 'error', 'abort'].forEach(function (type) { return this$1[type] && on(xhr, type.toLowerCase(), this$1[type]); });
                                return xhr;
                            }
                        });

                    };

                upload(chunks.shift());

            }

        }

    });

    function match(pattern, path) {
        return path.match(new RegExp(("^" + (pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.')) + "$"), 'i'));
    }

    function chunk(files, size) {
        var chunks = [];
        for (var i = 0; i < files.length; i += size) {
            var chunk = [];
            for (var j = 0; j < size; j++) {
                chunk.push(files[i+j]);
            }
            chunks.push(chunk);
        }
        return chunks;
    }

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$6);
}

function plugin$7(UIkit) {

    if (plugin$7.installed) {
        return;
    }

    var ref = UIkit.util;
    var scrolledOver = ref.scrolledOver;

    UIkit.component('grid-parallax', UIkit.components.grid.extend({

        props: {
            target: String,
            translate: Number
        },

        defaults: {
            target: false,
            translate: 150
        },

        init: function init() {
            this.$addClass('uk-grid');
        },

        disconnected: function disconnected() {
            this.reset();
            this.$el.css('margin-bottom', '');
        },

        computed: {

            translate: function translate() {
                return Math.abs(this.$props.translate);
            },

            items: function items() {
                return (this.target ? this.$el.find(this.target) : this.$el.children()).toArray();
            }

        },

        update: [

            {

                read: function read() {
                    this.columns = this.rows && this.rows[0] && this.rows[0].length || 0;
                    this.rows = this.rows && this.rows.map(function (elements) { return sortBy(elements, 'offsetLeft'); });
                },

                write: function write() {
                    this.$el
                        .css('margin-bottom', '')
                        .css('margin-bottom', this.columns > 1 ? this.translate + parseFloat(this.$el.css('margin-bottom')) : '');
                },

                events: ['load', 'resize']
            },

            {

                read: function read() {

                    this.scrolled = scrolledOver(this.$el) * this.translate;

                },

                write: function write() {
                    var this$1 = this;


                    if (!this.rows || this.columns === 1 || !this.scrolled) {
                        return this.reset();
                    }

                    this.rows.forEach(function (row) { return row.forEach(function (el, i) { return el.style.transform = "translateY(" + (i % 2 ? this$1.scrolled : this$1.scrolled / 8) + "px)"; }
                        ); }
                    );

                },

                events: ['scroll', 'load', 'resize']
            }
        ],

        methods: {

            reset: function reset() {
                this.items.forEach(function (item) { return item.style.transform = ''; });
            }

        }

    }));

    UIkit.component('grid-parallax').options.update.unshift({

        read: function read() {
            this.reset();
        },

        events: ['load', 'resize']

    });

    function sortBy(collection, prop) {
        return collection.sort(function (a,b) { return a[prop] > b[prop]
                ? 1
                : b[prop] > a[prop]
                    ? -1
                    : 0; }
        )
    }

}



if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$7);
}

function plugin$8(UIkit) {

    if (plugin$8.installed) {
        return;
    }

    var mixin = UIkit.mixin;
    var util = UIkit.util;
    var assign = util.assign;
    var clamp = util.clamp;
    var Dimensions = util.Dimensions;
    var getImage = util.getImage;
    var isUndefined = util.isUndefined;
    var scrolledOver = util.scrolledOver;
    var query = util.query;

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    mixin.parallax = {

        props: props.reduce(function (props, prop) {
            props[prop] = 'list';
            return props;
        }, {
            easing: Number,
            media: 'media'
        }),

        defaults: props.reduce(function (defaults, prop) {
            defaults[prop] = undefined;
            return defaults;
        }, {
            easing: 1,
            media: false
        }),

        computed: {

            props: function props$1() {
                var this$1 = this;


                return props.reduce(function (props, prop) {

                    if (isUndefined(this$1.$props[prop])) {
                        return props;
                    }

                    var isColor = prop.match(/color/i),
                        isCssProp = isColor || prop === 'opacity',
                        values = this$1.$props[prop];

                    if (isCssProp) {
                        this$1.$el.css(prop, '');
                    }

                    var start = (!isUndefined(values[1])
                            ? values[0]
                            : prop === 'scale'
                                ? 1
                                : isCssProp
                                    ? this$1.$el.css(prop)
                                    : 0) || 0,
                        end = isUndefined(values[1]) ? values[0] : values[1],
                        unit = ~values.join('').indexOf('%') ? '%' : 'px',
                        diff;

                    if (isColor) {

                        var color = this$1.$el[0].style.color;
                        this$1.$el[0].style.color = start;
                        start = parseColor(this$1.$el.css('color'));
                        this$1.$el[0].style.color = end;
                        end = parseColor(this$1.$el.css('color'));
                        this$1.$el[0].style.color = color;

                    } else {

                        start = parseFloat(start);
                        end = parseFloat(end);
                        diff = Math.abs(start - end);

                    }

                    props[prop] = {start: start, end: end, diff: diff, unit: unit};

                    if (prop.match(/^bg/)) {

                        var attr = "background-position-" + (prop[2]);
                        props[prop].pos = this$1.$el.css(attr, '').css('background-position').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                        if (this$1.covers) {
                            assign(props[prop], {start: 0, end: start <= end ? diff : -diff});
                        }
                    }

                    return props;

                }, {});

            },

            bgProps: function bgProps() {
                var this$1 = this;

                return ['bgx', 'bgy'].filter(function (bg) { return bg in this$1.props; });
            },

            covers: function covers() {
                return this.$el.css('backgroundSize', '').css('backgroundSize') === 'cover';
            }

        },

        disconnected: function disconnected() {
            delete this._image;
        },

        update: [

            {

                read: function read() {
                    var this$1 = this;


                    delete this._computeds.props;

                    this._active = !this.media || window.matchMedia(this.media).matches;

                    if (this._image) {
                        this._image.dimEl = {
                            width: this.$el[0].offsetWidth,
                            height: this.$el[0].offsetHeight
                        };
                    }

                    if (!isUndefined(this._image) || !this.covers || !this.bgProps.length) {
                        return;
                    }

                    var src = this.$el.css('backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                    if (!src) {
                        return;
                    }

                    this._image = false;

                    getImage(src).then(function (img) {
                        this$1._image = {
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        };

                        this$1.$emit();
                    });

                },

                write: function write() {
                    var this$1 = this;


                    if (!this._image) {
                        return;
                    }

                    if (!this._active) {
                        this.$el.css({backgroundSize: '', backgroundRepeat: ''});
                        return;
                    }

                    var image = this._image,
                        dimEl = image.dimEl,
                        dim = Dimensions.cover(image, dimEl);

                    this.bgProps.forEach(function (prop) {

                        var ref = this$1.props[prop];
                        var start = ref.start;
                        var end = ref.end;
                        var pos = ref.pos;
                        var diff = ref.diff;
                        var attr = prop === 'bgy' ? 'height' : 'width',
                            span = dim[attr] - dimEl[attr];

                        if (!pos.match(/%$/)) {
                            return;
                        }

                        if (start >= end) {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                                this$1.props[prop].pos = '0px';
                            } else {
                                pos = -1 * span / 100 * parseFloat(pos);
                                pos = clamp(pos, diff - span, 0);
                                this$1.props[prop].pos = pos + "px";
                            }

                        } else {

                            if (span < diff) {
                                dimEl[attr] = dim[attr] + diff - span;
                            } else if ((span / 100 * parseFloat(pos)) > diff) {
                                return;
                            }

                            this$1.props[prop].pos = "-" + diff + "px";

                        }

                        dim = Dimensions.cover(image, dimEl);
                    });

                    this.$el.css({
                        backgroundSize: ((dim.width) + "px " + (dim.height) + "px"),
                        backgroundRepeat: 'no-repeat'
                    });

                },

                events: ['load', 'resize']

            }

        ],

        methods: {

            reset: function reset() {
                var this$1 = this;

                Object.keys(this.getCss(0)).forEach(function (prop) { return this$1.$el.css(prop, ''); });
            },

            getCss: function getCss(percent) {

                var translated = false, props = this.props;
                return Object.keys(props).reduce(function (css, prop) {

                    var values = props[prop],
                        value = getValue(values, percent);

                    switch (prop) {

                        // transforms
                        case 'x':
                        case 'y':

                            if (translated) {
                                break;
                            }

                            var ref = ['x', 'y'].map(function (dir) { return prop === dir
                                ? value + values.unit
                                : props[dir]
                                    ? getValue(props[dir], percent) + props[dir].unit
                                    : 0; }
                            );
                    var x = ref[0];
                    var y = ref[1];

                            translated = css.transform += " translate3d(" + x + ", " + y + ", 0)";
                            break;
                        case 'rotate':
                            css.transform += " rotate(" + value + "deg)";
                            break;
                        case 'scale':
                            css.transform += " scale(" + value + ")";
                            break;

                        // bg image
                        case 'bgy':
                        case 'bgx':
                            css[("background-position-" + (prop[2]))] = "calc(" + (values.pos) + " + " + (value + values.unit) + ")";
                            break;

                        // color
                        case 'color':
                        case 'backgroundColor':
                        case 'borderColor':
                            css[prop] = "rgba(" + (values.start.map(function (value, i) {
                                    value = value + percent * (values.end[i] - value);
                                    return i === 3 ? parseFloat(value) : parseInt(value, 10);
                                }).join(',')) + ")";
                            break;

                        // CSS Filter
                        case 'blur':
                            css.filter += " blur(" + value + "px)";
                            break;
                        case 'hue':
                            css.filter += " hue-rotate(" + value + "deg)";
                            break;
                        case 'fopacity':
                            css.filter += " opacity(" + value + "%)";
                            break;
                        case 'grayscale':
                        case 'invert':
                        case 'saturate':
                        case 'sepia':
                            css.filter += " " + prop + "(" + value + "%)";
                            break;

                        default:
                            css[prop] = value;
                    }

                    return css;

                }, {transform: '', filter: ''});

            }

        }

    };

    UIkit.component('parallax', {

        mixins: [mixin.parallax],

        props: {
            target: String,
            viewport: Number
        },

        defaults: {
            target: false,
            viewport: 1
        },

        computed: {

            target: function target() {
                return this.$props.target && query(this.$props.target, this.$el) || this.$el;
            }

        },

        disconnected: function disconnected() {
            delete this._prev;
        },

        update: [

            {

                read: function read() {
                    delete this._prev;
                }

            },

            {

                read: function read() {

                    var percent = scrolledOver(this.target) / (this.viewport || 1);
                    this._percent = clamp(percent * (1 - (this.easing - this.easing * percent)));

                },

                write: function write() {

                    if (!this._active) {
                        this.reset();
                        return;
                    }

                    if (this._prev !== this._percent) {
                        this.$el.css(this.getCss(this._percent));
                        this._prev = this._percent;
                    }

                },

                events: ['scroll', 'load', 'resize']
            }

        ]

    });

    function parseColor(color) {
        return color.split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(function (n) { return parseFloat(n); });
    }

    function getValue(prop, percent) {
        return +(!isUndefined(prop.diff)
            ? prop.start + prop.diff * percent * (prop.start < prop.end ? 1 : -1)
            : +prop.end).toFixed(2);
    }

}

if (!true && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin$8);
}

UIkit$2.use(plugin);
UIkit$2.use(plugin$1);
UIkit$2.use(plugin$3);
UIkit$2.use(plugin$4);
UIkit$2.use(plugin$5);
UIkit$2.use(plugin$6);
UIkit$2.use(plugin$7);
UIkit$2.use(plugin$8);

{
    boot(UIkit$2);
}

return UIkit$2;

})));

},{"jquery":2}],25:[function(require,module,exports){
'use strict';

const $ = require('jquery');

const { getClasses } = require('./helpers.js');

const {
	SWITCH_CLASSES,
	FLEX_CHILD_CLASSES,
	FLEX_CLASSES,
	HEADER_CLASSES,
	SWITCH_ITEM_CLASSES,
	DIVIDER_ITEM_CLASSES,
	LABEL_ITEM_CLASSES,
	FONT_SIZE_CLASSES,
} = require('./classes.js');

function checkbox({ setting, name, description, value, change }) {
	//jscs:disable maximumLineLength
	return $(`
		<div class="${[FLEX_CHILD_CLASSES.flex, getClasses(FLEX_CLASSES, ['vertical', 'justifyStart', 'alignStretch', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
			<div class="${[getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
				<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleDefault, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
					${name}
				</h3>
				<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeDefault', 'themeDefault'])} ${value ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
					<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
				</div>
			</div>
			<div class="${[LABEL_ITEM_CLASSES.description, SWITCH_ITEM_CLASSES.note, LABEL_ITEM_CLASSES.modeDefault, FONT_SIZE_CLASSES.primary].join(' ')}" style="flex: 1 1 auto; ${description ? '' : 'display: none;'}">
				${description}
			</div>
			<div class="${DIVIDER_ITEM_CLASSES.divider} ${SWITCH_ITEM_CLASSES.dividerMini}"></div>
		</div>
		`) //jscs:enable maximumLineLength
		.on('click', function () {
			const $this = $(this).find(`.${SWITCH_CLASSES.switch}`);

			if ($this.hasClass(SWITCH_CLASSES.valueChecked)) {
				$this.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
			} else {
				$this.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
			}

			if (typeof change === 'function') {
				change($this.hasClass(SWITCH_CLASSES.valueChecked));
			}
		});
}

module.exports = checkbox;

},{"./classes.js":26,"./helpers.js":29,"jquery":2}],26:[function(require,module,exports){
'use strict';

const N = require('./webpackModuleNumbers.js');

exports.SETTINGS_CLASSES = n(N.SETTINGS_CLASSES);
exports.SWITCH_CLASSES = n(N.SWITCH_CLASSES);
exports.FLEX_CHILD_CLASSES = n(N.FLEX_CHILD_CLASSES);
exports.FLEX_CLASSES = n(N.FLEX_CLASSES);
exports.HEADER_CLASSES = n(N.HEADER_CLASSES);
exports.SWITCH_ITEM_CLASSES = n(N.SWITCH_ITEM_CLASSES);
exports.DIVIDER_ITEM_CLASSES = n(N.DIVIDER_ITEM_CLASSES);
exports.LABEL_ITEM_CLASSES = n(N.LABEL_ITEM_CLASSES);
exports.FONT_SIZE_CLASSES = n(N.FONT_SIZE_CLASSES);
exports.CARD_CLASSES = n(N.CARD_CLASSES);

exports.SIDEBAR_BUTTON_CLASS = 'be-settings-button';
exports.SERVER_CARD_CLASSES = {
	showInPicker: 'be-server-show-in-picker',
	showInPickerSwitch: 'be-server-show-in-picker-switch',
	showInServerList: 'be-server-show-in-server-list',
	showInServerListSwitch: 'be-server-show-in-server-list-switch',
	serverCard: 'be-server-card',
	icon: 'be-server-icon',
};

function n(id) {
	return webpackJsonp([], [], [id]);
}

},{"./webpackModuleNumbers.js":39}],27:[function(require,module,exports){
'use strict';

const N = require('./webpackModuleNumbers.js');

//jscs: disable maximumLineLength
exports.API_BASE = 'https://discordapp.com/api';

/* May be changed with discord updates */
exports.EMOJI_PICKER_PATH = N.EMOJI_PICKER_PATH;
exports.EMOJI_BUTTON_CLASS = n(N.EMOJI_BUTTON_CLASS).emojiButton;
exports.CHANNEL_TEXTAREA_CLASS = n(N.EMOJI_BUTTON_CLASS).channelTextArea;
exports.LOCAL_STORAGE_MODULE = n(N.LOCAL_STORAGE_MODULE); // impl
exports.EMOJI_STORAGE_MODULE = n(N.EMOJI_STORAGE_MODULE).default;
exports.STANDART_EMOJI_CLASS = n(N.EMOJI_STORAGE_MODULE).Emoji;
exports.SERVERS_STORAGE_MODULE = n(N.SERVERS_STORAGE_MODULE); // getGuilds
exports.SERVERS_PERMISSIONS_MODULE = n(N.SERVERS_PERMISSIONS_MODULE); // getGuildPermissions
exports.TRANSLATION_MODULE = n(N.TRANSLATION_MODULE); // Messages
exports.CUSTOM_EMOJI_STORAGE_MODULE = n(N.CUSTOM_EMOJI_STORAGE_MODULE); // getDisambiguatedEmojiContext
exports.TOKEN_KEY = n(1).TOKEN_KEY;
exports.REACTION_EMOJI_CONVERTER = n(N.REACTION_EMOJI_CONVERTER); // toReactionEmoji
/* May be changed with discord updates.END */

exports.EMOJI_ROW_CATEGORY_HEIGHT = 32;

exports.ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap tl-emoji-scroller-wrap"><div class="scroller"></div></div>';

exports.ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">';

exports.ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>'; // max 10 per row

exports.REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/;
exports.CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/;
exports.IS_INBOX_REGEX = /\/channels\/@me\/\d+/;

exports.IS_NUMBER_REGEX = /\d+/;

exports.BETTER_EMOJIS_KEY = 'better-emojis';

/**
 * Default options HTTP Fetch jQuery
 *
 * @type {Object}
 */
exports.defaultFetchOptions = {
	method: 'GET',
	crossDomain: true,
};

function n(id) {
	return webpackJsonp([], [], [id]);
}

},{"./webpackModuleNumbers.js":39}],28:[function(require,module,exports){
'use strict';

const id = Symbol('id');
const name = Symbol('name');
const url = Symbol('url');
const managed = Symbol('managed');
const requireColons = Symbol('requireColons');
const roles = Symbol('roles');

const GLOBAL_EMOJI_MAP = new Map;

const NUMBER_REGEX = /^\d+$/;

class Emoji {
	constructor(
		_id,
		_name,
		_managed = false,
		_requireColons = true,
		_roles = [],
		_url = `https://cdn.discordapp.com/emojis/${_id}.png`
	) {
		this[id] = _id;
		this[name] = _name;
		this[url] = _url;
		this[managed] = _managed;
		this[requireColons] = _requireColons;
		this[roles] = _roles;

		GLOBAL_EMOJI_MAP.set(`${this[id]}`, this);
	}

	get id() {
		return this[id];
	}

	get name() {
		return this[name];
	}

	get url() {
		return this[url];
	}

	get isManaged() {
		return this[managed];
	}

	get require_colons() {
		return this[requireColons];
	}

	get colonsRequired() {
		return this[requireColons];
	}

	get roles() {
		return this[roles];
	}

	get useName() {
		return this.colonsRequired ? `:${this.name}:` : this.name;
	}

	isCustom() {
		return (100 != this[id]) && (1234 != this[id]) && NUMBER_REGEX.test(this[id]);
	}

	static fromRaw(emojiRaw) {
		return new Emoji(
			emojiRaw.id,
			emojiRaw.name,
			emojiRaw.managed,
			emojiRaw.requireColons,
			emojiRaw.roles
		);
	}

	static getById(id) {
		return GLOBAL_EMOJI_MAP.get(`${id}`);
	}
}

module.exports = Emoji;

},{}],29:[function(require,module,exports){
'use strict';

const { defaultFetchOptions } = require('./constants');
const $ = require('jquery');

/**
 * Fetch URL
 *
 * @param {Object} options
 *
 * @return {Promise<mixed>}
 */
exports.fetchURL = function fetchURL(options) {
	return new Promise((resolve, reject) => {
		options = Object.assign({}, defaultFetchOptions, options);

		$.ajax(options).then(resolve).fail(reject);
	});
};

exports.getClasses = function getClasses(from, what) {
	if (!(what instanceof Array))
		return from[what];

	const res = [];

	for (const key of what) {
		if (typeof from[key] === 'undefined') {
			console.warn(from, `doesn't have property ${key}. Check module numbers`);
		}

		res.push(from[key]);
	}

	return res.join(' ');
};

},{"./constants":27,"jquery":2}],30:[function(require,module,exports){
'use strict';

const $ = require('jquery');

const Server = require('./server.js');
const Emoji = require('./emoji.js');
const Picker = require('./picker.js');
const {
	API_BASE,
	TOKEN_KEY,
	TRANSLATION_MODULE,
	EMOJI_STORAGE_MODULE,
	LOCAL_STORAGE_MODULE,
	CUSTOM_EMOJI_STORAGE_MODULE,
	SERVERS_STORAGE_MODULE,
	SERVERS_PERMISSIONS_MODULE,
	EMOJI_ROW_CATEGORY_HEIGHT,
} = require('./constants.js');

function getServers() {
	return new Promise((resolve, reject) => {
		if (!SERVERS_STORAGE_MODULE || !SERVERS_STORAGE_MODULE.getGuilds) {
			reject(new Error('Server storage module is not pointing to server storage'));
		}

		function checkServers() {
			const servers = Object.values(SERVERS_STORAGE_MODULE.getGuilds());
			if (servers.length > 0) {
				resolve(servers);
			}

			setTimeout(checkServers, 1000);
		}

		checkServers();
	});
}

function parseServer({ id, name }) {
	return new Promise((resolve, reject) => {
		if (!SERVERS_PERMISSIONS_MODULE || !SERVERS_PERMISSIONS_MODULE.getGuildPermissions) {
			reject(new Error('Server permission module is not pointing to permission storage'));
		}

		if (!CUSTOM_EMOJI_STORAGE_MODULE ||
			!CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext) {
			reject(new Error('Custom emoji storage module is not pointing to custom emoji storage'));
		}

		const server = new Server(id, name, SERVERS_PERMISSIONS_MODULE.getGuildPermissions(id));
		const emojiContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(id);

		// Eventually, CUSTOM_EMOJI_STORAGE_MODULE filters emojis that we can't use by itself!
		resolve(CUSTOM_EMOJI_STORAGE_MODULE.getGuildEmoji(`${id}`)
			.map(e => emojiContext.getById(e.id))
			.filter(e => !!e)
			.reduce(function (server, emoji) {
				server.addEmoji(Emoji.fromRaw(emoji));
				return server;
			}, server)
		);
	});
}

function parseServers(serversA) {
	return Promise.all(serversA.map(parseServer));
}

function loadStandartEmojis() {
	const commonEmojisServers = [];
	const commonEmojis = [];
	const height = {};

	const translation = TRANSLATION_MODULE.Messages;
	const categories = EMOJI_STORAGE_MODULE.getCategories();
	let $commonEmojisSpansCacheSpan = $('<span></span>');

	for (let category of categories) {
		const tr = translation[`EMOJI_CATEGORY_${category.toUpperCase()}`];
		const fakeServer = new Server(tr, tr, 0x00040000);

		const emojis = EMOJI_STORAGE_MODULE.getByCategory(category);

		for (let emoji of emojis) {
			const emoje = new Emoji(
					emoji.uniqueName,
					emoji.uniqueName,
					emoji.managed,
					emoji.allNamesString.includes(':'),
					[],
					emoji.defaultUrl
				);

			emoje.standartEmoji = emoji;

			fakeServer.addEmoji(emoje);
			commonEmojis.push(emoje);
		}

		commonEmojisServers.push(fakeServer);

		height[category] = EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(emojis.length / 10.0));
		$commonEmojisSpansCacheSpan.append(Picker.buildServerSpan(fakeServer));
	}

	return Promise.resolve({
		categoriesHeight: height,
		emojis: commonEmojis,
		servers: commonEmojisServers,
		spanCache: $commonEmojisSpansCacheSpan.html()
	});
}

function doGetEmojis() {
	const token = LOCAL_STORAGE_MODULE.impl.get(TOKEN_KEY);

	$.ajaxSetup({
		crossDomain: true,
		headers: {
			authorization: token
		}
	});

	return getServers()
		.then(parseServers)
		.then(loadStandartEmojis)
		.catch(e => {
			console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e);
		});
}

module.exports = doGetEmojis;

},{"./constants.js":27,"./emoji.js":28,"./picker.js":34,"./server.js":35,"jquery":2}],31:[function(require,module,exports){
/*! Clusterize.js - v0.17.6 - 2017-03-05
 * http://NeXTs.github.com/Clusterize.js/
 * Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

;
(function (name, definition) {
	if (typeof module !== 'undefined') module.exports = definition();
	else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
	else this[name] = definition();
}('Clusterize', function () {

	'use strict'

	// detect ie9 and lower
	// https://gist.github.com/padolsey/527683#comment-786682
	var ie = (function () {
			for (var v = 3,
					el = document.createElement('b'),
					all = el.all || []; el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
				all[0];
			) {}

			return v > 4 ? v : document.documentMode;
		}()),

		is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;
	var Clusterize = function (data) {
		if (!(this instanceof Clusterize)) {
			return new Clusterize(data);
		}

		var self = this;

		var defaults = {
			rows_in_block: 50,
			blocks_in_cluster: 4,
			tag: null,
			show_no_data_row: true,
			no_data_class: 'clusterize-no-data',
			no_data_text: 'No data',
			keep_parity: true,
			callbacks: {}
		};

		// public parameters
		self.options = {};
		var options = ['rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'callbacks'];
		for (var i = 0, option; option = options[i]; i++) {
			self.options[option] = typeof data[option] !== 'undefined' && data[option] != null ?
				data[option] :
				defaults[option];
		}

		var elems = ['scroll', 'content'];
		for (var i = 0, elem; elem = elems[i]; i++) {
			self[elem + '_elem'] = data[elem + 'Id'] ?
				document.getElementById(data[elem + 'Id']) :
				data[elem + 'Elem'];
			if (!self[elem + '_elem']) {
				throw new Error('Error! Could not find ' + elem + ' element');
			}
		}

		// tabindex forces the browser to keep focus on the scrolling list, fixes #11
		if (!self.content_elem.hasAttribute('tabindex')) {
			self.content_elem.setAttribute('tabindex', 0);
		}

		// private parameters
		var rows = isArray(data.rows) ?
			data.rows :
			self.fetchMarkup(),
			cache = {},
			scroll_top = self.scroll_elem.scrollTop;

		// append initial data
		self.insertToDOM(rows, cache);

		// restore the scroll position
		self.scroll_elem.scrollTop = scroll_top;

		// adding scroll handler
		var last_cluster = false,
			scroll_debounce = 0,
			pointer_events_set = false,
			scrollEv = function () {
				// fixes scrolling issue on Mac #3
				if (is_mac) {
					if (!pointer_events_set) self.content_elem.style.pointerEvents = 'none';
					pointer_events_set = true;
					clearTimeout(scroll_debounce);
					scroll_debounce = setTimeout(function () {
						self.content_elem.style.pointerEvents = 'auto';
						pointer_events_set = false;
					}, 50);
				}

				if (last_cluster != (last_cluster = self.getClusterNum())) {
					self.insertToDOM(rows, cache);
				}

				if (self.options.callbacks.scrollingProgress) {
					self.options.callbacks.scrollingProgress(self.getScrollProgress());
				}
			},

			resize_debounce = 0,
			resizeEv = function () {
				clearTimeout(resize_debounce);
				resize_debounce = setTimeout(self.refresh, 100);
			};

		on('scroll', self.scroll_elem, scrollEv);
		on('resize', window, resizeEv);

		// public methods
		self.destroy = function (clean) {
			off('scroll', self.scroll_elem, scrollEv);
			off('resize', window, resizeEv);
			self.html((clean ? self.generateEmptyRow() : rows).join(''));
		};

		self.refresh = function (force) {
			if (self.getRowsHeight(rows) || force) self.update(rows);
		};

		self.update = function (new_rows) {
			rows = isArray(new_rows) ?
				new_rows :
				[]
			var scroll_top = self.scroll_elem.scrollTop
			// fixes #39
			if (rows.length * self.options.item_height < scroll_top) {
				self.scroll_elem.scrollTop = 0
				last_cluster = 0
			}
			self.insertToDOM(rows, cache)
			self.scroll_elem.scrollTop = scroll_top
		}
		self.clear = function() {
			self.update([])
		}
		self.getRowsAmount = function() {
			return rows.length
		}
		self.getScrollProgress = function() {
			return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0
		}

		var add = function(where, _new_rows) {
			var new_rows = isArray(_new_rows) ?
				_new_rows :
				[]
			if (!new_rows.length) return
			rows = where == 'append' ?
				rows.concat(new_rows) :
				new_rows.concat(rows)
			self.insertToDOM(rows, cache)
		}
		self.append = function(rows) {
			add('append', rows)
		}
		self.prepend = function(rows) {
			add('prepend', rows)
		}
	}

	Clusterize.prototype = {
		constructor: Clusterize,
		// fetch existing markup
		fetchMarkup: function() {
			var rows = [],
				rows_nodes = this.getChildNodes(this.content_elem)
			while (rows_nodes.length) {
				rows.push(rows_nodes.shift().outerHTML)
			}
			return rows
		},
		// get tag name, content tag name, tag height, calc cluster height
		exploreEnvironment: function(rows, cache) {
			var opts = this.options
			opts.content_tag = this.content_elem.tagName.toLowerCase()
			if (!rows.length) return
			if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase()
			if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0])
			if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase()
			this.getRowsHeight(rows)
		},
		getRowsHeight: function(rows) {
			var opts = this.options,
				prev_item_height = opts.item_height
			opts.cluster_height = 0
			if (!rows.length) return
			var nodes = this.content_elem.children
			var node = nodes[Math.floor(nodes.length / 2)]
			opts.item_height = node.offsetHeight
			// consider table's border-spacing
			if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse') {
				opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0
			}
			// consider margins (and margins collapsing)
			if (opts.tag != 'tr') {
				var marginTop = parseInt(getStyle('marginTop', node), 10) || 0
				var marginBottom = parseInt(getStyle('marginBottom', node), 10) || 0
				opts.item_height += Math.max(marginTop, marginBottom)
			}
			opts.block_height = opts.item_height * opts.rows_in_block
			opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block
			opts.cluster_height = opts.blocks_in_cluster * opts.block_height
			return prev_item_height != opts.item_height
		},
		// get current cluster number
		getClusterNum: function() {
			this.options.scroll_top = this.scroll_elem.scrollTop
			return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0
		},
		// generate empty row if no data provided
		generateEmptyRow: function() {
			var opts = this.options
			if (!opts.tag || !opts.show_no_data_row) return []
			var empty_row = document.createElement(opts.tag),
				no_data_content = document.createTextNode(opts.no_data_text),
				td
			empty_row.className = opts.no_data_class
			if (opts.tag == 'tr') {
				td = document.createElement('td')
				// fixes #53
				td.colSpan = 100
				td.appendChild(no_data_content)
			}
			empty_row.appendChild(td || no_data_content)
			return [empty_row.outerHTML]
		},
		// generate cluster for current scroll position
		generate: function(rows, cluster_num) {
			var opts = this.options,
				rows_len = rows.length
			if (rows_len < opts.rows_in_block) {
				return {
					top_offset: 0,
					bottom_offset: 0,
					rows_above: 0,
					rows: rows_len ? rows : this.generateEmptyRow()
				}
			}
			var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0),
				items_end = items_start + opts.rows_in_cluster,
				top_offset = Math.max(items_start * opts.item_height, 0),
				bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0),
				this_cluster_rows = [],
				rows_above = items_start
			if (top_offset < 1) {
				rows_above++
			}
			for (var i = items_start; i < items_end; i++) {
				rows[i] && this_cluster_rows.push(rows[i])
			}
			return {
				top_offset: top_offset,
				bottom_offset: bottom_offset,
				rows_above: rows_above,
				rows: this_cluster_rows
			}
		},
		renderExtraTag: function(class_name, height) {
			var tag = document.createElement(this.options.tag),
				clusterize_prefix = 'clusterize-'
			tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ')
			height && (tag.style.height = height + 'px')
			return tag.outerHTML
		},
		// if necessary verify data changed and insert to DOM
		insertToDOM: function(rows, cache) {
			// explore row's height
			if (!this.options.cluster_height) {
				this.exploreEnvironment(rows, cache)
			}
			var data = this.generate(rows, this.getClusterNum()),
				this_cluster_rows = data.rows.join(''),
				this_cluster_content_changed = this.checkChanges('data', this_cluster_rows, cache),
				top_offset_changed = this.checkChanges('top', data.top_offset, cache),
				only_bottom_offset_changed = this.checkChanges('bottom', data.bottom_offset, cache),
				callbacks = this.options.callbacks,
				layout = []

			if (this_cluster_content_changed || top_offset_changed) {
				if (data.top_offset) {
					this.options.keep_parity && layout.push(this.renderExtraTag('keep-parity'))
					layout.push(this.renderExtraTag('top-space', data.top_offset))
				}
				layout.push(this_cluster_rows)
				data.bottom_offset && layout.push(this.renderExtraTag('bottom-space', data.bottom_offset))
				callbacks.clusterWillChange && callbacks.clusterWillChange()
				this.html(layout.join(''))
				this.options.content_tag == 'ol' && this.content_elem.setAttribute('start', data.rows_above)
				callbacks.clusterChanged && callbacks.clusterChanged()
			} else if (only_bottom_offset_changed) {
				this.content_elem.lastChild.style.height = data.bottom_offset + 'px'
			}
		},
		// unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
		html: function(data) {
			var content_elem = this.content_elem
			if (ie && ie <= 9 && this.options.tag == 'tr') {
				var div = document.createElement('div'),
					last
				div.innerHTML = '<table><tbody>' + data + '</tbody></table>'
				while ((last = content_elem.lastChild)) {
					content_elem.removeChild(last)
				}
				var rows_nodes = this.getChildNodes(div.firstChild.firstChild)
				while (rows_nodes.length) {
					content_elem.appendChild(rows_nodes.shift())
				}
			} else {
				content_elem.innerHTML = data
			}
		},
		getChildNodes: function(tag) {
			var child_nodes = tag.children,
				nodes = []
			for (var i = 0, ii = child_nodes.length; i < ii; i++) {
				nodes.push(child_nodes[i])
			}
			return nodes
		},
		checkChanges: function(type, value, cache) {
			var changed = value != cache[type]
			cache[type] = value
			return changed
		}
	}

	// support functions
	function on(evt, element, fnc) {
		return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent('on' + evt, fnc)
	}

	function off(evt, element, fnc) {
		return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent('on' + evt, fnc)
	}

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]'
	}

	function getStyle(prop, elem) {
		return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop]
	}

	return Clusterize
}))

},{}],32:[function(require,module,exports){
'use strict';

window.better_emojis = { loaded: true };

const $ = require('jquery');

const Picker = require('./picker.js');
const SettingsPanel = require('./settings-panel.js');
const Settings = require('./settings.js');
const Observer = require('./observer.js').ChildAddRemoveObserver;
const {
	EMOJI_PICKER_PATH,
	EMOJI_BUTTON_CLASS,
} = require('./constants.js');

const initEmojis = require('./initializer.js');

function attachPickerObserver() {
	if (window.better_emojis.pickerObserver) {
		window.better_emojis.pickerObserver.disconnect();
	} else {
		window.better_emojis.pickerObserver = new Observer(null,
			() => {
				if (!Settings.get('enabled')) {
					return;
				}

				let isPickerOpened = !!$(EMOJI_PICKER_PATH).find('.emoji-picker').length;
				let isInlineOrTextareaPicker =
					$(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open') ||
					!!$('.btn-reaction.popout-open').length;
				if (isPickerOpened && isInlineOrTextareaPicker) {
					Picker.show();
				}
			},

			() => {
				if (window.better_emojis.current_cluster) {
					window.better_emojis.current_cluster.destroy();
				}
			}
		);
	}

	window.better_emojis.pickerObserver.reattach = attachPickerObserver;
	window.better_emojis.pickerObserver.observe($(EMOJI_PICKER_PATH)[0]);
}

function attachSettingsObserver() {
	if (window.better_emojis.settingsObserver) {
		window.better_emojis.settingsObserver.disconnect();
	} else {
		window.better_emojis.settingsObserver = new Observer(null,
			(mutation) => {
				setTimeout(() => {
					SettingsPanel.inject(mutation.addedNodes[0]);
				}, 30);
			}
		);
	}

	window.better_emojis.settingsObserver.reattach = attachPickerObserver;
	window.better_emojis.settingsObserver.observe($('.layers')[0]);
}

initEmojis().then((emojiCache) => {
	Picker.handleServerChange();
	Picker.setCommonEmojiSpanCache(emojiCache);
	setTimeout(() => {
		attachPickerObserver();
		attachSettingsObserver();
		SettingsPanel.updateHiddenServers();
		console.log('Better Emojis initialized');
		window.better_emojis.initialized = true;
	}, 2000);
});

},{"./constants.js":27,"./initializer.js":30,"./observer.js":33,"./picker.js":34,"./settings-panel.js":37,"./settings.js":38,"jquery":2}],33:[function(require,module,exports){
'use strict';

const observer = Symbol('observer');
const addListeners = Symbol('addListeners');
const removeListeners = Symbol('removeListeners');

class ChildAddRemoveObserver {
	constructor(target = null, addListener = null, removeListener = null) {
		this[observer] = new MutationObserver(([mutation]) => {
			if (mutation.type !== 'childList') {
				return;
			}

			if (mutation.addedNodes.length > 0) {
				for (const listener of this[addListeners]) {
					listener(mutation);
				}
			}

			if (mutation.removedNodes.length > 0) {
				for (const listener of this[removeListeners]) {
					listener(mutation);
				}
			}
		});

		this[addListeners] = [];
		this[removeListeners] = [];

		if (target) {
			this.observe(target);
		}

		this.add(addListener).remove(removeListener);
	}

	observe(target) {
		if (!target || !(target instanceof Node)) {
			throw new TypeError('Target must be Node!');
		}

		this[observer].observe(target, {
			childList: true
		});

		return this;
	}

	add(listener) {
		return this.on('add', listener);
	}

	remove(listener) {
		return this.on('remove', listener);
	}

	on(evt, listener) {
		if (!listener) {
			return;
		}

		if (typeof listener !== 'function') {
			throw new TypeError('Listener must be function');
		}

		switch (evt) {
			case 'add':
				this[addListeners].push(listener);

				break;
			case 'remove':
				this[removeListeners].push(listener);

				break;
		}

		return this;
	}

	off(evt) {
		switch (evt) {
			case 'add':
				this[addListeners] = [];

				break;
			case 'remove':
				this[removeListeners] = [];

				break;
		}

		return this;
	}

	disconnect() {
		this[observer].disconnect();

		return this;
	}
}

module.exports.ChildAddRemoveObserver = ChildAddRemoveObserver;

},{}],34:[function(require,module,exports){
'use strict';

const JsSearch = require('js-search');
const $ = require('jquery');
const Clusterize = require('./lib/clusterize.js');
const Emoji = require('./emoji.js');
const Server = require('./server.js');
const Settings = require('./settings.js');

const { fetchURL } = require('./helpers');
const {
	API_BASE,
	IS_NUMBER_REGEX,
	EMOJI_PICKER_PATH,
	ELEMENT_SCROLLER_WRAP,
	REACTION_POPOUT_REGEX,
	ELEMENT_SERVER_EMOJI_LIST,
	ELEMENT_SERVER_EMOJI_LIST_ROW,
	CURRENT_SELECTED_CHANNEL_REGEX,
	ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY,
	EMOJI_BUTTON_CLASS,
	CHANNEL_TEXTAREA_CLASS,
	CUSTOM_EMOJI_STORAGE_MODULE,
	TRANSLATION_MODULE,
	STANDART_EMOJI_CLASS,
	EMOJI_ROW_CATEGORY_HEIGHT,
	EMOJI_STORAGE_MODULE,
	REACTION_EMOJI_CONVERTER,
} = require('./constants.js');

let commonEmojisSpansCache = '';
let categoriesHeight = {};
let commonEmojis = [];

let SCROLLER_WRAP = null;
let SCROLLER_WRAP_OLD = null;
let SEARCH_INPUT = null;

function buildScrollerWrap() {
	return new Promise((resolve, reject) => {
		const $wrap = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP);
		const $scr = $wrap.find('.scroller');
		const currentServer = Server.getCurrentServer();
		const serverContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(currentServer.id);
		let customEmojisHeight = 0;

		$scr.html(' ').off('click').off('mouseenter').off('mouseleave');

		if (Settings.get('picker.frequently-used.enabled', true)) {
			const freqUsed = serverContext.getFrequentlyUsedEmojis()
				.map(e => e instanceof STANDART_EMOJI_CLASS ? Emoji.getById(e.uniqueName) : Emoji.getById(e.id))
				.filter(e => !!e);

			if (freqUsed.length > 0) {
				const span = buildServerSpan({
					name: TRANSLATION_MODULE.Messages.EMOJI_CATEGORY_RECENT,
				}, freqUsed);

				customEmojisHeight += EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(freqUsed.length / 10.0));
				$scr.append(span);
			}
		}

		// Append all current server emojis, if any
		if (currentServer.emojis.length > 0) {
			const emojis = currentServer.availableEmojis();

			customEmojisHeight += EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(emojis.length / 10.0));
			$scr.append(buildServerSpan(currentServer, emojis));
		}

		// Append all other server shared emojis
		if (currentServer.canUseExternalEmojis) {
			for (const server of Server.getAllServers()) {
				let availableEmojis = server.availableEmojis();

				if (!server.isCurrent()
					&& server.isShownInPicker()
					&& IS_NUMBER_REGEX.test(server.id)
					&& availableEmojis.length > 0
				) {
					customEmojisHeight +=
						EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(availableEmojis.length / 10.0));
					$scr.append(buildServerSpan(server, availableEmojis));
				}
			}
		}

		categoriesHeight.custom = customEmojisHeight;
		replaceCategories();

		// Append common emojis
		if (commonEmojisSpansCache) {
			$scr.append(commonEmojisSpansCache);
		}

		window.better_emojis.current_cluster = new Clusterize({
			rows_in_block: 10,
			blocks_in_cluster: 3,
			scrollElem: $scr[0],
			contentElem: $scr[0]
		});

		const emojiClickHandler = $(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open')
			? putEmojiInTextarea
			: addCurrentMessageReaction;

		$scr
		.on('click', '.emoji-item', e => {
			console.log('Selected emoji - ', Emoji.getById($(e.target).attr('data-emoji')));
		})
		.on('click', '.emoji-item', e => {
			const emoji = Emoji.getById($(e.target).attr('data-emoji'));

			if (emoji.isCustom()) {
				emojiClickHandler(serverContext.getById($(e.target).attr('data-emoji')));
			} else {
				emojiClickHandler(emoji);
			}
		})
		.on('mouseenter', '.emoji-item', e => {
			$(e.target).addClass('selected');

			if (SEARCH_INPUT) {
				SEARCH_INPUT.attr('placeholder', Emoji.getById($(e.target).attr('data-emoji')).useName);
			}
		})
		.on('mouseleave', '.emoji-item', e => {
			$(e.target).removeClass('selected');

			if (SEARCH_INPUT) {
				SEARCH_INPUT.attr('placeholder', 'Find the perfect emoji');
			}
		});

		resolve($wrap);
	});
}

function buildServerSpan(server, availableEmojis) {
	const $emojiList = $(ELEMENT_SERVER_EMOJI_LIST);
	const emojis = availableEmojis || server.availableEmojis();

	$emojiList.find('.category').html(server.name);
	$emojiList.append(buildEmojisRows(emojis));

	return $emojiList.html();
}

function buildEmojisRows(eL) {
	const $emojiList = $('<span class="tl-emoji-list"></span>');
	let $emojiListRow = $(ELEMENT_SERVER_EMOJI_LIST_ROW);

	const emojiElement = function (emoji) {
		return $(ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY)
			.css('background-image', `url("${emoji.url}")`)
			.attr('data-emoji', `${emoji.id}`);
	};

	for (let i = 0; i < eL.length; i++) {
		if ((i !== 0) && (i % 10 === 0)) {
			$emojiList.append($emojiListRow);
			$emojiListRow = $(ELEMENT_SERVER_EMOJI_LIST_ROW);
		}

		$emojiListRow.append(emojiElement(eL[i]));
	}

	$emojiList.append($emojiListRow);

	return $emojiList.html();
}

function putEmojiInTextarea(emoji) {
	const $textarea = $(`.${CHANNEL_TEXTAREA_CLASS} >> textarea`).get(0);
	const reactProps = findReact($textarea);
	const emojiContent = emoji.require_colons ? `:${emoji.name}:` : emoji.name;
	$textarea.value
		= $textarea.textContent
		= reactProps.memoizedProps.value
		= ($textarea.value += emojiContent);
}

function findReact(dom) {
	for (const key in dom) {
		if (key.startsWith('__reactInternalInstance$')) {
			return dom[key];
		}
	}

	return null;
};

function getSelectedMessageId() {
	try {
		return REACTION_POPOUT_REGEX.exec(
			findReact($('.btn-reaction.popout-open').closest('.message').find('.message-text').get(0))
			.memoizedProps.children
			.filter(c => (
				Object.keys(c.props).includes('subscribeTo')
			))[0].props.subscribeTo
		)[1];
	} catch (e) {
		return null;
	}
}

function getCurrentSelectedChannel() {
	return CURRENT_SELECTED_CHANNEL_REGEX.exec(window.location.pathname)[1];
}

function addCurrentMessageReaction(emoji) {
	return addMessageReaction(getCurrentSelectedChannel(), getSelectedMessageId(), emoji);
}

function addMessageReaction(channel, message, emoji) {
	return fetchURL({
		url: `${API_BASE}/channels/${channel}/messages/${message}/reactions/${emojiToReactionCode(emoji)}/@me`, //jscs:disable maximumLineLength
		method: 'PUT',
		dataType: 'json',
	});
}

function emojiToReactionCode(emoji) {
	if (emoji.standartEmoji) {
		return REACTION_EMOJI_CONVERTER.toReactionEmoji(emoji.standartEmoji).name;
	}

	return `:${emoji.name}:${emoji.id}`;
}

function showScroller(isDefault) {
	const $wrap = $(EMOJI_PICKER_PATH).find('.scroller-wrap, .no-search-results');

	if (isDefault) {
		$wrap.filter('.tl-emoji-scroller-wrap').hide();
		$wrap.not('.tl-emoji-scroller-wrap').show();
	} else {
		$wrap.filter('.tl-emoji-scroller-wrap').show();
		$wrap.not('.tl-emoji-scroller-wrap').hide();
	}
}

function showOriginalScroller() {
	showScroller(true);
}

function showCustomScroller() {
	showScroller(false);
}

function replaceScroller() {
	const $loading = $(`
		<div class="scroller-wrap">
			<div class="scroller">
				<div class="be-emoji-loading-spinner"></div>
			</div>
		</div>
	`);

	SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find('.scroller-wrap').hide().before($loading);

	return buildScrollerWrap().then((wrap) => {
		SCROLLER_WRAP = wrap;
		SCROLLER_WRAP_OLD.before(SCROLLER_WRAP);
		$loading.remove();
	});
}

let searchIndex = null;

function replaceSearchInput() {
	// jscs:disable requireDollarBeforejQueryAssignment
	SEARCH_INPUT = $(` 
		<input type="text" placeholder="${TRANSLATION_MODULE.Messages.SEARCH_FOR_EMOJI}" value="">
	`); // jscs:enable requireDollarBeforejQueryAssignment
	$(EMOJI_PICKER_PATH).find('input').hide().before(SEARCH_INPUT);

	const $searchScrollerWrap = $(`
		<div class="scroller-wrap">
			<div class="scroller"></div>
			<div class="sad-discord"></div>
			<div class="no-search-results-text">${TRANSLATION_MODULE.Messages.NO_EMOJI_SEARCH_RESULTS}</div>
		</div>
	`).hide();
	SCROLLER_WRAP.before($searchScrollerWrap);

	const $searchScroller = $searchScrollerWrap.find('.scroller');
	const $noResults = $searchScrollerWrap.find('.sad-discord, .no-search-results-text').hide();

	const cluster = new Clusterize({
		rows_in_block: 10,
		blocks_in_cluster: 3,
		scrollElem: $searchScroller[0],
		contentElem: $searchScroller[0],
	});

	const serverContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(Server.getCurrentServer().id);
	const emojiClickHandler = $(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open')
		? putEmojiInTextarea
		: addCurrentMessageReaction;

	$searchScroller
		.on('click', '.emoji-item', e => {
			console.log('Selected emoji - ', Emoji.getById($(e.target).attr('data-emoji')));
		})
		.on('click', '.emoji-item', e => {
			const emoji = Emoji.getById($(e.target).attr('data-emoji'));

			if (emoji.isCustom()) {
				emojiClickHandler(serverContext.getById($(e.target).attr('data-emoji')));
			} else {
				emojiClickHandler(emoji);
			}
		})
		.on('mouseenter', '.emoji-item', e => {
			$(e.target).addClass('selected');

			if (SEARCH_INPUT) {
				SEARCH_INPUT.attr('placeholder', Emoji.getById($(e.target).attr('data-emoji')).useName);
			}
		})
		.on('mouseleave', '.emoji-item', e => {
			$(e.target).removeClass('selected');

			if (SEARCH_INPUT) {
				SEARCH_INPUT.attr('placeholder', 'Find the perfect emoji');
			}
		});

	SEARCH_INPUT.on('input', () => {
		const val = SEARCH_INPUT.val();
		if (!val) {
			$searchScrollerWrap.hide();
			SCROLLER_WRAP.show();
			return;
		}

		$searchScrollerWrap.show();
		SCROLLER_WRAP.hide();
		$searchScroller
			.html('<div class="be-emoji-loading-spinner"></div>')
			.show();

		filterEmojis(val, cluster)
		.then((rowCount) => {
			if (rowCount < 1) {
				$searchScroller.hide();
				$searchScrollerWrap.addClass('no-search-results');
				$noResults.show();
			} else {
				$searchScroller.show();
				$searchScrollerWrap.removeClass('no-search-results');
				$noResults.hide();
			}
		});
	});
}

function filterEmojis(query, cluster) {
	return new Promise((resolve, reject)=> {
		if (!searchIndex) {
			reject(new Error('searchIndex is not initialized'));
		}

		const result = searchIndex.search(query);
		const $rows = $('<span/>').append(buildEmojisRows(result)).children();
		const rows = $rows.toArray().map(e => e.outerHTML);

		if (rows[0] === '<div class="row"></div>') {
			resolve(0);
			return;
		}

		cluster.clear();
		cluster.update(rows);

		resolve(rows.length);
	});
}

function replaceCategories() {
	//Hide original categories
	const $picker = $(EMOJI_PICKER_PATH);
	const $oldCategories = $picker.find('.categories').hide();
	const $input = $picker.find('input');

	const $categoriesElement = $(`
		<div class="categories be-emoji-categories"></div>
	`);

	const categories = EMOJI_STORAGE_MODULE.getCategories();
	categories.unshift('custom');
	const scrollsTop = {};
	let fromTop = 0;

	function categoryItem(category) {
		return $(`<div class="item ${category}"></div>`)
			.click(function () {
				const $this = $(this);

				$categoriesElement.children().removeClass('selected');
				$this.addClass('selected');
				showCustomScroller();
				$input.val('');

				SCROLLER_WRAP.find('.scroller')
					.stop()
					.animate({ scrollTop: scrollsTop[category] }, 300, 'swing');
			});
	}

	for (const category of categories) {
		scrollsTop[category] = fromTop;
		fromTop += categoriesHeight[category];

		$categoriesElement.append(categoryItem(category));
	}

	$categoriesElement.find('.custom').addClass('selected');

	// Placeholder for future
	$categoriesElement.append($('<div class="item"></div>'));

	$oldCategories.before($categoriesElement);
}

function buildSearchIndex() {
	return new Promise((resolve, reject) => {
		const server = Server.getCurrentServer();
		const emojis = server.possibleEmojis();
		const search = new JsSearch.Search('id');

		search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
		search.addIndex('name');
		search.addDocuments(emojis);
		search.addDocuments(commonEmojis);

		resolve(search);
	});
}

function addCustomScrollerParts() {
	setTimeout(() => {
		setTimeout(showCustomScroller, 10);

		replaceScroller()
			.then(replaceSearchInput);
	}, 20);
}

function handleServerChange() {
	$('.guilds').on('click', '.guild', function () {
		buildSearchIndex().then((idx) => {
			searchIndex = idx;
		});
	});

	buildSearchIndex().then((idx) => {
		searchIndex = idx;
	});
}

exports.buildServerSpan = buildServerSpan;
exports.show = addCustomScrollerParts;
exports.handleServerChange = handleServerChange;

exports.setCommonEmojiSpanCache = function ({ spanCache, categoriesHeight: categoriesHeightArg, emojis }) {
	commonEmojisSpansCache = spanCache;
	categoriesHeight = categoriesHeightArg;
	commonEmojis = emojis;
};

},{"./constants.js":27,"./emoji.js":28,"./helpers":29,"./lib/clusterize.js":31,"./server.js":35,"./settings.js":38,"jquery":2,"js-search":21}],35:[function(require,module,exports){
'use strict';

const Emoji = require('./emoji.js');
const Settings = require('./settings.js');

const GLOBAL_SERVER_LIST = [];

const id = Symbol('id');
const name = Symbol('name');
const emojis = Symbol('emojis');
const sharedEmojis = Symbol('sharedEmojis');
const permissions = Symbol('permissions');
const serverRegex = Symbol('serverRegex');

class Server {
	constructor(_id, _name, _permissions, _emojis = [], _sharedEmojis = []) {
		if (GLOBAL_SERVER_LIST.some(s => s.id === _id)) {
			throw new Error('Cannot have multiple servers with same id!');
		}

		this[id] = _id;
		this[name] = _name;
		this[permissions] = _permissions;
		this[emojis] = _emojis;
		this[sharedEmojis] = _sharedEmojis;
		this[serverRegex] = new RegExp(`.*/${_id.toString()}/\\d*`);

		GLOBAL_SERVER_LIST.push(this);
	}

	addEmoji(emoji) {
		if (!(emoji instanceof Emoji)) {
			throw new TypeError('Only objects of class Emoji can be added using this method');
		}

		if (this[emojis].some(e => e.id === emoji.id)) {
			return;
		}

		this[emojis].push(emoji);

		if (emoji.isManaged) {
			this[sharedEmojis].push(emoji);
		}

		return this;
	}

	get canUseExternalEmojis() {
		return this[permissions] & 0x00040000;
	}

	get id() {
		return this[id];
	}

	get name() {
		return this[name];
	}

	get permissions() {
		return this[permissions];
	}

	get emojis() {
		return this[emojis];
	}

	get sharedEmojis() {
		return this[sharedEmojis];
	}

	isGuild() {
		return /\d+/.test(this[id]);
	}

	isCurrent() {
		return this[serverRegex].test(window.location);
	}

	availableEmojis() {
		const emojiList = this.isCurrent() ? this.emojis : this.sharedEmojis;
		return emojiList.filter(e => Settings.get(`picker.emoji.enabled.${e.id}`, true));
	}

	possibleEmojis() {
		const list = [...this.emojis];

		for (const server of GLOBAL_SERVER_LIST) {
			if (server.id === this.id) {
				continue;
			}

			list.push(...server.sharedEmojis);
		}

		return list;
	}

	isShownInList() {
		return Settings.get(`serverlist.show.${this[id]}`, true);
	}

	isShownInPicker() {
		return Settings.get(`picker.server.show.${this[id]}`, true);
	}

	static getCurrentServer() {
		return GLOBAL_SERVER_LIST.reduce((p, c) => (p || (c.isCurrent() && c)), false) || null;
	}

	static getAllServersUnordered() {
		return GLOBAL_SERVER_LIST;
	}

	static getAllServers() {
		if (Settings.get('picker.serversorder', false)) {
			const order = Settings.get('picker.serversorder');
			return GLOBAL_SERVER_LIST.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
		} else {
			const servers = [];
			servers.push(...GLOBAL_SERVER_LIST);
			Settings.set('picker.serversorder', servers.map(c => c.id));
			return servers;
		}
	}

	static getById(id) {
		return GLOBAL_SERVER_LIST.reduce((p, c) => (p || ((c.id == id) && c)), false) || null;
	}
}

// Store "inbox" emulation of server
new Server('@me', '@me', 0x00040000); // eslint-disable-line no-new

module.exports = Server;

},{"./emoji.js":28,"./settings.js":38}],36:[function(require,module,exports){
'use strict';

const $ = require('jquery');
const UIkit = require('uikit');

const { getClasses } = require('./helpers.js');

const {
	SWITCH_CLASSES,
	FLEX_CHILD_CLASSES,
	FLEX_CLASSES,
	HEADER_CLASSES,
	SWITCH_ITEM_CLASSES,
	DIVIDER_ITEM_CLASSES,
	CARD_CLASSES,
	SERVER_CARD_CLASSES,
} = require('./classes.js');

const Settings = require('./settings.js');

function serverCard(server, iconStorage, onServerChangeState) {
	//jscs:disable maximumLineLength
	const $card = $(`
		<div class="be-accordion-item ${CARD_CLASSES.cardPrimary} ${SERVER_CARD_CLASSES.serverCard}" id="server-card-${server.id}" style="padding: 7px">
			<div class="be-accordion-title ${getClasses(FLEX_CLASSES, ['horizontal', 'flex', 'justifyStart', 'alignStretch', 'noWrap'])}">
				<div class="${FLEX_CHILD_CLASSES.flexChild}" style="padding-right: 15px;">
					<img class="${SERVER_CARD_CLASSES.icon}" src="${iconStorage[server.id]}"/>
				</div>
				<div class="${FLEX_CHILD_CLASSES.flexChild} ${FLEX_CLASSES.vertical}" style="width: 60%">
					<h5 class="${FLEX_CHILD_CLASSES.flexChild} ${HEADER_CLASSES.h5} margin-bottom-4">${server.name}</h5>
					<h5 class="${FLEX_CHILD_CLASSES.flexChild} ${HEADER_CLASSES.h5} margin-bottom-4">Emojis: ${server.emojis.length}, Global: ${server.sharedEmojis.length}</h5>	
				</div>
				<div class="${FLEX_CHILD_CLASSES.flexChild} ${FLEX_CLASSES.vertical}" style="flex: 1 1 auto;">
					<div class="margin-bottom-4 ${[SERVER_CARD_CLASSES.showInPicker, getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleMini, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Picker
						</h3>
						<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeMini', 'themeDefault'])} ${server.isShownInPicker() ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild} ${SERVER_CARD_CLASSES.showInPickerSwitch}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
						</div>
					</div>
					<div class="margin-bottom-4 ${[SERVER_CARD_CLASSES.showInServerList, getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleMini, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Server list
						</h3>
						<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeMini', 'themeDefault'])} ${SERVER_CARD_CLASSES.showInServerListSwitch} ${server.isShownInList() ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
						</div>
					</div>
				</div>
			</div>
			<div class="be-accordion-data">
				<div class="${DIVIDER_ITEM_CLASSES.divider}" style="margin-top: 4px; margin-bottom: 7px;"></div>
				<div class="container">
					<div class="be-emoji-container-wrapper">
						<h3 class="container-title ${getClasses(HEADER_CLASSES, ['h3', 'defaultColor'])}">
							Enabled Emojis
						</h3>
						<div class="${CARD_CLASSES.cardPrimary} be-emoji-container enabled-emoji-container"></div>
					</div>
					<div class="be-emoji-container-wrapper" style="padding-left:5px">
						<h3 class="container-title ${getClasses(HEADER_CLASSES, ['h3', 'defaultColor'])}">
							Disabled Emojis
						</h3>
						<div class="${CARD_CLASSES.cardPrimary} be-emoji-container disabled-emoji-container"></div>
					</div>
				</div>
			</div>
		</div>
	`); //jscs:enable maximumLineLength

	const $enabledEmojis = $card.find('.enabled-emoji-container');
	const $disabledEmojis = $card.find('.disabled-emoji-container');
	const $accordionContent = $card.find('.be-accordion-data');
	const $showModeButton = $('#be-emoji-show-mode');

	function emojiItem(emoji) {
		return $(`<div class="be-emoji-item 
				${emoji.isManaged ? 'be-emoji-item-bbtv' :
					$showModeButton.hasClass('be-button-enabled') ?
						'be-emoji-item-deafult be-emoji-faded' :
						'be-emoji-item-deafult'
				}"></div>`)
			.css('background-image', `url("${emoji.url}")`)
			.data('emoji-id', `${emoji.id}`)
			.attr('title', `${emoji.useName}`)
			.dblclick(function () {
				const $this = $(this).detach();

				if (Settings.get(`picker.emoji.enabled.${emoji.id}`, true)) {
					$disabledEmojis.append($this);
				} else {
					$enabledEmojis.append($this);
				}

				handleChange();
			});
	}

	function handleChange() {
		$enabledEmojis
			.children()
			.map((i, c) => Settings.set(`picker.emoji.enabled.${$(c).data('emoji-id')}`, true));
		$disabledEmojis
			.children()
			.map((i, c) => Settings.set(`picker.emoji.enabled.${$(c).data('emoji-id')}`, false));
	}

	let enabledEmojisSortable;
	let disabledEmojisSortable;
	let emojiTooltip;

	$enabledEmojis.on('change', handleChange);
	$disabledEmojis.on('change', handleChange);

	$card.data('server-id', server.id);

	$card.on('accordion.close', () => {
		handleChange();
		$enabledEmojis.html('');
		$disabledEmojis.html('');
		enabledEmojisSortable.$destroy();
		disabledEmojisSortable.$destroy();
		emojiTooltip.$destroy();
	});

	$card.on('accordion.open', () => {
		for (const emoji of server.emojis) {
			if (Settings.get(`picker.emoji.enabled.${emoji.id}`, true)) {
				$enabledEmojis.append(emojiItem(emoji));
			} else {
				$disabledEmojis.append(emojiItem(emoji));
			}
		}

		//FIXME sortable shaking while movening element
		enabledEmojisSortable = UIkit.sortable($enabledEmojis, {
			group: `emoji-sortable-${server.id}`,
			animation: 150,
			'cls-base': 'be-emoji-container',
			'cls-item': 'be-emoji-item',
			'cls-empty': 'be-empty-sortable',
		});

		disabledEmojisSortable = UIkit.sortable($disabledEmojis, {
			group: `emoji-sortable-${server.id}`,
			animation: 150,
			'cls-base': 'be-emoji-container',
			'cls-item': 'be-emoji-item',
			'cls-empty': 'be-empty-sortable',
		});

		emojiTooltip = UIkit.tooltip($accordionContent.find('.be-emoji-item'));
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInServerList}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInServerListSwitch}`);
		if ($switch.hasClass(SWITCH_CLASSES.valueChecked)) {
			$switch.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
		} else {
			$switch.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
		}

		const isShown = $switch.hasClass(SWITCH_CLASSES.valueChecked);

		Settings.set(`serverlist.show.${server.id}`, isShown);

		onServerChangeState && onServerChangeState(server, isShown);
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInPicker}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInPickerSwitch}`);
		if ($switch.hasClass(SWITCH_CLASSES.valueChecked)) {
			$switch.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
		} else {
			$switch.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
		}

		Settings.set(`picker.server.show.${server.id}`, $switch.hasClass(SWITCH_CLASSES.valueChecked));
	});

	return $card;
}

module.exports = serverCard;

},{"./classes.js":26,"./helpers.js":29,"./settings.js":38,"jquery":2,"uikit":24}],37:[function(require,module,exports){
'use strict';

const $ = require('jquery');
const UIkit = require('uikit');

const { getClasses } = require('./helpers.js');

const {
	SETTINGS_CLASSES,
	SIDEBAR_BUTTON_CLASS,
	HEADER_CLASSES,
	SERVER_CARD_CLASSES,
} = require('./classes.js');

const { TRANSLATION_MODULE } = require('./constants.js');

const Settings = require('./settings.js');
const Server = require('./server.js');

const serverCard = require('./serverCard.js');
const checkbox = require('./checkbox.js');

function buildSidebarEntry() {
	const $entry = $('<span/>');

	const $button = $('<div/>')
		.addClass(SETTINGS_CLASSES.itemDefault)
		.addClass(SIDEBAR_BUTTON_CLASS)
		.html('Better Emojis');

	$button.mousedown(function () {
		const $this = $(this);

		// Make all selected items unselected
		changeClasses(SETTINGS_CLASSES.itemBrandSelected, SETTINGS_CLASSES.itemBrand);
		changeClasses(SETTINGS_CLASSES.itemDefaultSelected, SETTINGS_CLASSES.itemDefault);
		changeClasses(SETTINGS_CLASSES.itemDangerSelected, SETTINGS_CLASSES.itemDanger);

		// Make self selected
		$this.removeClass(SETTINGS_CLASSES.itemDefault).addClass(SETTINGS_CLASSES.itemDefaultSelected);
	});

	$entry.append($button).append($('<div/>').addClass(SETTINGS_CLASSES.separator));

	return { $entry, $button };
}

function changeClasses(from, to, parent = null) {
	const classes = `.${from.split(' ').join('.')}`;
	return (parent == null ? $(classes) : $(parent).find(classes)).removeClass(from).addClass(to);
}

function buildServerCards() {
	const guildsIcons = getServersIcons();

	const $serverSortable = $('<div class="be-server-sortable"></div>');

	const servers = Server.getAllServers();

	for (const server of servers) {
		if (server.isGuild())
			$serverSortable.append(serverCard(server, guildsIcons, updateHiddenServers));
	}

	const serversAccordion = UIkit.accordion($serverSortable, {
		duration: 150,
		targets: '> .be-accordion-item',
		toggle: '> .be-accordion-title',
		content: '> .be-accordion-data',
	});

	UIkit.sortable($serverSortable, {
		animation: 150,
		'cls-item': SERVER_CARD_CLASSES.serverCard,
	});

	$serverSortable.on('start', function (event, sortable, target, dragged) {
		// console.log(arguments);
		if (target.hasClass('uk-open')) {
			serversAccordion.toggle(target, false);
			dragged.css({ height: target.outerHeight() });
		}
	});

	$serverSortable.on('beforeshow', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.open');
	});

	$serverSortable.on('hidden', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.close');
	});

	$serverSortable.on('change', function (event, sortable, target) {
		if (!sortable) {
			return;
		}

		const $children = sortable.$el.children();
		const out = [];
		out.length = $children.length;

		for (let i = 0; i < $children.length; i++) {
			out[i] = $($children[i]).data('server-id');
		}

		Settings.set('picker.serversorder', out);
	});

	return $serverSortable;
}

function buildContentColumn() {
	const $column = $(`
	<div class="content-column default"><div>
		<div class="better-emojis-settings">
			<h2 class="${getClasses(HEADER_CLASSES, ['h2', 'defaultColor', 'defaultMarginh2'])}">
					Better Emojis
				</h2>
				<div class="flex-vertical">
					
				</div>
		</div>
	</div></div>
	`);

	const $contentDiv = $column.find('.flex-vertical');

	$contentDiv.append(checkbox({
		setting: 'enabled',
		name: 'Enabled',
		description: 'Enable or disable this plugin',
		value: Settings.get('enabled'),
		change: (value) => {
			Settings.set('enabled', value);
			updateHiddenServers();
		}
	}));

	$contentDiv.append(buildServerCards());

	return $column;
}

const SERVER_REGEX = /\/channels\/(\d+)\/\d+/;
const BACKGOUND_URL_REGEX = /background-image: url\("(.*)"\);/;

function getServersIcons() {
	const guildsIcons = {};

	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		guildsIcons[`${match[1]}`] = BACKGOUND_URL_REGEX.exec($avatar.attr('style'))[1];
		return guild;
	});

	return guildsIcons;
}

function buildToggleDefaultEmojiButton() {
	const $button = $(`
		<div id="be-emoji-show-mode" class="btn-close esc-text be-emoji-toggle">
			<span class="text">ALL</span>
			<div class="esc-text be-emoji-toggle-title">Show emojis</div>
		</div>
	`);

	const $text = $button.find('.text');

	$button.click(function () {
		const $this = $(this);

		$('.be-emoji-container .be-emoji-item.be-emoji-item-deafult').toggleClass('be-emoji-faded');

		$this.toggleClass('be-button-enabled');

		if ($this.hasClass('be-button-enabled')) {
			$text.html('GLOB');
		} else {
			$text.html('ALL');
		}
	});

	return $button;
}

function injectPanel(layer) {
	const $layer = $(layer);

	const $fadeToggleButton = buildToggleDefaultEmojiButton();

	$layer.find('.tools')
		.append($fadeToggleButton);

	const { $entry, $button } = buildSidebarEntry();
	const $contentColumn = buildContentColumn().hide();
	const $contentRegion = $layer.find('.content-region-scroller');

	$contentRegion.prepend($contentColumn);

	$layer.find('.sidebar > div')
		.children()
		.mousedown(() => {
			$contentRegion.find('.content-column').show();
			$contentColumn.hide();
			$button.removeClass(SETTINGS_CLASSES.itemDefaultSelected).addClass(SETTINGS_CLASSES.itemDefault);
		})
		.filter((index, element) => $(element).text() === TRANSLATION_MODULE.Messages.CHANGE_LOG)
		.before($entry);

	$button.mousedown(() => {
		$contentRegion.find('.content-column').hide();
		$contentColumn.show();
	});
}

function updateHiddenServers() {
	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		const server = Server.getById(match[1]);

		if (!server) {
			console.log(match);
			return guild;
		}

		if (server.isShownInList() || !Settings.get('enabled', true)) {
			$(guild).removeAttr('style');
		} else {
			$(guild).animate({ width: 0, height: 0 }, 500, 'swing', function () {
				$(this).hide();
			});
		}

		return guild;
	});
}

exports.updateHiddenServers = updateHiddenServers;

exports.inject = injectPanel;

},{"./checkbox.js":25,"./classes.js":26,"./constants.js":27,"./helpers.js":29,"./server.js":35,"./serverCard.js":36,"./settings.js":38,"jquery":2,"uikit":24}],38:[function(require,module,exports){
'use strict';

const {
	LOCAL_STORAGE_MODULE,
	BETTER_EMOJIS_KEY,
} = require('./constants.js');

//FIXME empty object returned for require('fs')
const fs = require('fs');
const path = require('path');

const defaultSettings = { enabled: true };

const SETTINGS_HANDLER = {
	get: function (target, name) {
		if (typeof name !== 'string') {
			return undefined;
		}

		const path = name.split('.');
		if (!path.every(e => !!e)) {
			throw Error(`Invalid settings path: ${name}`);
		}

		let obj = target;

		for (const prop of path) {
			obj = obj[prop];

			if (!obj) {
				return obj;
			}
		}

		return obj;
	},

	set: function (target, name, value) {

		if (typeof name !== 'string' || !name) {
			return value;
		}

		const path = name.split('.');
		if (!path.every(e => !!e)) {
			throw Error(`Invalid settings path: ${name}`);
		}

		const lastKey = path.pop();
		let obj = target;

		for (const prop of path) {
			if (!obj[prop]) {
				obj[prop] = {};
			}

			obj = obj[prop];
		}

		obj[lastKey] = value;

		return true;
	}
};

const fileLocation =
	typeof window.betterEmojiLocation !== 'undefined' &&
	fs.readFileSync && fs.writeFileSync && path.resolve ?
	path.resolve(window.betterEmojiLocation, 'config.json') : null;

const settings = new Proxy(Object.assign(defaultSettings, loadSettings()), SETTINGS_HANDLER);

function loadSettings() {
	try {
		return JSON.parse(fs.readFileSync(path.resolve(fileLocation, 'config.json'), 'utf-8'));
	} catch (err) {
		console.log('Error loading settings from file:', err);
		return JSON.parse(LOCAL_STORAGE_MODULE.impl.get(BETTER_EMOJIS_KEY));
	}
}

function saveSettings() {
	if (fileLocation) {
		fs.writeFileSync(path.resolve(fileLocation, 'config.json'), JSON.stringify(settings, null, '\t'));
	} else {
		LOCAL_STORAGE_MODULE.impl.set(BETTER_EMOJIS_KEY, JSON.stringify(settings));
	}
}

exports.set = function (key, value) {
	settings[key] = value;
	saveSettings();
};

function valueOrDefault(value, def) {
	if (value === null || typeof value === 'undefined') {
		return def;
	}

	return value;
}

window.beSettings = exports;

exports.get = function (key, def) {
	return valueOrDefault(settings[key], def);
};

},{"./constants.js":27,"fs":1,"path":22}],39:[function(require,module,exports){
'use strict';
/*
 * This file was autogenerated 
 * Any changes made here will be overriten!
 */

exports.EMOJI_PICKER_PATH = 'div.app > div:nth-child(6)';

exports.SETTINGS_CLASSES = 5342;
exports.SWITCH_CLASSES = 5180;
exports.FLEX_CHILD_CLASSES = 2688;
exports.FLEX_CLASSES = 2689;
exports.HEADER_CLASSES = 2695;
exports.SWITCH_ITEM_CLASSES = 5182;
exports.DIVIDER_ITEM_CLASSES = 5181;
exports.LABEL_ITEM_CLASSES = 5179;
exports.FONT_SIZE_CLASSES = 2691;
exports.CARD_CLASSES = 2696;
exports.EMOJI_BUTTON_CLASS = 5517;
exports.LOCAL_STORAGE_MODULE = 2611;
exports.EMOJI_STORAGE_MODULE = 188;
exports.SERVERS_STORAGE_MODULE = 16;
exports.SERVERS_PERMISSIONS_MODULE = 50;
exports.TRANSLATION_MODULE = 3;
exports.CUSTOM_EMOJI_STORAGE_MODULE = 211;
exports.REACTION_EMOJI_CONVERTER = 331;

},{}]},{},[32])
//# sourceMappingURL=better-emojis.js.map
