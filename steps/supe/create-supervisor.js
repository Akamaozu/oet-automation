var create_supervisor = require('supe'),
    dotenv = require('dotenv'),
    path = require('path'),
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

  task.step( 'create supervisor instance', function(){
    task.set( 'supervisor', create_supervisor() );
    task.next();
  });

  task.step( 'load supervisor addons', function(){
    task.get( 'supervisor' ).use( citizen_supervision_api );
    task.next();
  });
}