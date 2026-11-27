import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { sessionController } from "../controller/userSession.controller";

const router = Router();

router.use(requireAuth);
router.get("/", sessionController.list);
router.get("/stats", requireAuth, sessionController.getStats);
router.delete("/others", sessionController.revokeOthers);
router.delete("/:sid", sessionController.revoke);


export default router;
