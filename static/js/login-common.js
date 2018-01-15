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


// 排序
// $("#orderTable").click(function(){
//     var input_box = $(".table tbody label + span");
//     input_box.each(function(){
//         $(this).html("<input type='text' value='"+$(this).text()+"'>");
//     });
// });

// 固定底部
// function fixBottom(obj) {
//     console.log(obj);
//     var offsetTop = $(window).height()+$(window).scrollTop()-obj.outerHeight()+'px';
//     obj.animate({ 
//         "top": offsetTop,
//          "left": $(window).width() / 2 - obj.width() / 2 
//         }, { 
//             duration: 300,
//             queue: false 
//         });
// }
// (function(obj){
//     if(!obj.length) { return ; }
    
//     $(window).scroll(function(){
//         fixBottom(obj);
//     }).resize(function(){
//         fixBottom(obj);
//     });
// })($('.fix-bottom'));

// 固定表头
(function(obj){
    if(!obj.length) { return ; }
    
    obj.height(function(){
        var h = window.screen.availHeight-$(this).offset().top-180;
        $(this).css('max-height',h);
    }).scroll(function(){
        obj.find('table').first().css('top',$(this).scrollTop() );
    });
})($("#mappingTable"))

