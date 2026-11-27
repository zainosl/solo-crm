# 乔不不斯的一人公司客户管理 CRM

用销售看板跟进意向、定金和成交，用交付看板管理收材料、服务和售后。每位客户可以记录来源、产品、联系方式与跟进日志，也可以切换表格集中查看。 工具在浏览器本地运行，无需注册、服务器或 API Key。

## 第一次打开

1. [下载一人公司客户管理 CRM ZIP](https://github.com/zainosl/solo-crm/archive/refs/heads/main.zip)，解压整个文件夹。
2. 双击 `index.html` 打开工作区，将 `assets/` 保留在旁边。
3. 在空白工作区点「导入」，选择 [示例文件](examples/crm.example.json)。你会看到两位虚构客户，其中一位已成交并进入交付看板。

记录保存在当前浏览器。导入会替换全部记录，已有数据请先点「导出」。从旧合并版迁移时，在旧页面导出对应工具的 JSON，再在新页面导入。移动文件、切换浏览器或清除浏览器存储前请先备份。

若浏览器限制直接打开本地文件，可在解压目录执行 `python3 -m http.server 8765 --bind 127.0.0.1`，再访问 [本机工作区](http://127.0.0.1:8765)。Windows 安装了 Python 3 的用户可将 `python3` 换成 `py -3`。以后沿用同一地址和端口。

## 用 DeepSeek 或豆包整理自己的记录

打开 [DeepSeek](https://chat.deepseek.com/) 或 [豆包](https://www.doubao.com/chat/)，复制下面这段话，把最后一行换成自己的脱敏笔记。工具通过导入 JSON 接收 AI 整理的内容。

```text
整理下面的脱敏跟进笔记，只输出一个合法 JSON 数组，不包代码块。
每条格式为 {"name":"客户代号","source":"","contact":"","product":"无","salesStatus":"intent","deliveryStatus":"to_serve","notes":"","logs":[]}。
salesStatus 可用 intent（有意向）、deposit（已付定金）、won（已成交）、reactivation（老客待激活）、abandoned（已放弃）、lost（已流失）。仅询价用 intent，不确定记在 notes；只有原文明确成交才用 won。未开始交付用 to_serve，正在收材料用 material_collecting，材料已交用 material_received。product 不清楚填“无”。带明确日期的跟进写成 {"t":"YYYY-MM-DD","text":"事实"} 加到 logs；缺日期只写 notes。
我的笔记：客户甲是朋友介绍的，询问工作坊报价。客户乙已成交，正在收集项目材料。
```

把回复保存为 UTF-8 纯文本 `my-crm.json`，在页面点「导入」，导入后核对条数和状态。已有数据时请先导出备份。

## 用 WorkBuddy 做自己的版本

复制一份解压目录，在 WorkBuddy 中打开这份副本，然后粘贴下面的提示词。[WorkBuddy 官方快速开始](https://www.codebuddy.ai/docs/zh/workbuddy/Quickstart)

```text
阅读此目录的 README.md、index.html 和 examples/crm.example.json。帮我定制自己的一人公司客户管理 CRM。
先问我卖哪两种产品或服务、成交分几个阶段、交付分几个阶段。根据回答调整产品名称、筛选项、卡片、跟进提示和阶段显示名。保留产品与阶段 ID 以及备份字段。新增或合并阶段前先说明旧客户怎样迁移。
根据我的回答在 private/ 下生成 my-crm.json，未知信息留空。先用虚构样例验证新增、编辑、导入、导出和刷新，再告诉我如何打开新版本并导入自己的数据。
```

## 维护与反馈

- 自己定制代码可先 Fork 仓库。升级前导出 JSON，保留定制版本，再到新版恢复。
- `index.html` 是工具入口，`assets/` 是页面样式和主题，`examples/` 包含虚构数据。个人备份可放在 Git 忽略的 `private/` 目录。
- 每次推送和 Pull Request 都会运行 Chrome 测试，检查样例导入、刷新保存和备份恢复。[自动测试](https://github.com/zainosl/solo-crm/actions)
- 报告问题时请附浏览器、复现步骤和虚构样例。[提交 Issue](https://github.com/zainosl/solo-crm/issues)

采用 [MIT 许可证](LICENSE)。
