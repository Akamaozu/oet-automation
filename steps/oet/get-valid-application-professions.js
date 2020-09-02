module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get valid application professions', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      var professions_dom = document.querySelectorAll( '#gwt-uid-11 > select > option' ),
          professions = [];

      professions_dom.forEach( function( option ){
        var key = option.value,
            value = option.innerText;

        if( key !== 'null' ) professions.push( value );
      });

      return professions;
    })
      .then( function( professions ){
        console.log( 'action=get-valid-oet-professions success=true total=' + Object.keys( professions ).length );

        task.set( 'oet-professions', professions );
        task.next();
      })
      .catch( task.end );
  });
}