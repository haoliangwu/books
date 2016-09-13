# Liferay相关
俗话说的好，纸上得来终觉浅，绝知此事要躬行。看了这么多章节关于POSHI的东西，不妨来做个DEMO练练手。这一节我们通过POSHI来写若干与Liferay相关的测试用例。

以这个[测试用例](https://issues.liferay.com/browse/LPS-57885)为标准，将它依次划分成若干小的测试用例分别实现。

这个Demo的所有操作均基于6.2.10分支，为防止污染原代码，请新建一个Demo分支，比如：
```
git checkout ee-6.2.10
git reset --hard HEAD
git checkout -b demo1
```
并且本Demo以熟悉POSHI的结构与如何使用为最终目标，不设计任何工作流程。

## 先思考再动手
再实现之前，我们不妨先思考下这个测试用例到底做了什么，这有利于我们更好地将它抽象成PO对象。

这个测试用例的文字形式如下：
1. Create a Structure, change the Structure's default language e.g. to Hungarian, delete the English translation
2. Add two text fields (all the other fields should be affected), make one of them non localizable
3. Create a template for the Structure
4. Create a Web Content (set the default language to Hungarian, delete the English translation), fill the text fields.
5. Create an en_US translation 
6. Edit the article and fill the non-localizable text field again on the default language (Hungarian)
This is an extra step, as the value should't not disappear.
7. Display the Web Content e.g. in a Web Content Display portlet, put a Language portlet to the page as well.

* **Checkpoint:**
Switch the language to Hungarian:
Both text field's content are displayed.

* **Result:**
Switch the language to English:
Only one of the text field's content is displayed.

* **Expected:**
Both text field's content are displayed.

大概读了一边之后，如果你足够熟悉Portal的话，那么你可以大概将业务的实体锁定为``Web Cotent``，再细一些的话，可以想到是``Structure``，其中可能还穿插一些其他的实体，比如``Language Portlet``和``Web Content Display Portlet``。

既然我们首先要利用Liferay现有的PO对象来自动化这个测试用例，那么我们就将PO对象集中到上面所提及的几个实体上吧。再前面的章节中，我们可以得知，编写Testcase的过程，其实就是调用Macro的过程。经过仔细查找，大体我们需要这几个PO对象：

Web Content相关（包含Structure和Template）
* WebContent.macro
* WebContentTemplates.macro
* WebContentStructures.macro
* WebContentDisplayPortlet.macro

Language相关
* LanguagePortlet.macro

再仔细思考一下，其实我们有这几个PO对象远远不够，在我们做手动测试的时候，往往还需要进行一些其他的操作，比如新建一个``Site``，之后在这个``Site``新建一个``Page``，之后再进行以上的步骤，这么做的目的当然是为了保证测试环境的纯净性。这也还不够，在这之前，我们好像还需要先以``Super User``登陆Portal才行。

以上所提及的这些东西，其是算是准备工作，就好比炒菜要先把菜洗干净并切好一样。还记得Testcase中的``set-up``生命周期是干什么的吗？没错，就是干这个的。所以继续仔细查找，大体我们又需要这几个PO对象：

User相关
* User.macro

Page相关
* Page.macro

Site相关
* Site.macro
* SitePage.macro
* SiteAdmin.macro

大体就这些PO对象了。这里可能有人会问，我怎么知道去找这些对象，其实我也不知道，就是凭直觉去把与相关实体的PO对象都罗列出来，因为现在还处于构思阶段，所以这些罗列出来的PO对象其实不一定会在实现过程中派的上用场，但有总比没有强吧。

## 流模型
PO对象也找齐了，我们可以开始了吗？别急，虽然工具收集了个差不多，但是工具怎么用，往哪用，何时用，我们似乎心里没谱。有人可能会说，我们可以边做变想，变想边做。可以是可以，但这样做的缺点就是和盲人摸象一样，没有整体规划，出现错误的几率是很大的，返工几率会很高。

因此，再实现之前，我们还需要将这个测试用例，分子化，细分到若干小的测试用例，之后以``流``的方式来将各个小的测试用例联系起来。我们先来将上述的测试用例划分成若干小的测试用例（点击标题直接跳转到实现章节）：

[准备工作](demo1/part1.html)：
1. 以Super User的身份登陆Portal
2. 在Welcome Site增加一个新的Public Page

[用例1](demo1/part2.html)：
1. 创建一个默认语言为Hungarian的Structure
2. 为这个Structure增加两个text fileds，一个可区域化，一个不可区域化
3. 为这个Structure定制一个Template

[用例2](demo1/part3.html)：
1. 使用这个Structure创建一个Web Content
2. 把默认语言设置为Hungarian，删掉English translation
3. 创建一个新的en_US translation

[用例3](demo1/part4.html)：
1. 编辑创建的Web Content，并用Hungarian填入不可区域化的text filed
2. 在刚才创建的Public Page中加入WCD Portlet和Language Portlet
3. 使WCD Portlet显示刚才创建的Web Content

[验证](demo1/part5.html)：
1. 当语言是Hungarian/English时，两个text fields都应该显示

[收尾工作](demo1/part1.html)：
1. 删除所有相关内容

以流的方式来表示如下：
> 准备工作 -> 定制并创建特定的Web Content结构(用例1) -> 定制translation(用例2) -> 编辑Web Content(用例3) -> 收尾工作

下面我们就可以按流程，来一块一块地实现完整的测试用例了。


 
