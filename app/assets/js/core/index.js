'use strict';

var load = new Promise( function(resolve, reject){
  resolve(true);
    setTimeout( function(){
  console.log('index in promise');
  }, 2000);
});

load.then(function(){
  resolve(true);
    setTimeout( function(){
  console.log('index after promise');
  }, 1000);
});
