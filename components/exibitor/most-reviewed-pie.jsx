"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MostReviewedPie({ onVisitorDataFetch }) {
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  // Fetch review data
  const fetchReviewsData = async () => {
    return request({
      url: `exhibitor/reviews/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: reviewData } = useQuery({
    queryKey: ["most-reviewed", exhibitorId], // Ensure the queryKey is unique
    queryFn: fetchReviewsData,
    enabled: !!exhibitorId, // Only run the query if exhibitorId is available
  });

  if (!reviewData) return null; // Return null if the data is not yet available

  const data = [];
  const bgs = [];
  const labels = [];

  reviewData.forEach((item, index) => {
    data.push(item.review);
    bgs.push(`hsl(${index * 36}, 70%, 50%)`); // Generate a color based on the index
    labels.push(item.title);
  });

  const dataFinal = {
    labels: labels,
    datasets: [
      {
        label: "# of Reviews",
        data: data,
        backgroundColor: bgs,
        borderWidth: 0,
        hoverOffset: 50,
      },
    ],
  };

  // Fetch visitor data by productVisitedId
  const fetchVisitorData = async (productVisitedId) => {
    return request({
      url: `exhibitor/visitor-by-reviewed/${productVisitedId}`,
      method: "get",
    });
  };

  const handleClick = async (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const selectedData = reviewData[elementIndex];
      try {
        const visitorData = await fetchVisitorData(selectedData._id);
        onVisitorDataFetch({ title: "Most Reviewed", data: visitorData }); // Pass the data to the parent component
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
