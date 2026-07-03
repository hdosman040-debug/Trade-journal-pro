import { z } from "zod";

export const tradeSchema = z
  .object({
    asset: z
      .string()
      .min(1, "Asset symbol is required")
      .transform((val) => val.toUpperCase().trim()),
    direction: z.enum(["LONG", "SHORT"]),
    status: z.enum(["OPEN", "CLOSED"]),
    entryPrice: z
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Entry price must be greater than 0"),
    exitPrice: z
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Exit price must be greater than 0")
      .optional()
      .nullable(),
    size: z
      .number({ invalid_type_error: "Size must be a number" })
      .positive("Position size must be greater than 0"),
    stopLoss: z
      .number({ invalid_type_error: "Stop loss must be a number" })
      .positive("Stop loss must be greater than 0")
      .optional()
      .nullable(),
    takeProfit: z
      .number({ invalid_type_error: "Take profit must be a number" })
      .positive("Take profit must be greater than 0")
      .optional()
      .nullable(),
    playbookId: z.string().optional(),
    notes: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    date: z.string().min(1, "Date is required"),
  })
  .superRefine((data, ctx) => {
    // Conditional Constraint: Closed trades must hold a valid exit price
    if (data.status === "CLOSED" && (data.exitPrice === undefined || data.exitPrice === null)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exit price is required for closed trades",
        path: ["exitPrice"],
      });
    }
  });

export type TradeFormInput = z.infer<typeof tradeSchema>;