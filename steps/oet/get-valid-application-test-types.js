module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get oet test types', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      var test_types_dom = document.querySelectorAll( '#gwt-uid-13 > span > label' ),
          test_types = [];

      test_types_dom.forEach( function( test_type_dom ){
        if( test_type_dom.innerText.length > 0 ) test_types.push( test_type_dom.innerText );
      });

      return test_types;
    })
      .then( function( oet_test_types ){
        console.log( 'action=get-valid-application-test-types success=true total='+ oet_test_types.length );

        task.set( 'oet-test-types', oet_test_types );
        task.next();
      })
      .catch( task.end );
  });
}