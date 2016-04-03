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