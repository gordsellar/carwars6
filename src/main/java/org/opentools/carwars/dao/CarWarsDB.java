package org.opentools.carwars.dao;

import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Database access for the Car Wars DB
 */
@Repository
@Transactional
public class CarWarsDB {
    @PersistenceContext
    private EntityManager mgr;

    public DBCarWarsUser getUser(String email) {
        return mgr.find(DBCarWarsUser.class, email);
    }

    public DBCarDesign getDesign(long uiId) {
        return mgr.createQuery("select a from DBCarDesign a where a.uiId = ?1", DBCarDesign.class).setParameter(1, uiId).getSingleResult();
    }
}
