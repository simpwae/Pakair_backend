// Feature flags for PakAir
// Controls which AI models and features are enabled

export const FEATURES = {
  ENABLE_CLAUDE_HAIKU: process.env.ENABLE_CLAUDE_HAIKU === "true",
  ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === "true",
};

export const isClaudeHaikuEnabled = () => {
  return FEATURES.ENABLE_CLAUDE_HAIKU === true;
};

export default FEATURES;
