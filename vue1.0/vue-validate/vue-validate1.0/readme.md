
> 参阅链接

```
    https://github.com/glenlzk/vue-custom-directives/tree/master/vue1.0/vue-validate

```



插件校验方式：
	1.校验范围
		
		获取校验范围内待校验元素
		
		每个元素：
			

			1.校验内容; data-reg; data-error;data-pos(设置气泡显示位置)
				
				<input type="text" maxlength="20" class="validate[required, custom[userName_min], maxSize[20]]                         form-control input-sm w150" placeholder="入住人姓名" data-errormessage-value-missing="请输入姓名" data-errormessage-custom-error="请输入正确的入住人姓名" data-errormessage="请填写正确的姓名" data-errormessage-range-overflow="名称最多是20位" data-prompt-position="topLeft:0,80" id="form-validation-field-0">


				<input type="text" maxlength="11" class="validate[custom[mobile]] form-control                          input-sm w140" placeholder="请输入手机号码" data-errormessage="请输入正确的手机号码" data-prompt-position="topLeft:0,80" id="form-validation-field-1">

			2. 隐藏(display: none; visibility:hidden;)无校验

			3.校验出错: 
				直接返回，滚动到对应元素位置，且提示气泡(设置气泡显示位置)，添加对应类名
				单标签(input),封闭式标签(select)需要嵌套盒子，

			4.校验正确直接通过:
			
			// ---------------------------------------- 

			5.动态生成校验，方式

			6. 联动校验，

				身份证，另外一个格子，必须填写

				class="validate[required,maxSize[11], custom[isNumber]]"

				第一个格子，找到另一个格子，满足多个联动（满足动态）
				校验规则制定（一对多个校验规则）
				
				关键因素：
					决定是否将关联元素该元素插入_hasClassElemsArr中校验

				场景1：
					第一个：空|required (关联第二个) 
						-----> 空 && required && 关联第二个
						-----> 第一个插入_hasClassElemsArr；

					第二个: 空|required (关联第三个)
						-----> required && 关联第三个
						-----> 第二个插入_hasClassElemsArr；

					.....
					第N个：必须要填 | 免填

				场景2：
					第一个：空 (关联第二个) 
						-----> 空 && 关联第二个
						-----> 第一个不插入_hasClassElemsArr；则，后面都不插入_hasClassElemsArr
				
				场景3：
					第一个：空 (关联第二个) 
						-----> 不为空时 && 关联第二个
						-----> 第一个不插入_hasClassElemsArr；

					第二个: 空|required (关联第三个)
						-----> 空 && 关联第三个
						-----> 后面都不插入_hasClassElemsArr；

						-----> required && 关联第三个
						-----> 第二个插入_hasClassElemsArr；

					.....
					第N个：必须要填 | 免填

				--------------------------------------------

				包含普通元素校验规则（value,一般都是特殊值：true/false/0/1/），可以采用特殊属性：
				<div class="validate[required,maxSize[11], custom[isNumber]]" validateValue="{{true/false}}"></div>


				radio/checkbox:

				radio:
					必须选

				checkbox:
					至少选一个
					至少选多个

			7.常用校验标签：
				
				select/input/textarea

			8.错误信息显示位置配置：----------- data-pos(设置气泡显示位置)

				left, top , bottom, right;
				{left: 10px, top: 10px}
				如果不设置，默认是top

			9.点击校验，

				// 先清除，已经插入的errTips提示


				是否必须包含在大盒子里，
					优势: 直接获取父盒子(特殊标记: 特殊标签(template)/表单(form)/id)

					考虑滚动因素：
						

				既可以包含，又可以不被包含: 

					被包含，类似上面处理方式
					不被包含，则指定特定id等

						特殊标签(template)/表单(form)/id

					考虑滚动因素
						1.啥时候应该滚动（不在窗口可视范围内）
							元素到文档顶部距离 < 窗口.scrollTop

							元素到文档顶部距离：
								元素相对于某个父元素的偏移量
								http://blog.csdn.net/liangklfang/article/details/50377754
								http://blog.csdn.net/liangklfang/article/details/50447557

						2.滚动到哪里
							窗口.scrollTop <= 元素到文档顶部距离

			10. checkBox, radio校验

			11. 虚拟表单校验


			



