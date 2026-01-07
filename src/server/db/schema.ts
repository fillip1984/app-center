import { relations } from "drizzle-orm";

import { appSchema, baseFields } from "./db-utils";

export const environment = appSchema.table("environment", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text().notNull(),
}));

export const application = appSchema.table("application", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text().notNull(),
}));

export const environmentApplication = appSchema.table(
  "environmentApplication",
  (d) => ({
    ...baseFields,
    environmentId: d
      .text()
      .notNull()
      .references(() => environment.id, { onDelete: "cascade" }),
    applicationId: d
      .text()
      .notNull()
      .references(() => application.id, { onDelete: "cascade" }),
  }),
);

// relationships
export const environmentApplicationsRelation = relations(
  environmentApplication,
  ({ one }) => ({
    environment: one(environment, {
      fields: [environmentApplication.environmentId],
      references: [environment.id],
    }),
    application: one(application, {
      fields: [environmentApplication.applicationId],
      references: [application.id],
    }),
  }),
);

export * from "./auth-schema";
