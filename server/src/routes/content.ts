import { Router } from "express";
import { ROUTINE_PHASES, MODULES, FRAMEWORKS, ROLE_MODELS, RECOVERY, FAQ, QUOTES, CONFIG } from "../data/content";

export const contentRouter = Router();

contentRouter.get("/routine-phases", (_req, res) => res.json(ROUTINE_PHASES));
contentRouter.get("/modules", (_req, res) => res.json(MODULES));
contentRouter.get("/modules/:num", (req, res) => {
  const num = Number(req.params.num);
  const mod = MODULES.find((m) => m.num === num);
  if (!mod) return res.status(404).json({ error: "No such module" });
  res.json(mod);
});
contentRouter.get("/frameworks", (_req, res) => res.json(FRAMEWORKS));
contentRouter.get("/role-models", (_req, res) => res.json(ROLE_MODELS));
contentRouter.get("/recovery", (_req, res) => res.json(RECOVERY));
contentRouter.get("/faq", (_req, res) => res.json(FAQ));
contentRouter.get("/quotes", (_req, res) => res.json(QUOTES));
contentRouter.get("/config", (_req, res) => res.json(CONFIG));