tips提示框:


联动组件


错误提示效果

var dom = eleId.getElementsByTagName("*");


var reg= new RegExp("(^|\\s)" + 'validate' + "(\\s|$)", "i");


var reg= new RegExp("(^|\\s)" + 'validate' + "\\[.*\\](\\s|$)", "i");
[^)]+

var reg= new RegExp("(^|\\s)" + 'validate' + "(\\s|$)", "i");


var str = 'validate[required]'
var str = 'validate'


str.match(reg)

> 使用说明：

```
<div class="item" v-validate v-el:item>
	<div class="pos-rel inl-block">
	   <input type="text" class="validate[required,maxSize[11], custom[isNumber]]"
	          data-promp-pos="{left: '34px', top: '-42px', triangle: 'top'}"
	          data-reg-user-name="^1[34578]\d{9}$"
	          data-reg-is-number="^[0-9]{11}$"
	          data-err-required="证件号不能为空!"
	          data-err-max-size="证件号长度不够!"
	          data-err-user-name="请入正确的证件号码!"
	          data-err-is-number="请入数字号码!"
	   >
	</div>
</div>

// -------------------------------------------------- 相关调用API：

// 返回校验结果
this.$els.item.validateFun();       // 返回true, false

// 清除页面，错误提示
this.$els.item.clearValidateFun()

// -----------------------------------------------最外围盒子
// 外盒子: class="item"

高度，overflow,相对定位------(必须)

height: 450px;
overflow-y: auto;
position: relative;

// 自定义指令入口----初始化(必须)

v-validate

// 类似元素id v-el:item----(必须)


// -----------------------------------------------表单嵌套盒子：用于装错误提示-----（必须）
<div class="pos-rel validate-in-box inl-block">
	input/select/textarea
</div>

.pos-rel {
    position: relative;
}

.inl-block {
    display: inline-block;
}

input/select/textarea {			// 为了和外盒子大小吻合，不会有间隙
	display: block;
}

// -----------------------------------------------表单嵌套盒子：用于装错误提示-----（必须）

<input type="text" class="validate[required,maxSize[11], custom[isNumber]]"
      data-promp-pos="{left: '34px', top: '-42px', triangle: 'top'}"
      data-reg-user-name="^1[34578]\d{9}$"
      data-reg-is-number="^[0-9]{11}$"
      data-err-required="证件号不能为空!"
      data-err-max-size="证件号长度不够!"
      data-err-user-name="请入正确的证件号码!"
      data-err-is-number="请入数字号码!"
>

class="validate[required,maxSize[11], custom[isNumber]]"

内部已定义校验：只需填写校验失败，错误提示
required	-----------> data-err-required="证件号不能为空!"
maxSize[11] -----------> data-err-max-size="证件号长度不够!"

自定义校验：必须填写校验规则，和 错误提示
custom[isNumber, mobile]

-----------> data-reg-is-number="^[0-9]{11}$" ----------------> data-err-is-number="请入数字号码!"

-----------> data-reg-mobile="^[0-9]{11}$" ----------------> data-err-mobile="请入数字号码!"

// -------------------------------------------------- 气泡显示位置：

// obj/left/top/right/bottom
triangle 代表小三角显示位置

data-promp-pos="{left: '34px', top: '-42px', triangle: 'top'}"
data-promp-pos="left/top/right/bottom"

```









// ------------------------------------------------------------------------------------ validationEngin.js

/**
* Required validation
*
* @param {jqObject} field
* @param {Array[String]} rules
* @param {int} i rules index
* @param {Map}
*            user options
* @param {bool} condRequired flag when method is used for internal purpose in condRequired check
* @return an error string if validation failed
*/
_required:
