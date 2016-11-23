$(document).ready(function () {
    
    $('.tabular.menu .item').tab();

    $('.menu.concordancias .item').tab({
        auto    : true,
        path    : '/kappas/correferencias/'
        /*,
        onVisible : function(path){
            render(path);
        }
        */
    });
    
    /*
    $('.menu.concordancias .item')
        .api({
            url : "/kappas/correferencias/{$tab}",
            beforeSend: function(settings) {
                console.log('called api -' + settings);

                return settings;
            }
        });

    function render(path){
        console.log(path);    
    }
    */

});