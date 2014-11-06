define(['graph'], function(graph){
    var table = {
        init: function(){
            console.log('table init');
        },
        load: function(){
            console.log('table load');
            // after load
            graph.draw();
        }
    };

    table.init();

    return table;
});
