# 扩展
如果编程经验习惯的话，当遇见``Util``这个关键字的时候，就会一下子想到工具库。没错，以Util结尾的类或者命名的包，大部分情况下，都是通用的工具类。

这些工具类的特点就是，所封装的方法具有通用性，并且这些即使没有这些工具类方法，本身的工作也是可以完成的，就好比把一张画钉到墙上，如果你有锤子，那么你可以很方便的用锤子把钉子钉到墙上；如果你没有锤子，你可以找其他的硬物来代替锤子，只不过会麻烦一些。这些工具类就好比锤子。

POSHI中的工具类有很多，这里主要介绍两种常用的工具类，``StringUtil``和``MathUtil``。

## 如何使用
在Java中，调用一个类的方法的格式如下：
```
Object.method(arg0, arg1, arg2, ...)
```
在POSHI中，为了兼容检索语法的统一性，因此调用语法抽象为
```
Object#method(arg0, arg1, arg2, ...)
```
这个语法在4种数据结构中，应该很熟悉了，其实本质是一样的。

## StringUtil
字符串工具类，负责对字符串进行一些处理的工具库，举个例子：
```
<var method="StringUtil#replace('${roleName}', ' ', '-')" name="key_roleName" />
```
>**NOTE**调用``StringUtil.relace()``方法，以``‘${roleName}’``为第一个参数，``' '``为第二个参数，``'-'``为第三个参数。

```
<var method="StringUtil#lowerCase('${key_roleName}')" name="key_roleName" />
```
>**NOTE**调用``StringUtil.lowerCase()``方法，以``'${key_roleName}'``为第一个参数。

这里的``relace()``和``lowerCase()``都是StringUtil中提前封装好的方法，其作用分别是：
* ``StringUtil#replace('${roleName}', ' ', '-')``: 将``${roleName}``中的所有``' '``，用``'-'``替换，比如``Admin User``会变为``Admin-User``。
* ``StringUtil#lowerCase('${key_roleName}')``: 将``${key_roleName}``进行小写格式化，比如``Admin User``会变为``admin user``。

其实上面这个例子本是合在一起的，像这样：
```
<var method="StringUtil#replace('${roleName}', ' ', '-')" name="key_roleName" />
<var method="StringUtil#lowerCase('${key_roleName}')" name="key_roleName" />
```
加上变量章节的知识，我们就可以得知，经过这两行代码，实际上我们只声明了一个变量``key_roleName``，假如``${roleName}``的值是``Admin User``，那么``${key_roleName}``的值便是``admin-user``。

## MathUtil
数字工具类，负责对数字进行一些处理的工具库，举个例子：
```
<var method="MathUtil#sum('${weekNumber}', '1')" name="key_weekNumber" />
```
>**NOTE**调用``MathUtil.sum()``方法，以``${weekNumber}``为第一个参数, ``'1'``为第二个参数。

同理，这里的``sum()``也是MathUtil中提前封装好的方法，作用是：
* ``MathUtil#sum('${weekNumber}', '1')``: 将``${weekNumber}``与``'1'``做求和运算，当``${weekNumber}``为1时，结果会变为2。

加上变量的知识，我们也可以很快得知，这里其实相当于声明了一个变量``key_weekNumber``，其值为``${weekNumber}``自加1后的值。

## NOTE
有一点值得一提，由于在POSHI中弱化了类型的概念，因此这里实际不论是``StringUtil``还是``MathUtil``，其参数的类型均由字符串类型代表，因此这里的``1``才会被写作``'1'``。

## 参考

这里罗列了所有在StringUtil和MathUtil中实现的方法及其使用方法。

以SHA为4e1dde4ac142f754ae036b893a5af7bdb88a7b2c的master代码为标准，``[]``中的是可选参数，仅供参考：

### StringUtil API
#### ``String`` add(``String`` s, ``String`` add, [``String`` delimiter], [``Boolean`` allowDuplicates])
>**Note**以``delimiter``为拖尾符，返回``s``与``add``连接后的字符串，可以通过``allowDuplicates``控制``s``与``add``是否可重复，通过``delimiter``指定拖尾符。

```
StringUtil.add("a", "b")
//a,b,
StringUtil.add("a", "b", ";")
//a;b;
StringUtil.add("a", "a", ";")
//a
StringUtil.add("a", "a", ";", true)
//a;a
```

#### ``Boolean`` contains(``String`` s, ``String`` text, [``String`` delimiter])
>**Note**以``delimiter``为拖尾符，判断``s``中是否包含``text``，可以通过``delimiter``指定连接符。

```
StringUtil.contains("a,b,", "a")
//true
StringUtil.contains("a,b,", "c")
//false
StringUtil.contains("a,b,", "a", ";")
//false
```

#### ``Number`` count(``String`` s, ``String`` text)
>**Note**返回``text``在``s``中出现的次数。

```
StringUtil.count("abc", "a")
//1
StringUtil.count("abcabc", "abc")
//2
```

#### ``Boolean`` startsWith(``String`` s, ``String`` start)/endsWith(``String`` s, ``String`` end)
>**Note**判断字符串``start``/``end``是否出现在s的开头与末尾。

```
StringUtil.startsWith("abc", "a")
//true
StringUtil.startsWith("abc", "c")
//false
StringUtil.endsWith("abc", "c")
//true
StringUtil.endsWith("abc", "a")
//false
```
#### ``Boolean`` equalsIgnoreCase(``String`` s1, ``String`` s2)
>**Note**判断字符串是否满足忽略条件（参数可传ascii码大于127的扩展符）。

