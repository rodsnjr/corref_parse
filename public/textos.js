$(document).ready(function () {
    
    $('.tabular.menu .item').tab();

    $('.menu.concordancias .item').tab({
        auto    : true,
        path    : '/kappas/correferencias/'
    });
    
});