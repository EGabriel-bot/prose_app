import * as z from "zod";

export const OpenLibraryResponseDTO = z.object({
    docs: z.array(z.object({
        title: z.string(),
        author_name: z.array(z.string()).optional(),
        first_publish_year: z.number().optional(),
        edition_count: z.number().optional(),
    }))
})