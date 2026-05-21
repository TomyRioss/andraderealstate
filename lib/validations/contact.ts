import { z } from 'zod'

export const contactSchema = z.object({
  type: z.enum(['BUY', 'SELL']),
  name: z.string().optional(),
  phone: z.string().refine((val) => val.replace(/\D/g, '').length >= 10, {
    message: 'Phone must have at least 10 digits',
  }),
  email: z.string().email(),
  address: z.string().optional(),
  photos: z.array(z.string()).default([]),
  message: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
