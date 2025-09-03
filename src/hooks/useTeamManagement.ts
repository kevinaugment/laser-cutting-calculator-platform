/**
 * Team Management Hook
 * React hook for team management functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  teamManagementService,
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamRequest,
  InviteMemberRequest,
  UpdateMemberRequest,
  TeamRole,
  TeamPermission
} from '../services/teamManagementService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface TeamManagementState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  teamInvitations: TeamInvitation[];
  userPermissions: TeamPermission[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface TeamManagementActions {
  createTeam: (request: CreateTeamRequest) => Promise<Team>;
  selectTeam: (teamId: string) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<boolean>;
  inviteMember: (request: InviteMemberRequest) => Promise<TeamInvitation>;
  updateMember: (request: UpdateMemberRequest) => Promise<TeamMember>;
  removeMember: (teamId: string, memberId: string) => Promise<boolean>;
  acceptInvitation: (token: string) => Promise<TeamMember>;
  getUserTeams: () => Promise<Team[]>;
  getTeamMembers: (teamId: string) => Promise<TeamMember[]>;
  hasPermission: (teamId: string, permission: TeamPermission) => Promise<boolean>;
  refreshTeams: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseTeamManagementConfig {
  userId?: string;
  autoLoadTeams?: boolean;
  refreshInterval?: number;
}

const DEFAULT_CONFIG: Required<UseTeamManagementConfig> = {
  userId: 'anonymous-user',
  autoLoadTeams: true,
  refreshInterval: 0,
};

// ============================================================================
// Main Hook
// ============================================================================

export function useTeamManagement(
  config: UseTeamManagementConfig = {}
): [TeamManagementState, TeamManagementActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<TeamManagementState>({
    teams: [],
    currentTeam: null,
    teamMembers: [],
    teamInvitations: [],
    userPermissions: [],
    loading: false,
    error: null,
    initialized: false,
  });

  // Initialize teams
  useEffect(() => {
    if (finalConfig.autoLoadTeams && !state.initialized) {
      loadUserTeams();
    }
  }, [finalConfig.autoLoadTeams, state.initialized]);

  // Auto-refresh teams
  useEffect(() => {
    if (finalConfig.refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!state.loading) {
          loadUserTeams();
        }
      }, finalConfig.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.refreshInterval, state.loading]);

  // Load user teams
  const loadUserTeams = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const teams = await teamManagementService.getUserTeams(finalConfig.userId);
      setState(prev => ({
        ...prev,
        teams,
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load teams';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig.userId]);

  // Create team
  const createTeam = useCallback(async (request: CreateTeamRequest): Promise<Team> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const team = await teamManagementService.createTeam(finalConfig.userId, request);
      
      setState(prev => ({
        ...prev,
        teams: [team, ...prev.teams],
        currentTeam: team,
        loading: false,
      }));

      return team;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Select team
  const selectTeam = useCallback(async (teamId: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const team = await teamManagementService.getTeam(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const [members, permissions] = await Promise.all([
        teamManagementService.getTeamMembers(teamId),
        teamManagementService.getUserPermissions(finalConfig.userId, teamId),
      ]);

      setState(prev => ({
        ...prev,
        currentTeam: team,
        teamMembers: members,
        userPermissions: permissions,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select team';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [finalConfig.userId]);

  // Update team
  const updateTeam = useCallback(async (
    teamId: string,
    updates: Partial<Team>
  ): Promise<Team> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const updatedTeam = await teamManagementService.updateTeam(
        finalConfig.userId,
        teamId,
        updates
      );

      setState(prev => ({
        ...prev,
        teams: prev.teams.map(t => t.id === teamId ? updatedTeam : t),
        currentTeam: prev.currentTeam?.id === teamId ? updatedTeam : prev.currentTeam,
        loading: false,
      }));

      return updatedTeam;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Delete team
  const deleteTeam = useCallback(async (teamId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const success = await teamManagementService.deleteTeam(finalConfig.userId, teamId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          teams: prev.teams.filter(t => t.id !== teamId),
          currentTeam: prev.currentTeam?.id === teamId ? null : prev.currentTeam,
          teamMembers: prev.currentTeam?.id === teamId ? [] : prev.teamMembers,
          userPermissions: prev.currentTeam?.id === teamId ? [] : prev.userPermissions,
          loading: false,
        }));
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Invite member
  const inviteMember = useCallback(async (
    request: InviteMemberRequest
  ): Promise<TeamInvitation> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const invitation = await teamManagementService.inviteMember(
        finalConfig.userId,
        request
      );

      setState(prev => ({
        ...prev,
        teamInvitations: [invitation, ...prev.teamInvitations],
        loading: false,
      }));

      return invitation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite member';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Update member
  const updateMember = useCallback(async (
    request: UpdateMemberRequest
  ): Promise<TeamMember> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const updatedMember = await teamManagementService.updateTeamMember(
        finalConfig.userId,
        request
      );

      setState(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map(m => 
          m.id === request.memberId ? updatedMember : m
        ),
        loading: false,
      }));

      return updatedMember;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Remove member
  const removeMember = useCallback(async (
    teamId: string,
    memberId: string
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const success = await teamManagementService.removeTeamMember(
        finalConfig.userId,
        teamId,
        memberId
      );

      if (success) {
        setState(prev => ({
          ...prev,
          teamMembers: prev.teamMembers.filter(m => m.id !== memberId),
          loading: false,
        }));
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Accept invitation
  const acceptInvitation = useCallback(async (token: string): Promise<TeamMember> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const member = await teamManagementService.acceptInvitation(finalConfig.userId, token);
      
      // Refresh teams to include the new team
      await loadUserTeams();

      setState(prev => ({ ...prev, loading: false }));

      return member;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept invitation';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.userId, loadUserTeams]);

  // Get user teams
  const getUserTeams = useCallback(async (): Promise<Team[]> => {
    return await teamManagementService.getUserTeams(finalConfig.userId);
  }, [finalConfig.userId]);

  // Get team members
  const getTeamMembers = useCallback(async (teamId: string): Promise<TeamMember[]> => {
    return await teamManagementService.getTeamMembers(teamId);
  }, []);

  // Check permission
  const hasPermission = useCallback(async (
    teamId: string,
    permission: TeamPermission
  ): Promise<boolean> => {
    return await teamManagementService.hasPermission(finalConfig.userId, teamId, permission);
  }, [finalConfig.userId]);

  // Refresh teams
  const refreshTeams = useCallback(async (): Promise<void> => {
    await loadUserTeams();
  }, [loadUserTeams]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: TeamManagementActions = {
    createTeam,
    selectTeam,
    updateTeam,
    deleteTeam,
    inviteMember,
    updateMember,
    removeMember,
    acceptInvitation,
    getUserTeams,
    getTeamMembers,
    hasPermission,
    refreshTeams,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for current team management
 */
