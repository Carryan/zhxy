/*异步加载文件*/
var classcodes = []; //已加载文件缓存列表,用于判断文件是否已加载过，若已加载则不再次加载
window.Import = {
    /*加载一批文件，_files:文件路径数组,可包括js,css,less文件,succes:加载成功回调函数*/
    LoadFileList: function (_files, succes) {
        var FileArray = [];
        if (!arguments[1]) {
            var succes = function(){};
        }
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

//重新刷新页面，使用location.reload()有可能导致重新提交
function reloadPage(win) {
    win = win || window;
    var location = win.location;
    location.href = location.pathname + location.search;
}


// 可编辑表格
;(function (obj) { 
    if (!obj.length) return;

    $.fn.editTable = function(opts) {
        var defaults = {
            'addBtn': '.add-btn',
            'saveBtn': '.save',
            'editBtn': '.edit',
            'cancelBtn': '.cancel',
            'deleteBtn': '.delete',
            'temp': '#template',
            'saveTemp': '#saveTemplate',
            'editFun': function (thisTr, texts, editeCallback) { }
        }
        var stg = $.extend({}, defaults, opts);

        var $this = this;

        function init() {
            //添加
            $(stg.addBtn).on('click', function(){
                var $tbody = $this.find('tbody') || $this,
                    temp = $(stg.temp).tmpl();
                $tbody.append(temp);
                // 取消添加
                temp.find(stg.cancelBtn).on('click', function (event) {
                    event.preventDefault();
                    temp.remove();
                });
            });

            //编辑
            $this.on('click', stg.editBtn, function(event){
                event.preventDefault();
                var thisTr = $(this).parents('tr').first();
                var texts = getTrText(thisTr);
                stg.editFun(thisTr, texts, editeCallback);
            });

            // 保存
            $this.on('click', stg.saveBtn, function (event) {
                event.preventDefault();
                var thisTr = $(this).parents('tr').first(),
                    url = $(this).data('href') || $(this).prop('href'),
                    reload = typeof $(this).attr('reload') != 'undefined',
                    values = getTrValues(thisTr),
                    loading;

                if (thisTr.data('loading')) return false;

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: values,
                    beforeSend: function(){
                        thisTr.data('loading', true);
                        loading = layer.msg('请稍后...', {icon: 16, shade: 0.01, time: 30 * 1000}); 
                    },
                    success: function(res){
                        if (res.state == 'ok'){
                            var temp = $(stg.saveTemp).tmpl(res.tempData);
                            layer.msg(res.msg ? res.msg : '操作成功!', { icon: 1, time: 1000 });
                            !reload && thisTr.data('loading', false) && thisTr.replaceWith(temp);
                            reload && setTimeout(function () { 
                                res.code && res.code.indexOf('CLOSE') != -1 && layer.closeAll();
                                if (res.jump) {
                                    window.location.href = res.jump;//返回带跳转地址
                                } else {
                                    if (res.code && res.code.indexOf('BACK') != -1) {
                                        window.history.go(-1);//返回上一页
                                    } else {
                                        reloadPage();//刷新当前页
                                    }
                                }
                             }, 1000);
                        }else{
                            layer.msg(res.msg, { icon: 2, anim: 6 });
                            thisTr.data('loading', false);
                        }
                        layer.close(loading);
                    },
                    error: function(){
                        layer.msg("保存失败！", { icon: 2 });
                    }
                });
            });

            // 删除
            $this.on('click', stg.deleteBtn, function (event) {
                event.preventDefault();
                var thisTr = $(this).parents('tr').first(),
                    url = $(this).data('href') || $(this).prop('href'),
                    reload = typeof $(this).attr('reload') != 'undefined';
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function(res){
                        if (res.state == 'ok') {
                            if (res.jump) {
                                location.href = res.jump;
                            } else {
                                if (reload){
                                    reloadPage(window);
                                }else{
                                    layer.msg(res.msg ? res.msg : '操作成功!', { icon: 1, time: 1000 });
                                    thisTr.remove();
                                }
                            }
                        }else{
                            layer.msg(res.msg, { icon: 2, anim: 6 });
                        }
                    },
                    error: function(){
                        layer.msg("删除失败！", { icon: 2 });
                    }
                });
            });
            
        }

        //编辑回调
        function editeCallback(thisTr, temp) {
            thisTr.replaceWith(temp);
            // 返回，取消编辑
            temp.find('.return').on('click', function () {
                event.preventDefault();
                temp.replaceWith(thisTr);
            });
        }

        // init();
        Import.LoadFileList(['static/js/jquery.tmpl.min.js','static/vendor/layer/layer.js'], function(){
            init();
        });

        return this;
    }

}($('.table-edit')));


 // 获取行文本值
 function getTrText(tr) {
     var $tr = (Object.prototype.toString.call(tr) === "[object String]") ? $(tr) : tr;
     var values = [];
     $tr.find('td').not(':last-child').each(function () {
         values.push($(this).text());
     });
     return values;
 }

// 获取行表单值
 function getTrValues(tr) {
     var $tr = (Object.prototype.toString.call(tr) === "[object String]") ? $(tr) : tr;
     var vs = $tr.find('[name]').serializeArray();
     return vs;
 }


// 日期选择
;(function (obj) {
    if (!obj.length) { return; }

    //异步加载 日历插件
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