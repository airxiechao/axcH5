
//调试器
function Debugger(){
    this.view = false;
    
    $('head').append('<style type="text/css">\
        .console{\
            position: fixed;\
            width: 100%;\
            bottom: 5rem;\
            font-size: .35rem;\
            z-index: 999;\
        }\
        \
        .console .buttons{\
            position: absolute;\
            top: -.5rem;\
            height: .5rem;\
            left: 0;\
            background-color: rgba(0,0,0,.3);\
        }\
        \
        .console .buttons button{\
            padding: 0 .1rem;\
            height: .5rem;\
            line-height: .5rem;\
            color: #fff;\
        }\
        \
        .console .text {\
            position: absolute;\
            top: 0;\
            left: 0;\
            background-color: rgba(0,0,0,.3);\
            width: 100%;\
            height: 5rem;\
            overflow-y: auto;\
            display: none;\
        }\
        \
        .console .text p{\
            width: 98%;\
            padding: 0.1rem;\
            word-break: break-all;\
            margin-bottom: .1rem;\
        }\
        \
        .console .text .error{\
            color: red;\
        }\
        \
        .console .text .log{\
            color: #fff;\
        }\
        \
        .console .text .file_name{\
            color: #fff;\
            text-decoration: underline;\
        }\
        \
        .console .text .line_no{\
            color: #ffeb3b;\
            text-decoration: underline;\
        }</style>');
    
    $('body').append('<div class="console">\
            <div class="buttons">\
                <button class="btn_view">view</button>\
                <button class="btn_clear">clear</button>\
                <button class="btn_move">move</button>\
            </div>\
            <div class="text">\
            </div>\
        </div>');
    
    $('.console .btn_view').click(function(){
        if(this.view){
           $('.console .text').hide(); 
           this.view = false;
        }else{
            $('.console .text').show();
            this.view = true;
        }
    }.bind(this));
    
    $('.console .btn_clear').click(function(){
        $('.console .text').empty();
    }.bind(this));
    
    $('.console .btn_move').click(function(){
        if(parseInt($('.console .buttons').css('left')) == 0){
            $('.console .buttons').css('left', 'auto');
            $('.console .buttons').css('right', '0');
        }else{
            $('.console .buttons').css('right', 'auto');
            $('.console .buttons').css('left', '0');
        }
        
    }.bind(this));
    
    //console
    var oldLog = console.log;
    console.log = function(text){
        oldLog(text);
        this.log(text)
    }.bind(this)
    
    //error
    window.addEventListener('error', function (event) {
        var err = {
            message: event.message,
            fileName: event.filename,
            lineNo: event.lineno
        };
        
        this.error(err)

    }.bind(this), false);
    
    
    //ajax error
    $(document).ajaxError(function(e, xhr, settings, error) {
        var err = {
            message: e.type+':'+error,
            fileName: settings.url,
            lineNo: xhr.status
        };
        
        this.error(err)
    }.bind(this));
}

Debugger.prototype.error = function(err){
    $('.console .text').append('<p>\
            <span class="error">'+err.message+'</span>\
            <span class="file_name">'+err.fileName+'</span><span class="line_no">:'+err.lineNo+'</span>\
        </p>');
}

Debugger.prototype.log = function(text){
    $('.console .text').append('<p>\
            <span class="log">'+text+'</span>\
        </p>');
}

$(function(){
    if(QueryString.debug){
        new Debugger();
    }
})