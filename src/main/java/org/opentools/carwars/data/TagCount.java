package org.opentools.carwars.data;

/**
 * A tag and the number of times it was used
 */
public class TagCount {
    private String tag;
    private int count;

    public TagCount(String tag, long count) {
        this.tag = tag;
        this.count = (int)count;
    }

    public String getTag() {
        return tag;
    }

    public int getCount() {
        return count;
    }
}
