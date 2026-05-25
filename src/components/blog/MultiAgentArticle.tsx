import Link from 'next/link';
import SiteNav from '@/components/landing/SiteNav';

type Props = {
  locale: string;
};

const signalColors = [
  'border-[#0a72ef] bg-[#0a72ef]/10 text-[#0a72ef]',
  'border-[#ff5b4f] bg-[#ff5b4f]/10 text-[#ff5b4f]',
  'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]',
  'border-[#d97706] bg-[#d97706]/10 text-[#d97706]',
];

const articleCopy = {
  zh: {
    back: '返回首页',
    eyebrow: 'Multi-agent / Claude Code source notes',
    title: 'Claude Code 里的 Multi Agent：把协作做成协议',
    intro:
      '这次我重新顺着 Claude Code 的源码看了一遍 multi agent。越看越觉得，重点并不在“可以同时开几个模型”，而在它对协作这件事的处理方式：它先把协作拆成一组运行时能记录和传递的状态。谁属于哪个队伍，任务写在哪里，消息怎么送达，后台 agent 怎么结束，权限向谁申请，失败后还能不能接着跑。模型当然重要，但多个 agent 能不能一起工作，最后还是要看这些运行时协议。',
    thesis: 'Multi Agent 的关键在于给并行工作建立共享事实、明确边界和可恢复的交接方式。',
    signals: [
      {
        label: 'Team',
        title: '先有队伍，才谈协作',
        body: '在 Claude Code 里，team 首先是一个名字空间。创建 team 时，运行时会写入一份 team config；后面的成员发现、任务归属和消息路由，都围着这个名字空间展开。',
      },
      {
        label: 'Spawn',
        title: 'Prompt 决定要不要协作，运行时只分流',
        body: '要不要建 team、要不要起 teammate，是 prompt 层教模型做的选择。AgentTool 运行时不重新判断“该不该协作”，它只看 name、team_name 等参数走分支。',
      },
      {
        label: 'Message',
        title: '普通回复不会被队友听见',
        body: 'teammate 的系统提示说得很直白：想沟通必须调用 SendMessage。运行时把消息写进 pending queue 或 mailbox，再在对方下一轮上下文里注入。',
      },
      {
        label: 'Resume',
        title: '结束也要能交接、能恢复',
        body: '后台 agent 完成后会发回 task-notification。停止过的 agent 也不一定报废，SendMessage 可以尝试从 transcript 把它恢复成新的后台任务。',
      },
    ],
    architectureTitle: '几条不同的执行车道',
    architectureBody: [
      'Claude Code 里至少有两类并行。普通 subagent 更像“我临时派出去的一个后台工作包”：它有 agentId、输出文件、进度、abort controller，适合做研究、实现、验证这类边界清楚的任务。它跑完以后，结果通过 task-notification 回到主线程。',
      'team teammate 则更像“加入项目组的长期成员”：它有 name@team 的身份，有 team config，有自己的 mailbox，有 idle loop，还会在空闲时继续等下一条指令或自动认领任务。它跑完一轮不会立刻销毁，下一次 prompt 还能接上已有上下文。',
      '这里还有一个很关键的分层：Prompt 层负责告诉模型什么时候应该创建 team、什么时候应该 spawn teammate、什么时候只需要普通 subagent。运行时不替模型做这个产品判断。到了 AgentTool.call 里，事情已经变成很机械的参数分支：有 team_name 和 name，就走 teammate spawn；没有 name，就按普通 subagent / background / sync / worktree 等路径处理。',
      '这两条车道虽然都从 AgentTool 进入，表面看起来都是“开一个 agent”，但源码里它们的生命周期、权限处理、消息回流和 UI 表示都不一样。这个区分很重要，因为一次性后台作业和长期队友解决的是两种问题。',
    ],
    lanesTitle: '两条 agent 车道',
    lanes: [
      [
        'Background agent',
        '像一个可监控、可停止、可恢复的后台作业。有 agentId、进度、输出文件和 task-notification。适合“去查这一块”“改这个文件”“跑这组验证”这种独立工作包。',
      ],
      [
        'Team teammate',
        '像一个常驻队友。有 name@team 身份、team file、mailbox、任务认领逻辑和 idle loop。适合持续协作、任务池分工、来回沟通。',
      ],
    ],
    flowTitle: '从创建队伍到收到结果',
    flow: [
      [
        '0',
        'Prompt guidance',
        'TeamCreate / Agent / SendMessage 的 prompt 先把协作策略教给模型：复杂任务可以建 team，spawn teammate 时要传 team_name 和 name，普通文本不会被队友看到。',
      ],
      [
        '1',
        'TeamCreate',
        '写入 ~/.claude/teams/{team}/config.json，登记 team-lead，并重置对应 task list。队伍名随后会成为任务和 inbox 的共同坐标。',
      ],
      [
        '2',
        'TaskCreate / TaskUpdate',
        '把工作拆成共享任务。status、owner、blockedBy 这些字段承担协议职责，用来减少 agent 之间的重复劳动。',
      ],
      [
        '3',
        'AgentTool',
        '运行时只看参数分支：带 team_name 和 name 时触发 teammate spawn；不带 name 时通常走普通 subagent。这里也解析 worktree、model、tool pool、permission mode。',
      ],
      [
        '4',
        'SendMessage',
        '对运行中的本地 agent 放进 pending queue；对 teammate 写 mailbox；对已经 stopped 的 agent 尝试从 transcript resume。',
      ],
      [
        '5',
        'Notification',
        '后台 agent 以 <task-notification> 回来，带状态、摘要、结果、用量和 output path；teammate 每轮结束后向 team-lead 发 idle notification。',
      ],
    ],
    codeTitle: '难点在于让结果回到正确的人手里',
    codeCaption: '概念化伪代码，来自 TeamCreate / AgentTool / SendMessage 的结构抽象',
    lifecycleTitle: '生命周期里有很多“看起来啰嗦但很必要”的细节',
    lifecycleBody: [
      '普通后台 agent 的生命周期很像一个任务 runner：注册任务，创建 abort controller，启动 runAgent，边跑边更新 progress，结束时把结果封装成 AgentToolResult。比较细的一个点是，它会先把 task 标成 completed，再去做 handoff classifier、worktree cleanup 这些额外工作。这样 TaskOutput 之类等待结果的地方不会因为一个慢 API 或慢 git 操作被卡住。',
      'in-process teammate 的生命周期更长。它在同一个 Node.js 进程里跑，但用 AsyncLocalStorage 带上 teammate identity。每一轮完成后不直接退出，会进入 idle：先发 idle notification，再轮询自己的 mailbox、pendingUserMessages 和 task list。收到 shutdown_request 时，运行时也不会直接杀掉它，会把请求交给模型，让它走协议响应。',
      '这些细节让 multi agent 看起来“不那么魔法”。模型不会只靠感觉协作；运行时会不断把状态推进到一个可观察、可恢复的位置。',
    ],
    lifecyclePoints: [
      ['Progress', '后台 agent 会统计 tool use、token 和最近活动，UI 和 SDK 都能看到它在干什么。'],
      [
        'Abort',
        '后台作业、foreground agent、in-process teammate 当前工作，都有不同层级的 abort controller。',
      ],
      ['Ordering', 'task 完成状态先落地，通知增强逻辑后执行，避免慢分类或清理阻塞等待方。'],
      ['Idle', '长期 teammate 的“空闲”表示等待下一次消息或任务认领，并不等于结束。'],
    ],
    sharedStateTitle: '共享状态在哪里',
    sharedStateBody: [
      '这套设计刻意避免让 agent 彼此读取终端。源码里的提示甚至明确说：不要用 terminal tools 去看团队活动，要用 SendMessage 和 Task tools。原因很简单：终端输出主要给人看，稳定性和结构都不适合作为协作协议。能被多个 agent 共同使用的状态，必须落在可读、可锁、可恢复的数据结构里。',
      '所以 Claude Code 把共享事实拆成几张表：team config 记录成员，task list 记录工作，mailbox 记录消息，AppState.tasks 记录本进程内任务状态，transcript/output file 记录后台 agent 的执行痕迹。每一张表都很朴素，但组合起来就有了协作系统需要的最小秩序。',
    ],
    surfaces: [
      [
        'Team config',
        '成员名、agentId、agentType、model、颜色、pane 信息和工作目录。它回答“这个队伍里有哪些人”。',
      ],
      [
        'Task list',
        '任务状态、owner、blocks/blockedBy。创建、更新、认领都用 lockfile，避免多个 agent 同时抢同一件事。',
      ],
      [
        'Mailbox',
        '按 team/name 分桶的 JSON inbox。消息有 from、text、timestamp、read、summary，写入时加锁。',
      ],
      [
        'AppState tasks',
        '本进程内 agent 的状态、abort controller、进度、pending messages、是否 retained。它回答“现在谁还活着”。',
      ],
      [
        'Transcript',
        '后台 agent 停止后 resume 的依据，也是 output file 的来源。它回答“这个作业刚才做到了哪里”。',
      ],
    ],
    conflictTitle: '它怎么避免 subagent 互相撞车',
    conflictBody: [
      '这里要先说清楚一个边界：Claude Code 没有给所有源码文件加全局写锁，AgentTool 运行时也不会自动判断两个 subagent 会不会改同一个文件。它的做法更工程化一点：把冲突拆成几类，再放到不同层处理。调度归 prompt，任务归 task list，沟通归 mailbox，纠偏归 TaskStop / SendMessage，高风险写入再交给 worktree 隔离。',
      '第一层仍然是 prompt。coordinator 的提示词会告诉模型：研究类任务可以并行，写同一批文件时要收敛到更少 worker，验证可以并行但最好覆盖不同区域。换句话说，让不让两个 worker 同时写，属于 coordinator 的规划责任；AgentTool.call 只执行已经表达成参数的分支。',
      '进入 team 之后，task list 会把这种规划写进共享任务状态。任务有 owner、status、blockedBy，claimTask 会在 lockfile 保护下改状态；已经被别人认领、已经完成、或者被未完成任务阻塞的任务，会被拒绝。启用 busy check 时，同一个 agent 还有未完成任务，也不能再抢新任务。这些机制的价值在于把“谁在做什么”落到共享事实里，让所有 teammate 都能读到同一份状态。',
      '因此，它处理冲突的目标更接近“尽早可见”，不承诺“永远不会撞车”：谁领了任务，谁被阻塞，谁跑偏了，谁需要被 stop，哪一类写操作需要 worktree 隔离。这个边界很重要，因为源码里没有一个万能机制能自动阻止两个 agent 同时编辑同一个文件；能依赖的是 prompt 调度、任务协议、消息顺序和隔离策略一起发挥作用。',
    ],
    conflictPoints: [
      [
        'Prompt scheduling',
        'research 可以并行，write-heavy 按文件区域收敛；这是避免编辑冲突的第一层。',
      ],
      [
        'Task ownership',
        'owner / status / blockedBy 把工作归属落盘，claimTask 用 lockfile 防止重复认领。',
      ],
      ['Flat team topology', 'teammate 不能再 spawn teammate，队伍不会长成难追踪的多层树。'],
      [
        'Message ordering',
        'mailbox 写入加锁；in-process runner 会优先处理 shutdown 和 team-lead 消息。',
      ],
      [
        'Stop / resume',
        '方向错了可以 TaskStop；需要继续时，用 SendMessage 把上下文和下一步重新送回去。',
      ],
      ['Worktree isolation', '高风险写任务可以用 isolation: worktree，把改动放到独立工作区里做。'],
    ],
    coordinatorTitle: 'Coordinator 要把并行结果收束成下一步',
    coordinatorBody: [
      '冲突控制解决的是“别互相踩脚”，但这只是 multi agent 能工作的底线。多个 subagent 查到的东西不会自动变成方案；它们只是把信息带回来，下一步边界仍然需要 coordinator 重新整理。',
      '源码里的 coordinator prompt 很强调这种收束动作：研究可以并行，写代码要谨慎收敛；上下文重叠高的时候，可以继续同一个 worker；需要独立验证时，可以换一个新 worker。coordinator 每次 handoff 前都要判断：这件事应该继续交给原 worker，还是整理成一条新任务交给别人。',
      '如果继续同一个 worker，那个 worker 通常还保留着刚才研究时的上下文。它可能刚读过相关文件、刚跑过测试、刚定位到某个函数的问题。继续它是合理的，但 follow-up 仍然要把关键事实说清楚：哪个文件、哪一行、为什么出错、希望怎么改、完成标准是什么。这样既利用了 worker 的上下文，又不会把理解责任重新推回 worker。',
      '如果新开一个 worker，要求更高。新 worker 没有前一个 worker 的发现上下文，“根据你的发现去修”对它基本没有意义。coordinator 必须把前一个 worker 的结论整理成完整任务说明，不能假设不同 worker 之间会共享脑内状态。',
      '这里的原则不是“永远不能提到 worker 的发现”，而是不能用一句含糊的“根据你的发现”代替综合。并发可以加速信息获取，质量取决于 coordinator 能不能把发现、约束和下一步动作重新组织到一起。',
    ],
    coordinatorRules: [
      '研究可以并行，写同一批文件时要收敛到更少 worker。',
      '继续同一个 worker 时，可以利用它已有上下文，但 follow-up 仍要复述关键事实。',
      '新开 worker 时，提示必须自包含，不能依赖另一个 worker 的历史上下文。',
      '验证最好换一个新 worker，避免实现者自己的假设污染检查。',
      '失败时优先继续同一个 worker，因为它保留了错误上下文。',
    ],
    coordinatorExamplesTitle: '一个更具体的例子',
    coordinatorExamples: [
      [
        '弱指令',
        '“根据你的发现去修。” 这句话只在最理想的 continuation 场景里勉强可用，而且仍然不够清楚。',
      ],
      [
        '更好的 continuation',
        '“继续修你刚才定位到的 src/auth/validate.ts:42。session.user 在 session 过期但 token 仍缓存时可能为空；在访问 user.id 前加空值判断，返回 401 / Session expired，并跑 validate.test.ts。”',
      ],
      [
        '给新 worker 的版本',
        '“修复 src/auth/validate.ts:42 的空指针。研究结论：session.user 在 session 过期但 token 仍缓存时可能是 undefined。添加空值判断，返回 401 / Session expired，更新并运行相关测试。”',
      ],
    ],
    permissionTitle: '权限是协作系统的边界',
    permissionBody: [
      '权限层是这套系统里最容易被低估的一层。in-process teammate 运行在同一个 Node.js 进程里，但身份仍然独立。它用 AsyncLocalStorage 带上 teammate identity，工具调用时可以把权限请求挂到 leader 的 ToolUseConfirm UI 上，让用户看到是哪个 worker 想做什么。',
      '如果 leader UI 不可用，还有 mailbox 版本的 permission_request / permission_response。普通后台 agent 不能弹 UI，所以 runAgent 会把 shouldAvoidPermissionPrompts 打开，并且工具池会过滤到适合异步执行的集合。换句话说，执行形态决定权限形态。',
      '原因也很直接：多 agent 一旦能改文件、跑命令、开 MCP，就已经是多个执行体共享一个工作区。没有权限协议，它们只是在并发地制造风险。',
    ],
    lessonsTitle: '我从源码里带走的判断',
    lessons: [
      '第一，Multi Agent 的瓶颈在综合。并行结果能不能可靠回到正确上下文，决定了这套系统是不是真的可用；task-notification、idle notification 和 mailbox 都在解决这个问题。',
      '第二，名字比 UUID 更重要。源码反复强调给 teammate 发消息要用 name，不要用 agentId，因为协作协议服务的是人可理解的角色和任务归属。',
      '第三，长期 teammate 需要 idle loop，一次性 subagent 需要 resume path。前者像队友，后者像可继续的后台作业；把它们混成一种抽象会损失很多工程细节。',
      '第四，好的 multi agent 系统看起来会有点“保守”：文件锁、任务状态、显式消息、权限回路、停止/恢复。这些东西没有模型能力酷，但它们决定系统能不能在真实项目里用。',
      '第五，不要把“避免冲突”理解成运行时有一个神奇的全局仲裁器。Claude Code 更依赖调度提示、任务归属、消息协议和可选隔离，把冲突从隐形并发变成可观察、可处理的工程状态。',
    ],
  },
  en: {
    back: 'Back home',
    eyebrow: 'Multi-agent / Claude Code source notes',
    title: 'Claude Code multi-agent turns collaboration into protocol.',
    intro:
      'I read through the Claude Code multi-agent code again, more slowly this time. Raw parallel model calls are only the surface. The more interesting part is how the system treats collaboration: it avoids the shape of a busy group chat and starts from plain runtime facts. Who belongs to which team, where tasks live, how messages are delivered, how a background agent ends, who approves permissions, and whether failed work can continue.',
    thesis:
      'The core of multi-agent is shared facts, clear boundaries, and recoverable handoff for parallel work.',
    signals: [
      {
        label: 'Team',
        title: 'Create the team before collaboration',
        body: 'In Claude Code, creating a team is not a cosmetic UI step. It writes team config and gives member discovery, task ownership, and message routing a shared namespace.',
      },
      {
        label: 'Spawn',
        title: 'Prompt chooses collaboration; runtime routes',
        body: 'Whether to create a team or teammate is a model choice guided by prompts. AgentTool does not re-decide whether collaboration is needed; it branches mechanically from name, team_name, and related parameters.',
      },
      {
        label: 'Message',
        title: 'Plain replies are not heard by teammates',
        body: 'The teammate system prompt is blunt: use SendMessage. The runtime writes to a pending queue or mailbox, then injects the message into the recipient context on the next turn.',
      },
      {
        label: 'Resume',
        title: 'Ending work still needs handoff',
        body: 'Background agents return as task notifications. Stopped agents are not always dead; SendMessage can try to resume them from transcript state as a new background task.',
      },
    ],
    architectureTitle: 'Different execution lanes',
    architectureBody: [
      'There are at least two lanes of parallelism. A normal subagent is like a temporary background work packet: it has an agentId, output file, progress, and abort controller. It is good for research, implementation, or verification where the boundary is clear. When it finishes, the result comes back as a task notification.',
      'A team teammate is more like a long-lived project member. It has name@team identity, team config, a mailbox, an idle loop, and logic for claiming tasks. It stays around after a turn finishes, waits between prompts, and keeps useful context across prompts.',
      'There is an important split here: the prompt layer teaches the model when to create a team, when to spawn a teammate, and when a normal subagent is enough. The runtime does not make that product judgment again. By the time execution reaches AgentTool.call, the decision has already been expressed as parameters: team_name plus name means teammate spawn; no name usually means normal subagent, background, sync, or worktree flow.',
      'Both still enter through AgentTool, so from the outside they both look like “start an agent.” In the source, though, their lifecycle, permission handling, message return path, and UI representation are different. That split matters because a background job and a teammate solve different problems.',
    ],
    lanesTitle: 'Two agent lanes',
    lanes: [
      [
        'Background agent',
        'A monitorable, stoppable, resumable background job. It has an agentId, progress, output file, and task notification. Best for bounded packets like research this area, edit this file, or run this verification.',
      ],
      [
        'Team teammate',
        'A resident collaborator with name@team identity, team file, mailbox, task claiming, and idle loop. Best for ongoing coordination and a shared task pool.',
      ],
    ],
    flowTitle: 'From team creation to result delivery',
    flow: [
      [
        '0',
        'Prompt guidance',
        'The TeamCreate / Agent / SendMessage prompts teach the model the collaboration strategy: create a team for complex work, pass team_name and name for teammates, and use SendMessage because plain text is not delivered.',
      ],
      [
        '1',
        'TeamCreate',
        'Writes ~/.claude/teams/{team}/config.json, registers team-lead, and resets the matching task list. The team name becomes the shared coordinate for tasks and inboxes.',
      ],
      [
        '2',
        'TaskCreate / TaskUpdate',
        'Turns work into shared tasks. status, owner, and blockedBy are not decorations; they are the protocol that prevents duplicate work.',
      ],
      [
        '3',
        'AgentTool',
        'Runtime branches from parameters: team_name plus name triggers teammate spawn. Without name, it usually follows normal subagent lifecycle. Worktree, model, tool pool, and permission mode are resolved here too.',
      ],
      [
        '4',
        'SendMessage',
        'Queues messages for running local agents, writes teammate mailboxes, or tries to resume stopped agents from transcript.',
      ],
      [
        '5',
        'Notification',
        'Background agents return <task-notification> with status, summary, result, usage, and output path. Teammates send idle notifications to team-lead between turns.',
      ],
    ],
    codeTitle: 'The hard part is returning results to the right place.',
    codeCaption: 'Conceptual pseudocode abstracted from TeamCreate / AgentTool / SendMessage',
    lifecycleTitle: 'The lifecycle details look boring, and that is exactly why they matter',
    lifecycleBody: [
      'The background agent lifecycle looks like a task runner: register task, create abort controller, start runAgent, update progress while it runs, then wrap the final text into an AgentToolResult. One small but important detail: it marks the task completed before running handoff classification or worktree cleanup. That means a slow classifier call or a slow git operation does not block consumers waiting on TaskOutput.',
      'The in-process teammate lifecycle is longer. It runs in the same Node.js process, but AsyncLocalStorage carries teammate identity. After each turn it marks itself idle, sends an idle notification, then polls mailbox, pendingUserMessages, and the task list. A shutdown_request is passed back into the model rather than being silently accepted by the runtime.',
      'These details make the system feel less magical. The models coordinate inside a runtime that keeps moving each participant into an observable and recoverable state.',
    ],
    lifecyclePoints: [
      [
        'Progress',
        'Background agents track tool uses, tokens, and recent activity so UI and SDK consumers can see what is happening.',
      ],
      [
        'Abort',
        'Background jobs, foreground agents, and in-process teammate work have different abort-controller layers.',
      ],
      [
        'Ordering',
        'Task completion is recorded before optional notification embellishments, so slow cleanup does not block waiters.',
      ],
      [
        'Idle',
        'For a long-lived teammate, idle means waiting for the next message or task claim, not finishing.',
      ],
    ],
    sharedStateTitle: 'Where shared state lives',
    sharedStateBody: [
      'The design deliberately avoids asking agents to inspect each other through terminals. The prompt even says not to use terminal tools to view team activity; use SendMessage and Task tools instead. Terminal output is for humans. Collaboration state needs to live in data structures that can be read, locked, and recovered.',
      'So Claude Code splits shared facts across several surfaces: team config stores members, task list stores work, mailbox stores messages, AppState.tasks stores in-process runtime state, and transcript/output files store resumable execution. Each surface is simple, but together they create the minimum order a multi-agent system needs.',
    ],
    surfaces: [
      [
        'Team config',
        'Names, agent IDs, agent types, model, color, pane metadata, and working directories. It answers who is on this team.',
      ],
      [
        'Task list',
        'Status, owner, blocks, and blockedBy. Create, update, and claim paths use lockfiles so agents do not race for the same work.',
      ],
      [
        'Mailbox',
        'JSON inboxes keyed by team/name. Messages carry from, text, timestamp, read state, and optional summary; writes are locked.',
      ],
      [
        'AppState tasks',
        'In-process state, abort controllers, progress, pending messages, and retained transcript state. It answers who is still alive.',
      ],
      [
        'Transcript',
        'The recovery source for stopped background agents and output files. It answers where the job left off.',
      ],
    ],
    conflictTitle: 'How it keeps subagents from colliding',
    conflictBody: [
      'The first thing to be precise about: Claude Code has no global write lock around every source file, and AgentTool does not magically decide whether two subagents might edit the same file. The design is more practical. It splits conflict control across layers: prompt-level scheduling, task-list ownership, mailbox delivery, TaskStop / SendMessage correction, and optional worktree isolation for risky writes.',
      'The first layer is still the prompt. The coordinator prompt tells the model that research can run in parallel, write-heavy work over the same files should narrow to fewer workers, and verification can run in parallel when it covers different areas. In other words, simultaneous writing is a planning responsibility for the coordinator; AgentTool.call only executes the branch already expressed through parameters.',
      'Once a team exists, the task list becomes the hard protocol. Tasks have owner, status, and blockedBy. claimTask changes state under a lockfile; already claimed, completed, or blocked tasks are rejected. With the busy check enabled, an agent that still has unfinished work cannot claim another task. The value is concrete: “who is doing what” becomes shared state every teammate can read.',
      'The system therefore aims for early visibility rather than a promise that collisions are impossible: who claimed the task, who is blocked, who went off track, who needs to be stopped, and which write-heavy job should be isolated in a worktree. That boundary matters because the source contains no universal mechanism that prevents two agents from touching the same file. The real guardrail is the stack of prompt scheduling, task protocol, message ordering, and isolation.',
    ],
    conflictPoints: [
      [
        'Prompt scheduling',
        'Research can fan out; write-heavy work narrows by file area. This is the first layer of edit-conflict control.',
      ],
      [
        'Task ownership',
        'owner / status / blockedBy make ownership durable, and claimTask uses lockfiles to prevent duplicate claims.',
      ],
      [
        'Flat team topology',
        'A teammate cannot spawn another teammate, so the roster does not become a hard-to-debug tree.',
      ],
      [
        'Message ordering',
        'Mailbox writes are locked; the in-process runner prioritizes shutdown and team-lead messages.',
      ],
      [
        'Stop / resume',
        'A bad direction can be stopped with TaskStop, then continued or corrected through SendMessage.',
      ],
      [
        'Worktree isolation',
        'Risky write tasks can use isolation: worktree so changes happen in a separate checkout.',
      ],
    ],
    coordinatorTitle: 'The coordinator turns parallel results into the next step',
    coordinatorBody: [
      'The previous section was about keeping workers from colliding. That is only the baseline. Quality depends on how the coordinator turns parallel work back into one clear next step. Subagents can bring information back, but their findings do not automatically become a plan.',
      'The coordinator prompt reflects that shape: research can fan out, write-heavy work should narrow, the same worker can continue when context overlap is high, and a fresh worker can verify independently. The coordinator is not merely forwarding messages. Before every handoff, it decides whether the same worker should continue or whether the result should be rewritten as a fresh task for someone else.',
      'When the same worker continues, it usually still has useful context. It may have just read the relevant files, run the failing tests, or found the exact function. Continuing it is reasonable, but the follow-up still needs to restate the important facts: file, line, cause, desired change, and done criteria. That uses the worker’s context without handing understanding back to the worker.',
      'When a fresh worker is spawned, the bar is higher. The new worker does not have the previous worker’s discovery context, so “based on your findings, fix it” is not a real task brief. The coordinator has to turn the previous result into a self-contained instruction.',
      'So the rule is not “never mention what the worker found.” The rule is: do not let that phrase replace synthesis. Parallelism speeds up information gathering; quality comes from reorganizing findings, constraints, and the next action into a clear handoff.',
    ],
    coordinatorRules: [
      'Run research in parallel; narrow write-heavy work to fewer workers.',
      'When continuing the same worker, use its context, but restate the key facts in the follow-up.',
      'When spawning a fresh worker, the prompt must be self-contained and cannot depend on another worker’s history.',
      'Verification is often better as a fresh worker to avoid inherited assumptions.',
      'Failures usually belong with the same worker because it has the error context.',
    ],
    coordinatorExamplesTitle: 'A concrete example',
    coordinatorExamples: [
      [
        'Weak prompt',
        '“Based on your findings, fix it.” This only barely works in the best continuation case, and it is still underspecified.',
      ],
      [
        'Better continuation',
        '“Continue with the issue you found in src/auth/validate.ts:42. session.user can be empty when the session expires but the token remains cached; add a null check before user.id, return 401 / Session expired, and run validate.test.ts.”',
      ],
      [
        'For a fresh worker',
        '“Fix a null pointer in src/auth/validate.ts:42. Research found that session.user can be undefined when the session expires but the token remains cached. Add a null check, return 401 / Session expired, update tests, and run the relevant suite.”',
      ],
    ],
    permissionTitle: 'Permissions are the boundary of collaboration',
    permissionBody: [
      'The permission layer is easy to underestimate. An in-process teammate shares the Node.js process while keeping a separate identity. AsyncLocalStorage carries teammate identity, and tool approval can go through the leader ToolUseConfirm UI so the user can see which worker wants to do what.',
      'If that leader UI is unavailable, there is a mailbox version of permission_request / permission_response. True background agents cannot show UI, so runAgent turns on shouldAvoidPermissionPrompts and the tool pool is filtered to tools suitable for async execution. Execution shape decides permission shape.',
      'That is realistic. Once agents can edit files, run commands, and call MCP tools, they become multiple executors sharing one workspace. Without a permission protocol, they are just creating risk concurrently.',
    ],
    lessonsTitle: 'Architecture judgments I took from the source',
    lessons: [
      'First, the bottleneck is synthesis. Parallel results need to return to the right context reliably; task notifications, idle notifications, and mailboxes all solve that return flow.',
      'Second, names matter more than UUIDs. The source repeatedly tells agents to message teammates by name because collaboration is organized around human-readable roles and ownership.',
      'Third, long-lived teammates need an idle loop; one-shot subagents need a resume path. One behaves like a teammate, the other like a resumable background job.',
      'Fourth, a useful multi-agent system looks a little conservative: file locks, task state, explicit messages, permission loops, stop and resume. These pieces are less flashy than model capability, but they decide whether the system works on a real project.',
      'Fifth, conflict control is not a magic runtime arbiter. Claude Code relies on scheduling prompts, task ownership, message protocol, and optional isolation to turn hidden concurrency into visible, manageable engineering state.',
    ],
  },
} as const;

