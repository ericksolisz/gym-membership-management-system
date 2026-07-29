package com.gym.memberservice.service;

import com.gym.memberservice.dto.MemberRequestDTO;
import com.gym.memberservice.dto.MemberResponseDTO;
import com.gym.memberservice.exception.EmailAlreadyExistsException;
import com.gym.memberservice.exception.MemberNotFoundException;
import com.gym.memberservice.grpc.BillingServiceGrpcClient;
import com.gym.memberservice.kafka.KafkaProducer;
import com.gym.memberservice.mapper.MemberMapper;
import com.gym.memberservice.model.Member;
import com.gym.memberservice.repository.MemberRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

  private final MemberRepository memberRepository;
  private final BillingServiceGrpcClient billingServiceGrpcClient;
  private final KafkaProducer kafkaProducer;

  public MemberService(MemberRepository memberRepository,
      BillingServiceGrpcClient billingServiceGrpcClient,
      KafkaProducer kafkaProducer) {
    this.memberRepository = memberRepository;
    this.billingServiceGrpcClient = billingServiceGrpcClient;
    this.kafkaProducer = kafkaProducer;
  }

  public List<MemberResponseDTO> getMembers() {
    List<Member> members = memberRepository.findAll();

    return members.stream().map(MemberMapper::toDTO).toList();
  }

  public MemberResponseDTO createMember(MemberRequestDTO memberRequestDTO) {
    if (memberRepository.existsByEmail(memberRequestDTO.getEmail())) {
      throw new EmailAlreadyExistsException(
          "A member with this email " + "already exists"
              + memberRequestDTO.getEmail());
    }

    Member newMember = memberRepository.save(
        MemberMapper.toModel(memberRequestDTO));

    billingServiceGrpcClient.createBillingAccount(newMember.getId().toString(),
        newMember.getName(), newMember.getEmail(),
        newMember.getMembershipPlan().name());

    kafkaProducer.sendEvent(newMember);

    return MemberMapper.toDTO(newMember);
  }

  public MemberResponseDTO updateMember(UUID id,
      MemberRequestDTO memberRequestDTO) {

    Member member = memberRepository.findById(id).orElseThrow(
        () -> new MemberNotFoundException("Member not found with ID: " + id));

    if (memberRepository.existsByEmailAndIdNot(memberRequestDTO.getEmail(),
        id)) {
      throw new EmailAlreadyExistsException(
          "A member with this email " + "already exists"
              + memberRequestDTO.getEmail());
    }

    member.setName(memberRequestDTO.getName());
    member.setAddress(memberRequestDTO.getAddress());
    member.setEmail(memberRequestDTO.getEmail());
    member.setDateOfBirth(LocalDate.parse(memberRequestDTO.getDateOfBirth()));
    member.setMembershipPlan(memberRequestDTO.getMembershipPlan());
    if (memberRequestDTO.getMembershipStatus() != null) {
      member.setMembershipStatus(memberRequestDTO.getMembershipStatus());
    }

    Member updatedMember = memberRepository.save(member);
    return MemberMapper.toDTO(updatedMember);
  }

  public void deleteMember(UUID id) {
    memberRepository.deleteById(id);
  }
}
