# 指令
终于到了最最重要的一章了，Selenium指令（Selenium Command，以下简称指令）。

在Basic章节的Function介绍中，曾经屡次提及指令这个关键字，那么它到底是什么呢？

想象一下，当你在做一件事情的时候，其实往往并不是先行动，而是先进行思考，大脑发出一个信号，顺着神经网络，一级一级的传到肌肉组织，从而指挥手脚完成动作。按这个逻辑，其实在POSHI的工作流中，我们就好像大脑，而4种数据结构就好似神经网络一级一级传递信号，最终到达特定的Selenium Command进而再操纵浏览器。

这里指令便充当了POSHI的手脚，如果没有指令，POSHI就只是一些毫无意义的文本文件而已。

举个例子，
```
<command name="click">
	<execute selenium="waitForVisible" />
	<execute selenium="mouseOver" />
	<execute selenium="click" />
	<execute selenium="assertJavaScriptErrors" />
	<execute selenium="assertLiferayErrors" />
</command>
```
这是``Click#click``的代码块，可以看出，一个click command，由5个指令组成，因此调用click command，其实是执行这5个指令。

## 本质
我们直接从指令的本质说起。

指令其实就是Selenium API的二次封装，二次开发。这样做的原因是，虽然Selenium API已经足够强大，但它的API毕竟相对于复杂的任务略显初级，因此并不能满足某个特定的产品的需求，比如Liferay Portal。

就以上面那个例子来讲，一个点击操作，如果仅仅只是进行一个click指令操作，那么这个command很有可能在实际运行中，就会以失败告终。为什么会这样呢？因为实际运行环境中是有很多未知因素，如点击元素由于页面加载慢还未来的及显示、点击的元素为级联元素、点击的元素不可见、点击的元素没有点击事件等等，这些位置因素都会制约原生Selenium API的使用，因此我们需要对它进行二次开发以应对这些未知因素。

在底层中，Liferay对Selenium API的封装采用继承Selenium Webdriver类（WebDriverWrapper），实现Selenium接口（LiferaySelenium）的方式进行二次开发。（详细内容会在Source章节介绍）二次开发类的方法其实与POSHI中的指令一一对应，举个例子：
```
<execute selenium="click" />
```
它在Java中的``BaseWebDriverImpl``中的实现代码（二次开发实现）如下：
```
public void click(String locator) {
		if (locator.contains("x:")) {
			String url = getHtmlNodeHref(locator);
			open(url);
		}
		else {
			WebElement webElement = getWebElement(locator);
			try {
				webElement.click();
			}
			catch (Exception e) {
				if (!webElement.isDisplayed()) {
					scrollWebElementIntoView(webElement);
				}
				webElement.click();
			}
		}
	}
```
如果你不懂Java也没有关系，这段代码大概做了下列处理：
>**Note** 首先判断一个这个元素的locator是否为``x:``形式开头的，如果是，它应该是一个无法点击的元素，因此会采取一种另一种方式模拟点击操作（获取链接并访问）；如果不是，会先点击，如果点击过程抛出异常，再判断元素是否可见，如果不可见，先将元素变为可见，之后再进行点击。

这个处理其实就应对了上文提到的两个位置因素：
* 目标元素可能没有点击事件
* 元素不可见

而这仅仅是一个基类，针对不同浏览器还会有继承于这个基类的子类，同样也会针对不同浏览器的特性而重写Selenium API的方法。

# 使用
由于指令是POSHI中的最底层了，因此作为POSHI的使用者其实是不会直接使用指令与浏览器打交道的，因为我们一般使用提前封装好的Function来操作浏览器，这才是正确的方式。

虽然我们使用Function来操作浏览器，但并不代表我们不可以使用指令。

在POSHI中使用指令很简单，其调用语法与调用普通的PO对象方法相同，如下：
```
<var method="selenium#getLocation()" name="rssURL" />
```
>**Note**调用``Selenium Command``中的``getLocation()``方法。

与变量的知识相结合，我们可以得知，这段代码本质上声明了一个``rssURL``的变量，其值等于``selenium#getLocation()``的返回值，这里这个值等于当前窗口的``URL``。

这个例子中，我们就以索引语法的形式，调用了我们在POSHI中二次封装的Selenium API，其效果等同于在Java中，以下列形式调用：
```
BaseWebDriverImpl.getLocation()
```
虽然我们可以在POSHI直接调用指令来进行一些操作，但是我们可以发现这些操作大体上是一种**取**的操作，如``getText()``或``getLocation()``等以``get``开头的方法，这些方法有一个特点，就是不会对浏览器页面进行更改，只会从中提取信息。反之，对于浏览器可以进行修改的方法则不要使用，因为会更改浏览器的页面状态，从而导致自动化测试进程中，页面状态的不一致，进而导致执行失败。

# 参考
这里罗列了一些可以在POSHI中使用的指令API文档。（这部分我没有亲自实验，因为毕竟很少用到）

