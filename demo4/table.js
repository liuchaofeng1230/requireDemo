define(['graph'], function(graph){
    var table = {
        init: function(){
            console.log('table init');
            graph.draw();
        },
        load: function(){
            console.log('table load');
            // after load
        }
    };

    table.init();

    return table;
});
