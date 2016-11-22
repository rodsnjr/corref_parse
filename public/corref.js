$(document).ready(function(){

    $('.tabular.menu .item').tab({
        onVisible : function(){
            filter();
        }
    });

    var mark = function(keyword) {
        // Remove previous marked elements and mark
        // the new keyword inside the context
        var options = {
            "separateWordSearch": false, 
            "accuracy": "exactly"
        };

        $(".texto").unmark().mark(keyword, options);
    };

    $('.highlight').click(function(){
        text = $(this).find(".content").text().trim();
        console.log(text);
        mark(text);
    });

    var filter = function(){
        var keyword = $("input[name='keyword']").val();
        $(".active .list").unmark().mark(keyword);        
    }

    $("input[name='keyword']").on("input", filter);

});