package com.work.glycemic.services;

import com.work.glycemic.models.Role;
import com.work.glycemic.models.User;
import com.work.glycemic.repositories.RoleRepository;
import com.work.glycemic.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServices extends SimpleUrlLogoutSuccessHandler implements UserDetailsService {

    final RoleRepository rRepo;
    final UserRepository uRepo;

    public UserServices(RoleRepository rRepo, UserRepository uRepo) {
        this.rRepo = rRepo;
        this.uRepo = uRepo;
    }


    // User Login Method
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = null;
        Optional<User> oUser = uRepo.findByEmailEqualsIgnoreCase(email);
        if (oUser.isPresent()){
            User u = oUser.get();
            userDetails = new org.springframework.security.core.userdetails.User(
                    u.getEmail(),
                    u.getPassword(),
                    u.isEnabled(),
                    u.isTokenExpired(),
                    true,
                    true,
                    getAuthorities(u.getRoles())

            );
        }
        throw new UsernameNotFoundException("User name not found!");
    }

    private List<GrantedAuthority> getAuthorities (List<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority( role.getName() ));
        }
        return authorities;
    }

    // Logout Listener -> Method
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        super.onLogoutSuccess(request, response, authentication);
    }
}
