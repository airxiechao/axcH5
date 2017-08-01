/*跳转migu客户端*/
miguapp = {
	ua: navigator.userAgent.toLowerCase(),
	//快速判断UA信息
	uais: function(name) {
		var is = false;
		var ua = this.ua;
		switch (name) {
			case 'wx':
				is = ua.match(/(micromessenger|qq|txmicroblog|weibo);?/i)
				break;
			case 'weixin':
				is = ua.match(/(micromessenger|qq|txmicroblog|weibo);?/i)
				break;
			case 'ios':
				is = ua.match(/(iphone|ipod|ipad);?/i)
				break;
				//如果为咪咕客户端
			case 'migu':
				if (location.href.indexOf('play_song.html') > -1) {
					return "";
				}
				is = location.href.match(/(ua=Iphone_Sst|ua=Android);?/i)
				break;
			default:
				is = ua.indexOf(name) > -1;
		}
		return is;
	},
	//获取当前设备系统
	getOS: function() {
		if (this.uais('ios'))
			return 'ios';
		if (this.uais('android'))
			return 'android';
		if (this.uais('windows'))
			return 'windows';
	},
	//获取系统版本号
	getOSVer: function() {
		var u = this.ua;
		var i = u.indexOf('version/');
		if (i > 0) {
			var v = u.substring(i + 8).split(' ');
			return v[0];
		}
	},
	//下载咪咕客户端,如果不指定,则下载最新版本
	downMigu: function(os) {
		var downUrl = 'http://wm.10086.cn/view/wap/musicindex.do?cType=sst_client&nodeId=7638&cid=0140912&ucid=';
		location.href = downUrl;
	},
	//如果已经安装咪咕App,则打开,否则下载
	//url 唤起App后跳转到的页面
	//wuhai 2016/10/31 好像可以用了
	openOrDownMigu: function(url){
		var _this = this;
        if(_this.getOS() == 'android'){
            _this.openMiguApp(url);
        }else if(_this.getOS() == 'ios'){
            if(_this.uais('wx')){//判断是否在系统浏览器
                _this.showBrowserOpen();
                return;
            }else{
                _this.openMiguApp(url);
            }
        }
	},
	//wuhai 2016/12/28 修改判断页面方法
	openMiguApp: function(url){
		var _this = this;
		var appurl = '';//调起app地址
		if(_this.getOS() == 'ios'){
            appurl = 'mgmusic://browser?url=' + encodeURIComponent(url);
		}else if(_this.getOS() == 'android'){
            var androidYybUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=cmccwm.mobilemusic&android_scheme=';
			appurl = androidYybUrl + encodeURIComponent('migumusic://programa=topicdetail&h5URL='+encodeURIComponent(url));
		}
        
		_this.tryOpenMigu(_this.getOS(),appurl);
	},
	//wuhai 2016/10/31 好像可以用了
	tryOpenMigu : function(os,url){
		var _this = this;
		document.location = url;
		setTimeout(function(){
			_this.downMigu(os);
		}, 2050);
	},
	//显示在系统浏览器中打开(通常用于微信/微博/支付宝)
	showBrowserOpen: function() {
		var h = '' + '<style>' + '.migu-mobile-app-showBrowserOpen {position: fixed;z-index: 9999999;top: 0;left: 0;display: none; width: 100%; height: 100%; background: rgba(0,0,0,.8);}' + '.migu-mobile-app-showBrowserOpen img {float: right; max-width: 70%;margin-top: 15px; margin-right: 20px;}' + '</style>';
		var div = this.browserOpenDiv;
		if (!div) {
			div = document.createElement("div");
			div.className = "migu-mobile-app-showBrowserOpen";
			div.onclick = function() {
				div.style.display = "none";
			}
            if(this.getOS('ios')){
                div.innerHTML = h + '<img src="http://m.10086.cn/migu/fs/media/p/152/243/7756/image/20170630/1325745.png" />';
            }else{
                div.innerHTML = h + '<img src="http://music.migu.cn/music-mobile/images/tips_pop.png" />';
            }
			
			document.body.appendChild(div);
		}
		div.style.display = "block";
	},
}