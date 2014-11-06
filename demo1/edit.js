define(function(require){
    var edit = {
        init: function(){
            console.log('edit init');
        },
        show: function(){
            console.log('edit panel show');
        },
        save: function(){
            // after save
            require('table').load();
        }
    };

    edit.init();

    return edit;
});
