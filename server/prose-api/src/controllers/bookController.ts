import { Context } from 'hono';
import { OpenLibraryResponseDTO } from '../DTOs/OpenLibraryResponseDTO';

export async function getBooks(c: Context) {
    const { bookName } = c.req.param();
    const openLibraryUrl = `https://openlibrary.org/search.json?title=${bookName}`

    try {
        const response = await fetch(openLibraryUrl);
        if (!response.ok) {
            return c.json({ error: 'Failed to fetch books from Open Library' }, 500);
        }

        const data = await response.json();
        const parsedData = OpenLibraryResponseDTO.parse(data);
        

        return c.json(parsedData);
    } catch (error) {
        return c.json({ error: 'An error occurred while fetching books' }, 500);
    }

}