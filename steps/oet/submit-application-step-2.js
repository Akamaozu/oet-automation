module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'select test date', function(){
    var page = task.get( 'browser-page' );

    var received_responses = 0,
        expected_responses = 2;

    page.on( 'response', function( response ){
      var source = response.url();

      if( source.indexOf( 'https://registration.myoet.com/main/UIDL/?v-uiId=0' ) !== 0 ) return;
      else received_responses += 1;

      if( received_responses == expected_responses ) task.next();
    });

    page.evaluate( function(){
      var date_select = document.querySelector( '#gwt-uid-23 > select' );
          date_select.value = 1;
          date_select.dispatchEvent( new Event('change') );

      document.querySelector( '.v-button-primary.next' ).click();

      return date_select.value;
    })
      .then( function( date_select_value ){
        console.log( 'action=submit-application-step-2 success=true date="'+ task.get( 'oet-application-available-dates' )[ date_select_value - 1 ].value +'"' );
        // do nothing; progression is handled by page response listener
      })
      .catch( task.end );
  });
}