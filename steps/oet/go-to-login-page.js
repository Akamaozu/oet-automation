module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'navigate to oet examinee login page', function(){

    require( task.get( 'path-to-root' ) + '/steps/browser/load-page' )( task, { url: 'https://registration.myoet.com/login.jsp', verbose: false });

    task.step( 'log', function(){
      console.log( 'action=navigate-to-oet-login-page success=true' );
      task.next();
    });

    task.next();
  });
}