```
StringUtil.equalsIgnoreCase("ignore", "ignore")
//true
StringUtil.equalsIgnoreCase("ignore", "iGnOrE")
//true
```

#### ``String`` extractChars(``String`` s)/extractDigits(``String`` s) 
>**Note** 从指定字符串中取出字符类型/数字类型的子字符串。

```
StringUtil.extractChars("a1b2c3")
//abc
StringUtil.extractDigits("a1b2c3")
//123
```

#### ``String`` extractFirst(``String`` s, ``String`` delimiter)/extractLast(``String`` s, ``String`` delimiter) 
>**Note** 以``delimiter``为拖尾符，取出首个/末个子字符串。

```
StringUtil.extractFirst("aaa;bbb;", ";")
//aaa
StringUtil.extractLast("aaa;bbb;", ";")
//bbb
```

#### ``String`` extractLeadingDigits(``String`` s)
>**Note** 取出前导的数字类型子串。

```
StringUtil.extractLeadingDigits("123abc456")
//123
StringUtil.extractLeadingDigits("123abc456abc789")
//123
```

#### ``Boolean`` isLowerCase(``String`` s)/isUpperCase(``String`` s)
>**Note** 判断指定字符串是否满足小写/大写形式。

```
StringUtil.isLowerCase("abc")
//true
StringUtil.isLowerCase("aBc")
//false
StringUtil.isUpperCase("ABC")
//true
StringUtil.isUpperCase("aBc")
//false
```

#### ``String`` lowerCase(``String`` s)/upperCase(``String`` s)
>**Note** 返回指定字符串的小写/大写形式。

```
StringUtil.lowerCase("aBc")
//abc
StringUtil.upperCase("aBc")
//ABC
```

#### lowerCaseFirstLetter(``String`` s)/upperCaseFirstLetter(``String`` s)
>**Note** 返回指定字符串的首字母小写/首字母大写形式。

```
StringUtil.lowerCaseFirstLetter("Abc")
//abc
StringUtil.upperCaseFirstLetter("abc")
//Abc
```

#### ``Boolean`` matches(``String`` s, ``String`` pattern) 
>**Note** 判断指定字符串是否包含固定模式的子字符串。

```
StringUtil.matches("aBc", "a")
//true
StringUtil.matches("aBc", "b")
//false
```

#### ``String`` quote(``String`` s, [``String`` quote])/unquote(``String`` s)
>**Note** 以``quote``为引用符，返回引用形式/非引用形式(只会识别以``"``和``'``为引用符)的字符串。

```
StringUtil.quote("abc", "'")
//`abc`
StringUtil.quote("abc", "d")
//dabcd
StringUtil.unquote("'abc'")
//abc
StringUtil.unquote("\"abc\"")
//abc
```

#### ``String`` replace(``String`` s, ``String`` oldSub, ``String`` newSub) 
>**Note**以``newSub``取代``s``中所有的``oldSub``。

```
StringUtil.replace("admin user", " ", "-")
//admin-user
StringUtil.replace("admin user 1", " ", "-")
//admin-user-1
```
#### ``String`` replaceFirst(``String`` s, ``String`` oldSub, ``String`` newSub)
>**Note**以``newSub``取代``s``中的首个``oldSub``。

```
StringUtil.replaceFirst("admin user 1", " ", "-")
//admin-user 1
```
#### ``String[]`` split(``String`` s, [``String`` delimiter])
>**Note**以``delimiter``为拖尾符，分割``s``，返回字符串数组。

```
StringUtil.split("a,b,c")
//[a,b,c]
StringUtil.split("a;b;c", ";")
//[a,b,c]
```
#### ``String`` reverse(``String`` s)
>**Note**返回``s``的逆字符串。

```
StringUtil.reverse("abc")
//cba
```
#### ``Boolean`` startsWith(``String`` s, ``String`` start)
>**Note**判断``s``是否以``start``为开头。

```
StringUtil.startsWith("abc","a")
//true
```
#### ``String`` stripBetween(``String`` s, ``String`` begin, ``String`` end)
>**Note**从``s``剥去从``begin``到``end``范围的子字符串。

```
StringUtil.stripBetween("abcde","a","c")
//de
```
#### ``String`` trim(``String`` s)
>**Note**抹去字符串s空白。

```
StringUtil.trim(" abc ");
//abc
```

#### ``String`` trimLeading(``String`` s)/trimTrailing(``String`` s)
>**Note**抹去字符串s中的先导空白。

```
StringUtil.trimLeading(" abc ")
//abc_(代表空格)
StringUtil.trimTrailing(" abc ")
//_abc
```
### MathUtil API
#### ``Number`` difference(Integer... values)
>**Note** 求差

```
MathUtil.difference(1,2)
//-1
MathUtil.difference(1,2,3)
//-4
```
#### ``Number`` product(Integer... values)
>**Note** 求积

```
MathUtil.product(1,2)
//2
MathUtil.product(1,2,3)
//6
```
#### ``Number`` quotient(Integer value1, Integer value2, [boolean ceil])
>**Note** 求商

```
MathUtil.quotient(1,2)
//0
MathUtil.quotient(1,2,true)
//1
```
#### ``Number`` sum(Integer... values)
>**Note** 求和

```
MathUtil.sum(1,2)
//3
MathUtil.sum(1,2,3)
//6
```
