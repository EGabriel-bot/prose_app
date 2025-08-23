package com.prose.rest.services;

import com.prose.rest.api.openlibrary.OpenLibraryResponse;
import com.prose.rest.models.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class BookService {
    private final RestTemplate restTemplate;

    @Autowired
    public BookService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Book> FindBooks(String query, Integer limit){
        if (query != null && !query.trim().isEmpty()) {

            String apiUrl = String.format("https://openlibrary.org/search.json?q=%s&limit=%d", query, limit != null ? limit : 10);

            OpenLibraryResponse response = restTemplate.getForObject(apiUrl, OpenLibraryResponse.class);

            if (response == null || response.getDocs() == null) {
                return Collections.emptyList();
            }

            return response.getDocs().stream()
                    .map(this::mapToBook)
                    .toList();
        }
        return Collections.emptyList();
    }

    private Book mapToBook(OpenLibraryResponse.OpenLibraryDoc doc) {
        UUID uuid = UUID.randomUUID();
        return new Book(
                uuid,
                doc.getTitle(),
                doc.getEdition_count(),
                (doc.getAuthor_name() != null && !doc.getAuthor_name().isEmpty())
                        ? doc.getAuthor_name().getFirst()
                        : "Unknown",
                "", // No description from search API; would need a second request for details
                doc.getFirst_publish_year() != null ? doc.getFirst_publish_year() : 0,
                doc.getLanguage() != null ? doc.getLanguage() : List.of("")
        );
    }
}
