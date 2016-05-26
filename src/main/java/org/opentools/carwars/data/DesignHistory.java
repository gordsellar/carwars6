package org.opentools.carwars.data;

import java.util.Date;

/**
 * Just enough information needed to populate the history array of a design.
 * Once the next Spring-Data is released, this can be used as the return
 * type of the query, but that is broken at the moment
 * (https://jira.spring.io/browse/DATAJPA-885)
 */
public interface DesignHistory {
    long getUiId();
    String getDesignName();
    Date getCreateDate();
}
