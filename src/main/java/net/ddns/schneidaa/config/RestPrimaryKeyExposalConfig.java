package net.ddns.schneidaa.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import net.ddns.schneidaa.model.Program;

/**
 * Created by simon41 on 12/4/2016.
 */
//How to expose the ID (Primary Key) in Spring Data: http://tommyziegler.com/how-to-expose-the-resourceid-with-spring-data-rest/
@Configuration
public class RestPrimaryKeyExposalConfig extends RepositoryRestMvcConfiguration{

    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Program.class);
    }
}
