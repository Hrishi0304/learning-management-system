import { z } from "zod";

export const createCourseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    price: z.number().min(0,"Price cannot be negative"),
    duration_hours: z.number().positive("Duration must be greater than 0"),
    launched_date: z.coerce.date().optional(),
    is_published: z.boolean().optional().default(false)
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;