# 功能型标签
功能型标签主要就是履行某些具体职责，我们可以按职责来为它们划分种类。
大体划分为：
* [生命周期型](#生命周期型)
  * [set-up](#set-up)
  * [tear-down](#tear-down)
* [声明型](#声明型)
  * [property](#property)
  * [var](#var)
* [逻辑运算型](#逻辑运算型)
  * [equals](#equals)
  * [condition](#condition)
  * [isset](#isset)
* [流程控制型](#流程控制型)
  * [if elseif then](#if-elseif-then)
  * [while then](#while-then)
  * [for](#for)
* [其他](#其他)

## 生命周期型
履行定义特定生命周期所进行操作的代码块的职责。
### set up
组装标签（初始化阶段标签），定义一系列在初始化阶段执行的代码块。
```
<set-up>
	<execute macro="User#firstLoginPG" />
	<execute macro="Page#addPG">
		<var name="pageName" value="Calendar Page" />
	</execute>
	<execute macro="Portlet#addPG">
		<var name="pageName" value="Calendar Page" />
		<var name="portletName" value="Calendar" />
	</execute>
</set-up>
```
>**NOTE**在初始化阶段，依次执行``User#firstLoginPG``、``Page#addPG``、``Portlet#addPG``宏。

### tear down
拆卸标签（清理阶段标签），定义一系列在清理阶段需执行的代码块。
```
<tear-down>
	<execute macro="Page#tearDownPG" />
	<execute macro="User#tearDownCP" />
	<execute macro="Site#tearDownCP" />
</tear-down>
```
>**NOTE**在清理阶段，依次执行``Page#tearDownPG``、``User#tearDownCP``、``Site#tearDownCP``宏。

## 声明型
履行声明特定变量（或参数）的职责。
### property
属性标签，定义POSHI runtime中的属性值
```
<property name="custom.properties" value="default.layout.template.id=1_column" />
<property name="portlet.plugins.includes" value="calendar-portlet" />
<property name="testray.main.component.name" value="Calendar" />
```
分别定义了3组属性值，分别是

> **NOTE**``custom.properties``(default.layout.template.id=1_column)、``portlet.plugins.includes``(calendar-portlet)、``testray.main.component.name``(Calendar)。

三组属性的具体含义如下：
 * ``custom.properties``：需要在portal-ext.properties中预设的参数``default.layout.template.id=1_column``。
 * ``portlet.plugins.includes``：需要在portal中预部署的``calendar-portlet``。
 * ``testray.main.component.name``：testray属性，其值为Calendar。
 
这里的属性是指POSHI的runtime中的属性，比如portal的属性、testray server的属性等，会在Advanced章节详解。

### var
变量标签，定义POSHI数据结构中的变量值。
```
<var name="eventTitle" value="Calendar Event All Day Title" />
<var name="eventType" value="All Day" />
<var name="pageName" value="Calendar Page" />
```
分别定义了3组变量值，分别是

>**NOTE**``eventTitle``(Calendar Event All Day Title)、``eventType``(All Day)、``pageName``(Calendar Page)。

这里的参数就是所谓的POSHI中的变量，会在Advanced章节详解。

## 逻辑运算型
履行进行逻辑运算生成Boolean值的职责。
### equals
等值判断标签，判断两个值是否相同，相同为``true``，否则为``false``。
```
<equals arg1="${menuListOption}" arg2="RSS" />
```
>**NOTE**判断``${menuListOption}``的值与``RSS``是否相同。

### condition
条件判断标签，根据指定条件判断真假，满足条件为``true``，不满足条件为``false``。
```
<condition function="IsElementPresent" locator1="PGCalendarCalendarSettings#SUCCESS_MESSAGE" />
```
>**NOTE**判断Xpath为``PGCalendarCalendarSettings#SUCCESS_MESSAGE``的元素是否满足条件``IsElementPresent``。

这里所谓的**是否满足条件``IsElementPresent``**，其实是执行``IsElementPresent``function，这个function即使``条件``，之后会根据执行结果来判断是否满足条件。

### isset
变量值检查标签，判断变量值是否为空，非空为``true``，空为``false``。
```
<isset var="fontSize" />
```
>**NOTE**判断名字为``fontSize``的变量是否为空。

所有的逻辑运算标签均代表一个Boolean值，非真即假，因此也它会常常与选择结构(if/else)配合使用。

## 流程控制型
履行控制选择和循环结构的职责，这里通常是一组标签配合使用，代表一个连续的流程控制结构。
### if elseif then
选择结构标签组，定义选择流程控制结构。
```
<if>
	<equals arg1="${anonymous}" arg2="true" />
	<then>
		...(code1)
	</then>
</if>
```
>**NOTE**当``${anonymous}``与``true``相等时，执行``code1``；否则不执行任何操作。

```
<if>
	<isset var="tagNameList" />
	<then>
		...(code1)
	</then>
    <else>
		...(code2)
	</else>
</if>
```
>**NOTE**当``tagNameList``不为空时，执行``code1``；否则执行``code2``。

```
<if>
	<equals arg1="${saveAsDraft}" arg2="true" />
	<then>
		...(code1）	
	</then>
	<elseif>
	<equals arg1="${preview}" arg2="true" />
	    <then>
			...(code2)
	    </then>
    </elseif>
	<else>
		...(code3)
	</else>
</if>
```
>**NOTE**当``${saveAsDraft}``为``true``时，执行``code1``；当${preview}为``true``时，执行``code2``；否则执行``code3``。

以上3个例子中，选择控制标签都与逻辑运算型标签配合使用，来达到进行流程控制的目的。

流程控制的通用结构是这样的：
```
<if>
	...(condition1)
	<then>
		...(code1）	
	</then>
	<elseif>
	...(condition2)
	    <then>
			...(code2)
	    </then>
    </elseif>
    <elseif>
	...(condition3)
	    <then>
			...(code3)
	    </then>
    </elseif>
    ...(多个elseif块)
	<else>
		...(code*+1)
	</else>
</if>
```
>**NOTE**当满足``condition1``，执行``code1``；当满足``condition2``，执行``code2``；...；否则执行``code*``。

### while then
条件循环结构标签组，定义条件循环流程控制结构。
```
<while>
	<condition function="IsElementPresent" locator1="PGMessageboards#THREAD_TABLE_ACTIONS_GENERIC" />
	<then>
		...(code1)
	</then>
</while>
```
>**NOTE**执行``<condition function="IsElementPresent" locator1="PGMessageboards#THREAD_TABLE_ACTIONS_GENERIC" />``，判断结果，为true时，执行code1，之后重复以上过程；为false时，跳出循环结构。

条件循环结构同样是与逻辑运算型标签配合使用，来达到进行流程控制的目的。

### for
遍历循环结构标签组，定义遍历流程控制结构。
```
<for list="${tagNameList}" param="tagName">
	...(code1)
</for>
```
>**NOTE**遍历``${tagNameList}``集合中的每一个元素，并以元素为参数执行``code1``。

当${tagNameList}为['a','b','c']时，以下的代码
```
<for list="${tagNameList}" param="tagName">
	<execute function="Type" locator1="..." value1="${tagName}" />
</for>
```
等价于
```
<execute function="Type" locator1="..." value1="a" />
<execute function="Type" locator1="..." value1="b" />
<execute function="Type" locator1="..." value1="c" />
```

注意每个``execute``标签中的``value1``的值。

## 其他
### description
描述标签，会在日志中输出message
```
<description message="Navigate to Site Administration > Configuration > ${portletName}." />
```
> **NOTE**输出``Navigate to Site Administration > Configuration > ${portletName}.``到日志中。