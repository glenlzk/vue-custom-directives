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

				select/input/textarea

				left, top , bottom, right;
				{left: 10px, top: 10px}

			7.点击校验，

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

			8. checkBox, radio校验

			9. 虚拟表单校验


			



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