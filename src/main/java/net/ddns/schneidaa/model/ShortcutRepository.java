package net.ddns.schneidaa.model;

/**
 * Created by simon41 on 12/4/2016.
 */

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ShortcutRepository extends PagingAndSortingRepository<Shortcut, Long>{

}