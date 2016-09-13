# 用例1的实现
准备工作完成后，我们继续来实现用例1。用例1中设计到的业务实体包含``WebContent``、``WebContentStructure``、``WebContentTemplate``，进一步说再设计Structure的时候，还涉及到``Dynamic Data List``，同时期间会进行一些页面跳转操作，因此我们还需要``Page``。

详细步骤如下：
1. 创建一个默认语言为Hungarian的Structure
2. 为这个Structure增加两个text fileds，一个可区域化，一个不可区域化
3. 为这个Structure定制一个Template

实现这些操作之前，我们可以换个角度，再将这些步骤转化一下。为什么我们需要转化步骤？因为上述步骤虽然对于人很好理解，也很简单，但对于POSHI来说，逻辑性还是太强，我们需要把这些步骤变的流程化，使它的逻辑变的更加的简单。

转化步骤如下：
1. 创建一个Structure 
2. 添加两个Text Filed。
3. 编辑Structure
4. 使它的默认语言为Hungarian
5. 使Text Filed一个可区域化，一个不可区域化。

可以发现，我们把步骤的数量变多了，但是步骤逻辑却变简单了，基本都符合``action -> object``的结构，采用这种结构的逻辑，更贴切POSHI的编码方式，因此也更利于我们实现这些步骤。

接下来，按转化的步骤，我们需要在``WebContentStructure``中看看是否有类似的方法符合这些步骤，对于第1步和第2步，我们很幸运，发现``WebContentStructures#addCP``正好完成了第1步和第2步的操作，代码如下：
```
<execute macro="WebContentStructures#addCP">
    <var name="structureName" value="WC Structure Name" /> 
    <var name="structureDescription" value="WC Structure Description" />
    <var name="structureFieldNames" value="Text,Text" /> 
</execute>
```
但是对于接下来的3步，我们就不够幸运了，因为并没有找到现成的command可以实现这些操作，所以这里我们需要自己为``WebContentStructure``增加一个方法来完成这个功能，换言之就是我们需要扩展``WebContentStructure``。

如何扩展已经存在的PO对象呢（会在Appendix的一个章节详解）？我们这里只是简单介绍下。要扩展一个PO对象，我们就需要先了解它是按什么模式来关联Portal中的业务实体的，比如这里的``WebContentStructure``，如果我们用编辑器打开它的源码，我们会发现大量这种结构的代码：
```
<command name="actionCP">
		<execute function="AssertClick" locator1="CPWebcontent#TOOLBAR_MANAGE" value1="Manage" />
		<execute function="AssertClick" locator1="CPWebcontent#MANAGE_MENULIST_STRUCTURES" value1="Structures" />

		...(code block 1)
		...(code block 2)
		...(code block 3)
</command>
```
其实稍微动动脑筋就可以把这个结构所进行的操作与实际的Portal联系起来，
> 从Site Admin的Web Content Portlet，点Manage菜单，之后进入Structure页面，之后以这里为根页面，进行若干操作。

所以我们既然要为``WebContentStructure``扩展一个功能，那么我们也按这个模板来写一个新的command，因为这个command需要进行的操作是为Structure设置default language，根据命名规则，把这个command的名字叫作``editStructureDefaultLanguageCP``，代码如下：
```
<command name="editStructureDefaultLanguageCP">
      <execute function="AssertClick" locator1="CPWebcontent#TOOLBAR_MANAGE" value1="Manage" />
      <execute function="AssertClick" locator1="CPWebcontent#MANAGE_MENULIST_STRUCTURES" value1="Structures" />
</command>
```

要对一个Structure进行编辑，首先需要选择一个Structure，这个操作在``WebContentStructure``中有类似的写法，我们这里借鉴它，代码如下：
```
<var name="key_structureName" value="${structureName}" />

<execute function="SelectFrame" locator1="CPWebcontentStructures#STRUCTURES_IFRAME" />
<execute function="AssertClick" locator1="CPWebcontentStructures#STRUCTURE_TABLE_NAME" value1="${structureName}" />
<execute function="SelectFrame" value1="relative=top" />
```

