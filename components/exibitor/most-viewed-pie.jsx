"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MostViewedPie({ onVisitorDataFetch }) {
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  // Fetch visitedStall data
  const fetchViewedData = async () => {
    return request({
      url: `exhibitor/visited-product-count/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: viewedData } = useQuery({
    queryKey: ["most-viewed"],
    queryFn: fetchViewedData,
  });

  // Fetch visitor data by productVisitedId
  const fetchVisitorData = async (productVisitedId) => {
    return request({
      url: `exhibitor/visitor-by-product/${productVisitedId}`,
      method: "get",
    });
  };

  if (!viewedData) return null; // Return null if the data is not yet available

  const data = [];
  const bgs = [];
  const labels = [];

  viewedData.forEach((item, index) => {
    data.push(item.totalVisitCount);
    bgs.push(`hsl(${index * 100}, 70%, 50%)`); // Generate a color based on the index
    labels.push(item.title);
  });

  const dataFinal = {
    labels: labels,
    datasets: [
      {
        label: "# of View",
        data: data,
        backgroundColor: bgs,
        borderWidth: 0,
        hoverOffset: 50,
      },
    ],
  };

  const handleClick = async (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const selectedData = viewedData[elementIndex];
      try {
        const visitorData = await fetchVisitorData(selectedData._id);
        onVisitorDataFetch({ title: "Most Viewed", data: visitorData }); // Pass the data to the parent component
      } catch (error) {
        alert("Error fetching visitor details");
      }
    }
  };

  return (
    <>
      <Pie
        data={dataFinal}
        width={"100%"}
        className="w-full font-quickSand"
        options={{
          layout: {
            padding: 20,
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              align: "center",
              position: "bottom",
              fullSize: true,
              labels: {
                textAlign: "left",
                padding: 10,
                pointStyle: "circle",
                boxHeight: 8,
                boxWidth: 8,
                usePointStyle: true,
                color: "#23272D",
                font: {
                  size: 10,
                  weight: "700",
                  style: "inherit",
                  family: "'Quicksand', sans-serif",
                },
              },
            },
          },
          onClick: handleClick, // Add the click event handler here
        }}
      />
    </>
  );
}
