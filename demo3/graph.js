define(['edit'], function(edit){
    var graph = {
        init: function(){
            console.log('graph init');
            edit.show();
        },
        draw: function(){
            console.log('graph draw');
            // after draw
        }
    };

    graph.init();

    return graph;
});
