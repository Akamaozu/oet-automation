module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'go to "start application" page', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      return new Promise( function( resolve, reject ){
        window.addEventListener( 'hashchange', resolve );
        document.querySelector( '.v-menubar-menuitem.assessment' ).click();
      });
    })
      .then( function(){
        console.log( 'action=go-to-oet-start-application-page success=true' );
        task.next();
      })
      .catch( task.end );
  });
}