package com.onlinenews.onlinenews.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import java.time.Duration;
import java.util.*;

@Service
public class ChatGptService {

    private final WebClient webClient;

    @Value("${mistral.api.key}")
    private String apiKey;

    @Value("${mistral.model}")
    private String model;

    @Value("${mistral.api.url}")
    private String apiUrl;

    public ChatGptService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public Flux<String> streamChatResponse(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMapMany(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        String content = message != null ? message.get("content").toString() : "No response.";
                        // Simulate streaming by splitting into chunks
                        return Flux.fromArray(content.split(" "))
                                .delayElements(Duration.ofMillis(100)); // 100ms delay per word
                    }
                    return Flux.just("No choices returned.");
                });
    }
}
