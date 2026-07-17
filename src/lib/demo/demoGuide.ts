// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Guided Demo — Sprint 12.1
//
// Typed, presenter-led walkthrough definitions. DATA ONLY — no React, no state,
// no side effects, no network. Consumed by the isolated Guided Demo surfaces
// inside /demo/**. Every field is illustrative sales-support copy.
// ─────────────────────────────────────────────────────────────────────────────

import { DemoView } from '@/lib/demo/navigation';

export interface DemoGuideStep {
  /** 1-based step number (matches the presenter bar). */
  id: number;
  title: string;
  shortTitle: string;
  /** Internal demo view the presenter should be showing. */
  view: DemoView;
  durationMinutes: number;
  objective: string;
  presenterPrompt: string;
  talkingPoints: string[];
  avoidTopics: string[];
  clientTakeaway: string;
  checklist: string[];
  recommendedActions: string[];
  /** Human description of when the step is "done" (never enforced). */
  completionCondition: string;
  closingLine: string;
  /** Optional single quotable line for high-impact steps. */
  keyLine?: string;
}

// ─── Deployment paths & closing prompts (Step 8) ─────────────────────────────

export interface DemoDeploymentPath {
  id: string;
  name: string;
  description: string;
}

export const DEMO_DEPLOYMENT_PATHS: DemoDeploymentPath[] = [
  {
    id: 'saas',
    name: 'Cloud SaaS',
    description: 'Managed multi-tenant deployment. Fastest path to a live branded portal.',
  },
  {
    id: 'private-cloud',
    name: 'Private Cloud',
    description: 'Isolated single-tenant environment in your preferred cloud region.',
  },
  {
    id: 'on-premise',
    name: 'On-Premise',
    description: 'Deployed inside your own infrastructure for maximum data control.',
  },
  {
    id: 'perpetual',
    name: 'Perpetual Enterprise License',
    description:
      'Perpetual software license with dedicated infrastructure and optional source-code transfer.',
  },
];

export const DEMO_CLOSING_QUESTIONS: string[] = [
  'Which deployment model best fits your organization?',
  'How many assets do you expect to manage?',
  'Which jurisdictions are in scope?',
  'Do you require full white-label ownership?',
  'Do you need dedicated infrastructure or source-code access?',
  'Who would participate in a technical discovery session?',
];

// ─── The 8 guided steps ──────────────────────────────────────────────────────

