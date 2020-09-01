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

    if( ! user ) throw new Error( 'OET username not specified' );
    if( ! pass ) throw new Error( 'OET password not specified' );

    console.log( 'action=log-credentials user='+ user + ' pass='+ pass );

    var oet_credentials = {};
        oet_credentials.user = user;
        oet_credentials.pass = pass;

    page.evaluate( function( credentials ){
      document.querySelector( '#u' ).value = credentials.user;
      document.querySelector( '#p' ).value = credentials.pass;
      document.querySelector( '#s' ).click();
    }, oet_credentials )
      .then( function(){
        // do nothing. form submission should navigate to next task step
      })
      .catch( app.end );
  });

  app.step( 'wait til page hash changes; virtual routing', function(){
    var page = app.get( 'browser-page' );

    page.evaluate( function(){
      return new Promise( function( resolve, reject ){
        window.addEventListener( 'hashchange', resolve );
      });
    })
      .then( app.next )
      .catch( app.end );
  });

  app.step( 'log account details', function(){
    var page = app.get( 'browser-page' );

    page.evaluate( function(){
      var details_dom = document.querySelector( '.tsc-memberdetails > .details' ),
          mixed_details_dom = details_dom.querySelectorAll( 'p' ),
          name_dom = mixed_details_dom[0],
          exam_id_dom = mixed_details_dom[1],
          img_dom = details_dom.querySelector( 'div > img' );

      var details = {};
          details.name = name_dom.innerText;
          details.exam_id = exam_id_dom.innerText;
          details.img = img_dom.src;

      return details;
    })
      .then( function( details ){
        console.log( 'action=log-oet-account-details exam-id='+ details.exam_id +' name="'+ details.name + '"' );
        app.next();
      })
      .catch( app.end );
  });

  app.next();
});

app.step( 'wait a bit, then exit', function(){
  var sec_in_ms = 1000,
      delay_s = 10,
      delay_ms = delay_s * sec_in_ms;

  console.log( 'action=delay-exit duration='+ delay_s +'s' );
  setTimeout( app.end, delay_ms );
});

app.start();