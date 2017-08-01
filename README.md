# axcH5
A simple H5 show template

页面配置示例：

```javascript
var pages = [
    [//page1
        {
            class: 'bg p1_bg', //class，背景图片要加bg样式类型
            src: 'http://m.10086.cn/migu/fs/media/p/153/268/8007/image/20170731/1327349.jpg', //图片地址
            style: '', //css样式，1rem代表屏幕宽度的10%
            animation: '', //动画类型，https://daneden.github.io/animate.css/
            delay: '', //动画延迟时间，比如.5s
            duration: '', //动画持续时间，比如1s
        },
        {
            class: 'p1_icon_1',
            src: 'http://m.10086.cn/migu/fs/media/p/153/268/8007/image/20170731/1327345.png', 
            style: '\
                width: 45%;\
                top: 1.2rem;\
                left: 5rem;',
            animation: 'fadeInLeft',
            delay: '',
            duration: '',
        },
    ],
    [//page2
        {
            class: 'bg p2_bg',
            src: 'http://m.10086.cn/migu/fs/media/p/153/268/8007/image/20170731/1327349.jpg',
            style: '',
            animation: '',
            delay: '',
            duration: '',
        },
    ]
];
```
    
案例：

[建军节H5](http://m.10086.cn/migu/l/?s=153&p=268&c=8007&j=l)