export default function MultiAgentArticle({ locale }: Props) {
  const isEnglish = locale === 'en';
  const copy = isEnglish ? articleCopy.en : articleCopy.zh;
  const backHref = `/${isEnglish ? 'en' : 'zh'}`;

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717] dark:bg-[#050505] dark:text-[#ededed] font-[family-name:var(--font-geist-sans)]">
      <SiteNav />

      <article className="pt-24">
        <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-14 pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <Link
              href={backHref}
              className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-3 text-sm font-medium text-[#4d4d4d] transition hover:border-black/20 hover:text-[#171717] dark:border-white/10 dark:bg-white/5 dark:text-[#a1a1a1] dark:hover:text-white"
            >
              {copy.back}
            </Link>
            <p className="mt-10 text-sm font-semibold uppercase text-[#0a72ef]">{copy.eyebrow}</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-[#111111] dark:text-white sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
              {copy.intro}
            </p>
          </div>

          <aside className="rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]">
            <p className="text-xs font-semibold uppercase text-[#808080]">Core thesis</p>
            <p className="mt-4 text-2xl font-semibold leading-snug">{copy.thesis}</p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs font-medium">
              <span className="rounded-md bg-[#0a72ef]/10 px-2 py-2 text-[#0a72ef]">team file</span>
              <span className="rounded-md bg-[#ff5b4f]/10 px-2 py-2 text-[#ff5b4f]">mailbox</span>
              <span className="rounded-md bg-[#16a34a]/10 px-2 py-2 text-[#16a34a]">task list</span>
              <span className="rounded-md bg-[#d97706]/10 px-2 py-2 text-[#d97706]">resume</span>
            </div>
          </aside>
        </section>

        <section className="border-y border-black/10 bg-white py-12 dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-4 md:grid-cols-4">
              {copy.signals.map((signal, index) => (
                <div
                  key={signal.label}
                  className="rounded-lg border border-black/10 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${signalColors[index]}`}
                  >
                    {signal.label}
                  </span>
                  <h2 className="mt-5 text-lg font-semibold">{signal.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">
                    {signal.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#0a72ef]">01 / Runtime shape</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.architectureTitle}</h2>
          <div className="mt-5 space-y-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.architectureBody.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]">
            <h3 className="text-lg font-semibold">{copy.lanesTitle}</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {copy.lanes.map(([name, body], index) => (
                <div
                  key={name}
                  className="rounded-lg border border-black/10 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[#808080]">
                    lane 0{index + 1}
                  </span>
                  <h4 className="mt-3 text-xl font-semibold">{name}</h4>
                  <p className="mt-3 text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] py-16 text-white dark:bg-black">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-semibold text-[#ff5b4f]">02 / Protocol</p>
              <h2 className="mt-3 text-3xl font-semibold">{copy.flowTitle}</h2>
            </div>

            <div className="grid gap-3">
              {copy.flow.map(([step, name, body]) => (
                <div
                  key={name}
                  className="grid grid-cols-[44px_minmax(0,150px)_minmax(0,1fr)] gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 max-sm:grid-cols-[44px_minmax(0,1fr)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#111111]">
                    {step}
                  </span>
                  <p className="font-semibold max-sm:pt-1">{name}</p>
                  <p className="text-sm leading-6 text-[#b8b8b8] max-sm:col-span-2">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#16a34a]">03 / Return flow</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.codeTitle}</h2>
          <p className="mt-2 text-sm text-[#808080]">{copy.codeCaption}</p>

          <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-[#11111b] text-[#cdd6f4] dark:border-[#313244]">
            <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-4 py-3 text-xs text-[#a6adc8]">
              <span>multi-agent flow</span>
              <span>TeamCreate / AgentTool / SendMessage</span>
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7">
              <code className="font-[family-name:var(--font-geist-mono)]">
                <span className="text-[#f38ba8]">const</span>{' '}
                <span className="text-[#fab387]">team</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#89b4fa]">TeamCreate</span>
                <span className="text-[#cdd6f4]">()</span>
                {'\n'}
                <span className="text-[#89b4fa]">TaskCreate</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#a6e3a1]">&apos;research parser&apos;</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n'}
                <span className="text-[#89b4fa]">TaskCreate</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#a6e3a1]">&apos;verify tests&apos;</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n\n'}
                <span className="text-[#89b4fa]">Agent</span>
                <span className="text-[#cdd6f4]">({'{'}</span>
                {'\n  '}
                <span className="text-[#fab387]">team_name</span>:{' '}
                <span className="text-[#fab387]">team</span>
                <span className="text-[#cdd6f4]">.</span>
                <span className="text-[#fab387]">name</span>,{'\n  '}
                <span className="text-[#fab387]">name</span>:{' '}
                <span className="text-[#a6e3a1]">&apos;researcher&apos;</span>,{'\n  '}
                <span className="text-[#fab387]">prompt</span>:{' '}
                <span className="text-[#a6e3a1]">&apos;claim a task and report findings&apos;</span>
                {'\n'}
                <span className="text-[#cdd6f4]">{'}'}</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n\n'}
                <span className="text-[#6c7086]">
                  {'// later, every visible handoff is explicit'}
                </span>
                {'\n'}
                <span className="text-[#f38ba8]">await</span>{' '}
                <span className="text-[#89b4fa]">SendMessage</span>
                <span className="text-[#cdd6f4]">({'{'}</span>{' '}
                <span className="text-[#fab387]">to</span>:{' '}
                <span className="text-[#a6e3a1]">&apos;researcher&apos;</span>,{' '}
                <span className="text-[#fab387]">message</span>:{' '}
                <span className="text-[#a6e3a1]">&apos;continue with this spec&apos;</span>{' '}
                <span className="text-[#cdd6f4]">{'}'}</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n'}
                <span className="text-[#f38ba8]">await</span>{' '}
                <span className="text-[#89b4fa]">waitFor</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#a6e3a1]">
                  &apos;&lt;task-notification&gt; or idle notification&apos;
                </span>
                <span className="text-[#cdd6f4]">)</span>
              </code>
            </pre>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-16 dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[920px] px-6">
            <p className="text-sm font-semibold text-[#ff5b4f]">04 / Lifecycle</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.lifecycleTitle}</h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
              {copy.lifecycleBody.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {copy.lifecyclePoints.map(([name, body]) => (
                <div
                  key={name}
                  className="rounded-lg border border-black/10 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-16 dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[920px] px-6">
            <p className="text-sm font-semibold text-[#d97706]">05 / Shared state</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.sharedStateTitle}</h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
              {copy.sharedStateBody.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
              {copy.surfaces.map(([name, body]) => (
                <div
                  key={name}
                  className="grid gap-3 border-b border-black/10 bg-[#fafafa] p-4 last:border-b-0 dark:border-white/10 dark:bg-white/[0.03] md:grid-cols-[150px_minmax(0,1fr)]"
                >
                  <span className="font-semibold">{name}</span>
                  <p className="text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#16a34a]">06 / Conflict control</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.conflictTitle}</h2>
          <div className="mt-5 space-y-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.conflictBody.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {copy.conflictPoints.map(([name, body]) => (
              <div
                key={name}
                className="rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]"
              >
                <h3 className="text-base font-semibold">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4d4d4d] dark:text-[#b8b8b8]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#0a72ef]">07 / Coordination</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.coordinatorTitle}</h2>
          <div className="mt-5 space-y-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.coordinatorBody.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {copy.coordinatorRules.map(rule => (
              <div
                key={rule}
                className="rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]"
              >
                <p className="text-sm leading-6 text-[#4d4d4d] dark:text-[#b8b8b8]">{rule}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]">
            <h3 className="text-lg font-semibold">{copy.coordinatorExamplesTitle}</h3>
            <div className="mt-5 space-y-4">
              {copy.coordinatorExamples.map(([label, body]) => (
                <div
                  key={label}
                  className="grid gap-3 border-t border-black/10 pt-4 first:border-t-0 first:pt-0 dark:border-white/10 md:grid-cols-[180px_minmax(0,1fr)]"
                >
                  <span className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold uppercase tracking-wide text-[#808080]">
                    {label}
                  </span>
                  <p className="text-sm leading-6 text-[#4d4d4d] dark:text-[#b8b8b8]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0f172a] py-16 text-white">
          <div className="mx-auto max-w-[920px] px-6">
            <h2 className="text-3xl font-semibold">{copy.permissionTitle}</h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-[#cbd5e1]">
              {copy.permissionBody.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <h2 className="text-3xl font-semibold">{copy.lessonsTitle}</h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.lessons.map(lesson => (
              <p key={lesson}>{lesson}</p>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
