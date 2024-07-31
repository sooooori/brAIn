package com.ssafy.brAIn.member.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.List;
import java.util.Random;

@Getter
@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;
    @Value("${cloud.aws.region.static}")
    private String region;
    private final S3Presigner s3Presigner;
    private final S3Client s3Client;

    // 프리사인 된 URL 생성
    public String createPresignedUrl(String path) {
        var putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .build();
        var preSignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(3))
                .putObjectRequest(putObjectRequest)
                .build();
        return s3Presigner.presignPutObject(preSignRequest).url().toString();
    }

    // 랜덤 프로필 이미지 가져오기
    public String getRandomImageUrl() {
        // 'random-profile' 폴더의 객체 목록을 요청
        ListObjectsV2Request listObjectsReqManual = ListObjectsV2Request.builder()
                .bucket(bucket)
                // 'random-profile' 폴더에서만 검색
                .prefix("random-profile/")
                .build();

        ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(listObjectsReqManual);

        List<S3Object> objects = listObjectsResponse.contents();

        if (objects.isEmpty()) {
            throw new RuntimeException("No images found in the random-profile folder of the S3 bucket.");
        }

        // 랜덤 객체 선택
        Random rand = new Random();
        S3Object randomObject = objects.get(rand.nextInt(objects.size()));

        // 선택된 객체의 URL 생성
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, randomObject.key());
    }

    // 업로드 이미지 가져오기
    public void uploadUserImage(String key, byte[] fileData) {
        // 'profile-image' 폴더에 저장
        String userImagePath = "profile-image/" + key;
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(userImagePath)
                .build();

        // S3 버킷에 객체 업로드
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileData));
    }
}
