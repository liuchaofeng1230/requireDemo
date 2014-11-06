define(['table'], function(table){
    var edit = {
        init: function(){
            console.log('edit init');
        },
        show: function(){
            console.log('edit panel show');
        },
        save: function(){
            // after save
            table.load();
        }
    };

    edit.init();

    return edit;
});
