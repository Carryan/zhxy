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
            cell: "td", //有效元素
            drop: "", //可放置元素
            val: ".val",
            cache: ".cache",
            disabled: ".disabled", //无效元素 
            container: this.selector,
            //监听拖拽前的函数, 参数：当前元素，所有有效元素
            startDrag: function(curCell, allCells){ },
            //监听拖拽后的函数，可配置（参数:置换及置换后的ele）
            // stopDrag: function(dragFrom,dragTo){ }
        };
        
        var settings = $.extend({}, defaults, options);
        var _this = this;

        var cells = _this.find(settings.cell).not(settings.disabled); //有效元素
        var dragCells = cells; // 可拖拽元素
        if(settings.drop){
            var $drop = $(settings.drop); // 可放置元素
        }else{
            var $drop = cells;
        }
        var cache = $drop.filter(settings.cache); //缓存区
        var notCache = $drop.not(settings.cache); //非缓存区
    
        function init() {
            
            dragCells.draggable({
                revert: "invalid",
                addClasses: false,
                appendTo: _this.find('.fix-list'),
                // cancel: settings.disabled,
                containment: settings.container,//拖拽范围容器
                scrollSensitivity: 50,
                helper: function(){
                    var ele = $(this).clone(),
                        w = $(this).width(),
                        h = $(this).height();
                    ele.find(settings.val).width(w).height(h);
                    return ele;
                },
                start: function( event, ui ) {
                    var cur = $(this), all = $drop;
                    settings.startDrag(cur, all);
                },
                drag: function( event, ui ) {
                    var w = _this.width(),
                        in_w = _this.find('.table-box').outerWidth(),
                        m_s = in_w - w;
                    if(_this.scrollLeft()>=m_s) _this.scrollLeft(m_s);
                }

            });
            
            $drop.droppable({
                addClasses: false,
                disabled: true,
                // greedy: true,
                // activeClass: "acceptable"
            });
            
            cache.droppable( "enable"); //缓冲区长久可放置

        };

        function hasValue(obj) {
            var val = obj.find(settings.val);
            if(!val.is('[data-val]') || val.hasClass('cell-muted') || !val.data('val')) {
                return false;
            }else{
                return true;
            }
        }
        
        function exchange(from, to, html) {
            if(from.is(cache))
            {
                if(to.is(cache)){
                    to.html(from.html());
                    from.html(html);
                }else{
                    if(hasValue(to)){
                        to.html(from.html());
                        from.html(html);
                    }else{
                        to.html(from.html());
                        from.html('<div class="val"></div>');
                    }
                }
            }
            else
            {
                if(hasValue(to)){
                    to.html(from.html());
                    from.html(html);
                }else{
                    to.html(from.html());
                    from.find('.val').addClass('cell-muted'); //添加痕迹
                }
            }
        }

        // 选择、取消选择元素
        function selecting(isSlt, clas, curCell) {
            if(isSlt) { //选
                _this.slcting.isSelected = true;
                _this.slcting.curCell = curCell;
                curCell.addClass(clas);
            }else{ //取消选择
                _this.slcting.curCell.removeClass(clas);
                _this.slcting.isSelected = false;
                _this.render();
            }
        }

        // 开始拖拽
        dragCells.on("dragstart", function(event, ui) {
            var cur = $(this), all = $drop;

            if(!hasValue(cur)) return false;

            if(_this.slcting.isSelected) { //有被选元素时
                cur.removeClass('cell-selected').addClass('cell-dragging');
                if(cur.is(_this.slcting.curCell)){ //当前元素是被选元素时
                    _this.trigger("startDragging", [cur, all]);
                }else{
                    return false;
                }
            }else{
                selecting(true, "cell-dragging",cur);
                _this.trigger("startDragging", [cur, all]);
            }
            _this.lastDone = false;
        } );

        // 停止拖拽事件
        dragCells.on("dragstop", function(event, ui){
            selecting(false, "cell-dragging");
            _this.trigger("stop", $drop);
        });

        // 放置事件
        $drop.on( "drop", function( event, ui ) {
            var dragObj = ui.draggable,
                dropHtml = $(this).html();
            
            exchange(dragObj, $(this), dropHtml);

            _this.trigger("drop", $drop);
            _this.lastDone = true;
        } );

        // 点击事件
        cells.on("click", function(event){
            var cur = $(this), all = cells;
            
            if(_this.slcting.isSelected)
            {
                if(cur.is(_this.slcting.curCell))
                {
                    selecting(false, "cell-selected");
                    _this.lastDone = false;
                }
                else if(cur.hasClass('acceptable')||cur.is(settings.cache))
                {
                    var dropHtml = cur.html();
                    exchange(_this.slcting.curCell, cur, dropHtml);
                    selecting(false, "cell-selected");
                    _this.lastDone = true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                if(!hasValue(cur)) return ;
                selecting(true, "cell-selected", cur);
                _this.trigger("startDragging", [cur, all]);
                _this.lastDone = false;
            }

        });

        // 是否完成上一个移动或交换
        this.lastDone = true;

        // 是否有元素被选
        this.slcting = {
            isSelected: false,
            curCell: {}
        };
    
        //所有值
        this.getValues = function(o) {
            var obj = arguments[0] ? arguments[0] : cells;
            var cels = {};
            obj.each(function(){
                var key = $(this).data("key"),
                    v = $(this).find(".val"),
                    val = v.hasClass('cell-muted') ? " " : v.data("val"); //是否为痕迹
                if(key){
                    cels[key] = val;
                }
            });
            return cels;
        };

        this.render = function(enableKey,disableReason) {
            if(arguments.length==2){
                notCache.each(function(){
                    var k= $(this).data('key');
                    if(enableKey.indexOf(k)!=-1) {
                        $(this).droppable( "enable" );
                        $(this).addClass('acceptable');
                    }else{
                        $(this).attr("title", disableReason[k]);
                    }
                });
            }else{
                notCache.droppable( "disable" );
                notCache.removeClass('acceptable').removeAttr('title'); //通过acceptable判断是否可移
            }
        }

        // 激活放置
        this.activeDrop = function(obj) {
            obj.droppable( "enable" );
        };
        // 禁止放置
        this.disableDrop = function(o) {
            var obj = arguments[0] ? arguments[0] : notCache;
            obj.droppable( "disable" );
        };
        // 禁止拖拽
        this.disableDrag = function(o) {
            var obj = arguments[0] ? arguments[0] : dragCells;
            obj.draggable( "disable" );
        }
        // 允许拖拽
        this.enableDrag = function(o) {
            var obj = arguments[0] ? arguments[0] : dragCells;
            obj.draggable( "enable");
        }

        init();
        return this;
    }

})($(".dragTable"));


