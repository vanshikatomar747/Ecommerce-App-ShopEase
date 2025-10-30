import React from "react";
import { Navigate } from "react-router-dom";

export default function SellerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user || user.role !== "seller") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
