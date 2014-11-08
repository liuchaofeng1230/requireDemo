define(['table'], function(table){
    var edit = {
        init: function(){
            console.log('edit init');
            table.load();
        },
        show: function(){
            console.log('edit panel show');
        },
        save: function(){
            // after save
        }
    };

    edit.init();

    return edit;
});
