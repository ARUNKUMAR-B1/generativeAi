package com.onlinenews.onlinenews.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Table(name="article_table")
@Entity
@Data
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String tittle;
    String content;
    String category;
    LocalDateTime localDateTime;
}
