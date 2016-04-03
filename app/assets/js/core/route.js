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