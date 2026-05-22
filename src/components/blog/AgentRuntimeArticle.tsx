import Link from 'next/link';
import SiteNav from '@/components/landing/SiteNav';

type Props = {
  locale: string;
};

const stepAccents = [
  'border-[#0a72ef] bg-[#0a72ef]/10 text-[#0a72ef]',
  'border-[#ff5b4f] bg-[#ff5b4f]/10 text-[#ff5b4f]',
  'border-[#16a34a] bg-[#16a34a]/10 text-[#16a34a]',
  'border-[#d97706] bg-[#d97706]/10 text-[#d97706]',
];

const contextLayers = [
  { name: 'System Prompt', value: '14%', color: 'bg-[#171717] dark:bg-[#ededed]' },
  { name: 'User / Assistant Turns', value: '34%', color: 'bg-[#0a72ef]' },
  { name: 'Tool Results', value: '24%', color: 'bg-[#ff5b4f]' },
  { name: 'Attachments / Memory', value: '16%', color: 'bg-[#16a34a]' },
  { name: 'Safety Buffer', value: '12%', color: 'bg-[#d97706]' },
];

const articleCopy = {
  zh: {
    back: '返回首页',
    eyebrow: 'Runtime Anatomy / Claude Code source notes',
    title: 'Agent 不是聊天机器人，而是一台会反复接线的运行时机器',
    intro:
      '最近我系统读了一遍 Claude Code 这类 Agent 工具的源码。真正有意思的地方不是模型会不会回答，而是它如何把下一步意图交给运行时：触发工具、收集结果、整理上下文，然后继续推理。这篇文章重点拆三件事：工具调用、上下文管理、循环推理。',
    thesis: 'LLM 负责决定下一步，运行时负责让下一步真的发生。',
    steps: [
      {
        label: '1. Model',
        title: '模型先给出下一步意图',
        body: '它可能输出文本，也可能输出一个结构化的 tool_use block。运行时不把这当成答案终点，而是当成下一步动作。',
      },
      {
        label: '2. Tool',
        title: '工具层接管真实世界',
        body: '工具定义负责 schema 校验、权限判断、并发策略、错误包装，以及把执行结果转换回 tool_result。',
      },
      {
        label: '3. Context',
        title: '上下文被重新装配',
        body: '新的 assistant 消息、工具结果、附件、记忆、压缩边界一起进入下一轮消息队列。',
      },
      {
        label: '4. Loop',
        title: '继续推理直到没有工具需求',
        body: '只要本轮出现工具调用，运行时就继续循环。没有 tool_use、没有阻塞 hook、没有恢复重试，回合才结束。',
      },
    ],
    loopTitle: '一次 Agent 回合的生命线',
    loopBody:
      '普通聊天的心智模型是：用户发一句，模型答一句。Agent 的心智模型完全不同：用户发出目标后，运行时会进入一个循环。每次循环都把当前消息、系统提示、工具定义和上下文状态发给模型；如果模型返回工具调用，就暂停回答，先执行工具；拿到结果后再把结果作为新的用户侧消息放回上下文，继续请求模型。',
    stateLead: '这里最关键的是',
    stateBody:
      'Agent 的连续性不是来自模型记忆，而是来自运行时把每轮的观察结果有纪律地拼回下一轮输入。模型每次都像站在新的现场，只是这个现场由运行时整理过。',
    toolTitle: '工具调用不是函数调用',
    toolBody:
      '从模型视角看，工具像一个 JSON 函数。但从运行时视角看，工具是一段受控执行协议：它要先被发现，再被校验，再经过权限和 hook，最后才会真正碰文件、shell、MCP 或网络资源。',
    toolStages: [
      '发现工具',
      '解析输入',
      '校验 schema',
      '权限判断',
      '执行/并发控制',
      '包装 tool_result',
      '回填模型上下文',
    ],
    contextTitle: '上下文不是聊天记录，而是工作台',
    contextBody:
      '一个长任务里，真正吃掉上下文窗口的通常不是用户问题，而是工具结果、文件内容、附件、记忆和中间推理轨迹。从 Claude Code 的源码看，上下文治理不是一个功能点，而是一整套分层机制：工具结果预算、micro-compact、auto-compact、reactive compact、session memory。它们的目标不是“省 token”这么简单，而是尽量保住下一步推理所需的现场。',
    contextCaption: '概念示意，不是实测 token 分布',
    compactBody:
      '自动压缩的触发逻辑很像内存管理：先计算当前 token 使用量，再和模型有效窗口、预留输出空间、buffer 做比较。超过阈值时，运行时会尝试把历史折叠成摘要；如果压缩连续失败，还会有熔断，避免每一轮都浪费一次必然失败的 API 调用。',
    reasoningTitle: '循环推理的本质是观察驱动',
    reasoningBody:
      'Agent 每一轮都在做同一件事：基于当前观察，选择下一步动作。工具结果可能证明假设错误，也可能暴露新文件、新错误、新权限问题。运行时不需要提前知道完整计划，它只要保证每次观察都被正确回填，模型就能把任务拆成一串可验证的小步。',
    planCards: [
      ['Plan', '把目标变成下一步可执行动作'],
      ['Act', '调用 Bash、文件编辑、MCP、子 Agent 等工具'],
      ['Observe', '把 stdout、diff、错误、附件重新写回上下文'],
    ],
    takeawaysTitle: '读完 Claude Code 源码后，我带走的架构判断',
    takeaways: [
      '第一，Agent 的产品体验主要由运行时决定，不只由模型决定。模型会提出工具调用，但权限提示是否清晰、并发是否安全、错误是否能恢复、上下文是否被压缩得足够保真，都是工程系统的责任。',
      '第二，工具返回值必须被当成 prompt 资产管理。输出太长要截断或落盘，重要摘要要保留，低价值噪声要被替换，否则长任务会被自己的观察结果淹没。',
      '第三，循环推理需要明确的终止条件。没有工具调用时可以结束；hook 阻塞时要重试；token 或 prompt-too-long 错误可以恢复，但恢复必须有次数限制。否则 Agent 会从“自主推进”变成“自主空转”。',
    ],
    mapTitle: '架构拆解路径',
    mapBody:
      '我不想把这篇写成源码导览，所以没有逐个列文件路径。下面这条线索更接近我读完后的理解：把运行时拆成几个层次，再看它们怎样接住一次 Agent 调用。',
    architectureMap: [
      [
        '主循环',
        '把一次用户请求扩展成多轮模型请求、工具执行和状态回填。',
        '先看这里，才能理解 Agent 为什么不是“一问一答”。',
      ],
      [
        '工具协议',
        '定义工具的输入 schema、权限检查、只读/破坏性判断和结果格式。',
        '它决定模型能碰什么、怎么碰、失败时如何反馈。',
      ],
      [
        '工具编排',
        '把可并发的只读工具批量执行，把会改变状态的工具串行执行。',
        '这层保证速度和安全边界不会互相牺牲。',
      ],
      [
        '单次工具调用',
        '负责输入校验、权限流、hook、进度事件、错误包装和 tool_result 生成。',
        '这是模型意图进入真实系统前的最后一道运行时闸门。',
      ],
      [
        '上下文治理',
        '通过工具结果预算、摘要压缩、恢复重试和 session memory 控制上下文增长。',
        '长任务能不能继续推进，主要取决于这一层是否保真。',
      ],
    ],
  },
  en: {
    back: 'Back home',
    eyebrow: 'Runtime Anatomy / Claude Code source notes',
    title: 'Agents are not chatbots. They are runtimes that keep reconnecting the loop.',
    intro:
      'I recently spent time reading through the source of Claude Code-style agent tooling. The interesting part is not whether the model can answer. It is how the runtime turns the model’s next intent into action: call a tool, collect the result, reshape the context, and continue reasoning. This article focuses on three mechanisms: tool use, context management, and looped reasoning.',
    thesis: 'The LLM decides the next move. The runtime makes that move real.',
    steps: [
      {
        label: '1. Model',
        title: 'The model proposes the next intent',
        body: 'It may emit text, or it may emit a structured tool_use block. The runtime treats that as an action request, not as the final answer.',
      },
      {
        label: '2. Tool',
        title: 'The tool layer touches the real world',
        body: 'Tool definitions handle schema validation, permission checks, concurrency policy, error wrapping, and conversion back into tool_result.',
      },
      {
        label: '3. Context',
        title: 'The context is rebuilt',
        body: 'Assistant messages, tool results, attachments, memory, and compaction boundaries are assembled into the next model request.',
      },
      {
        label: '4. Loop',
        title: 'Reasoning continues until no tool is needed',
        body: 'As long as the turn produces tool calls, the runtime continues. The turn ends only when there is no tool_use, blocking hook, or recovery retry.',
      },
    ],
    loopTitle: 'The life of one agentic turn',
    loopBody:
      'A normal chat model feels like one user message followed by one assistant answer. An agent runtime works differently. After the user gives a goal, the runtime enters a loop. Each iteration sends the current messages, system prompt, tool definitions, and context state to the model. If the model returns a tool call, the runtime pauses the answer, executes the tool, then feeds the result back into the next model request.',
    stateLead: 'The crucial line is',
    stateBody:
      'The continuity of an agent does not come from model memory. It comes from the runtime carefully feeding every observation back into the next input. Each model call starts from a freshly prepared scene, and that scene is assembled by the runtime.',
    toolTitle: 'A tool call is not just a function call',
    toolBody:
      'From the model’s point of view, a tool looks like a JSON function. From the runtime’s point of view, it is a controlled execution protocol. It must be discovered, validated, authorized, routed through hooks, and only then allowed to touch files, shell commands, MCP servers, or network resources.',
    toolStages: [
      'Discover tool',
      'Parse input',
      'Validate schema',
      'Check permission',
      'Execute / coordinate',
      'Wrap tool_result',
      'Feed context back',
    ],
    contextTitle: 'Context is not chat history. It is a workbench.',
    contextBody:
      'In a long task, the context window is usually consumed not by the user’s request, but by tool results, file contents, attachments, memory, and intermediate traces. Reading Claude Code’s source makes this clear: context management is not a single feature, but a layered system of result budgeting, micro-compaction, auto-compaction, reactive compaction, and session memory. The goal is not merely to save tokens; it is to preserve the scene needed for the next step.',
    contextCaption: 'Conceptual distribution, not measured token usage',
    compactBody:
      'Auto-compaction behaves a lot like memory management. The runtime estimates token usage, compares it with the effective model window, reserved output space, and buffer, then folds history into a summary when the threshold is crossed. If compaction keeps failing, a circuit breaker prevents every future turn from wasting another doomed API call.',
    reasoningTitle: 'Looped reasoning is observation-driven',
    reasoningBody:
      'Every agent iteration does the same thing: choose the next action from the latest observation. Tool results may disprove an assumption, reveal a new file, expose a new error, or hit a permission boundary. The runtime does not need to know the entire plan upfront. It only needs to feed observations back correctly so the model can decompose the task into verifiable steps.',
    planCards: [
      ['Plan', 'Turn the goal into the next executable action'],
      ['Act', 'Call Bash, file editing, MCP, sub-agents, and other tools'],
      ['Observe', 'Feed stdout, diffs, errors, and attachments back into context'],
    ],
    takeawaysTitle: 'Architecture judgments I took from reading Claude Code',
    takeaways: [
      'First, the agent product experience is mostly shaped by the runtime, not only by the model. The model may propose tool calls, but clear permissions, safe concurrency, recoverable errors, and faithful context compression are engineering responsibilities.',
      'Second, tool results must be managed as prompt assets. Long outputs need truncation or persistence, important summaries must survive, and low-value noise must be replaced before the agent drowns in its own observations.',
      'Third, looped reasoning needs explicit stop conditions. No tool call can mean completion; blocking hooks can trigger retries; token and prompt-too-long errors may be recoverable, but recovery must be bounded. Otherwise autonomy becomes a spin loop.',
    ],
    mapTitle: 'Architecture Breakdown Path',
    mapBody:
      'I did not want this piece to become a source-code tour, so I am not walking through file paths one by one. This path is closer to what I took from the reading: split the runtime into layers, then look at how those layers carry one agent call.',
    architectureMap: [
      [
        'Main loop',
        'Expands one user request into multiple model calls, tool executions, and state updates.',
        'Start here to understand why an agent is not a single request-response exchange.',
      ],
      [
        'Tool protocol',
        'Defines input schemas, permission checks, read-only/destructive classification, and result shape.',
        'This layer decides what the model can touch, how it touches it, and how failures return.',
      ],
      [
        'Tool orchestration',
        'Runs concurrency-safe read tools in batches while serializing tools that mutate state.',
        'This layer keeps speed and safety from undermining each other.',
      ],
      [
        'Single tool execution',
        'Handles validation, permissions, hooks, progress events, error wrapping, and tool_result creation.',
        'This is the last runtime gate before model intent reaches the real system.',
      ],
      [
        'Context governance',
        'Controls context growth through result budgets, summarization, recovery retries, and session memory.',
        'Long-running tasks mostly depend on how faithfully this layer preserves state.',
      ],
    ],
  },
} as const;

