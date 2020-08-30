var create_task = require('cjs-task'),
    app = create_task();

app.callback( function( error ){
  var log_entry = [
    'action=exit',
    'reason="'+ ( error ? 'error' : 'app ended' ) + '"'
  ];

  if( error ){
    log_entry.push(
      'error="'+ error.message + '"',
      'stack=\n---\n'+ error.stack +'\n---'
    );
  }

  console.log( log_entry.join(' ') );
  process.exit( error ? 1 : 0 );
});

app.step( 'log timestamp every second', function(){

  setInterval( log_timestamp, 1000 );
  app.next();

  function log_timestamp(){
    var task = create_task();

    task.callback( function( error ){
      if( ! error ) console.log( 'action=log-timestamp time="'+ task.get( 'timestamp' ) + '"' );
    });

    require( '../../steps/datetime/get-timestamp' )( task );

    task.start();
  }
});

app.step( 'throw error after 5 seconds', function(){

  setTimeout( throw_error, 5000 );
  app.next();

  function throw_error(){
    throw new Error( 'something went wrong, apparently' );
  }
});

app.step( 'wait', function(){
  // do nothing
});

app.start();