// ─────────────────────────────────────────────────────────────────────────────
// ChainX® Demo Read-Only Guards — Sprint 11.0 Multi-Plan Demo Gateway
//
// Central definition of every write-like action that is SIMULATED in the demo.
// The guard NEVER performs an API write, DB mutation, blockchain call, wallet
// prompt, email send or webhook. It only produces a premium simulation message.
//
// This module is pure data/logic — the visual surface lives in DemoActionGuard.
// ─────────────────────────────────────────────────────────────────────────────

import { DemoPlan, DemoPlanFeatures, requiredDemoPlanFor, DEMO_PLANS } from '@/lib/demo/plans';

export type DemoActionId =
  | 'createProject'
  | 'approveKyc'
  | 'changeUserRole'
  | 'saveBranding'
  | 'registerDomain'
  | 'generateApiKey'
  | 'sendWebhook'
  | 'withdrawFunds'
  | 'bridgeAssets'
  | 'deployToken'
  | 'signDocument'
  | 'executeDistribution'
  | 'connectVault'
  | 'deleteDocument';

export interface DemoActionMeta {
  id: DemoActionId;
  label: string;
  /** Feature this action belongs to (used to detect upgrade-gated actions). */
  feature?: keyof DemoPlanFeatures;
}

export const DEMO_ACTIONS: Record<DemoActionId, DemoActionMeta> = {
  createProject: { id: 'createProject', label: 'Create project', feature: 'projects' },
  approveKyc: { id: 'approveKyc', label: 'Approve KYC', feature: 'kyc' },
  changeUserRole: { id: 'changeUserRole', label: 'Change user role', feature: 'usersAndRoles' },
  saveBranding: { id: 'saveBranding', label: 'Save branding', feature: 'fullBranding' },
  registerDomain: { id: 'registerDomain', label: 'Register domain', feature: 'customDomain' },
  generateApiKey: { id: 'generateApiKey', label: 'Generate API key', feature: 'api' },
  sendWebhook: { id: 'sendWebhook', label: 'Send webhook', feature: 'webhooks' },
  withdrawFunds: { id: 'withdrawFunds', label: 'Withdraw funds', feature: 'payments' },
  bridgeAssets: { id: 'bridgeAssets', label: 'Bridge assets', feature: 'bridge' },
  deployToken: { id: 'deployToken', label: 'Deploy token', feature: 'projects' },
  signDocument: { id: 'signDocument', label: 'Sign document', feature: 'digitalSignature' },
  executeDistribution: {
    id: 'executeDistribution',
    label: 'Execute distribution',
    feature: 'payments',
  },
  connectVault: { id: 'connectVault', label: 'Connect Vault', feature: 'vault' },
  deleteDocument: { id: 'deleteDocument', label: 'Delete document', feature: 'documents' },
};

export interface DemoGuardMessage {
  variant: 'simulated' | 'upgrade';
  title: string;
  body: string;
  /** For upgrade variant: the plan label required to unlock. */
  requiredPlanLabel?: string;
}

/**
 * Resolve the message for a guarded action given the current plan.
 * - If the action's feature is NOT available on the current plan → upgrade message.
 * - Otherwise → view-only simulation message.
 */
export function resolveGuardMessage(actionId: DemoActionId, plan: DemoPlan): DemoGuardMessage {
  const action = DEMO_ACTIONS[actionId];
  const feature = action.feature;
  const available = feature ? DEMO_PLANS[plan].features[feature] : true;

  if (feature && !available) {
    const requiredPlan = requiredDemoPlanFor(feature);
    const requiredPlanLabel = DEMO_PLANS[requiredPlan].label;

    if (requiredPlan === 'enterprise') {
      return {
        variant: 'upgrade',
        title: 'Enterprise capability',
        body: 'Upgrade to Enterprise for Vault, advanced MiCA reporting, digital signatures and dedicated infrastructure.',
        requiredPlanLabel,
      };
    }

    return {
      variant: 'upgrade',
      title: `Available on ${requiredPlanLabel}`,
      body: `“${action.label}” is unlocked on the ${requiredPlanLabel} plan. Upgrade to enable this capability in your licensed environment.`,
      requiredPlanLabel,
    };
  }

  const planLabel = DEMO_PLANS[plan].label;
  return {
    variant: 'simulated',
    title: `Available in your licensed ${planLabel} environment`,
    body: 'This public demo is view-only. In your private deployment, this action is executed using your own wallets, KYC provider and infrastructure.',
  };
}
