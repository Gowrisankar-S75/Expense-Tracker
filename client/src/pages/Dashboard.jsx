import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {PieChart,Pie,Cell,Legend,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid,ResponsiveContainer,} from "recharts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

function Dashboard() {
const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const [summary, setSummary] = useState({
totalIncome: 0,
totalExpense: 0,
balance: 0,
});

const [expenses, setExpenses] = useState([]);

const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("");
const [type, setType] = useState("expense");

const [editingId, setEditingId] = useState(null);
const [filterType, setFilterType] = useState("");
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchSummary = async () => {
try {
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
let url = `/expenses?page=${page}`;

if (filterType) {
  url += `&type=${filterType}`;
}

if (search) {
  url += `&search=${search}`;
}

  const res = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setExpenses(res.data.expenses);
setTotalPages(res.data.totalPages);
} catch (error) {
  console.log(error);
}


};

useEffect(() => {
if (!token) {
navigate("/");
return;
}


fetchSummary();
fetchExpenses();


}, [filterType, search, page]);

const handleAddExpense = async (e) => {
e.preventDefault();


try {
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

    toast.success("Expense Updated");
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

    toast.success("Expense Added");
  }

  setTitle("");
  setAmount("");
  setCategory("");
  setType("expense");
  setEditingId(null);

  fetchSummary();
  fetchExpenses();
} catch (error) {
  console.log(error);
}


};

const handleDelete = async (id) => {
try {
await api.delete(`/expenses/${id}`, {
headers: {
Authorization: `Bearer ${token}`,
},
});


  toast.success("Expense Deleted");

  fetchSummary();
  fetchExpenses();
} catch (error) {
  console.log(error);
}


};

const handleEdit = (expense) => {
setTitle(expense.title);
setAmount(expense.amount);
setCategory(expense.category);
setType(expense.type);


setEditingId(expense._id);


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");


navigate("/");


};
const chartData = [
  {
    name: "Income",
    value: summary.totalIncome,
  },
  {
    name: "Expense",
    value: summary.totalExpense,
  },
];

const COLORS = ["#22c55e", "#ef4444"];

const categoryData = expenses.reduce(
  (acc, expense) => {
    const existing = acc.find(
      (item) =>
        item.category === expense.category
    );

    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
      });
    }

    return acc;
  },
  []
);

const exportCSV = () => {
  const headers = [
    "Title",
    "Amount",
    "Category",
    "Type",
  ];

  const rows = expenses.map((expense) => [
    expense.title,
    expense.amount,
    expense.category,
    expense.type,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expenses.csv";
  link.click();

  URL.revokeObjectURL(url);
};

return ( <div className="min-h-screen bg-gray-100 p-6"> <div className="max-w-6xl mx-auto">


    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold">
        Expense Tracker
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    <h2 className="text-xl mb-6">
      Welcome, {user?.name}
    </h2>

    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <div className="bg-green-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">
          Income
        </h3>

        <p className="text-3xl font-bold">
          ₹{summary.totalIncome}
        </p>
      </div>

      <div className="bg-red-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">
          Expense
        </h3>

        <p className="text-3xl font-bold">
          ₹{summary.totalExpense}
        </p>
      </div>

      <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">
          Balance
        </h3>

        <p className="text-3xl font-bold">
          ₹{summary.balance}
        </p>
      </div>

    </div>

    <div className="bg-white p-6 rounded-xl shadow mb-8">
  <h2 className="text-2xl font-bold mb-4">
    Income vs Expense
  </h2>

  <div className="flex justify-center">
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {chartData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </div>
  </div>

  <div className="bg-white p-6 rounded-xl shadow mb-8">
  <h2 className="text-2xl font-bold mb-4">
    Expenses By Category
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={categoryData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="category" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="amount"
        fill="#3b82f6"
      />
    </BarChart>
  </ResponsiveContainer>
</div>

    <div className="mb-6">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border border-gray-300 bg-white px-4 py-2 rounded-lg"
      >
        <option value="">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    <div className="bg-white p-6 rounded-xl shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Update Expense" : "Add Expense"}
      </h2>

      <form
        onSubmit={handleAddExpense}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
    <input
  type="text"
  placeholder="Search expenses..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 rounded w-full mb-4"
/>
<button
  onClick={exportCSV}
  className="bg-green-500 text-white px-4 py-2 rounded"
>
  Export CSV
</button>
    <h2 className="text-2xl font-bold mb-4">
      Expenses
    </h2>

    <div className="space-y-4">
      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">
                {expense.title}
              </h3>

              <p>₹{expense.amount}</p>

              <p>{expense.category}</p>

              <p
                className={
                  expense.type === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {expense.type}
              </p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(expense)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(expense._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    <div className="flex gap-2 mt-6">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="bg-gray-300 px-4 py-2 rounded"
  >
    Previous
  </button>

  <span className="px-4 py-2">
    Page {page}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Next
  </button>

</div>

  </div>
</div>


);
}

export default Dashboard;
