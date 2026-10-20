"use client";

import { useMemo, useState } from "react";

type Tone = "positive" | "negative" | "conflict" | "unknown";
type EvidenceType = "事实" | "推断" | "待验证";

type Evidence = {
  id: string;
  dimension: string;
  tone: Tone;
  type: EvidenceType;
  title: string;
  value: string;
  change: string;
  body: string;
  fields: string[];
  formula?: string;
  source: string;
  sourceName: string;
  asOf: string;
  page: string;
};

const dimensions = ["经营质量", "财务趋势", "估值位置", "行情特征", "行业位置", "重要事件", "风险雷达"];

const evidence: Evidence[] = [
  {
    id: "rev-growth", dimension: "经营质量", tone: "positive", type: "事实",
    title: "收入与利润保持双位数增长", value: "4,564.5 亿元", change: "营业收入同比 +12.11%",
    body: "2025 年营业收入增速低于归母净利润增速，规模扩张同时伴随净利率改善。这里仅描述已披露结果，不把增长外推到下一期。",
    fields: ["2025 营业收入：456,451,731 千元", "2024 营业收入：407,149,600 千元", "2025 归母净利润：约 43,950,000 千元", "同比口径：年报可比数据"],
    formula: "收入同比 = 456,451,731 ÷ 407,149,600 − 1 = 12.11%",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "主要会计数据 / P8"
  },
  {
    id: "cash-gap", dimension: "经营质量", tone: "conflict", type: "推断",
    title: "利润增长，但经营现金流回落", value: "533.5 亿元", change: "经营现金流同比 −11.84%",
    body: "利润与现金流方向背离，是本期最值得继续追问的矛盾。不能据此直接判定盈利质量恶化，需要拆解营运资本、税费和其他经营支出。",
    fields: ["2025 经营现金流净额：53,345,930 千元", "2024 经营现金流净额：60,511,572 千元", "经营现金流入同比：+8.91%", "经营现金流出同比：+12.47%"],
    formula: "现金利润比 = 53,345,930 ÷ 43,950,000 ≈ 1.21×",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "现金流 / P53"
  },
  {
    id: "margin", dimension: "财务趋势", tone: "conflict", type: "事实",
    title: "规模增长快于制造业务毛利", value: "27.93%", change: "制造业毛利率 −0.31pct",
    body: "制造业收入增长 12.85%，但成本增长 13.34%。增长没有同步转化为毛利率扩张；净利润增速更快，需结合费用与财务收入判断来源。",
    fields: ["制造业收入：409,272,424 千元", "制造业成本：294,954,238 千元", "制造业毛利率：27.93%", "毛利率同比：−0.31pct"],
    formula: "毛利率 = (409,272,424 − 294,954,238) ÷ 409,272,424 = 27.93%",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "主营业务分析 / P49"
  },
  {
    id: "rd", dimension: "财务趋势", tone: "negative", type: "事实",
    title: "研发费用率小幅下降", value: "177.9 亿元", change: "研发费用率 −0.09pct",
    body: "研发费用绝对额同比增长 9.58%，但低于收入增速，费用率从 3.99% 降至 3.90%。这是投入强度的边际变化，不等同于创新能力下降。",
    fields: ["2025 研发费用：17,787,624 千元", "2024 研发费用：16,232,771 千元", "研发费用同比：+9.58%", "研发人员：23,926 人"],
    formula: "研发费用率 = 17,787,624 ÷ 456,451,731 = 3.90%",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "研发投入 / P52"
  },
  {
    id: "valuation", dimension: "估值位置", tone: "unknown", type: "待验证",
    title: "单点 PE 可见，历史分位暂不可复核", value: "14.48×", change: "PE(TTM) · 第三方快照",
    body: "估值快照晚于年报、早于当前日期。由于缺少同口径的完整历史序列，本产品拒绝生成“便宜/昂贵”结论，待接入扶摇历史估值后计算分位。",
    fields: ["股价：84.40 元", "PE(TTM)：14.48×", "PB：3.03×", "静态股息率：5.10%"],
    formula: "历史分位 = rank(当前 PE, 同口径 5 年日频 PE)；当前缺少序列",
    source: "https://www.lixinger.com/equity/company/detail/sz/000333/333/fundamental/valuation/pe-ttm",
    sourceName: "理杏仁估值页（演示行情源）", asOf: "2026-09-18", page: "估值快照"
  },
  {
    id: "price", dimension: "行情特征", tone: "unknown", type: "待验证",
    title: "近期行情数据尚未完成同源校验", value: "—", change: "等待扶摇 K 线接口",
    body: "演示环境未取得授权行情接口，不用搜索结果拼接波动率、最大回撤或相对沪深 300 收益，避免不同复权口径混用。",
    fields: ["所需：前复权日 K", "区间：近 20 / 60 / 250 交易日", "基准：沪深 300", "校验：交易日历、停牌、除权"],
    source: "https://fuyao.aicubes.cn/docs/",
    sourceName: "扶摇金融数据 API 文档", asOf: "待接入", page: "行情 / 交易日历"
  },
  {
    id: "overseas", dimension: "行业位置", tone: "positive", type: "事实",
    title: "海外增长快于国内，收入结构继续外移", value: "1,959.5 亿元", change: "海外收入同比 +15.92%",
    body: "海外收入占比升至 42.93%，增速高于国内的 9.40%。这支持“全球化是增长主驱动之一”，但关税、汇率和本地化产能回报仍需单独验证。",
    fields: ["海外收入：195,947,693 千元", "海外收入占比：42.93%", "海外同比：+15.92%", "国内同比：+9.40%"],
    formula: "海外占比 = 195,947,693 ÷ 456,451,731 = 42.93%",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "分地区收入 / P49"
  },
  {
    id: "tob", dimension: "行业位置", tone: "positive", type: "事实",
    title: "ToB 第二曲线增速领先集团", value: "1,227.5 亿元", change: "商业及工业解决方案 +17.47%",
    body: "ToB 增速高于智能家居的 11.28%，其中楼宇科技增长 25.72%。但 ToB 毛利率 20.81%，低于智能家居 29.90%，结构升级尚非单向改善。",
    fields: ["ToB 收入：122,752,958 千元", "ToB 毛利率：20.81%", "智能家居收入：299,927,239 千元", "智能家居毛利率：29.90%"],
    formula: "ToB 收入占比 = 122,752,958 ÷ 456,451,731 = 26.89%",
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "分产品收入 / P49"
  },
  {
    id: "acquisition", dimension: "重要事件", tone: "conflict", type: "推断",
    title: "并购扩张打开空间，也增加整合难度", value: "3 项", change: "跨区域产业并购",
    body: "Arbonia、东芝电梯中国业务与锐珂医疗国际业务扩展 ToB 边界。收入协同是管理层叙事；整合成本、商誉与资本回报仍需后续期次验证。",
    fields: ["事件：完成多项业务收购", "影响维度：ToB / 海外", "已验证：交易与业务并表", "未验证：协同收益与 ROIC"],
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "致股东 / P4"
  },
  {
    id: "tariff", dimension: "风险雷达", tone: "negative", type: "事实",
    title: "海外敞口放大关税与汇率敏感性", value: "42.93%", change: "海外收入占比",
    body: "海外高增长与外部风险来自同一暴露面。年报明确提及关税变化与地缘冲突；但地区利润、自然对冲比例等信息不足，无法量化净影响。",
    fields: ["海外收入占比：42.93%", "海外制造基地：43 个", "海外研发中心：29 个", "缺口：地区利润与币种净敞口"],
    source: "https://www.midea.com.cn/content/dam/mideacn-aem/%E6%8A%95%E8%B5%84%E8%80%85%E5%85%B3%E7%B3%BB/2025%E5%B9%B4%E5%BA%A6%E6%8A%A5%E5%91%8A.pdf.coredownload.inline.pdf",
    sourceName: "美的集团 2025 年年度报告", asOf: "2025-12-31", page: "致股东 / 风险章节"
  },
  {
    id: "peer", dimension: "行业位置", tone: "unknown", type: "待验证",
    title: "同行相对位置缺少同口径数据", value: "—", change: "格力 / 海尔 / 美的",
    body: "业务边界差异较大，简单横比 PE 或净利率会失真。待补齐同一报告期、统一行业分类后的收入增速、毛利率、ROE 与海外占比。",
    fields: ["候选同行：格力电器、海尔智家", "统一期次：2025A", "统一口径：家电业务 / 集团", "缺口：可比业务拆分"],
    source: "https://fuyao.aicubes.cn/docs/",
    sourceName: "扶摇板块成分与财务接口", asOf: "待接入", page: "同行可比"
  }
];

