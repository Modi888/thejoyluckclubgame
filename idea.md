你现在是一名资深全栈开发者和游戏交互设计师。请帮我从零开始实现一个可运行的网页小游戏项目，技术栈使用 React + Phaser.js。这个项目是我的英文文学作业，主题来自《The Joy Luck Club》。作业要求是：项目必须探索书中的至少一个主题，建立与我个人生活的联系，并融入至少三个外部研究来源；老师明确允许用 Game Design / coding 的形式完成。这个项目最终需要用于课堂展示，所以必须有完成度、美观度和可演示性。项目重点不只是“能玩”，更要体现主题深度、个人反思和创意。请严格围绕这些目标来设计和实现。作业要求可概括为：主题探索、个人连接、研究整合、课堂展示，这几点必须能在最终作品中被看见。不要做成纯技术demo。要做成一个真正有文学表达和情感张力的互动作品。:contentReference[oaicite:0]{index=0}

====================
一、项目总目标
====================

请实现一个像素风网页版小游戏，暂定名为：

"What I Meant to Say"
副标题可选："A mother-daughter dialogue simulator inspired by The Joy Luck Club"

项目核心概念：
- 场景设定在家中，以晚餐前后为主要时空背景
- 玩家扮演一个女儿角色，在家中移动，与母亲发生对话
- 游戏主题聚焦于：
  1. mother-daughter relationships
  2. generational conflict / misunderstanding
  3. cultural identity / indirect expressions of love
- 对话触发方式是“半随机的”：不是预设固定剧本，也不是完全失控的自由聊天
- 使用 LLM API 生成母亲的对话和回应，但必须受到强约束，始终围绕主题，不跑偏
- 玩家可以自由输入回答
- 系统根据玩家回答分析情绪和沟通倾向，推动隐藏状态变化
- 每局长度控制在 3–6 分钟，适合课堂演示
- 最终出现一个带文学意味的结局与反思界面，而不是简单的“成功/失败”

这个项目必须让人感受到：
“有些冲突表面上是关于吃饭、成绩、手机、未来，实际上是关于爱、期待、误解、牺牲和无法表达。”

====================
二、设计原则
====================

请严格遵守以下原则：

1. 不要把它做成一个普通 AI 聊天框。
它必须首先是一个“叙事游戏”，其次才是一个带 AI 的对话系统。

2. 不要让 LLM 完全主导剧情。
游戏必须有隐藏状态机、主题池、事件池、结局逻辑。LLM 只是负责生成自然语言内容，而不是决定整个游戏结构。

3. 所有系统设计都应服务于文学主题表达。
不要加入无关的酷炫功能，不要偏离《The Joy Luck Club》的主题。

4. 画风要简洁的像素风、暖色调、家庭氛围、带一点压抑感。
整体感觉要像：
- 安静的中国/华人家庭傍晚
- 温暖灯光下隐藏着沟通 tension
- 不是恐怖游戏，不是搞笑游戏，不是恋爱游戏

5. 适合快速演示。
老师上课看作品时，应该能在 1 分钟内理解玩法，在 3–5 分钟内体验到主题。

====================
三、技术栈要求
====================

请使用以下技术：

前端：
- React
- TypeScript
- Phaser.js
- Vite

样式：
- 可使用普通 CSS / CSS modules
- 尽量避免引入重 UI 库
- UI 要自己做成像素风、RPG 对话框风格

状态管理：
- 优先使用 React state + context 或 Zustand
- 不要引入过重复杂方案

后端：
- Node.js + Express
- 提供一个简单 API 代理 LLM 请求
- 前端不能直接暴露 API key

项目结构：
- 前后端分离，但要简单清晰
- 可以在同一个仓库里，分为 client 和 server

部署：
- 前端最好能轻松部署到 Vercel / Netlify
- 后端最好能部署到 Render / Railway / 自己服务器
- 请在 README 中写清楚本地运行方法

====================
四、核心玩法设计
====================

请实现以下完整玩法闭环：

