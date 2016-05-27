package org.opentools.carwars.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;

/**
 * Security setup
 * Most pages allow unsecured; only stuff under /api/secure requires previous login
 * Since login will be handled by the app and most calls will
 */
@EnableWebSecurity()
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private WebLoginSuccess loginSuccess;
    @Autowired
    private PasswordConfig password;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CookieCsrfTokenRepository csrf = new CookieCsrfTokenRepository();
        csrf.setCookieHttpOnly(false);
        http
            .authorizeRequests()
                .antMatchers("/api/secure/**/*").authenticated()
                .antMatchers("/api/admin/**").access("hasRole('ROLE_ADMIN')")
                .anyRequest().permitAll()
                .and()
            .formLogin()
                .loginPage("/login")
                .successHandler(loginSuccess)
                .failureHandler(new AuthenticationFailureHandler() {
                    @Override
                    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
                        e.printStackTrace();
                        response.setStatus(200);
                    }
                })
                .and()
            .logout()
                .deleteCookies("author_email", "author_name", "author_design_sig", "role")
                .logoutSuccessHandler(new LogoutSuccessHandler() {
                    @Override
                    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                        response.setStatus(200);
                    }
                })
                .and()
            .csrf()
				.csrfTokenRepository(csrf)
                .and()
            .exceptionHandling()
                .authenticationEntryPoint(new Http403ForbiddenEntryPoint());
    }

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth, DataSource dataSource) throws Exception {
        final ShaPasswordEncoder sha = new ShaPasswordEncoder(256);
        sha.setEncodeHashAsBase64(true);
        PasswordEncoder passwordEncoder = new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return sha.encodePassword(password.getPrefix()+charSequence, null);
            }

            @Override
            public boolean matches(CharSequence enteredPassword, String storedHash) {
                return encode(enteredPassword).equals(storedHash);
            }
        };
        auth.jdbcAuthentication()
                .dataSource(dataSource)
                .passwordEncoder(passwordEncoder)
                .usersByUsernameQuery(
                        "select email, password, confirmed from car_wars_users where email=?")
                .authoritiesByUsernameQuery(
                        "select email, role from car_wars_users where email=?");
    }
}
