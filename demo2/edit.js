define(function(){
    var edit = {
        init: function(){
            console.log('edit init');
        },
        show: function(){
            console.log('edit panel show');
        },
        save: function(callback){
            // after save
            callback();
            // table.load();
        }
    };

    edit.init();

    return edit;
});
