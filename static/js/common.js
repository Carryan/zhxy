/*  异步加载文件
 *	Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms-csstransforms3d-shiv-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.substr(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.5.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),k.appendChild(j);return f=["&#173;","<style>",a,"</style>"].join(""),k.id=h,(l?k:m).innerHTML+=f,m.appendChild(k),l||(m.style.background="",g.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e});var G=function(a,c){var d=a.join(""),f=c.length;w(d,function(a,c){var d=b.styleSheets[b.styleSheets.length-1],g=d?d.cssRules&&d.cssRules[0]?d.cssRules[0].cssText:d.cssText||"":"",h=a.childNodes,i={};while(f--)i[h[f].id]=h[f];e.csstransforms3d=(i.csstransforms3d&&i.csstransforms3d.offsetLeft)===9&&i.csstransforms3d.offsetHeight===3},f,c)}([,["@media (",m.join("transform-3d),("),h,")","{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join("")],[,"csstransforms3d"]);q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&(a=e.csstransforms3d),a};for(var H in q)y(q,H)&&(v=H.toLowerCase(),e[v]=q[H](),t.push((e[v]?"":"no-")+v));return z(""),i=k=null,function(a,b){function g(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function h(){var a=k.elements;return typeof a=="string"?a.split(" "):a}function i(a){var b={},c=a.createElement,e=a.createDocumentFragment,f=e();a.createElement=function(a){var e=(b[a]||(b[a]=c(a))).cloneNode();return k.shivMethods&&e.canHaveChildren&&!d.test(a)?f.appendChild(e):e},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+h().join().replace(/\w+/g,function(a){return b[a]=c(a),f.createElement(a),'c("'+a+'")'})+");return n}")(k,f)}function j(a){var b;return a.documentShived?a:(k.shivCSS&&!e&&(b=!!g(a,"article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}")),f||(b=!i(a)),b&&(a.documentShived=b),a)}var c=a.html5||{},d=/^<|^(?:button|form|map|select|textarea)$/i,e,f;(function(){var a=b.createElement("a");a.innerHTML="<xyz></xyz>",e="hidden"in a,f=a.childNodes.length==1||function(){try{b.createElement("a")}catch(a){return!0}var c=b.createDocumentFragment();return typeof c.cloneNode=="undefined"||typeof c.createDocumentFragment=="undefined"||typeof c.createElement=="undefined"}()})();var k={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:j};a.html5=k,j(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return o.call(a)=="[object Function]"}function e(a){return typeof a=="string"}function f(){}function g(a){return!a||a=="loaded"||a=="complete"||a=="uninitialized"}function h(){var a=p.shift();q=1,a?a.t?m(function(){(a.t=="c"?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){a!="img"&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l={},o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};y[c]===1&&(r=1,y[c]=[],l=b.createElement(a)),a=="object"?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),a!="img"&&(r||y[c]===2?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i(b=="c"?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),p.length==1&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&o.call(a.opera)=="[object Opera]",l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return o.call(a)=="[object Array]"},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,i){var j=b(a),l=j.autoCallback;j.url.split(".").pop().split("?").shift(),j.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]||h),j.instead?j.instead(a,e,f,g,i):(y[j.url]?j.noexec=!0:y[j.url]=1,f.load(j.url,j.forceCSS||!j.forceJS&&"css"==j.url.split(".").pop().split("?").shift()?"c":c,j.noexec,j.attrs,j.timeout),(d(e)||d(l))&&f.load(function(){k(),e&&e(j.origUrl,i,g),l&&l(j.origUrl,i,g),y[j.url]=2})))}function i(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var j,l,m=this.yepnope.loader;if(e(a))g(a,0,m,0);else if(w(a))for(j=0;j<a.length;j++)l=a[j],e(l)?g(l,0,m,0):w(l)?B(l):Object(l)===l&&i(l,m);else Object(a)===a&&i(a,m)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};


//获取common.js所在路径
var scripts = document.scripts,
	JSPATH = '';
for( var i = 0; i < scripts.length; i++ ){
	if ( /common\.js/.test(scripts[i].src) ){
		JSPATH = scripts[i].src.replace(/common\.js/, '');
		break;
	}
}

//重新刷新页面，使用location.reload()有可能导致重新提交
function reloadPage(win) {
	win = win || window;
    var location = win.location;
    location.href = location.pathname + location.search;
}

//获得距离window顶部偏移距离
function getOffsetTop( height ){

	if( parent === top && window !== top ){
		var navBarH = $('#navbar', parent.document)[0] ? $('#navbar', parent.document).height() : 0,
			 scrollTop = $(parent.document).scrollTop();
		return scrollTop + (height && parseInt( height ) > 0 ?  ($(parent).height() - parseInt(height) - navBarH)/2 - (scrollTop > 0 ? 45/2 : 0) : 60) + 'px';
	}
	return 'auto';
}

function loadApp(layui){
	//非script引入layui需配置路径
	layui.config({
		dir: JSPATH+'layui/'
	});

	/*ajax提交form表单*/
	(function(form){

		if( !form[0] ) return;

		layui.use('layer', function(){
			var layer = layui.layer;
			form.on('submit', function(){
				var $this = $(this),
					method = $this.prop('method') || 'post',
					action = $this.prop('action'),
					unreload = typeof $this.attr('unreload') != 'undefined',
					callback = $this.find('.js-ajax-callback'),
					loading;

				if( form.data('loading') ) return false;
	
				$.ajax({
					url: action,
					type: method,
					data: $this.serialize(),
					dataType: 'json',
					beforeSend: function(){
						$this.data('loading', true);
						loading = layer.msg('请稍后...', {
						  icon: 16
						  ,shade: 0.01
						  ,time: 100*1000
						  ,offset: getOffsetTop(64)
						});
					},
					success: function(res){
						if( res.state == 'ok' ){

							layer.msg( res.msg ? res.msg : '操作成功!', {icon: 1, offset: getOffsetTop(64)} );
							unreload && $this.data('loading', false) && callback[0] && (new Function( callback.html() )()).call(null, res, layer);
							!unreload && setTimeout( function(){
								//关闭弹出窗口
	                       		res.code && res.code.indexOf('CLOSE') != -1 && layer.closeAll();
	                       		if ( res.jump ) {
	                                //返回带跳转地址
	                       			window.location.href = res.jump;
	                            } else {
		                       		if ( res.code && res.code.indexOf('BACK') != -1 ) {
		                       			window.history.go(-1);//返回上一页
		                       		} else if(  res.code && res.code.indexOf('REFERRER') != -1  ) {
		                       			//console.log(document.referrer)
		                       			//location.href = document.referrer;
		                       		}else{
		                       			reloadPage();//刷新当前页
		                       		}
	                            }
							}, 1000 );
							
                        }else{
                        	layer.msg( res.msg, {icon: 2, anim: 6, offset: getOffsetTop(64)} );
                        	$this.data('loading', false);
                        }
                        layer.close(loading);
					},
					error: function(xhr,e,statusText) {
						layer.confirm( '<span style="color: red;">'+statusText.toString()+'</span>',  
							{title: '错误', 
							 end: function(){
								reloadPage();
							} 
						});
						layer.close(loading);
					}
				});
				return false;
			} );
		} );

	})( $('form.js-ajax-form') );

	//ajax操作
	(function($btn){
		if( !$btn[0] ) return;
		layui.use('layer', function(){
			var layer = layui.layer;
			$btn.on('click', function(e){
				e.preventDefault();
				var $this = $(this),
					url = $this.data('href') || $this.prop('href'),
					unreload = typeof $this.attr('unreload') != 'undefined',
					callback = $this.attr('callback'),
					msg = $this.data('msg') || '你要进行此操作吗？',
					width = $(window).width();

				layer.confirm( msg, { 
					title: '操作'
					,shade : 0
					,area: ['260px', 'auto']
					,offset: [e.pageY+15+'px', width - e.pageX > 260 ? e.pageX + 'px' : (width - 260)+'px']
				}, function(){
					$.getJSON(url).done(function(res){
						if ( res.state == 'ok' ) {
                            if ( res.jump ) {
                                location.href = res.jump;
                            } else {
                            	unreload ? layer.msg( res.msg ? res.msg : '操作成功!', {icon: 1, offset: getOffsetTop(64)} ) : reloadPage(window);
                            	unreload && callback &&  (new Function( callback ))();
                            }
                        } else {
                        	layer.msg( res.msg, {icon: 2, anim: 6} );
                        }
					});
				});
			});
		});

	})( $('a.js-ajax-btn') );

	//日期选择器
	(function($date){
		if( !$date[0] ) return;
		layui.use('laydate', function(){
			var laydate = layui.laydate;
			$date.each(function(){
				var $this = $(this),
					format = $this.attr('format') || 'yyyy-MM-dd',
					type  = 'date';
				$.each(['time', 'month', 'year', 'datetime'], function(i, el){ 
					if( $this.is('.js-'+el) ){
						type = el;
						return false;
					}
				});
				laydate.render({
					elem: this
					,theme: '#34a8ea'
					,type: type
					,format: format
				});
			});
		});
	})( $('input.js-date, input.js-year, input.js-time, input.js-month, input.js-datetime') );


	//数据表格
	(function($table){
		if( !$table[0] ) return;
		layui.use('table', function(){
			$table.each( function(){
				if( typeof $(this).attr('parse') != 'undefined' ){
					layui.table.init($(this).attr('lay-filter'));
				}
			} );
			
		});
	})($('.layui-datatable'));

	//iframe弹窗
	window.open_iframe = function (url, title, area, btn ){
		area  = area || ['80%', '560px'];
		layui.use('layer', function(){
			var layer = layui.layer,
				 offsetTop = getOffsetTop( area.length > 1 ? area[1] : null  );
			
			layer.open({
				title: !title && title == '' ? false : title,
				type: 2,
				area: area,
				offset: offsetTop,
				content: url,
				btn: btn ? ['确定', '取消'] : false,
				btnAlign: 'c',
				success: function(layero, index){
					layer.getChildFrame('body', index).find('.js-close-iframe').on('click', function(){ layer.close( index ) } );
				}
			});

		});
	}
	
	$(document).on('click', '.js-open-iframe', function(){
		var $this = $(this);
		if( !$this.attr('iframe') ) return;
		new Function( 'open_iframe('+$this.attr('iframe')+')' )();
	});
}

