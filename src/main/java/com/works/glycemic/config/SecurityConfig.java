package com.works.glycemic.config;

import com.works.glycemic.services.UserService;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    final UserService service;
    public SecurityConfig(UserService service) {
        this.service = service;
    }

    // sql -> jpa query -> user control
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService((service)).passwordEncoder(service.encoder());
    }

    // hangi yöntemle giriş yapılarak, rollere göre hangi servis kullanılcak?
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic()
                .and()
                .authorizeHttpRequests()
                .antMatchers("/foods/save").hasRole("user")
                .antMatchers("/foods/userDelete/**").hasAnyRole("user", "admin")
                .antMatchers("/foods/foodUpdate/**").hasAnyRole("user", "admin")
                .antMatchers("/foods/userFoodList").hasAnyRole("user", "admin")
                .antMatchers("/foods/list").hasAnyRole("global","user", "admin")
                .antMatchers("/register/**").permitAll()
                .and()
                .csrf().disable()
                .formLogin().disable()
                .logout().logoutUrl("/logout").invalidateHttpSession(true);
    }


}