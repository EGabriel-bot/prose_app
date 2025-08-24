package com.prose.rest.services;

import com.prose.rest.api.openlibrary.OpenLibraryResponse;
import com.prose.rest.dto.BookResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class BookService {
    private final RestTemplate restTemplate;

    @Autowired
    public BookService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Async
    public CompletableFuture<List<BookResponseDto>> FindBooks(String query, Integer limit)
    {
        if (query != null && !query.trim().isEmpty())
        {
            String apiUrl = String.format("https://openlibrary.org/search.json?q=%s&limit=%d", query, limit != null ? limit : 10);
            OpenLibraryResponse response = restTemplate.getForObject(apiUrl, OpenLibraryResponse.class);

            if(response != null) {
                List<BookResponseDto> books = response.getDocs().stream()
                        .map(doc -> new BookResponseDto(
                                doc.getTitle(),
                                doc.getAuthor_name(),
                                doc.getFirst_publish_year(),
                                doc.getLanguage()
                        ))
                        .toList();

                return CompletableFuture.completedFuture(books);
            }
        }
        return CompletableFuture.completedFuture(List.of());
    }

}
