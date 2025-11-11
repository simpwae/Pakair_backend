import { isClaudeHaikuEnabled } from "../utils/featureFlags.js";

export const getFeatureStatus = (req, res) => {
  res.json({
    features: {
      claudeHaiku: isClaudeHaikuEnabled(),
      aiFeatures: process.env.ENABLE_AI_FEATURES === "true",
    },
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
};

export default getFeatureStatus;
