module.exports = function( task, config ){
  if( ! config ) config = {};

  require( './get-pretty-datetime' )( task, config );

  task.step( 'create timestamp', function(){
    var datetime = task.get( 'pretty-datetime' ),
        timestamp = ''
          + datetime.year + '-' + datetime.month + '-' + datetime.day
          + ' '
          + datetime.hour + ':' + datetime.min + ':' + datetime.sec;

    task.set( 'timestamp', timestamp );
    task.next();
  });
}