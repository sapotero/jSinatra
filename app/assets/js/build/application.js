/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	var jS = jS || {};

	jS = (function(){

	  var jS = function(){
	    this.modules   = {};
	    this.core      = {};
	    this.router    = {};
	    this.channels  = {};
	  };
	  jS.prototype.init = function(){
	    console.groupCollapsed('jS::Init');
	    console.groupEnd();
	  };
	  jS.prototype.attachTo  = function(obj){
	    var jS = this;

	    obj.publish   = function( channel) {
	      if ( !jS.channels[channel] ) {
	        return false;
	      }

	      var args = Array.prototype.slice.call(arguments, 1);
	      // console.log('  -> ', channel);

	      for (var i = 0, l = jS.channels[channel].length; i < l; i++) {
	        var subscription = jS.channels[channel][i];
	        subscription.callback.apply(subscription.context, args);
	      }

	      return this;
	    };
	    obj.subscribe = function(channel, fn, before, after ) {
	      if ( !jS.channels[channel] ) {
	        jS.channels[channel] = [];
	      }

	      jS.channels[channel].push({ context: this, callback: fn });
	          // before event
	      if ( before && typeof(before) === 'function' ) {
	        // console.log('**before', channel);
	        before.call(this, arguments);
	      }

	      // after event
	      if ( after && typeof(after) === 'function' ) {
	        // console.log('**after', channel);
	        after.call(this,  arguments);
	      }

	      return this;
	     };
	  };
	  return new jS();
	})();
	jS.init();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	var jS = jS || {};
	jS.router = (function() {
	  var routes = {},
	      decode = decodeURIComponent;

	  function noop(s) { return s; }
	  function sanitize(url) {
	    ~url.indexOf('/?') && (url = url.replace('/?', '?'));
	    url[0] == '/' && (url = url.slice(1));
	    url[url.length - 1] == '/' && (url = url.slice(0, -1));

	    return url;
	  }
	  function processUrl(url, esc) {
	    var pieces = url.split('/'),
	        rules = routes,
	        params = {};

	    for (var i = 0; i < pieces.length && rules; ++i) {
	      var piece = esc(pieces[i]);
	      rules = rules[ piece.toLowerCase() ] || rules[':'];
	      rules && rules['~'] && (params[rules['~']] = piece);
	    }

	    return rules && {
	      callback: rules['@'],
	      params: params
	    };
	  }
	  function processQuery(url, ctx, esc) {
	    if (url && ctx.callback) {
	      var hash = url.indexOf('#'),
	          query = (hash < 0 ? url : url.slice(0, hash)).split('&');

	      for (var i = 0; i < query.length; ++i) {
	        var nameValue = query[i].split('=');

	        ctx.params[nameValue[0]] = esc(nameValue[1]);
	      }
	    }

	    return ctx;
	  }
	  function lookup(url) {
	    var querySplit = sanitize(url).split('?'),
	        esc = ~url.indexOf('%') ? decode : noop;

	    return processQuery(querySplit[1], processUrl(querySplit[0], esc) || {}, esc);
	  }

	  return {
	    add: function(route, handler) {

	      var pieces = route.split('/'),
	          rules = routes;

	      for (var i = 0; i < pieces.length; ++i) {
	        var piece = pieces[i],
	            name = piece[0] == ':' ? ':' : piece.toLowerCase();

	        rules = rules[name] || (rules[name] = {});

	        name == ':' && ( rules['~'] = piece.slice(1) );
	      }

	      rules['@'] = handler;
	    },
	    exists: function (url) {
	      return !!lookup(url).callback;
	    },
	    lookup: lookup,
	    run: function(url) {
	      var result = lookup(url);

	      result.callback && result.callback({
	        url: url,
	        params: result.params
	      });

	      return !!result.callback;
	    },
	    routes: routes
	  };
	})();

	function ready(){

	   jS.router.add('', function () {
	    console.log( 'default' );
	  });

	  jS.router.add('user/:name', function (r) {
	    console.log( 'USER -> NAME: ', r.params.name );
	  });

	  function processHash() {
	    var hash  = location.hash || '#',
	        route = hash.slice(1);
	    jS.router.exists( route )? jS.router.run( route ) : console.log('not exists');
	  }

	  window.addEventListener('hashchange', processHash);
	  
	  processHash();
	}
	document.addEventListener("DOMContentLoaded", ready);

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	console.log('user');

/***/ }
/******/ ]);