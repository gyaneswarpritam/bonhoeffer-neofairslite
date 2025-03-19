"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MostLikedPie({ onVisitorDataFetch }) {
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  // Fetch visitedStall data
  const fetchLikesData = async () => {
    return request({
      url: `exhibitor/likes/${exhibitorId}`,
      method: "get",
    });
  };

  const { data: likeData } = useQuery({
    queryKey: ["most-liked"],
    queryFn: fetchLikesData,
  });

  if (!likeData) return null; // Return null if the data is not yet available

  const data = [];
  const bgs = [];
  const labels = [];

  likeData.forEach((item, index) => {
    data.push(item.like);
    bgs.push(`hsl(${index * 100}, 70%, 50%)`); // Generate a color based on the index
    labels.push(item.title);
  });

  const dataFinal = {
    labels: labels,
    datasets: [
      {
        label: "# of Likes",
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
      url: `exhibitor/visitor-by-liked/${productVisitedId}`,
      method: "get",
    });
  };

  const handleClick = async (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const selectedData = likeData[elementIndex];
      try {
        const visitorData = await fetchVisitorData(selectedData._id);
        onVisitorDataFetch({ title: "Most Liked", data: visitorData }); // Pass the data to the parent component
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
          onClick: handleClick,
        }}
      />
    </>
  );
}