选择这个Structure并跳转后，我们进行的任何操作都是对这个Structure进行编辑了，但是这里我们其实已经更换了业务实体对象，从Structure变换到了DDL，因为编辑一个Structure，除了编辑基本信息外，实质是在编辑一个DDL，因此我们需要在DDL相关的``DynamicDataMapping.macro``中查找接下来的操作。

我们似乎仍然不够幸运，因为我们依然没有找到类似的操作，但是不用担心，我们依旧采用如上的方式，因为这里的业务实体已经转换到了DDL，因此我们继续扩展``DynamicDataMapping.macro``。

按照扩展``WebContentStructure``的方式，我们可以创建两个新的command，分别是：
```
<command name="editFieldLocalizable">
  	<execute macro="DynamicDataMapping#selectDynamicDataMappingFrame" />
  	...
  	<execute function="SelectFrame" value1="relative=top" />
</command>
<command name="editFieldDefaultLanguage">
    <execute macro="DynamicDataMapping#selectDynamicDataMappingFrame" />
    ...
    <execute function="SelectFrame" value1="relative=top" />
</command>
```

我们只需要把相关的编辑操作补充完整即可，这些操作这里我们也没有找到相关可以借鉴的代码，我们直接来自己写即可，修改默认语言的操作如下：
```
<var name="defaultLanguage_key" value="${defaultLanguage_key}"/>
<var name="defaultLanguage" value="${defaultLanguage}" />

<execute function="Click" locator1="//div[@id='_166_nameContentBox']/div/ul/li[@data-value='${defaultLanguage_key}']" />
<execute function="Type#sendKeysNoError" locator1="//input[contains(@id,'name')]" value1="${defaultLanguage_key}" />

<execute function="AssertClick" locator1="//div[@id='_166_translationManager']//a[contains(.,'Change')]" value1="Change"/>
<execute function="Select" locator1="//select[@class='lfr-translation-manager-default-locale']" value1="${defaultLanguage}"/>
```

这里呢，细心的同学可能会发现有很多Xpath语句我是直接下上去的，没有写成``Path#Key``的形式，这是因为对于Path对象的编写可以最后进行，这里的Xpath能够临时工作即可，但是对于一些比较特殊的路径，可以直接参考Path文件，比如编辑Field的操作如下：
```
<var name="key_fieldFieldLabel" value="${fieldFieldLabel}" />

<execute function="Click" locator1="Dynamicdatamapping#FORM_FIELD" />
<execute function="DoubleClick" locator1="Dynamicdatamapping#SETTINGS_LOCALIZABLE" />
<execute function="Click" locator1="//label[@class='radio' and contains(.,'No')]/input" />
<execute function="AssertClick" locator1="Dynamicdatamapping#SETTINGS_CELL_EDITOR_SAVE_BUTTON" value1="Save" />

<execute function="AssertClick#pauseAssertTextClickAt" locator1="Dynamicdatamapping#FIELDS_LINK" value1="Fields" />
```
这里的Xpath大部分都引用自``Dynamicdatamapping.path``文件（除了第三行那个），现在我们可以把没有转换成``Path#Key``语法的Xpath进行整理，这里的工作很简单，只需要按Path文件规范中的规定，将路径进行转换即可，下面只举其中一个例子，比如：
> 转换<execute function="Click" locator1="//label[@class='radio' and contains(.,'No')]/input" />

