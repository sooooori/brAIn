package com.ssafy.brAIn.conferenceroom.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generatePdf(String reportContent) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();

            // PDF에 제목 추가
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Meeting Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // 빈 줄 추가
            document.add(new Paragraph(" "));

            // 보고서 내용 추가
            Font contentFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
            Paragraph content = new Paragraph(reportContent, contentFont);
            document.add(content);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating PDF", e);
        }

        return byteArrayOutputStream.toByteArray();
    }
}
