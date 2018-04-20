
// indexOf 兼容性
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

//禁止enter提交表单
$('form').on('keydown', function(){
    if (event.keyCode == 13) return false;
});


// 可拖拽表
;(function (obj) {
    if (!obj.length) return false;

    $.fn.dragTableCell = function (options) {
        var defaults = {
            cell: "td", //有效元素
            drop: "", //可放置元素
            val: ".val", //存值元素
            cache: ".cache", //缓冲区
            disabled: ".disabled", //无效元素 
            container: this.selector,
            scroll_left: 100, //左侧滚动触发距离
            scroll_right: 90,
            isDblclick: false //是否触发双击事件
        };

        var settings = $.extend({}, defaults, options);
        var _this = this;

        var cells = _this.find(settings.cell).not(settings.disabled); //有效元素
        var dragCells = cells; // 可拖拽元素
        if (settings.drop) {
            var $drop = $(settings.drop); // 可放置元素
        } else {
            var $drop = cells;
        }
        var cache = $drop.filter(settings.cache); //缓存区
        var notCache = $drop.not(settings.cache); //非缓存区

        var alert = _this.find('.table-alert'), //提示框
            alert_text = alert.find('.text');

        function init() {

            dragCells.draggable({
                revert: "invalid",
                addClasses: false,
                appendTo: _this,
                cancel: settings.disabled,
                containment: settings.container,//拖拽范围容器
                scroll: false,
                distance: 10, //拖拽开始前必须移动的距离
                helper: function () {
                    var ele = $(this).clone(),
                        w = $(this).width(),
                        h = $(this).height();
                    ele.find(settings.val).width(w).height(h);
                    return ele;
                },
                // 滚动条滚动 不触发 drag事件
                drag: function (event, ui) {
                    // ui.position helper相对父元素距离，ui.offset helper相对文档距离
                    var fixInner = _this.find('.fix-inner');
                    if (fixInner[0] && hasScrolled(fixInner[0], 'horizontal')) {
                        // 自定义滚动事件
                        var srl = fixInner.scrollLeft(),
                            c_w = _this.width();
                        if (ui.position.left < settings.scroll_left) {
                            fixInner.scrollLeft(srl - 25);
                        } else if (ui.position.left > c_w - settings.scroll_right) {
                            fixInner.scrollLeft(srl + 25);
                        }
                        // 最大滚动距离
                        // var m_s = infixInner.find('.table-box').outerWidth() - fixInner.width();
                        // if (fixInner.scrollLeft() > m_s) fixInner.scrollLeft(m_s);
                    }

                }

            });

            $drop.droppable({
                addClasses: false,
                disabled: true,
                // greedy: true,
                // activeClass: "acceptable"
            });

        };

        // 判断元素是否有效（有val子元素，该子元素有data-val属性）
        function hasValue(obj) {
            var val = obj.find(settings.val);
            if (!val.is('[data-val]') || val.hasClass('cell-muted') || !val.data('val')) {
                return false;
            } else {
                return true;
            }
        }

        function exchange(from, to, html) {
            if (from.is(cache)) { //被拖元素在缓冲区
                if (to.is(cache)) {
                    to.html(from.html());
                    from.html(html);
                } else {
                    if (hasValue(to)) {
                        to.html(from.html());
                        from.html(html);
                    } else {
                        to.html(from.html());
                        from.html('<div class="val"></div>');
                    }
                }
            }
            else { //被拖元素不在缓冲区
                // to.html(from.html());
                // from.html(html);
                if (hasValue(to)) {
                    to.html(from.html());
                    from.html(html);
                } else {
                    to.html(from.html());
                    from.find('.val').addClass('cell-muted'); //添加痕迹
                }
            }
            _this.render();
            _this.trigger("exchange", [from, to]); //定义放置事件
            _this.lastDone = true;
        }

        // 选择、取消选择元素
        function selecting(isSlt, clas, curCell) {
            // console.log(_this.lastDone);
            if (isSlt) { //选择
                _this.slcting.isSelected = true;
                _this.slcting.lastCell = _this.slcting.curCell;
                _this.slcting.curCell = curCell;
                curCell.addClass(clas);
            } else { //取消选择（选中后、不选）
                _this.slcting.curCell.removeClass(clas);
                _this.slcting.isSelected = false;
                if (!_this.lastDone) { //取消移动时
                    _this.render();
                    _this.trigger("cancelMove", $(this));
                } 
            }
        }

        // 开始拖拽
        dragCells.on("dragstart", function (event, ui) {
            var cur = $(this), all = cells;

            if (!hasValue(cur)) return false;

            if (!_this.isDrop) _this.lastDone = false;
            if (_this.slcting.isSelected) { //有被选元素时
                if (cur.is(_this.slcting.curCell)) { //当前元素是被选元素时
                    cur.removeClass('cell-selected').addClass('cell-dragging');
                    _this.trigger("startDragging", [cur, all]);
                } else {
                    return false;
                }
            } else {
                selecting(true, "cell-dragging", cur);
                _this.trigger("startDragging", [cur, all]);
            }
            _this.isDrop = false;
        });

        // 停止拖拽事件
        dragCells.on("dragstop", function (event, ui) {
            _this.isDrop ? _this.isDrop = true : _this.isDrop = false;
            selecting(false, "cell-dragging");
        });

        // 放置事件
        $drop.on("drop", function (event, ui) {
            var dragObj = ui.draggable,
                dropHtml = $(this).html();

            exchange(dragObj, $(this), dropHtml);
            _this.isDrop = true;
        });

        // 点击事件
        var clicker = null;
        cells.on("click", function (event) {
            var cur = $(this), all = cells;
            
            // 避免双击 触发 单击事件
            if(settings.isDblclick){
                clearTimeout(clicker);
                clicker = setTimeout(function () {
                    clickFun();
                }, 300);
            }else{
                clickFun();
            }
            
            function clickFun() {
                if (_this.slcting.isSelected) //已有被选
                {
                    if (cur.is(_this.slcting.curCell)) //当前元素 是 被选元素
                    {
                        _this.lastDone = false;
                        selecting(false, "cell-selected"); //取消移动
                    }
                    else if (cur.hasClass('acceptable')) { //可接受元素
                        var dropHtml = cur.html();
                        selecting(false, "cell-selected"); 
                        exchange(_this.slcting.curCell, cur, dropHtml);
                    }
                    else {
                        alert_text.text(cur.attr('title'));
                        alert.stop().css('left', _this.width() / 2 + _this.scrollLeft()).fadeIn(function () {
                            $(this).delay(2000).fadeOut();
                        });
                        return false;
                    }
                }
                else {
                    if (!hasValue(cur)) return;
                    selecting(true, "cell-selected", cur);
                    _this.trigger("startDragging", [cur, all]);
                }
            }

        });

        // 双击 放入缓冲  // 会触发单击事件
        if (settings.isDblclick) {
            cells.on('dblclick', function () {
                clearTimeout(clicker);
                var cur = $(this);
                if (_this.slcting.isSelected || !hasValue(cur) || cur.is(cache)) return false;
                cache.filter(':visible').each(function () {
                    if (!hasValue($(this))) {
                        var dropHtml = cur.html();
                        exchange(cur, $(this), dropHtml);
                        return false;
                    }
                });
            });
        }

        // 是否完成上一个移动或交换
        this.lastDone = true;

        // 是否已经放置
        this.isDrop = true;

        // 是否有元素被选
        this.slcting = {
            isSelected: false,
            curCell: {},
            lastCell: {}
        };

        //所有值
        this.getValues = function (o) {
            var obj = arguments[0] ? arguments[0] : cells;
            var cels = {};
            obj.each(function () {
                var key = $(this).data("key"),
                    v = $(this).find(".val"),
                    val = v.hasClass('cell-muted') ? " " : v.data("val"); //是否为痕迹
                if (key) {
                    cels[key] = val || "";
                }
            });
            return cels;
        };

        // 渲染
        this.render = function (param) {
            var ps = $.extend({
                        "enable": [],
                        "bug": [],
                        "title": {}
                    }, param);
            var enable = ps.enable,
                bug = ps.bug,
                title = ps.title;

            cells.each(function () {
                var k = $(this).data('key');
                // 是否可移动
                if (enable.indexOf(k) != -1) {
                    $(this).droppable("enable");
                    $(this).addClass('acceptable');
                } else {
                    $(this).droppable("disable");
                    $(this).removeClass('acceptable');
                }
                // 是否为 bug元素 
                if (bug.indexOf(k) != -1) {
                    $(this).addClass('cell-bug');
                } else {
                    $(this).removeClass('cell-bug');
                }
                // 是否添加标题
                if (title.hasOwnProperty(k)) {
                    $(this).attr('title', title[k]);
                }else{
                    $(this).removeAttr('title');
                }
            });
        }

        init();
        return this;
    }

    // 提示框 关闭
    $('.table-alert .close').click(function () {
        $(this).parents('.table-alert').stop().fadeOut();
    });

})($(".dragTable"));


