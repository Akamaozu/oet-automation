module.exports = function( task, config ){
  if( !config ) config = {};

  var browser_type = config.hasOwnProperty('browser_type') ? config.browser_type : process.env.BROWSER_TYPE;

  switch( browser_type ){

    case 'puppeteer':
    default:
      require('./puppeteer/start')( task, config );
    break;
  }
}