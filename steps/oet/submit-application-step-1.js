module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'submit step 1 of application', function(){
    var page = task.get( 'browser-page' ),
        oet_application = task.get( 'oet-application' );

    if( ! oet_application.profession ) throw new Error( 'profession to apply for not specified' );
    if( ! oet_application.country ) throw new Error( 'country to apply for not specified' );
    if( ! oet_application.test_types ) throw new Error( 'test types to apply for not specified' );

    var profession_index = task.get( 'oet-professions' ).indexOf( oet_application.profession ),
        country_index = task.get( 'oet-countries' ).indexOf( oet_application.country ),
        expected_responses = 2,
        received_responses = 0,
        dates_found = [];

    page.on( 'response', function do_exclusive_next( response ){
      var source = response.url();

      if( source.indexOf( 'https://registration.myoet.com/main/UIDL/?v-uiId=0' ) !== 0 ) return;
      else received_responses += 1;

      if( received_responses == expected_responses ) task.next();
    });

    page.evaluate( function( application ){

      var profession_select_dom = document.querySelector( '#gwt-uid-11 > select' );
          profession_select_dom.value = application.profession;
          profession_select_dom.dispatchEvent( new Event('change') );

      var country_select_dom = document.querySelector( '#gwt-uid-15 > select' );
          country_select_dom.value = application.country;
          country_select_dom.dispatchEvent( new Event('change') );

      document.querySelector( '.v-button-primary.next' ).click();

    }, { profession: profession_index + 1, country: country_index + 1 })
      .then( function(){
        console.log( 'action=submit-application-step-1 success=true profession="'+ oet_application.profession +'" country="'+ oet_application.country + '"' );
        // do nothing; app will progress after two expected responses
      })
      .catch( task.end );
  });
}