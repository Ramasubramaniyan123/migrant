package com.migrantcommunity.location.service;

import com.migrantcommunity.location.dto.City;
import com.migrantcommunity.location.dto.Locality;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminLocationService {
    private final List<City> cities = new ArrayList<>();
    private final List<Locality> localities = new ArrayList<>();

    public AdminLocationService() { seed(); }
    private void seed() {
        cities.add(new City("city_1","Mumbai","Maharashtra",1520,8));
        cities.add(new City("city_2","Delhi","Delhi",980,5));
        cities.add(new City("city_3","Bengaluru","Karnataka",760,6));
        localities.add(new Locality("loc_1","Andheri","city_1","Mumbai",420));
        localities.add(new Locality("loc_2","Bandra","city_1","Mumbai",310));
        localities.add(new Locality("loc_3","Dwarka","city_2","Delhi",280));
    }
    public List<City> listCities() { return new ArrayList<>(cities); }
    public List<Locality> listLocalities(String cityId) {
        if (cityId == null || cityId.isBlank()) return new ArrayList<>(localities);
        return localities.stream().filter(l->l.cityId().equals(cityId)).collect(Collectors.toList());
    }
    public Locality createLocality(String name, String cityId) {
        City city = cities.stream().filter(c->c.id().equals(cityId)).findFirst().orElseThrow(()->new IllegalArgumentException("City not found"));
        Locality l = new Locality("loc_"+(localities.size()+1), name.trim(), city.id(), city.name(), 0);
        localities.add(l);
        // update city localityCount
        City uc = new City(city.id(), city.name(), city.state(), city.userCount(), city.localityCount()+1);
        replaceCity(uc);
        return l;
    }
    public Locality updateLocality(String id, String name) {
        Locality l = localities.stream().filter(x->x.id().equals(id)).findFirst().orElseThrow(()->new IllegalArgumentException("Locality not found"));
        Locality u = new Locality(l.id(), name!=null?name.trim():l.name(), l.cityId(), l.cityName(), l.userCount());
        replaceLocality(u); return u;
    }
    public static record LocStats(long totalCities,long totalLocalities,long usersInTrackedLocations){}
    public LocStats getStats() {
        return new LocStats(cities.size(), localities.size(), cities.stream().mapToLong(City::userCount).sum());
    }
    private void replaceCity(City c){ for(int i=0;i<cities.size();i++) if(cities.get(i).id().equals(c.id())){cities.set(i,c);break;} }
    private void replaceLocality(Locality l){ for(int i=0;i<localities.size();i++) if(localities.get(i).id().equals(l.id())){localities.set(i,l);break;} }
}
