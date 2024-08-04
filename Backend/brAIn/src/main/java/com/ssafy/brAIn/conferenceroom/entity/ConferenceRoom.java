package com.ssafy.brAIn.conferenceroom.entity;

import com.ssafy.brAIn.util.CommonUtils;
import com.ssafy.brAIn.util.MeetingUrlGenerator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity // 엔티티로 지정
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ConferenceRoom {
    @Id // id 필드를 기본키로 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "step", nullable = false)
    private Step step;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "timer")
    private Date timer;

    @Column(name = "is_end")
    private Boolean isEnd;

    @Column(name = "conclusion")
    private String conclusion;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    @Column(name = "invite_code")
    private String inviteCode;

    @Column(name = "thread_id")
    private String threadId;

    @Column(name = "assistant_id")
    private String assistantId;

    @Column(name = "secure_id")
    private String secureId;

    @Column(name = "participate_url")
    private String participateUrl;

    @Builder
    public ConferenceRoom(String subject){
        this.subject = subject;
        this.step = Step.STEP_0;
        this.isEnd = false;
        this.startTime = new Date();
        this.inviteCode = CommonUtils.generateRandomMixStr(6,true);
        this.secureId = MeetingUrlGenerator.generateMeetingUrl();
        this.participateUrl = String.format("https://bardisue.store/v1/conferences/%s", this.secureId);
    }

    public ConferenceRoom update() {
        //setter가 없기에 update마다 함수를 만들 예정.
        return this;
    }

    public ConferenceRoom updateStep(Step step) {
        this.step = step;
        return this;
    }

    public ConferenceRoom updateAi(String AssistantId, String ThreadId) {
        this.assistantId = AssistantId;
        this.threadId = ThreadId;
        return this;
    }

    // 타이머 설정
    public void setTimer(int minutes) {
        long timerInMillis = minutes * 60 * 1000;
        this.timer = new Date(System.currentTimeMillis() + timerInMillis);
    }


    // 타이머 종료 확인
    public boolean isTimerExpired() {
        return timer != null && new Date().after(timer);
    }

}

// 빌더 패턴을 사용하면 객체를 유연하고 직관적으로 생성할 수 있음, 어느 필드에 어떤 값이 들어가는지 명시적으로 파악할 수 있음.