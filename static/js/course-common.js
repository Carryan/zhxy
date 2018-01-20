// 选择表 插件
$.fn.selectTable = function(ops){
    var defaults = {
        cell: "td", //有效元素
        disabled: ".disabled", //无法选中元素
        selectedClass: "selected", //被选中元素的类名
    }

    var settings = $.extend({}, defaults, ops);
    var _this = this;

    _this._status = { disable: false }

    function init() {

        _this.find(settings.cell).click(function(){

            if(_this._status.disable) return ;

            var this_cell = $(this),
                selectedClass = settings.selectedClass;

            if(this_cell.is(settings.disabled)) return ;

            if(this_cell.hasClass(selectedClass)){
                this_cell.removeClass(selectedClass);
            }else{
                this_cell.addClass(selectedClass);
            }
        });
    }

    this.getSelected = function() { 
        return _this.find('.'+settings.selectedClass);
    }
    this.getValues = function() {
        var vals = [];
        this.getSelected().each(function(){
            vals.push($(this).data('val'));
        });
        return vals;
    }
    this.clearAll = function() { //清空
        _this.find('.'+settings.selectedClass).each(function(){
            $(this).removeClass(settings.selectedClass);
        });
    }
    this.selectAll = function() { //全选
        var enable_cells = _this.find(settings.cell).not(settings.disabled);
        enable_cells.each(function(){
            $(this).addClass(settings.selectedClass);
        });
    }
    this.disable = function() { //禁止
        this._status.disable = true;
    }
    this.enable = function() {
        this._status.disable = false;
    }

    init();
    return this;
}


// 可拖拽表
;(function(obj){
    if(!obj.length) return false;

    $.fn.dragTableCell = function (options) {
        var defaults = {
            cell: "td", //有效元素的选择器
            drop: "", //可放置元素
            val: ".val",
            disabled: ".disabled", //无法拖拽元素的选择器 
            container: this.selector,
            //监听拖拽前的函数，可配置（参数:当前ele、所有有效cell）
            startDrag: function(ele,validCells){ },
            //监听拖拽后的函数，可配置（参数:置换及置换后的ele）
            stopDrag: function(dragFrom,dragTo){ }
           };
        
        var settings = $.extend({}, defaults, options);
        var _this = this;
    
        function init() {
            var dragCells = _this.find(settings.cell);
            // console.log(settings.container);
            dragCells.draggable({
                revert: "invalid",
                scroll: false,
                cancel: settings.disabled,
                // containment: settings.container,//拖拽范围容器
                scrollSensitivity: 50,
                helper: "clone",
                start: function( event, ui ) {
                    var curEle = $(this),
                        validCells = dragCells;
                    settings.startDrag(curEle,validCells);
                }
            });
            
            if(settings.drop){
                var $drop = $(settings.drop);
            }else{
                var $drop = dragCells;
            }
            $drop.droppable({
                drop: function( event, ui ) {
                    // console.log(event.type); //ondrop 在一个拖动过程中，释放鼠标键时触发此事件
                    if($(this).is(settings.disabled)) return ;
                    var dragObj = ui.draggable,
                        dropHtml = $(this).html();
                    
                    $(this).html(dragObj.html());
                    dragObj.html(dropHtml);
    
                    settings.stopDrag(dragObj,$(this));
                }
            });
        };
    
        //所有值
        this.getValues = function() {
            var cells = {};
            _this.find(settings.cell).each(function(index, element){
              var key = $(element).data("key"),
                  val = $(element).find(settings.val).data("val");
              cells[key] = val;
            });
            return cells;
        };
    
        init();
        return this;
    }
    
    $(".dragTable").dragTableCell();

})($(".dragTable"));

// $(".dragTable").dragTableCell();


// 打开modal
selectModel();

function selectModel() {
    $("[data-modal]").click(function(){
        var _this = $(this),
            title = _this.data('title'),
            modal = _this.data('modal'),
            $modal = $(modal);
    
        $modal.find('.modal-title').text(title);   
        $modal.modal('show');
    });
}


// 显示教师
(function(obj){
    if(!obj.length) return ;

    obj.change(function(){
        var table = $(this).data('table');
        if($(this).is(":checked")){
            $(table).addClass('show-msg');
        }else{
            $(table).removeClass('show-msg')
        }
    });
})($("#showTeacher"));

// 显示年级
(function(obj){
    if(!obj.length) return ;

    obj.change(function(){
        var table = $(this).data('table'),
            val = $(this).val();
        if(val){
            $(table).find('tbody tr').each(function(){
                $(this).data('row')==val?$(this).show():$(this).hide();
            });
        }else{
            $(table).find('tbody tr').show();
        }
    });
})($("#showRow"));


// 选择节次
(function(obj){
    if(!obj.length) return ;

    obj.find('select').change(function(){
        var cm = ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四'],
            i = 0;
        obj.find('select').each(function(){
            var list = '', j = 0;
            while(j<$(this).val()){
                list = list + '<span>第'+cm[i]+'节</span>';
                j++;
                i++;
            }
            $(this).next().html(list);
        });
    });
})($(".course-num-select"));


// 删除表格行
(function(obj){
    if(!obj.length) return ;

})($(""));