package com.gym.memberservice.kafka;
import com.gym.memberservice.model.Member;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import member.events.MemberEvent;

@Service
public class KafkaProducer {

  private static final Logger log = LoggerFactory.getLogger(
      KafkaProducer.class);
  private final KafkaTemplate<String, byte[]> kafkaTemplate;

  public KafkaProducer(KafkaTemplate<String, byte[]> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendEvent(Member member) {
    MemberEvent event = MemberEvent.newBuilder()
        .setMemberId(member.getId().toString())
        .setName(member.getName())
        .setEmail(member.getEmail())
        .setEventType("MEMBER_CREATED")
        .setMembershipPlan(member.getMembershipPlan().name())
        .setMembershipStatus(member.getMembershipStatus().name())
        .build();

    try {
      kafkaTemplate.send("member", event.toByteArray());
    } catch (Exception e) {
      log.error("Error sending MemberCreated event: {}", event);
    }
  }
}
