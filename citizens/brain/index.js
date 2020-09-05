var create_task = require('cjs-task'),
    path_to_root = '../..',
    app = create_task();

app.set( 'oet-application', {
  country: 'United States of America',
  profession: 'Medicine',
  test_types: [ 'Speaking' ]
});

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

require( path_to_root + '/steps/browser/start' )( app, { headless: false, show_console_output: true });
require( path_to_root + '/steps/oet/go-to-login-page' )( app );
require( path_to_root + '/steps/oet/login' )( app );
require( path_to_root + '/steps/oet/get-account-details' )( app );
require( path_to_root + '/steps/oet/go-to-start-application-page' )( app );
require( path_to_root + '/steps/oet/get-valid-application-countries' )( app );
require( path_to_root + '/steps/oet/get-valid-application-test-types' )( app );
require( path_to_root + '/steps/oet/get-valid-application-professions' )( app );
require( path_to_root + '/steps/oet/submit-application-step-1' )( app );

app.step( 'print', function(){
  var page = app.get( 'browser-page' );

  page.evaluate( function(){
    var date_doms = document.querySelectorAll( '#gwt-uid-23 > select > option' ),
        dates = [];

    date_doms.forEach( function( dom ){
      if( dom.value !== 'null') dates.push({ index: dom.value, value: dom.innerText });
    });

    console.log( 'total dates found:', dates.length );
    return dates;
  })
    .then( function( dates ){
      var oet_application = app.get( 'oet-application' );

      console.log( 'action=get-available-dates success=true profession="'+ oet_application.profession + '" country="'+ oet_application.country + '" dates=', dates );
      app.next();
    })
    .catch( app.end );
});

app.step( 'wait a bit, then exit', function(){
  var sec_in_ms = 1000,
      delay_s = 10,
      delay_ms = delay_s * sec_in_ms;

  console.log( 'action=delay-exit duration='+ delay_s +'s' );
  setTimeout( app.next, delay_ms );
});

app.start();