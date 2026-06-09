import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("");
const [type, setType] = useState("expense");
const [expenses, setExpenses] = useState([]);

const [editingId, setEditingId] = useState(null);
const [filterType, setFilterType] = useState("");
const navigate = useNavigate();

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/expenses/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem("token");

    let url = "/expenses";

    if (filterType) {
      url += `?type=${filterType}`;
    }

    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setExpenses(res.data);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  fetchSummary();
  fetchExpenses();
}, [filterType]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

     if (editingId) {
  await api.put(
    `/expenses/${editingId}`,
    {
      title,
      amount,
      category,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setEditingId(null);

  alert("Expense Updated");
} else {
  await api.post(
    "/expenses",
    {
      title,
      amount,
      category,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Expense Added");
}
      setTitle("");
      setAmount("");
      setCategory("");
      setType("expense");

      fetchSummary();
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Expense Deleted");

      fetchSummary();
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/");

};

  const handleEdit = (expense) => {
  setTitle(expense.title);
  setAmount(expense.amount);
  setCategory(expense.category);
  setType(expense.type);

  setEditingId(expense._id);
  };

  



  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <hr />

      <h3>Income: ₹{summary.totalIncome}</h3>
      <h3>Expense: ₹{summary.totalExpense}</h3>
      <h3>Balance: ₹{summary.balance}</h3>

      <hr />
       <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
>
  <option value="">All</option>
  <option value="income">Income</option>
  <option value="expense">Expense</option>
</select>
      <h2>Add Expense</h2>

      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit">
  {editingId
    ? "Update Expense"
    : "Add Expense"}
</button>
      </form>

      <hr />

      <h2>Expenses</h2>

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>
              <strong>{expense.title}</strong>
            </p>

            <p>Amount: ₹{expense.amount}</p>

            <p>Category: {expense.category}</p>

            <p>Type: {expense.type}</p>

            <button
              onClick={() =>
                handleDelete(expense._id)
              }
            >
              Delete
            </button>
            <button
  onClick={() => handleEdit(expense)}
>
  Edit
</button>

<button onClick={handleLogout}>
  Logout
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;