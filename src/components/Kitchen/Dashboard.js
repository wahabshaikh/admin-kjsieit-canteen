import { Grid } from "@material-ui/core";
import { Toolbar, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import KitchenOrder from "./KitchenOrder";

const Dashboard = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  useEffect(() => {
    const unsubscribe = db
      .collection("active_orders")
      .where("status", "==", "processing")
      .orderBy("placed_at")
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
      <Grid container spacing={2}>
        {activeOrders.map((order, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <KitchenOrder activeOrder={order} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
