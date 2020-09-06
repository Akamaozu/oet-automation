module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get available test dates', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      var date_doms = document.querySelectorAll( '#gwt-uid-23 > select > option' ),
          dates = [];

      date_doms.forEach( function( dom ){
        if( dom.value !== 'null') dates.push({ index: dom.value, value: dom.innerText });
      });

      return dates;
    })
      .then( function( dates ){
        var oet_application = task.get( 'oet-application' ),
            available_dates = dates;

        console.log( 'action=get-available-test-dates success=true profession="'+ oet_application.profession + '" country="'+ oet_application.country + '" total='+ dates.length +' dates=', dates );

        task.set( 'oet-application-available-dates', available_dates );
        task.next();
      })
      .catch( task.end );
  });
}