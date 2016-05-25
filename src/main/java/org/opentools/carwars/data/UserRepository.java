package org.opentools.carwars.data;

import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data repository for users
 */
public interface UserRepository extends CrudRepository<DBCarWarsUser, String> {
}
