package com.aidenPersonal.avyBuddy.controllers;

import com.aidenPersonal.avyBuddy.uacData.Forecast;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class TestController {

    @GetMapping("/Forecast/{region}")
    public String hey(@PathVariable final String region) {
        Forecast forecast;

        try {
            forecast = new Forecast(region);
        } catch (final IOException e) {
            throw new RuntimeException(e);
        }

        final ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(forecast);
        } catch (final JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
