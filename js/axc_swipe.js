//滑动页面
var swipePages = window.swipePages = {
    pages: null,
    
    start: false,
    moving: false,
    end: true,
    
    lastX: 0,
    lastY: 0,
    
    direction: 'next', //next, prev
    currentPageIdx: 0,
    
    align: 'v', //h, v
    loop: false,
    class_page: '.page',
    
    init: function(class_page, loop, align){
        this.class_page = class_page ? class_page : '.page';
        this.pages = $(this.class_page);
        this.pages.eq(0).addClass('current');
        
        this.loop = loop ? true : false;
        this.align = align ? align : 'v';
        
        //添加组件
        $('body').append($('\
            <section class="u-arrow-bottom'+(this.align=='h'?' align-h':'')+'">\
                <div class="pre-wrap">\
                    <div class="pre-box1">\
                        <div class="pre1"></div>\
                    </div>\
                    <div class="pre-box2">\
                        <div class="pre2"></div>\
                    </div>\
                </div>\
            </section>\
        '));
        
        $('body').append('\
            <div class="nav">\
                <div class="nav_progress">&nbsp;</div>\
                <span class="text_page_no"></span>\
            </div>\
        ');
        this.setProgress();
    
        //滑动事件
        $(window).on('touchstart mousedown', function(e){
            if(!this.end){
                return;
            }
            
            this.end = false;
            e = e.originalEvent ? e.originalEvent : e;
            this.start = true;
            
            var touch = e.type == 'mousedown' ? e : e.touches[0];
            var x = touch.pageX;
            var y = touch.pageY;
            this.lastX = x;
            this.lastY = y;
            
            this.currentPageIdx = this.pages.index($(this.class_page+'.current')[0]);
        }.bind(this));
        
        $(window).on('touchmove mousemove', function(e){
            e.preventDefault();
            
            if(!this.start && !this.moving){
                return;
            }
            
            if(this.end){
                return;
            }
            
            e = e.originalEvent ? e.originalEvent : e;
            this.moving = true;
            
            var touch = e.type == 'mousemove' ? e : e.touches[0];
            var x = touch.pageX;
            var y = touch.pageY;
            var dx = x - this.lastX;
            var dy = y - this.lastY;
            
            if(this.align == 'v'){
                if(dy == 0){
                    return;
                }
            }else{
                if(dx == 0){
                    return;
                }
            }
            
            if(this.start){
                if(this.align == 'v'){
                    if(y>this.lastY){
                        this.direction = 'prev';
                    }else{
                        this.direction = 'next';
                    }
                }else{
                    if(x>this.lastX){
                        this.direction = 'prev';
                    }else{
                        this.direction = 'next';
                    }
                }
            }
            
            if(!this.loop && (
                    (this.direction == 'prev' && this.currentPageIdx == 0) ||
                    (this.direction == 'next' && this.currentPageIdx == this.pages.length - 1)
                )
            ){
                return;
            }
            
            var p2 = $(this.getPageTo());
            if(!p2.hasClass('moving')){
                p2.addClass('moving');
                
                //第三页特殊任务
                if((this.direction == 'next' && this.currentPageIdx == 2) || 
                   (this.direction == 'prev' && this.currentPageIdx == 0)){
                    
                }
            }
            
            if(this.start){
                p2.css('transition', '');
                if(this.direction == 'next'){
                    if(this.align == 'v'){
                        p2.css('top', p2.height()+'px');
                    }else{
                        p2.css('left', p2.width()+'px');
                    }
                }else{
                    if(this.align == 'v'){
                        p2.css('top', -p2.height()+'px');
                    }else{
                        p2.css('left', -p2.width()+'px');
                    }
                }
            }
            
            if(this.align == 'v'){
                p2.css('top',(parseInt(p2.css('top'))+dy)+'px');
            }else{
                p2.css('left',(parseInt(p2.css('left'))+dx)+'px');
            }
            
            this.lastX = x;
            this.lastY = y;
            this.start = false;
        }.bind(this));
    
        $(window).on('touchend touchcancel mouseup', function(e){
            if(!this.start && !this.moving){
                return;
            }
            
            var oldStart = this.start;
            
            this.start = false;
            this.moving = false;
            
            e = e.originalEvent ? e.originalEvent : e;
            var p2 = $(this.getPageTo());
            
            if(oldStart){
                //如果中间没有滚动
                this.end = true;
                p2.removeClass('moving');
                return;
            }
            
            var dt = .4;
            if(this.align == 'v'){
                p2.css('transition', 'top '+dt+'s cubic-bezier(0, 1, 1, 1)');
                p2.css('top', '0px');
            }else{
                p2.css('transition', 'left '+dt+'s cubic-bezier(0, 1, 1, 1)');
                p2.css('left', '0px');
            }
            
            setTimeout(function(){
                this.pages.removeClass('current');
                p2.removeClass('moving');
                p2.addClass('current');
                this.currentPageIdx = this.pages.index($(this.class_page+'.current')[0]);
                this.setProgress();
                this.end = true;
            }.bind(this), dt*1000);

        }.bind(this));
    },
    
    getPageTo: function(){
        var p2 = null;
        
        if(this.direction == 'next'){
            p2 = this.pages[this.getNextPageIdx()];
        }else{
            p2 = this.pages[this.getPrevPageIdx()];
        }
        
        return p2;
    },
    
    getNextPageIdx: function(){
        return (this.currentPageIdx+1)%this.pages.length;
    },
    
    getPrevPageIdx: function(){
        return (this.currentPageIdx-1+this.pages.length)%this.pages.length;
    },
    
    setProgress: function(){
        $('.nav_progress').css('width', ((this.currentPageIdx+1)/this.pages.length*100)+'%');
        $('.text_page_no').text((this.currentPageIdx+1)+'/'+this.pages.length);
    }
};

