package com.onlinenews.onlinenews.exception;

public class HttpClientErrorException extends RuntimeException{
    public HttpClientErrorException(String message){
        super(message);
    }
}
