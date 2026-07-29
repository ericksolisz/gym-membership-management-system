package com.gym.memberservice.mapper;

import com.gym.memberservice.dto.MemberRequestDTO;
import com.gym.memberservice.dto.MemberResponseDTO;
import com.gym.memberservice.model.Member;
import com.gym.memberservice.model.MembershipStatus;
import java.time.LocalDate;

public class MemberMapper {
  public static MemberResponseDTO toDTO(Member member) {
    MemberResponseDTO memberDTO = new MemberResponseDTO();
    memberDTO.setId(member.getId().toString());
    memberDTO.setName(member.getName());
    memberDTO.setAddress(member.getAddress());
    memberDTO.setEmail(member.getEmail());
    memberDTO.setDateOfBirth(member.getDateOfBirth().toString());
    memberDTO.setJoinedDate(member.getJoinedDate().toString());
    memberDTO.setMembershipPlan(member.getMembershipPlan());
    memberDTO.setMembershipStatus(member.getMembershipStatus());

    return memberDTO;
  }

  public static Member toModel(MemberRequestDTO memberRequestDTO) {
    Member member = new Member();
    member.setName(memberRequestDTO.getName());
    member.setAddress(memberRequestDTO.getAddress());
    member.setEmail(memberRequestDTO.getEmail());
    member.setDateOfBirth(LocalDate.parse(memberRequestDTO.getDateOfBirth()));
    member.setJoinedDate(LocalDate.parse(memberRequestDTO.getJoinedDate()));
    member.setMembershipPlan(memberRequestDTO.getMembershipPlan());
    member.setMembershipStatus(memberRequestDTO.getMembershipStatus() == null
        ? MembershipStatus.ACTIVE
        : memberRequestDTO.getMembershipStatus());
    return member;
  }
}
