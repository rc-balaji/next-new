"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DetailsPage() {
  const { id } = useParams();
  const [itemDetails, setItemDetails] = useState(null);

  const fetchItemDetails = async () => {
    const response = await fetch(`/api/items/get-items/?id=${id}`);
    const data = await response.json();
    setItemDetails(data);
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  if (!itemDetails) return <div>Loading...</div>;

  return (
    <div>
      <h1>Item Details</h1>
      <p>
        <strong>Name:</strong> {itemDetails.name}
      </p>
      <p>
        <strong>Description:</strong> {itemDetails.description}
      </p>
    </div>
  );
}
