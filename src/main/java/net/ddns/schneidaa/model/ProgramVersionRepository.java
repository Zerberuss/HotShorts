package net.ddns.schneidaa.model;

/**
 * Created by simon41 on 12/4/2016.
 */

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//http://localhost:8080/programversions/
@RepositoryRestResource
public interface ProgramVersionRepository extends PagingAndSortingRepository<ProgramVersion, String>{

}
