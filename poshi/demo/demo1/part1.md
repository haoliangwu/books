# 准备工作/收尾工作的实现
首先，我们在``${liferay-test-home}/tests/``目录下，新建一个新的Testcase的PO对象（由于是demo，所以不纠结命名了），参考Testcast的文档结构，我们新建一个``PoshiGuideLine.testcase``的文件，加入如下代码(为了省行数，这里先忽略空行的代码规范)：
```
<definition>
	<set-up>
		...
	</set-up>
	<tear-down>
		...
	</tear-down>
	<command name="Demo1" priority="5">
		...
	</command>
</definition>
```
这样我们就有了第一``testcase``，它叫做``PoshiGuideLine#Demo1``，之后我们来实现``set-up``部分。

> 以Super User的身份登陆Portal

我们需要以Super User的身份来登陆Portal，而且这是``第一次登陆``，因此我们这里使用``User#firstLoginPG``来完成这像操作，代码如下：
```
<execute macro="User#firstLoginPG" />
```

> 在Welcome Site增加一个新的Public Page

登陆Portal后，我们需要新加一个Page，很容易我们就会联箱到我们一开始准备好的``Page.macro``，我们这里可以借鉴别的case中关于这个宏的使用方法，代码如下：
```
<execute macro="Page#addPG">
	<var name="pageName" value="${pageName}" />
</execute>
```
这里注意，``pageName``的值是一个变量的引用，为何不直接赋值而要赋一个引用呢？回想一下编写规则中关于Testcase的部分,
> 将set-up和tear-down生命周期使用的变量声明为全局变量

因此这里，我们为了保证``pageName``的值为全局变量的值，我们需要在全局作用域声明也声明一个名字叫做``pageName``的变量并赋值，如下:
```
<var name="pageName" value="Demo1 Page" />
```

对于``tear-down``部分，更简单，只需要依次调用业务实体宏中的teardown command即可，命令如下：
```
<execute macro="WebContent#tearDownCP" />
<execute macro="WebContentTemplates#tearDownCP" />
<execute macro="WebContentStructures#tearDownCP" />
<execute macro="Page#tearDownPG" />
```

之后准备工作的所有步骤就做完了，所有的代码如下：
```
<definition>
    <var name="pageName" value="Demo1 Page" />
    <set-up>
        <execute macro="User#firstLoginPG" />
        <execute macro="Page#addPG">
            <var name="pageName" value="${pageName}" />
        </execute>
    </set-up>
    <tear-down>
		<execute macro="WebContent#tearDownCP" />
		<execute macro="WebContentTemplates#tearDownCP" />
		<execute macro="WebContentStructures#tearDownCP" />
        <execute macro="Page#tearDownPG" />
	</tear-down>
    <command name="Demo1" priority="5">
    </command>
</definition>
```

## 小结
这章我们着重了解了:
* 一个Testcase的结构如何实现
* 如何并借鉴已有的Macro对象实现set-up和tear-down部分。