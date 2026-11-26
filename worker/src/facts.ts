/**
 * The analyst's only knowledge: the same public data the site renders, read straight from src/data,
 * so the two can never disagree. Anything gated by JNJ_PUBLIC stays out until the employer approves it.
 */
import { JNJ_PUBLIC } from '../../src/data/disclosure';
import { letter, kpis, milestones, sourceNames, type SourceId } from '../../src/data/report';
import { cases, segments } from '../../src/data/segments';
import { inv, steps } from '../../src/data/investigation';
import tree from '../../src/data/bpn-tree.json';

const strip = (s: string) => s.replace(/\[n:[A-Z-]+\]/g, '');
const pub = <T extends { jnj?: boolean }>(xs: T[]) => xs.filter((x) => JNJ_PUBLIC || !x.jnj);

const identity = `## [ID] Identity
- Name: Sergio Andrés González Mateus. Based in Bogotá, Colombia.
- Studies Systems and Computing Engineering at Universidad de los Andes (Uniandes) since 2022; average 4.21 out of 5.
- Looking for roles in AI/ML, cybersecurity, and business/compliance.
- Positioning: an engineer who builds AI and understands compliance, risk and business.
- Languages: Spanish (native), English (B2, professional).
- Not on record (say so if asked): graduation date or status, salary expectations, availability date, visa or relocation, phone, email.`;

const education = `## [EDU] Education
- Universidad de los Andes, Bogotá: B.Sc. Systems and Computing Engineering, from 2022. Courses include data structures and algorithms, databases, operating systems, software engineering, networks, probability and statistics, intro to machine learning, web development and business intelligence.
- Exchange at Universidad Politécnica de Madrid (UPM), Feb–Jun 2025: computer networks, computational photography, data warehouse architecture, information theory and coding, AI and open science in research software engineering.
- University of Pennsylvania, IAPS Summer A 2025, on a Banco Santander scholarship: professional English, leadership and team building, innovation and technology.
- Has studied in three countries: Colombia, Spain and the United States.`;

const security = `## [SEC] Security
- Capstone (Uniandes): a forensic evidence system for Colombian banking, built with a classmate and doctoral researchers. Next.js, NestJS, PostgreSQL, MinIO; every file is hashed and timestamped on arrival, access is role-based, every action is audit-logged. Status and partner names are not on record.
- Google Cybersecurity Certificate (Coursera, 2024). TryHackMe Pre Security (7 h) and Cyber Security 101 (45 h), 2025: tryhackme.com/p/xSergonMx. Cloud Architecture Bootcamp, intermediate, Talento Tech (159 h, 2024).
- Labs with Kali, Wireshark, Burp Suite, Splunk and SIEM tooling.`;

const tess = `## [EXP-TESS] Tess Adviser, web developer (Feb–Dec 2024)
- Responsive client websites with HTML, CSS, JavaScript, WordPress and Astro; payment gateways, forms, analytics and external services, configured with data privacy and secure settings in mind. No impact figures are on record.`;

const jnj = `## [EXP-JNJ] Johnson & Johnson Innovative Medicine, Health Care Compliance LAN intern (Jan 2026–present)
- Automated about 900 healthcare-professional profile updates with Power Automate; 70 colleagues involved; processing time cut by 92–97%.
- A dashboard for minor deviations, and improvements to a deviation reporting app used across Latin America.
- Contributed to three AI agents: a Copilot Studio agent for compliance documentation, an analytics agent for training and deviation data, and an agent that guides Compliance Officers through approval-process changes.
- Tools: Power Apps, Power Automate, Copilot Studio, SharePoint, Power BI, Qlik, Tableau.
- Never mention internal system names, screenshots, data about healthcare professionals, or any other figure.`;

const risks = `## [RISK] Risk factors (his own list; be candid about them)
1. Has not yet taken an ML model to production with monitoring (MLOps); his models live in notebooks and academic APIs.
2. His offensive-security experience comes from labs, not from real penetration testing.
3. His English is professional B2, not native.
4. No full-time job yet.
5. Few public open-source projects of his own; this portfolio starts to fix that.`;

const contact = `## [IR] Contact
- LinkedIn: linkedin.com/in/sergonm (the best way to reach him). GitHub: github.com/SergonM. TryHackMe: tryhackme.com/p/xSergonMx.
- Never give a phone number or an email address; point to LinkedIn or the contact section of the site.
- Other: tools he uses include Claude Code, Codex, Docker, Linux, AWS, Qlik and Tableau. Volunteer with YMCA (2026).`;

function caseBlock(): string {
  return pub(cases).map((c) => {
    const seg = segments.find((s) => s.id === c.segment)!.name.en;
    return `### Case ${c.id} (${seg}) [${c.source}] ${c.title.en}
- Context: ${c.context.en}. Stack: ${c.stack}.${c.link ? ` Link: ${c.link}` : ''}
- Headline: ${c.kpi.value.en} ${c.kpi.label.en}.
- Problem: ${c.problem.en}
- What was done: ${c.decision.en}
- Result: ${c.result.en}
- Lesson: ${c.learning.en}`;
  }).join('\n');
}

function investigationBlock(): string {
  const m = (tree as any).metrics;
  return `## [PRJ-NEO] Featured investigation: ${inv.title.en}
- ${inv.byline.en}. ${inv.lede.en}
${steps.map((s) => `- ${s.title.en} ${s.body.en}${s.note ? ` (${s.note.en})` : ''}`).join('\n')}
- The site's "what if" simulator is a separate, new decision tree trained for this portfolio on ${(tree as any).births.toLocaleString('en-US')} DANE births from ${(tree as any).years.join(', ')}: held-out AUC ${m.auc}; the riskiest fifth of groups had ${Math.round(m.top_fifth_rate * 100)} underweight babies per 100 vs ${Math.round(m.bottom_fifth_rate * 100)} in the safest fifth. Twins dominate the tree; prenatal check-ups come next; schooling and area barely move it once the rest is known. Gestation weeks were excluded on purpose.`;
}

export function buildFacts(): string {
  const highlights = pub(kpis).map((k) => `- ${k.prefix ?? ''}${k.value}${k.suffix?.en ?? ''} ${k.label.en}${k.note ? ` (${k.note.en})` : ''} [${k.source}]`).join('\n');
  const timeline = pub(milestones).map((m) => `- ${m.when.en}: ${m.title.en}. ${m.body.en} [${m.source}]`).join('\n');
  const letterText = pub(letter.en.body).map((p) => strip(p.text)).join(' ');
  const sources = (Object.keys(sourceNames.en) as SourceId[])
    .filter((id) => JNJ_PUBLIC || id !== 'EXP-JNJ')
    .map((id) => `- [${id}] ${sourceNames.en[id]}`).join('\n');

  return [
    identity, education,
    `## Letter to shareholders (his own words)\n${letterText}`,
    `## Highlights\n${highlights}`,
    `## Timeline\n${timeline}`,
    `## Cases\n${caseBlock()}`,
    investigationBlock(), security, tess, JNJ_PUBLIC ? jnj : '', risks, contact,
    `## Source IDs\n${sources}\n- [PRJ-FC] Computational photography project, UPM 2025.\n- [PRJ-KG] Knowledge graph of scientific papers, UPM 2025, team of 3.`,
  ].filter(Boolean).join('\n\n');
}
