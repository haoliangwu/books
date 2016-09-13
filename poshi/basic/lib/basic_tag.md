# 基础型标签

### definition
定义标签（根标签），定义一系列与该文件相关的信息。
* ``default``:文件的默认command入口
* ``component-name``(Testcase):文件所属component的名称（在Testray和Jenkins上的分组名）
* ``summary``：日志记录信息

```
<definition default="addSelection">
	<command name="addSelection">
	    ...
	</command>
</definition>
```
>**NOTE** 这里指代AddSelection的默认command入口是addSelection。


```:PGCalendar.testcase
<definition component-name="portal-calendar">
...
</definition>
```
>**NOTE** 这里指代PGCalendar的组件名是``portal-calendar``。

```
<definition default="assertTextEquals" summary="Assert that '${locator1}' equals the value '${value1}'">
</definition>
```
>**NOTE** 这里的summary的信息会在执行时，同步生成到looger中。

### command
指令标签（模块标签），定义该文件的子模块。
* ``name``:模块名
* ``priority``(Testcase):模块优先级
* ``summary``：日志记录信息

```
<definition default="click" summary="Click on '${locator1}'">
	<command name="click">
        ...
	</command>
	<command name="clickAt">
	    ...
	</command>
	<command name="clickAtAndWait">
		...
	</command>
	...
</definition>
```
>**NOTE** 例子中的3个command的名称分别是``click``、``clickAt``、``clickAtAndWait``。


```
<command name="AddCalendarEventAllDay" priority="5">
	...
</command>
```
> **NOTE**``AddCalendarEventAllDay``这个模块在``PGCalendar``中的优先级是``5``（这个优先级对应Testray和Jenkins上的Priority）

### execute
执行标签（调用标签），会调用指定文件类型中的某个command模块并执行它。
* ${type}:调用command的所属文件类型，如selenium、function、macro
* locator{*}(Macro):所调command的target参数值，如locator1、locator2等
* value{*}(Function):所调command的参数值，如value1、value2等
* argument{*}（Selenium Command）:所调selenium的参数值，如argument1、argument2等

这里可能很多人看的有些晕了，来解释一下。

所谓${property}{*}的形式，意思就是泛指多个property，其个数完全取决与所调用的command。另外对于value与argument的区分，简单概括就是，只需要按不同的层面来区分它们即可。value所代表的是POSHI层面的参数，也就是TestCase、Macro、Function它们之间的参数，而argument所代表的是Selenium层面的参数，指代Function与Selenium它们之间的参数。

**参数在它们四者间的数据流，如下（``->``代表传参，这里不考虑Testcase直接调用Function的情况）：**
> Testcase -> ``var`` -> Macro -> ``value`` -> Function -> ``argument`` -> Selenium Command

这里的``var``指变量，暂且不讨论，会在Advanced部分详解。

来一些例子可能会更好的理解
```
	<execute macro="Page#addPG">
		<var name="pageName" value="Calendar Page" />
	</execute>
```
>**NOTE** 调用``Page``宏对象中的``addPG``command，同时定义一个变量。

```
    <execute function="SelectWindow#selectPopUp" locator1="null" />
```
> **NOTE**调用``SelectWindow``Function中的``selectPopUp``command，其target是空。

```
    <execute function="Confirm#waitForConfirmation" value1="Are you sure you want to delete this? It will be deleted immediately." />
```
> **NOTE**调用``Confirm``Function中的``waitForConfirmation``command，参数为``Are you sure you want to delete this? It will be deleted immediately.``（``.``很重要噢，AA勿忘）。

```
    <execute function="AssertTextEquals" locator1="PGCalendar#OTHER_CALENDARS_CALENDAR" value1="${calendarName}" />
```
>**NOTE** 调用``AssertTextEquals``的默认command，其target为``PGCalendar.path``中的以``OTHER_CALENDARS_CALENDAR``为key的Xpath所对应的元素，值为${calendarName}（涉及变量的知识，暂且当做一个值）。

```
<execute selenium="dragAndDrop" />
```
>**NOTE** 调用``dragAndDrop``Selenium Command。 

```
<execute argument1="${locator1}" selenium="waitForVisible" />
```
>**NOTE** 调用``waitForVisible``Selenium Command，参数为${locator1}（同上，是一个值）。

```
<execute argument1="${locator1}" argument2="${value1}" selenium="waitForText" />
```
>**NOTE** 调用``waitForText``Selenium Command，参数为${locator1}和${value1}（注意这里是两个参数）。

#### execute中的特殊情况
```
<execute function="Pause" locator1="120000" />
```
> **NOTE**使脚本停止120000毫秒。

至于这里为什么是locator1而不是value1来储存120000，应该是一些基于JAVA语法的限制吧。

还有一些特殊情况，暂时想不起来，之后发现的话，再补充到这里。
