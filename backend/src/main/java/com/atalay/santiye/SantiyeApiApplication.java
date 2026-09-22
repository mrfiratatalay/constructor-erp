package com.atalay.santiye;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SantiyeApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SantiyeApiApplication.class, args);
    }

}
