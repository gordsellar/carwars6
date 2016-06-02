package org.opentools.carwars.data;

import org.opentools.carwars.entity.DBDesignRating;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

/**
 * For dealing with ratings
 */
@Transactional(readOnly = true)
public interface RatingRepository extends CrudRepository<DBDesignRating, Long> {
    @Query("select r from DBDesignRating r where r.user.email = ?1 and r.design.uiId = ?2")
    DBDesignRating getRatingForCar(String email, long uiId);
    @Modifying
    @Transactional
    @Query("delete from DBDesignTag t where t.user.email=?1 and t.design.id = (select d.id from DBCarDesign d where d.uiId=?2)")
    int deleteTags(String email, long uiId);
    @Query("select avg(r.rating) from DBDesignRating r where r.design.uiId = ?1")
    float getAverageRating(long uiId);
}
