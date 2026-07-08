package com.truong2k4.movie_service.importer;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResult {
    private boolean success;
    private String message;
    private int total;
    private int created;
    private int updated;
    private int skipped;
    private int failed;
    @Builder.Default
    private List<String> errors = new ArrayList<>();

    public static ImportResult merge(List<ImportResult> results, String finalMessage) {
        boolean allSuccess = true;
        int total = 0;
        int created = 0;
        int updated = 0;
        int skipped = 0;
        int failed = 0;
        List<String> mergedErrors = new ArrayList<>();

        for (ImportResult res : results) {
            if (res != null) {
                if (!res.isSuccess()) {
                    allSuccess = false;
                }
                total += res.getTotal();
                created += res.getCreated();
                updated += res.getUpdated();
                skipped += res.getSkipped();
                failed += res.getFailed();
                if (res.getErrors() != null) {
                    mergedErrors.addAll(res.getErrors());
                }
            }
        }

        return ImportResult.builder()
                .success(allSuccess)
                .message(finalMessage)
                .total(total)
                .created(created)
                .updated(updated)
                .skipped(skipped)
                .failed(failed)
                .errors(mergedErrors)
                .build();
    }
}
