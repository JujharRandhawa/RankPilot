import { scoreContent } from "./scorer";
import { hashString, seededInt } from "./hash";
import { formatKeywordLabel } from "./keywords";

const TONES = ["practical", "authoritative", "friendly", "data-driven"] as const;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateContent(keyword: string, niche?: string) {
  const kw = keyword.trim().toLowerCase();
  const label = formatKeywordLabel(kw);
  const h = hashString(kw);
  const tone = TONES[seededInt(h, 0, TONES.length - 1)];
  const year = 2026;
  const nicheLabel = niche || "digital marketing";

  const outline = [
    `What is ${label}?`,
    `Why ${label} matters in ${year}`,
    `Step-by-step framework for ${label}`,
    `Common mistakes to avoid`,
    `Tools and metrics that matter`,
    `Action checklist and next steps`,
  ];

  const title = `${label}: Complete ${year} Guide for Better Results`;
  const metaTitle = `${label} Guide (${year}) | Strategies That Work`.slice(
    0,
    60
  );
  let metaDescription = `Learn ${kw} with a practical ${tone} framework. Discover tactics, tools, and a checklist to improve rankings and traffic in ${year}.`;
  if (metaDescription.length > 160)
    metaDescription = metaDescription.slice(0, 157) + "...";
  if (metaDescription.length < 120)
    metaDescription += ` Built for ${nicheLabel} teams who want measurable SEO growth.`;

  const body = `# ${title}

${capitalize(kw)} is one of the highest-leverage opportunities in modern ${nicheLabel}. This autonomous-style brief turns keyword intent into a publish-ready draft you can refine and ship.

## What is ${label}?

In simple terms, **${kw}** means attracting qualified visitors by aligning search intent, topical depth, and technical clarity. Teams that treat ${kw} as a system—not a one-off post—compound organic growth faster.

Searchers looking for "${kw}" usually want clarity, proof, and a clear next action. Your content should answer the core question early, then expand into frameworks and examples.

## Why ${label} matters in ${year}

Organic discovery still drives durable traffic without paying for every click. A strong ${kw} presence helps you:

- Capture demand when buyers are actively researching
- Build topical authority around related queries
- Reduce dependency on paid acquisition
- Create assets that keep ranking and converting over time

In competitive niches, thin content loses. Depth, structure, and genuine usefulness win.

## Step-by-step framework for ${label}

### 1. Map intent before you write
Confirm whether "${kw}" is informational, commercial, or transactional. Match the page type: guide, comparison, landing page, or checklist.

### 2. Build a topical outline
Cover definitions, process, pitfalls, tools, and FAQs. Use H2/H3 hierarchy so crawlers and readers both understand structure.

### 3. Draft for scanners and deep readers
Lead with the answer, then support with steps, examples, and lists. Repeat **${kw}** naturally in the introduction, one H2, and the conclusion—never force it.

### 4. Optimize on-page essentials
- Unique title and meta description including ${kw}
- Descriptive internal links to related topics
- Short paragraphs and readable sentences
- Clear CTA aligned with search intent

### 5. Measure and iterate
Track impressions, clicks, average position, and engagement. Refresh underperforming sections every quarter.

## Common mistakes to avoid

1. **Keyword stuffing** — hurts readability and trust.
2. **Ignoring search intent** — ranking a blog when users want a tool page fails.
3. **No internal linking** — orphan pages rarely climb.
4. **Publishing once and forgetting** — SERPs change; content should too.
5. **Weak titles** — if the title is vague, click-through collapses.

## Tools and metrics that matter

For ${kw} campaigns, monitor:

| Metric | Why it matters |
| --- | --- |
| Organic traffic | Overall demand capture |
| Impressions & CTR | Snippet effectiveness |
| Avg. position | Ranking health |
| Engaged time | Content usefulness |
| Conversions | Business impact |

Pair keyword research with content scoring so every draft ships with a measurable SEO baseline.

## Real-world example workflow

Imagine your team picks **${kw}** as a quarterly pillar topic. RankPilot-style automation would:

1. Expand the seed into related keywords and cluster them by intent.
2. Draft a brief with H2 coverage that mirrors SERP patterns.
3. Produce a first-pass article with meta tags already filled.
4. Score the draft, highlight gaps, and push it into the content library.
5. Track simulated rankings and organic traffic after “publish.”

This closed loop — research → generate → score → measure — is what makes the system feel autonomous for demos and coursework evaluations.

## FAQ: ${label}

**Who is this guide for?**  
Marketers, founders, and students who need a practical ${kw} playbook without waiting on expensive tooling.

**How long should the page be?**  
For competitive informational queries, 800–1,500+ words usually provides enough depth. Pair length with clear structure so readers (and crawlers) can scan.

**How often should content be updated?**  
Review quarterly. Update stats, examples, and intros when rankings stall or CTR drops.

**What should I do after publishing?**  
Interlink related pages, share the URL, monitor impressions/clicks, and refresh weak sections based on score suggestions.

## Action checklist and next steps

- [ ] Confirm primary keyword: **${kw}**
- [ ] Finalize outline with at least 4 H2 sections
- [ ] Hit 800–1,500+ words for competitive queries
- [ ] Write meta title (30–60 chars) and description (120–160)
- [ ] Add lists, examples, and a clear CTA
- [ ] Run an SEO score check and fix top suggestions
- [ ] Publish, interlink, and schedule a refresh
- [ ] Compare opportunity keywords and plan the next cluster

When you treat ${kw} as a repeatable system, each new page strengthens topical authority instead of starting from zero.

---

*Generated by RankPilot Content Engine (${tone} tone) — demo mode uses simulated research signals for college/viva presentation without paid API keys.*
`;

  const scored = scoreContent({
    keyword: kw,
    title,
    metaTitle,
    metaDescription,
    body,
    outline,
  });

  return {
    keyword: kw,
    title,
    metaTitle,
    metaDescription,
    outline,
    body,
    wordCount: scored.wordCount,
    seoScore: scored.total,
    scoreBreakdown: {
      keywordUsage: scored.keywordUsage,
      structure: scored.structure,
      readability: scored.readability,
      meta: scored.meta,
      length: scored.length,
      suggestions: scored.suggestions,
    },
  };
}