const toneLabel: Record<Tone, string> = { positive: "正面", negative: "负面", conflict: "矛盾", unknown: "未知" };
const toneSymbol: Record<Tone, string> = { positive: "+", negative: "−", conflict: "↔", unknown: "?" };

const prompts = ["利润增长为什么快于收入？", "增长主要由什么驱动？", "当前估值能否判断高低？", "最大的反证是什么？"];

function routeQuestion(q: string) {
  const text = q.trim();
  if (/估值|便宜|贵|PE|市盈/.test(text)) return { dimension: "估值位置", title: "估值结论暂缓：单点可见，位置不可验证", body: "截至 2026-09-18 的第三方快照显示 PE(TTM) 14.48×，但缺少同源历史序列与同行统一口径。系统因此只展示快照，把“高/低”列为待验证，而不生成估值标签。", ids: ["valuation", "peer"] };
  if (/现金|利润|盈利|质量/.test(text)) return { dimension: "经营质量", title: "利润改善成立，但现金流给出反证", body: "收入增长 12.11%、归母净利润约增长 14%，而经营现金流下降 11.84%。确定性计算支持“利润增速更快”，但驱动更可能来自费用与财务收入，而非制造毛利率扩张。", ids: ["rev-growth", "cash-gap", "margin"] };
  if (/风险|反证|担心|下行/.test(text)) return { dimension: "风险雷达", title: "主反证来自现金流、毛利率与海外暴露", body: "现金流回落、制造业毛利率微降，与收入和利润双增构成三角矛盾；同时海外收入占比升至 42.93%，放大关税与汇率不确定性。", ids: ["cash-gap", "margin", "tariff"] };
  if (/行业|同行|格力|海尔/.test(text)) return { dimension: "行业位置", title: "业务结构领先信息较清楚，相对排名仍需补证", body: "海外和 ToB 增速均领先集团，但同行的业务边界不同。当前只能确认美的自身结构变化，不能据此生成行业排名。", ids: ["overseas", "tob", "peer"] };
  return { dimension: "经营质量", title: "增长由海外与 ToB 双轮驱动，质量信号并不单一", body: "海外收入增长 15.92%、ToB 增长 17.47%，均高于集团收入增速；但 ToB 毛利率较低，经营现金流也同比回落。增长来源可验证，增长质量仍需后续期次确认。", ids: ["overseas", "tob", "cash-gap"] };
}

