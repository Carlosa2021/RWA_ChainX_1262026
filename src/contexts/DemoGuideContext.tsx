'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGuideContext — Sprint 12.1 Guided Demo Mode
//
// Local, in-memory presenter state for the guided walkthrough. NO persistence,
// NO storage, NO network. A page refresh intentionally resets the guide. This
// context only ever operates inside /demo/**.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { DEMO_GUIDE_STEPS, DEMO_GUIDE_TOTAL_STEPS, DemoGuideStep } from '@/lib/demo/demoGuide';

interface DemoGuideContextType {
  // state
  isGuideActive: boolean;
  isIntroOpen: boolean;
  isExitPromptOpen: boolean;
  isNotesOpen: boolean;
  currentStepIndex: number;
  completedActionIds: string[];
  startedAt: number | null;
  // derived
  currentStep: DemoGuideStep | null;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  // intro / lifecycle
  openIntro: () => void;
  closeIntro: () => void;
  startGuide: () => void;
  finishGuide: () => void;
  exitGuide: () => void;
  requestExit: () => void;
  cancelExit: () => void;
  // navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  // notes
  toggleNotes: () => void;
  closeNotes: () => void;
  // completion tracking
  markActionComplete: (id: string) => void;
  isActionComplete: (id: string) => boolean;
}

const DemoGuideContext = createContext<DemoGuideContextType | undefined>(undefined);

export function DemoGuideProvider({ children }: { children: ReactNode }) {
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isExitPromptOpen, setIsExitPromptOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const completedRef = useRef<Set<string>>(new Set());

  const openIntro = useCallback(() => setIsIntroOpen(true), []);
  const closeIntro = useCallback(() => setIsIntroOpen(false), []);

  const startGuide = useCallback(() => {
    setIsIntroOpen(false);
    setIsExitPromptOpen(false);
    setIsNotesOpen(false);
    setCurrentStepIndex(0);
    completedRef.current = new Set();
    setCompletedActionIds([]);
    setStartedAt(Date.now());
    setIsGuideActive(true);
  }, []);

  const exitGuide = useCallback(() => {
    setIsGuideActive(false);
    setIsIntroOpen(false);
    setIsExitPromptOpen(false);
    setIsNotesOpen(false);
    setCurrentStepIndex(0);
    completedRef.current = new Set();
    setCompletedActionIds([]);
    setStartedAt(null);
  }, []);

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(DEMO_GUIDE_TOTAL_STEPS - 1, i)),
    []
  );

  const goToStep = useCallback(
    (index: number) => {
      setIsNotesOpen(false);
      setCurrentStepIndex(clampIndex(index));
    },
    [clampIndex]
  );

  const nextStep = useCallback(() => {
    setCurrentStepIndex((i) => clampIndex(i + 1));
  }, [clampIndex]);

  const previousStep = useCallback(() => {
    setCurrentStepIndex((i) => clampIndex(i - 1));
  }, [clampIndex]);

  const finishGuide = useCallback(() => {
    setCurrentStepIndex(DEMO_GUIDE_TOTAL_STEPS - 1);
  }, []);

  const requestExit = useCallback(() => {
    // Only meaningful once the presentation has started.
    setIsExitPromptOpen(true);
  }, []);
  const cancelExit = useCallback(() => setIsExitPromptOpen(false), []);

  const toggleNotes = useCallback(() => setIsNotesOpen((o) => !o), []);
  const closeNotes = useCallback(() => setIsNotesOpen(false), []);

  const markActionComplete = useCallback((id: string) => {
    if (completedRef.current.has(id)) return;
    completedRef.current.add(id);
    setCompletedActionIds(Array.from(completedRef.current));
  }, []);

  const isActionComplete = useCallback(
    (id: string) => completedRef.current.has(id),
    // completedActionIds drives re-render so consumers stay in sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completedActionIds]
  );

  const value = useMemo<DemoGuideContextType>(() => {
    const currentStep = DEMO_GUIDE_STEPS[currentStepIndex] ?? null;
    return {
      isGuideActive,
      isIntroOpen,
      isExitPromptOpen,
      isNotesOpen,
      currentStepIndex,
      completedActionIds,
      startedAt,
      currentStep,
      totalSteps: DEMO_GUIDE_TOTAL_STEPS,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === DEMO_GUIDE_TOTAL_STEPS - 1,
      openIntro,
      closeIntro,
      startGuide,
      finishGuide,
      exitGuide,
      requestExit,
      cancelExit,
      nextStep,
      previousStep,
      goToStep,
      toggleNotes,
      closeNotes,
      markActionComplete,
      isActionComplete,
    };
  }, [
    isGuideActive,
    isIntroOpen,
    isExitPromptOpen,
    isNotesOpen,
    currentStepIndex,
    completedActionIds,
    startedAt,
    openIntro,
    closeIntro,
    startGuide,
    finishGuide,
    exitGuide,
    requestExit,
    cancelExit,
    nextStep,
    previousStep,
    goToStep,
    toggleNotes,
    closeNotes,
    markActionComplete,
    isActionComplete,
  ]);

  return <DemoGuideContext.Provider value={value}>{children}</DemoGuideContext.Provider>;
}

export function useDemoGuide(): DemoGuideContextType {
  const ctx = useContext(DemoGuideContext);
  if (!ctx) {
    throw new Error('useDemoGuide must be used within a DemoGuideProvider');
  }
  return ctx;
}
