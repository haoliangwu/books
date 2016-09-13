# 变量
不论是哪一种编程语言，都不能少了变量这个概念。

先粘贴一个广义上的变量，也就是变量在数学中的概念：
> **Note**变数或变量，是指没有固定的值，可以改变的数。变量以非数字的符号来表达，一般用拉丁字母。变量是常数的相反。变量的用处在于能一般化描述指令的方式。若果只能使用真实的值，指令只能应用于某些情况下。变量能够作为某特定种类的值中任何一个的保留器。

在编程语言中，变量就充当保留器的作用，储存一个值，这个值用于开放性的表达式中，表示尚未清楚的值，这个值只有在被使用时才知道它的具体值是多少。

在POSHI中，变量的角色与编程语言（泛指Java）中类似，都代表一个尚未清楚的值，但有略微的区别。

## 声明方式
在Basic章节，其实我们已经见过它的身影，POSHI声明变量的方式为
```
<var name="${name}" value="${value}" />
```
这样就声明了一个变量，在Java的实现中，它是以``key-value``的形式保存在一个HashMap中（会在Source章节详解），举个例子：
```
<var name="eventTitle" value="Calendar Event All Day Title" />
```
> **Note**声明一个以``eventTitle``为name，``Calendar Event All Day Title``为value的变量，表示形式为``eventTitle=Calendar Event All Day Title``

## 变量类型
在POSHI中，变量的类型并不像Java中那样需要先声明类型再赋值，而是动态的，变量的类型取决于所赋值的类型，如果这个值是一个字符串，那么这个变量的类型就是字符串，如果这个值是一个数字，那么这个变量的类型就是整型或者浮点型（类似于Javascript这种弱类型语言中的变量，详见[弱类型语言](http://baike.sogou.com/v74452783.htm)）。

但其实在POSHI中，类型的概念被弱化了，不用刻意纠结这个变量到底是一个什么类型。

在实际在工作中，对于类型的考量往往很少，而且大部分变量，均以字符串的形式声明，代表所见即所得的一个标量。

## 值操作
值操作可分为赋值操作与取值操作。

赋值操作，即为对变量赋值的操作，可以将一个值储存在变量中以备今后使用。在声明变量的过程中，其实已经进行了赋值操作，比如
```
<var name="eventTitle" value="Calendar Event All Day Title" />
```
> **NOTE**将``Calendar Event All Day Title``作为值赋予``eventTitle``变量。

POSHI中很少对变量进行二次赋值，更多地是以常量（值不会改变的变量）的角度来使用变量的。

取值操作，即为对变量取值的操作，可以将将值从变量中取出，进而作为实际的值使用。在POSHI中，取值的过程使用取值语法``${var-name}``取值，如下
```
<description message="Navigate to Site Administration > Pages > ${portletName}." />
```
> **NOTE**取出变量``portletName``的值，并代替``Navigate to Site Administration > Pages > ${portletName}.``中的``${porletName}``。

如果``portletName``等于``Blog``，那么``meesage``即为``Navigate to Site Administration > Pages > Blog.``。


## 作用域
再引用一段对于变量作用域概念的解释：
> **NOTE**指变量标识符能够被使用的范围。只有在作用域内标识符才可以被访问（称为“可见”）。

在POSHI中，这是个很重要的概念。因为每一个数据结构，都有其独有的作用域，而这些作用域彼此之间并不是总是可见的，因此我们需要熟悉POSHI中关于作用域的规则。

首先从底层来看，POSHI是以Java实现的，因此变量作用域的规则首先符合Java变量作用域的规则。之后我们以顶层来看，POSHI归根结底是由4种数据结构组成的，因此变量的作用域规则首先满足数据结构的作用域规则。

我们在Basic章节得知，Testcase与Macro之间的参数流有以下关系：
> Testcase -> var -> Macro

这是因为Testcase中会调用Macro，那么Macro也可以调用Macro，因此，对于Macro与Macro之间的参数流，同理：
> Macro -> var -> Macro

这两个参数流有一个共同点，它们的媒介均是以Macro为载体，因此POSHI中变量的作用域在狭义上，即是Macro的作用域。

从广义上讲，关于POSHI变量作用域，可定义为
> **NOTE** 所声明变量的作用域，为所声明数据结构的作用域及所调用其他数据结构的子作用域。

举个例子：
```
<execute macro="Page#gotoPagesCP">
	<var name="portletName" value="Site Pages" />
	<var name="siteScopeName" value="Site Name" />
</execute>
```
>**NOTE**``portletName``和``siteScopeName``变量的作用域是``Page#gotoPagesCP``宏的作用域。

我们继续来看``Page#gotoPagesCP``内部
```
<command name="gotoPagesCP">
	<description message="Navigate to Site Administration > Pages > ${portletName}." />

	<execute macro="Page#gotoCmdCP">
		...(省略)
		<var name="siteScopeName" value="${siteScopeName}" />
		<var name="siteURL" value="${siteURL}" />
		...(省略)
	</execute>
</command>
```
我这里省略了一些代码行，但足以说明一些POSHI中变量的特性了。

首先这段代码有3个取值语法，分别是``${portletName}``、``${siteScopeName}``、``${siteURL}``，前两个的取值语法所取的变量既是在
```
<execute macro="Page#gotoPagesCP">
	<var name="portletName" value="Site Pages" />
	<var name="siteScopeName" value="Site Name" />
</execute>
```
这段代码中声明的变量，因为它们在宏``Page#gotoPagesCP``中声明，所以它们的作用域是``Page#gotoPagesCP``，因此可以被其中的所有command块以取值语法的方式使用。

可能有人注意到了这个``${siteURL}``，并且会问它的值是多少，答案是不确定。为什么这么说？还是以作用域的角度来看，如果``Page#gotoPagesCP``被某个宏引用并且这个宏声明了``siteURL``的值，那么这个值就有值；但如果``Page#gotoPagesCP``没有被引用或者引用的宏没有声明``siteURL``，那么这个值即为空。

## NOTE
变量同样可以采用文本节点的方式赋值，如
```
<var name="name1">value1</var>
```
等价于
```
<var name="name1" value="value1"/>
```

变量值如果包含XML中的关键字，可以使用如下方式赋值，如
```
<var name="name1">
	<![CDATA[
		value1
	]]>
</var>
```