export default function Home() {
  const [dimension, setDimension] = useState("经营质量");
  const [tone, setTone] = useState<Tone | "all">("all");
  const [selected, setSelected] = useState<Evidence | null>(null);
  const [question, setQuestion] = useState("增长主要由什么驱动？");
  const [answer, setAnswer] = useState(routeQuestion("增长主要由什么驱动？"));

  const items = useMemo(() => evidence.filter((item) => item.dimension === dimension && (tone === "all" || item.tone === tone)), [dimension, tone]);
  const counts = useMemo(() => ({
    positive: evidence.filter((e) => e.tone === "positive").length,
    negative: evidence.filter((e) => e.tone === "negative").length,
    conflict: evidence.filter((e) => e.tone === "conflict").length,
    unknown: evidence.filter((e) => e.tone === "unknown").length,
  }), []);

  const ask = (text = question) => {
    const routed = routeQuestion(text);
    setQuestion(text);
    setAnswer(routed);
    setDimension(routed.dimension);
    setTone("all");
  };

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">证</span><span>言证</span><em>YANZHENG</em></div>
        <nav aria-label="主导航"><a href="#diagnosis" className="active">诊断</a><a href="#method">方法</a><a href="#sources">证据库</a></nav>
        <div className="snapshot"><span className="live-dot" /> 演示快照 · 2026-09-18</div>
      </header>

      <section className="hero" id="diagnosis">
        <div className="company-line">
          <div className="company-avatar">M</div>
          <div><div className="eyebrow">深交所 · 白色家电 / 多元制造</div><h1>美的集团 <span>000333.SZ</span></h1></div>
          <div className="price-block"><b>¥84.40</b><span>行情演示快照</span></div>
        </div>

        <div className="question-box">
          <div className="ai-star">✦</div>
          <div className="question-main">
            <label htmlFor="question">问一个关于这家公司的问题</label>
            <div className="question-input">
              <input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} />
              <button onClick={() => ask()} aria-label="开始诊断">开始诊断 <span>→</span></button>
            </div>
            <div className="prompt-row">{prompts.map((p) => <button key={p} onClick={() => ask(p)}>{p}</button>)}</div>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="rail">
          <div className="rail-title">本次诊断维度 <span>7</span></div>
          {dimensions.map((d, i) => (
            <button key={d} className={dimension === d ? "selected" : ""} onClick={() => { setDimension(d); setTone("all"); }}>
              <span className="rail-index">0{i + 1}</span><span>{d}</span><i>{evidence.filter((e) => e.dimension === d).length}</i>
            </button>
          ))}
          <div className="rail-note"><b>选择逻辑</b><p>多元制造公司优先看增长结构、现金转换、分部盈利与全球化暴露。</p></div>
        </aside>

        <div className="content">
          <section className="answer-card">
            <div className="answer-head"><div><span className="tag inference">AI 综合研判</span><span className="confidence">中等置信 · 3 条证据</span></div><button onClick={() => setSelected(evidence.find((e) => e.id === answer.ids[0]) || null)}>查看推理链 ↗</button></div>
            <h2>{answer.title}</h2>
            <p>{answer.body}</p>
            <div className="answer-foot"><span>✦ 已按问题自动选择「{answer.dimension}」视角</span><span>不构成投资建议</span></div>
          </section>

          <section className="signal-grid" aria-label="证据光谱">
            {(Object.keys(counts) as Tone[]).map((t) => (
              <button key={t} className={`signal ${t} ${tone === t ? "picked" : ""}`} onClick={() => setTone(tone === t ? "all" : t)}>
                <span className="signal-symbol">{toneSymbol[t]}</span><div><b>{toneLabel[t]}证据</b><small>{t === "positive" ? "增长与韧性" : t === "negative" ? "边际承压" : t === "conflict" ? "信号不一致" : "数据缺口"}</small></div><strong>{counts[t]}</strong>
              </button>
            ))}
          </section>

          <section className="metric-strip">
            <div><span>2025 营业收入</span><b>4,564.5 亿</b><em className="up">+12.11%</em></div>
            <div><span>归母净利润</span><b>439.5 亿</b><em className="up">约 +14.0%</em></div>
            <div><span>经营现金流</span><b>533.5 亿</b><em className="down">−11.84%</em></div>
            <div><span>海外收入占比</span><b>42.93%</b><em className="up">+1.41pct</em></div>
            <div><span>PE (TTM)</span><b>14.48×</b><em className="muted">快照</em></div>
          </section>

          <section className="evidence-section">
            <div className="section-head"><div><span className="section-kicker">EVIDENCE STREAM</span><h3>{dimension} · 证据流</h3></div><div className="legend"><span><i className="dot fact" />事实</span><span><i className="dot inference-dot" />推断</span><span><i className="dot pending" />待验证</span></div></div>
            <div className="evidence-list">
              {items.length ? items.map((item) => (
                <article key={item.id} className={`evidence-card ${item.tone}`} onClick={() => setSelected(item)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(item)}>
                  <div className="evidence-type"><span className={`tag ${item.type === "事实" ? "fact-tag" : item.type === "推断" ? "inference" : "pending-tag"}`}>{item.type}</span><span className={`tone-label ${item.tone}`}>{toneSymbol[item.tone]} {toneLabel[item.tone]}</span></div>
                  <div className="evidence-copy"><h4>{item.title}</h4><p>{item.body}</p><div className="source-line"><span>来源：{item.sourceName}</span><span>截至 {item.asOf}</span></div></div>
                  <div className="evidence-value"><b>{item.value}</b><span>{item.change}</span><button>展开证据 →</button></div>
                </article>
              )) : <div className="empty"><b>当前筛选下暂无证据</b><p>切换证据类型，或查看其他诊断维度。</p><button onClick={() => setTone("all")}>显示全部</button></div>}
            </div>
          </section>

          <section className="method" id="method">
            <div><span className="section-kicker">HUMAN–AI CONTRACT</span><h3>确定性计算与 AI 解读，各守边界</h3></div>
            <div className="method-flow">
              <div><span>01</span><b>数据层</b><p>原始字段、来源、期次、单位和口径校验</p><small>程序负责</small></div>
              <i>→</i><div><span>02</span><b>计算层</b><p>同比、利润率、分位与同行口径的确定性计算</p><small>程序负责</small></div>
              <i>→</i><div><span>03</span><b>推理层</b><p>问题路由、矛盾识别、解释与待验证清单</p><small>LLM 负责</small></div>
              <i>→</i><div><span>04</span><b>校验层</b><p>引用绑定、数值反查、合规拦截与降级</p><small>规则引擎</small></div>
            </div>
          </section>
        </div>
      </section>

      <footer id="sources"><span>言证 · 证据优先的个股研究工作台</span><span>数据仅用于产品演示，不构成预测、评级或买卖建议</span></footer>

      {selected && <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="证据详情">
        <button className="drawer-mask" onClick={() => setSelected(null)} aria-label="关闭" />
        <aside className="drawer">
          <div className="drawer-top"><div><span className="section-kicker">EVIDENCE TRACE</span><h3>证据详情</h3></div><button onClick={() => setSelected(null)}>×</button></div>
          <div className="trace-path"><span>诊断结论</span><i>→</i><span>{selected.dimension}</span><i>→</i><b>{selected.type}</b></div>
          <div className={`drawer-tone ${selected.tone}`}><span>{toneSymbol[selected.tone]}</span><div><small>{toneLabel[selected.tone]}证据</small><h4>{selected.title}</h4></div></div>
          <div className="drawer-metric"><b>{selected.value}</b><span>{selected.change}</span></div>
          <section><label>分析说明</label><p>{selected.body}</p></section>
          <section><label>原始字段</label><div className="field-table">{selected.fields.map((f, i) => { const parts = f.split("："); return <div key={i}><span>{parts[0]}</span><b>{parts.slice(1).join("：")}</b></div>; })}</div></section>
          {selected.formula && <section><label>计算口径</label><code>{selected.formula}</code></section>}
          <section><label>来源与时点</label><div className="source-card"><div><b>{selected.sourceName}</b><span>{selected.page} · 截至 {selected.asOf}</span></div><a href={selected.source} target="_blank" rel="noreferrer">打开原文 ↗</a></div></section>
          <section className="verify-next"><label>下一步怎么验证</label><p>{selected.tone === "unknown" ? "补齐同源数据后重算；接口失败时保持未知，不用模型常识填空。" : "在下一报告期复查同一字段，并与现金流、分部利润或同行同口径数据交叉验证。"}</p></section>
        </aside>
      </div>}
    </main>
  );
}
