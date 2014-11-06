define(['graph'], function(graph){
    var table = {
        init: function(){
            console.log('table init');
        },
        load: function(callback){
            console.log('table load');
            // after load
            callback();
            // graph.draw();
        }
    };

    table.init();

    return table;
});
