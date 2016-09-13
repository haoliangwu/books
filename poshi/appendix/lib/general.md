# 常规
一些在POSHI中适用所有PO对象的通用规范。

## 为什么需要这些规范
### 可读性/清晰
> **Note** 对于新人更友好，对于老手更易读。

### 结构性/可预知
> **Note** 更好的在脑海中形成结构性的概念，也可以使旧的脚本作为编写新的脚本的一种参考。

### 效率性/易维护
> **Note** 代码越少越清晰，越清晰越易维护，越易维护越易于开发，越易于开发效率越高。

## 通用规范
### 在一个标签没有子标签的情况下，请使用封闭标签
```
<execute selenium="waitForVisible" ></>
//bad

<execute selenium="waitForVisible" />
//good
```

### 父标签与子标签中不应存在换行
```
<definition default="addSelection">

	<command name="addSelection">
		...（省略）
	</command>
</definition>
//bad

<definition default="addSelection">
	<command name="addSelection">
		...（省略）
	</command>
</definition>
//good
```


### 在封闭标签的末尾，应该存在换行
```
<command name="addSelection">
		<execute selenium="waitForVisible" />

		<execute selenium="mouseOver" />
		<execute selenium="addSelection" />
		<execute selenium="assertJavaScriptErrors" />
		<execute selenium="assertLiferayErrors" />
</command>
//bad

<command name="addSelection">
		<execute selenium="waitForVisible" />

		<execute selenium="mouseOver" />

		<execute selenium="addSelection" />

		<execute selenium="assertJavaScriptErrors" />

		<execute selenium="assertLiferayErrors" />
</command>
//good
```

## 命名规范
使用``CP``和``PG``来划分所包含PO对象的操作范围：
* ``CP``: 指包含发生于``Control Panel``和``Site Administration``。 
* ``PG``: 指包含发生于``Created Page``。

## 在遭遇没有格式规范的情形时
* 请参考[这些规则](#为什么需要这些规则)。
* 看看别人的如何写的。
* 询问你的reviewer。

## 文件夹规范
### POSHI文件根目录
* ``${test-home}``: ${liferay-home}/portal-web/test/functional/com/liferay/portalweb

### PO对象目录
* ``${function-home}``: ${test-home}/functions，存放``Function``文件。
* ``${macro-home}``: ${test-home}/macros，存放``Macro``文件。
* ``${testcase-home}``: ${test-home}/tests，存放``Testcase``文件。
* ``${path-home}``: ${test-home}/paths，存放``Path``文件(现阶段只存放外部Path)。

>**Note** Path文件现在还存在于``testcase-home``中对应``component``的``block``文件夹中，以后可能会改为上面的文件系统结构。

### 特殊目录
* ``Util目录``: ${test-home}/util，主要存放通用的``Path``文件。
* ``依赖目录``: ${test-home}/dependencies，主要存放PO对象中使用的依赖文件，如文档、图像文件、模板文件等。

## 依赖文件规范
在存放文件时，应该以使用文件的种类，对路径进行区分，如：
* ``普通依赖文件路径``: ${test-home}/dependencies
* ``Sikuli依赖文件路径``: ${test-home}/dependencies/sikuli
* ``Mobile依赖文件路径``: ${test-home}/dependencies/mobile
