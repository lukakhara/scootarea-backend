import type { Request, Response } from "express";
import { getUserStats, sessionService } from "../services/userSession.service";

export const sessionController = {
  async list(req: Request, res: Response) {
    const sessions = await sessionService.list(req.session.userId!);
    res.json(sessions.map((s) => ({ ...s, current: s.sid === req.sessionID })));
  },

  async revoke(req: Request<{ sid: string }>, res: Response) {
    const ok = await sessionService.revoke(req.session.userId!, req.params.sid);
    if (!ok) return res.status(404).json({ message: "Session not found" });
    res.status(204).end();
  },
  async revokeOthers(req: Request, res: Response) {
    await sessionService.revokeOthers(req.session.userId!, req.sessionID);
    res.status(204).end();
  },

  async getStats(req: Request, res: Response) {
    const data = await getUserStats(req.session.userId!);
    res.json({ data });
  },
};
