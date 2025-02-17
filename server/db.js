const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client();

const createTables = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS reservation;
      DROP TABLE IF EXISTS customer;
      DROP TABLE IF EXISTS restaurant;
      
      CREATE TABLE customer (
        id UUID PRIMARY KEY,
        name VARCHAR(64) NOT NULL UNIQUE
      );
      
      CREATE TABLE restaurant (
        id UUID PRIMARY KEY,
        name VARCHAR(128) NOT NULL UNIQUE
      );
      
      CREATE TABLE reservation (
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES customer(id) NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        date TIMESTAMP NOT NULL,
        party_count INTEGER NOT NULL
      );
      `;

    console.log("Running SQL to create tables...");
    await client.query(SQL);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

const createCustomer = async (name) => {
  try {
    const SQL = `INSERT INTO customer (id, name) VALUES ($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
  } catch (err) {
    console.error("Error creating customer:", err);
  }
};

const createRestaurant = async (name) => {
  try {
    const SQL = `INSERT INTO restaurant (id, name) VALUES ($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows[0];
  } catch (err) {
    console.error("Error creating restaurant:", err);
  }
};

const fetchCustomers = async () => {
  try {
    const SQL = `SELECT * FROM customer;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching customers:", err);
  }
};

const fetchRestaurants = async () => {
  try {
    const SQL = `SELECT * FROM restaurant;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
  }
};

const createReservation = async ({
  customer_id,
  restaurant_id,
  date,
  party_count,
}) => {
  try {
    const SQL = `INSERT INTO reservation (id, customer_id, restaurant_id, date, party_count) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      customer_id,
      restaurant_id,
      date,
      party_count,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error creating reservation:", err);
  }
};

const destroyReservation = async (id, customer_id) => {
  try {
    const SQL = `DELETE FROM reservation WHERE id = $1 AND customer_id = $2;`;
    await client.query(SQL, [id, customer_id]);
    return true;
  } catch (err) {
    console.error("Error deleting reservation:", err);
  }
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
};
