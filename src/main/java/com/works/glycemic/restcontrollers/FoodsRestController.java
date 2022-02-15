package com.works.glycemic.restcontrollers;

import com.works.glycemic.models.Foods;
import com.works.glycemic.services.FoodService;
import com.works.glycemic.utils.REnum;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
@RequestMapping("/foods")
public class FoodsRestController {

    final FoodService foodService;
    public FoodsRestController(FoodService foodService) {
        this.foodService = foodService;
    }


    public String TurkishCharacterToEnglish(String text)
    {
        char[] turkishChars = {'ı', 'ğ', 'İ', 'Ğ', 'ç', 'Ç', 'ş', 'Ş', 'ö', 'Ö', 'ü', 'Ü'};
        char[] englishChars = {'i', 'g', 'I', 'G', 'c', 'C', 's', 'S', 'o', 'O', 'u', 'U'};

        // Match chars
        for (int i = 0; i < turkishChars.length; i++)
            text = text.replace(turkishChars[i], englishChars[i]);

        return text;
    }

    // Foods Save
    @PostMapping("/save")
    public Map<REnum, Object> save(@RequestBody Foods foods) throws UnsupportedEncodingException {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        String after = foods.getName().trim().replaceAll(" +", " ");
        foods.setName(after);
        String text = TurkishCharacterToEnglish(foods.getName());
        foods.setUrl(URLEncoder.encode(text, "UTF-8").replace("-", "%20").toLowerCase(Locale.ROOT));
        foods.setUrl(foods.getUrl().replace("+","-"));

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
    @Cacheable("foods_list")
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

    // foods List
    @GetMapping("/adminWaitFoodList")
    public Map<REnum, Object> adminWaitFoodList() {
        Map<REnum, Object> hm = new LinkedHashMap<>();
        hm.put(REnum.status, true);
        hm.put(REnum.message, "Ürün Listesi");
        hm.put(REnum.result, foodService.adminWaitFoodList());
        return hm;
    }



   /* @DeleteMapping("/userDelete/{strIndex}")
    public Map<String, Object> delete(@PathVariable String strIndex){
        return foodService.userDelete(strIndex);
    }*/

    @DeleteMapping("/foodDelete")
    public Map<REnum, Object> foodDelete(@RequestParam long gid) {
        return foodService.foodDelete(gid);
    }

    @PutMapping("/foodUpdate")
    public Map<REnum, Object> foodUpdate(@RequestBody Foods foods) throws UnsupportedEncodingException {
        String after = foods.getName().trim().replaceAll(" +", " ");
        foods.setName(after);
        String text = TurkishCharacterToEnglish(foods.getName());
        foods.setUrl(URLEncoder.encode(text, "UTF-8").replace("-", "%20").toLowerCase(Locale.ROOT));
        foods.setUrl(foods.getUrl().replace("+","-"));
        return foodService.userUpdateFood(foods);

    }

    @GetMapping("detail/{url}")
    public Map<REnum, Object> singleFoodUrl(@PathVariable String url){
        Map<REnum, Object> hm = new LinkedHashMap<>();
        Optional<Foods> oFoods = foodService.singleFoodUrl(url);
        if (oFoods.isPresent() ) {
            hm.put(REnum.status, true);
            hm.put(REnum.message, "Ürün detay alındı");
            hm.put(REnum.result, oFoods.get());
        }else {
            hm.put(REnum.status, false);
            hm.put(REnum.message, "Ürün detay bulunamadı");
            hm.put(REnum.result, null);
        }
        return hm;
    }
}