typeof layui === 'undefined' ? 
yepnope({
	test : true,
	yep: [JSPATH+'layui/css/layui.css', JSPATH+'layui/layui.js'],
	complete: function(a,b){ 
		loadApp(layui);
	}
}) : loadApp(layui);

//只能输入数字 限制小数format="#.##"
$(document).on('keyup', 'input.number', function(e) {
	//排除方向键
	if( e.keyCode >=37 && e.keyCode <=40 || e.keyCode == 8 || e.keyCode == 46 ) return;
	
	var $this = $(this),
		format = $this.attr('format'),
		formatArr = format ? format.split('.') : [],
	    val = $this.val();

	formatArr.length <= 1 && $this.val( val.replace(/[^\d]/g, '') )
	if ( formatArr.length == 2 ) {
		var limit = formatArr[1].length;
		var reg =new RegExp('^(\\-)*(\\d+)\\.(\\d{'+limit+'})(\\d+)$');
		$this.val( val.replace(/[^\d|\.]/g, '').replace(/^\./, '').replace(/\.{2,}/g,".").replace(/(\d+\.\d+)\./,'$1').replace(reg,'$1$2.$3') );
	}
});


//分页
(function(elem){
	if( !elem[0] ) return;
	var urlParas = elem.attr('urlparas'),
	url = location.href.split('?')[0]+'?p=&'+urlParas,
	cur = Number(elem.attr('p')), 			//当前页码
	total = Number(elem.attr('t')), 			//总页码
	view = Number( total > 5 ? 5 : total ),	//每次展示的页码数
	min = 1,									//当前展示的最小页码
	max = total,								//当前展示的最大页码
	half  = Math.ceil(view/2),
	str = '';
	

	if( total > view ){
		
		if( cur <= half ){
			min = 1;
			max =  min + view-1;
		}else if( cur > half && cur < total - half + 1  ){
			min = cur - half + 1;
			max = cur + half-1;
		}else{
			min = total - (view - 1);
			max = total;
		}
	
	}
	
	str += '<span class="total">共 '+total+' 页</span>'
	str += cur == 1 ? '<span class="first">首页</span>' : '<a href="'+url.replace(/(\?p=\d*)(&?)/,"$1"+1+"$2")+'" class="first">首页</a>' ;
	str += cur == 1 ? '<span class="prev">上一页</span>' :  '<a href="'+url.replace(/(\?p=\d*)(&?)/,"$1"+(cur-1)+"$2")+'" class="prev">上一页</a>' 
	str += cur > half && total > view ? '<span>...</span>' : '';
	for(var i = 0; i < view; i++){
		
		if( cur == min + i )
			str += '<span class="cur">'+(min+i)+'</span>'
		else
			str += '<a href="'+url.replace(/(\?p=\d*)(&?)/,"$1"+(min+i)+"$2")+'">'+(min+i)+'</a>';
		
	}
	str += cur < total - half + 1 && total > view ? '<span>...</span>' : '';
	str += cur == total ? '<span class="next">下一页</span>' : '<a href="'+url.replace(/(\?p=\d*)(&?)/,"$1"+(cur+1)+"$2")+'" class="next">下一页</a>';
	str += cur == total ? '<span class="last">末页</span>' : '<a href="'+url.replace(/(\?p=\d*)(&?)/,"$1"+total+"$2")+'" class="last">末页</a>';
	
	elem.prepend( str );
})( $('#pageBox') );
