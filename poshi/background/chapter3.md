# Xpath是什么

还是那句话，欲善其工必须利其器。战争中步兵之所以作为中坚力量，是因为他们配备剑和盾，可攻可守。虽然我们有了Selenium这样一把锋利的剑，还需要一个盾，
而Xpath就扮演着这样一个角色，它辅助Selenium更好地工作。

详见[Xpath介绍][Xpath-v]。

# 我所需要了解的

Xpath作为一门导航语言，会帮助Selenium在DOM树中查找需要操作的元素。因此我们需要了解Xpath的语法，就好比说话一样，主谓宾结构使用正确，
别人才会明白你的意思，Xpath也是同理，只有使用正确结构的Xpath表达式才能精确的定位到需要操作的一个元素或一类元素。

详见[Xpath教程][Xpath]。

# 一些Tips

这里提供一些我在使用Xpath中踩过的坑，前车之鉴后事之师。

- **定位属性优先级（尽量使用具有唯一性的id属性**

  - id > class > 其他属性

```
eg: //section[@id='portlet_36']
```

- **选取方式优先级（尽量一次选取单一html元素**

  - 单选 > 多选

```
eg: a/span 选取所有a元素中的span元素
    /a/span 选取第一个a元素中的所有span
    /a[@id='1']/span 选取id为1的a元素中的所有span元素
    /a[@id='1']/span[@id='2'] 选取id为1的a元素中的id为2的span元素
```

- **路径软硬程度优先级（尽量使用绝对路径**

  - 相对 > 绝对 > 模糊

```
eg: / 表示从根节点开始
    // 表示从满足匹配信息的第一个结点开始
```

- **遍历方式优先级（缩小遍历的范围**

  - 强制遍历 > 自然遍历

```
eg: <a id="1">
    <b></b>
    <b></b>
    <b></b>
    </a>
选取第二个b可以这么写（假设b没有其他参考条件） 
//a[@id='1']/b[2] 选取id为1的a元素中的第二个b元素
```

- **Xpath支持简单与或逻辑运算**

  - or 或 and 与 

```
eg: //div[@id='1' or @ class='alert'] 选取id为1或class为alert的div元素
    //div[@id='1' and @ class='alert'] 选取id为1切class为alert的div元素
```

- **灵活应用contains关键字**
```
//a[contains(@class,'info') 选取class包含info关键字的所有a元素
```

以上tips可以互相穿插使用，使Xpath更精确

[Xpath]:http://www.w3school.com.cn/Xpath/index.asp
[Xpath-v]:http://baike.sogou.com/v760155.htm?fromTitle=Xpath