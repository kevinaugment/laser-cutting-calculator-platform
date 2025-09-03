/**
 * Team Management Service Tests
 * Comprehensive test suite for team management functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TeamManagementService, teamManagementService } from '../../services/teamManagementService';

describe('TeamManagementService', () => {
  let service: TeamManagementService;

  beforeEach(() => {
    service = new TeamManagementService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new TeamManagementService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new TeamManagementService({
        maxTeamsPerUser: 5,
        maxMembersPerTeam: 20,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('team management', () => {
    it('should create a new team', async () => {
      const teamData = {
        name: 'Test Team',
        description: 'A test team for unit testing',
        settings: {
          visibility: 'private' as const,
          allowMemberInvites: true,
          requireApprovalForPresets: false,
          defaultPresetVisibility: 'team' as const,
          maxMembers: 10,
          enableComments: true,
          enableRatings: true,
          autoArchiveInactivePresets: false,
        },
      };

      const team = await service.createTeam('user-123', teamData);

      expect(team).toBeDefined();
      expect(team.id).toBeDefined();
      expect(team.name).toBe('Test Team');
      expect(team.description).toBe('A test team for unit testing');
      expect(team.createdBy).toBe('user-123');
      expect(team.memberCount).toBe(1);
      expect(team.isActive).toBe(true);
    });

    it('should validate team name length', async () => {
      const teamData = {
        name: 'AB', // Too short
        description: 'Test description',
      };

      await expect(service.createTeam('user-123', teamData)).rejects.toThrow(
        'Team name must be between 3 and 50 characters'
      );
    });

    it('should get team by ID', async () => {
      const teamData = {
        name: 'Test Team',
        description: 'A test team',
      };

      const createdTeam = await service.createTeam('user-123', teamData);
      const retrievedTeam = await service.getTeam(createdTeam.id);

      expect(retrievedTeam).toBeDefined();
      expect(retrievedTeam?.id).toBe(createdTeam.id);
      expect(retrievedTeam?.name).toBe('Test Team');
    });

    it('should get user teams', async () => {
      const teamData1 = {
        name: 'Team 1',
        description: 'First team',
      };
      const teamData2 = {
        name: 'Team 2',
        description: 'Second team',
      };

      await service.createTeam('user-123', teamData1);
      await service.createTeam('user-123', teamData2);

      const userTeams = await service.getUserTeams('user-123');

      expect(userTeams).toHaveLength(2);
      expect(userTeams.map(t => t.name)).toContain('Team 1');
      expect(userTeams.map(t => t.name)).toContain('Team 2');
    });

    it('should update team information', async () => {
      const teamData = {
        name: 'Original Team',
        description: 'Original description',
      };

      const team = await service.createTeam('user-123', teamData);

      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedTeam = await service.updateTeam('user-123', team.id, {
        name: 'Updated Team',
        description: 'Updated description',
      });

      expect(updatedTeam.name).toBe('Updated Team');
      expect(updatedTeam.description).toBe('Updated description');
      expect(updatedTeam.updatedAt.getTime()).toBeGreaterThanOrEqual(team.createdAt.getTime());
    });

    it('should delete team (mark as inactive)', async () => {
      const teamData = {
        name: 'Team to Delete',
        description: 'This team will be deleted',
      };

      const team = await service.createTeam('user-123', teamData);
      const success = await service.deleteTeam('user-123', team.id);

      expect(success).toBe(true);

      const deletedTeam = await service.getTeam(team.id);
      expect(deletedTeam?.isActive).toBe(false);
    });

    it('should prevent non-owner from deleting team', async () => {
      const teamData = {
        name: 'Protected Team',
        description: 'Only owner can delete',
      };

      const team = await service.createTeam('user-123', teamData);

      await expect(service.deleteTeam('user-456', team.id)).rejects.toThrow(
        'Only team owner can delete the team'
      );
    });
  });

  describe('member management', () => {
    let team: any;

    beforeEach(async () => {
      const teamData = {
        name: 'Member Test Team',
        description: 'Team for testing member management',
      };
      team = await service.createTeam('owner-123', teamData);
    });

    it('should invite member to team', async () => {
      const inviteRequest = {
        teamId: team.id,
        email: 'newmember@example.com',
        role: 'editor' as const,
        message: 'Welcome to our team!',
      };

      const invitation = await service.inviteMember('owner-123', inviteRequest);

      expect(invitation).toBeDefined();
      expect(invitation.teamId).toBe(team.id);
      expect(invitation.email).toBe('newmember@example.com');
      expect(invitation.role).toBe('editor');
      expect(invitation.status).toBe('pending');
      expect(invitation.token).toBeDefined();
    });

    it('should accept team invitation', async () => {
      const inviteRequest = {
        teamId: team.id,
        email: 'newmember@example.com',
        role: 'editor' as const,
      };

      const invitation = await service.inviteMember('owner-123', inviteRequest);
      const member = await service.acceptInvitation('user-456', invitation.token);

      expect(member).toBeDefined();
      expect(member.teamId).toBe(team.id);
      expect(member.userId).toBe('user-456');
      expect(member.role).toBe('editor');
      expect(member.status).toBe('active');
    });

    it('should get team members', async () => {
      const members = await service.getTeamMembers(team.id);

      expect(members).toHaveLength(1); // Owner
      expect(members[0].userId).toBe('owner-123');
      expect(members[0].role).toBe('owner');
    });

    it('should update team member role', async () => {
      // First invite and accept a member
      const inviteRequest = {
        teamId: team.id,
        email: 'member@example.com',
        role: 'viewer' as const,
      };

      const invitation = await service.inviteMember('owner-123', inviteRequest);
      const member = await service.acceptInvitation('user-456', invitation.token);

      // Update member role
      const updateRequest = {
        teamId: team.id,
        memberId: member.id,
        role: 'editor' as const,
      };

      const updatedMember = await service.updateTeamMember('owner-123', updateRequest);

      expect(updatedMember.role).toBe('editor');
      expect(updatedMember.permissions).toContain('create_presets');
    });

    it('should remove team member', async () => {
      // First invite and accept a member
      const inviteRequest = {
        teamId: team.id,
        email: 'member@example.com',
        role: 'editor' as const,
      };

      const invitation = await service.inviteMember('owner-123', inviteRequest);
      const member = await service.acceptInvitation('user-456', invitation.token);

      // Remove member
      const success = await service.removeTeamMember('owner-123', team.id, member.id);

      expect(success).toBe(true);

      const members = await service.getTeamMembers(team.id);
      const removedMember = members.find(m => m.id === member.id);
      expect(removedMember?.status).toBe('inactive');
    });

    it('should prevent removing team owner', async () => {
      const members = await service.getTeamMembers(team.id);
      const owner = members.find(m => m.role === 'owner');

      await expect(
        service.removeTeamMember('owner-123', team.id, owner!.id)
      ).rejects.toThrow('Cannot remove team owner');
    });

    it('should prevent duplicate invitations', async () => {
      const inviteRequest = {
        teamId: team.id,
        email: 'duplicate@example.com',
        role: 'editor' as const,
      };

      await service.inviteMember('owner-123', inviteRequest);

      await expect(
        service.inviteMember('owner-123', inviteRequest)
      ).rejects.toThrow('Invitation already sent to this email');
    });
  });

  describe('permission management', () => {
    let team: any;
    let editorMember: any;

    beforeEach(async () => {
      const teamData = {
        name: 'Permission Test Team',
        description: 'Team for testing permissions',
      };
      team = await service.createTeam('owner-123', teamData);

      // Add an editor member
      const inviteRequest = {
        teamId: team.id,
        email: 'editor@example.com',
        role: 'editor' as const,
      };

      const invitation = await service.inviteMember('owner-123', inviteRequest);
      editorMember = await service.acceptInvitation('editor-456', invitation.token);
    });

    it('should check owner permissions', async () => {
      const hasManageTeam = await service.hasPermission('owner-123', team.id, 'manage_team');
      const hasCreatePresets = await service.hasPermission('owner-123', team.id, 'create_presets');

      expect(hasManageTeam).toBe(true);
      expect(hasCreatePresets).toBe(true);
    });

    it('should check editor permissions', async () => {
      const hasManageTeam = await service.hasPermission('editor-456', team.id, 'manage_team');
      const hasCreatePresets = await service.hasPermission('editor-456', team.id, 'create_presets');

      expect(hasManageTeam).toBe(false);
      expect(hasCreatePresets).toBe(true);
    });

    it('should get user permissions', async () => {
      const ownerPermissions = await service.getUserPermissions('owner-123', team.id);
      const editorPermissions = await service.getUserPermissions('editor-456', team.id);

      expect(ownerPermissions).toContain('manage_team');
      expect(ownerPermissions).toContain('create_presets');
      expect(editorPermissions).toContain('create_presets');
      expect(editorPermissions).not.toContain('manage_team');
    });

    it('should deny permissions for non-members', async () => {
      const hasPermission = await service.hasPermission('non-member-789', team.id, 'create_presets');
      expect(hasPermission).toBe(false);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle invalid team ID', async () => {
      const team = await service.getTeam('non-existent-id');
      expect(team).toBeNull();
    });

    it('should handle invalid invitation token', async () => {
      await expect(
        service.acceptInvitation('user-123', 'invalid-token')
      ).rejects.toThrow('Invalid invitation token');
    });

    it('should enforce team member limit', async () => {
      const customService = new TeamManagementService({
        maxMembersPerTeam: 2, // Very low limit for testing
      });

      const teamData = {
        name: 'Limited Team',
        description: 'Team with member limit',
        settings: {
          maxMembers: 2,
          visibility: 'private' as const,
          allowMemberInvites: true,
          requireApprovalForPresets: false,
          defaultPresetVisibility: 'team' as const,
          enableComments: true,
          enableRatings: true,
          autoArchiveInactivePresets: false,
        },
      };

      const team = await customService.createTeam('owner-123', teamData);

      // First invitation should succeed
      const invite1 = {
        teamId: team.id,
        email: 'member1@example.com',
        role: 'editor' as const,
      };
      const invitation1 = await customService.inviteMember('owner-123', invite1);

      // Accept the first invitation to reach the limit
      await customService.acceptInvitation('member1-user', invitation1.token);

      // Second invitation should fail (owner + 1 member = 2, at limit)
      const invite2 = {
        teamId: team.id,
        email: 'member2@example.com',
        role: 'editor' as const,
      };

      await expect(
        customService.inviteMember('owner-123', invite2)
      ).rejects.toThrow('Team has reached maximum member limit');
    });
  });
});
