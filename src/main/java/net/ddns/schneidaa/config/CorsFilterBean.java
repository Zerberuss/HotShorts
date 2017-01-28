package net.ddns.schneidaa.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Created by simon41 on 12/18/2016.
 */
//http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/cors/CorsConfiguration.html#setAllowedMethods-java.util.List-

@Configuration
public class CorsFilterBean {

        @Bean
        public FilterRegistrationBean corsFilter() {
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://localhost:8081");
            //If a angular http put request comes that does not have all necessary attributes, it might get turned into a patch request, so patch has to be allowed or we have a cross origin request violation
            //config.setAllowedMethods(Arrays.asList("OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"));
            config.addAllowedMethod("*");
            config.addAllowedHeader("*");
            source.registerCorsConfiguration("/**", config);
            FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
            bean.setOrder(0);
            return bean;
        }
}
