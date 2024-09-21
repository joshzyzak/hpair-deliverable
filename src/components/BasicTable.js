import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { getCategory } from '../utils/categories';
import EntryModal from './EntryModal';
import { deleteEntry } from '../utils/mutations';

export default function BasicTable({ entries, user }) {
  // State for search and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredEntries, setFilteredEntries] = useState(entries);

  useEffect(() => {
    setFilteredEntries(entries);
  }, [entries]);

  // Search function
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = entries.filter((entry) =>
      entry.name.toLowerCase().includes(query) || 
      entry.email.toLowerCase().includes(query) ||
      entry.user?.toLowerCase().includes(query) ||
      getCategory(entry.category).name.toLowerCase().includes(query)
    );
    setFilteredEntries(filtered);
  };

  // Sorting function
  const handleSort = (column) => {
    const sortedEntries = [...filteredEntries].sort((a, b) => {
      let aValue, bValue;

      if (column === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (column === 'category') {
        aValue = getCategory(a.category).name.toLowerCase();
        bValue = getCategory(b.category).name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1; // a to z order (ascending)
      } else {
        return aValue > bValue ? -1 : 1; // z to a order (descending)
      }
    });

    setFilteredEntries(sortedEntries);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // deletion function
   const handleDelete = (entry) => {
      if (window.confirm("Are you sure you want to delete this entry?")) {
         deleteEntry(entry)
            .then(() => {
                  // update filtered entries after deleting
                  setFilteredEntries((prevEntries) =>
                     prevEntries.filter((e) => e.id !== entry.id)
                  );
                  alert("Entry deleted successfully.");
            })
            .catch((error) => {
                  console.error("Error deleting entry:", error);
                  alert("Failed to delete entry. Please try again.");
            });
      }
   };


  return (
    <div>
      {/* Search bar */}
      <TextField
        label="Search Entries"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Sorting buttons */}
      <div style={{ marginBottom: '10px' }}>
        <Button variant="contained" onClick={() => handleSort('name')}>
          Sort by Name ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </Button>
        <Button variant="contained" onClick={() => handleSort('category')} style={{ marginLeft: '10px' }}>
          Sort by Category ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow
                key={entry.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entry.name}
                </TableCell>
                <TableCell align="right">
                  <a href={`mailto:${entry.email}`}>{entry.email}</a>
                </TableCell>
                <TableCell align="right">{entry.user}</TableCell>
                <TableCell align="right">{getCategory(entry.category).name}</TableCell>
                <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} align="right">
                  <EntryModal entry={entry} type="edit" />
                </TableCell>
                <TableCell align="right">
                  {/* Delete button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(entry)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