export const DEMO_GUIDE_STEPS: DemoGuideStep[] = [
  {
    id: 1,
    title: 'Executive Dashboard',
    shortTitle: 'Dashboard',
    view: 'dashboard',
    durationMinutes: 2,
    objective:
      'Establish immediate enterprise value and show that management can understand the full portfolio from one executive screen.',
    presenterPrompt: 'Start with business outcomes, not technology.',
    talkingPoints: [
      'Meridian Capital AG operates five tokenized real-estate offerings.',
      '€35.84M in assets under management.',
      '580 verified investors.',
      '8.4% weighted target return.',
      'Portfolio health and compliance readiness are visible immediately.',
      'Requires Attention and Recommended Next Actions turn data into operational priorities.',
    ],
    avoidTopics: [
      'React',
      'Next.js',
      'Blockchain implementation',
      'Smart-contract details',
      'Explaining every card',
    ],
    clientTakeaway:
      'ChainX gives management one operational view of the complete digital-asset portfolio.',
    checklist: [
      'Let the AUM counters and charts animate',
      'Scroll slowly through Requires Attention',
      'Point out Recent Activity',
    ],
    recommendedActions: [
      'Allow the AUM counters and charts to animate',
      'Scroll slowly through Requires Attention and Recent Activity',
    ],
    completionCondition: 'Presenter has walked through the executive summary and priorities.',
    closingLine:
      'Management can understand portfolio performance, risk and priorities without navigating multiple systems.',
  },
  {
    id: 2,
    title: 'Tokenized Projects',
    shortTitle: 'Projects',
    view: 'projects',
    durationMinutes: 2,
    objective: 'Show that each asset has a complete operational lifecycle.',
    presenterPrompt: 'Open Zurich Residential Portfolio.',
    talkingPoints: [
      'Each offering has its own operational workspace.',
      'Capital raised, hard cap, target return and investors are visible.',
      'The funding lifecycle is traceable.',
      'Documentation, activity and investor distribution remain centralized.',
      'ERC-3643 is presented as the compliance standard, not as a technical novelty.',
    ],
    avoidTopics: ['Low-level token mechanics', 'Chain internals'],
    clientTakeaway:
      'Every offering can be managed from onboarding through funding, reporting and distributions.',
    checklist: [
      'Open Zurich Residential Portfolio',
      'Pause on funding progress',
      'Show timeline and documents',
      'Show recent activity',
      'Return to Projects',
    ],
    recommendedActions: [
      'Navigate to Projects',
      'Open Zurich Residential Portfolio',
      'Pause on funding progress',
      'Show timeline, documents and recent activity',
      'Return to Projects',
    ],
    completionCondition: 'Presenter has opened a project and shown its lifecycle.',
    closingLine:
      'The platform does not end when an asset is issued; it manages the full lifecycle.',
  },
  {
    id: 3,
    title: 'Investor Operations',
    shortTitle: 'Investors',
    view: 'investors',
    durationMinutes: 1,
    objective: 'Explain institutional investor administration and KYC lifecycle management.',
    presenterPrompt: 'Focus on governance and operational control.',
    talkingPoints: [
      'Verified, pending and expired KYC states.',
      'Institutional investors across multiple jurisdictions.',
      'Centralized identity and compliance records.',
      'Clear operational status for investor relations and compliance teams.',
    ],
    avoidTopics: [
      'Describing KYC as performed by ChainX',
      'Suggesting ChainX is the regulated operator',
      'Implying legal or regulatory approval',
    ],
    clientTakeaway:
      'The licensed operator maintains control while ChainX provides the technology infrastructure.',
    checklist: [
      'Point out KYC states',
      'Highlight jurisdiction spread',
      'Note centralized compliance records',
    ],
    recommendedActions: ['Review the investor table', 'Highlight KYC states and jurisdictions'],
    completionCondition: 'Presenter has explained investor administration and KYC lifecycle.',
    closingLine:
      'The platform makes investor readiness visible without replacing the organization’s compliance responsibilities.',
  },
  {
    id: 4,
    title: 'Executive Analytics',
    shortTitle: 'Analytics',
    view: 'analytics',
    durationMinutes: 1.5,
    objective: 'Show board-ready portfolio intelligence.',
    presenterPrompt: 'Explain the decisions the charts support, not how the charts work.',
    talkingPoints: [
      'Capital deployment.',
      'Investor growth.',
      'Monthly distributions.',
      'Portfolio allocation.',
      'Jurisdiction exposure.',
      'KYC composition.',
      'Compliance score.',
    ],
    avoidTopics: ['Charting library details', 'Data pipeline internals'],
    clientTakeaway:
      'Management, compliance and investor-relations teams work from one consistent data model.',
    checklist: ['Walk the trend charts', 'Show composition charts', 'Note the compliance score'],
    recommendedActions: ['Walk the trend and composition charts', 'Reference the compliance score'],
    completionCondition: 'Presenter has framed the analytics as board-ready intelligence.',
    closingLine:
      'A director can understand exposure, performance and compliance status in under a minute.',
  },
  {
    id: 5,
    title: 'AI Copilot',
    shortTitle: 'AI Copilot',
    view: 'aiCopilot',
    durationMinutes: 2,
    objective: 'Demonstrate differentiated institutional intelligence.',
    presenterPrompt: 'Use the suggested prompts and allow the interface to speak for itself.',
    talkingPoints: [
      'The Copilot is grounded on portfolio data.',
      'It helps surface relevant information faster.',
      'It supports portfolio, compliance and reporting workflows.',
      'It does not replace human decision-making.',
      'Outputs in the demo are illustrative.',
    ],
    avoidTopics: [
      'Presenting AI output as advice',
      'Claiming autonomous decision-making',
      'Implying live data',
    ],
    clientTakeaway: 'ChainX adds an intelligence layer over the operational platform.',
    checklist: [
      'Try “Show projects needing attention”',
      'Try “Summarize portfolio risk”',
      'Try “Generate executive dashboard” or a quarterly report',
    ],
    recommendedActions: [
      'Show projects needing attention',
      'Summarize portfolio risk',
      'Generate executive dashboard or quarterly investor report',
    ],
    completionCondition: 'Presenter has run the recommended prompts.',
    closingLine:
      'The value is not generic chat; it is faster access to institutional portfolio context.',
    keyLine:
      'The AI does not replace the manager. It reduces the time required to find and interpret critical information.',
  },
  {
    id: 6,
    title: 'White-Label Branding',
    shortTitle: 'Branding',
    view: 'branding',
    durationMinutes: 1.5,
    objective: 'Make the prospect imagine the platform as their own.',
    presenterPrompt: 'This is the emotional sales moment. Slow down.',
    talkingPoints: [
      'Client logo.',
      'Client legal and display name.',
      'Custom domain.',
      'Color system.',
      'Desktop investor portal.',
      'Mobile investor portal.',
      'Branded investor communications.',
    ],
    avoidTopics: ['Implementation of theming', 'CSS or design-token internals'],
    clientTakeaway: 'The platform becomes the buyer’s branded digital-investment infrastructure.',
    checklist: [
      'Show desktop portal preview',
      'Show mobile preview',
      'Show branded email',
      'Deliver the required presenter line',
    ],
    recommendedActions: [
      'Walk desktop and mobile investor portal previews',
      'Show branded investor communications',
    ],
    completionCondition: 'Presenter has framed the platform as the buyer’s own brand.',
    closingLine: 'ChainX provides the infrastructure; the market experiences your brand.',
    keyLine:
      'The end investor does not need to see ChainX. They see your organization, your domain and your investor experience.',
  },
  {
    id: 7,
    title: 'Enterprise Governance',
    shortTitle: 'Enterprise',
    view: 'vault',
    durationMinutes: 1,
    objective: 'Create a natural path from Business to Enterprise without aggressive upselling.',
    presenterPrompt: 'Frame Enterprise as an evolution, not an upsell.',
    talkingPoints: [
      'Enterprise capabilities support organizations with greater governance, infrastructure and regulatory requirements.',
      'Features are enabled according to the selected commercial and deployment model.',
      'Possible deployment models include managed SaaS, private cloud, on-premise and enterprise licensing.',
      'Capabilities include Vault, Advanced MiCA Reporting, Digital Signature and Dedicated Infrastructure.',
    ],
    avoidTopics: [
      'Claiming automatic regulatory compliance',
      'Guaranteed MiCA readiness',
      'Aggressive “upgrade now” language',
      'Displaying perpetual-license pricing',
    ],
    clientTakeaway:
      'The platform can scale from a Business deployment to institutional infrastructure.',
    checklist: [
      'Reference Vault and Dedicated Infrastructure',
      'Mention Advanced MiCA Reporting and Digital Signature',
      'Keep the tone consultative',
    ],
    recommendedActions: [
      'Show an Enterprise capability overview',
      'Explain deployment-model driven entitlement',
    ],
    completionCondition: 'Presenter has positioned the Enterprise evolution path.',
    closingLine:
      'The architecture can evolve with the organization’s governance and deployment requirements.',
  },
  {
    id: 8,
    title: 'Commercial Closing',
    shortTitle: 'Closing',
    view: 'dashboard',
    durationMinutes: 1,
    objective: 'Convert the walkthrough into a concrete next conversation.',
    presenterPrompt: 'Ask, then listen. Let the prospect define scope.',
    talkingPoints: [
      'Recap: one operational view, full asset lifecycle, investor operations, board-ready analytics, an intelligence layer and full white-label ownership.',
      'ChainX can be adopted according to scale, governance and ownership requirements.',
    ],
    avoidTopics: ['Generating a proposal', 'Collecting data', 'Quoting perpetual-license pricing'],
    clientTakeaway:
      'ChainX can be adopted according to the organization’s scale, governance and ownership requirements.',
    checklist: [
      'Confirm the preferred deployment model',
      'Confirm asset volume and jurisdictions',
      'Agree the participants for a discovery session',
    ],
    recommendedActions: ['Walk the four deployment paths', 'Ask the closing questions'],
    completionCondition: 'Presenter has proposed a private consultation.',
    closingLine:
      'ChainX can be adopted according to the organization’s scale, governance and ownership requirements.',
  },
];

export const DEMO_GUIDE_TOTAL_STEPS = DEMO_GUIDE_STEPS.length;

export const DEMO_GUIDE_TOTAL_MINUTES = Math.round(
  DEMO_GUIDE_STEPS.reduce((sum, s) => sum + s.durationMinutes, 0)
);

/** Plans on which the guided presentation is offered directly. */
export function isGuideOfferedFor(plan: string): boolean {
  return plan === 'business' || plan === 'enterprise';
}
