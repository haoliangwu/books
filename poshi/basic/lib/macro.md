# Macro
宏原型（函数群原型），是POSHI最重要的构成单元。之所以最重要是，是因为它一方面作为连接TestCase与Function的桥梁，同时也与实际业务有密切关系。每个Macro的Command块，其实是对Function原型的再次封装，那么有人可能会提问题，可否理解为它是一个更大的Function？可以，但是这样理解并不够充分。上面也说了，它所扮演的角色是连接TestCase与Function的桥梁，这一点确实体现在了封装Function上，但别忘了还有另外一点，就是它与实际的业务是有密切关系，这一点才是更重要的。

总之将Macro理解为封装多条具有**实际业务逻辑**的Function集合即可。

### 职责
所谓实际的业务逻辑，就是指我们进行黑盒测试时，每一个测试用例中的多个步骤，比如登陆Portal，新建一个Site，新建一个Page等等。这些操作已经具有实际的业务逻辑在其中，因此不在仅仅局限于Function层面。每一个Macro都代表了某个实际业务的集合，比如``User``这个Macro所包含的业务逻辑，一定是与User实体相关的，而``Site``这个Macro就一定包含与Site实体相关的业务逻辑。

因此还是从黑盒测试的角度看，Macro所扮演的角色，就好比测试用例中的步骤。和Function相同，这些步骤有的是比较简单的步骤，比如新建Site、新建Page之类的操作，还有比较复杂的步骤，比如新建一个User同时把它assign给Liferay Site，还有一些验收的步骤，可能同时需要核对多个页面元素。按复杂程度分的话，无法将Macro进行比较合理的分类，因为业务逻辑的复杂程度远远比Selenium Command的复杂程度要高，但是既然Macro与业务逻辑有密切关系，我们可以按业务实体来划分。

POSHI中的Macro大体分类如下：
* Portal业务实体（Macro几乎都是这个种类），比如``User``、``Site``、``Organization``等Portal业务宏。
* 浏览器实体（页面实体），比如``Button``等操作页面元素宏。
* 验收业务实体，这个宏没有独立的文件，但广泛存在于其他的文件中的子模块，同样是以Assert或者Is开头的Command。

### 结构
Macro的基本结构如下，以User#addCommentViaMyAccount为例：
```
<definition>
    ...(省略)
    <command name="addCommentViaMyAccount">
		<execute function="Click" locator1="Myaccount#MENU_MISCELLANEOUS_COMMENTS" />
		<execute function="Type" locator1="Myaccount#COMMENTS_FIELD" value1="${userIntroduction}" />
		<execute function="Click" locator1="Myaccount#SAVE_BUTTON" />
		<execute function="AssertTextEquals" locator1="Myaccount#SUCCESS_MESSAGE" value1="Your request completed successfully." />
		<execute function="SelectFrame" value1="relative=top" />
    </command>
    ...(省略)
<definition>
```
最基础的文档结构是这样的，
> **NOTE**以definition为根元素，之后以command元素定义子模块，每个command中包含若干execute元素。

Macro的command中同样可以包含条件判断，贴个例子，同样是注意``if``代码块，
```
<command name="logoutUserPG">
		<description message="Log out of Liferay Portal." />
		<execute macro="Page#openURL">
			<var name="friendlyURL" value="${friendlyURL}" />
			<var name="pageAccess" value="${pageAccess}" />
			<var name="pageStaging" value="${pageStaging}" />
			<var name="siteName" value="${siteName}" />
			<var name="siteNameURL" value="${siteNameURL}" />
			<var name="siteURL" value="${siteURL}" />
			<var name="specificURL" value="${specificURL}" />
			<var name="virtualHostsURL" value="${virtualHostsURL}" />
		</execute>
		<if>
			<condition function="IsElementPresent" locator1="Dockbar#USER_NAME" />
			<then>
				<execute function="Click" locator1="Dockbar#USER_NAME" />
				<execute function="Click" locator1="Dockbar#USER_SIGN_OUT" />
			</then>
		</if>
</command>
```
在上面的例子有这样一段，
```
<execute macro="Page#openURL">
			<var name="friendlyURL" value="${friendlyURL}" />
			<var name="pageAccess" value="${pageAccess}" />
			<var name="pageStaging" value="${pageStaging}" />
			<var name="siteName" value="${siteName}" />
			<var name="siteNameURL" value="${siteNameURL}" />
			<var name="siteURL" value="${siteURL}" />
			<var name="specificURL" value="${specificURL}" />
			<var name="virtualHostsURL" value="${virtualHostsURL}" />
</execute>
```
这可以说明，Macro的command同样也可以调用其他Macro的command。
> **Caution**虽然Macro可以调用Function，也可以调用Macro，但是Macro是不可以直接通过execute调用Selenium Command的（可以通过别的途径调用，以后再说～）。

至于为什么要这样设计，估计是为了符合面向对象的思想，也同时为了满足开闭原则（我猜的，不一定对）。