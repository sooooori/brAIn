package com.ssafy.brAIn.openvidu.controller;

import com.ssafy.brAIn.openvidu.service.OpenViduService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class OpenViduController {

    @Autowired
    private OpenViduService openViduService;

//    @PostMapping("/sessions")
//    public String createSession(@RequestParam(required = false) String sessionId) {
//        try {
//            if (sessionId == null || sessionId.isEmpty()) {
//                return openViduService.createSession();
//            } else {
//                return openViduService.createSession(sessionId);
//            }
//        } catch (Exception e) {
//            return "Error creating session: " + e.getMessage();
//        }
//    }
//
//    @PostMapping("/sessions/{sessionId}/tokens")
//    public String createToken(@PathVariable String sessionId) {
//        try {
//            return openViduService.createToken(sessionId);
//        } catch (Exception e) {
//            return "Error creating token: " + e.getMessage();
//        }
//    }
}
