package com.works.glycemic.services;

import com.works.glycemic.config.AuditAwareConfig;
import com.works.glycemic.models.Foods;
import com.works.glycemic.repositories.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FoodService {

    final FoodRepository fRepo;
    final AuditAwareConfig auditAwareConfig;
    public FoodService(FoodRepository fRepo, AuditAwareConfig auditAwareConfig) {
        this.fRepo = fRepo;
        this.auditAwareConfig = auditAwareConfig;
    }


    // food save
    public Foods foodsSave( Foods foods ) {
        Optional<Foods> oFoods = fRepo.findByNameEqualsIgnoreCase(foods.getName());
        if (oFoods.isPresent() ) {
            return null;
        }else {
            foods.setEnabled(false);
            return fRepo.save(foods);
        }
    }

    // food list
    public List<Foods> foodsList() {
        return fRepo.findAll();
    }


    // user food list
    public List<Foods> userFoodList() {
        Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();
        if (oUserName.isPresent() ) {

            return fRepo.findByCreatedByEqualsIgnoreCase( oUserName.get() );


        }else {
            return new ArrayList<Foods>();
        }


    }

    public Map<String, Object>  userDelete(String strIndex) {
        Map<String, Object> hm = new LinkedHashMap<>();
        long cuid = Integer.parseInt(strIndex);
        Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();

        Optional<Foods> f = fRepo.findById(cuid);
        if(f.get().getCreatedBy() == oUserName.get()){

            hm.put("status", true);
            fRepo.deleteById(cuid);
        }else {

            hm.put("status", false);
        }
        return hm;
    }


    public Map<String, Object> updateFood(Foods foods) {
        Map<String, Object> hm = new LinkedHashMap<>();
        long cuid = foods.getGid();
        Optional<String> oUserName = auditAwareConfig.getCurrentAuditor();

        Foods f = fRepo.getById(cuid);


        if(f.getCreatedBy() == oUserName.get()){
            f.setCid(foods.getCid());
            f.setName(foods.getName());
            f.setGlycemicindex(foods.getGlycemicindex());
            f.setImage(foods.getImage());
            f.setSource(foods.getSource());
            f.setEnabled(foods.isEnabled());
            fRepo.save(f);
            hm.put("status", true);
        }else{
            hm.put("status", false);
        }

        return hm;
    }
}
