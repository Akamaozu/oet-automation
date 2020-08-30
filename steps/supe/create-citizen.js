var citizen = require('supe'),
    path = require('path'),
    dotenv = require('dotenv'),
    fs_steps = require('cjs-task-fs-steps'),
    citizen_supervision_api = require( 'supe-addon-citizen-supervision-api' );

module.exports = function( task ){

  fs_steps[ 'get-path-to-main-module' ]( task );

  task.step( 'get path to root', function(){
    var path_to_root = path.join( __dirname, '../..' );

    task.set( 'path-to-root', path_to_root );
    task.next();
  });

  task.step( 'load env variables', function(){
    dotenv.config({ path: task.get( 'path-to-root' ) + '/.env' });
    task.next();
  });

  task.step( 'create citizen', function(){
    task.set( 'citizen', citizen );
    task.next();
  });

  task.step( 'load citizen addons', function(){
    task.get( 'citizen' ).use( citizen_supervision_api );
    task.next();
  });
}