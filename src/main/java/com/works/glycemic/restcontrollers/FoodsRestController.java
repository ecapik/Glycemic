package com.works.glycemic.restcontrollers;

import com.works.glycemic.models.Foods;
import com.works.glycemic.services.FoodService;
import com.works.glycemic.utils.REnum;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/foods")
public class FoodsRestController {

    final FoodService foodService;
    public FoodsRestController(FoodService foodService) {
        this.foodService = foodService;
    }

    // Foods Save
    @PostMapping("/save")
    public Map<REnum, Object> save(@RequestBody Foods foods) {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        Foods f = foodService.foodsSave(foods);
        if ( f == null ) {
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Bu ürün daha önce kayıt edilmiş");
            hm.put(REnum.result, f);
        }else {
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Ürün kayıt başarılı");
            hm.put(REnum.result, f);
        }
        return hm;
    }


    // foods List
    @GetMapping("/list")
    public Map<REnum, Object> list() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true);
        hm.put(REnum.message, "Ürün Listesi");
        hm.put(REnum.result, foodService.foodsList() );
        return hm;
    }


    // foods List
    @GetMapping("/userFoodList")
    public Map<REnum, Object> userFoodList() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true);
        hm.put(REnum.message, "Ürün Listesi");
        hm.put(REnum.result, foodService.userFoodList());
        return hm;
    }

    @DeleteMapping("/userDelete/{strIndex}")
    public Map<String, Object> delete(@PathVariable String strIndex){
        return foodService.userDelete(strIndex);
    }


    @PutMapping("/foodUpdate")
    public Map<String, Object> foodUpdate(@RequestBody Foods foods){

        return foodService.updateFood(foods);

    }
}
