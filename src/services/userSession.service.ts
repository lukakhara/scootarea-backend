import type { Request } from "express";
import { UAParser } from "ua-parser-js";
import { prisma } from "../lib/prisma";

export const sessionService = {
  async attachDevice(req: Request, userId: string) {
    // the store writes the row on save; make sure it exists first
    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve())),
    );

    const ua = UAParser(req.headers["user-agent"]);
    await prisma.session.update({
      where: { sid: req.sessionID },
      data: {
        userId,
        browser:
          [ua.browser.name, ua.browser.major].filter(Boolean).join(" ") || null,
        os: ua.os.name ?? null,
        device: ua.device.type ?? "desktop",
        ip: req.ip,
      },
    });
  },

  list(userId: string) {
    return prisma.session.findMany({
      where: { userId, expire: { gt: new Date() } },
      orderBy: { lastUsedAt: "desc" },
      select: {
        sid: true,
        browser: true,
        os: true,
        device: true,
        ip: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });
  },

  async revoke(userId: string, sid: string) {
    // deleting the row ends that session, no separate store call needed
    const { count } = await prisma.session.deleteMany({
      where: { sid, userId },
    });
    return count > 0;
  },
  async revokeOthers(userId: string, currentSid: string) {
    await prisma.session.deleteMany({
      where: { userId, sid: { not: currentSid } },
    });
  },
};
