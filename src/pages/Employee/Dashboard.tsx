export default function Dashboard() {
  const userName = localStorage.getItem("userName") || "Employee";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}</h1>
      <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
    </div>
  );
}
