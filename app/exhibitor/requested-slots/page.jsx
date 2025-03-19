"use client";
import { request } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LocationBand from "@/components/exibitor/locationBand";
import { notificationExhibitorUtil } from "@/lib/notification";
import {
  sendEmailMeetingConfirmationUtil,
  trackMeetingUtil,
} from "@/lib/track";
import CommonDataTableView from "@/components/grid/CommonDataTableView";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useState } from "react";

dayjs.extend(isSameOrAfter);

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  const [activeTab, setActiveTab] = useState("upcoming meetings");

  const today = dayjs().format("YYYY-MM-DD");

  // const fetchSettings = async () => {
  //   return request({ url: "visitor/settings", method: "get" });
  // };

  // const { data: settingsData } = useQuery({
  //   queryKey: ["settingsData"],
  //   queryFn: fetchSettings,
  // });

  const fetchRequestedSlots = async () => {
    if (!exhibitorId) return null;
    return request({
      url: `exhibitor/get-requested-slots?id=${exhibitorId}`,
      method: "get",
    });
  };

  const { data: requestedslots, refetch } = useQuery({
    queryKey: ["requested-slots"],
    queryFn: fetchRequestedSlots,
  });

  // Filter upcoming and completed meetings
  const upcomingMeetings = requestedslots && requestedslots.length ? requestedslots.filter((meeting) =>
    dayjs(meeting.date).isSameOrAfter(today)
  ) : [];
  const completedMeetings = requestedslots && requestedslots.length ? requestedslots.filter((meeting) =>
    dayjs(meeting.date).isBefore(today)
  ) : [];


  const handleClick = async (action, data) => {
    try {
      const payload = {
        meetingId: data?.meetingId,
        exhibitorId: exhibitorId,
        status: action == "approve" ? "booked" : "rejected",
        visitorId: data.visitorId,
      };
      const meetingData = request({
        url: `exhibitor/change-status`,
        method: "post",
        data: payload,
      });
      if (meetingData) {
        trackMeetingUtil({
          trackEventType: `Slot ${action == "approve" ? "approved" : "declined"
            } by exhibitor.`,
          data: {
            ...data,
            timeZone: data.timeZone,
            status: action == "approve" ? "booked" : "rejected",
          },
          visitor: data.visitorId,
          exhibitor: exhibitorId,
          meetingId: data?.meetingId,
        });
        sendEmailMeetingConfirmationUtil({
          visitorId: data.visitorId,
          exhibitorId: exhibitorId,
          slotData: data,
          status: action,
        });
      }
      queryClient.invalidateQueries("requested-slots");
      await refetch();
      notificationExhibitorUtil(
        {
          notificationType: `Meeting ${action == "approve" ? "approved" : "Declined"
            } by exhibitor.`,
          data: {
            bookingDate: data.date,
            meetingId: data.meetingId,
          },
        },
        data.visitorId
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveMeetingLink = async (meetingLink, data) => {
    try {
      const payload = {
        meetingId: data?.meetingId,
        exhibitorId: exhibitorId,
        meetingLink: meetingLink,
      };

      // API call to update the meeting link
      await request({
        url: `exhibitor/update-meeting-link`,
        method: "post",
        data: payload,
      });

      // Invalidate the query to refetch data
      queryClient.invalidateQueries("requested-slots");
      await refetch();

      console.log("Meeting link updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const joinMeeting = (id) => {
    router.push(`/exhibitor/video-chat?id=${id}`);
  }

  const tableColumnDef = [
    {
      headerName: "Date",
      field: "date",
      filter: true,
      minWidth: 130,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Time",
      field: "time",
      filter: true,
      minWidth: 100,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Timezone",
      field: "timeZone",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Visitor Name",
      field: "name",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Visitor Company",
      field: "visitorCompany",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Visitor Email",
      field: "visitorEmail",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Status",
      field: "status",
      filter: true,
      minWidth: 100,
      flex: 1,
      autoHeight: true,
      renderCell: (params) =>
        params.value == "pending"
          ? "Pending"
          : params.value == "rejected"
            ? "Declined"
            : "Booked",
    },
    {
      headerName: "Meeting Link",
      field: "meetingLink",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
      renderCell: (params) => {
        const status = params.row.status;
        const isDefaultMeeting = params.row.defaultMeeting;
        const meetingLink = params.row.meetingLink;

        if (status === "booked") {
          return isDefaultMeeting ? (
            <a
              onClick={() => joinMeeting(params.row._id)}
              style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            >
              Join Meeting
            </a>
          ) : (
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Join Meeting
            </a>
          );
        }

        return null;
      }
    },
    {
      headerName: "Action",
      minWidth: 300,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: params?.row?.status === "pending" ? "block" : "none",
            }}
          >
            <button
              className="cursor-pointer font-lato text-base font-bold text-black bg-brand-color rounded-lg px-2 py-2  md:w-min w-full"
              onClick={() => handleClick("approve", params?.row)}
            >
              Approve
            </button>
            <button
              className="ml-2 cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-2 py-2  md:w-min w-full"
              onClick={() => handleClick("reject", params?.row)}
            >
              Decline
            </button>
          </div>
        );
      },
    },

  ];

  if (!exhibitorId || exhibitorId === null) return null;

  return (
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-20 pb-4 px-3 lg:min-h-screen  flex flex-col"
      id="main-content-body"
    >
      <LocationBand></LocationBand>
      {/* <div className=" flex justify-end mt-7">
        <button className=" bg-black text-white px-4 py-3 rounded-lg text-sm font-quickSand font-bold">
          Export as CSV
        </button>
      </div> */}
      <div className="w-full h-full relative bottom-0 bg-white mx-auto my-auto flex flex-col items-start mt-5 rounded-lg overflow-hidden">
        <div className=" headerDiv w-full h-14 flex justify-between items-center bg-[#222222] text-white text-lg font-lato  px-8">
          <p className=" header text-2xl font-lato font-bold">Meeting Requested</p>
        </div>
        {/* Tabs */}
        <div className="flex space-x-5 border-b pb-0 px-8 mt-4 w-full">
          <button
            className={`px-4 py-2 ${activeTab === "upcoming meetings"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("upcoming meetings")}
          >
            Upcoming Meetings
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "completed meetings"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("completed meetings")}
          >
            Completed Meetings
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full h-[80vh] px-2 md:px-8 bg-white rounded-b-[32px] pb-5 overflow-auto">
          {activeTab === "upcoming meetings" ? (
            <div className="w-full min-h-fit h-full max-h-[90%] bg-white">
              <div className="ag-theme-alpine pb-1 w-full h-full">
                <CommonDataTableView
                  columns={tableColumnDef}
                  rowData={upcomingMeetings}
                  filename=""
                />
              </div>
            </div>
          ) : (
            <div className="w-full min-h-fit h-full max-h-[90%] bg-white">
              <div className="ag-theme-alpine pb-1 w-full h-full">
                <CommonDataTableView
                  columns={tableColumnDef}
                  rowData={completedMeetings}
                  filename=""
                />
              </div>
            </div>
          )}
        </div>
        {/* <div className="ag-theme-alpine h-96 gridContainer pb-1 w-full">
          <CommonDataTableView
            columns={tableColumnDef}
            rowData={requestedslots}
            filename={""}
          />
        </div> */}
      </div>
    </section>
  );
}