1. 开始界面
- 标题
- Start 按钮
- 简短说明（1-2 句）
- 说明玩家将进入一个家庭晚餐场景，体验母女之间的误解与沟通
- 可加一个 "About this project" 按钮，进入说明页

2. 游戏场景
- 一个像素风室内家庭场景，至少包含：
  - 主角卧室区域
  - 客厅
  - 餐桌 / 厨房区域
- 玩家可用键盘移动角色
- 采用俯视角 2D 像素风
- 角色移动不需要很复杂，但要流畅

3. 事件触发机制
玩家进入特定区域或经过一定时间后，触发家庭事件。
事件池至少包含这些类型：
- mother calls you to dinner
- mother asks about school / grades
- mother comments on your attitude
- mother compares you to others
- mother expresses worry indirectly
- mother mentions sacrifice / “I do this for you”
- mother notices you are distracted / on your phone
- mother asks about your future

要求：
- 每一局随机选 1 个核心冲突主题 + 1 个事件触发器
- 同一主题可有不同表述
- 不要让每次体验完全一样

4. 对话模式
- 触发事件后，屏幕进入 RPG 风格对话模式
- 显示母亲像素头像 / 玩家头像
- 显示母亲台词
- 下方有输入框，玩家可自由输入
- 玩家提交后，系统调用后端 LLM API，生成母亲下一句回复
- 每轮对话控制在 4–8 轮之内
- 母亲每次回复控制在 1–3 句，不要长篇大论
- 语言要自然、现实、克制，带情绪张力，但不能戏剧过头

5. 隐藏状态系统
请设计并实现一个隐藏状态系统，用于决定结局。至少包含以下变量：

- tension: 紧张度
- openness: 开放度 / 愿意表达真实感受
- hurt: 受伤程度
- understanding: 彼此理解程度
- mother_worry: 母亲担忧程度
- player_style: 玩家沟通风格标签（如 defensive / silent / honest / angry / vulnerable）

这些状态变化不能完全依赖 LLM 主观判断。请使用“双层机制”：
- 第一层：由代码根据玩家输入长度、关键词、情绪倾向进行初步分类
- 第二层：可调用 LLM 返回结构化情绪分析（JSON）作为辅助
最终由程序决定状态增减

6. 结局系统
不要做成二元对错。
请至少实现以下 5 个结局之一：

- Misunderstood
- Temporary Peace
- Heard, But Not Fully
- A Small Opening
- What I Wish I Said

每个结局页面包含：
- 结局标题
- 一段简短文学化说明（2–4句）
- 一个“theme reflection”文本区
- 两个玩家可填写/展示的反思框：
  1. What I wish she understood
  2. What I wish I understood

7. 项目说明页 / 展示页
为了满足课堂作业要求，游戏内或网页中必须加入一个说明页，清楚解释：
- 本项目探索的主题是什么
- 与《The Joy Luck Club》的关系是什么
- 为什么选择“家庭晚餐冲突”这个场景
- 这个作品如何联系现实生活中的母女/代际沟通
- 研究是如何融入项目的

这个页面不要过长，但要足够让老师看出你不是只做了个技术玩具。

====================
五、LLM 对话系统设计要求
====================

这是项目的重点之一。请按以下方式设计，不要偷懒做成一个普通 open-ended chat 接口。

1. 后端提供一个 POST 接口，例如：
POST /api/dialogue/respond

输入大致包括：
- scene
- triggerEvent
- theme
- conversationHistory
- playerInput
- currentGameState
- motherEmotion
- playerStyle
- turnCount

输出包括：
- motherReply
- optionalNarration
- structuredAnalysis

2. structuredAnalysis 必须是结构化 JSON，至少包含：
- detected_player_emotion
- response_style
- tension_delta
- openness_delta
- understanding_delta
- hurt_delta
- mother_emotion_next
- keep_conversation_going (boolean)
- suggested_end_if_any

