# Testcase
一些在POSHI中适用于Path PO对象的通用规范。

## 通用规范
### 每一个页面对应一个Path文件
> 易于维护，同时解耦

### 每一个Iframe标签对应一个Path文件
> 同上

### 按页面元素顺序排序
> 在修改时易于查找，提高效率

## 命名规范
### 按以下的组成形式来命名文件名
> [CP/PG][portlet][page]

* ``CP/PG``: 操作范围，CP或者PG。（唯一）
* ``portlet``: 所关联的Portlet实体名字，Blogs, Documentsandmedia, Webcontentdisplay等。（唯一）
* ``page``: 所标记的页面相关实体的名字，如Addentry, Entry, Configuration等。（唯一）

> **Note**可以发现，这些命名单元，只有首字母是大写的，其他一律小写，这一点与驼峰命名法不同，一定要注意。

### 按以下的组成形式来命名索引名
> [action(``required``)][section(``required``)][key][modifier(s)][method][user]

* ``action``: 动作，add, edit, delete, view, move, copy等。（唯一）
* ``section``: 一个区域内的若干标签，如MENULIST、TOOLBAR、NAVIGATION等。（唯一）
* ``key``: 区域中的某一个标签，如BUTTON、CHECKBOX、SELECT等。（唯一）
* ``modifier(s)``: 修饰语，如SPECIFIC等。（可叠加）
* ``method``: 方式，VIA_DAY, VIA_WEEK_VIEW。（唯一）
* ``user``: 执行者身份，GUEST等。（唯一）

举个例子：
> SCHEDULER_REGULAR_EVENT_SPECIFIC_CURRENT_DAY_VIA_DAY_OR_WEEK_VIEW_GUEST

它的组成如下：
* ``action``: SCHEDULER
* ``section``: REGULAR_EVENT
* ``modifier(s)``: SPECIFIC_CURRENT
* ``key``: DAY
* ``method``: VIA_DAY_OR_WEEK_VIEW
* ``user``: GUEST


## Section命名规范
### 所有的Section必须都是大写
> menulist -> MENULIST

### 连接符为``_``
> ADD_EVENT_BUTTON

### 一些实例
* ``MENULIST``: Action菜单或者点击一个按钮生成的Option菜单。
* ``TOOLBAR``: 非导航条的水平工具栏。
* ``NAVIGATION``: 水平导航条。
* ``TABLE``: 显示信息的表格。
* ``FILTER``: 过滤器区域。
* ``VIEW``: 显示信息的一些Panel。

## Key命名规范
### 所有的Key必须都是大写
> field -> FIELD

### 连接符为``_``
> ADD_EVENT_BUTTON

### key应当先于section
```
BUTTON_ADD_EVENT
//bad
ADD_EVENT_BUTTON
//good
```
### 一些实例
* ``FIELD``: 可以输入的表单
* ``BUTTON``: 按钮
* ``CHECKBOX``: 多选框 
* ``IFRAME``: 子页面
* ``ICON``: 图标
* ``RADIO``: 单选框

## Locator规范
### 所有在Path中引用的变量名比如以``key_``开头。
> 略

### 遵循这些[规范](https://in.liferay.com/web/global.engineering/wiki/-/wiki/Quality+Assurance+Main/How+to+find+the+Identifiers)去定义一个locator的值。
> 略
