package com.migrantcommunity.language.repository;

import com.migrantcommunity.language.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    
    Optional<Language> findByCode(String code);
    
    Optional<Language> findByName(String name);
    
    boolean existsByCode(String code);
    
    boolean existsByName(String name);
}
