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

/*异步加载文件*/
var classcodes = []; //已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载
window.Import = {
    /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
    LoadFileList: function (_files, succes) {
        var FileArray = [];
        if (typeof _files === "object") {
            FileArray = _files;
        } else {
            /*如果文件列表是字符串，则用,切分成数组*/
            if (typeof _files === "string") {
                FileArray = _files.split(",");
            }
        }
        if (FileArray != null && FileArray.length > 0) {
            var LoadedCount = 0;
            for (var i = 0; i < FileArray.length; i++) {
                loadFile(FileArray[i], function () {
                    LoadedCount++;
                    if (LoadedCount == FileArray.length) {
                        succes();
                    }
                })
            }
        }
        /*加载JS文件,url:文件路径,success:加载成功回调函数*/
        function loadFile(url, success) {
            if (!FileIsExt(classcodes, url)) {
                var ThisType = GetFileType(url);
                var fileObj = null;
                if (ThisType == ".js") {
                    fileObj = document.createElement('script');
                    fileObj.src = url;
                } else if (ThisType == ".css") {
                    fileObj = document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel = "stylesheet";
                } else if (ThisType == ".less") {
                    fileObj = document.createElement('link');
                    fileObj.href = url;
                    fileObj.type = "text/css";
                    fileObj.rel = "stylesheet/less";
                }
                success = success || function () { };
                fileObj.onload = fileObj.onreadystatechange = function () {
                    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                        success();
                        classcodes.push(url)
                    }
                }
                document.getElementsByTagName('head')[0].appendChild(fileObj);
            } else {
                success();
            }
        }
        /*获取文件类型,后缀名，小写*/
        function GetFileType(url) {
            if (url != null && url.length > 0) {
                return url.substr(url.lastIndexOf(".")).toLowerCase();
            }
            return "";
        }
        /*文件是否已加载*/
        function FileIsExt(FileArray, _url) {
            if (FileArray != null && FileArray.length > 0) {
                var len = FileArray.length;
                for (var i = 0; i < len; i++) {
                    if (FileArray[i] == _url) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}


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


// 日期选择
(function (obj) {
    if (!obj.length) { return; }

    var datepickerFile = ["static/vendor/datepicker/bootstrap-datepicker.min.css", "static/vendor/datepicker/bootstrap-datepicker.min.js"];
    Import.LoadFileList(datepickerFile, function () {
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
        });
        dp.next().on("click", function () {
            $(this).prev().focus();
        });
        //时间段限制
        $('.input-daterange').each(function(){
            var datep = $(this).find(obj);
            datep.on('changeDate', function(e){
                var chosenDate = e.date;
                if (datep.index($(this))){
                    datep.eq(0).datepicker('setEndDate', chosenDate);
                }else{
                    datep.eq(1).datepicker('setStartDate', chosenDate);
                }
            });
        });

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


// 表格复选框 全选
$('table thead th input:checkbox').on('click', function () {
    var that = this;
    $(this).closest('table').find('tr > td:first-child input:checkbox')
        .each(function () {
            this.checked = that.checked;
            // $(this).closest('tr').toggleClass('selected');
        });
});


// 打开 模态框
$('[data-modal]').on('click', function(){
    var $modal = $($(this).attr('data-modal'));
    $modal.modal('show');
});