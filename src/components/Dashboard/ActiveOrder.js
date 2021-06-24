import React, { useState } from "react";
import firebase, { db } from "../../firebase";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";

import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import AcceptIcon from "@material-ui/icons/Drafts";
import CompleteIcon from "@material-ui/icons/CheckCircle";
import DeliverIcon from "@material-ui/icons/Email";
import CancelIcon from "@material-ui/icons/Cancel";
import PaidIcon from "@material-ui/icons/Done";
import PendingIcon from "@material-ui/icons/Close";

const ActiveOrder = ({ activeOrder }) => {
  const [open, setOpen] = useState(false);

  const acceptOrder = (id) => {
    if (window.confirm("Accept order?")) {
      const tokenRef = db.collection("utils").doc("token");
      const activeOrderRef = db.collection("active_orders").doc(id);

      db.runTransaction((transaction) => {
        return transaction
          .get(tokenRef)
          .then((doc) => {
            const { token_no } = doc.data();
            const newTokenValue = token_no + 1;

            transaction.update(tokenRef, { token_no: newTokenValue });

            transaction.update(activeOrderRef, {
              status: "processing",
              token_no: newTokenValue,
            });
          })
          .catch((error) =>
            console.error("Failed to deliver the order", error)
          );
      }).catch((error) => console.error("Failed to deliver the order", error));
    }
  };

  const completeOrder = (id) => {
    if (window.confirm(`Complete order?`)) {
      db.collection("active_orders").doc(id).update({
        status: "completed",
      });
    }
  };

  const deliverOrder = (id) => {
    const ref = db.collection("active_orders").doc(id);
    if (window.confirm("Deliver order?")) {
      db.runTransaction((transaction) =>
        transaction
          .get(ref)
          .then((doc) => {
            db.collection("orders").add({
              ...activeOrder,
              status: "delivered",
              payment_status: "paid",
              placed_at: doc.data().placed_at,
              delivered_at: firebase.firestore.FieldValue.serverTimestamp(),
            });

            transaction.delete(ref);
          })
          .then(() => alert("Order delivered!"))
          .catch((error) => console.error("Failed to deliver the order", error))
      );
    }
  };

  const cancelOrder = (id) => {
    const ref = db.collection("active_orders").doc(id);
    if (window.confirm("Cancel order?")) {
      db.runTransaction((transaction) =>
        transaction
          .get(ref)
          .then((doc) => {
            db.collection("orders").add({
              ...activeOrder,
              placed_at: doc.data().placed_at,
              status: "cancelled",
              cancelled_at: firebase.firestore.FieldValue.serverTimestamp(),
            });

            transaction.delete(ref);
          })
          .then(() => alert("Order cancelled!"))
          .catch((error) => console.error("Failed to cancel the order", error))
      );
    }
  };

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
        <TableCell>{activeOrder.username}</TableCell>
        <TableCell>{activeOrder.status.toUpperCase()}</TableCell>
        <TableCell>
          {activeOrder.payment_status === "paid" ? (
            <PaidIcon style={{ color: green[500] }} />
          ) : (
            <PendingIcon style={{ color: red[500] }} />
          )}
        </TableCell>
        <TableCell>{activeOrder.placed_at}</TableCell>
        <TableCell align="right">&#x20B9; {activeOrder.total_amount}</TableCell>
        <TableCell>
          {activeOrder.status === "placed" && (
            <Tooltip title="Accept Order">
              <IconButton onClick={() => acceptOrder(activeOrder.id)}>
                <AcceptIcon style={{ color: green[500] }} />
              </IconButton>
            </Tooltip>
          )}

          {activeOrder.status === "processing" && (
            <Tooltip title="Complete Order">
              <IconButton onClick={() => completeOrder(activeOrder.id)}>
                <CompleteIcon style={{ color: green[500] }} />
              </IconButton>
            </Tooltip>
          )}

          {activeOrder.status === "completed" && (
            <Tooltip title="Deliver Order">
              <IconButton onClick={() => deliverOrder(activeOrder.id)}>
                <DeliverIcon style={{ color: green[500] }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Cancel Order">
            <IconButton onClick={() => cancelOrder(activeOrder.id)}>
              <CancelIcon style={{ color: red[900] }} />
            </IconButton>
          </Tooltip>
        </TableCell>
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
                  {activeOrder.items.map((item) => (
                    <TableRow key={item}>
                      <TableCell style={{ textTransform: "capitalize" }}>
                        {item}
                      </TableCell>
                      <TableCell align="right">
                        {activeOrder.bill[item].quantity}
                      </TableCell>
                      <TableCell align="right">
                        &#x20B9; {activeOrder.bill[item].price}
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

export default ActiveOrder;
