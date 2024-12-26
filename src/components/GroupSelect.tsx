import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const GroupSelect: React.FC<{
  groups: string[];
  selectedGroup: string;
  handleGroupSelect: (group: string) => void;
  loading: boolean;
}> = ({ groups, selectedGroup, handleGroupSelect, loading }) => (
  <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
    <InputLabel id="group-select-label">Select Group</InputLabel>
    <Select
      labelId="group-select-label"
      value={selectedGroup}
      onChange={(e) => handleGroupSelect(e.target.value)}
      label="Select Group"
      disabled={loading}
    >
      {groups.map((group) => (
        <MenuItem key={group} value={group}>
          {group}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default GroupSelect;
