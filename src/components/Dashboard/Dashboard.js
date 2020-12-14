import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";

import ActiveOrder from "./ActiveOrder";

const useStyles = makeStyles((theme) => ({
  marginBottom: {
    marginBottom: theme.spacing(3),
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [activeOrders, setActiveOrders] = useState([]);
  useEffect(() => {
    const unsubscribe = db
      .collection("active_orders")
      .orderBy("placed_at", "desc")
      .onSnapshot((snapshot) => {
        const activeOrders = snapshot.docs.map((doc) => {
          const items = Object.keys(doc.data().bill);
          const placed_at = doc
            .data()
            .placed_at.toDate()
            .toLocaleString("en-IN");
          return {
            ...doc.data(),
            items,
            placed_at,
            id: doc.id,
          };
        });
        setActiveOrders(activeOrders);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Toolbar>
        <Typography variant="h4" color="textSecondary">
          Dashboard
        </Typography>
      </Toolbar>
      <TableContainer component={Paper} className={classes.marginBottom}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {activeOrders.map((activeOrder) => (
              <ActiveOrder activeOrder={activeOrder} key={activeOrder.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;
