package com.migrantcommunity.language.repository;

import com.migrantcommunity.language.entity.UserLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLanguageRepository extends JpaRepository<UserLanguage, Long> {
    
    List<UserLanguage> findByUserId(Long userId);
    
    List<UserLanguage> findByLanguageId(Long languageId);
    
    @Query("SELECT ul FROM UserLanguage ul WHERE ul.user.id = :userId AND ul.primary = true")
    Optional<UserLanguage> findPrimaryLanguageByUserId(@Param("userId") Long userId);
    
    @Query("SELECT ul FROM UserLanguage ul WHERE ul.user.id = :userId AND ul.language.id = :languageId")
    Optional<UserLanguage> findByUserIdAndLanguageId(@Param("userId") Long userId, @Param("languageId") Long languageId);
    
    boolean existsByUserIdAndLanguageId(Long userId, Long languageId);
    
    void deleteByUserIdAndLanguageId(Long userId, Long languageId);
}
