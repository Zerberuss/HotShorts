package net.ddns.schneidaa.model;


/**
 * Created by simon41 on 12/4/2016.
 */

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.repository.query.Param;

import java.util.List;

//http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/PagingAndSortingRepository.html
//http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
//http://docs.spring.io/spring-data/rest/docs/current/reference/html/

//http://localhost:8080/programs/
@RepositoryRestResource
public interface ProgramRepository extends PagingAndSortingRepository<Program, String> {

    //This would be exposed under the URL: http://localhost:8080/programs/search/findByName
    public List<Program> findByName(@Param("name") String name);

}
