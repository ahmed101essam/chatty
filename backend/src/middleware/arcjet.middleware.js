import aj from "../lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetPortection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Rate limit exceeded",
        });
      } else {
        return res.status(403).json({
          message: "Acess denied by security policy.",
        });
      }
    }
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bit detected",
        message: "Malicious bot activity detected",
      });
    }
    next();
  } catch (err) {
    console.log("Arcjet Protection Error: ", err);
    next();
  }
};
