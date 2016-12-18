package net.ddns.schneidaa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by simon41 on 12/5/2016.
 */

//https://spring.io/blog/2015/06/08/cors-support-in-spring-framework
//https://spring.io/guides/gs/rest-service-cors/

//@Configuration
//@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");//.allowedOrigins("http://localhost:8081/");
    }
}

