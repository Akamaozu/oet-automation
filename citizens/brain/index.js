var create_task = require('cjs-task'),
    path_to_root = '../..',
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

require( path_to_root + '/steps/supe/create-citizen' )( app );

app.step( 'load oet credentials', function(){
  var user = process.env.OET_USERNAME,
      pass = process.env.OET_PASSWORD;

  if( ! user ) throw new Error( 'OET username not specified' );
  if( ! pass ) throw new Error( 'OET password not specified' );

  var oet_credentials = {};
      oet_credentials.user = user;
      oet_credentials.pass = pass;

  app.set( 'oet-credentials', oet_credentials );
  app.next();
});

require( path_to_root + '/steps/browser/start' )( app, { headless: false });
require( path_to_root + '/steps/oet/go-to-login-page' )( app );
require( path_to_root + '/steps/oet/login' )( app );
require( path_to_root + '/steps/oet/get-account-details' )( app );
require( path_to_root + '/steps/oet/go-to-start-application-page' )( app );
require( path_to_root + '/steps/oet/get-valid-application-professions' )( app );

app.step( 'print professions', function(){
  console.log( 'oet application valid professions: ', app.get( 'oet-professions' ) );
  app.next();
});

app.step( 'wait a bit, then exit', function(){
  var sec_in_ms = 1000,
      delay_s = 10,
      delay_ms = delay_s * sec_in_ms;

  console.log( 'action=delay-exit duration='+ delay_s +'s' );
  setTimeout( app.next, delay_ms );
});

app.start();