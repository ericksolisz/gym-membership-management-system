package com.gym.memberservice.dto;

import com.gym.memberservice.model.MembershipPlan;
import com.gym.memberservice.model.MembershipStatus;

public class MemberResponseDTO {
  private String id;
  private String name;
  private String email;
  private String address;
  private String dateOfBirth;
  private String joinedDate;
  private MembershipPlan membershipPlan;
  private MembershipStatus membershipStatus;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(String dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public String getJoinedDate() {
    return joinedDate;
  }

  public void setJoinedDate(String joinedDate) {
    this.joinedDate = joinedDate;
  }

  public MembershipPlan getMembershipPlan() {
    return membershipPlan;
  }

  public void setMembershipPlan(MembershipPlan membershipPlan) {
    this.membershipPlan = membershipPlan;
  }

  public MembershipStatus getMembershipStatus() {
    return membershipStatus;
  }

  public void setMembershipStatus(MembershipStatus membershipStatus) {
    this.membershipStatus = membershipStatus;
  }
}
