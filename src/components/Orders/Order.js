import React, { useState } from "react";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const Order = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? (
              <KeyboardArrowUpIcon color="primary" />
            ) : (
              <KeyboardArrowDownIcon color="primary" />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{order.username}</TableCell>
        <TableCell>{order.ordered_by}</TableCell>
        <TableCell>{order.payment_type.toUpperCase()}</TableCell>
        <TableCell>{order.placed_at}</TableCell>
        <TableCell align="right">&#x20B9; {order.total_amount}</TableCell>
        <TableCell>{order.status.toUpperCase()}</TableCell>
        <TableCell>{order.time}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                color="textSecondary"
              >
                Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item}>
                      <TableCell style={{ textTransform: "capitalize" }}>
                        {item}
                      </TableCell>
                      <TableCell align="right">
                        {order.bill[item].quantity}
                      </TableCell>
                      <TableCell align="right">
                        &#x20B9; {order.bill[item].price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Order;
