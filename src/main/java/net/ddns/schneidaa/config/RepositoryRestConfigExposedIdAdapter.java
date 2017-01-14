package net.ddns.schneidaa.config;

import net.ddns.schneidaa.model.ProgramVersion;
import net.ddns.schneidaa.model.Shortcut;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import net.ddns.schneidaa.model.Program;

/**
 * Created by simon41 on 12/4/2016.
 */
//Configuration necessary to expose the ID or primary key in Spring Data REST API

@Configuration
public class RepositoryRestConfigExposedIdAdapter extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config){
        config.exposeIdsFor(Program.class); //To get the Id of a entity, the entity must have a public getter for the id field.
        config.exposeIdsFor(ProgramVersion.class);
        config.exposeIdsFor(Shortcut.class);
    }
}
