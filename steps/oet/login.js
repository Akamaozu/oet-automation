module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'login to oet portal', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( fill_and_submit_login_form, task.get( 'oet-credentials' ) )
      .then( function(){
        // do nothing. form submission should navigate to next task step
      })
      .catch( task.end );

    function fill_and_submit_login_form( credentials ){
      document.querySelector( '#u' ).value = credentials.user;
      document.querySelector( '#p' ).value = credentials.pass;
      document.querySelector( '#s' ).click();
    }
  });

  task.step( 'log', function(){
    console.log( 'action=login-to-oet success=true' );
    task.next();
  });

  task.step( 'wait for logged-in single page app to load', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      return new Promise( function( resolve, reject ){
        window.addEventListener( 'hashchange', resolve );
      });
    })
      .then( function(){
        console.log( 'action=load-oet-spa success=true' );
        task.next();
      })
      .catch( task.end );
  });

  task.step( 'close acknowledgement dialog', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      document.querySelector( '.v-button-primary.i-understand' ).click();
    })
      .then( task.next )
      .catch( task.end );
  });
}