package org.opentools.carwars.data;

/**
 * A tag and the number of times it was used
 */
public class TagCount {
    private int designId;
    private String tag;
    private int count;

    public TagCount(String tag, long count) {
        this.tag = tag;
        this.count = (int)count;
    }

    public TagCount(int designId, String tag) {
        this.designId = designId;
        this.tag = tag;
    }

    public TagCount(int designId, String tag, long count) {
        this.designId = designId;
        this.tag = tag;
        this.count = (int)count;
    }

    public int getDesignId() {
        return designId;
    }

    public String getTag() {
        return tag;
    }

    public int getCount() {
        return count;
    }
}
