require([
    'table',
    'edit',
    'graph'],
function(
    table,
    edit,
    graph
){
    var mid = {
        loadTable: function(){
            table.load();
        }
    };

    return mid;
});
