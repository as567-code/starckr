import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { upgradeUser } from './api.tsx';

interface PromoteUserButtonProps {
  userId: string;
  currentRole: string;
  onSuccess: (newRole: string) => void;
}

const ROLES = ['user', 'moderator', 'admin', 'superadmin'] as const;

/**
 * A dropdown component that allows admins to assign roles to users.
 * @param userId - the id of the user to update
 * @param currentRole - the current primary role of the user
 * @param onSuccess - a callback invoked after a successful role assignment
 */
function PromoteUserButton({
  userId,
  currentRole,
  onSuccess,
}: PromoteUserButtonProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole || 'user');
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    setLoading(true);
    await upgradeUser(userId, selectedRole);
    setLoading(false);
    onSuccess(selectedRole);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          size="small"
        >
          {ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="outlined"
        size="small"
        onClick={handleAssign}
        disabled={loading || selectedRole === currentRole}
      >
        {loading ? <CircularProgress size={16} /> : 'Assign'}
      </Button>
    </Box>
  );
}

export default PromoteUserButton;
