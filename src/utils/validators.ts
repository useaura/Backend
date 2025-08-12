import { z } from "zod";

export const previewWithdrawSchema = z.object({
  toAddress: z.string().min(1),
  amount: z.number().positive(),
});
