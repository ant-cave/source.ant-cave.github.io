---
layout: post
title: Minecraft低成本联机服务器搭建-综述
---

# 低成本联机服务器搭建 综述

# 前言

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本文所述大约发生于2025年6月，文章内容主要是回顾以及给其他需要的人提供一些参考
如果能有所帮助，欢迎点赞收藏，谢谢！这真的会让我很开心😊

# 1. 起因

只是为了和朋友们一起爽完mc，于是预备搭建一个7\*24小时的联机服务器

# 2. 方案

- 使用云服务器：
  1. 选择一个云服务器供应商，如阿里云、腾讯云等
  2. 购买一个服务器实例
  3. 启动服务器实例，设置端口映射等
  - 优点：
    - **网络稳定**，无需本地网络问题
    - 公网访问方便
  - 缺点：
    - 长期放血，**成本较高**
    - 大陆的监管备案很麻烦

- 使用本地服务器：
  1. 购买一个本地服务器
  2. 配置好网络服务
  - 优点：
    - **成本低**，无需支付云服务器的费用
    - 归属自己，无需依赖云服务器供应商
  - 缺点：
    - **网络不稳定**
    - 技术困难多
    - 可能被**断电**
    - **高电费成本**，需要自己支付电费

# 3. 行动

## 决定

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作为学生，望望自己空空如也的钱包，毅然决然选择了本地搭建。顺便也能从中学到一些技术知识。

## 缺点解决

### 1.网络不稳定

- IPv6: 打开家庭路由器的`IPv6功能`和`IPv6防火墙`，允许IPv6流量通过，结合dnsApi实现ddns效果
- IPv4: 使用多路内网穿透，python脚本间歇性连接测试，对接dnsApi实时更新

### 2.高电费问题

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购置一台**低功耗机器**和一个**主力服务器**，通过wakeOnLAN技术实现玩家上线唤醒服务器

# 未完待续

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;技术细节将在后续文章中详细描述

---

© 2026 [ant-cave](https://ant-cave.github.io). 保留所有权利。未经许可，禁止转载或使用。  
联系邮箱：<a href="mailto:ANTmmmmm@outlook.com">ANTmmmmm@outlook.com</a> | QQ：1504596931


<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
<span id="busuanzi_container_site_pv">
统计信息<br/>总访问量：<span id="busuanzi_value_site_pv"></span> 次
</span>
|
<span id="busuanzi_container_site_uv">
总访客数：<span id="busuanzi_value_site_uv"></span> 人
</span>
