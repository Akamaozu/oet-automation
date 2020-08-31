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

require( './steps/supe/create-supervisor' )( app );

app.step( 'start main citizen', function(){

  app.step( 'setup supervisor behavior to main citizen', function(){
    var supervisor = app.get( 'supervisor' );

    supervisor.hook.add( 'brain-shutdown', 'exit', function(){
      console.log( 'action=end-app reason="brain shutdown"' );
      app.end();
    });

    supervisor.hook.add( 'brain-excessive-crash', 'exit', function(){
      console.log( 'action=end-app reason="brain crashed excessively"' );
      app.end();
    });

    app.next();
  });

  app.step( 'start citizen', function(){
    app.get( 'supervisor' ).start( 'brain', './citizens/brain', { retries: 1, duration: 0.25 });
    app.next();
  });

  app.next();
});

app.step( 'wait', function(){
  // do nothing
});

app.start();