package org.opentools.carwars.data;

import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data repository for users
 */
public interface UserRepository extends CrudRepository<DBCarWarsUser, String> {
    @Query("select u from DBCarWarsUser u where u.confirmed=false and u.confirmationKey=?1")
    DBCarWarsUser getUnconfirmedUser(String key);
}
