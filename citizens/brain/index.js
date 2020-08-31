var create_task = require('cjs-task'),
    app = create_task();

app.callback( function( error ){
  var log_entry = [
    'action=exit',
    'reason="'+ ( error ? 'error' : 'app ended' ) + '"'
  ];

  if( error ) log_entry.push( 'stack=\n---\n'+ error.stack +'\n---' );

  console.log( log_entry.join(' ') );
  process.exit( error ? 1 : 0 );
});

app.step( 'if an error isnt caught, end app', function(){
  process.on( 'uncaughtException', app.end );
  app.next();
});

require( '../../steps/supe/create-citizen' )( app );

app.step( 'setup app', function(){
  var path_to_root = app.get( 'path-to-root' );

  require( path_to_root + '/steps/browser/start' )( app, { headless: false });
  require( path_to_root + '/steps/browser/load-page' )( app, { url: 'https://registration.myoet.com/login.jsp' });

  app.step( 'login to oet account', function(){
    var page = app.get( 'browser-page' ),
        user = process.env.OET_USERNAME,
        pass = process.env.OET_PASSWORD;

    console.log( 'action=log-credentials user='+ user + ' pass='+ pass );

    page.evaluate( function( config ){
      document.querySelector( '#u' ).value = config.user;
      document.querySelector( '#p' ).value = config.pass;
      document.querySelector( '#s' ).click();
    }, { user: user, pass: pass })
  });

  app.next();
});

app.step( 'wait', function(){
  // do nothing
});

app.start();