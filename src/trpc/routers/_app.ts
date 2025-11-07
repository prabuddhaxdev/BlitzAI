import { messageRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedure";

export const appRouter = createTRPCRouter({
  message: messageRouter,
  projects: projectRouter,
  usage: usageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;