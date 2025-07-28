package com.onlinenews.onlinenews.repo;

import com.onlinenews.onlinenews.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepo extends JpaRepository<Article,Long> {
}
