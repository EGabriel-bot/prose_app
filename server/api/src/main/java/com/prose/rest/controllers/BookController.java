package com.prose.rest.controllers;

import com.prose.rest.models.Book;
import com.prose.rest.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rest/books")
public class BookController {
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getBooks(
            @RequestParam(value = "query", required = false) String searchQuery,
            @RequestParam(value = "limit", required = false) Integer limit
    ){
        System.out.println("Received request with query: " + searchQuery);
        System.out.println("Received request with limit: " + limit);

        return bookService.FindBooks(searchQuery,limit);
    }
}
