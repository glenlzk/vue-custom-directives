/**
 * Created by lenovo on 2018/1/20.
 */


;(function (Vue) {

    // 1.定义一个组件对象
    var dragBar = {};

    // 1.常用工具函数
    var getRect = function(element) { //返回元素相对于浏览器的偏移位置
        var rect = element.getBoundingClientRect();
        if (typeof rect.width == 'undefined') { // rect.width,    //IE中无法获取
            return {
                width: rect.right - rect.left,
                height: rect.bottom - rect.top,
                top: rect.top,						//元素本身无需绝对定位等
                bottom: rect.bottom,
                left: rect.left,
                right: rect.right
            };
        }
        return rect;
    };

    /*
     *   dom 的 contains方法
     *   https://www.cnblogs.com/litao229/archive/2012/06/20/2555968.html
     *   https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
     * */
    var contains  = function(root , el) {
        if (root.compareDocumentPosition)
            return root === el || !!(root.compareDocumentPosition(el) & 16);
        if (root.contains && el.nodeType === 1){
            return root.contains(el) && root !== el;
        }
        while ((el = el.parentNode))
            if (el === root) return true;
        return false;
    };

    /*
     *  判断DOM元素是否已经插入document中
     * */
    var insertedDom = function (arr, callback) {
        var num = 0;

        for (var i=0; i<arr.length; i++) {
            var elem = arr[i];
            (function (elem) {
                if (elem.timer) clearInterval(elem.timer);
                elem.timer = setInterval(function () {
                    if (contains(document.body, elem)) {
                        num ++;
                        clearInterval(elem.timer);
                        if (num == arr.length) {
                            callback && callback();
                        };
                    };
                }, 300)
            })(elem);
        };
    };

    var addZero = function (num) {
        return Number(num) < 10? '0' + num : num;
    };

    // 2.全局变量，通过window.dragBar暴露出去
    dragBar.config = {

    };

    // 3.dragBar.install= 固定写法，用于组成组件
    dragBar.install = function (Vue) {

        Vue.directive('drag', {
            twoWay: true,
            params: ['cur'],
            // 初始化，只执行一次
            bind: function () {
                var _self = this;

                // 生命周期函数公用变量 内部传递
                _self.dragObj = {
                    runway_w: 0,
                    runway_l: 0,
                    thumb_w: 0,
                    cur: 0,
                    max: 0,
                    left: 0
                };

                var runway_el = _self.el;
                var runway_data = runway_el.dataset;

                var thumb_el = runway_el.getElementsByClassName('dp-range-thumb')[0];
                var progress_el = runway_el.getElementsByClassName('dp-rang-progress')[0];
                var ban_el = runway_el.getElementsByClassName('dp-rang-ban')[0];

                // 获取传入参数
                _self.dragObj.cur = Number(_self.params.cur);

                // v-if true 检测元素是否已插入dom
                insertedDom([thumb_el, runway_el, progress_el, ban_el], function () {

                    _self.dragObj.runway_w = getRect(runway_el).width;
                    _self.dragObj.runway_l = getRect(runway_el).left;
                    _self.dragObj.thumb_w = getRect(thumb_el).width;


                    _self.dragObj.max = runway_data.max;
                    _self.dragObj.left = Math.floor((_self.dragObj.cur/_self.dragObj.max)*_self.dragObj.runway_w - _self.dragObj.thumb_w);
                    thumb_el.style.left = progress_el.style.width = (_self.dragObj.left <=0 ? 0 : _self.dragObj.left) + 'px';

                    ('0' == runway_data.move) && (ban_el.style.width = progress_el.style.width);
                });

                thumb_el.onmousedown = function (event) {
                    var e = event || window.event;
                    var that = this;

                    thumb_el.style.transitionProperty = "none";
                    progress_el.style.transitionDuration="0.1s";

                    var thumb_l = getRect(thumb_el).left;
                    var thumb_clientx = e.clientX;
                    var innerLeft= thumb_clientx - thumb_l;

                    /*鼠标移动，span位移*/
                    document.onmousemove=function(event) {
                        var e = event || window.event;

                        var limitLeft=e.clientX - _self.dragObj.runway_l - innerLeft;
                        var maxLeft = _self.dragObj.runway_w - _self.dragObj.thumb_w;

                        if(limitLeft<=0) {
                            limitLeft=0;
                        }else if(limitLeft>=maxLeft){
                            limitLeft=maxLeft;
                        };

                        // move = 0,禁止; move = 1, 滚动;
                        if ('0' == runway_data.move  && _self.dragObj.left > limitLeft) {
                            limitLeft = _self.dragObj.left;
                        };

                        that.style.left = progress_el.style.width = limitLeft+'px';

                        // 同步传入参数(双向数据绑定)
                        _self.set(addZero(Math.floor((limitLeft/maxLeft)*_self.dragObj.max)));

                    };
                };

                document.onmouseup = function () {
                    document.onmousemove = null;
                };
            },
            // value值发生变化时，会触发执行
            // 移除对应DOM，会触发（v-if="true"）
            update: function (value) {
                // 更新最新传入参数
                var _self = this;
                _self.dragObj.cur = Number(value);
            },
            // 移除对应DOM，会触发（v-if="false"）
            unbind: function () {
                // dragBar = {} 会报错，对应方法找不到
                var _self = this;

                if (_self.dragObj) {
                    _self.dragObj = {};
                };
            }
        });
    };

    // 4.根据不同的环境，选择暴露、注册方法
    if (typeof exports == "object") {
        module.exports = dragBar;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){
            return dragBar;
        })
    } else if (window.Vue) {
        window.dragBar = dragBar;
        Vue.use(dragBar)
    };

})(Vue);