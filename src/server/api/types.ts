import type { RouterOutputs } from "~/trpc/react";

export type EnvironmentSummaryType =
  RouterOutputs["environment"]["readAll"][number];
