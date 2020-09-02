module.exports = function( task, config ){
  if( ! config ) config = {};

  task.step( 'get account details', function(){
    var page = task.get( 'browser-page' );

    page.evaluate( function(){
      var details_dom = document.querySelector( '.tsc-memberdetails > .details' ),
          mixed_details_dom = details_dom.querySelectorAll( 'p' ),
          name_dom = mixed_details_dom[0],
          exam_id_dom = mixed_details_dom[1],
          img_dom = details_dom.querySelector( 'div > img' );

      var details = {};
          details.name = name_dom.innerText;
          details.exam_id = exam_id_dom.innerText;
          details.img = img_dom.src;

      return details;
    })
      .then( function( details ){
        console.log( 'action=get-oet-account-details success=true id='+ details.exam_id +' name="'+ details.name + '"' );

        task.set( 'oet-account', details );
        task.next();
      })
      .catch( task.end );
  });
}