package com.prose.rest.dto;

import java.util.List;

public record BookResponseDto(
        String title,
        List<String> author,
        Integer publicationYear,
        List<String> languages
){}

