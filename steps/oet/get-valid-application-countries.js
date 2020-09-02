module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get valid application countries', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      var countries_dom = document.querySelectorAll( '#gwt-uid-15 > select > option' ),
          countries = [];

      countries_dom.forEach( function( option ){
        var key = option.value,
            value = option.innerText;

        if( key !== 'null' ) countries.push( value );
      });

      return countries;
    })
      .then( function( countries ){
        console.log( 'action=get-valid-oet-countries success=true total=' + Object.keys( countries ).length );

        task.set( 'oet-countries', countries );
        task.next();
      })
      .catch( task.end );
  });
}