// select table
(function(obj){
    if(!obj.length) return ;
    var select_table = obj.selectTable();

    $("#submitSelect").click(function(){
        var s_texts="", s_vals="";
        var selected = select_table.getSelected();
        for(var i=0; i<selected.length; i++){
            if(i>0){
                s_texts = s_texts + "、";
                s_vals = s_vals + ",";
            }
            s_texts = s_texts + $(selected[i]).data('text');
            s_vals = s_vals + $(selected[i]).data('val');
        }

        $(this).parents(".modal").modal('hide');

        var td = $(this).data().parents('td');
        td.find('.text').text(s_texts);
        td.find('input').val(s_vals);
    });

    $("#m-cus-select").on('hide.bs.modal', function(){
        select_table.clearAll();
    });

})($('.cus-select'));

// 打开modal
selectModel();

function selectModel() {
    $("[data-modal]").click(function(){
        var _this = $(this),
            title = _this.data('title'),
            modal = _this.data('modal'),
            _class = _this.data('class'),
            rs = _this.data('reason'),
            $modal = $(modal);
        
        $modal.find('#submitSelect').data(_this);
        $modal.find('.modal-title').text(title);
        
        // 被选单元
        var vals = $(this).parents('td').find('input').val();
        if(vals){
            if(rs) {
                var reason = $(this).parents('td').find('.text input'),
                    r_num = 0;
            }
            var m_td = $modal.find('td');
            m_td.each(function(index){
                var v = $(this).attr("data-val");
                if(vals.indexOf(v)!=-1){
                    $(this).addClass('selected');

                    // 有无课原因
                    if(rs) {
                        var cur_td = $(this);
                        cur_td.append('<span class="reason">'+reason.eq(r_num).val()+'</span> <i class="icon-edit edit"></i>');
                        r_num++;
                        cur_td.find('.edit').click(function(event){
                            event.stopPropagation();
                            cur_td.find('.reason, .edit').addClass('hidden');
                            cur_td.append('<input type="text"> <i class="icon-ok ok"></i> <i class="icon-remove delete"></i>');
                            cur_td.find('input').click(function(e){
                                e.stopPropagation();
                            });
                            cur_td.find('.ok').click(function(e){
                                e.stopPropagation();
                                cur_td.find('input, .ok, .delete').remove();
                                cur_td.find('.reason, .edit').removeClass('hidden');
                            });
                        });
                    }
                }
            });
        }

        // 添加类（蓝色单元格）
        if(_class){
            $modal.addClass(_class);
            $modal.on('hide.bs.modal', function(){
                $modal.removeClass(_class);
            });
        }
        
        $modal.css("top", _this.offset().top - 600 > 0 ? _this.offset().top - 600 : 0);
        $modal.modal('show');
    });
}

function noClassReason() {
    var r_num = 0;
    console.log(r_num);
}


// 显示教师
(function(obj){
    if(!obj.length) return ;

    var table = obj.data('table');
    // if(obj.is(":checked")) {
    //     $(table).addClass('show-msg');
    // }
    obj.change(function(){
        if($(this).is(":checked")){
            $(table).addClass('show-msg');
        }else{
            $(table).removeClass('show-msg');
            $(".fix-table-box").scrollLeft(0);
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


// 删除表格新增的行
function deleteNewRow(t){
    var tr = $(t).parents('tr');
    tr.remove();
}


// 选择框
(function(obj){
    if(!obj.length) return ;
    obj.chosen({width: 'auto'});
})($(".chosen-select"));


// 右侧固定
$(".fix-table-box").scroll(function(){
    var f = $(this).find(".fix-list"),
        $this = $(this);
    f.css('right', -$this.scrollLeft());
    // console.log($this.scrollLeft());
});
// $(window).resize(function(){
//     var ob = $(".fix-table-box");
//         f = ob.find(".fix-list");
//         console.log(ob.width(), ob.scrollLeft());
//     if(ob.width()<ob.scrollLeft()){
//         f.css('right', -ob.width());
//     }
// });

