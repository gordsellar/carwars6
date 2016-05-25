package org.opentools.carwars.data;

import org.opentools.carwars.entity.DBCarDesign;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * Created by ammulder on 5/25/16.
 */
public interface DesignRepository extends PagingAndSortingRepository<DBCarDesign, Long> {
    List<DBCarDesign> findByAuthorEmail(String email);
    DBCarDesign findFirstByUiId(long id);
}
