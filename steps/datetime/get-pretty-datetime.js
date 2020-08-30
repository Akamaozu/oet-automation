module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get pretty datetime', function(){
    var date = config.date || task.get( 'date' ) || new Date(),
        year = date.getFullYear(),
        month = leftpad( date.getMonth() + 1 ),
        day = leftpad( date.getDate() ),
        hour = leftpad( date.getHours() ),
        min = leftpad( date.getMinutes() ),
        sec = leftpad( date.getSeconds() );

    task.set( 'pretty-datetime', {
      year: year,
      month: month,
      day: day,
      hour: hour,
      min: min,
      sec: sec
    });

    task.next();
  });
}

function leftpad( n ) {
  var tr = ( parseInt(n) < 10 ) ? '0' + n : n;
  return tr;
}