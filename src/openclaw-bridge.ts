// Compatibility bridge — re-exports context engine types from local definitions.
// Upstream lossless-claw exports these from openclaw/plugin-sdk; our fork inlines them.

export type {
  AgentMessage,
  ContextEngine,
  ContextEngineInfo,
  AssembleResult,
  CompactResult,
  IngestResult,
  IngestBatchResult,
  BootstrapResult,
  SubagentSpawnPreparation,
  SubagentEndReason,
} from "./context-engine-types.js";

// registerContextEngine and ContextEngineFactory are OpenClaw plugin registration —
// not needed when using the engine directly. Stubbed for import compatibility.
export type ContextEngineFactory = (deps: unknown) => unknown;
export function registerContextEngine(
  _id: string,
  _factory: ContextEngineFactory,
): void {
  // no-op — OttoRuntime creates the engine directly, not through plugin registration
}
