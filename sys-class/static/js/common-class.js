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

    var saveTemp = '<script type="text/html" id="saveTemplate">'+
                        '<tr>'+
                            '{{each td}}'+
                            '<td>${$value}</td>'+
                            '{{/each}}'+
                            '<td>'+
                                '<span class="action-buttons">'+
                                    '<a href="javascript:;" class="edit">'+
                                        '<i class="icon-pencil green"></i>'+
                                    '</a>'+
                                    '<a href="{{= deleteUrl}}" class="delete">'+
                                        '<i class="icon-trash red"></i>'+
                                    '</a>'+
                                '</span>'+
                            '</td>'+
                        '</tr>'+
                    '</script>';

    $.fn.editTable = function(opts) {
        var defaults = {
            'addBtn': '.add-btn',
            'saveBtn': '.save',
            'editBtn': '.edit',
            'cancelBtn': '.cancel',
            'deleteBtn': '.delete',
            'isOrder': false, //是否有序号
            'temp': '#template',
            'initData': {},
            'editFun': function (thisTr, texts, editeCallback) { }
        }
        var stg = $.extend({}, defaults, opts);

        var $this = this;

        function init() {
            //添加
            $(stg.addBtn).on('click', function(){
                var $tbody = $this.find('tbody').first() || $this,
                    temp = $(stg.temp).tmpl(stg.initData);
                $tbody.append(temp);
                if(stg.isOrder) orderNum();
                // 取消添加
                temp.find(stg.cancelBtn).on('click', function (event) {
                    event.preventDefault();
                    temp.remove();
                    if(stg.isOrder) orderNum();
                });
                $this.trigger("addRow", [temp]);
            });

            //编辑
            $this.on('click', stg.editBtn, function(event){
                event.preventDefault();
                var thisTr = $(this).parents('tr').first();
                var texts = getTrText(thisTr);
                $this.trigger("editRow", [thisTr, texts, editeCallback]);
            });

            // 保存
            $this.on('click', stg.saveBtn, function (event) {
                event.preventDefault();
                var thisTr = $(this).parents('tr').first(),
                    url = $(this).data('href') || $(this).prop('href'),
                    reload = typeof $(this).attr('reload') != 'undefined',
                    values = verify_msg(thisTr.find("[name]")), // 获取值，并验证
                    loading;

                if (thisTr.data('loading') || !values) return false;

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
                            var temp = $(saveTemp).tmpl(res.tempData); //替换模板
                            if(stg.isOrder) temp.prepend("<td></td>");
                            layer.msg(res.msg ? res.msg : '操作成功!', { icon: 1, time: 1000 });
                            !reload && thisTr.data('loading', false) && thisTr.replaceWith(temp);
                            if(stg.isOrder) orderNum(); //排序
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
                                    if(stg.isOrder) orderNum();
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

        //编辑 回调
        function editeCallback(thisTr, temp) {
            thisTr.replaceWith(temp);
            // 返回，取消编辑
            temp.find('.return').on('click', function () {
                event.preventDefault();
                temp.replaceWith(thisTr);
            });
        }

        // 序号
        function orderNum() {
            var $tbody = $this.find('tbody').first() || $this;
            var num_td = $tbody.find("td:first-child").not(".empty-notice > td");
            num_td.each(function(index, element){
                $(element).text(index+1);
            });
        }

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


// 日期选择
;(function (obj) {
    if (!obj.length) return;

    setDatePicker(obj);

})($('.date-picker'));

function setDatePicker(obj) {
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
        obj.each(function(){
            var $this = $(this);
            var dp = $this.datepicker({
                autoclose: true,
                zIndexOffset: 9999,
                format: $this.attr("data-date-format") || "yyyy-mm-dd",
                language: "zh-CN",
                todayHighlight: true
            });
            dp.next().on("click", function () {
                $(this).prev().focus();
            });
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
}


// 文件上传
$(function ($) {
    $('#addFileUpload').ace_file_input({
        style: 'well',
        btn_choose: 'Drop files here or click to choose',
        btn_change: "Change",
        no_icon: 'icon-cloud-upload',
        droppable: true,
        thumbnail: 'small'
    });
});

// plupload 文件上传
(function (obj) {
    if (!obj.length) return;

    var flash_swf_url = 'static/vendor/plupload/Moxie.swf',
        silverlight_xap_url = 'static/vendor/plupload/Moxie.xap';

    Import.LoadFileList(['static/vendor/plupload/plupload.full.min.js', 'static/vendor/layer/layer.js'], function () {

        obj.each(function (index, element) {
            var $this = $(this),
                url = $this.data('url') || $this.prop('url'),
                remove_url = $this.data('removeurl') || $this.prop('removeurl') || "#",
                max_file_size = $this.data('maxsize') || "200mb",
                MAX_FILE_NUM = $this.data('maxnum') || 8, //最大可上传个数
                $upload_btn = $('.start-upload'), //上传按钮
                $preview = $(this).siblings('.preview'), //预览
                $input = $(this).siblings('upload-input'),
                $reset = $('.btn[type="reset"]'); //重置

            var uploader = new plupload.Uploader({
                browse_button: element,
                drop_element: element,
                url: url,
                max_file_size: max_file_size,
                // chunk_size: "100mb",
                flash_swf_url: flash_swf_url,
                silverlight_xap_url: silverlight_xap_url
            });

            uploader.init();

            //当文件添加到上传队列
            uploader.bind('FilesAdded', function (uploader, files) {
                var items = $preview.find('.file-item').not('[data-state="err"]');
                // 文件个数限制
                if (files.length + items.length > MAX_FILE_NUM) {
                    layer.msg("最多只能上传 " + MAX_FILE_NUM + " 个文件", { icon: 2 });
                    files.forEach(function (cur, index, arr) {
                        uploader.removeFile(cur);
                    });
                    return;
                }
                hideBoard();

                for (var i = 0, len = files.length; i < len; i++) {
                    var file_id = files[i].id;
                    previewImage(files[i], function (li) {
                        var $li = (Object.prototype.toString.call(li) === "[object String]") ? $(li) : li;
                        $li.attr({
                            "id": file_id,
                            "data-state": "add"
                        }).addClass("file-item");
                        $preview.append(li);
                    });
                }
                // 不存在上传按钮 则直接上传
                if (!$upload_btn.length) uploader.start();
            });

            //如果存在上传按钮
            if ($upload_btn.length) {
                $upload_btn.on('click', function (event) {
                    uploader.start();
                });
            }

            // 开始上传
            uploader.bind('UploadFile', function (uploader, file) {
                $('#' + file.id).attr("data-state", "loading");
            });
            //当队列中的某一个文件上传完成后
            uploader.bind('FileUploaded', function (uploader, file, data) {
                // console.log(file);
                var file_li = $('#' + file.id);
                if (data.status === 200) {
                    //data.response为返回的文本
                    var res = (Object.prototype.toString.call(data.response) === "[object String]") ? JSON.parse(data.response) : data.response;
                    if (res.state == "ok") {
                        file_li.attr({
                            "data-state": "loaded",
                            "data-file": res.fileData
                        });
                        // 上传成功事件
                        $this.trigger("uploaded");
                    } else {
                        layer.msg(file.name + " 上传失败！" + res.msg, { icon: 2 });
                        file_li.attr("data-state", "err");
                    }
                } else {
                    layer.msg(file.name + " 上传失败！", { icon: 2 });
                    file_li.attr("data-state", "err");
                }
            });
            // 删除文件
            $preview.on('click', '.remove-file', function () {
                event.preventDefault();
                var cur_li = $(this).parents('.file-item').first(),
                    state = cur_li.attr('data-state');
                if (state == "loaded") {
                    ajaxFileRemove(cur_li, remove_url, uploader);
                } else {
                    fileRemove(cur_li, uploader);
                }
            });
            // 重置
            $reset.on('click', function () {
                $preview.find('.remove-file').click();
            });
            //上传进度
            uploader.bind('UploadProgress', function (uploader, file) {
                var percent = file.percent,
                    item = $('#' + file.id);
                progress(percent, item);
            });

        });

        /******************* 可修改部分 ******************/

        // 预览
        function previewImage(file, callback) {
            console.log(file.type);
            var file_name = file.name;
            var li = '<div>' +
                '<div class="img-box">' +
                '<a href="#" class="remove-file"><i class="icon-remove"></i></a>' +
                '<div class="cover">' +
                '<span class="progressBar">0%</span>' +
                '<span class="errBar">!</span>' +
                '</div>' +
                '</div>' +
                '<p>' + file_name + '</p>' +
                '</div>';
            var $li = $(li);
            if ((/\.(jpe?g|png|gif|svg|ico|bmp|tiff?)$/i).test(file_name)) {
                if ((/\/(jpe?g|png)$/i).test(file.type)) {
                    var preloader = new mOxie.Image();
                    preloader.onload = function () {
                        preloader.downsize(100, 100);//先压缩一下要预览的图片
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        $li.find('.img-box').css('background-image', 'url(' + imgsrc + ')');
                        callback($li);
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load(file.getSource());
                } else {
                    var fr = new FileReader();
                    fr.onload = function () {
                        $li.find('.img-box').css('background-image', 'url(' + fr.result + ')');
                        callback($li);
                        fr = null;
                    }
                    fr.readAsDataURL(file.getNative());
                }
            } else {
                var src = "static/images/icon/file-icon.png";
                if ((/\.(mpe?g|flv|mov|avi|swf|mp4|mkv|webm|wmv|3gp)$/i).test(file_name)) { }
                if ((/\.(mp3|ogg|wav|wma|amr|aac)$/i).test(file_name)) { }
                if ((/\.docx?$/i).test(file_name)) src = "static/images/icon/doc.png";
                if ((/\.pdf$/i).test(file_name)) src = "static/images/icon/pdf.png";
                if ((/\.(zip|rar|arj)$/i).test(file_name)) src = "static/images/icon/zip.png";
                $li.find('.img-box').css({
                    'background-image': 'url(' + src + ')',
                    'background-size': 'auto'
                });
                callback($li);
            }
        }

        // 进度条
        function progress(percent, item) {
            item.find('.progressBar').text(percent + "%");
        }

        // 删除文件
        function fileRemove(li, uploader) {
            var file = uploader.getFile(li.attr('id'));
            uploader.removeFile(file);
            li.remove();
            hideBoard("judge");
            console.log(uploader.files);
        }
        function ajaxFileRemove(li, remove_url, uploader) {
            $.ajax({
                url: remove_url,
                type: 'POST',
                dataType: 'JSON',
                data: { "fileData": li.data('file') },
                success: function (res) {
                    if (res.state == 'ok') {
                        fileRemove(li, uploader);
                    } else {
                        layer.msg(res.msg || "删除失败！", { icon: 2, anim: 6 });
                    }
                    console.log(uploader.files);
                },
                error: function () {
                    layer.msg("删除失败！", { icon: 2 });
                }
            });
        }

        // 隐藏面板
        function hideBoard(type) {
            if (type === "judge") {
                var items = $(".plupload-box .preview").html();
                if (!items) $(".plupload-box .file-label").removeClass('hide');
            } else {
                $(".plupload-box .file-label").addClass('hide');
            }
        }

        // label 触发 选择
        $(".plupload-box .file-label").on('click', function () {
            obj.click();
        });

        obj.on('uploaded', function () { }); // 自定义的上传完成事件
    });

}($(".plupload")));


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


// 多选
(function (obj) {
    if(!obj.length) return;
    
    obj.each(function(){
        setChosen($(this));
    });
})($(".chosen-selecter"));

function setChosen(obj) {
    obj.addClass("hidden");
    Import.LoadFileList(['assets/css/chosen.css', 'assets/js/chosen.jquery.min.js'], function(){
        obj.removeClass("hidden");
        var chosen = obj.chosen({
                no_results_text: "未找到相关项",
                disable_search_threshold: 8, 
                search_contains: true //模糊搜索
            });
        if(obj.parent().is('td')) {
            chosen.parent().css('overflow', 'visible');
        }
    });
}


// 字数统计
(function (obj) {
    if(!obj.length) return;

    obj.each(function () {
        var _this = $(this),
            input  = _this.prev();

        _this.find(".max").text(input.attr("maxlength"));

        input.on("keyup", function(event){
            var text = input.val();
            _this.find(".cur").text(text.length);
        });
    });

})($(".input-nums"));


// 表单验证 并 获值
function verify_msg(objs) {
    var msg = "";
    var values = {};
    objs.each(function(){
        var _this = $(this);
        var value = _this.val();
        if(value == null) value = "";
        if(_this.is('[type="text"], textarea')) {
            value = value.trim();
        }
        
        // console.log(value);
        if(_this.attr("verify-require")){
            if(!/\S+/.test(value)){
                msg = _this.attr("verify-require");
                return false;
            }
        }

        if(_this.attr("verify-number")){
            if(!/^[0-9]+$/.test(value)) {
                msg = _this.attr("verify-number");
                return false;
            }
        }
        
        values[_this.attr("name")] = value;
    });

    if(msg){
        Import.LoadFileList(['static/vendor/layer/layer.js'], function(){
            layer.msg(msg, { icon: 2, anim: 6, time: 3*1000 });
        });
        return false;
    }else{
        return values;   
    }
}

