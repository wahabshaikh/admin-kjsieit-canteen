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
  useTheme,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";

const Orders = () => {
  const colors = useTheme();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
      color: colors.palette.primary.main,
    },
  ]);

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
    const { startDate, endDate } = dateRange[0];

    const getTimeInSeconds = (date) => {
      return Math.floor(date.valueOf() / 1000);
    };

    const isDateInRange = (date, startDate, endDate) => {
      return (
        getTimeInSeconds(startDate) <= date && date <= getTimeInSeconds(endDate)
      );
    };

    // Make the time to the boundaries
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59);

    // Logic to filter
    let tmpOrders = orders;
    tmpOrders = tmpOrders.filter((order) => {
      if (order.delivered_at) {
        return isDateInRange(order.delivered_at.seconds, startDate, endDate);
      } else {
        return isDateInRange(order.cancelled_at.seconds, startDate, endDate);
      }
    });

    // Logic to search a order
    const searchResults = tmpOrders.filter((order) =>
      order.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(searchResults);
  }, [query, orders, dateRange]);

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
        <DateRangePicker
          onChange={(item) => {
            setDateRange([item.selection]);
          }}
          maxDate={new Date()}
          color={colors.palette.primary.main}
          rangeColors={[colors.palette.primary.main]}
          ranges={dateRange}
        />
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
              .map((order, idx) => (
                <Order order={order} key={idx} />
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
