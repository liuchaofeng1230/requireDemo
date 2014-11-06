define(function(){
    var graph = {
        init: function(){
            console.log('graph init');
        },
        draw: function(callback){
            console.log('graph draw');
            // after draw
            callback();
            // edit.show();
        }
    };

    graph.init();

    return graph;
});
