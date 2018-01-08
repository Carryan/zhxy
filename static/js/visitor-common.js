
// 日期选择
(function(obj){
    if(!obj.length) { return; }
    
    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };

    obj.datepicker({
        autoclose:true,
        zIndexOffset: 9999,
        format: "yyyy-mm-dd",
        language: "zh-CN",
        todayHighlight: true
    }).next().on("click", function(){
        $(this).prev().focus();
    });

})($('.date-picker'));

//时间选择
(function(obj){
    if(!obj.length) { return; }

    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };

    var now = new Date();
    obj.datetimepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd hh:ii',
        // endDate: now,
        startView: 0,
        // minuteStep: 1,
        initialDate: obj.val() || now,
        todayHighlight: true
    }).next().on("click", function(){
        $(this).prev().focus();
    });

})($('.datetime-picker'));


// 下拉框
function dropdown(container, btn, list) {
    
    var dropdownList = $(container).find(list);
    $(container).find(btn).on('click', function(event) {
        event.stopPropagation();
        var thisList = $(this).siblings(list);
        dropdownList.hide();
        thisList.toggle();
    });

    
    $(document).click(function(event) {
        var eo = $(event.target);
        if(dropdownList.is(":visible") && !eo.is(list) && !eo.parent(list).length) {
            dropdownList.hide();
        }
    });

    dropdownList.find('a').click(function(){
        var value = $(this).text(),
            thisBtn = $(this).parents(container).find(btn);
        thisBtn.val(value);
    });
}
dropdown(".select-input", ".dropdown-btn", ".dropdown-menu");