//背景音乐
var bgAudio = {
    audio: null,
    button: null,
    playing: false,
    clicked: false, 
    
    init: function(src){
        this.audio = $('<audio src="'+src+'" loop="" autoplay="" preload=""></audio>');
        this.button = $('<div class="btn_audio"></div>'); 
        
        this.audio.on('playing', function(){
            this.playing = true;
            this.button.addClass('rotate');
        }.bind(this));
        
        this.audio.on('pause', function(){
            this.playing = false;
            this.button.removeClass('rotate');
        }.bind(this));
        
        this.button.on('touchstart mousedown', function(e){
            e.preventDefault();
            e.stopPropagation();
            
            this.clicked = true;
            if(this.playing){
                this.pause();
            }else{
                this.play();
            }
        }.bind(this));
        
        $('body').append(this.button.append(this.audio));
        
        $(window).one('touchstart mousedown', function(){
            if(!this.playing && !this.clicked){
                this.play();
            }
        }.bind(this));
    },
    
    play: function(){
        this.audio[0].play();
    },
    
    pause: function(){
        this.audio[0].pause();
    }
};

/* 用法：
$(function(){
    swipePages.init();
    bgAudio.init('images/audio.mp3');
}
*/

//添加页面
function buildPages(pages){
    pages.forEach(function(images, index){
        var page = $('<div class="page page_'+(index+1)+'"></div>');
        page.appendTo($('body'));
        
        images.forEach(function(image, index){
            var class_ani = '';
            if(image.animation){
                class_ani += ' animated '+image.animation;
            }
            
            var style_ani = '';
            if(image.delay){
                style_ani += '\
                    -weblit-animation-delay: '+image.delay+';\
                    animation-delay: '+image.delay+';';
            }
            
            if(image.duration){
                style_ani += '\
                    -weblit-animation-duration: '+image.duration+';\
                    animation-duration: '+image.duration+';';
            }
            
            var img = $('<img class="'+image.class+' '+class_ani+'" style="'+image.style+' '+style_ani+'" src="'+image.src+'">');
            if(image.wrap){
                var img = $('<div class="'+class_ani+'" style="position:absolute;'+image.style+'"><img class="'+image.class+'" style="width:100%;" src="'+image.src+'"/></div>')
            }
            img.appendTo(page);
        });
    });
}

/* 用法：
var pages = [
    [
        {
            class: 'p1_icon_1',//背景图片要加bg样式
            src: 'images/p1_icon_1.png',
            style: '\
                width: 45%;\
                top: 1.2rem;\
                left: 5rem;',
            animation: 'fadeInLeft',
            delay: '',
            duration: '',
        },
    ],
];

buildPages(pages);
*/
