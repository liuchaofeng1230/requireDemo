define('edit', function(edit){
    var graph = {
        init: function(){
            console.log('graph init');
        },
        draw: function(){
            console.log('graph draw');
            // after draw
            edit.show();
        }
    };

    graph.init();

    return graph;
});
