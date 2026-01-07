import { eq } from "drizzle-orm";
import { z } from "zod";

import { application } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const applicationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(application)
        .values({ name: input.name, description: input.description });
    }),

  readOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.application.findFirst({
        where: (fields, { eq }) => eq(fields.id, input.id),
      });
    }),

  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.application.findMany();
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(application)
        .set({ name: input.name, description: input.description })
        .where(eq(application.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(application)
        .where(eq(application.id, input.id));
    }),
});
