package com.onlinenews.onlinenews.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HttpClientErrorException.class)
    public String handleException(HttpClientErrorException ex){
        return ex.getMessage();
    }
}
