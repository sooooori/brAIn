package com.ssafy.brAIn.stomp.controller;

import com.ssafy.brAIn.stomp.dto.GroupPost;
import com.ssafy.brAIn.stomp.service.MessageService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;


@Controller
public class MessageController {

    private final RabbitTemplate rabbitTemplate;
    private final MessageService messageService;

    public MessageController(RabbitTemplate rabbitTemplate, MessageService messageService) {
        this.rabbitTemplate = rabbitTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("step1.submit.{roomId}")
    public void submitPost(GroupPost groupPost, @DestinationVariable String roomId) {

        rabbitTemplate.convertAndSend("amq.topic","room." + roomId, groupPost);
        messageService.sendPost(roomId,groupPost);

    }

}
