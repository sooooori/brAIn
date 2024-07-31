package com.ssafy.brAIn.member.service;

import com.ssafy.brAIn.auth.jwt.JwtUtil;
import com.ssafy.brAIn.exception.BadRequestException;
import com.ssafy.brAIn.member.dto.MemberRequest;
import com.ssafy.brAIn.member.dto.MemberResponse;
import com.ssafy.brAIn.member.entity.Member;
import com.ssafy.brAIn.member.repository.MemberRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final S3Service s3Service;

    // 회원가입
    public void join(MemberRequest memberRequest) {
        // 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(memberRequest.getPassword());

        // 랜덤 이미지 URL 가져오기
        String profileImageUrl = s3Service.getRandomImageUrl();

        // 회원정보 저장
        Member member = memberRequest.toEntity(encodedPassword);
        member.updatePhoto(profileImageUrl);
        memberRepository.save(member);
    }

    // 프로필 이미지 변경
    public void uploadUserImage(String token, byte[] fileData, String originalFilename) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Member not found"));

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String key = "profile-image/" + email + fileExtension;
        s3Service.uploadUserImage(key, fileData);
        String imageUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", s3Service.getBucket(), s3Service.getRegion(), key);
        member.updatePhoto(imageUrl);
        memberRepository.save(member);
    }

    // 프로필 이미지가 S3에 존재할 때 업데이트
    public void updateUserImageByUrl(String token, String imageUrl) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Member not found"));

        member.updatePhoto(imageUrl);
        memberRepository.save(member);
    }

    // 이메일 중복 확인
    public void emailCheck(String email) {
        // 이메일 중복 검사
        if (memberRepository.existsMemberByEmail(email)) {
            throw new BadRequestException("Email is already in use");
        }
    }


    // 일반 로그인 유저를 위한 토큰 발급 메서드
    public String login(Authentication authentication, HttpServletResponse response) {

        // 인증된 사용자 정보 가져옴
        Member member = (Member) authentication.getPrincipal();

        // accessToken, refreshToken 생성
        String accessToken = JwtUtil.createAccessToken(authentication);
        String refreshToken = JwtUtil.createRefreshToken(authentication);

        // 사용자 DB에 RefreshToken 저장
        member.updateRefreshToken(refreshToken);
        memberRepository.save(member);

        // RefreshToken 쿠키에 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setMaxAge(1209600); // 14일 설정
        cookie.setHttpOnly(true); // HttpOnly 설정
        cookie.setPath("/"); // 쿠키 경로 설정
        response.addCookie(cookie);

        // 생성된 accessToken 반환
        return accessToken;
    }

    // refreshToken 저장
    public void updateRefreshToken(String email, String refreshToken) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        member.updateRefreshToken(refreshToken);
        memberRepository.save(member);
    }

    // 이메일로 사용자 정보 조회
    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    // 회원정보 조회
    public MemberResponse getMember(String token) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return MemberResponse.fromEntity(member);
    }

    // 회원 탈퇴
    public void deleteMember(String token, String password) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        // 비밀번호 일치 여부 확인
        if (!bCryptPasswordEncoder.matches(password ,member.getPassword())) {
            throw new BadRequestException("Wrong password");
        }
        // 회원정보 삭제
        memberRepository.delete(member);
    }

    // 회원 정보(프로필 사진) 수정
    public void updatePhoto(String token, String photo) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        member.updatePhoto(photo);
        memberRepository.save(member);
    }

    // 비밀번호 재설정
    public void resetPassword(String token, String newPassword) {
        String email = JwtUtil.getEmail(token);
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // 새로운 비밀번호 암호화 및 저장
        String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
        member.resetPassword(encodedPassword);
        memberRepository.save(member);
    }
}