因为这里的Xpath其实是指向DDL列表中的Localizable选项，因此可以把它加到``Dynamicdatamapping.path``中，代码如下：
```
<tr>
	<td>SETTINGS_CELL_EDITOR_NOT_LOCALIZABLE_RADIO</td>
	<td>//label[@class='radio' and contains(.,'No')]/input</td>
	<td></td>
</tr>
```
进行完所有的转换工作后，我们扩展``DynamicDataMapping.macro``中的所有代码如下：
```
<command name="editFieldIndexable">
		<execute macro="DynamicDataMapping#selectDynamicDataMappingFrame" />

		<var name="key_fieldFieldLabel" value="${fieldFieldLabel}" />

		<execute function="Click" locator1="Dynamicdatamapping#FORM_FIELD" />
		<execute function="DoubleClick" locator1="Dynamicdatamapping#SETTINGS_INDEXABLE" />
		<execute function="Click" locator1="Dynamicdatamapping#SETTINGS_CELL_EDITOR_NOT_INDEXABLE_RADIO" />
		<execute function="AssertClick" locator1="Dynamicdatamapping#SETTINGS_CELL_EDITOR_SAVE_BUTTON" value1="Save" />

		<execute function="AssertClick#pauseAssertTextClickAt" locator1="Dynamicdatamapping#FIELDS_LINK" value1="Fields" />

		<execute function="SelectFrame" value1="relative=top" />
</command>

<command name="editFieldLocalizable">
  		<execute macro="DynamicDataMapping#selectDynamicDataMappingFrame" />

  		<var name="key_fieldFieldLabel" value="${fieldFieldLabel}" />

  		<execute function="Click" locator1="Dynamicdatamapping#FORM_FIELD" />
  		<execute function="DoubleClick" locator1="Dynamicdatamapping#SETTINGS_LOCALIZABLE" />
  		<execute function="Click" locator1="Dynamicdatamapping#SETTINGS_CELL_EDITOR_NOT_LOCALIZABLE_RADIO" />
  		<execute function="AssertClick" locator1="Dynamicdatamapping#SETTINGS_CELL_EDITOR_SAVE_BUTTON" value1="Save" />

  		<execute function="AssertClick#pauseAssertTextClickAt" locator1="Dynamicdatamapping#FIELDS_LINK" value1="Fields" />

  		<execute function="SelectFrame" value1="relative=top" />
</command>
```

扩展``WebContentStructure.macro``中的所有代码如下：
```
<command name="editFieldLocalizableCP">
  		<execute function="AssertClick" locator1="CPWebcontent#TOOLBAR_MANAGE" value1="Manage" />
  		<execute function="AssertClick" locator1="CPWebcontent#MANAGE_MENULIST_STRUCTURES" value1="Structures" />

  		<var name="key_structureName" value="${structureName}" />

  		<execute function="SelectFrame" locator1="CPWebcontentStructures#STRUCTURES_IFRAME" />
  		<execute function="AssertClick" locator1="CPWebcontentStructures#STRUCTURE_TABLE_NAME" value1="${structureName}" />

  		<execute function="SelectFrame" value1="relative=top" />

      <execute macro="DynamicDataMapping#editFieldLocalizable">
        <var name="fieldFieldLabel" value="${structureFieldName}" />
      </execute>

      <execute macro="DynamicDataMapping#editField">
        <var name="fieldFieldLabel" value="${structureFieldName}" />
        <var name="fieldFieldLabelEdit" value="${structureFieldName}_Localized" />
      </execute>

  		<execute function="SelectFrame" locator1="CPWebcontentStructures#STRUCTURES_IFRAME" />

  		<execute function="AssertClick#assertTextClickAtAndWait" locator1="CPWebcontentStructuresAddstructure#SAVE_BUTTON" value1="Save" />
  		<execute function="SelectFrame" value1="relative=top" />
  		<execute function="SelectFrame" locator1="CPWebcontentStructuresAddstructure#STRUCTURES_IFRAME" />

  		<execute function="AssertTextEquals#assertText" locator1="CPWebcontentStructures#SUCCESS_MESSAGE" value1="Your request completed successfully." />
</command>

<command name="editStructureDefaultLanguageCP">
      <execute function="AssertClick" locator1="CPWebcontent#TOOLBAR_MANAGE" value1="Manage" />
      <execute function="AssertClick" locator1="CPWebcontent#MANAGE_MENULIST_STRUCTURES" value1="Structures" />

      <var name="key_structureName" value="${structureName}" />

      <execute function="SelectFrame" locator1="CPWebcontentStructures#STRUCTURES_IFRAME" />
      <execute function="AssertClick" locator1="CPWebcontentStructures#STRUCTURE_TABLE_NAME" value1="${structureName}" />

      <execute function="SelectFrame" value1="relative=top" />

      <execute macro="DynamicDataMapping#editFieldDefaultLanguage">
        <var name="defaultLanguage_key" value="${defaultLanguage_key}"/>
        <var name="defaultLanguage" value="${defaultLanguage}" />
      </execute>

      <execute function="SelectFrame" locator1="CPWebcontentStructures#STRUCTURES_IFRAME" />

      <execute function="AssertClick#assertTextClickAtAndWait" locator1="CPWebcontentStructuresAddstructure#SAVE_BUTTON" value1="Save" />
      <execute function="SelectFrame" value1="relative=top" />
      <execute function="SelectFrame" locator1="CPWebcontentStructuresAddstructure#STRUCTURES_IFRAME" />

      <execute function="AssertTextEquals#assertText" locator1="CPWebcontentStructures#SUCCESS_MESSAGE" value1="Your request completed successfully." />
</command>
```

