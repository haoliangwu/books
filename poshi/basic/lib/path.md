# Path
严格意义上来讲，Path本身很不应算在POSHI的数据结构中，或者说与其他3类结构有很大的区别，因为这个结构是以储存结构存在的，其角色也是为了充当其他3类结构的被索引对象。

那么其他3类对象要从Path这里索引什么呢？答案就是locator属性的值（标签详解章节会讲），这个值帮助Selenium库定位所要操纵的元素。这个locator在Path文件中，以key-value的键值对形式储存，以HTML表格形式标注（因此查看Path文件实际是可以直接在浏览器中来查看的）。

### 职责
Path结构其实是充当着POSHI中定位器的角色。

Selenium给哪个元素复制？找Path。
Selenium点击了哪个元素？找Path。
Selenium检查了哪个元素的值？还是找Path。

因此，没有Path结构，Selenium无法准确的对想要操纵的元素进行操纵，因此它在POShI中的地位，是重中之重，而且在维护的工作中，其实大部分的工作量，都存在与维护locator，因为UI是随着应用开发过程中，变化最频繁的部分，因此locator也是变化最频繁的部分。

### 结构
Path文件的文档结构十分简单，直接上例子，
```
<html>
<head>
<title>PGCalendarVieweventdetails</title>
</head>
<body>
<table cellpadding="1" cellspacing="1" border="1">
<thead>
<tr><td rowspan="1" colspan="3">PGCalendarVieweventdetails</td></tr>
</thead>
<tbody>
<tr>
	<td>VIEW_EVENT_IFRAME</td>
	<td>//iframe[contains(@class,'dialog-iframe-node')]</td>
	<td></td>
</tr>
<tr>
	<td>EVENT_TITLE</td>
	<td>//h3[@class='header-title']/span</td>
	<td></td>
</tr>
...(省略)
</tbody>
</table>
</body>
</html>
```
直接看body中间的部分就可以了，首先它是一个表格，之后每一个key-value的以
```
<tr>
	<td>${key}</td>
	<td>${value}</td>
	<td></td>
</tr>
```
的形式标注，这里的``${key}``分别对应检索语法中的
```
${file-name}#${command-name}
```
``${command-name}``的值。（[回忆检索语法点这里](/chapter2.html#检索)）

至于为什么是3个td，而不是2个，这是因为POSHI中的Path文件是用Selenium IDE生成的，而第三个td在Selenium IDE中被用做标注action的地方，在这里没有什么实际意义。

**值得一提的是**，Path文件在POSHI 2.0中支持文件继承，是指一个文件可以继承于另一个文件，比如``PGMessageboardsBannedusers``中的
```
<tr>
	<td>EXTEND_ACTION_PATH</td>
	<td>PGMessageboards</td>
	<td></td>
</tr>
```
> **NOTE**指代它继承于``PGMessageboards``，因此一些在``PGMessageboardsBannedusers``中找不到的locator，会默认去它的父类``PGMessageboards``中查找。

### 我所需要了解的
这一章讲的是POSHI的数据结构，是重中之重，试想，如果你连字都认不好，如何交流，如何讲话？而这些结构就好比POShI中的单词，词组，掌握它才可以熟练AA。

对于每一种的详细结构和标签含义可以适当的降低标准，但结构与结构之间的关系以及基本标签的含义必须了解。
