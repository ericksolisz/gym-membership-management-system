package com.gym.memberservice.controller;

import com.gym.memberservice.dto.MemberRequestDTO;
import com.gym.memberservice.dto.MemberResponseDTO;
import com.gym.memberservice.dto.validators.CreateMemberValidationGroup;
import com.gym.memberservice.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.groups.Default;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
@Tag(name = "Member", description = "API for managing Members")
public class MemberController {

  private final MemberService memberService;

  public MemberController(MemberService memberService) {
    this.memberService = memberService;
  }

  @GetMapping
  @Operation(summary = "Get Members")
  public ResponseEntity<List<MemberResponseDTO>> getMembers() {
    List<MemberResponseDTO> members = memberService.getMembers();
    return ResponseEntity.ok().body(members);
  }

  @PostMapping
  @Operation(summary = "Create a new Member")
  public ResponseEntity<MemberResponseDTO> createMember(
      @Validated({Default.class, CreateMemberValidationGroup.class})
      @RequestBody MemberRequestDTO memberRequestDTO) {

    MemberResponseDTO memberResponseDTO = memberService.createMember(
        memberRequestDTO);

    return ResponseEntity.ok().body(memberResponseDTO);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update a Member")
  public ResponseEntity<MemberResponseDTO> updateMember(@PathVariable UUID id,
      @Validated({Default.class}) @RequestBody MemberRequestDTO memberRequestDTO) {

    MemberResponseDTO memberResponseDTO = memberService.updateMember(id,
        memberRequestDTO);

    return ResponseEntity.ok().body(memberResponseDTO);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete a Member")
  public ResponseEntity<Void> deleteMember(@PathVariable UUID id) {
    memberService.deleteMember(id);
    return ResponseEntity.noContent().build();
  }
}
