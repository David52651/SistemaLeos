import useRole from "@/hooks/useRole";

export default function DashboardPage() {

  const { role } = useRole();

  return (
    <div>

      <h1>Dashboard</h1>

      <h2>
        Rol actual:
      </h2>

      <p>
        {role}
      </p>

    </div>
  );
}