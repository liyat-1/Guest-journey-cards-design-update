import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { journey as seedJourney, type Stage, type StageMessage, type StageOffer } from "./journey";
import {
  defaultOfferTypes,
  stageConfigs as seedConfigs,
  type Condition,
  type FormField,
  type OfferType,
  type StageConfig,
  type Timing,
} from "./stage-config";

export type Filters = {
  range: string;
  property: string;
  stage: string;
  channel: string;
  segment: string;
  source: string;
  conversion: string;
  offer: string;
};

export const defaultFilters: Filters = {
  range: "Last 30 days",
  property: "All properties",
  stage: "All stages",
  channel: "All channels",
  segment: "All segments",
  source: "All sources",
  conversion: "All guests",
  offer: "All offers",
};

type OtaState = {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  stages: Stage[];
  getStage: (id: string) => Stage | undefined;
  updateMessage: (id: string, patch: Partial<StageMessage>) => void;
  updateLanding: (id: string, patch: Partial<Stage["landing"]>) => void;
  updateSuccess: (id: string, patch: Partial<Stage["success"]>) => void;
  /** Adds or replaces the offer for a segment within a stage. */
  saveOffer: (id: string, offer: StageOffer) => void;
  removeOffer: (id: string, segment: StageOffer["segment"]) => void;
  configs: Record<string, StageConfig>;
  setTiming: (id: string, timing: Timing) => void;
  setFormEnabled: (id: string, enabled: boolean) => void;
  addField: (id: string) => void;
  updateField: (id: string, fieldId: string, patch: Partial<FormField>) => void;
  removeField: (id: string, fieldId: string) => void;
  moveField: (id: string, fieldId: string, dir: -1 | 1) => void;
  toggleCondition: (id: string, conditionId: string) => void;
  offerTypes: OfferType[];
  updateOfferType: (id: string, patch: Partial<OfferType>) => void;
  addOfferType: () => string;
  removeOfferType: (id: string) => void;
};

const Ctx = createContext<OtaState | null>(null);

export function OtaProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stages, setStages] = useState<Stage[]>(seedJourney);
  const [configs, setConfigs] = useState<Record<string, StageConfig>>(seedConfigs);
  const [offerTypes, setOfferTypes] = useState<OfferType[]>(defaultOfferTypes);

  const patch = useCallback((id: string, fn: (s: Stage) => Stage) => {
    setStages((prev) => prev.map((s) => (s.id === id ? fn(s) : s)));
  }, []);

  const patchConfig = useCallback((id: string, fn: (c: StageConfig) => StageConfig) => {
    setConfigs((prev) => (prev[id] ? { ...prev, [id]: fn(prev[id]) } : prev));
  }, []);

  const value = useMemo<OtaState>(() => {
    const activeFilterCount = (Object.keys(filters) as (keyof Filters)[]).filter(
      (k) => k !== "range" && filters[k] !== defaultFilters[k],
    ).length;

    return {
      filters,
      setFilter: (key, v) => setFilters((prev) => ({ ...prev, [key]: v })),
      resetFilters: () => setFilters(defaultFilters),
      activeFilterCount,
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      stages,
      getStage: (id) => stages.find((s) => s.id === id),
      updateMessage: (id, p) => patch(id, (s) => ({ ...s, message: { ...s.message, ...p } })),
      updateLanding: (id, p) => patch(id, (s) => ({ ...s, landing: { ...s.landing, ...p } })),
      updateSuccess: (id, p) => patch(id, (s) => ({ ...s, success: { ...s.success, ...p } })),
      saveOffer: (id, offer) =>
        patch(id, (s) => ({
          ...s,
          offers: [...s.offers.filter((o) => o.segment !== offer.segment), offer],
        })),
      removeOffer: (id, segment) =>
        patch(id, (s) => ({ ...s, offers: s.offers.filter((o) => o.segment !== segment) })),
      configs,
      setTiming: (id, timing) => patchConfig(id, (c) => ({ ...c, timing })),
      setFormEnabled: (id, enabled) => patchConfig(id, (c) => ({ ...c, formEnabled: enabled })),
      addField: (id) =>
        patchConfig(id, (c) => ({
          ...c,
          fields: [
            ...c.fields,
            {
              id: `f${Date.now()}`,
              label: "New field",
              type: "text" as const,
              required: false,
            },
          ],
        })),
      updateField: (id, fieldId, p) =>
        patchConfig(id, (c) => ({
          ...c,
          fields: c.fields.map((f) => (f.id === fieldId ? { ...f, ...p } : f)),
        })),
      removeField: (id, fieldId) =>
        patchConfig(id, (c) => ({ ...c, fields: c.fields.filter((f) => f.id !== fieldId) })),
      moveField: (id, fieldId, dir) =>
        patchConfig(id, (c) => {
          const i = c.fields.findIndex((f) => f.id === fieldId);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= c.fields.length) return c;
          const next = [...c.fields];
          const a = next[i]!;
          next[i] = next[j]!;
          next[j] = a;
          return { ...c, fields: next };
        }),
      toggleCondition: (id, conditionId) =>
        patchConfig(id, (c) => ({
          ...c,
          conditions: c.conditions.map((x: Condition) =>
            x.id === conditionId ? { ...x, enabled: !x.enabled } : x,
          ),
        })),
      offerTypes,
      updateOfferType: (id, p) =>
        setOfferTypes((prev) => prev.map((o) => (o.id === id ? { ...o, ...p } : o))),
      addOfferType: () => {
        const id = `offer-${Date.now()}`;
        setOfferTypes((prev) => [
          ...prev,
          {
            id,
            name: "New offer",
            discount: 0,
            benefits: [],
            description: "Describe what this incentive gives the guest.",
            eligibility: "You decide",
            conditions: "You decide",
            expiry: "90 days from issue",
            messaging: "",
            cost: "You decide",
            usedIn: [],
          },
        ]);
        return id;
      },
      removeOfferType: (id) => setOfferTypes((prev) => prev.filter((o) => o.id !== id)),
    };
  }, [filters, sidebarCollapsed, stages, configs, offerTypes, patch, patchConfig]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOta() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOta must be used inside OtaProvider");
  return ctx;
}
