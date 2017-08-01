// set 1rem = 10vw, 设置为1vw可能小于字体最小值, 导致无效
function set1RemAs10Vw(){
    var w = 0; 
    // ios 9使用innerwidth, 要在meta viewport加上shrink-to-fit=no
    w = document.documentElement.clientWidth 
    if(w){ // ios iframe页面载入的时候innerWidth=0
        var ht = document.getElementsByTagName('html')[0]
        var newFontSize = w/10
        ht.style.fontSize = newFontSize + 'px'
        var realFontSize = parseInt(window.getComputedStyle(ht).getPropertyValue('font-size'))
        if(newFontSize != realFontSize){ // 处理android浏览器设置根的字体大小的bug
            ht.style.fontSize = newFontSize /(realFontSize/newFontSize) + 'px'
        }
    }
}
set1RemAs10Vw()
window.addEventListener("resize", function(){
    set1RemAs10Vw()
});

//请求参数
var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for(var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    } 
    return query_string;
}();

//设置地址参数
function setQueryParameter(url, key, value){
    var qPos = url.indexOf('?');
    if(qPos < 0){
        qPos = url.length;
    }
    
    var host = url.substring(0, qPos);
    var query = url.substring(qPos+1);
    var vars = query.split("&");
    var newVars = [];
    var found = false;
    for(var i=0;i<vars.length;i++) {
        if(!vars[i]){
            continue;
        }
        
        var pair = vars[i].split("=");
        if(pair[0] == key){
            pair[1] = encodeURIComponent(value);
            found = true;
        }
        
        newVars.push(pair[0]+'='+pair[1]);
    }
    if(!found){
        newVars.push(key+'='+encodeURIComponent(value));
    }

    return host+'?'+newVars.join('&');
}

// 微信分享设置
function configWX(debug, appId, timestamp, nonceStr, signature, callback){
    wx.config({
        debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见附录1
        jsApiList: [
            'onMenuShareTimeline', 
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    
    wx.ready(function(){
        if(callback){
            callback()
        }
    });
    
    wx.error(function(res){
        try{
            var conf = {
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature
            };
            
            var err = '__wxjserr__:' + JSON.stringify(res) + 
                      '__wxconfig__:' + JSON.stringify(conf);
            
            $.ajax({
                type: 'POST',
                url: 'log.jsp',
                data: {text: err}
            });
        }catch(e){
            
        }
    });
}


function setWXShare(title, content, link, imageUrl, fSucc, fCanc){
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if(fSucc){
                fSucc()
            }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            if(fCanc){
                fCanc()
            }
        }
    });
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: content, // 分享描述
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
            // 用户确认分享后执行的回调函数
            if(fSucc){
                fSucc()
            }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            if(fCanc){
                fCanc()
            }
        }
    });
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: content, // 分享描述
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if(fSucc){
                fSucc()
            }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            if(fCanc){
                fCanc()
            }
        }
    });
    wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: content, // 分享描述
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if(fSucc){
                fSucc()
            }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            if(fCanc){
                fCanc()
            }
        }
    });
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: content, // 分享描述
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            if(fSucc){
                fSucc()
            }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            if(fCanc){
                fCanc()
            }
        }
    });
}

