package com.gym.memberservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.gym.memberservice.dto.MemberRequestDTO;
import com.gym.memberservice.dto.MemberResponseDTO;
import com.gym.memberservice.exception.EmailAlreadyExistsException;
import com.gym.memberservice.exception.MemberNotFoundException;
import com.gym.memberservice.grpc.BillingServiceGrpcClient;
import com.gym.memberservice.kafka.KafkaProducer;
import com.gym.memberservice.model.Member;
import com.gym.memberservice.model.MembershipPlan;
import com.gym.memberservice.model.MembershipStatus;
import com.gym.memberservice.repository.MemberRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MemberServiceTests {

  private static final UUID MEMBER_ID =
      UUID.fromString("123e4567-e89b-12d3-a456-426614174000");

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private BillingServiceGrpcClient billingServiceGrpcClient;

  @Mock
  private KafkaProducer kafkaProducer;

  @InjectMocks
  private MemberService memberService;

  @Test
  void createsActiveMemberAndNotifiesDownstreamServices() {
    MemberRequestDTO request = request();
    when(memberRepository.save(any(Member.class))).thenAnswer(invocation -> {
      Member member = invocation.getArgument(0);
      member.setId(MEMBER_ID);
      return member;
    });

    MemberResponseDTO response = memberService.createMember(request);

    assertThat(response.getMembershipStatus()).isEqualTo(MembershipStatus.ACTIVE);
    assertThat(response.getMembershipPlan()).isEqualTo(MembershipPlan.PREMIUM);
    assertThat(response.getJoinedDate()).isEqualTo("2026-07-18");
    verify(billingServiceGrpcClient).createBillingAccount(
        MEMBER_ID.toString(), "Sam Carter", "sam.carter@example.com", "PREMIUM");
    verify(kafkaProducer).sendEvent(any(Member.class));
  }

  @Test
  void rejectsDuplicateEmailOnCreate() {
    MemberRequestDTO request = request();
    when(memberRepository.existsByEmail(request.getEmail())).thenReturn(true);

    assertThatThrownBy(() -> memberService.createMember(request))
        .isInstanceOf(EmailAlreadyExistsException.class);
  }

  @Test
  void updatesPlanWhilePreservingJoinDateAndStatusWhenOmitted() {
    Member existing = member();
    MemberRequestDTO request = request();
    request.setMembershipPlan(MembershipPlan.VIP);
    request.setMembershipStatus(null);
    request.setJoinedDate(null);
    when(memberRepository.findById(MEMBER_ID)).thenReturn(java.util.Optional.of(existing));
    when(memberRepository.save(existing)).thenReturn(existing);

    MemberResponseDTO response = memberService.updateMember(MEMBER_ID, request);

    assertThat(response.getMembershipPlan()).isEqualTo(MembershipPlan.VIP);
    assertThat(response.getMembershipStatus()).isEqualTo(MembershipStatus.ACTIVE);
    assertThat(response.getJoinedDate()).isEqualTo("2024-01-10");
  }

  @Test
  void updatesMembershipStatusWhenProvided() {
    Member existing = member();
    MemberRequestDTO request = request();
    request.setMembershipStatus(MembershipStatus.PAUSED);
    when(memberRepository.findById(MEMBER_ID)).thenReturn(java.util.Optional.of(existing));
    when(memberRepository.save(existing)).thenReturn(existing);

    MemberResponseDTO response = memberService.updateMember(MEMBER_ID, request);

    assertThat(response.getMembershipStatus()).isEqualTo(MembershipStatus.PAUSED);
  }

  @Test
  void reportsMissingMemberOnUpdate() {
    when(memberRepository.findById(MEMBER_ID)).thenReturn(java.util.Optional.empty());

    assertThatThrownBy(() -> memberService.updateMember(MEMBER_ID, request()))
        .isInstanceOf(MemberNotFoundException.class);
  }

  @Test
  void returnsAllMembers() {
    when(memberRepository.findAll()).thenReturn(List.of(member()));

    List<MemberResponseDTO> members = memberService.getMembers();

    assertThat(members).hasSize(1);
    assertThat(members.getFirst().getId()).isEqualTo(MEMBER_ID.toString());
  }

  @Test
  void deletesMemberById() {
    memberService.deleteMember(MEMBER_ID);

    verify(memberRepository).deleteById(MEMBER_ID);
  }

  private MemberRequestDTO request() {
    MemberRequestDTO request = new MemberRequestDTO();
    request.setName("Sam Carter");
    request.setEmail("sam.carter@example.com");
    request.setAddress("123 Main Street");
    request.setDateOfBirth("1995-09-09");
    request.setJoinedDate("2026-07-18");
    request.setMembershipPlan(MembershipPlan.PREMIUM);
    return request;
  }

  private Member member() {
    Member member = new Member();
    member.setId(MEMBER_ID);
    member.setName("Sam Carter");
    member.setEmail("sam.carter@example.com");
    member.setAddress("123 Main Street");
    member.setDateOfBirth(LocalDate.parse("1995-09-09"));
    member.setJoinedDate(LocalDate.parse("2024-01-10"));
    member.setMembershipPlan(MembershipPlan.PREMIUM);
    member.setMembershipStatus(MembershipStatus.ACTIVE);
    return member;
  }
}
