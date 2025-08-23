package com.prose.rest.api.openlibrary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenLibraryResponse {
    private List<OpenLibraryDoc> docs;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpenLibraryDoc {
        private String title;
        private Integer edition_count;
        private List<String> author_name;
        private Integer first_publish_year;
        private List<String> language;
    }
}




