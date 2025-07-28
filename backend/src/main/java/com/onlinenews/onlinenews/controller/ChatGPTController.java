package com.onlinenews.onlinenews.controller;
import com.onlinenews.onlinenews.service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatGPTController {

    @Autowired
    private ChatGptService chatGptService;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamChat(@RequestParam String prompt) {
        return chatGptService.streamChatResponse(prompt);
    }
}

