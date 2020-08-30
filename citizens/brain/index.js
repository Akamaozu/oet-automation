console.log( 'hello world' );

setInterval( function(){
  console.log( 'action=log-time now="'+ ( new Date() ).toTimeString() + '"' );
}, 1000 );

setTimeout( function(){
  throw new Error( 'rawr!' );
}, 11111 );