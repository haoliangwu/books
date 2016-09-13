# Testcase
一些在POSHI中适用于Testcase PO对象的通用规范。

## 通用规范
### 将``set-up``和``tear-down``生命周期的代码置顶
> 略
### 每一条用例根据特定的种类归类
> 某一类的用例按类型归纳入同一个文件，比如``Calendar``的所有测试用例都记录在``PGCalendar.testcase``中。

## 命名规范
### 尽可能使用组件的全称
```
PGDLConfiguration.testcase
//bad

PGDocumentlibraryConfiguration.testcase
//good
```

### 按以下组件结构分层命名
> L1/L2 -> L2
* Document Management/Documents Administration -> documentsadministration

## Command规范
### 按以下的组成形式来命名
>[action(``required``)][object(``required``)][modifiers][method][location][user]

* ``action``: 动作，add, edit, delete, view, move, copy等。（唯一）
* ``objcet``: 实体对象，BlogsEntry, Page, User等。（唯一）
* ``modifier(s)``: 修饰语，WithStructure, ToFolder等。（可叠加）
* ``method``: 方式，ViaActions, ViaAP等。（唯一）
* ``location``: 操作的来源或去向，FromSubfolder, ToSitePublicPage等。（唯一）
* ``user``: 执行者身份，AsGuest, AsSiteUser等。（唯一）

备注：
* 对于``action``，对于验证的用例，使用``view``开头，对于否定的用例，使用``Cannot``开头。
* 对于``object``，可以附加一个修饰词，比如``EditedBlogsEntry``中的``Edited``表示它是被修改过的
* 对于``user``，默认状态表示当前执行者身份为Super User。
* 对于``location``，默认状态表示当前操作的来源或去向是默认的，如增加一个WC，它的默认路径会是根目录。

举个例子：
> AddWebContentWithStructureViaWCDToSitePublicPageAsSiteUser

它的组成如下：
* ``action``: Add
* ``object````: WebContent
* ``modifier(s)``: WithStructure
* ``method``: ViaWCD
* ``location``: ToSitePublicPage
* ``user``: AsSiteUser

## 设计逻辑规范
> 与Macro相同（为什么会这样呢？因为本质上Testcase就是一大堆Macro。）

## 变量声明规范
### 将``set-up``和``tear-down``生命周期使用的变量声明为全局变量
> 使用全局变量的方式进行声明变量，并以引用的方式，赋予局部变量

### 将所有必要的变量声明在Command各自的作用域。

> 略

### 全局变量
* 使用固定的前缀名，比如以``blogsEntry``为前缀的变量名，像``blogsEntryContent``或者``blogsEntryTitle``等。
* 声明顺序按照字母表顺序排序

### 临时变量
* 声明顺序按照字母表顺序排序