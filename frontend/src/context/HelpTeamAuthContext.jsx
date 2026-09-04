import { createContext, useContext, useState, useEffect } from 'react';
import { helpTeamAuthApi } from '../services/api';

const HelpTeamAuthContext = createContext(null);

export const HelpTeamAuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('help_team_token');
    const storedMember = localStorage.getItem('help_team_member');

    if (storedToken && storedMember) {
      try {
        setToken(storedToken);
        setMember(JSON.parse(storedMember));
      } catch (e) {
        localStorage.removeItem('help_team_token');
        localStorage.removeItem('help_team_member');
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, memberData) => {
    localStorage.setItem('help_team_token', tokenValue);
    localStorage.setItem('help_team_member', JSON.stringify(memberData));
    setToken(tokenValue);
    setMember(memberData);
  };

  const logout = () => {
    localStorage.removeItem('help_team_token');
    localStorage.removeItem('help_team_member');
    setToken(null);
    setMember(null);
  };

  const updateAvailability = async (availability, status) => {
    try {
      const res = await helpTeamAuthApi.updateAvailability({ availability, status });
      if (res.data.success) {
        const updated = {
          ...member,
          availability: res.data.member.availability,
          status: res.data.member.status,
        };
        setMember(updated);
        localStorage.setItem('help_team_member', JSON.stringify(updated));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error updating status' };
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await helpTeamAuthApi.getMe();
      if (res.data.success) {
        setMember(res.data.member);
        localStorage.setItem('help_team_member', JSON.stringify(res.data.member));
      }
    } catch (e) {
      // silent
    }
  };

  return (
    <HelpTeamAuthContext.Provider
      value={{
        member,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        updateAvailability,
        refreshProfile,
      }}
    >
      {children}
    </HelpTeamAuthContext.Provider>
  );
};

export const useHelpTeamAuth = () => {
  const context = useContext(HelpTeamAuthContext);
  if (!context) {
    throw new Error('useHelpTeamAuth must be used within HelpTeamAuthProvider');
  }
  return context;
};

export default HelpTeamAuthContext;
