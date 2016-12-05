package net.ddns.schneidaa.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.List;

/**
 * Created by johann on 8/23/16.
 */
//https://hellokoding.com/jpa-one-to-many-relationship-mapping-example-with-spring-boot-maven-and-mysql/
//https://hellokoding.com/jpa-many-to-many-relationship-mapping-example-with-spring-boot-maven-and-mysql/
//How to expose the ID (Primary Key) in Spring Data: http://tommyziegler.com/how-to-expose-the-resourceid-with-spring-data-rest/

@Entity
@Table(name = "program")
public class Program {

    @Id
    private String name;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL)
    private List<ProgramVersion> programVersions;

    private String description;

    private String website;

    private int ratingNr;  //the sum of all the ratings together. the mean value will be calculated at the client side.

    private int ratingCount;

    @Version
    private long version;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesciption() {
        return description;
    }

    public void setDesciption(String desciption) {
        this.description = desciption;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
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
