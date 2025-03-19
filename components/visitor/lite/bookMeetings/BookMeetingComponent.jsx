"use client";
import { tableData, userDetails } from "@/models/visitor-data";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi"; // Import the calendar icon
import moment from "moment-timezone";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import TimezoneSelect from "react-timezone-select";
import "./bookmeeting.css";
import { request } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { notificationVisitorUtil } from "@/lib/notification";
import { BUCKET_URL } from "@/config/constant";
import Mybookings from "./Mybookings";
import { sendEmailMeetingUtil, trackMeetingUtil, trackUtil } from "@/lib/track";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const BookMeetingComponent = ({ requestForInstantMeeting, stallData }) => {
  const [modelOpen, setModelOpen] = useState(false);
  const searchParams = useSearchParams();
  const titleParam = searchParams.get("title");
  const exhibitorId = searchParams.get("exhibitorId");
  const [title, setTitle] = useState(titleParam);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [selectedSlot, setSelectedSlot] = useState({});
  const [loading, setLoading] = useState(false);
  const [isBookedSlotOnCurrentDay, setIsBookedSlotOnCurrentDay] = useState({});
  const [selectedExhibitorId, setSelectedExhibitorId] = useState();
  const [error, setError] = useState({ open: false, message: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const timeslots = useRef(null);
  const tableDatas = tableData.bookings;
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingClick, setLoadingClick] = useState(false);
  const pathname = usePathname();
  const [slots, setSlots] = useState([]);
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const visitorName =
    typeof window !== "undefined" ? localStorage.getItem("name") : null;

  const fetchSettings = async () => {
    return request({ url: "visitor/settings", method: "get" });
  };

  const { data: settingsData } = useQuery({
    queryKey: ["settingsData"],
    queryFn: fetchSettings,
  });

  const fetchExhibitor = async () => {
    return request({
      url: `visitor/exhibitorListWithStall`,
      method: "get",
    });
  };

  const { data: exhibitors } = useQuery({
    queryKey: ["exhibitorList"],
    queryFn: fetchExhibitor,
  });

  const fetchExhibitionDate = async (timeZone) => {
    return request({
      url: `visitor/get-exhibitionDate?timeZone=${timeZone}`,
      method: "get",
    });
  };

  useEffect(() => {
    const timeZone =
      typeof selectedTimezone === "string"
        ? selectedTimezone
        : selectedTimezone?.value;
    fetchExhibitionDate(timeZone);
  }, [selectedTimezone]);

  const {
    isLoading,
    data: exhibitionDate,
    isError,
  } = useQuery({
    queryKey: ["fetch-ExhibitionDate"],
    queryFn: fetchExhibitionDate, // No need to pass fetchExhibitionDate here
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (exhibitorId) setSelectedExhibitorId(exhibitorId);
  }, []);

  const tableColumnDef = [
    {
      headerName: "Sr.No",
      field: "SerialNo",
      filter: true,
      flex: 1,
      minWidth: 100,
      maxWidth: 100,
      autoHeight: true,
    },
    {
      headerName: "Date",
      field: "Date",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Time",
      field: "Time",
      filter: true,
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Timezone",
      field: "Timezone",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Exhibitor Company Name",
      field: "ExhibitorCompanyName",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Meeting Link",
      field: "MeetingLink",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
      renderCell: (params) => {
        const status = params.row.Status;
        if (status === "booked") {
          return settingsData &&
            settingsData[0] &&
            settingsData[0]?.meetingType == "customVideo" ? (
            <a
              href={settingsData[0]?.customVideoLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", cursor: "pointer" }}
            >
              Join Meeting
            </a>
          ) : (
            <a
              onClick={requestForInstantMeeting}
              rel="noopener noreferrer"
              style={{ color: "blue", cursor: "pointer" }}
            >
              Join Meeting
            </a>
          );
        }
        return null;
      },
    },
    {
      headerName: "Status",
      field: "Status",
      filter: true,
      minWidth: 200,
      flex: 1,
      autoHeight: true,
      renderCell: (params) =>
        params.value == "pending"
          ? "Pending"
          : params.value == "rejected"
            ? "Declined"
            : "Booked",
    },
  ];
  const validateBookingRequest = ({
    selectedTimezone,
    selectedExhibitorId,
    selectedDate,
  }) => {
    const timeZone =
      typeof selectedTimezone == "string"
        ? selectedTimezone
        : selectedTimezone?.value;
    let message = "";
    if (!timeZone) message = "Please Select Time Zone";
    if (!selectedExhibitorId) message = "Please Select a Company";
    if (!selectedDate) message = "Please Select a date";

    if (message) {
      setError({ open: true, message });
      return false;
    } else {
      setError({ open: false, message: "" });
      return true;
    }
  };
  const handleSelect = async (e) => {
    setSelectedSlot({});
    const id = e.target.value;
    setSelectedExhibitorId(id);
    if (!id) return;
    const isValid = validateBookingRequest({
      selectedTimezone,
      selectedExhibitorId: id,
      selectedDate,
    });
    if (isValid)
      fetchSlots({ selectedTimezone, selectedExhibitorId: id, selectedDate });
  };
  const fetchSlots = async ({
    selectedTimezone,
    selectedExhibitorId,
    selectedDate,
  }) => {
    try {
      setIsBookedSlotOnCurrentDay(false);
      setLoading(true);
      const timeZone =
        typeof selectedTimezone == "string"
          ? selectedTimezone
          : selectedTimezone?.value;
      const response = await request({
        url: `visitor/list-slots?timeZone=${timeZone}&visitorId=${visitorId}&id=${selectedExhibitorId}&date=${selectedDate}&startDate=${exhibitionDate?.startDate}&endDate=${exhibitionDate?.endDate}&duration=${exhibitionDate?.duration}`,
        method: "get",
      });
      // const response = await fetch(
      //   `${BASE_URL}visitor/list-slots?timeZone=${timeZone}&id=${selectedExhibitorId}&date=${selectedDate}`
      // );
      // const parsedResponse = await response.json();
      // if (!parsedResponse?.success)
      //   throw new Error(
      //     parsedResponse?.message || "Something went wrong.Please try again"
      //   );
      if (!response?.slots?.length) {
        setError({
          open: true,
          message: `No Slots available for Selected Options`,
        });
      } else {
        const isBooked = response?.slots.find((item) => {
          return item?.visitorId === visitorId;
        });
        setIsBookedSlotOnCurrentDay(isBooked);

        setSelectedSlot({
          slotDate: isBooked?.slotDate,
          exhibitorId: selectedExhibitorId,
          visitorId,
          time: isBooked?.time,
          duration: isBooked?.durationInMinutes,
          timeZone,
          status: isBooked?.status,
          meetingId: isBooked?.meetingId,
        });
        setSlots([...response?.slots] || []);
        timeslots.current.style.display = "block";
      }
      setLoading(false);

    } catch (err) {
      setError({
        open: true,
        message: err?.message || "Something went wrong please try again",
      });
      console.log(err);
      setLoading(false);
    }
  };
  const handleBooking = async (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    const response = await request({
      url: `visitor/list-booked-slots?visitorId=${visitorId}`,
      method: "get",
    });
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_SERVER_URL}/slotBooking/list-booked-slots?visitorId=${visitorId}`
    // );
    // const parsedResponse = await response.json();
    setBookedSlots(response || []);
    setModelOpen(true);
  };

  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setModelOpen(false);
  };
  const getCurrentDateInput = () => {
    const dateObj = new Date();
    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    return shortDate;
  };

  // Format the date to 'yyyy-mm-dd' before passing it to handleDateChange
  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const formattedDate = formatDate(e);
    setSelectedSlot({});
    setSelectedDate(formattedDate);
    const isValid = validateBookingRequest({
      selectedTimezone,
      selectedExhibitorId,
      selectedDate: formattedDate,
    });
    if (isValid)
      fetchSlots({
        selectedTimezone,
        selectedExhibitorId,
        selectedDate: formattedDate,
      });
  };

  const handleSelectSlot = async (data) => {
    if (loadingClick) return;
    try {
      setLoading(true);
      setLoadingClick(true);
      let isBooked = slots.find((item) => {
        return item?.visitorId === visitorId;
      });
      const currentDateTime = moment
        .tz(moment(new Date()), "UTC")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      const isExpired = moment(currentDateTime).diff(
        moment(data?.time),
        "minutes"
      );
      if (data?.status === "booked" || isExpired > 0) return;
      if (isBooked?.status == "booked") {
        setError({
          open: true,
          message: "Multiple bookings are not allowed in a day",
        });
        setLoading(false);
        setLoadingClick(false);
        return;
      }
      if (isBooked && data?.status === "available") {
        if (!Object.keys(selectedSlot).length) return;
        // Calculate endDate by adding duration to slotTime
        const endDateOnDuration = moment(selectedSlot?.time)
          .add(selectedSlot?.duration || 0, "minutes")
          .toISOString();
        const payload = {
          ...selectedSlot,
          status: "",
          startDate: selectedSlot?.time,
          endDate: endDateOnDuration,
        };
        const meetingData = await request({
          url: `visitor/book-slot`,
          method: "post",
          data: payload,
        });

        if (meetingData) {
          trackUtil({
            trackEventType: "Slot book request",
            data: {
              stallName: stallData.stall.stallName,
            },
          });
          // trackMeetingUtil({
          //   trackEventType: "Slot book request",
          //   data: payload,
          //   visitor: visitorId,
          //   exhibitor: meetingData?.exhibitorId,
          //   meetingId: meetingData?._id,
          // });
          // sendEmailMeetingUtil({
          //   visitorId: visitorId,
          //   exhibitorId: meetingData?.exhibitorId,
          //   slotData: payload,
          // });

          notificationVisitorUtil(
            {
              notificationType: "Slot book request",
              data: {
                stallName: stallData.stall.stallName,
              },
            },
            stallData.stall.exhibitor
          );
        }
      }
      let status = "";
      if (data?.status !== "pending") status = "pending";
      const timeZone =
        typeof selectedTimezone == "string"
          ? selectedTimezone
          : selectedTimezone?.value;

      const endDateOnDuration = moment(data?.time)
        .add(data?.durationInMinutes || 0, "minutes")
        .toISOString();
      const payload = {
        slotDate: data?.slotDate,
        exhibitorId: selectedExhibitorId,
        visitorId,
        time: data?.time,
        // time: data?.time ? dayjs(data.time).format("HH:mm") : "",
        duration: data?.durationInMinutes,
        timeZone,
        status,
        meetingId: data?.meetingId,
        startDate: data?.time,
        endDate: endDateOnDuration,
      };

      if (isBooked) {
        isBooked = {
          slotDate: isBooked?.slotDate,
          exhibitorId: selectedExhibitorId,
          visitorId,
          time: isBooked?.time,
          duration: isBooked?.durationInMinutes,
          timeZone,
          status,
          meetingId: isBooked?.meetingId,
        };
      }

      if (status == "pending") setSelectedSlot(payload);
      const meetingData = await request({
        url: `visitor/book-slot`,
        method: "post",
        data: payload,
      });
      if (meetingData.success === false) {
        // Handle the error case - show the error message
        setError({ open: true, message: meetingData.message });
      }
      if (meetingData) {
        payload.time = data?.time ? dayjs(data.time).format("HH:mm") : "";
        trackMeetingUtil({
          trackEventType: "Slot book request",
          data: payload,
          visitor: visitorId,
          exhibitor: meetingData?.exhibitorId,
          meetingId: meetingData?._id,
        });
        sendEmailMeetingUtil({
          visitorId: visitorId,
          exhibitorId: meetingData?.exhibitorId,
          slotData: payload,
        });
      }
      setIsBookedSlotOnCurrentDay(payload);
      //TODO handle
      fetchSlots({
        selectedTimezone,
        selectedExhibitorId,
        selectedDate,
      });
      notificationVisitorUtil(
        {
          notificationType: "Book slot",
          data: {
            bookingDate: selectedDate,
          },
        },
        selectedExhibitorId
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingClick(false); // Reset loading state after request finishes
    }
  };
  const handleTimezoneChange = (timeZone) => {
    setSelectedSlot({});
    fetchExhibitionDate(timeZone);
    setSelectedTimezone(timeZone);
    fetchSlots({
      selectedTimezone: timeZone,
      selectedExhibitorId,
      selectedDate,
    });
  };

  const getSlotStyle = (data, visitorId) => {
    let style = "";
    // Determine current time in UTC
    const currentDateTime = moment().utc();
    const slotTime = moment(data?.time).utc(); // Ensure the time is treated as UTC
    const isExpired = currentDateTime.diff(slotTime, "minutes");

    // Case: Expired slot
    if (isExpired > 0) {
      style = "expired"; // Corresponds to Gray (#A7A7A7)
    }
    // Case: The current visitor's own slot
    else if (data?.visitorId === visitorId) {
      if (data?.status === "pending") {
        style = "pending"; // Corresponds to Orange (#FFA500 or `orange`)
      } else if (data?.status === "booked") {
        style = "mySlot"; // Corresponds to Green (#4ABD5D)
      } else if (data?.status === "rejected") {
        style = "rejected"; // Corresponds to Green (#4ABD5D)
      }
    }
    // Case: Slot booked by someone else
    else if (data?.status === "booked") {
      style = "booked"; // Corresponds to Red (#FB5151)
    }
    // Case: Slot pending but not booked by the current visitor
    else if (data?.status === "pending") {
      style = "pending"; // Corresponds to Orange (#FFA500)
    }
    // Case: Slot is available
    else {
      style = "available"; // Corresponds to White (#FFFFFF)
    }

    return style;
  };

  // Helper function to group slots by date
  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const date = slot.slotDate; // Get the date of the slot
      if (!acc[date]) {
        acc[date] = []; // Initialize an array for this date if it doesn't exist
      }
      acc[date].push(slot); // Add the slot to the corresponding date
      return acc;
    }, {});
  };
  const groupedSlots = groupSlotsByDate(slots);

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        readOnly
        placeholder="dd/mm/yyyy"
        className="h-[35px] min-h-[35px] rounded-lg w-full min-w-[185px] px-3 pr-10 outline-none font-medium font-lato text-sm"
      />
      <FiCalendar
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        size={20}
        onClick={onClick}
      />
    </div>
  ));

  return (
    <>
      {modelOpen ? (
        <Mybookings
          handleModelClose={handleModelClose}
          bookedSlots={bookedSlots}
          tableColumnDef={tableColumnDef}
        />
      ) : (
        ""
      )}
      <section
        className="lg:pl-3 lg:pr-5 lg:py-5 bg-white w-full overflow-x-scroll px-3 h-[100vh]"
        id="main-content-body"
      >
        <div className=" w-full h-full">
          <div className="w-full flex flex-row gap-5 sm:gap-2 flex-wrap md:flex-nowrap justify-between bg-black rounded-t-2xl px-7 sm:px-2 py-4 sm:py-1 overflow-x-auto">
            <div className=" w-full md:w-fit flex flex-row justify-start items-center gap-4">
              <p className=" font-bold font-quickSand text-base text-white">
                Select Company
              </p>
              <select
                placeholder="Please Select the Company"
                value={selectedExhibitorId}
                onChange={(e) => handleSelect(e)}
                className=" h-[35px] rounded-lg w-full pl-3 pr-5 outline-none font-medium font-lato text-sm"
                name="company"
                id="company"
              >
                <option value="">Please Select the Company</option>
                {/* <option value="">Select</option> */}
                {exhibitors &&
                  exhibitors.length > 0 &&
                  exhibitors.map((data) => {
                    return (
                      <option value={data?._id} key={data?._id}>
                        {data?.companyName}({data?.name} )
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="  w-full md:w-fit flex flex-row justify-start items-center gap-4">
              <p className=" font-bold font-quickSand text-base text-white">
                Select Date
              </p>
              {/* <input
                value={selectedDate}
                min={exhibitionDate?.startDate}
                max={exhibitionDate?.endDate}
                onInput={(e) => handleDateChange(e)}
                className=" h-[35px] min-h-[35px] rounded-lg w-full min-w-[185px] px-3 outline-none font-medium font-lato text-sm"
                type="date"
                placeholder="dd/mm/yyyy"
              ></input> */}
              <div >
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date(exhibitionDate?.startDate)}
                  maxDate={new Date(exhibitionDate?.endDate)}
                  placeholderText="dd/mm/yyyy"
                  className="h-[35px] min-h-[35px] rounded-lg w-full min-w-[185px] px-3 outline-none font-medium font-lato text-sm"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput />}
                // Custom styles for disabled dates
                // dayClassName={(date) => {
                //   if (
                //     date < new Date(exhibitionDate?.startDate) ||
                //     date > new Date(exhibitionDate?.endDate)
                //   ) {
                //     return "disabled-date";
                //   }
                //   return undefined;
                // }}
                />
                {/* <FiCalendar
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  size={20}
                /> */}
              </div>
            </div>
            <div className="w-full md:w-fit flex flex-row justify-start items-center gap-4 md:max-w-[320px]">
              <p className="font-bold font-quickSand text-base text-white">
                Select Timezone
              </p>
              <div className="h-[35px] w-full rounded-lg min-w-[200px]">
                <TimezoneSelect
                  className="h-full w-full rounded-lg timezoneParent outline-none font-medium font-lato text-sm"
                  value={selectedTimezone}
                  onChange={handleTimezoneChange}
                  menuPortalTarget={document.body} // Moves dropdown outside parent
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }) // Ensures visibility
                  }}
                />
              </div>
            </div>

          </div>
          <div className=" bg-[#F5F5F5] rounded-b-2xl w-full p-6">
            <div
              ref={timeslots}
              className={`${title == undefined ? "hidden" : ""}`}
            >
              <div className=" flex flex-row flex-wrap justify-center items-center gap-5">
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[#ffff] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    Available
                  </p>
                </div>
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[#4ABD5D] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    My Booking
                  </p>
                </div>
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[#840cf5] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    Booked
                  </p>
                </div>
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[#A7A7A7] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    Expired
                  </p>
                </div>
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[#f30505] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    Declined
                  </p>
                </div>
                <div className=" flex flex-row gap-1 justify-start items-center">
                  <div className="w-2 h-2 bg-[orange] rounded-full"></div>
                  <p className=" font-quickSand text-xs font-semibold">
                    Pending
                  </p>
                </div>
              </div>
              <div className=" flex flex-row flex-wrap gap-4 justify-start items-center mt-4 cursor-pointer">
                <div className="flex flex-col mt-4">
                  {/* Iterate over each date and its corresponding slots */}
                  {Object.keys(groupedSlots).map((slotDate) => (
                    <div key={slotDate} className="md:mb-6 mb-2">
                      {/* Date heading */}
                      <h3 className="text-lg font-bold mb-2">
                        {moment(slotDate).format("MMMM DD, YYYY")}
                      </h3>

                      {/* Display the slots for this date */}
                      <div className="flex flex-row flex-wrap gap-3 justify-start items-center cursor-pointer">
                        {groupedSlots[slotDate].map((data) => (
                          <div
                            key={data?.slotTiming}
                            className={`timeSelect ${getSlotStyle(
                              data,
                              visitorId
                            )} rounded-lg border px-3 py-2`}
                            onClick={() =>
                              data?.status == "available" &&
                              !loadingClick &&
                              handleSelectSlot(data)
                            }
                          >
                            <p className="font-quickSand text-xs font-semibold">
                              {data?.slotTiming}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className=" md:mt-14 mt-4 mb-4 flex gap-6 w-full md:w-fit flex-col md:flex-row justify-start items-start md:items-center">
              <button
                onClick={(e) => handleBooking(e)}
                className=" p-4 font-lato font-bold text-base bg-[#1C1B20] text-white rounded-lg"
              >
                Show My Bookings
              </button>
            </div>
          </div>
        </div>
      </section>
      {error?.open && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={error?.open}
          autoHideDuration={6000}
          onClose={() => setError({ open: false, message: "" })}
        >
          <Alert
            onClose={() => setError({ open: false, message: "" })}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {error?.message}
          </Alert>
        </Snackbar>
      )}
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={() => setLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

// const Page = () => {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <BookMeetingComponent />
//     </Suspense>
//   );
// };

export default BookMeetingComponent;
