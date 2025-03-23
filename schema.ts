import { z } from "zod";

export const resumeSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phone: z.string().optional(),
    address: z.string().optional(),
    portfolio: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  summary: z.string().optional(),
  experiences: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string(),
    })
  ).optional().default([]),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;
