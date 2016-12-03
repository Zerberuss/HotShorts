package net.ddns.schneidaa.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;

/**
 * Created by johann on 8/23/16.
 */

@Entity

public class ProgramVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    private Version programVersion;


    @Version
    private long version;

    private String keyCode;

    private String descritionShort;

    private String description;

    private float ratingNr;

    private int ratingCount;


}

