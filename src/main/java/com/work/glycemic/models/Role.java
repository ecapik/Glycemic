package com.work.glycemic.models;

import com.work.glycemic.models.User;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rid;

    private String name;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;

}