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
import java.util.Set;

@Getter
@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;
    @Value("${spring.cloud.aws.region.static}")
    private String region;
    private final S3Presigner s3Presigner;
    private final S3Client s3Client;

    // 허용된 파일 확장자 목록
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "gif");

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

        // S3 버킷에서 객체 목록 가져오기
        ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(listObjectsReqManual);

        List<S3Object> objects = listObjectsResponse.contents();

        // 객체가 없는 경우 예외 처리
        if (objects.isEmpty()) {
            throw new RuntimeException("No images found in the random-profile folder of the S3 bucket.");
        }

        // 파일 이름이 있는 객체만 필터링
        List<S3Object> filteredObjects = objects.stream()
                .filter(obj -> obj.key().startsWith("random-profile/") && !obj.key().equals("random-profile/"))
                .toList();

        // 유효한 객체가 없는 경우 예외 처리
        if (filteredObjects.isEmpty()) {
            throw new RuntimeException("No valid images found in the random-profile folder of the S3 bucket.");
        }

        // 랜덤 객체 선택
        Random rand = new Random();
        S3Object randomObject = filteredObjects.get(rand.nextInt(filteredObjects.size()));

        // 선택된 객체의 URL 생성
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, randomObject.key());
    }

    // 프로필 이미지 업로드
    public void uploadUserImage(String key, byte[] fileData, String originalFilename) {
        // 파일 확장자 추출
        String fileExtension = getFileExtension(originalFilename).toLowerCase();

        // 허용된 확장자인지 확인
        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("Unsupported file extension: " + fileExtension);
        }

        // 파일 확장자에 따른 Content-Type 결정
        String contentType = getContentType(fileExtension);

        // S3에 파일 업로드 요청 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        // S3에 파일 업로드
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileData));
    }

    // 파일 확장자 추출
    private String getFileExtension(String fileName) {
        // 파일 이름이 null이거나 확장자가 없는 경우 예외 처리
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            throw new IllegalArgumentException("Invalid file name");
        }
        // 확장자 추출
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    // Content-Type을 파일 확장자에 따라 결정하는 메서드
    private String getContentType(String fileExtension) {
        return switch (fileExtension.toLowerCase()) {
            // 파일 확장자에 따른 Content-Type 매핑
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "gif" -> "image/gif";
            default -> throw new IllegalArgumentException("Unsupported file extension: " + fileExtension);
        };
    }
}
