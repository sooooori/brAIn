package com.ssafy.brAIn.conferenceroom.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    @Autowired
    private ConferenceRoomService conferenceRoomService;

    public byte[] generatePdf(Integer roomId) {
        // 메모리에 저장된 회의 요약 결과를 가져옴
        String reportContent = conferenceRoomService.generateMeetingReport(roomId);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            // 한글 폰트 설정
            BaseFont baseFont = BaseFont.createFont("src/main/resources/fonts/NanumGothic-Regular.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font contentFont = new Font(baseFont, 12, Font.NORMAL);

            // PDF에 제목 추가
            Paragraph title = new Paragraph("Meeting Report", new Font(baseFont, 18, Font.BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // 빈 줄 추가
            document.add(new Paragraph(" "));

            // 보고서 내용 추가
            Paragraph content = new Paragraph(reportContent, contentFont);
            document.add(content);

            document.close();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF", e);
        }

        return byteArrayOutputStream.toByteArray();
    }
}
