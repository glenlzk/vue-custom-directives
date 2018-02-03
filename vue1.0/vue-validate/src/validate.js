/**
 * Created by lenovo on 2018/1/20.
 */


;(function (Vue) {

    // 1.定义一个组件对象
    var validate = {};

    // 1.常用工具函数
    // hasClass()
    var hasClass = function(element, className) {
        var reg= new RegExp("(^|\\s)" + className + "(\\[.*\\])?(\\s|$)", "i");
        if (element.className.match(reg))
            return true;
        return false;
    };

    // 首字母大写
    var firToUpperCase = function (str) {
        return str.substring(0,1).toUpperCase() + str.substring(1);
    };

    // 获取元素样式: style,class等
    var getStyle = function (obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return window.getComputedStyle(obj, null)[attr];
        };
    };

    // 判断数据类型
    // var _reg = new RegExp("^[object\\s(.*)]$", "i");
    // var str = "[object String]";
    var objType = function (obj) {
        var _str = Object.prototype.toString.apply(obj);
        var _reg = new RegExp("^\\[object\\s(.*)\\]$", "i");

        return _str.match(_reg)[1].toLowerCase();
    };

    // 解开嵌套的validate[] 和 custom[]
    // validate[required,maxSize[11], custom[userName,isNumber]] ==> [require, maxSize[11], custom[mobile], custom[isNumber]]
    var val_cus_fun = function (str, name) {
        var list = [];
        // class="validate[required, custom[userName_min], maxSize[20]]"
        var reg= new RegExp("(^|\\s)" + name + "(\\[(.*)\\])?(\\s|$)", "i");
        // 可考虑:element.classList = [] 但不能有空格、兼容性问题
        var _elem = str.match(reg);
        if (_elem && _elem[3]) {
            // _elem[3] = "required, maxSize[11], custom[userName,isNumber]" ===> [required, maxSize[11], custom[isNumber], custom[userName]]
            if (_elem[3].indexOf('custom[') > -1) {
                var _cusReg = new RegExp(",\\s*custom\\[(.*)?\\]\\s*", "i");
                // "required, maxSize[11], custom[userName,isNumber]" ===> custom[userName,isNumber] ==> "userName,isNumber"
                var _cusStr = _elem[3].match(_cusReg) && _elem[3].match(_cusReg)[1];
                // _cusStr = "userName,isNumber"
                var _curList = _cusStr.split(',') || [];
                // "required, maxSize[11], custom[userName,isNumber]" ===> "required, maxSize[11]"
                list = _elem[3].replace(_cusReg, '').split(',') || [];
                // list 和 _curList 拼接
                for (var j=0; j<_curList.length; j++) {
                    list.push('custom[' + (_curList[j]).trim() +']');
                };

            } else {
                list = _elem[3].split(',') || [];
            };
        };

        // [required, maxSize[11], custom[isNumber], custom[userName]]
        // console.log(list);
        return list;
    };
    // 解析指定的className
    var analysisClass = function (element, className) {

            if(!element.reg) element.reg = {};
            var list = val_cus_fun(element.className, className);
            var reg_item= new RegExp('^([^\\[\\]]*)' + "\\[(.*)\\]$", "i");

            for (var i=0; i<list.length; i++) {
                var listItem = (list[i]).trim();
                var _subList = (listItem.match(reg_item)) || [];
                // custom[userName_min] ==> _subList = [" custom[userName_min]", " custom", "userName_min", index: 0, input: " custom[userName_min]"]
                // maxSize[20] ==> _subList = [" maxSize[20]", " maxSize", "20", index: 0, input: " maxSize[20]"]
                if (_subList.length > 0) {
                    // validate.config内部属性
                    if (validate.config[_subList[1]]) {
                        // 覆盖validate.config内部属性
                        // 判断字符串是否为数字
                        element.reg[_subList[1]] = _subList[2]*1 == _subList[2] ? Number(_subList[2]): _subList[2];
                    } else {
                        var dataObj = element.dataset;
                        // 自定义校验 _subList =[custom[userName_min]]
                        if (_subList[1] == 'custom') {
                            var _customReg = dataObj['reg' + firToUpperCase(_subList[2])];

                            try {
                                if (!_customReg) throw new Error('reg' + firToUpperCase(_subList[2]) + '没有对应正则匹配!');
                            } catch (e) {}

                            element.reg[_subList[2]] = _customReg || '';
                        };
                    };
                } else {
                    // _subList = ["required", "maxSize"]
                    //  required ==> _subList = []
                    // 必须是validate.config内部属性: validate.config.required/validate.config.maxSize
                    // 否则配置该配置忽略
                    if (validate.config[listItem]) {
                        element.reg[listItem] = validate.config[listItem];
                    };
                };
            };

            console.log(element.reg);
    };

    // 校验表单
    var checkForValid = function(_elem, pop) {
        var _value = (_elem.value).trim();
        var _dataObj = _elem.dataset;

        // 布尔值
        // 校验，获取提示语
        switch (objType(_elem.reg[pop])) {
            case 'boolean':
                if (_elem.reg[pop] && _value == '') {
                    // data-err-required="手机号不能为空!"
                    alert(_dataObj['err' + firToUpperCase(pop)]);
                    // console.log('err' + firToUpperCase(pop));
                    return false;
                };
                return true;
            case 'number':
                if (_value.length < _elem.reg[pop]) {
                    alert(_dataObj['err' + firToUpperCase(pop)]);
                    return false;
                };
                return true;
            default:
                var _reg= new RegExp(_elem.reg[pop], "i");
                if (!_reg.test(_value)) {
                    alert(_dataObj['err' + firToUpperCase(pop)]);
                    return false;
                }
                return true;

        };
    };

    // 2.全局变量，通过window.dragBar暴露出去
    validate.config = {
        required: true,
        maxSize: 10,
        mobile: /^1[34578]\d{9}$/,
    };

    // 3.dragBar.install= 固定写法，用于组成组件
    validate.install = function (Vue) {

        Vue.directive('validate', {
            twoWay: true,
            params: [],
            // 初始化，只执行一次
            bind: function () {
                var elems = this.el.getElementsByTagName('*');
                var _hasClassElemsArr = [];


                for (var i=0; i<elems.length; i++) {
                    // 元素存在class ="validate" 且 不是隐藏元素
                    if (hasClass(elems[i], 'validate') && (getStyle(elems[i], 'display') == 'block' || getStyle(elems[i], 'visibility') == 'visible')) {

                        _hasClassElemsArr.push(elems[i]);
                        analysisClass(elems[i], 'validate');
                    };
                };

                this.el.validateFun = function () {
                    for (var i=0; i<_hasClassElemsArr.length; i++) {
                        // _elem.reg = {required: true, maxSize: 20};
                        var _elem = _hasClassElemsArr[i];
                        for (var pop in _elem.reg) {
                            if (_elem.reg.hasOwnProperty(pop)) {
                                var checkResult = checkForValid(_elem, pop);
                                if (checkResult) continue;
                                return checkResult;
                            };
                        };
                    };

                    return true;
                };

                console.log(this);

            },
            // value值发生变化时，会触发执行
            // 移除对应DOM，会触发（v-if="true"）
            update: function (value) {

            },
            // 移除对应DOM，会触发（v-if="false"）
            unbind: function () {

            }
        });
    };

    // 4.根据不同的环境，选择不同的暴露/注册方法
    if (typeof exports == "object") {
        module.exports = validate;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){
            return validate;
        })
    } else if (window.Vue) {
        window.validate = validate;
        Vue.use(validate)
    };

})(Vue);