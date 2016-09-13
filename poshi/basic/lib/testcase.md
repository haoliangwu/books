# TestCase
测试用例原型，是POSHI中处于最顶层的数据结构，这个结构会广泛的调用具有实际业务逻辑的宏原型来完成测试工作。相比其他的原型，TestCase有一个生命周期的概念，所谓生命周期，是指一个测试用例，从开始执行，到结束执行所需要经历的所有过程，这些过程包括setUp()，runTest()和tearDown()，一个TestCase文件针对这些生命周期，分别对应setUp块，若干Command块（对应runTest）与tearDown块，下文会详细解析。
    
### 职责
TestCase是POSHI运行环境中的入口，也是一个完整的测试流程的载体。为什么这么说，因为它其实也是对于整个测试流程的一个抽象，我们只需要分别从它所经历的3个生命周期来分析即可，
* ``setUp``：初始化阶段，会进行一系列的准备工作（生成基本数据、对基本测试环境的检测等）。
* ``runTest``:作业阶段，会依次运行一系列的测试用例（command块）。
* ``tearDown``:清理阶段，会进行一系列的清理工作（清理垃圾数据、恢复默认配置等）。

对于TestCase的分类，显然是没有什么实际意义，因为TestCase都与所需要进行测试工作的对象有关联，因此以测试对象的分类归类即可。

### 结构
TestCase的基本结构如下， 以PGCalendar为例：
```
<definition component-name="portal-calendar">
	<property name="custom.properties" value="default.layout.template.id=1_column" />
	<property name="portlet.plugins.includes" value="calendar-portlet" />
	<property name="testray.main.component.name" value="Calendar" />
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
	<tear-down>
		<execute macro="Page#gotoPG">
			<var name="pageName" value="Calendar Page" />
		</execute>
		<if>
			<condition function="IsElementPresent" locator1="PGCalendar#SCHEDULER_EVENT_GENERIC" />
			<then>
				<execute macro="CalendarEvent#tearDown" />
			</then>
		</if>
		<execute macro="Calendar#tearDown" />
		<execute macro="Calendar#tearDownColor" />
		<execute macro="CalendarResource#tearDown" />
		<execute macro="CalendarConfiguration#tearDown" />
		<execute macro="Page#tearDownPG" />
		<execute macro="User#tearDownCP" />
		<execute macro="Site#tearDownCP" />
	</tear-down>
	<command name="AddCalendarEventAllDay" priority="5">
		<execute macro="Page#gotoPG">
			<var name="pageName" value="Calendar Page" />
		</execute>
		<execute macro="CalendarNavigator#gotoAddEvent" />
		<execute macro="CalendarEvent#add">
			<var name="eventTitle" value="Calendar Event All Day Title" />
			<var name="eventType" value="All Day" />
			<var name="pageName" value="Calendar Page" />
		</execute>
		<execute macro="Page#gotoPG">
			<var name="pageName" value="Calendar Page" />
		</execute>
		<execute macro="CalendarEvent#view">
			<var name="eventTitle" value="Calendar Event All Day Title" />
		</execute>
	</command>
	...(省略)
```
最基础的文档结构是，
> **NOTE**以definition为根元素，之后以set-up元素和tear-down元素定义初始化与清理模块，其中包含若干execute元素，以command元素定义子模块，每个command中包含若干execute元素。

TestCase中的任何生命周期中，均可以包含条件判断，如：
```
<if>
		<condition function="IsElementPresent" locator1="PGCalendar#SCHEDULER_EVENT_GENERIC" />
		<then>
			<execute macro="CalendarEvent#tearDown" />
		</then>
</if>
```
同也可以直接调用Function，如：
```
<execute function="Pause" locator1="120000" />
```
>**Caution**但是TestCase中不可以直接调用Selenium Command和其他TestCase中的command，关于前者，原因应该与Macro相同，至于后者，应该是因为TestCase彼此之间的生命周期是独立的，因此无法互相调用。