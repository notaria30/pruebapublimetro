// src/pages/sales/SalesPage.jsx
import { useEffect, useState } from "react";
import { getSales } from "../../services/salesService";
import { Link } from "react-router-dom";

function SalesPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getSales().then((res) => setSales(res.data));
  }, []);

  return (
    <div>
      <h1>Ventas</h1>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Pipeline</th>
            <th>Pagada</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.client?.nombreComercial}</td>
              <td>{s.total}</td>
              <td>{s.pipelineStatus}</td>
              <td>{s.pagada ? "Sí" : "No"}</td>
              <td>
                <Link to={`/sales/${s._id}`}>
                  <button>Ver</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesPage;
