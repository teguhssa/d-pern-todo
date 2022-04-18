const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

// create data
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING*",
      [description]
    );
    res.json(newTodo.rows[0]);
    console.log("Data added");
  } catch (err) {
    console.error(err.message);
  }
});

// Get data
app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");
    res.json(allTodo.rows);
    console.log("Success getting data..");
  } catch (err) {
    console.log(err.message);
  }
});

// get data specify
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(allTodo.rows);
    console.log("Success getting data..");
  } catch (err) {
    console.log(err.message);
  }
});

// edit data
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Data updated!");
  } catch (err) {
    console.log(err.message);
  }
});

// Delete data
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
    id,
  ]);
  res.json("Data deleted");
  console.log("Data deleted");
});

app.listen(4000, () => {
  console.log("Server has started on port 4000");
});
