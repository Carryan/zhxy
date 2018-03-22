
// 表格添加行
function addRow(table, rowStr) { 
    var $table = (Object.prototype.toString.call(table) === "[object String]") ? $(table) : table, 
        $tbody = $table.find('tbody') || $table,
        $str = (Object.prototype.toString.call(table) === "[object String]") ? $(rowStr) : rowStr;
    console.log($str);
    $str.find('.remove').on('click', function (event) {
        $str.remove();
    });
    $tbody.append($str);
 }

 function editRow(row, rowStr) {
     var $row = $(row);
     $row.hide().after(rowStr);
 }


// 模板引擎，替换 {{ }} 中的内容
attachTemplateToData = function (template, data) {
    var i = 0,
        len = data.length,
        fragment = '';

    // 遍历数据集合里的每一个项，做相应的替换
    function replace(obj) {
        var t, key, reg;
        //遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
        for (key in obj) {
            reg = new RegExp('{{' + key + '}}', 'ig');
            t = (t || template).replace(reg, obj[key]);
        }
        return t;
    }

    for (; i < len; i++) {
        fragment += replace(data[i]);
    }

    return fragment; //绑定数据后的模板字符串
};


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

// 文件上传
$(function ($) {
    $('#addFileUpload').ace_file_input({
        style: 'well',
        btn_choose: 'Drop files here or click to choose',
        btn_change: null,
        no_icon: 'icon-cloud-upload',
        droppable: true,
        thumbnail: 'small'
    });
});