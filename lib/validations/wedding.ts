import { z } from 'zod'

export const weddingQuoteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().refine((val) => val.replace(/\D/g, '').length >= 10, {
    message: 'Phone must have at least 10 digits',
  }),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'At least one item is required'),
})

export type WeddingQuoteData = z.infer<typeof weddingQuoteSchema>
