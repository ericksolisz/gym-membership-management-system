package com.gym.memberservice.dto;

import com.gym.memberservice.dto.validators.CreateMemberValidationGroup;
import com.gym.memberservice.model.MembershipPlan;
import com.gym.memberservice.model.MembershipStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MemberRequestDTO {

  @NotBlank(message = "Name is required")
  @Size(max = 100, message = "Name cannot exceed 100 characters")
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Email should be valid")
  private String email;

  @NotBlank(message = "Address is required")
  private String address;

  @NotBlank(message = "Date of birth is required")
  private String dateOfBirth;

  @NotBlank(groups = CreateMemberValidationGroup.class, message =
      "Joined date is required")
  private String joinedDate;

  @NotNull(message = "Membership plan is required")
  private MembershipPlan membershipPlan;

  private MembershipStatus membershipStatus;

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
