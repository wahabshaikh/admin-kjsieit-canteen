import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import Order from "./Order";
import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("orders").onSnapshot((snapshot) => {
      const orders = snapshot.docs.map((doc) => {
        const placed_at = doc.data().placed_at.toDate().toLocaleString("en-IN");
        const time = doc.data().delivered_at
          ? doc.data().delivered_at.toDate().toLocaleString("en-IN")
          : doc.data().cancelled_at.toDate().toLocaleString("en-IN");
        return {
          ...doc.data(),
          placed_at,
          time,
          id: doc.id,
        };
      });
      setOrders(orders);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const searchResults = orders.filter((order) =>
      order.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(searchResults);
  }, [query, orders]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h4" color="textSecondary">
          Orders
        </Typography>
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
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Payment Type</TableCell>
              <TableCell>Placed</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <Order order={order} />
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

export default Orders;
