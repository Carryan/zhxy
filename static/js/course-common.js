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

// 可拖拽表 插件
$.fn.dragTableCell = function (options) {
    var defaults = {
        cell: "td", //有效元素的选择器
          disabled: ".disabled", //无法拖拽元素的选择器 
          cloneStyle: {"background-color":"rgba(94, 158, 214, 0.5)"}, //克隆元素样式

          //监听拖拽前的函数，可配置（参数:当前ele、所有有效cell）
          startDrag: function(ele,validCells){ },
          //监听拖拽后的函数，可配置（参数:置换及置换后的ele）
          stopDrag: function(dragFrom,dragTo){ }
       };
    
    var settings = $.extend({}, defaults, options);
    var _this = this;

    function init() {
        var dragCells = _this.find(settings.cell).not(settings.disabled);

        dragCells.draggable({
            revert: "invalid",
            containment: _this.selector,//拖拽范围容器
            helper: function(){
                var ele = $(this).clone(),
                    w = $(this).width(),
                    h = $(this).height();
                ele.width(w).height(h).css(settings.cloneStyle);
                return ele;
            },
            start: function( event, ui ) {
                var curEle = $(this),
                    validCells = dragCells;
                settings.startDrag(curEle,validCells);
            }
        });
        
        dragCells.droppable({
            drop: function( event, ui ) {
                // console.log(event.type); //ondrop 在一个拖动过程中，释放鼠标键时触发此事件
                var dragObj = ui.draggable,
                    dropObj = $(this);
                var obj = dragObj.data("obj"),
                      html = dragObj.html();
                  dragObj.data("obj", dropObj.data("obj")).html(dropObj.html());
                  dropObj.data("obj", obj).html(html);

                  settings.stopDrag(dragObj,dropObj);
            }
        });
    };

    //所有值
    this.getValues = function() {
        var cells = {};
        _this.find(settings.cell).each(function(index, element){
          var key = $(element).data("key"),
              val = $(element).data("obj");
          cells[key] = val;
        });
        return cells;
    };

    init();
      return this;
};

$(".dragTable").dragTableCell();


// 打开modal
$("[data-modal]").click(function(){
    var _this = $(this),
        title = _this.data('title'),
        modal = _this.data('modal'),
        $modal = $(modal);

    $modal.find('.modal-title').text(title);   
    $modal.modal('show');
});