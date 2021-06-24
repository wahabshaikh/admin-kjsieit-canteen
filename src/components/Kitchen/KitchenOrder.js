import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  CardActions,
  Button,
  Checkbox,
  ListItemSecondaryAction,
  ListItem,
  ListItemText,
} from "@material-ui/core";

import CompleteIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

import { db } from "../../firebase";
import firebase from "firebase";

const KitchenOrder = ({ activeOrder }) => {
  const { id, placed_at, bill, items, username } = activeOrder;
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const completeOrder = (id) => {
    if (window.confirm(`Complete order?`)) {
      db.collection("active_orders").doc(id).update({
        status: "completed",
      });
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
      <Card>
        <CardHeader
          style={{ backgroundColor: "rgba(234,139,38,0.85)" }}
          title={`#${id.slice(0, 5)}-${username.slice(0, 10)}`}
          subheader={placed_at}
        />
        <CardContent>
          <List>
            {items.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText>
                  {bill[item]["quantity"]} {item}
                </ListItemText>
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={checked.indexOf(idx) !== -1}
                    color="primary"
                    onChange={handleToggle(idx)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {checked.length === items.length && (
            <Button
              style={{ color: green[500] }}
              startIcon={<CompleteIcon />}
              onClick={() => completeOrder(id)}
            >
              Done
            </Button>
          )}
          <Button
            style={{ color: red[500] }}
            startIcon={<CancelIcon />}
            onClick={() => cancelOrder(id)}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

export default KitchenOrder;
