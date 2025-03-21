"use client";
import { request } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationExhibitorUtil } from "@/lib/notification";
import {
  sendEmailMeetingConfirmationUtil,
  trackMeetingUtil,
} from "@/lib/track";

const RequestedSlots = () => {
  const queryClient = useQueryClient();
  const exbId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const fetchSettings = async () => {
    return request({ url: "visitor/settings", method: "get" });
  };

  const { data: settingsData } = useQuery({
    queryKey: ["settingsData"],
    queryFn: fetchSettings,
  });

  const fetchRequestedSlots = async () => {
    return request({
      url: `exhibitor/get-requested-slots?id=${exbId}`,
      method: "get",
    });
  };

  const { data: requestedslots, refetch } = useQuery({
    queryKey: ["requested-slots"],
    queryFn: fetchRequestedSlots,
  });
  const handleClick = async (action, data) => {
    try {
      const payload = {
        meetingId: data?.meetingId,
        exhibitorId: exbId,
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
          exhibitor: exbId,
          meetingId: data?.meetingId,
        });
        sendEmailMeetingConfirmationUtil({
          visitorId: data.visitorId,
          exhibitorId: exbId,
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
        exhibitorId: exbId,
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
      headerName: "Action",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <div
            style={{
              display:
                params?.node?.data?.status === "pending" ? "block" : "none",
            }}
          >
            <button
              className="cursor-pointer font-lato text-base font-bold text-black bg-brand-color rounded-lg px-2 py-2  md:w-min w-full"
              onClick={() => handleClick("approve", params.node.data)}
            >
              Approve
            </button>
            <button
              className="ml-2 cursor-pointer font-lato text-base font-bold text-white bg-static-black rounded-lg px-2 py-2  md:w-min w-full"
              onClick={() => handleClick("reject", params.node.data)}
            >
              Decline
            </button>
          </div>
        );
      },

      minWidth: 150,
      autoHeight: true,
    },
    {
      headerName: "Meeting Link",
      field: "meetingLink",
      minWidth: 300,
      renderCell: (params) => {
        if (params.row.status !== "booked") {
          return null; // Return nothing if the status is not 'booked'
        }

        // const [meetingLink, setMeetingLink] = useState(
        //   params.row.meetingLink || ""
        // );

        // const handleSaveClick = () => {
        //   handleSaveMeetingLink(meetingLink, params.node.data);
        // };

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {settingsData &&
              settingsData[0] &&
              settingsData[0]?.meetingType == "customVideo" ? (
              <a
                href={settingsData[0]?.customVideoLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "blue" }}
              >
                Join Meeting
              </a>
            ) : (
              <div>Check "Join Meeting" menu</div>
            )}
            {/* <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="Enter meeting link"
              className="input"
              style={{ width: "100%" }}
            />
            <button onClick={handleSaveClick} style={{ color: "blue" }}>
              Save
            </button> */}
          </div>
        );
      },
      autoHeight: true,
    },
  ];
  return (
    <section
      className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full h-full relative pt-20 pb-4 px-3 lg:min-h-screen  flex flex-col"
      id="main-content-body"
    >
      <div className="w-full h-full relative bottom-0 bg-white mx-auto my-auto flex flex-col items-start mt-5 rounded-lg overflow-hidden">
        <div className="ag-theme-alpine h-96 gridContainer pb-1 w-full">
          <CommonDataTableView
            columns={tableColumnDef}
            rowData={requestedslots}
            filename={""}
          />
        </div>
      </div>
    </section>
  );
};
export default RequestedSlots;
