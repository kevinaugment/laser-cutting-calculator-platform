/**
 * Team Management Service
 * Core team management functionality for collaborative parameter sharing
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type TeamPermission = 
  | 'manage_team' 
  | 'manage_members' 
  | 'manage_library' 
  | 'create_presets' 
  | 'edit_presets' 
  | 'delete_presets'
  | 'view_analytics'
  | 'manage_settings';

export interface Team {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
  memberCount: number;
  isActive: boolean;
  avatar?: string;
  tags: string[];
}

export interface TeamSettings {
  visibility: 'private' | 'public' | 'invite-only';
  allowMemberInvites: boolean;
  requireApprovalForPresets: boolean;
  defaultPresetVisibility: 'team' | 'public';
  maxMembers: number;
  enableComments: boolean;
  enableRatings: boolean;
  autoArchiveInactivePresets: boolean;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  permissions: TeamPermission[];
  joinedAt: Date;
  invitedBy: string;
  status: MemberStatus;
  lastActiveAt: Date;
  contributionScore: number;
  metadata?: Record<string, any>;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: InvitationStatus;
  token: string;
  message?: string;
  metadata?: Record<string, any>;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  settings?: Partial<TeamSettings>;
  initialMembers?: string[];
}

export interface InviteMemberRequest {
  teamId: string;
  email: string;
  role: TeamRole;
  message?: string;
}

export interface UpdateMemberRequest {
  teamId: string;
  memberId: string;
  role?: TeamRole;
  permissions?: TeamPermission[];
  status?: MemberStatus;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface TeamManagementServiceConfig {
  maxTeamsPerUser: number;
  maxMembersPerTeam: number;
  invitationExpiryDays: number;
  enableTeamAnalytics: boolean;
  requireEmailVerification: boolean;
  defaultTeamSettings: TeamSettings;
}

const DEFAULT_CONFIG: TeamManagementServiceConfig = {
  maxTeamsPerUser: 10,
  maxMembersPerTeam: 100,
  invitationExpiryDays: 7,
  enableTeamAnalytics: true,
  requireEmailVerification: true,
  defaultTeamSettings: {
    visibility: 'private',
    allowMemberInvites: true,
    requireApprovalForPresets: false,
    defaultPresetVisibility: 'team',
    maxMembers: 50,
    enableComments: true,
    enableRatings: true,
    autoArchiveInactivePresets: false,
  },
};

// ============================================================================
// Role Permissions Configuration
// ============================================================================

const ROLE_PERMISSIONS: Record<TeamRole, TeamPermission[]> = {
  owner: [
    'manage_team',
    'manage_members',
    'manage_library',
    'create_presets',
    'edit_presets',
    'delete_presets',
    'view_analytics',
    'manage_settings',
  ],
  admin: [
    'manage_members',
    'manage_library',
    'create_presets',
    'edit_presets',
    'delete_presets',
    'view_analytics',
  ],
  editor: [
    'create_presets',
    'edit_presets',
    'manage_library',
  ],
  viewer: [],
};

// ============================================================================
// Team Management Service Class
// ============================================================================

export class TeamManagementService {
  private config: TeamManagementServiceConfig;
  private teams: Map<string, Team>;
  private members: Map<string, TeamMember[]>;
  private invitations: Map<string, TeamInvitation[]>;

  constructor(config: Partial<TeamManagementServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.teams = new Map();
    this.members = new Map();
    this.invitations = new Map();
  }

  // ============================================================================
  // Team Management
  // ============================================================================

  /**
   * Create a new team
   */
  public async createTeam(userId: string, request: CreateTeamRequest): Promise<Team> {
    // Validate user team limit
    const userTeams = await this.getUserTeams(userId);
    if (userTeams.length >= this.config.maxTeamsPerUser) {
      throw new Error(`Maximum number of teams (${this.config.maxTeamsPerUser}) reached`);
    }

    // Create team
    const team: Team = {
      id: this.generateId(),
      name: request.name.trim(),
      description: request.description.trim(),
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: { ...this.config.defaultTeamSettings, ...request.settings },
      memberCount: 1,
      isActive: true,
      tags: [],
    };

    // Validate team name
    if (team.name.length < 3 || team.name.length > 50) {
      throw new Error('Team name must be between 3 and 50 characters');
    }

    // Store team
    this.teams.set(team.id, team);

    // Add creator as owner
    const ownerMember: TeamMember = {
      id: this.generateId(),
      teamId: team.id,
      userId,
      role: 'owner',
      permissions: ROLE_PERMISSIONS.owner,
      joinedAt: new Date(),
      invitedBy: userId,
      status: 'active',
      lastActiveAt: new Date(),
      contributionScore: 0,
    };

    if (!this.members.has(team.id)) {
      this.members.set(team.id, []);
    }
    this.members.get(team.id)!.push(ownerMember);

    // Invite initial members if provided
    if (request.initialMembers && request.initialMembers.length > 0) {
      for (const email of request.initialMembers) {
        try {
          await this.inviteMember(userId, {
            teamId: team.id,
            email,
            role: 'editor',
          });
        } catch (error) {
          console.warn(`Failed to invite ${email}:`, error);
        }
      }
    }

    return team;
  }

  /**
   * Get team by ID
   */
  public async getTeam(teamId: string): Promise<Team | null> {
    return this.teams.get(teamId) || null;
  }

  /**
   * Get teams for a user
   */
  public async getUserTeams(userId: string): Promise<Team[]> {
    const userTeams: Team[] = [];
    
    for (const [teamId, members] of this.members.entries()) {
      const userMember = members.find(m => m.userId === userId && m.status === 'active');
      if (userMember) {
        const team = this.teams.get(teamId);
        if (team && team.isActive) {
          userTeams.push(team);
        }
      }
    }

    return userTeams.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Update team information
   */
  public async updateTeam(
    userId: string,
    teamId: string,
    updates: Partial<Pick<Team, 'name' | 'description' | 'settings' | 'tags'>>
  ): Promise<Team> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check permissions
    if (!await this.hasPermission(userId, teamId, 'manage_team')) {
      throw new Error('Insufficient permissions to update team');
    }

    // Apply updates
    const updatedTeam: Team = {
      ...team,
      ...updates,
      updatedAt: new Date(),
    };

    // Validate updates
    if (updates.name && (updates.name.length < 3 || updates.name.length > 50)) {
      throw new Error('Team name must be between 3 and 50 characters');
    }

    this.teams.set(teamId, updatedTeam);
    return updatedTeam;
  }

  /**
   * Delete team
   */
  public async deleteTeam(userId: string, teamId: string): Promise<boolean> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Only owner can delete team
    const userMember = await this.getTeamMember(teamId, userId);
    if (!userMember || userMember.role !== 'owner') {
      throw new Error('Only team owner can delete the team');
    }

    // Mark team as inactive instead of deleting
    const updatedTeam: Team = {
      ...team,
      isActive: false,
      updatedAt: new Date(),
    };

    this.teams.set(teamId, updatedTeam);

    // Mark all members as inactive
    const members = this.members.get(teamId) || [];
    members.forEach(member => {
      member.status = 'inactive';
    });

    return true;
  }

  // ============================================================================
  // Member Management
  // ============================================================================

  /**
   * Invite member to team
   */
  public async inviteMember(userId: string, request: InviteMemberRequest): Promise<TeamInvitation> {
    const team = this.teams.get(request.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check permissions
    if (!await this.hasPermission(userId, request.teamId, 'manage_members')) {
      throw new Error('Insufficient permissions to invite members');
    }

    // Check team member limit
    const currentMembers = this.members.get(request.teamId) || [];
    const activeMembers = currentMembers.filter(m => m.status === 'active');
    if (activeMembers.length >= team.settings.maxMembers) {
      throw new Error(`Team has reached maximum member limit (${team.settings.maxMembers})`);
    }

    // Check if user is already a member
    const existingMember = currentMembers.find(m => m.userId === request.email);
    if (existingMember) {
      throw new Error('User is already a team member');
    }

    // Check for existing pending invitation
    const teamInvitations = this.invitations.get(request.teamId) || [];
    const existingInvitation = teamInvitations.find(
      inv => inv.email === request.email && inv.status === 'pending'
    );
    if (existingInvitation) {
      throw new Error('Invitation already sent to this email');
    }

    // Create invitation
    const invitation: TeamInvitation = {
      id: this.generateId(),
      teamId: request.teamId,
      email: request.email,
      role: request.role,
      invitedBy: userId,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + this.config.invitationExpiryDays * 24 * 60 * 60 * 1000),
      status: 'pending',
      token: this.generateInvitationToken(),
      message: request.message,
    };

    // Store invitation
    if (!this.invitations.has(request.teamId)) {
      this.invitations.set(request.teamId, []);
    }
    this.invitations.get(request.teamId)!.push(invitation);

    // TODO: Send invitation email
    console.log(`Invitation sent to ${request.email} for team ${team.name}`);

    return invitation;
  }

  /**
   * Accept team invitation
   */
  public async acceptInvitation(userId: string, token: string): Promise<TeamMember> {
    // Find invitation by token
    let invitation: TeamInvitation | null = null;
    let teamId: string | null = null;

    for (const [tId, invitations] of this.invitations.entries()) {
      const found = invitations.find(inv => inv.token === token);
      if (found) {
        invitation = found;
        teamId = tId;
        break;
      }
    }

    if (!invitation || !teamId) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired';
      throw new Error('Invitation has expired');
    }

    const team = this.teams.get(teamId);
    if (!team || !team.isActive) {
      throw new Error('Team not found or inactive');
    }

    // Create team member
    const member: TeamMember = {
      id: this.generateId(),
      teamId,
      userId,
      role: invitation.role,
      permissions: ROLE_PERMISSIONS[invitation.role],
      joinedAt: new Date(),
      invitedBy: invitation.invitedBy,
      status: 'active',
      lastActiveAt: new Date(),
      contributionScore: 0,
    };

    // Add member to team
    if (!this.members.has(teamId)) {
      this.members.set(teamId, []);
    }
    this.members.get(teamId)!.push(member);

    // Update invitation status
    invitation.status = 'accepted';

    // Update team member count
    team.memberCount = this.members.get(teamId)!.filter(m => m.status === 'active').length;
    team.updatedAt = new Date();

    return member;
  }

  /**
   * Get team members
   */
  public async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return this.members.get(teamId) || [];
  }

  /**
   * Get team member
   */
  public async getTeamMember(teamId: string, userId: string): Promise<TeamMember | null> {
    const members = this.members.get(teamId) || [];
    return members.find(m => m.userId === userId) || null;
  }

  /**
   * Update team member
   */
  public async updateTeamMember(
    userId: string,
    request: UpdateMemberRequest
  ): Promise<TeamMember> {
    // Check permissions
    if (!await this.hasPermission(userId, request.teamId, 'manage_members')) {
      throw new Error('Insufficient permissions to update member');
    }

    const members = this.members.get(request.teamId) || [];
    const memberIndex = members.findIndex(m => m.id === request.memberId);
    
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    const member = members[memberIndex];
    
    // Prevent owner from changing their own role
    if (member.userId === userId && member.role === 'owner' && request.role && request.role !== 'owner') {
      throw new Error('Team owner cannot change their own role');
    }

    // Update member
    const updatedMember: TeamMember = {
      ...member,
      ...request,
      permissions: request.role ? ROLE_PERMISSIONS[request.role] : member.permissions,
    };

    members[memberIndex] = updatedMember;

    return updatedMember;
  }

  /**
   * Remove team member
   */
  public async removeTeamMember(
    userId: string,
    teamId: string,
    memberId: string
  ): Promise<boolean> {
    // Check permissions
    if (!await this.hasPermission(userId, teamId, 'manage_members')) {
      throw new Error('Insufficient permissions to remove member');
    }

    const members = this.members.get(teamId) || [];
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    const member = members[memberIndex];
    
    // Prevent removing team owner
    if (member.role === 'owner') {
      throw new Error('Cannot remove team owner');
    }

    // Mark member as inactive instead of removing
    member.status = 'inactive';

    // Update team member count
    const team = this.teams.get(teamId);
    if (team) {
      team.memberCount = members.filter(m => m.status === 'active').length;
      team.updatedAt = new Date();
    }

    return true;
  }

  // ============================================================================
  // Permission Management
  // ============================================================================

  /**
   * Check if user has specific permission
   */
  public async hasPermission(
    userId: string,
    teamId: string,
    permission: TeamPermission
  ): Promise<boolean> {
    const member = await this.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      return false;
    }

    return member.permissions.includes(permission);
  }

  /**
   * Get user permissions for team
   */
  public async getUserPermissions(userId: string, teamId: string): Promise<TeamPermission[]> {
    const member = await this.getTeamMember(teamId, userId);
    if (!member || member.status !== 'active') {
      return [];
    }

    return member.permissions;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateInvitationToken(): string {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const teamManagementService = new TeamManagementService();