以SHA为4e1dde4ac142f754ae036b893a5af7bdb88a7b2c的master代码为标准，[]中的是可选参数，仅供参考：

## 取值类(返回值均为``String``)

### getAlert()
- Retrieves the message of a JavaScript alert generated during the previous action, or fail if there were no alerts.
- 获取弹出框的文字信息

### getAttribute(``String`` attributeLocator) 
- Gets the value of an element attribute. [attributeLocator: //xpath@attribute]
- 获取指定元素的某个属性值，``attributeLocator``的格式为``//xpath@attribute``。

### getBodyText() 
- Gets the entire text of the page.
- 获取当前页面``body``中的所有文字节点的值。

### getCurrentDay() 
- Returns the current day.
- 获取当前的日期（``Date``）。

### getCurrentMonth() 
- Returns the current month.
- 获取当前的月份。

### getCurrentYear() 
- Returns the current year.
- 获取当前的年份。

### getEmailBody(``String`` index)
- 获取IMAP文件夹中指定索引对象的内容。

### getEmailSubject(``String`` index)
- 获取IMAP文件夹中指定索引对象的标题。

### getFirstNumber(``String`` locator)
- 获取指定元素文本节点的值的第一个数字。

### getFirstNumberIncrement(``String`` locator)
- 获取指定元素文本节点的值的第一个数字的递增数。

### getEval(``String`` script) 
- Gets the result of evaluating the specified JavaScript snippet.
- 获取执行``eval(script)``返回的对象。

### getLocation() 
- Gets the absolute URL of the current page.
- 获取当前页面的绝对路径。

### getNumberDecrement(``String`` number) 
- Returns a decremented number. This will only work with integer values.
- 获取``number``的递减数，相当于``number--``。

### getNumberIncrement(``String`` number) 
- Returns an incremented number. This will only work with integer values.
- 获取``number``的递增数，相当于``number++``。

### getSelectedLabel(``String`` selectLocator) 
- Gets option label (visible text) for selected option in the specified select element.
- 获取``Select``选取``Option``文本节点的值。

### getText(``String`` locator) 
- Gets the text of an element.
- 获取一个元素的文本节点的值。

### getValue(``String`` locator) 
- Gets the (whitespace-trimmed) value of an input field (or anything else with a value parameter).
- 获取一个元素的值（有``value``属性的或这是``input``表单元素）。

## 判断类(返回值均为``Boolean``)

### isAlertPresent() 
- Has an alert occurred? Returns "true" or "false".
- 判断弹出框是否出现。

### isElementPresentAfterWait(``String`` locator) 
- Verifies that the specified element is not somewhere on the page, after 60 seconds. Returns "true" or "false".
- 判断一个元素是否在等待``60``秒后是否出现。

### isChecked(``String`` locator)/isNotChecked(``String`` locator)
- Gets whether a toggle-button (checkbox/radio) is checked. Returns "true" or "false".
- 判断多选框/单选框是否选中。

### isElementPresent(``String`` locator)/isElementNotPresent(``String`` locator)
- Verifies that the specified element is somewhere on the page. Returns "true" or "false".
- 判断一个元素是否出现。

### isPartialText(``String`` locator, ``String`` value)/isNotPartialText(``String`` locator, ``String`` value) 
- Determines if the specified text of an element does not contain the value. Returns "true" or "false".
- 判断一个元素的文本节点的值是否包含一个特定的值。

### isSelectedLabel(``String`` selectLocator, ``String`` pattern)/isNotSelectedLabel(``String`` selectLocator, ``String`` pattern) 
- Determines if the selected option in the specified select element does not match the pattern. Returns "true" or "false".
- 判断一个选项是否满足一个期望的模式。

### isText(``String`` locator, ``String`` value)/isNotText(``String`` locator, ``String`` value) 
- Determines if the specified text of an element does not match the expected value. Returns "true" or "false".
- 判断一个元素的文本节点的值是否匹配一个期望的值。

### isValue(``String`` locator, ``String`` value)/isNotValue(``String`` locator, ``String`` value) 
- Determines if the (whitespace-trimmed) value of an input field does not match the expected value. Returns "true" or "false".
- 判断一个元素的值是否匹配一个期望的值。

### isVisible(``String`` locator)/isNotVisible(``String`` locator) 
- Determines if the specified element is not visible. Returns "true" or "false".
- 判断一个元素是否可见。

### isPartialText(``String`` locator, ``String`` value)/isNotPartialText(``String`` locator, ``String`` value) 
- Determines if the specified text of an element contains the value. Returns "true" or "false".
- 判断一个元素的文本节点的值是否包含一个特定的值。

### isTextPresent(``String`` pattern)/isTextNotPresent(``String`` pattern) 
- Verifies that the specified text pattern does not appear somewhere on the rendered page shown to the user. Returns "true" or "false".
- 判断一个元素的文本节点是否出现




