# 基本语法
介绍POSHI对于Selenium的描述性语法。

### XML
XML都很熟悉了，可扩展标记语言，之所以成为可扩展，是因为其中的标签可以根据实际场景由编写者认为的规定语义，这就是语言的可扩展性，我们只需要了解其最基本的语义结构就可以了，比如节点、属性等。

详见[XML][xml-v]。

### POSHI中的XML
之所以加了一个前缀，是因为POSHI中的XML并没有严格遵守XML规范，因为没有明确的DTD文件，而仅仅借用XML的文档结构来描述信息，因此需要阐明。

既然是XML结构，那么所有的XML语法即适用，比如给节点命名、给属性赋值等语法，这里就不再赘述了。

### 举个栗子![举个栗子](../image/举个栗子.jpg)
我们先以AddSelection为例子，读一遍它所代表的含义：
```
<definition default="addSelection">
	<command name="addSelection">
		<execute selenium="waitForVisible" />
		<execute selenium="mouseOver" />
		<execute selenium="addSelection" />
		<execute selenium="assertJavaScriptErrors" />
		<execute selenium="assertLiferayErrors" />
	</command>
</definition>
```
先不要在意这些标签具有什么具体的含义，这一节因为只介绍结构，所以我们只需要将注意力集中到它的结构上就可以了。

可以发现这一段代码以
```
<definition default="addSelection">
  ...
</definition>
```
的形式包含了若干command，仅从字面意义理解，可以得知，这个definition作为该文件的根标签，所含信息与该文件本身有密切关系。

比如``default="addSelection"``的意义就是，该文件的默认入口指``addSelection``command。接着看一下代码，
```
<command name="addSelection">
	...
</command>
```
同理，还是从字面意义看，可以得知，这个command定义了一个command的实体，这个实体的名字是addSelection，也就是上文所提的文件入口，其中又包含了
```
<execute selenium="waitForVisible" />
<execute selenium="mouseOver" />
<execute selenium="addSelection" />
<execute selenium="assertJavaScriptErrors" />
<execute selenium="assertLiferayErrors" />
```
这五条标签，还是一样，从字面看，可以得知，这5个标签分别执行了一条selenium命令，具体命令是做什么的，现在可以先不要管，只需要知道它执行了一个selenium命令即可。

之后我们把这3部分连起来，我们就能够得知以下信息
>**NOTE**这是一个addSelection的Function文件，它的默认command入口是addSelection，它包含1个command，这个command分别执行了5条selenium指令，分别是waitForVisible、mouseOver、addSelection、assertJavaScriptErrors、assertLiferayErrors。

### 标签
参考上面的例子，我们可以得知一些基本标签的含义及用法
* ``<definition>``：作为所有描述性文件（除去Path文件）的根标签，同时附加描述文件**本身**的信息。
* ``<command>``：作为执行标签的容器（我叫作命令单元），附加所执行一系列**操作**的信息。
* ``<execute>``：执行标签（我叫作执行单元），可以通过属性命和值分别指定所执行的**任务类型**与**名称**。

这3个是最基本的3个标签，基本所有的文件都可以见到它们的影子，除此之外还有一些特殊的标签（按我自己的分类），大体如下
* 选择结构型，比如 ``<if>``、``<elseif>``、``<then>``等，负责控制选择结构。
* 循环结构型，比如``<while>``、``<for>``(好像2.0新加的？)等，负责控制循环结构。
* 声明型，比如``<var>``、``<property>``等，负责声明变量。
* 判断型，比如``<equals>``、``<condition>``等，负责生成布尔值。
* 生命周期型，比如``<set-up>``、``<tear-down>``等，负责控制用例的生命周期。
* 功能型，比如``<definition>``,``<command>``，``<execute>``等，负责控制文件结构及功能。

这些标签的详细介绍在之后的章节。

### 再来举个栗子![举个栗子](../image/举个栗子.jpg)
以最常见的用户登陆的代码为例子，
```
<set-up>
	<execute macro="User#firstLoginPG" />
</set-up>
```
我们再来像上个例子一样，读一边它的含义，不过这次省略过程直接写结果：
> **NOTE**在set-up生命周期中，执行一条macro，这个macro是User#firstLoginPG。

### 检索
看到这里可能有些迷惑，``User#firstLoginPG``这是个神马？

很简单，这是POSHI中定义的检索语法，结构是以``${file-name}#${command-name}``的形式存在，这个例子中的含义是，检索文件名为``User``中的，名字为``firstLoginPG``Command块。也许有的人会问，光指定文件名不指定文件类型能检索吗？没有类型确实无法检索，但是这里已经给出了文件类型，属性名macro即使索要检索的文件类型。这样说其实不是特别准确，准确来说，**在POSHi中，检索型字符串所要检索的文件类型，取决于字符串所指代职能的类型**。

这么说可能有点绕，举个栗子就好理解了，在这个例子中，``User#firstLoginPG``指代所要调用的**macro**，因此它的检索类型为macro。

看下这个例子，
```
locator1="CPAkismet#ENABLED_FOR_DISCUSSIONS_CHECKBOX"
```
这里``CPAkismet#ENABLED_FOR_DISCUSSIONS_CHECKBOX``的类型就不是locator1了，而是**path**，因为它在此处的只能是path。

所以上面的例子，我们可以重新再来更详细的分析一次，结果如下：
> **NOTE**在set-up生命周期中，执行一条macro，这个macro是User.macro文件中的名字为firstLoginPG的Command。

### 最后再举个例子![举个栗子](../image/举个栗子.jpg)
以一个条件判断为例子，
```
<equals arg1="${enableSpamModerationFor}" arg2="Message Boards" />
```
含义是：
> **NOTE**对比``${enableSpamModerationFor}``和``Message Boards``是否相同

### 引用
``${enableSpamModerationFor}``这又是神马？

熟悉模板语言或者脚本语言，如freemarker和shell脚本的童鞋估计一下就明白了，这里的``${enableSpamModerationFor}``即是一个引用，引用的是``enableSpamModerationFor``所代表的值。

在POSHI中，这个值可能是上下文中的变量，也有可能是外部的property，或者它就是以``${}``的形式存在直到运行时才动态的生成相应的值，会在之后做详细讨论，这里只需明白这种表示语法即可。

### 结构
了解了标签和语法后，结构也就很好理解了，所谓结构，其实就是将这些标签，按照人的意愿，使用POSHi的语法，进行组合。
文档的结构会按照文件类型不同而不同，会在今后的具体介绍每种类型的文件时详细介绍。

### 我所需要了解的
这一章讲的是POSHI的基础，因此应该尽可能的牢记这种表示方法，今后不论在编写testcase的工作中，还是在做AA的工作中，都会有很大的帮助。
如果你实在无法记忆所有的东西，可以只记索引及引用这部分的东西，因为很有用，很有用，很有用。

[xml-v]:http://baike.sogou.com/v34402.htm?fromTitle=XML
