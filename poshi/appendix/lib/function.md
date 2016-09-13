# Function
一些在POSHI中适用于Function PO对象的通用规范。

## 通用规范
### 尽可能复用其他的Function
```
<command name="clickAtAndWait">
	...
</command>

<command name="clickAtAndWaitCPNavigation">
	<execute argument1="//script[contains(@src,'/html/js/liferay/message.js')]" selenium="waitForElementPresent" />

	<execute function="Click#clickAtAndWait" /> <!-注意看这里-->

	<execute selenium="assertJavaScriptErrors" />

	<execute selenium="assertLiferayErrors" />
</command>
```
> **Note** 因为已经有了``clickAtAndWait``，所以不需要再重新写一次了

### 尽可能不要编写重复的Function
```
<command name="click">
    ...	
</command>

<command name="click1">
    ...	
</command>

<command name="click2">
    ...	
</command>

<command name="click3">
    ...	
</command>
```
> **Note** 保持Function的唯一性，避免出现类似click1、click2、click3的情况。

## 命名规范
### 首字母大写
> 像``A``ddSelection.function这样，又或者``C``lick.function。


## Command规范
### 按字母表类型使Command的名字排序
>（略）

### Command彼此间要保持空行
>（略）