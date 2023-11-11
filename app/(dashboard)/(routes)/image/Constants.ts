import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required and more than 1 character",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

// export const amountOptions;
