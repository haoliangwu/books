# Function
函数原型，是PO中最小的构成单元。它是连接POSHI与Selenium的桥梁，每个Function的Command块，都由若干提前封装好的Selenium Command组成。这里似乎引出了一个新的概念，简单介绍下：
```
<execute selenium="waitForVisible" />
```
这个便是所谓的Selenium Command，它会在POSHI Runtime中被转译成实际调用Selenium库的代码，如何转译会在Source章节详细介。

总之将Function理解为封装多条Selenium Command的集合即可。

### 职责
Function在POSHI的职责已经在上文说了，它是连接Selenium的桥梁。但是这么说其实是有一些抽象的，因为你可能没有接触过底层的API，就好比你站在一座很长的桥的一头看另一头一样，虽然你能看到，但是却看得不清楚。我们不妨以在黑盒测试的角度来看它，会更好理解一些。

Function所扮演的角色，就好比我们平时进行黑盒测试时，所进行的手动操作。先说一些简单操作比如点击操作、键盘操作，这些操作都是最基本的硬件操作。还有一些复杂操作，比如拖拽操作，仔细想想拖拽的过程，首先你会点击你想拖拽的元素，之后移动它，再放开鼠标，复杂操作是由简单操作组成的。另外还有计算机本身不具备的操作，比如为了验收点击页面后的结果是否正确，我们需要用肉眼去看，之后核对点击前后的结果。这样的一系列操作的抽象即是Function。

POSHI中的Function大体分类如下：
* 基础操作，比如``Click``、``Type``、``Check``等简单的浏览器行为或者硬件行为。
* 高级操作，比如``DownloadTempFile``、``DragAndDrop``、``SelectWindow``等比较复杂的浏览器行为。
* 验收操作，比如``AssertChecked``、``AssertClick``、``IsTextEqual``等以Assert或者Is开头的Function。

### 结构
Function的基本结构如下，以Click#click为例：
```
<definition default="click" summary="Click on '${locator1}'">
    ...(省略)
	<command name="click">
		<execute selenium="waitForVisible" />
		<execute selenium="mouseOver" />
		<execute selenium="click" />
		<execute selenium="assertJavaScriptErrors" />
		<execute selenium="assertLiferayErrors" />
	</command>
	...(省略)
</definition>
```

最基础的文档结构是这样的，
> **NOTE**以definition为根元素，之后以command元素定义子模块，每个command中包含若干execute元素。

command中可以包含条件判断（Advance部分会详细介绍），注意其中的``if``的代码块，
```
<command name="clickWaitForInlineCKEditorNoMouseOver">
		<if>
			<condition argument1="//div[contains(@class,'cke_editable_inline')]" selenium="isElementPresent" />
			<then>
				<execute argument1="//script[contains(@src,'http://localhost:8080/html/js/editor/ckeditor/plugins/wsc/lang/en.js')]" selenium="waitForElementPresent" />
			</then>
		</if>
		<execute selenium="waitForVisible" />
		<execute selenium="click" />
</command>
```
command中还可以调用其它的Function的command，注意第一个``execute``，
```
<command name="partialTextClickAt">
		<execute function="AssertTextEquals#assertPartialText" />
		<execute selenium="mouseOver" />
		<execute selenium="clickAt" />
		<execute selenium="assertJavaScriptErrors" />
		<execute selenium="assertLiferayErrors" />
</command>
```
总结如下，
> **NOTE**Function由多个command块组成，每个command代表独立的子动作，command可以调用Selenium command和其它Function的command，同时可以存在条件判断。