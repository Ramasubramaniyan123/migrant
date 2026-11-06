package com.migrantcommunity.language.service;

import com.migrantcommunity.language.dto.Language;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminLanguageService {
    private final List<Language> languages = new ArrayList<>();
    public AdminLanguageService() { seed(); }
    private void seed() {
        languages.add(new Language("lang_1","Hindi","हिन्दी","hi",true,1820,12));
        languages.add(new Language("lang_2","Tamil","தமிழ்","ta",true,620,5));
        languages.add(new Language("lang_3","Telugu","తెలుగు","te",true,540,4));
        languages.add(new Language("lang_4","Bengali","বাংলা","bn",true,480,3));
        languages.add(new Language("lang_5","Marathi","मराठी","mr",false,420,2));
    }
    public List<Language> list() { return new ArrayList<>(languages); }
    public Language create(String name,String nativeName,String code) {
        String c=code.trim().toLowerCase();
        if (languages.stream().anyMatch(l->l.code().equals(c))) throw new IllegalArgumentException("A language with this code already exists");
        Language l=new Language("lang_"+(languages.size()+1),name.trim(),nativeName.trim(),c,true,0,0);
        languages.add(l); return l;
    }
    public Language update(String id,String name,String nativeName,String code,Boolean isActive) {
        Language l=getById(id);
        Language u=new Language(l.id(), name!=null?name:l.name(), nativeName!=null?nativeName:l.nativeName(), code!=null?code.trim().toLowerCase():l.code(), isActive!=null?isActive:l.isActive(), l.userCount(), l.communityCount());
        replace(u); return u;
    }
    public Language setActive(String id,boolean isActive){ return update(id,null,null,null,isActive); }
    public Language getById(String id){ return languages.stream().filter(l->l.id().equals(id)).findFirst().orElseThrow(()->new IllegalArgumentException("Language not found")); }
    public static record LangStats(long total,long active,long totalUsers){}
    public LangStats getStats(){ return new LangStats(languages.size(),languages.stream().filter(Language::isActive).count(),languages.stream().mapToLong(Language::userCount).sum()); }
    private void replace(Language l){ for(int i=0;i<languages.size();i++) if(languages.get(i).id().equals(l.id())){languages.set(i,l);break;} }
}