3. 必须通过 prompt engineering 强约束模型：
系统 prompt 目标：
- 你扮演一位现实中的华人母亲 / immigrant mother / traditional mother figure
- 你爱女儿，但表达方式可能是控制、担忧、批评、催促、比较、沉默
- 你不能像心理咨询师一样完美表达
- 你不能讲大道理过多
- 你必须保持自然、真实、短句
- 对话始终围绕晚餐、家庭、成绩、未来、期待、牺牲、误解、代际差异
- 不允许跑题，不允许科幻，不允许网络流行梗，不允许夸张戏剧腔
- 每次回复不要超过 3 句
- 偶尔可带潜台词感，但不要过于抽象

4. 模型输出格式必须稳定
请强制要求返回 JSON，再由后端解析。
如果解析失败，要有 fallback 机制。

5. fallback 机制
如果 LLM 接口失败、超时或返回无效 JSON：
- 使用本地备用模板生成一条母亲回复
- 保证游戏仍可继续
- 不要因为 API 问题让整个游戏崩掉

====================
六、建议实现的“半随机”叙事骨架
====================

请实现一个叙事控制器，而不是只靠模型自由发挥。

每局初始化时，随机生成：

- theme（从以下选 1 个）
  - generational misunderstanding
  - love expressed as control
  - pressure and expectations
  - silence vs expression
  - sacrifice and resentment
  - cultural gap at home

- triggerEvent（从以下选 1 个）
  - dinner_call
  - grades_question
  - phone_comment
  - future_pressure
  - comparison
  - gratitude_conflict

- motherBaseEmotion（从以下选 1 个）
  - tired
  - worried
  - disappointed
  - loving_but_indirect
  - frustrated

- environmentalFlavor
  - warm rice smell
  - TV in background
  - clinking chopsticks
  - evening light
  - quiet apartment tension

这些变量会影响模型 prompt 和 UI 文案。

====================
七、UI / 美术 / 氛围要求
====================

请做成简洁但完整的像素风，不要求超高复杂度，但必须有风格。

1. 场景风格
- 暖色系
- 傍晚家中
- 有餐桌、灯、窗户、沙发或柜子等
- 画面干净，不要太花
- 颜色整体偏温暖木色 + 黄灯，但气氛稍微压抑

2. 角色
- 女儿：简洁像素角色
- 母亲：简洁像素角色
- 不需要复杂动画
- 至少要有 idle 和 walk

3. 对话框
- 复古 RPG 风格
- 像素边框
- 半透明深色底
- 字体清晰
- 输入框要与整体风格统一，不要像普通表单

4. 音效（可选但推荐）
- 轻微房间环境音
- 按键 / 对话提示音
- 不要喧宾夺主

5. 页面体验
- 桌面浏览器优先适配
- 分辨率优先考虑 laptop 投屏课堂展示
- 不必优先做移动端，但不能完全崩

====================
八、研究整合要求（非常重要）
====================

这个是文学作业，不是纯编程项目。请为项目预留“研究整合”的位置。

老师要求至少三个 outside sources，并且要真正 woven into the project，而不是只在最后列参考文献。:contentReference[oaicite:1]{index=1}

因此请在项目中设计以下位置：

1. About / Reflection 页面预留一个 “Research Behind the Project” 区块
其中放 3 个研究来源的简短引用式概括，每条 1–2 句，说明它如何影响游戏设计。

2. 游戏结局页可以根据主题插入 1 条简短研究洞见
例如：
- on intergenerational communication
- on immigrant family pressure
- on indirect emotional expression in Asian families

3. 在代码中把 research data 抽离成一个独立 JSON / TS 文件，方便我后续替换为真实文献内容

请先用占位内容实现结构，例如：
- source title
- author
- year
- short takeaway
- how it connects to game

但不要捏造具体学术结论得太夸张。可以用 clearly marked placeholder text，等我后续替换真实资料。

====================
九、与作业要求的对应设计
====================

请在 README 和项目说明页中明确体现这几点：

1. Theme Exploration
项目探索的主题包括：
- mother-daughter relationships
- generational conflict and understanding
- cultural identity / indirect love

2. Personal Connection
通过“晚餐冲突”这种极其日常的场景，把抽象主题转化为现实家庭经验，让玩家感受到“表面上在争论吃饭、成绩、态度，实际上在争论爱、期待和被理解”。

