package net.ddns.schneidaa.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.util.List;

/**
 * Created by johann on 8/23/16.
 */

@Entity
@Table(name = "version")
public class ProgramVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    @JoinColumn(name = "program")
    private Program program;

    @OneToMany(mappedBy = "programVersion", cascade = CascadeType.ALL)
    private List<Shortcut> shortcuts;

    @Version
    private long version;

    private int osType;

    private String versionText;

    public long getId() {
        return id;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public int getOsType() {
        return osType;
    }

    public void setOsType(int osType) {
        this.osType = osType;
    }

    public String getVersionText() {
        return versionText;
    }

    public void setVersionText(String versionText) {
        this.versionText = versionText;
    }
}

