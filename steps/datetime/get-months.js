var path_to_root = '../..';

module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get months', function(){
    var months = require( path_to_root + '/data/months.json' );

    task.set( 'months', months );
    task.next();
  });
}