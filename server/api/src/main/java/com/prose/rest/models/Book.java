package com.prose.rest.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private UUID id;
    private String title;
    private Integer pages;
    private String author;
    private String description;
    private int publicationYear;
    private List<String> genres;
}

//    No arg constructor
//
//    public Book(){}

//    Constructor

//    public Book(String id, String title, String author, String description, int publicationYear, List<String> genres){
//        this.id = id;
//        this.title = title;
//        this. author = author;
//        this.description = description;
//        this.publicationYear = publicationYear;
//        this.genres = genres;
//    }

//    Getter and Setters
//
//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getAuthor() {
//        return author;
//    }
//
//    public void setAuthor(String author) {
//        this.author = author;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public int getPublicationYear() {
//        return publicationYear;
//    }
//
//    public void setPublicationYear(int publicationYear) {
//        this.publicationYear = publicationYear;
//    }
//
//    public List<String> getGenres() {
//        return genres;
//    }
//
//    public void setGenres(List<String> genres) {
//        this.genres = genres;
//    }

