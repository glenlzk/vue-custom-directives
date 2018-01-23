/**
 * Created by lenovo on 2018/1/20.
 */


;(function (Vue) {

    var dragBar = {};

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

    // 分钟拖拽，禁止状态变化
    var banElStatus = function(obj, curHour, callback) {
        if (obj.type == 'mm' && (obj.movebak == '0') && obj.inhhmm) {
            // console.log('real.....watch......................');
            if (Number(curHour[0]) > Number(obj.inhhmm.split(':')[0])) {
                obj.move = '1';
                obj.ban_el.style.width = '0px';
            } else {
                obj.move = '0';
                obj.ban_el.style.width = obj._initLeft(obj.forbidCur);

                // console.log('obj.thumb_el.style.left < obj.ban_el.style.width', obj.thumb_el.style.left, obj.ban_el.style.width);
                if (parseInt(obj.thumb_el.style.left) < parseInt(obj.ban_el.style.width)) {
                    // console.log('000000000000000000');
                    // console.log('obj.thumb_el.style.left: 前：', obj.thumb_el.style.left);
                    obj.thumb_el.style.transitionProperty = "left";
                    obj.thumb_el.style.left = obj.progress_el.style.width = obj.ban_el.style.width;
                    // console.log('obj.thumb_el.style.left: 后：', obj.thumb_el.style.left);
                    callback && callback();
                };
            };
        };

        if (obj.type == 'hh' && (obj.movebak == '0') && obj.inhhmm) {
            // console.log('banElStatus: ............first....');
            if ((obj.inhhmm.split(':')[0] == curHour[0]) && (curHour[1] < obj.inhhmm.split(':')[1])) {
                // console.log('banElStatus: ............sec....');
                obj._Time = obj.inhhmm.split(':');
            };
        };
    };

    dragBar.config = {};

    dragBar.install = function (Vue) {

        Vue.directive('drag', {
            twoWay: true,
            params: ['hhmm'],
            paramWatchers: {
                hhmm: function (val, oldVal) {
                    var _self = this;
                    var _curHour = val.split(':');
                    console.log('watch......................');
                    /*if (_self.dragObj.type == 'mm' && _self.dragObj.inhhmm) {
                        console.log('real.....watch......................');
                        if (_time > Number(_self.dragObj.inhhmm.split(':')[0])) {
                            _self.dragObj.move = '1';
                            _self.dragObj.ban_el.style.width = '0px';
                        } else {
                            _self.dragObj.move = '0';
                            _self.dragObj.ban_el.style.width = _self.dragObj._initLeft(_self.dragObj.forbidCur);
                        };
                    };*/
                    banElStatus(_self.dragObj, _curHour, function () {
                        // console.log('_self.dragObj._Time.join()', _self.dragObj.inhhmm);
                        _self.set(_self.dragObj.inhhmm);
                        _self.dragObj._Time = _self.dragObj.inhhmm.split(':');

                    });
                    /*banElStatus(_self.dragObj, _curHour);
                    _self.set('20:30');*/
                }
            },
            // 初始化，只执行一次
            bind: function () {
                var _self = this;

                _self.dragObj = {
                    // 拖拽轨道的宽度
                    runway_w : 0,
                    // 拖拽点相对屏幕的left值
                    runway_l : 0,
                    // 拖拽点宽度
                    thumb_w : 0,
                    // 保存初始化，时分初始值
                    cur : 0,
                    // 保存禁止拖拽初始值
                    forbidCur: 0,
                    // 最大拖拽范围
                    max : 0,
                    // 初始化，装载时分hhmm的数组
                    _Time : "",
                    // 0,指定范围禁止拖拽；1运行不限制拖拽
                    move: '1',
                    // move备份,用于判断是否是同一天
                    movebak: '1',
                    // 只有checkoutDate，才有这个checkinTime
                    inhhmm: '',
                    // hh 小时bar, mm 分钟bar
                    type: '',
                    // 禁止拖拽条，灰色
                    ban_el: '',
                    // 拖拽点元素
                    thumb_el: '',
                    // 可滚动进度范围
                    progress_el: '',
                    // 初始化，拖拽点位置函数计算
                    _initLeft: null,
                    // 初始化，拖拽点起始位置
                    left : 0,
                };
                //
                var runway_el = _self.el;
                var runway_data = runway_el.dataset;

                _self.dragObj.progress_el = runway_el.getElementsByClassName('dp-rang-progress')[0];
                _self.dragObj.thumb_el = runway_el.getElementsByClassName('dp-range-thumb')[0];
                _self.dragObj.ban_el = runway_el.getElementsByClassName('dp-rang-ban')[0];

                // 获取传入参数
                _self.dragObj._Time = _self.params.hhmm.split(":");

                // console.log('event--out：', _self.dragObj._Time);

                // v-if true 检测元素是否已插入dom
                var elems = [runway_el, _self.dragObj.thumb_el, _self.dragObj.progress_el, _self.dragObj.ban_el];

                insertedDom(elems, function () {

                    _self.dragObj.runway_w = getRect(runway_el).width;
                    _self.dragObj.runway_l = getRect(runway_el).left;
                    _self.dragObj.thumb_w = getRect(_self.dragObj.thumb_el).width;

                    _self.dragObj.max = runway_data.max;
                    _self.dragObj.move = runway_data.move;
                    _self.dragObj.movebak = runway_data.move;
                    _self.dragObj.inhhmm = runway_data.inhhmm;
                    _self.dragObj.type = runway_data.type;

                    if (_self.dragObj.type == 'hh') {
                        _self.dragObj.cur = Number(_self.dragObj._Time[0]);
                        _self.dragObj.inhhmm && (_self.dragObj.forbidCur = Number(_self.dragObj.inhhmm.split(':')[0]));
                    } else {
                        _self.dragObj.cur = Number(_self.dragObj._Time[1]);
                        _self.dragObj.inhhmm && (_self.dragObj.forbidCur = Number(_self.dragObj.inhhmm.split(':')[1]));
                    };


                    _self.dragObj._initLeft = function (cur) {
                        _self.dragObj.left = Math.round((cur/_self.dragObj.max)*(_self.dragObj.runway_w - _self.dragObj.thumb_w));

                        return (_self.dragObj.left <=0 ? 0 : _self.dragObj.left) + 'px';
                    };
                    // 拖拽 ---- 初始化位置
                    // console.log(_self.dragObj.cur, _self.dragObj.max, _self.dragObj.runway_w, _self.dragObj.thumb_w);
                   /* _self.dragObj.left = Math.round((_self.dragObj.cur/_self.dragObj.max)*(_self.dragObj.runway_w - _self.dragObj.thumb_w));
                    _self.dragObj.thumb_el.style.left = _self.dragObj.progress_el.style.width = (_self.dragObj.left <=0 ? 0 : _self.dragObj.left) + 'px';*/

                    _self.dragObj.thumb_el.style.left = _self.dragObj.progress_el.style.width =_self.dragObj._initLeft(_self.dragObj.cur);
                    // 禁用状态
                    if ('0' == _self.dragObj.move) {
                        if (_self.dragObj.type == 'hh') {
                            _self.dragObj.ban_el.style.width = _self.dragObj._initLeft(_self.dragObj.forbidCur);
                        } else {
                            banElStatus(_self.dragObj, _self.dragObj._Time);
                            /*if ( _self.dragObj.inhhmm && (Number(_self.dragObj._Time[0]) > Number(_self.dragObj.inhhmm.split(':')[0]))) {
                                _self.dragObj.move = '1';
                                _self.dragObj.ban_el.style.width = '0px';
                            } else {
                                _self.dragObj.ban_el.style.width = _self.dragObj._initLeft(_self.dragObj.forbidCur);
                            };*/
                        };
                    };
                });

                _self.dragObj.thumb_el.onmousedown = function (event) {
                    var e = event || window.event;
                    var that = this;

                    // console.log('mousedown：', _self.dragObj._Time);
                    _self.dragObj.thumb_el.style.transitionProperty = "none";
                    _self.dragObj.progress_el.style.transitionDuration="0.1s";

                    var thumb_l = getRect(_self.dragObj.thumb_el).left;
                    var thumb_clientx = e.clientX;
                    var innerLeft= thumb_clientx - thumb_l;

                    /*鼠标移动，span位移*/
                    document.onmousemove=function(event) {
                        var e = event || window.event;

                        // console.log('mousemove：', _self.dragObj._Time);
                        var limitLeft=e.clientX - _self.dragObj.runway_l - innerLeft;
                        // console.log('limitLeft: ',  e.clientX ,_self.dragObj.runway_l, innerLeft);
                        var maxLeft = _self.dragObj.runway_w - _self.dragObj.thumb_w;

                        if(limitLeft<=0) {
                            limitLeft=0;
                        }else if(limitLeft>=maxLeft){
                            limitLeft=maxLeft;
                        };

                        // move = 0,禁止; move = 1, 滚动;
                        if ('0' == _self.dragObj.move  && _self.dragObj.left > limitLeft) {
                            limitLeft = _self.dragObj.left;
                        };

                        _self.dragObj.thumb_el.style.left = _self.dragObj.progress_el.style.width = limitLeft+'px';

                        // 同步传入参数(双向数据绑定)
                        if (_self.dragObj.type == 'hh') {
                            // console.log('limitLeft, maxLeft, _self.dragObj.max', limitLeft, maxLeft, _self.dragObj.max);
                            var hh_h = addZero(Math.round((limitLeft/maxLeft)*_self.dragObj.max));
                            // console.log('hh move: ', hh_h + ':' + _self.dragObj._Time[1]);
                            _self.set(hh_h + ':' + _self.dragObj._Time[1]);
                        } else {
                            var mm_m = addZero(Math.round((limitLeft/maxLeft)*_self.dragObj.max));
                            // console.log('mm move: ', _self.dragObj._Time[0] + ':' + mm_m);
                            _self.set(_self.dragObj._Time[0] + ':' + mm_m);
                        };
                    };
                };

                document.onmouseup = function () {
                    document.onmousemove = null;
                };
            },
            // value值发生变化时，会触发执行
            // 移除对应DOM，会触发（v-if="true"）
            update: function (value, oldValue) {
                // 更新最新传入参数
                var _self = this;
                _self.dragObj._Time = value.split(":");
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

    // 4.根据不同的环境，选择不同的暴露/注册方法
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