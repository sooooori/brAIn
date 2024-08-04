//package com.ssafy.brAIn.auth.oauth.kakao.controller;
//
//import com.ssafy.brAIn.auth.oauth.kakao.dto.KakaoLoginResponse;
//import com.ssafy.brAIn.auth.oauth.kakao.service.KakaoService;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.NoSuchElementException;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/v1/members")
//public class KakaoMemberController {
//
//    private final KakaoService kakaoService;
//
//    @GetMapping("/login/oauth/kakao")
//    public ResponseEntity<KakaoLoginResponse> kakaoLogin(@RequestParam String code, HttpServletRequest request){
//        try{
//            // 현재 도메인 확인
//            String currentDomain = request.getServerName();
//            return ResponseEntity.ok(kakaoService.kakaoLogin(code, currentDomain));
//        } catch (NoSuchElementException e) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Item Not Found");
//        }
//}
