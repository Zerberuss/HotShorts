package net.ddns.schneidaa.model;

import javax.persistence.*;

/**
 * Created by johann on 8/23/16.
 */

@Entity
@Table(name = "shortcut")
public class Shortcut {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    //@JoinColumn(name = "programVersion")
    @JoinColumn(name = "version_id")
    private ProgramVersion programVersion;

    @Version
    private long version;

    //@Andi: Table "namen" is mapped to entity keyCode, because it indicates much clearer what is stored in the column
    @Column(name = "key_code", length = 50)
    private String keyCode;

    @Column(name = "shortdescription")
    private String desciptionShort;

    private String description;

    private int ratingNr;

    private int ratingCount;

    public long getId() {
        return id;
    }

    public ProgramVersion getProgramVersion() {
        return programVersion;
    }

    public void setProgramVersion(ProgramVersion programVersion) {
        this.programVersion = programVersion;
    }

    public String getKeyCode() {
        return keyCode;
    }

    public void setKeyCode(String keyCode) {
        this.keyCode = keyCode;
    }

    public String getDesciptionShort() {
        return desciptionShort;
    }

    public void setDesciptionShort(String descriptionShort) {
        this.desciptionShort = descriptionShort;
    }

    public String getDescriptionShort() {
        return desciptionShort;
    }

    public void setDescriptionShort(String descriptionShort) {
        this.desciptionShort = descriptionShort;
    }

    public String getShortdescription() {
        return desciptionShort;
    }

    public void setShortdescription(String descritionShort) {
        this.desciptionShort = descritionShort;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getRatingNr() {
        return ratingNr;
    }

    public void setRatingNr(int ratingNr) {
        this.ratingNr = ratingNr;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }
}
