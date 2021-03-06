# Sikuli
这章主要介绍POSHI中除Selenium之外，所使用的一门特殊的自动化脚本语言Sikuli。

Sikuli其本身是一门新概念的脚本语言，之所以称为新概念，是因为它引用了图像编程概念，即“所见即所得”的思维方式。

对于Sikuli的介绍这里暂不做详细介绍，一是因为技术还不成熟，二是因为其本身与POSHI并没有太多联系。详见[Sikuli简介](http://baike.sogou.com/v60108618.htm?fromTitle=sikuli)和[Sikuli官方文档](http://www.sikuli.org/)。

# POSHI为什么要使用它
虽然Sikuli本身与POSHI没有太多关联，为什么还要在POSHi中使用它呢？这就不得不提及Selenium对于操纵浏览器的一个缺陷。

这个缺陷就是，Selenium所能操纵的元素，必须基于浏览器**当前页面DOM文档**本身，且这个元素是可见的，有效的。这个缺陷可能在几年前还是不存在，那是因为几年前的WEB应用还是十分简单，其前端开发模式大抵基于HTML + JS + CSS的模式进行开发，所以开发出的页面交互性基本由基本的HTML空间控制，如按钮、单选框、下拉列表等等，因此前端页面也够也相对简单。

而当今前端模式由于JS的雄起，许多强大的JS框架相继产生，因此前端页面变的越来越复杂，许多控件已不在已基本控件存在，而是由开发出来的WEB组件代替，这些组件极大地提升了交互性，但是前端页面的变得越来越复杂。举一个显而易见的例子，在Liferay Portal中， 61版本的页面结构就比62简单很多，62又比Master简单很多。

前端页面的结构越复杂，对于Selenium的使用障碍就越大。为什么这么说呢？因为Selenium控制浏览器的模式是基于**Command+Target**的模式，而在复杂的页面中，精确的查询Target，显示是一件不容易的事情。在极为复杂的页面中，使用Xpath来索引页面元素，为了保证准确性，Xpath路径会变的很长且不一定在运行时可以准确搜索到期望定位的元素。

还有一种情况，就是一些极为高级的动作，Selenium API可能还做无法完成，如一些拖拽操作，联想一下Kaleo Workflow中的拖拽操作，其复杂程度可见一斑。还有一些无法捕获页面元素的情况，比如弹出框元素。

为了应付这些情况，POSHI使用Sikuli来解决这些障碍，这得益于Sikuli的两个有点，一个是它首先不基于浏览器，而基于操作系统，因此它不限制于DOM文档环境，而是因为它基于“所见即所得”的概念，所有的操作基于图像，而不是基于元素，这就大大简化了一些复杂操作的实现难度。

在使用Sikuli的时候，只需要提供某个业务情形下，需要操作的图形片段，如某个图标或者文字信息，之后它变会自动在当前窗口匹配对应的区域，之后再响应鼠标、键盘等事件。这里你完全不用在意浏览器，因为Sikuli已经跳出了浏览器，它是基于操作系统的。

# 我所需要了解的
不必刻意了解其实现原理或者语法之类的，只需知道Sikuli是一个基于操作系统的、使用“所见即所得”概念、可以以图像进行编程的自动化脚本编程语言即可。