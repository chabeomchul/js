import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function StatsGrid({ rowData }) {
  const columns = [
    { field: "category", headerName: "카테고리", flex: 1 },
    { field: "value", headerName: "값", width: 120 },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={columns} />
    </div>
  );
}