export default function AgentRuntimeArticle({ locale }: Props) {
  const isEnglish = locale === 'en';
  const copy = isEnglish ? articleCopy.en : articleCopy.zh;
  const backHref = `/${isEnglish ? 'en' : 'zh'}`;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#171717] dark:bg-[#050505] dark:text-[#ededed] font-[family-name:var(--font-geist-sans)]">
      <SiteNav />

      <article className="pt-24">
        <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
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
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <span className="rounded-md bg-[#0a72ef]/10 px-2 py-2 text-[#0a72ef]">reason</span>
              <span className="rounded-md bg-[#ff5b4f]/10 px-2 py-2 text-[#ff5b4f]">act</span>
              <span className="rounded-md bg-[#16a34a]/10 px-2 py-2 text-[#16a34a]">observe</span>
            </div>
          </aside>
        </section>

        <section className="border-y border-black/10 bg-white py-12 dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid gap-4 md:grid-cols-4">
              {copy.steps.map((step, index) => (
                <div
                  key={step.label}
                  className="rounded-lg border border-black/10 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${stepAccents[index]}`}
                  >
                    {step.label}
                  </span>
                  <h2 className="mt-5 text-lg font-semibold">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#0a72ef]">01 / Loop</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.loopTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.loopBody}
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-[#11111b] text-[#cdd6f4] dark:border-[#313244]">
            <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-4 py-3 text-xs text-[#a6adc8]">
              <span>query loop sketch</span>
              <span>src/query.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7">
              <code className="font-[family-name:var(--font-geist-mono)]">
                <span className="text-[#f38ba8]">let</span>{' '}
                <span className="text-[#fab387]">state</span>{' '}
                <span className="text-[#f38ba8]">=</span> {'{'}
                {'\n'}
                {'  '}
                <span className="text-[#89b4fa]">messages</span>:{' '}
                <span className="text-[#fab387]">initialMessages</span>,{'\n'}
                {'  '}
                <span className="text-[#89b4fa]">toolUseContext</span>:{' '}
                <span className="text-[#fab387]">initialToolUseContext</span>,{'\n'}
                {'  '}
                <span className="text-[#89b4fa]">turnCount</span>:{' '}
                <span className="text-[#fab387]">1</span>,{'\n'}
                {'}'}
                {'\n\n'}
                <span className="text-[#f38ba8]">while</span>{' '}
                <span className="text-[#cba6f7]">(</span>
                <span className="text-[#89b4fa]">true</span>
                <span className="text-[#cba6f7]">)</span> {'{'}
                {'\n'}
                {'  '}
                <span className="text-[#f38ba8]">const</span>{' '}
                <span className="text-[#cdd6f4]">{'{'}</span>{' '}
                <span className="text-[#fab387]">messages</span>,{' '}
                <span className="text-[#fab387]">toolUseContext</span>,{' '}
                <span className="text-[#fab387]">turnCount</span>{' '}
                <span className="text-[#cdd6f4]">{'}'}</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#fab387]">state</span>
                {'\n\n'}
                {'  '}
                <span className="text-[#fab387]">messagesForQuery</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#cba6f7]">compactAndPrepare</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#fab387]">messages</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n'}
                {'  '}
                <span className="text-[#fab387]">assistantMessages</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#cba6f7]">streamModel</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#fab387]">messagesForQuery</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n\n'}
                {'  '}
                <span className="text-[#f38ba8]">if</span> <span className="text-[#cba6f7]">(</span>
                !<span className="text-[#fab387]">assistantMessages</span>
                <span className="text-[#cdd6f4]">.</span>
                <span className="text-[#89b4fa]">hasToolUse</span>
                <span className="text-[#cba6f7]">)</span> {'{'}
                {'\n'}
                {'    '}
                <span className="text-[#f38ba8]">return</span>{' '}
                <span className="text-[#fab387]">completed</span>
                {'\n'}
                {'  }'}
                {'\n\n'}
                {'  '}
                <span className="text-[#fab387]">toolResults</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#cba6f7]">runTools</span>
                <span className="text-[#cdd6f4]">(</span>
                <span className="text-[#fab387]">assistantMessages</span>
                <span className="text-[#cdd6f4]">.</span>
                <span className="text-[#89b4fa]">toolUseBlocks</span>
                <span className="text-[#cdd6f4]">)</span>
                {'\n'}
                {'  '}
                <span className="text-[#fab387]">attachments</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#cba6f7]">collectMemoryAndNotifications</span>
                <span className="text-[#cdd6f4]">()</span>
                {'\n\n'}
                {'  '}
                <span className="text-[#f38ba8]">const</span>{' '}
                <span className="text-[#fab387]">nextTurnCount</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#fab387]">turnCount</span>{' '}
                <span className="text-[#f38ba8]">+</span> <span className="text-[#fab387]">1</span>
                {'\n\n'}
                {'  '}
                <span className="text-[#f38ba8]">if</span> <span className="text-[#cba6f7]">(</span>
                <span className="text-[#fab387]">maxTurns</span>{' '}
                <span className="text-[#f38ba8]">&amp;&amp;</span>{' '}
                <span className="text-[#fab387]">nextTurnCount</span>{' '}
                <span className="text-[#f38ba8]">&gt;</span>{' '}
                <span className="text-[#fab387]">maxTurns</span>
                <span className="text-[#cba6f7]">)</span> {'{'}
                {'\n'}
                {'    '}
                <span className="text-[#f38ba8]">return</span>{' '}
                <span className="text-[#fab387]">maxTurnsReached</span>
                {'\n'}
                {'  }'}
                {'\n\n'}
                {'  '}
                <span className="text-[#f38ba8]">const</span>{' '}
                <span className="text-[#fab387]">next</span>{' '}
                <span className="text-[#f38ba8]">=</span> {'{'}
                {'\n'}
                {'    '}
                <span className="text-[#89b4fa]">messages</span>: [{'\n'}
                {'      '}
                <span className="text-[#6c7086]">...</span>
                <span className="text-[#fab387]">messagesForQuery</span>,{'\n'}
                {'      '}
                <span className="text-[#6c7086]">...</span>
                <span className="text-[#fab387]">assistantMessages</span>,{'\n'}
                {'      '}
                <span className="text-[#6c7086]">...</span>
                <span className="text-[#fab387]">toolResults</span>,{'\n'}
                {'      '}
                <span className="text-[#6c7086]">...</span>
                <span className="text-[#fab387]">attachments</span>,{'\n'}
                {'    '}],
                {'\n'}
                {'    '}
                <span className="text-[#89b4fa]">toolUseContext</span>:{' '}
                <span className="text-[#fab387]">toolUseContext</span>,{'\n'}
                {'    '}
                <span className="text-[#89b4fa]">turnCount</span>:{' '}
                <span className="text-[#fab387]">nextTurnCount</span>,{'\n'}
                {'    '}
                <span className="text-[#89b4fa]">transition</span>:{' '}
                <span className="text-[#a6e3a1]">&apos;next_turn&apos;</span>,{'\n'}
                {'  }'}
                {'\n'}
                {'  '}
                <span className="text-[#fab387]">state</span>{' '}
                <span className="text-[#f38ba8]">=</span>{' '}
                <span className="text-[#fab387]">next</span>
                {'\n'}
                {'}'}
              </code>
            </pre>
          </div>

          <p className="mt-8 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.stateLead}{' '}
            <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">state = next</code>
            {isEnglish ? '. ' : '。'}
            {copy.stateBody}
          </p>
        </section>

        <section className="bg-[#111111] py-16 text-white dark:bg-black">
          <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <p className="text-sm font-semibold text-[#ff5b4f]">02 / Tool use</p>
              <h2 className="mt-3 text-3xl font-semibold">{copy.toolTitle}</h2>
              <p className="mt-5 leading-8 text-[#b8b8b8]">{copy.toolBody}</p>
            </div>

            <div className="grid gap-3">
              {copy.toolStages.map((stage, index) => (
                <div
                  key={stage}
                  className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#111111]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{stage}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-[#ff5b4f]"
                        style={{ width: `${18 + index * 12}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <p className="text-sm font-semibold text-[#16a34a]">03 / Context</p>
          <h2 className="mt-3 text-3xl font-semibold">{copy.contextTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.contextBody}
          </p>

          <div className="mt-8 rounded-lg border border-black/10 bg-white p-5 shadow-[var(--card-shadow)] dark:border-white/10 dark:bg-[#101010]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Context window as a workbench</h3>
              <span className="text-sm text-[#808080]">{copy.contextCaption}</span>
            </div>
            <div className="mt-6 flex h-8 overflow-hidden rounded-md border border-black/10 dark:border-white/10">
              {contextLayers.map(layer => (
                <div
                  key={layer.name}
                  className={`${layer.color}`}
                  style={{ width: layer.value }}
                  title={`${layer.name}: ${layer.value}`}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contextLayers.map(layer => (
                <div key={layer.name} className="flex items-center gap-3 text-sm">
                  <span className={`h-3 w-3 rounded-sm ${layer.color}`} />
                  <span className="text-[#4d4d4d] dark:text-[#b8b8b8]">{layer.name}</span>
                  <span className="ml-auto font-medium">{layer.value}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.compactBody}
          </p>
        </section>

        <section className="border-y border-black/10 bg-white py-16 dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="mx-auto max-w-[920px] px-6">
            <p className="text-sm font-semibold text-[#d97706]">04 / Reasoning</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.reasoningTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
              {copy.reasoningBody}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.planCards.map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-lg border border-black/10 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#666666] dark:text-[#a1a1a1]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[920px] px-6 py-16">
          <h2 className="text-3xl font-semibold">{copy.takeawaysTitle}</h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-[#4d4d4d] dark:text-[#b8b8b8]">
            {copy.takeaways.map(takeaway => (
              <p key={takeaway}>{takeaway}</p>
            ))}
          </div>
        </section>

        <section className="bg-[#0f172a] py-16 text-white">
          <div className="mx-auto max-w-[920px] px-6">
            <h2 className="text-3xl font-semibold">{copy.mapTitle}</h2>
            <p className="mt-4 leading-7 text-[#cbd5e1]">{copy.mapBody}</p>
            <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
              {copy.architectureMap.map(([name, responsibility, reason]) => (
                <div
                  key={name}
                  className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[130px_minmax(0,1fr)]"
                >
                  <span className="font-semibold text-white">{name}</span>
                  <div>
                    <p className="text-sm leading-6 text-[#dbeafe]">{responsibility}</p>
                    <p className="mt-1 text-sm leading-6 text-[#94a3b8]">{reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
