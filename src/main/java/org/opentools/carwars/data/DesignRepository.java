package org.opentools.carwars.data;

import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBDesignRating;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * DAO for car designs
 */
@Transactional(readOnly = true)
public interface DesignRepository extends PagingAndSortingRepository<DBCarDesign, Long> {
    @Query("select d from DBCarDesign d where d.authorEmail=?1 and d.hidden=false order by d.createDate asc")
    List<DBCarDesign> findByAuthorEmail(String email);
    @Query("select d from DBCarDesign d where d.authorEmail=?1 and d.hidden=false order by d.createDate desc")
    List<DBCarDesign> findLatestByAuthor(String email);
    @Query("select d from DBCarDesign d where d.designName=?1 and d.authorEmail=?2 and d.createDate < ?3 order by d.createDate desc")
    List<DBCarDesign> findHistoricalDesigns(String designName, String email, Date compareTo);
    DBCarDesign findFirstByUiId(long uiId);
    @Query("select r from DBCarDesign d join d.ratings r where d.uiId = ?1 and r.user = d.authorEmail")
    DBDesignRating getAuthorRating(long uiId);
    @Query("select new org.opentools.carwars.data.TagCount(t.tag, count(t)) from DBCarDesign d join d.tags t where d.uiId=?1 group by t.tag")
    List<TagCount> getTagsForDesign(long uiId);
    @Modifying
    @Transactional
    @Query("update DBCarDesign d set d.hidden=true where d.authorEmail=?1 and d.designName=?2 and d.uiId <> ?3")
    int hideOldDesigns(String email, String designName, long uiId);
    @Query("select d.uiId from DBCarDesign d where d.stockCar=true and d.hidden=false and d.deferred=false")
    List<Long> findPendingStockCars();
    @Query("select count(d) from DBCarDesign d where d.stockCar=true and d.hidden=false and d.reviewed=false and d.deferred=false")
    int countPendingStockCars();
}