3. Research Component
项目预留研究引用和说明区域，方便嵌入至少 3 个外部来源，并将其与游戏机制和主题表达结合。

4. Presentation Readiness
项目适合课堂展示：有开场、有玩法、有结局、有说明页，有明确的主题表达。老师要求媒体/创意项目展示时说明主题、选择原因、研究联系，这个项目必须支持这种介绍。:contentReference[oaicite:2]{index=2}

====================
十、工程要求
====================

请按 production-minded 的方式实现：

1. 给出完整目录结构
示例可参考：
- client/
  - src/
    - game/
    - scenes/
    - components/
    - hooks/
    - store/
    - data/
    - assets/
    - pages/
    - styles/
  - package.json
- server/
  - src/
    - routes/
    - services/
    - prompts/
    - utils/
  - package.json
- README.md

2. 环境变量
- 后端通过 .env 管理 API key
- 不要把 key 写死

3. 日志和错误处理
- API 报错要在前端有温和提示
- 游戏仍可继续

4. 类型定义
- 尽量完整使用 TypeScript 类型
- dialogue response、game state、ending、theme、trigger event 都要定义类型

5. 可维护性
- 把 prompt 文本单独拆文件
- 把 ending 文案、事件池、主题池拆成 data 文件
- 不要把所有逻辑塞进一个组件

====================
十一、请你输出的内容
====================

请你按以下顺序为我完成，不要跳步骤，不要只给概念：

第一步：先给出完整产品方案
包括：
- 游戏概念总结
- 用户体验流程
- 页面结构
- 核心状态机设计
- LLM 对话机制
- 结局机制
- 研究整合方式

第二步：给出完整项目目录结构

第三步：给出前后端初始化命令和依赖安装命令

第四步：开始逐文件编写代码
要求：
- 直接给出可运行代码
- 每个文件注明路径
- 不要省略关键文件
- 不要只给伪代码
- 如果代码很多，可以分批输出，但必须能逐步拼成完整项目

第五步：补一个 README
README 里要写：
- 项目简介
- 运行方式
- 环境变量
- 架构说明
- 如何替换研究内容
- 如何替换 LLM 提供商
- 课堂展示建议

====================
十二、交互与文案风格要求
====================

请确保文案整体风格：
- 文学感
- 克制
- 真实
- 不矫情
- 不土味
- 不像 AI 生成的鸡汤
- 适合英文文学作业展示

结局文案和说明文案要有一定 quality。
可以安静、有余味，但不要故作高深。

====================
十三、额外加分功能（如果不太复杂就做）
====================

1. 开局时有一句简短旁白，比如：
“Sometimes dinner is not about dinner.”

2. 母亲靠近餐桌时，场景中的灯光或 UI 氛围微妙变化

3. 结局后可以 replay

4. 保存本局对话记录，供展示时回顾

5. 在 About 页面展示：
“Inspired by themes from The Joy Luck Club”

====================
十四、重要限制
====================

1. 不要做成完全开放世界
2. 不要加入战斗、积分、任务系统等破坏文学气质的功能
3. 不要让 LLM 输出太长
4. 不要让画面过度复杂，优先保证可完成
5. 不要省略研究整合结构
6. 不要忘记这个项目最终是课堂作业，不是商业产品

====================
十五、实施策略建议
====================

请优先完成一个“最小可展示高质量版本（MVP）”，包含：
- 开始页
- 一个家庭像素场景
- 玩家移动
- 1个随机触发事件系统
- LLM 对话
- 隐藏状态变化
- 至少 3 个结局
- About/Reflection 页面
- 占位 research 区块

在此基础上，再逐步增强：
- 更多事件
- 更多结局
- 更好的像素素材
- 更丰富对话控制

====================
十六、如果有实现抉择，请优先遵循
====================

优先级从高到低：
1. 主题表达
2. 可演示性
3. 完整度
4. 稳定性
5. 美术细节
6. 技术炫技

现在请开始执行。先输出第一步：完整产品方案。