// select table
(function (obj) {
    if (!obj.length) return;

    // 选择表 插件
    $.fn.selectTable = function (ops) {
        var defaults = {
            cell: "td", //有效元素
            disabled: ".disabled", //无法选中元素
            selectedClass: "selected", //被选中元素的类名
            pause: function (cur) {
                var input = cur.find('input');
                if (input.length) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        var settings = $.extend({}, defaults, ops);
        var _this = this;

        _this._status = { disable: false }

        function init() {

            _this.find(settings.cell).click(function () {

                if (_this._status.disable || settings.pause($(this))) return;

                var this_cell = $(this),
                    selectedClass = settings.selectedClass;

                if (this_cell.is(settings.disabled)) return;

                if (this_cell.hasClass(selectedClass)) {
                    this_cell.removeClass(selectedClass);
                } else {
                    this_cell.addClass(selectedClass);
                }
            });
        }

        this.allCells = _this.find(settings.cell);

        this.getSelected = function () {
            return _this.find('.' + settings.selectedClass);
        }
        this.getValues = function () {
            var vals = [];
            this.getSelected().each(function () {
                vals.push($(this).data('val'));
            });
            return vals;
        }
        this.clearAll = function () { //清空
            _this.find('.' + settings.selectedClass).each(function () {
                $(this).removeClass(settings.selectedClass);
            });
        }
        this.selectAll = function () { //全选
            var enable_cells = _this.find(settings.cell).not(settings.disabled);
            enable_cells.each(function () {
                $(this).addClass(settings.selectedClass);
            });
        }
        this.disable = function () { //禁止
            this._status.disable = true;
        }
        this.enable = function () {
            this._status.disable = false;
        }

        init();
        return this;
    }

    var select_table = obj.selectTable();

    //禁止单元格选择
    $.fn.disableCells = function(disCells,text){
        this.find('td').removeClass('disabled').text('');
        if (arguments.length>1){
            this.find(disCells).addClass('disabled').text(text);
        }else{
            this.find(disCells).addClass('disabled');
        }     
    };

    // 确定选择
    $("#submitSelect").click(function () {
        var modal = $(this).parents(".modal"),
            noRsn = modal.hasClass('no-reason');
        var s_texts = "", s_vals = "", reason_input = '';

        var selected = select_table.getSelected();
        var origin_btn = $(this).data('btn'), //打开modal的按钮
            td = origin_btn.parents('.td-edit');

        for (var i = 0; i < selected.length; i++) {
            if (i > 0) {
                s_texts = s_texts + "、";
                s_vals = s_vals + ",";
            }
            if (!noRsn) {
                var t = $(selected[i]).find('.reason').text();
                s_texts = s_texts + $(selected[i]).data('text') + (t ? '（' + t + '）' : '');
                s_vals = s_vals + $(selected[i]).data('val');
                reason_input = reason_input + '<input type="hidden" name="' + origin_btn.data('reason').replace("_?_", i) + '" value="' + t + '">';
            } else {
                s_texts = s_texts + $(selected[i]).data('text');
                s_vals = s_vals + $(selected[i]).data('val');
            }
        }

        modal.modal('hide');

        td.find('.text').text(s_texts).append(reason_input);
        td.children('input').val(s_vals);
    });

    // 关模态框 还原选择表
    $("#m-cus-select").on('hide.bs.modal', function () {
        select_table.clearAll();
        if (!$(this).hasClass('no-reason')) {
            select_table.allCells.find('.reason').text('').siblings('input, .ok, .delete').remove();
            select_table.allCells.find('.reason, .edit').removeClass('hidden');
        }
    });

    // 编辑原因
    $('.cus-select td .edit').click(function (event) {
        event.stopPropagation();
        var cur_td = $(this).parent(),
            rson = $(this).siblings('.reason');
        cur_td.find('.reason, .edit').addClass('hidden');
        cur_td.append('<input type="text" value="' + cur_td.find('.reason').text() + '" maxlength="6"> <i class="icon-ok ok"></i> <i class="icon-remove delete"></i>');
        cur_td.find('input').click(function (e) {
            e.stopPropagation(); //取消冒泡 触发td的点击事件
        }).keyup(function(event){
            if (event.keyCode == 13) $(this).siblings('.ok').click(); //回车键
        });
        cur_td.find('.ok, .delete').click(function (e) {
            e.stopPropagation();
            if ($(this).is('.ok')) {
                rson.text(cur_td.find('input').val());
            } else {
                rson.text('');
            }
            cur_td.find('input, .ok, .delete').remove();
            cur_td.find('.reason, .edit').removeClass('hidden');
        });
    });

})($('.cus-select'));

// 打开modal
selectModel();

function selectModel() {

    $("[data-modal]").off("click").on("click", function () {
        var _this = $(this),
            title = _this.data('title'),
            modal = _this.data('modal'),
            _class = _this.data('class'),
            rs = _this.data('reason'),
            $modal = $(modal);

        //绑定 当前按钮 给modal
        $modal.find('#submitSelect').data('btn', _this); 

        $modal.find('.modal-title').text(title);

        // 被选单元
        var vals = $(this).parents('.td-edit').children('input').val();
        if (vals) {
            if (rs) {
                var reason = $(this).parents('.td-edit').find('.text input'),
                    r_num = 0;
            }
            var m_td = $modal.find('td');
            m_td.each(function (index) {
                var v = $(this).attr("data-val");
                if (vals.indexOf(v) != -1) {
                    $(this).addClass('selected');

                    // 添加无课原因
                    if (rs) {
                        var rson = $(this).find('.reason');
                        rson.text(reason.eq(r_num).val());
                        r_num++;
                    }
                }
            });
        }

        // 添加类（蓝色单元格）
        if (_class) {
            $modal.addClass(_class);
            $modal.on('hide.bs.modal', function () {
                $modal.removeClass(_class);
            });
        }

        // 不需要 原因 时
        if (!rs) {
            $modal.addClass('no-reason');
            $modal.on('hide.bs.modal', function () {
                $modal.removeClass('no-reason');
            });
        }

        //模态框位置
        // $modal.css("top", _this.offset().top - 600 > 0 ? _this.offset().top - 600 : 0);
        $modal.modal('show');
    });
}


// 显示教师
(function (obj) {
    if (!obj.length) return;

    obj.change(function () {
        var table = $(this).data('table');
        if ($(this).is(":checked")) {
            $(table).addClass('show-msg');
        } else {
            $(table).removeClass('show-msg');
            $(".fix-table-box").scrollLeft(0);
        }
    });
})($("#showTeacher, .show-teacher"));

// 显示年级
(function (obj) {
    if (!obj.length) return;

    obj.change(function () {
        var table = $(this).data('table'),
            val = $(this).val();
        if (val) {
            $(table).find('tbody tr').each(function () {
                $(this).data('row') == val ? $(this).show() : $(this).hide();
            });
        } else {
            $(table).find('tbody tr').show();
        }
    });
})($("#showRow"));


// 选择节次
(function (obj) {
    if (!obj.length) return;

    obj.find('select').change(function () {
        var cm = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八'],
            i = 0;
        obj.find('select').each(function () {
            var list = '', j = 0;
            while (j < $(this).val()) {
                list = list + '<span>第' + cm[i] + '节</span>';
                j++;
                i++;
            }
            $(this).next().html(list);
        });
    });
})($(".course-num-select"));


// 删除表格新增的行
function deleteNewRow(t) {
    var tr = $(t).parents('tr');
    tr.remove();
}


// 选择框
(function (obj) {
    if (!obj.length) return;
    obj.chosen({ width: 'auto' });
})($(".chosen-select"));


// 日期选择
(function (obj) {
    if (!obj.length) { return; }

    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };

    var dp = obj.datepicker({
        autoclose: true,
        zIndexOffset: 9999,
        format: "yyyy-mm-dd",
        language: "zh-CN",
        todayHighlight: true
    }).next().on("click", function () {
        $(this).prev().focus();
    });

})($('.date-picker'));


//判断是否存在滚动条 
function hasScrolled(el, direction) {
    if (direction === "vertical") {
        return el.scrollHeight > el.clientHeight;
    } else if (direction === "horizontal") {
        return el.scrollWidth > el.clientWidth;
    }
}

// 固定列
// $(".fix-table-box").scroll(function(){
//     var $this = $(this),
//         fr = $this.find(".fix-right"),
//         fl = $this.find(".fix-left");
//     // ie css渲染跟不上scroll速度
//     fr.css('right', -$this.scrollLeft());
//     fl.css('left', $this.scrollLeft());
// });

// 交换内容，from/to 为jQuery对象
function exchangeHtml(from, to) {
    var t = from.html();
    from.html(to.html());
    to.html(t);
}