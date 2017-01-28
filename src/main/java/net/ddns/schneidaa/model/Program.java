package net.ddns.schneidaa.model;

import javax.persistence.*;
import java.util.List;


//https://hellokoding.com/jpa-one-to-many-relationship-mapping-example-with-spring-boot-maven-and-mysql/
//https://hellokoding.com/jpa-many-to-many-relationship-mapping-example-with-spring-boot-maven-and-mysql/
//How to expose the ID (Primary Key) in Spring Data: http://tommyziegler.com/how-to-expose-the-resourceid-with-spring-data-rest/

//NOTE!: If the spring server receives a put, post etc. method, the attribute names HAVE TO MATCH the attribute names of the class: so here for example: ratingNr instead of rating_nr

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

    public List<ProgramVersion> getProgramVersions() {
        return programVersions;
    }

    public void setProgramVersions(List<ProgramVersion> programVersions) {
        this.programVersions = programVersions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
