import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";

import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const ListMenuItems = () => {
  const classes = useStyles();

  const [menuItems, setMenuItems] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("menu").onSnapshot((snapshot) => {
      const menuItems = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMenuItems(menuItems);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchResults = menuItems.filter((menuItem) =>
      menuItem.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(searchResults);
  }, [query, menuItems]);

  const toggleAvailability = (menuItem) => {
    db.collection("menu").doc(menuItem.id).update({
      isAvailable: !menuItem.isAvailable,
    });
  };

  const editMenuItem = (menuItem) => {
    setEditing(true);
    setCurrentItem(menuItem);
  };

  const deleteMenuItem = (id) => {
    db.collection("menu").doc(id).delete();
    setOpen(false);
  };

  const handleChange = (e) => {
    setCurrentItem((prevState) => ({
      ...prevState,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection("menu").doc(currentItem.id).update(currentItem);
    setEditing(false);
  };

  const openDialog = (menuItem) => {
    setOpen(true);
    setCurrentItem(menuItem);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            Delete the menu item {currentItem && currentItem.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            style={{ backgroundColor: red[500] }}
            onClick={() => deleteMenuItem(currentItem.id)}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" color="textSecondary">
            Menu
          </Typography>

          <Tooltip title="Add">
            <Fab
              className={classes.margin}
              component={Link}
              size="small"
              style={{
                backgroundColor: green[500],
              }}
              to="/menu/add"
            >
              <AddIcon color="secondary" />
            </Fab>
          </Tooltip>
        </div>
        <TextField
          size="small"
          variant="outlined"
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((menuItem) => (
                <TableRow key={menuItem.id}>
                  <TableCell>{menuItem.name}</TableCell>
                  <TableCell>
                    {editing && menuItem.id === currentItem.id ? (
                      <form onSubmit={handleSubmit}>
                        <TextField
                          name="price"
                          onChange={handleChange}
                          type="number"
                          value={currentItem.price}
                          variant="outlined"
                          required
                        />
                      </form>
                    ) : (
                      <span>&#x20B9; {menuItem.price}</span>
                    )}
                  </TableCell>

                  <TableCell>{menuItem.category}</TableCell>
                  <TableCell>
                    <Tooltip title="Change Availability">
                      <Switch
                        color="primary"
                        checked={menuItem.isAvailable}
                        onChange={() => toggleAvailability(menuItem)}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {editing ? (
                      <Tooltip title="Cancel">
                        <IconButton onClick={() => setEditing(false)}>
                          <CancelIcon style={{ color: red[500] }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Edit">
                        <IconButton onClick={() => editMenuItem(menuItem)}>
                          <EditIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDialog(menuItem)}>
                        <DeleteIcon style={{ color: red[500] }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ListMenuItems;
