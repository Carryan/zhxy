// 单图片上传
(function(obj){
    if(!obj.length) return ;

    $.fn.imgUpload = function(options) {

        var defaults = {
            preView: ".imgView"
        }

        $(this).change(function(event) {
            var opts = $.extend({}, defaults, options);

            var files = $(this)[0].files;

            for (var i = 0; i < files.length; i++) {
                //检查文件类型
                if (!/image\/\w+/.test(files[i].type)) {
                    alert("请选择图片文件");
                    return false;
                }
                //检查文件大小
                if (files[i].size > 2048 * 1024) {
                    alert("图片不能大于2MB");
                    continue;
                }

                //创建FileReader对象
                var reader = new FileReader();
                reader.onerror = function(e) {
                    alert(e);
                }
                reader.onload = function(e) {
                    $(opts.preView).html("<img src='"+e.target.result+"'/>");
                }
                reader.readAsDataURL(files[i]);
            }
        });
    }

    obj.imgUpload();

}($(".imgUpload")));