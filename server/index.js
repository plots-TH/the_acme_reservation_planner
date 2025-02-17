require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  destroyReservation,
} = require("./db.js");

app.use(express.json());

// Insert Dummy Data here
const insertDummyData = async () => {
  try {
    const customer1 = await createCustomer("John Updated");
    const customer2 = await createCustomer("Jane Smith");
    const customer3 = await createCustomer("Gordon Freeman");

    const restaurant1 = await createRestaurant("Texas Steakhouse");
    const restaurant2 = await createRestaurant("Mario's Pasta");
    const restaurant3 = await createRestaurant("Ivan Ramen");

    await createReservation({
      customer_id: customer1.id,
      restaurant_id: restaurant1.id,
      date: "2024-03-15T18:30:00",
      party_count: 4,
    });

    await createReservation({
      customer_id: customer2.id,
      restaurant_id: restaurant2.id,
      date: "2024-03-16T19:00:00",
      party_count: 2,
    });

    await createReservation({
      customer_id: customer3.id,
      restaurant_id: restaurant3.id,
      date: "2024-03-17T20:00:00",
      party_count: 6,
    });

    console.log("Dummy data inserted successfully!");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
};

// Routes
app.get("/api/customers", async (req, res, next) => {
  try {
    const customers = await fetchCustomers();
    res.send(customers);
  } catch (err) {
    next(err);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    const restaurants = await fetchRestaurants();
    res.send(restaurants);
  } catch (err) {
    next(err);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    const reservations = await fetchRestaurants();
    res.send(reservations);
  } catch (err) {
    next(err);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const created = await createReservation(req.body);
    res.send(created);
  } catch (err) {
    next(err);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation(req.params.id, req.params.customerId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

const init = async () => {
  console.log("Connecting to client...");
  await client.connect();
  console.log("Connected!");

  await createTables();
  console.log("Tables created!");

  // call function to insert the dummy data
  await insertDummyData();

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  app.listen(PORT, () => {
    console.log(`Server alive on port ${PORT}`);
  });
};

init();
