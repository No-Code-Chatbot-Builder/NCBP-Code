"use client";
import { fetchUsers } from "@/lib/api/apiService";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.log("Error loading data: ", error);
      }
    };

    loadData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Data from API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
