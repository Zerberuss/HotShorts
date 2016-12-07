package net.ddns.schneidaa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;

/**
 * Created by simon41 on 12/6/2016.
 */
//http://stackoverflow.com/questions/25639188/disable-basic-authentication-while-using-spring-security-java-configuration
//http://stackoverflow.com/questions/23894010/spring-boot-security-disable-security
//http://stackoverflow.com/questions/21696592/disable-spring-security-for-options-http-method
    //http://stackoverflow.com/questions/33813935/cors-not-working-with-spring-boot-and-anularjs
//
//@Configuration
//@EnableWebSecurity
public class SecurityControllerHttp extends WebSecurityConfigurerAdapter {


    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
    }


        @Override
        protected void configure(HttpSecurity http) throws Exception {
        //super.configure(http);
//            http
//                    .authorizeRequests()
//                    .anyRequest().authenticated()
//                    .and()
//                    .formLogin()
//                    .and()
//                    .httpBasic().disable();

            http
                    .authorizeRequests()
                    .anyRequest().permitAll();
        }


    /*
    @Override
        public void setAuthenticationConfiguration(AuthenticationConfiguration authenticationConfiguration) {
            super.setAuthenticationConfiguration(authenticationConfiguration);
        }



//    @Override
//    protected void configure(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity.authorizeRequests().antMatchers("/").permitAll();
//    }

    */
}