export function useCurrentTeam(teamId?: string, userId?: string) {
  const [state, actions] = useTeamManagement({ userId });

  useEffect(() => {
    if (teamId && teamId !== state.currentTeam?.id) {
      actions.selectTeam(teamId);
    }
  }, [teamId, state.currentTeam?.id, actions]);

  return {
    team: state.currentTeam,
    members: state.teamMembers,
    permissions: state.userPermissions,
    loading: state.loading,
    error: state.error,
    updateTeam: (updates: Partial<Team>) => 
      state.currentTeam ? actions.updateTeam(state.currentTeam.id, updates) : Promise.reject('No current team'),
    inviteMember: (request: Omit<InviteMemberRequest, 'teamId'>) =>
      state.currentTeam ? actions.inviteMember({ ...request, teamId: state.currentTeam.id }) : Promise.reject('No current team'),
    updateMember: (request: Omit<UpdateMemberRequest, 'teamId'>) =>
      state.currentTeam ? actions.updateMember({ ...request, teamId: state.currentTeam.id }) : Promise.reject('No current team'),
    removeMember: (memberId: string) =>
      state.currentTeam ? actions.removeMember(state.currentTeam.id, memberId) : Promise.reject('No current team'),
    hasPermission: (permission: TeamPermission) =>
      state.currentTeam ? actions.hasPermission(state.currentTeam.id, permission) : Promise.resolve(false),
  };
}

/**
 * Hook for team member management
 */
export function useTeamMembers(teamId: string, userId?: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const teamMembers = await teamManagementService.getTeamMembers(teamId);
      setMembers(teamMembers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load team members';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    loading,
    error,
    refresh: loadMembers,
  };
}