// 摇一摇组件
var Shaker = function(f){
    // 摇一摇: 检测到3次摇动算一次摇一摇, 摇动后调用处理函数, 不再检测摇动
    // f 摇动后的回调
    this.callback = f;
    this.status = 0;    // 0: 侦听未开始 1: 侦听开始 
    this.speed = 15;
    this.lastX = this.lastY = this.lastZ = 0;
    this.num = 0;       // 检测触发次数
    this.minNum = 2;    // 最小检测触发次数
    this.beginSecond = 0;   // 开始检测的秒数
    this.maxSecond = 5;     // 最大间隔秒数
    
    this.handlerWrap = function(){};
}
Shaker.prototype.listen = function(){
    // 侦听摇动
    var that = this;
    if (this.status == 0 && window.DeviceMotionEvent) {
        this.status = 1;
        this.handlerWrap = function(event){
            that.handler(event)
        }
        window.addEventListener('devicemotion', this.handlerWrap, false);
    }
}
Shaker.prototype.release = function(){
    // 停止侦听
    if(this.status == 1){
        if (window.DeviceMotionEvent) {
            //window.removeEventListener('devicemotion', this.handlerWrap);
        }
        this.status = 0;
        this.num = 0;
    }
}
Shaker.prototype.reset = function(){
    // 重置检测
    if(this.status == 1){
        this.num = 0;
    }
}
Shaker.prototype.handler = function(event){
    // 传感器事件处理
    if(this.status == 1){
        var acceleration =event.accelerationIncludingGravity;
        var x = acceleration.x;
        var y = acceleration.y;
        var z = acceleration.z;
        if( Math.abs(x-this.lastX) > this.speed || 
            Math.abs(y-this.lastY) > this.speed || 
            Math.abs(z-this.lastZ) > this.speed ) 
        {
            if(this.num == 0){
                this.beginSecond = Date.parse(new Date()) / 1000
            }
            this.num += 1;
        }
        this.lastX = x;
        this.lastY = y;
        this.lastZ = z;

        if(this.num >= this.minNum){
            var now = Date.parse(new Date()) / 1000;
            if(now - this.beginSecond <= this.maxSecond){
                this.release();
                if(this.callback){
                    this.callback();
                }
            }
            this.reset();
        }
    }
}

// 进度器
var ProgTimer = function(f){
    // 从0到100递增,递增过程中回调
    this.callback = f
    this.timer = 0
    this.value = 0
    this.maxValue = 100
    this.speed = 300
}
ProgTimer.prototype.inc = function(){
    // 递增
    var that = this;
    var n = Math.random() * 50
    this.value += n
    if(this.value > this.maxValue){
        this.value = this.maxValue
    }
    if(this.callback){
        this.callback(this.value)
    }
    if(this.value < this.maxValue){
        this.timer = setTimeout(function(){that.inc()},this.speed)
    }else{
        this.release()
    }
    
}
ProgTimer.prototype.release = function(){
    // 释放
    if(this.timer){
        clearTimeout(this.timer);
    }
    this.timer = 0
    this.value = 0
}

// 检查移动手机号
function checkMobilePhoneNumber(p){
    return /^(13[4-9])|^(147)|^(150)|^(151)|^(152)|^(157)|^(158)|^(159)|^(178)|^(182)|^(183)|^(184)|^(187)|^(188)/.test(p) && /^\d{11}$/.test(p)
}

//短信倒计时
function SmsTimer(btn, time_max){
    this.btn = btn; //获取验证码按钮
    this.TIME_MAX = time_max ? time_max : 60; //最大秒数
    
    this.timer = 0;
    this.timeLeft = 0;
};

SmsTimer.prototype.decrease = function(){
    $(this.btn).text('重发('+this.timeLeft+'秒)');
    
    if(this.timeLeft == 0){
        clearInterval(this.timer);
        $(this.btn).text('获取验证码');
        $(this.btn).prop('disabled', false);
        this.timeLeft = this.TIME_MAX;
        return;
    }
    
    this.timeLeft -= 1;
};

SmsTimer.prototype.start = function(){
    this.timeLeft = this.TIME_MAX;
    $(this.btn).prop('disabled', true);
    this.decrease();
    this.timer = setInterval(this.decrease.bind(this), 1000);  
};

//ajax重连器
function Retry(f_wrap, f_error){
    //f_wrap是个包装了ajax请求的函数，自带参数，能处理正常情况，并接受一个发生错误时的处理函数作参数
    //f_error是发生错误时的处理函数
    this.MAX_ERROR = 3;
    this.error_times = 0;
    
    this.f = function(){
        f_wrap(function(data){
            this.error_times += 1;
            if(this.error_times <= this.MAX_ERROR){
                this.f();
            }else{
                if(f_error){
                    f_error(data);
                }
            }
        }.bind(this));
    }.bind(this);
}
Retry.prototype.reset = function(){
    error_times = 0;
}
Retry.prototype.run = function(){
    this.reset();
    this.f();
}

/*
重连使用例子：
var f_wrap = function(f_error){
    apiDraw(params, function(data){
        showPopText('成功');
    }, function(data){
        showPopText('失败');
    }, f_error);
}

var f_error = function(data){
    showPopText('网络异常，请稍后再试！');
};

var retry = new Retry(f_wrap, f_error);
retry.run();
*/

