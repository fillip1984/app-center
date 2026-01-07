import { eq } from "drizzle-orm";
import { z } from "zod";

import { environment } from "~/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const environmentRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(environment)
        .values({ name: input.name, description: input.description })
        .execute();
    }),

  readOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.environment.findFirst({
        where: (fields, { eq }) => eq(fields.id, input.id),
      });
    }),

  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.environment.findMany();
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(environment)
        .set({ name: input.name, description: input.description })
        .where(eq(environment.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(environment)
        .where(eq(environment.id, input.id));
    }),
});
