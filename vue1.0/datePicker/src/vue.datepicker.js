/*!
 * vue-datepicker v0.1.2
 * https://github.com/weifeiyue/vue-datepicker
 * (c) 2016 weifeiyue
 * Released under the MIT License.
 */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['vue'], factory);
    } else if (typeof exports === 'object') {
        factory(require('vue'));
    } else {
        factory(Vue);
    }
}(function(Vue) {

    Vue.component('mz-datepicker', {
        template: '<div class="mz-datepicker" :style="{width:width+\'px\'}">' +
        '<span class="pre-tips" v-if="count == 1 && tips">{{tips}}</span>' +
        '<input :value="value" class="input-sm" readonly :disabled="disabled" :class="{focus:show, pl31: count == 1 && tips , pr0: hasHHMM}" :style="{width:width+\'px\'}" @click="click" @mousedown="$event.preventDefault()" />'+
        '<a v-if="clearable&&value" @click.stop="clear"></a>' +
        '<i v-if="!hasHHMM" @click="click" ></i>' +	/* @blur="show = false" */
        // v-if="show" @blur="show = false"
        '<div class="mz-datepicker-popup user-no-select" :class="{\'mz-datepicker-popup-left\':left}" v-if="show" transition="mz-datepicker-popup" tabindex="-1" @blur="show = false" @mousedown="$event.preventDefault()" @keyup.up="changeMonth(-1,1)" @keyup.down="changeMonth(1,1)" @keyup.left="changeYear(-1,1)" @keyup.right="changeYear(1,1)" v-el:popup>' +
        '<div class="mz-calendar-top" v-if="range&&!en">' +
            '<template v-for="item in ranges">' +
            '<i v-if="$index"></i><a v-text="item.name" @click="selectRange(item)"></a>' +
            '</template>' +
        '</div>' +
        '<div :class="{\'mz-calendar-range\':range}">' +
        '<template v-for="no in count">' +
        '<div class="mz-calendar">' +
        '<div class="mz-calendar-header">' +
            '<a class="mz-calendar-prev-year" :title="prevYearTitle" @click="changeYear(-1,no+1)">«</a>' +
            '<a class="mz-calendar-prev-month" :title="prevMonthTitle" @click="changeMonth(-1,no+1)">‹</a>' +
            '<template v-if="range">' +
                '<a class="mz-calendar-start-date" v-if="$index == 0">开始&nbsp;</a>' +
                '<a class="mz-calendar-end-date" v-else>结束&nbsp;</a>' +
            '</template>' +
            '<a v-if="!en" class="mz-calendar-year-select" :title="selectYearTitle" @click="showYear(no+1)">{{this[\'now\'+(no+1)].getFullYear()+(en?"":"年")}}</a>' +
            '<a v-if="!en" class="mz-calendar-month-select" :title="selectMonthTitle" @click="showMonth(no+1)">{{months[this[\'now\'+(no+1)].getMonth()]}}</a>' +
            '<a v-if="en" class="mz-calendar-year-select" :title="selectYearTitle" @click="showYear(no+1)">{{this[\'now\'+(no+1)].getFullYear()+(en?"年":"")}}</a>' +
            '<a v-if="en" class="mz-calendar-month-select" :title="selectMonthTitle" @click="showMonth(no+1)">{{months[this[\'now\'+(no+1)].getMonth()]}}</a>' +
            '<a v-if="hasHHMM" class="mz-calendar-mmhh-select" :title="selectHHMMTitle" @click="showHHMM(no+1)">{{hhmm}}</a>' +
            '<a class="mz-calendar-next-month" :title="nextMonthTitle" @click="changeMonth(1,no+1)">›</a>' +
            '<a class="mz-calendar-next-year" :title="nextYearTitle" @click="changeYear(1,no+1)">»</a>' +
        '</div>' +
        '<table cellspacing="0" cellpadding="0">' +
        '<tr><th v-for="day in days" v-text="day"></th></tr>' +
        '<tr v-if="this[\'date\'+(no+1)]" v-for="i in 6"><td v-for="j in 7" v-text="this[\'date\'+(no+1)][i * 7 + j].text" :title="this[\'date\'+(no+1)][i * 7 + j].title" :class="this[\'date\'+(no+1)][i * 7 + j].status" @click="select(this[\'date\'+(no+1)][i * 7 + j], no+1)"></td></tr>' +
        '</table>' +
        '<div class="mz-calendar-year-panel" transition="mz-calendar-panel" v-if="this[\'showYear\'+(no+1)]"><a class="mz-calendar-year-panel-prev" @click="changeYearRange(no+1,-1)"></a><a class="mz-calendar-year-panel-year" v-for="item in this[\'years\'+(no+1)]" :class="item.status" @click="selectYear(item,no+1)">{{item.year+(en?"":"年")}}</a><a class="mz-calendar-year-panel-next" @click="changeYearRange(no+1,1)"></a></div>' +
        '<div class="mz-calendar-month-panel" transition="mz-calendar-panel" v-if="this[\'showMonth\'+(no+1)]"><a v-for="item in this[\'months\'+(no+1)]" class="mz-calendar-month-panel-month" :class="item.status" @click="selectMonth(item,no+1)">{{months[item.month-1].substr(0,3)}}</a></div>' +
        '<div class="mz-calendar-month-panel" transition="mz-calendar-panel" v-if="this[\'showHHMM\'+(no+1)]">' +
            /*'<div class="dp-range-content mt20" >'+
                '<div class="text">小&nbsp;时: </div>' +
                '<div class="dp-range-runway" v-drag="hhmm" data-type="hh" data-step="0" :hhmm="hhmm">'+
                '    <span class="dp-range-thumb"></span>'+
                '</div>'+
            '</div>' +
            '<div class="dp-range-content" >'+
                '<div class="text">分&nbsp;钟: </div>' +
                '<div class="dp-range-runway" v-drag="hhmm" data-type="mm" data-step="2" :hhmm="hhmm">'+
                    '<span class="dp-range-thumb"></span>'+
                '</div>'+
            '</div>' +*/
            '<div class="drag-box">' +
            '   <div class="text">小&nbsp;时: </div>' +
            '   <div class="dp-range-content" >'+
            '       <div class="dp-range-runway" v-drag="hhmm" data-max="23" data-type="hh" data-step="0" :hhmm="hhmm" data-inhhmm="{{inhhmm}}" data-move="{{isDrag}}">'+
            '           <span class="dp-rang-progress"></span>'+
            '           <span class="dp-rang-ban"></span>'+
            '           <span class="dp-range-thumb"></span>'+
            '       </div>'+
            '   </div>'+
            '</div>' +
            '<div class="drag-box">' +
            '   <div class="text">分&nbsp;钟: </div>'+
            '   <div class="dp-range-content" >'+
            '      <div class="dp-range-runway" v-drag="hhmm" data-max="59" data-type="mm" data-step="2" :hhmm="hhmm" data-inhhmm="{{inhhmm}}" data-move="{{isDrag}}">'+
            '          <span class="dp-rang-progress"></span>'+
            '          <span class="dp-rang-ban"></span>'+
            '          <span class="dp-range-thumb"></span>'+
            '      </div>'+
            '   </div>' +
            '</div>' +
            '<a class="mz-calendar-btn mm-hh-btn" @click="setMMSSConfirm(true)">确定</a>' +
        '</div>' +
        '</div>' +
        '<div class="mz-calendar-separator" v-if="range&&no===0"><span>{{toTitle}}</span></div>' +
        '</template>' +
        '</div >' +
            /*'<div class="mz-calendar-bottom" v-if="range"><a class="mz-calendar-btn ok" @click="ok">{{okTitle}}</a></div>' +*/
        '</div>' +
        '</div>',
        props: {
            // 是否显示范围(一个面板，两个日历)
            range: {
                type: Boolean,
                default: false
            },
            //显示宽度
            width: {
                default: 200
            },
            tips: {
            	type: String,
            	default: ''
            },
            // checkinDate的时间
            time: {
                twoWay: true
            },
            // 两个独立日历 --- checkoutDate
            endDate: {
                type: String,
                default: ''
            },
            // 有两个独立日历
            twosingle: {
                type: Boolean,
                default: false
            },
            // 外部传入对应item, 目的是onComfirm回传回去
            itemOutelem: {
                twoWay: true
            },
            //不能选以前时间
            limitpredate: {
                type: Boolean,
                default: false
            },
            // 同时拥有两个日历面板 ------ checkinDate
            startTime: {
                twoWay: true
            },
            // 同时拥有两个日历面板 ------ checkoutDate
            endTime: {
                twoWay: true
            },
            //选择最大范围限制,以天为单位（只有range为true的时候才起作用）
            maxRange: {
                coerce: function(val) {
                    return +val;
                }
            },
            //是否可以清除
            clearable: {
                type: Boolean,
                default: false
            },
            //显示格式
            format: {
                type: String,
                default: 'yyyy-MM-dd'
            },
            //禁用
            disabled: {
                type: Boolean,
                default: false
            },
            //是否需要点击确认
            confirm: {
                type: Boolean,
                default: false
            },
            //英文显示
            en: {
                type: Boolean,
                default: false
            },
            //点击确认触发事件
            onConfirm: Function,
            //item: Object,
            // 独立日历 --------- 当前日历面板时分
            hhmm: {
                twoWay: true
            },
            // 两个独立日历 > checkinDate面板 > 保存checkoutTime
            outhhmm: {
                twoWay: true
            },
            // 两个独立日历 > checkoutDate面板 > 保存checkinTime
            inhhmm: {
                twoWay: true
            },
        },
        data: function() {
            return {
                show: false,
                showYear1: false,
                showYear2: false,
                showMonth1: false,
                showMonth2: false,
                showHHMM1: false,
                showHHMM2: false,
                prevYearTitle: '上一年',/*this.en ? 'last year' : '上一年'*/
                prevMonthTitle: '上个月',/*this.en ? 'last month' : '上个月'*/
                selectYearTitle: '选择年份',/*this.en ? 'select year' : '选择年份'*/
                selectMonthTitle: '选择月份',/*this.en ? 'select month' : '选择月份'*/
                selectHHMMTitle: '选择时分',/*this.en ? 'select month' : '选择月份'*/
                nextMonthTitle: '下个月',/*this.en ? 'next month' : '下个月'*/
                nextYearTitle: '下一年',/*this.en ? 'next year' : '下一年'*/
                toTitle: '至',/*this.en ? 'TO' : '至'*/
                okTitle: '确定',/*this.en ? 'OK' : '确定'*/
                left: false,
                ranges: [], //选择范围
                days: ['一', '二', '三', '四', '五', '六', '日'],/*this.en ? ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] : ['一', '二', '三', '四', '五', '六', '日']*/
                /*this.en ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']*/
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                years1: [],
                years2: [],
                months1: [],
                months2: [],
                date1: null,
                date2: null,
                time1: this.parse(this.startTime, false) || this.parse(this.time, false),
                time2: this.parse(this.endTime, true),
                now1: this.parse(new Date(), false),
                now2: this.parse(new Date(), true),
                count: this.range ? 2 : 1, //日历数量
                // 是否可以设置/展示时分面板
                hasHHMM: false,
                // 两个独立日历 > 同一天 > checkoutDate/checkinDate面板 > 时分是否限制拖拽
                // 0 不可往前拖拽 1 可以全程拖拽
                isDrag: 1,
            };
        },
        computed: {
            value: function() {
                var _HHMM = "";

                if (this.hasHHMM) {
                     _HHMM = ' ' + this.hhmm;
                };

                if (this.twosingle) {
                    return this.endDate + _HHMM;
                } else if (this.range) {
                    if (this.startTime && this.endTime) {
                        return this.stringify(this.parse(this.startTime, false)) + ' ~ ' + this.stringify(this.parse(this.endTime, false));
                    } else {
                        return '';
                    }
                } else {
                    return this.stringify(this.parse(this.time, false)) + _HHMM;
                }
            }
        },
        watch: {
            show: function(val) {
                this.hidePanel();
                val && this.$els.popup.focus();
            },
            now1: function() {
                this.updateAll();
            },
            now2: function() {
                this.updateAll();
            },
            // 单个/两个独立日历 > checkinDate改变联动checkoutDate
            time: function (val) {
            	var _self = this;

            	if (val && _self.twosingle) {
            		var end_time = new Date(_self.endDate).getTime();
            		var start_time = new Date(val).getTime();

            		if (start_time >= end_time) {
            		    var resetEndTime = new Date(start_time + 24*60*60*1000);
            			_self.endDate = _self.stringify(_self.parse(resetEndTime, false));
            		};
            	};
            },
            // 两个独立日历 > checkinTime改变联动checkoutTime
            // _self.outhhmm 两个独立日历 > checkinDate面板 > 保存checkoutTime
            // _self.endDate  checkinDate面板 > 保存checkoutDate
            // hhmm 当前日历面板 > 所保存的时分
            hhmm: function (val) {
                var _self = this;
                // 存在两个独立日历，且是checkinDate面板
                if (!_self.twosingle && val && _self.time && _self.outhhmm && _self.endDate ) {
                    var start_time = new Date(_self.time).getTime();
                    var end_time = new Date(_self.endDate).getTime();
                    var _oneHour = 60*60*1000;
                    // 如果是同一天
                    if (end_time == start_time) {
                        // 开始
                        var _inT = new Date(_self.time +' ' + val).getTime();
                        // 离开
                        var _outT = new Date(_self.endDate +' ' + _self.outhhmm).getTime();
                        // 当天最晚时间
                        var _inEndT = new Date(_self.time +' ' + '23:59').getTime();
                        if (_inT >= _outT) {
                            // 开始时间 > 离开时间，则顺延1小时
                            if (_inEndT >= (_inT + _oneHour)) {
                                _self.outhhmm = _self.stringify(new Date(_inT + _oneHour), 'HH:mm')
                                // 开始时间为23:59，则离店时间为隔天00:00
                            } else if ('23:59'  == val) {
                                var _time = new Date(_self.time);
                                _time.setDate(_time.getDate() + 1);
                                _self.endDate = _self.stringify(new Date(_time), 'yyyy-MM-dd');
                                _self.outhhmm = '00:00';
                                // 否则，离店时间为: 23: 59
                            } else {
                                _self.outhhmm = _self.stringify(new Date(_self.time +' ' + '23:59'), 'HH:mm');
                            };
                        };
                    };
                };
            },
            // 两个独立日历 > checkoutDate改变联动checkinDate 和 checkoutTime
            // _self.time    checkinDate的时间
            // _self.inhhmm  两个独立日历 > checkoutDate面板 > 保存checkInTime
            // _self.hhmm    独立日历 --------- 当前日历面板时分
            endDate: function (val) {
                var _self = this;
                // 两个独立日历 > checkoutDate面板 > 时分可拖拽
                _self.isDrag = 1;
                // _self.twosingle 代表checkoutDate，独立日历面板
                if (val && _self.twosingle) {
                    var start_time = new Date(_self.time).getTime();
                    var end_time = new Date(val).getTime();
                    var _oneHour = 60*60*1000;
                    // 如果是同一天
                    if (end_time == start_time) {
                        // 两个独立日历 > checkoutDate面板 > 时分可拖拽
                        _self.isDrag = 0;
                        // 开始
                        var _inT = new Date(_self.time +' ' + _self.inhhmm).getTime();
                        // 离开
                        var _outT = new Date(val +' ' + _self.hhmm).getTime();
                        // 当天最晚时间
                        var _inEndT = new Date(_self.time +' ' + '23:59').getTime();
                        if (_inT >= _outT) {
                            // 开始时间 > 离开时间，则顺延1小时
                            if (_inEndT >= (_inT + _oneHour)) {
                                _self.hhmm = _self.stringify(new Date(_inT + _oneHour), 'HH:mm')
                            // 开始时间为23:59，则离店时间为隔天00:00
                            } else if ('23:59'  == _self.inhhmm) {
                                var _time = new Date(_self.time);
                                _time.setDate(_time.getDate() + 1);
                                _self.endDate = _self.stringify(new Date(_time), 'yyyy-MM-dd');
                                _self.hhmm = '00:00';
                            // 否则，离店时间为: 23: 59
                            } else {
                                _self.hhmm = _self.stringify(new Date(_self.time +' ' + '23:59'), 'HH:mm');
                            };
                        };
                    };
                };
            },
        },
        ready: function () {
            var _self = this;
            var _hasHHMM = _self.format.split(' ');

            // 有时分，才需要赋值时分插件的item
            if (_hasHHMM.length > 1 && (_hasHHMM[1] == 'HH-MM' || _hasHHMM[1] == 'hh-mm')) {
                _self.hasHHMM = true;
            };

        },
        methods: {
            //转换输入的时间
            parse: function(time, isLast) {
                if (time) {
                    var tmpTime = new Date(time);
                    if (isLast === undefined) {
                        return tmpTime;
                    } else if (isLast) {
                        return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate(), 23, 59, 59, 999);
                    } else {
                        return new Date(tmpTime.getFullYear(), tmpTime.getMonth(), tmpTime.getDate());
                    }
                }
                return null;
            },
            //初始化时间范围
            initRanges: function() {
                var time = new Date(),
                    ranges = [];
                ranges.push({
                    name: '今天',
                    start: this.parse(time, false),
                    end: this.parse(time, true)
                });
                time.setDate(time.getDate() - 1);
                ranges.push({
                    name: '昨天',
                    start: this.parse(time, false),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setDate(time.getDate() - 6);
                ranges.push({
                    name: '最近7天',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                time = new Date();
                time.setMonth(time.getMonth() + 1, 0);
                ranges.push({
                    name: '本月',
                    start: new Date(time.getFullYear(), time.getMonth(), 1),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setMonth(time.getMonth(), 0);
                ranges.push({
                    name: '上个月',
                    start: new Date(time.getFullYear(), time.getMonth(), 1),
                    end: this.parse(time, true)
                });
                time = new Date();
                time.setDate(time.getDate() - 29);
                ranges.push({
                    name: '最近一个月',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                time = new Date();
                time.setDate(time.getDate() - 365);
                ranges.push({
                    name: '最近一年',
                    start: this.parse(time, false),
                    end: this.parse(new Date(), true)
                });
                this.ranges = ranges;
            },
            //更新所有的日历
            updateAll: function() {
                this.update(new Date(this.now1), 1);
                this.range && this.update(new Date(this.now2), 2);
            },
            //点击时间输入框的时候触发
            click: function() {
                var self = this;

                if (self.disabled) return;
                // 两个非独立日历
                if (!self.time) {
                    self.time1 = self.parse(self.startTime) || self.parse(self.time);
                    self.now1 = self.parse(self.startTime) || new Date();
                } else {
                    // 两个独立日历
                    if (self.twosingle) {
                        self.time1 = self.parse(self.endDate) || self.parse(self.time);
                        self.now1 = self.parse(self.endDate) || new Date();
                    } else {
                        // 单个日历
                        self.time1 = self.parse(self.time) || self.parse(self.time);
                        self.now1 = self.parse(self.time) || new Date();
                    };
                };

                if (self.range) {
                    self.initRanges();
                    self.time2 = self.parse(self.endTime);
                    self.now2 = self.parse(self.endTime) || new Date();
                }
                var rect = this.$el.getBoundingClientRect(),
                    right = document.documentElement.clientWidth - rect.left;
                (right < (self.range ? 441 : 214) && right < rect.left) ? (self.left = true) : (self.left = false);
                self.show = !self.show;
            },
            //选择时间
            select: function(item, no) {
                var self = this;
                self.hidePanel();
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                self['now' + no] = new Date(item.time);
                self['time' + no] = new Date(item.time);
                if (!self.range) {
                    // 存在两个独立日历
                    if (self.twosingle) {
                        self.endDate = self.getOutTime(item.time);
                    } else {
                        self.time = self.getOutTime(item.time);
                    };
                    self.show = false;
                } else if (!self.confirm) {
                    self[no === 1 ? 'startTime' : 'endTime'] = self.getOutTime(item.time);
                }

                //self.show = false;
                // 一个面板，两个日历
                if (self.range && self.confirm) {
                    self.startTime = self.getOutTime(self.time1);
                    self.endTime = self.getOutTime(self.time2);
                    self.onConfirm && self.onConfirm(self.item, self.startTime, self.endTime);
                }
                // 单个日历情况下 或 两个独立日历
                // twosingle 代表有两个独立日历，且它是离店时间
                self.setMMSSConfirm();
                /*if (self.count == 1 || (self.count == 2 && self.twosingle)) {
                    var _date = '';

                    if (self.itemOutelem) {
                        // self.time 入住时间checkinDate
                        // self.endDate 离店时间checkoutDate

                        if (self.twosingle) {
                            _date = self.endDate
                            // self.hhmm 附带时分日历
                            if (self.hhmm) {
                                _date = self.endDate + ':' + self.hhmm;
                            };
                        } else {
                            _date = self.time;
                            if (self.hhmm) {
                                _date = self.time + ':' + self.hhmm;
                            };
                        };

                        self.onConfirm && self.onConfirm(self.itemOutelem, _date);
                    } else {
                        _date = self.time;

                        if (self.hhmm) {
                            _date = self.time + ':' + self.hhmm;
                        };

                        self.onConfirm && self.onConfirm(_date);
                    };
                };*/
            },
            //确认
            ok: function() {
                var self = this;
                /*self.show = false;
                if (self.range && self.confirm) {
                    self.startTime = self.getOutTime(self.time1);
                    self.endTime = self.getOutTime(self.time2);
                    self.onConfirm && self.onConfirm(self.item, self.startTime, self.endTime);
                }*/
            },
            // 设置分秒界面确认
            setMMSSConfirm: function (bln) {
                var self = this;
                if (bln) {
                    self.hidePanel();
                    self.show = false;
                };
                // 单个日历情况下 或 两个独立日历
                // twosingle 代表有两个独立日历，且它是离店时间
                if (self.count == 1 || (self.count == 2 && self.twosingle)) {
                    var _date = '';

                    if (self.itemOutelem) {
                        // self.time 入住时间checkinDate
                        // self.endDate 离店时间checkoutDate

                        if (self.twosingle) {
                            _date = self.endDate
                            // self.hhmm 附带时分日历
                            if (self.hhmm) {
                                _date = self.endDate + ':' + self.hhmm;
                            };
                        } else {
                            _date = self.time;
                            if (self.hhmm) {
                                _date = self.time + ':' + self.hhmm;
                            };
                        };

                        self.onConfirm && self.onConfirm(self.itemOutelem, _date);
                    } else {
                        _date = self.time;

                        if (self.hhmm) {
                            _date = self.time + ':' + self.hhmm;
                        };

                        self.onConfirm && self.onConfirm(_date);
                    };
                };
            },
            //选择范围
            selectRange: function(item) {
                var self = this;
                self.now1 = new Date(item.start);
                self.now2 = new Date(item.end);
                self.time1 = new Date(item.start);
                self.time2 = new Date(item.end);
                self.startTime = self.getOutTime(item.start);
                self.endTime = self.getOutTime(item.end);
                self.hidePanel();
            },
            //根据输出类型，获取输出的时间
            getOutTime: function(time) {
                var type = this.time ? typeof(this.time) : typeof(this.startTime);
                if (type === 'number') {
                    return time.getTime();
                } else if (type === 'object') {
                    return new Date(time);
                } else {
                    return this.stringify(time);
                }
            },
            //更新时间
            update: function(time, no) {
                var i, tmpTime, curFirstDay, lastDay, curDay, day, arr = [];
                time.setDate(0); //切换到上个月最后一天
                curFirstDay = time.getDay(); //星期几
                lastDay = time.getDate(); //上个月的最后一天
                for (i = curFirstDay; i > 0; i--) {
                    day = lastDay - i + 1;
                    tmpTime = new Date(time.getFullYear(), time.getMonth(), day);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no) || 'mz-calendar-lastmonth',
                        title: this.stringify(tmpTime),
                        text: day,
                        time: tmpTime
                    });
                }
                time.setMonth(time.getMonth() + 2, 0); //切换到当前月的最后一天
                curDay = time.getDate(); //当前月的最后一天
                time.setDate(1);
                for (i = 1; i <= curDay; i++) {
                    tmpTime = new Date(time.getFullYear(), time.getMonth(), i);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no),
                        title: this.stringify(tmpTime),
                        text: i,
                        time: tmpTime
                    });
                }
                //下个月的前几天
                for (i = 1; arr.length < 42; i++) {
                    tmpTime = new Date(time.getFullYear(), time.getMonth() + 1, i);
                    tmpTime = this.parse(tmpTime, no === 2);
                    arr.push({
                        status: this.getTimeStatus(tmpTime, no) || 'mz-calendar-nextmonth',
                        title: this.stringify(tmpTime),
                        text: i,
                        time: tmpTime
                    });
                }
                this['date' + no] = arr;
            },
            //获取时间状态
            getTimeStatus: function(time, no, format) {
                var _self = this;
                    status = '',
                    curTime = new Date(),
                    selTime = this['time' + no],
                    tmpTimeVal = this.stringify(time, format || 'yyyy-MM-dd'), 	   //需要查询状态的时间字符串值
                    curTimeVal = this.stringify(curTime, format || 'yyyy-MM-dd'), //当前时间字符串值
                    selTimeVal = this.stringify(selTime, format || 'yyyy-MM-dd'); //选中时间字符串值

                if (_self.twosingle) {
                    // 结束时间
                    selTimeVal = this.stringify(new Date(_self.endDate), format || 'yyyy-MM-dd')
                    // 开始时间
                    curTimeVal = this.stringify(new Date(_self.time), format || 'yyyy-MM-dd')
                };
                    /*console.log('tmpTimeVal: ', tmpTimeVal);
                    console.log('curTimeVal: ', curTimeVal);
                    console.log('selTimeVal: ', selTimeVal);*/
				
				
                if (tmpTimeVal === selTimeVal) {
                   /* status = 'mz-calendar-selected';*/
                    if (tmpTimeVal === curTimeVal) {
                        status = 'mz-calendar-selected-today';
                    };
                    status += ' mz-calendar-selected';
                } else if (tmpTimeVal === curTimeVal) {
                    status = 'mz-calendar-today';
                }
                if (this.time1 && this.time2 && time >= this.time1 && time <= this.time2) {
                    status += ' mz-calendar-inrange';
                }
                // glen
                // -------------------
                // 不能选以前时间
                if (_self.limitpredate) {
                    var curTimeValTime = new Date(curTimeVal).getTime();
                    var tmpTimeValTime = new Date(tmpTimeVal).getTime();
                    if (tmpTimeValTime < curTimeValTime) {
                        status += ' mz-calendar-disabled';
                    };

                    if (_self.twosingle && status.indexOf('mz-calendar-disabled') == -1) {
                        var start_time = new Date(new Date(_self.time).getTime() - 3600*24).getTime();
                        if (tmpTimeValTime < start_time) {
                            status += ' mz-calendar-disabled';
                        };
                    };
                };

                // -------------------------
                
                if (no == 1 && this.time2) {
                    var minTime = new Date(this.time2);
                    if (this.maxRange) {
                        minTime.setDate(minTime.getDate() - this.maxRange);
                        if (format === 'yyyy') {
                            minTime = new Date(minTime.getFullYear(), 0, 1);
                        }
                        if (format === 'yyyy-MM') {
                            minTime = new Date(minTime.getFullYear(), 0, 1);
                        }
                        if (time < minTime || time > this.time2) {
                            status += ' mz-calendar-disabled';
                        }
                        
                    } else if (time > this.time2) {
                        status += ' mz-calendar-disabled';
                    }
                    if (time > this.time2) {
                        status += ' mz-calendar-disabled';
                    }
                }
                if (no == 2 && this.time1) {
                    var maxTime = new Date(this.time1);
                    if (this.maxRange) {
                        maxTime.setDate(maxTime.getDate() + this.maxRange);
                        if (format === 'yyyy') {
                            maxTime = new Date(maxTime.getFullYear(), 11, 1);
                        }
                        if (format === 'yyyy-MM') {
                            maxTime = new Date(maxTime.getFullYear(), maxTime.getMonth() + 1, 1);
                        }
                        if (time > maxTime || time < this.time1) {
                            status += ' mz-calendar-disabled';
                        }
                    } else if (time < this.time1) {
                        status += ' mz-calendar-disabled';
                    }
                }
                return status;
            },
            //将Date转化为指定格式的String
            // 24小时时分秒转化公式：this.stringify(new Date(毫秒), 'yyyy-MM-dd HH:mm:ss')
            stringify: function(time, format) {
                if (!time) {
                    return '';
                }

                format = format || this.format.split(" ")[0];
                var year = time.getFullYear(), //年份
                    month = time.getMonth() + 1, //月份
                    day = time.getDate(), //日
                    hours24 = time.getHours(), //小时
                    hours = hours24 % 12 === 0 ? 12 : hours24 % 12,
                    minutes = time.getMinutes(), //分
                    seconds = time.getSeconds(), //秒
                    milliseconds = time.getMilliseconds(); //毫秒
                var map = {
                    yyyy: year,
                    MM: ('0' + month).slice(-2),
                    M: month,
                    dd: ('0' + day).slice(-2),
                    d: day,
                    HH: ('0' + hours24).slice(-2),
                    H: hours24,
                    hh: ('0' + hours).slice(-2),
                    h: hours,
                    mm: ('0' + minutes).slice(-2),
                    m: minutes,
                    ss: ('0' + seconds).slice(-2),
                    s: seconds,
                    S: milliseconds
                };
                return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+/g, function(str) {
                    return map[str];
                });
            },
            //显示年份选择器
            showYear: function(no) {
                var name = 'showYear' + no;
                this.hidePanel(name);
                this[name] = !this[name];
                var time = new Date(this['now' + no] || new Date()),
                    num = Math.floor(time.getFullYear() % 10), //获取当前时间个位数
                    arr = [];
                time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                time.setFullYear(time.getFullYear() - num);
                while (arr.length < 10) {
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    arr.push({
                        year: time.getFullYear(),
                        status: this.getTimeStatus(time, no, 'yyyy'),
                    });
                    time.setDate(1);
                    time.setFullYear(time.getFullYear() + 1);
                }
                this['years' + no] = arr;
            },
            //显示月份选择器
            showMonth: function(no) {
                var name = 'showMonth' + no;
                this.hidePanel(name);
                this[name] = !this[name];
                var time = new Date(this['now' + no] || new Date()),
                    arr = [];
                while (arr.length < 12) {
                    time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                    time.setMonth(arr.length);
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    arr.push({
                        month: arr.length + 1,
                        status: this.getTimeStatus(time, no, 'yyyy-MM'),
                    });
                }
                this['months' + no] = arr;
            },
            // 显示时分选择器
            showHHMM: function (no) {
                var name = 'showHHMM' + no;
                this.hidePanel(name);
                this[name] = !this[name];
            },
            //切换年份选择器
            changeYearRange: function(no, flag) {
                var arr = this['years' + no],
                    time = new Date(this['time' + no] || new Date());
                for (var i in arr) {
                    var item = arr[i],
                        year = item.year + 10 * flag;
                    time.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                    time.setFullYear(year);
                    no === 2 && time.setMonth(time.getMonth() + 1, 0);
                    item.year = year;
                    item.status = this.getTimeStatus(time, no);
                }
            },
            //改变年份
            changeYear: function(flag, no) {
                var now = this['now' + no];
                now.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                now.setFullYear(now.getFullYear() + flag);
                no === 2 && now.setMonth(now.getMonth() + 1, 0);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //改变月份
            changeMonth: function(flag, no) {
                var now = this['now' + no];
                now.setDate(1); //先设置为第一天，因为月份天数不一样，要不存在bug
                now.setMonth(now.getMonth() + flag);
                no === 2 && now.setMonth(now.getMonth() + 1, 0);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //选择年份
            selectYear: function(item, no) {
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                var now = this['now' + no];
                now.setFullYear(item.year);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //选择月份
            selectMonth: function(item, no) {
                if (item.status.indexOf('mz-calendar-disabled') !== -1) {
                    return;
                }
                var now = this['now' + no];
                now.setMonth(item.month - 1);
                this['now' + no] = new Date(now);
                this.hidePanel();
            },
            //隐藏所有面板
            hidePanel: function(name) {
                ['showYear1', 'showYear2', 'showMonth1', 'showMonth2', 'showHHMM1', 'showHHMM2'].map(function(item) {
                    if (item !== name) {
                        this[item] = false;
                    }
                }.bind(this));
            },
            //清除时间
            clear: function() {
                var self = this;
                self.time1 = self.time2 = self.startTime = self.endTime = self.time = null;
                self.now1 = new Date();
                self.now2 = new Date();
            }
        }
    });

}));