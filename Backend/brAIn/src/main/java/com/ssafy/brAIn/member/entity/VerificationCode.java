package com.ssafy.brAIn.member.entity;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class VerificationCode implements Serializable {
    private String code;
    private LocalDateTime createAt;
    private int expiryTime; // 만료 시각을 5분으로 설정

    // 시간 만료
    public boolean isExpired(LocalDateTime now) {
        return now.isAfter(createAt.plusMinutes(expiryTime));
    }

    // 시간 만료 메시지
    public String generateCodeMessage() {
        LocalDateTime expiredAt = createAt.plusMinutes(expiryTime);
        boolean expired = LocalDateTime.now().isAfter(expiredAt);
        String formattedExpiredAt = createAt
                .plusMinutes(expiryTime)
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return expired ?
                String.format(
                        "[인증 코드] \n%s\n만료 시각 : %s\n만료되었습니다.",
                        code, formattedExpiredAt
                ) :
                String.format(
                        "[인증 코드] \n%s\n만료 시각 : %s",
                        code, formattedExpiredAt
                );
    }
}