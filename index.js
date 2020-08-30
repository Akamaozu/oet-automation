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

app.step( 'echo hello world', function(){
  console.log( 'hello world' );
  app.next();
});

app.start();