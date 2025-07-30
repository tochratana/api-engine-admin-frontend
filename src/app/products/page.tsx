"use client";

import React from "react";
import { useGetProductQuery } from "@/service/apiSlide/apiSlide";

export default function ProductPage() {
  const { data, error, isLoading } = useGetProductQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred while fetching data</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="ml-1">{product.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