之后我们再继续将这些加入到``PoshiGuideLine.testcase``中，代码如下：
```
<definition component-name="poshi-wcm">
    <property name="testray.main.component.name" value="Web Content Administration"/>
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
        <var name="structureName" value="WC Structure Name" />
        <var name="templateName" value="WC Template Name"/>
        <var name="structureDescription" value="WC Structure Description"/>
        <var name="templateDescription" value="WC Template Description"/>        
        <var name="structureFieldNames" value="Text,Text"/>
        <execute macro="Page#gotoPG">
            <var name="pageName" value="${pageName}" />
        </execute>
        <execute macro="Page#gotoContentCP">
            <var name="portletName" value="Web Content" />
        </execute>
        <execute macro="WebContentStructures#addCP">
            <var name="structureDescription" value="${structureDescription}" />
            <var name="structureFieldNames" value="${structureFieldNames}" />
            <var name="structureName" value="${structureName}" />
        </execute>
        <execute macro="Page#gotoContentCP">
			<var name="portletName" value="Web Content" />
		</execute>
        <execute macro="WebContentStructures#editFieldLocalizableCP">
            <var name="structureFieldName" value="Text" />
            <var name="structureName" value="${structureName}" />
        </execute>
        <execute macro="Page#gotoContentCP">
			<var name="portletName" value="Web Content" />
		</execute>
        <execute macro="WebContentStructures#editStructureDefaultLanguageCP">
            <var name="structureName" value="${structureName}" />
            <var name="defaultLanguage_key" value="hu_HU" />
            <var name="defaultLanguage" value="Hungarian (Hungary)"/>
        </execute>
        <execute macro="Page#gotoContentCP">
			<var name="portletName" value="Web Content" />
		</execute>
        <execute macro="WebContentTemplates#addCP">
            <var name="structureName" value="${structureName}" />
            <var name="templateName" value="${templateName}"/>
            <var name="templateDescription" value="${templateDescription}"/>            
        </execute>
    </command>
</definition>
```

截止到此，``PoshiGuideLine.testcase``已经可以运行了，试试在${liferay-home}下在控制台输入以下命令试试：
> ant -f build-test.xml run-selenium-test -Dtest.class=PoshiGuideLine#Demo1

如果命令执行成功，那么恭喜你。
如果命令不成功，不要着急，请依次尝试以下步骤：
* 是否正确将Xpath正确的补充进相应的Path文档
* 所有的索引语法是否存在错别字、大小写等问题
* 也许运行这条case的Portal碰巧坏了，是时候提一个新LPS了～

## 小结
这章我们着重需要了解:
* 如何借鉴已有的Macro对象
* 如何扩展已有的Macro对象
* 如何转化复杂逻辑步骤转化为简单逻辑步骤