# Macro
一些在POSHI中适用于Macro PO对象的通用规范。

## 通用规范
### 按实体对象来关联Macro对象，并用驼峰命名法来命名。
* Blogs Entry -> BlogsEntry.macro
* Blogs Entry Comment -> BlogsEntryComment.macro
* Blogs Portlet -> BlogsPortlet.macro

### Macro应当封装一些关于关联对象的简单操作
* add a blogs entry -> add
* edit the entry's content -> editContent

如果为了表示操作范围，比如在``Control Panel``中进行以上操作
* add a blogs entry in control panel -> addCP
* edit the entry's content in control panel -> editContentCP

## 命名规则
### 以实体对象的名字来命名
* Blogs Entry -> BlogsEntry.macro
* Blogs Entry Comment -> BlogsEntryComment.macro

### 以Portlet的名字来命名
当Portlet的名字足以区分当前对象是Portlet对象，可以省略Portlet后缀
* Calendar Portlet-> Calendar.macro
* WebForm Portlet-> WebForm.macro
当Portlet的名字不足以区分当前对象是Portlet对象，需要加上Portlet后缀
* Blogs Portlet-> BlogsPorlet.macro
> **Note** 如果写成``Blogs.macro``的话，无法与``Blogs Entry``做有效的区分。

当Porlet的名字所包含单词为复数时，可以使用缩写表示
* Web Content Display Porlet -> WCD
* Document Management Porlet -> DM

## Command规范
### 按字母表类型使Command的名字排序
>（略）
### Command彼此间要保持空行
>（略）
### 使用驼峰命名法
### 按以下的组成形式来命名
>[action][modifiers][method][CP/PG]

* ``action``: 动作，add, edit, delete, view, move, copy等。（唯一）
* ``modifier(s)``: 修饰语，WithStructure, ToFolder等。（可叠加）
* ``method``: 方式，ViaActions, ViaAP等。（唯一）
* ``CP/PG``: 操作范围，CP或者PG（唯一）

> **Note** 唯一和可叠加表示这个片段是否可以出现多次，且``method``一般以``Via``作前缀。

## 设计逻辑规范
### 按顺序与页面元素进行操作
* 从上到下
* 从左到右

### 将连续的操作绑定到一起
```
<execute function="Type" locator1="PGBlogsAdd#TITLE_FIELD" value1="${entryTitle}" />
<execute function="Type#typeCKEditorWaitForCKEditor" locator1="PGBlogsAdd#CONTENT_FIELD" value1="${entryContent}" />
```
这里两条命令均是``Type``命令，把它们放到一起（中间无空行）。

### 使导航宏保持洁净（除了作用与TearDown生命周期的Macro）
保持洁净的意思是，尽量不依赖于其他的Command。
```
<command name="gotoPG">
	<var name="key_entryContent" value="${entryContent}" />
	<var name="key_entryTitle" value="${entryTitle}" />

	<execute function="AssertTextEquals" locator1="PGBlogs#ENTRY_TITLE" value1="${entryTitle}" />
	<execute function="AssertTextEquals" locator1="PGBlogs#ENTRY_CONTENT" value1="${entryContent}" />
	<execute function="AssertClick" locator1="PGBlogs#ENTRY_TITLE" value1="${entryTitle}" />
</command>
```
这一个``Blog``导航宏，可以注意到它没有调用任何Command，只使用Function进行编写。这样做的好处是，它可以被其他的Command更灵活的调用而不必产生更多的耦合关联，同时由于变量可以继承调用者的作用域中的变量，因此可以减少传参造成的代码冗余。

### 在调用Function时，请将必要的变量声明在整段调用代码块的前面
```
<command name="gotoEditPG">
	<execute function="Pause" locator1="1000" />
	
	<var name="key_entryTitle" value="${entryTitle}" />
	
	<execute function="AssertTextEquals" locator1="PGBlogs#ENTRY_TITLE" value1="${entryTitle}" />
	<execute function="AssertClick#assertTextClickAndWait" locator1="PGBlogs#ENTRY_EDIT" value1="Edit" />
</command>
//bad

<command name="gotoEditPG">
	<var name="key_entryTitle" value="${entryTitle}" />

	<execute function="Pause" locator1="1000" />
	<execute function="AssertTextEquals" locator1="PGBlogs#ENTRY_TITLE" value1="${entryTitle}" />
	<execute function="AssertClick#assertTextClickAndWait" locator1="PGBlogs#ENTRY_EDIT" value1="Edit" />
</command>
//good
```
这样做可以使代码看起来更加整齐，可读性更高。

### 在调用Macro时，请将必要的变量声明在它的作用域中（临时变量）
```
<var name="pageName" value="${pageName}" />
<execute macro="Page#gotoPG"/>
//bad

<execute macro="Page#gotoPG">
	<var name="pageName" value="${pageName}" />
</execute>
//good
```
这样写的好处是，对于阅读这段代码的人来说，可以在不查看``Page.macro``源文件的基础上，很快地得知``Page#gotoPG``的必要参数是``pageName``。

### 尽可能使用``assertClick``
* 可以生成更多的日志来记录实际的操作
* 对于点击目标做了更充分的检查

## 变量声明规范
### 全局变量
* 使用固定的前缀名，比如以``blogsEntry``为前缀的变量名，像``blogsEntryContent``或者``blogsEntryTitle``等。
* 声明顺序按照字母表顺序排序
### 临时变量
* 声明顺序按照字母表顺序排序