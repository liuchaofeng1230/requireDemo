# 关于前端模块循环依赖问题的一些思考

## 问题描述
前端模块化的趋势越来越明显，最近做的一个项目用到了requirejs进行模块化开发。在开发的过程中遇到了循环依赖的问题，因此引发了一些思考。

先描述一下应用场景，有以下三个模块：

* 表格模块：展示数据，点击其中一行后触发绘图操作，图形化展示该行数据
* 绘图模块：图形化展示数据，渲染完毕后显示编辑区域
* 编辑模块：编辑数据，保存后重载表格

代码如下:

```
// main.js
require(['table'], function(table){
    table.load();
});

// table
define(['graph'], function(graph){
    var table = {
        init: function(){
            console.log('table init');
        },
        load: function(){
            console.log('table load');
            // after load
            graph.draw();
        }
    };

    table.init();

    return table;
});

// graph
define(['edit'], function(edit){
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

// edit
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
```

运行以上代码，在console里输出如下，说明出现循环依赖问题:

```
table init table.js:4
table load table.js:7
Uncaught TypeError: Cannot read property 'draw' of undefined
```


## 循环依赖的解决方案

### requirejs官方文档中的方案

```
// edit
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
```

不在依赖中载入table模块，而在调用save方法时才去载入，解开了edit与table这两个模块在初始化时的依赖关系，保持了初始化时依赖关系的正确，各模块都能正常载入

### 引入中间模块

```
```

