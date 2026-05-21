import { z } from 'zod'

export const testimonialSchema = z.object({
  author: z.string().min(2),
  location: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>
