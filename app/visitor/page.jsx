"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import "./stallView.css";
import { isMobile, isTablet } from "react-device-detect";
import { userDetails } from "@/models/data";
import ContactModel from "@/components/contactModel";
import { useDispatch, useSelector } from "react-redux";
import GalleryModel from "@/components/galleryModel";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  modelChange,
  modelOpen,
} from "@/GlobalRedux/features/dialogs/dialogSlice";
import Model from "@/components/visitor/model";
import { request, requestWithStatus } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { sendEmailMeetingNotifyVisitorUtil, trackUtil } from "@/lib/track";
import ConfirmModel from "@/components/confirmModel";
import { notificationVisitorUtil } from "@/lib/notification";
import { BUCKET_URL } from "@/config/constant";
import VisitorChatModal from "@/components/VisitorChatModal";
import VisitorMeetingModal from "@/components/VisitorMeetingModal";
import { useForm } from "react-hook-form";
import VerifyProfileForm from "@/components/visitor/lite/VerifyProfileForm";
import { toast } from "react-toastify";
import Mybookings from "@/components/visitor/lite/bookMeetings/Mybookings";
import moment from "moment-timezone";
import MessageModel from "@/components/messageModel";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { dayjsShortFormat } from "@/lib/dayjs";
import "./../../components/visitor/side-nav.css";
import NotificationModal from "@/components/visitor/NotificationModal";
import AuditoriumModal from "@/components/visitor/AuditoriumModal";
import Support from "@/components/visitor/lite/Support";

const StallViewComponent = () => {
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const visitorName =
    typeof window !== "undefined" ? localStorage.getItem("name") : null;

  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  /*Stall*/
  const fetchAllStall = async () => {
    return request({ url: "visitor/all-stall", method: "get" });
  };
  const { data: stallList } = useQuery({
    queryKey: ["all-stall"],
    queryFn: fetchAllStall,
  });

  const fetchVisitorData = async () => {
    return request({
      url: `visitor/visitorByIdToVerify/${visitorId}`,
      method: "get",
    });
  };
  const { data: visitorData } = useQuery({
    queryKey: ["visitorData"],
    queryFn: fetchVisitorData,
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
  };

  const fetchbookedSlots = async () => {
    const todayDate = getTodayDate();
    return await request({
      url: `visitor/list-booked-slots?visitorId=${visitorId}`,
      method: "get",
    });
  };
  const { data: bookedSlots } = useQuery({
    queryKey: ["bookedSlots"],
    queryFn: fetchbookedSlots,
  });

  const searchParams = useSearchParams();
  let id = "";
  if (stallList && stallList.length > 0) {
    id = stallList[0]._id;
  }

  const fetchStallData = async () => {
    return request({ url: `visitor/stall/${id}/${visitorId}`, method: "get" });
  };

  const {
    isLoading,
    data: stallData,
    isError,
    error,
  } = useQuery({
    queryKey: ["stall-data", id], // Include id in the queryKey
    queryFn: fetchStallData,
    enabled: !!id, // Enable the query only if id is present
  });

  const fetchUnreadNotification = async () => {
    return request({
      url: `visitor/notification/${visitorId}`,
      method: "get",
    });
  };

  const { data: unreadNotifications } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: fetchUnreadNotification,
  });

  const isModelOpen = useSelector((state) => state.dialog.isopen);
  const router = useRouter();
  const dispatch = useDispatch();

  const [device, setDevice] = useState(null);
  const [height, setHeight] = useState(null);
  const user = userDetails;
  const [contactInfo, setContactInfoOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [galleryModel, setGalleryModel] = useState(false);
  const [floorModel, setFloorModel] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stallsListDetails, setStallsListDetails] = useState([]);
  const [totalStalls, setTotalStalls] = useState(0);
  const [meetingId, setMeetingId] = useState("");
  const [chatView, setChatView] = useState("");
  const [notificationView, setNotificationView] = useState(false);
  const [meetingView, setMeetingView] = useState("");
  const [fromLink, setFromLink] = useState(false);
  const [verifyPhoneEmail, setVerifyPhoneEmail] = useState(false);
  const [support, setSupport] = useState(false);
  const [resetBtn, setResetBtn] = useState(false);
  const [modelOpenBooking, setModelOpenBooking] = useState(false);
  const [messageModelOpen, setMessageModelOpen] = useState(false);
  const [auditoriumModelOpen, setAuditoriumModelOpen] = useState(false);
  const [messageBody, setMessageBody] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [customErrors, setCustomErrors] = useState({});
  const fetchInstantMeetingData = async () => {
    return request({
      url: `visitor/instant-meeting-by-stall/${id}/${visitorId}`,
      method: "get",
    });
  };

  const fetchBriefcaseData = async () => {
    return request({ url: `visitor/briefcase/${visitorId}`, method: "get" });
  };

  const { data: briefcaseData } = useQuery({
    queryKey: ["briefcaseData"],
    queryFn: fetchBriefcaseData,
    refetchInterval: 5000,
  });

  const fetchSettings = async () => {
    return request({ url: "visitor/settings", method: "get" });
  };

  const { data: settingsData } = useQuery({
    queryKey: ["settingsData"],
    queryFn: fetchSettings,
  });

  const { data: instantMeeting } = useQuery({
    queryKey: ["instant-meeting", id], // Include id in the queryKey
    queryFn: fetchInstantMeetingData,
    enabled: !!id, // Enable the query only if id is present
    refetchInterval: 5000,
  });

  const fetchChatExhibitor = async () => {
    return request({
      url: `exhibitor-messages/getChatUser/${visitorId}`,
      method: "get",
    });
  };

  const { data: chatExhibitor } = useQuery({
    queryKey: ["getChatExhibitorList"],
    queryFn: fetchChatExhibitor,
    refetchInterval: 2000,
  });

  // Function to sort stallList by position
  // const sortStallListByPosition = (list) => {
  //   return list.sort((a, b) => {
  //     return a.position - b.position;
  //   });
  // };

  useEffect(() => {
    if (visitorData && Object.keys(visitorData).length) {
      if (!visitorData?.visitor?.phoneVerified) {
        toast.info(`Please verify your phone on profile section.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (!visitorData?.visitor?.emailVerified) {
        toast.info(`Please verify your email on profile section.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }, [visitorData]);

  useEffect(() => {
    const createOrUpdateVisitedStall = async () => {
      try {
        if (stallData) {
          await request({
            url: "visitor/visited-stall",
            method: "post",
            data: {
              stall: id,
              exhibitor: stallData.stall.exhibitor,
              visitor: visitorId,
            },
          });

          await request({
            url: "visitor/stall-visit",
            method: "post",
            data: {
              exhibitorId: stallData.stall.exhibitor,
              visitorId: visitorId,
            },
          });
        }
      } catch (error) {
        console.error("Error creating or updating visited stall:", error);
      }
    };
    createOrUpdateVisitedStall();
  }, [stallData, id, visitorId]);
  // useEffect(() => {
  //   if (stallList && stallList.length) {
  //     const sortedStallList = sortStallListByPosition([...stallList]);
  //     setTotalStalls(stallList.length);
  //     setStallsListDetails(sortedStallList);
  //   }
  // }, [stallList]);
  const image = useRef(null);
  useEffect(() => {
    if (isMobile || isTablet) {
      setDevice(isMobile === true && isTablet === false ? "mobile" : "tablet");
    } else {
      setDevice("desktop");
    }
    return () => { };
  }, []);

  useEffect(() => {
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
      notificationVisitorUtil(
        {
          notificationType: "Stall Visit",
          data: {
            stallName: stallData.stall.stallName,
          },
        },
        stallData.stall.exhibitor
      );
    }
    return () => {
      setConfirmOpen(false);
      setMeetingId("");
    };
  }, [stallData]);

  useEffect(() => {
    if (chatExhibitor && chatExhibitor.length) {
      // Calculate the total unread messages
      const totalUnread = chatExhibitor.reduce(
        (total, visitor) => total + visitor.unread,
        0
      );
      setTotalUnreadMessages(totalUnread);
    }
  }, [chatExhibitor]);

  const handleContactInfo = () => {
    setContactInfoOpen(!contactInfo);
    setGalleryModel(false);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View Contact Info",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const handleConfirm = () => {
    setConfirmOpen(false);
    requestForCancelledInstantMeeting();
  };

  const handleCloseModal = () => {
    setConfirmOpen(false);
  };
  const openGallery = () => {
    setGalleryModel(true);
    setContactInfoOpen(false);
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: "Stall View Gallery",
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };
  const closeGallery = () => {
    setGalleryModel(false);
  };

  const handleModelopen = (e) => {
    dispatch(modelChange(e));
    dispatch(modelOpen());
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: e,
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };

  const handleChatView = (status) => {
    setChatView(!status);
  };

  const handleNotificationView = (status) => {
    setNotificationView(!status);
  };

  const handleMeetingView = (status) => {
    setMeetingView(!status);
  };

  const socialTrack = (social) => {
    if (stallData && stallData.stall) {
      trackUtil({
        trackEventType: `View ${social}`,
        data: {
          stallName: stallData.stall.stallName,
        },
      });
    }
  };

  const logout = () => {
    const userConfirmed = window.confirm("Are you sure you want to logout?");

    if (userConfirmed) {
      request({ url: `visitor/logout/${visitorId}`, method: "get" });
      localStorage.clear();
      router.push("/");
    }
  };

  const requestForInstantMeeting = async () => {
    const meetingData = await request({
      url: `visitor/instant-meeting`,
      method: "post",
      data: {
        visitor: visitorId,
        name: visitorName,
        stallId: id,
        exhibitor: stallData.stall.exhibitor,
        approve: false,
        completed: false,
        rejected: false,
        cancelled: false,
      },
    });
    if (meetingData) {
      setConfirmOpen(true);
      setMeetingId(meetingData._id);
    }

    notificationVisitorUtil(
      {
        notificationType: "Instant Meeting",
        data: {
          stallName: stallData.stall.stallName,
          status: "Requested",
        },
      },
      stallData.stall.exhibitor
    );
  };
  const requestForCancelledInstantMeeting = async () => {
    const meetingData = await request({
      url: `visitor/instant-meeting/${meetingId}`,
      method: "put",
      data: {
        visitor: visitorId,
        name: visitorName,
        stallId: id,
        exhibitor: stallData.stall.exhibitor,
        approve: false,
        completed: false,
        rejected: false,
        cancelled: true,
      },
    });
    if (meetingData) {
      setConfirmOpen(false);
      setMeetingId("");
    }

    notificationVisitorUtil(
      {
        notificationType: "Instant Meeting",
        data: {
          stallName: stallData.stall.stallName,
          status: "Cancelled",
        },
      },
      stallData.stall.exhibitor
    );
  };

  useEffect(() => {
    setConfirmOpen(false);
    setMeetingId("");
  }, [id]);

  useEffect(() => {
    checkForUpcomingMeetings();
  }, [bookedSlots]);

  const handleClose = () => {
    setChatView(false);
    setNotificationView(false);
  };

  const handleMeetingClose = () => {
    setMeetingView(false);
  };

  const onSubmit = async (data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    // Manual validation
    let validationErrors = {};
    if (!oldPassword) {
      validationErrors.oldPassword = "Old password is required";
    }
    if (!newPassword) {
      validationErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      validationErrors.newPassword =
        "New password must be at least 8 characters long";
    } else if (!/\d/.test(newPassword)) {
      validationErrors.newPassword = "New password must contain a number";
    } else if (!/[A-Z]/.test(newPassword)) {
      validationErrors.newPassword =
        "New password must contain an uppercase letter";
    } else if (!/[a-z]/.test(newPassword)) {
      validationErrors.newPassword =
        "New password must contain a lowercase letter";
    }
    if (confirmPassword !== newPassword) {
      validationErrors.confirmPassword = "Passwords must match";
    }

    // If there are validation errors, set them and return early
    if (Object.keys(validationErrors).length > 0) {
      setCustomErrors(validationErrors);
      return;
    }

    try {
      requestWithStatus({
        url: `visitor/reset-password`,
        method: "post",
        data: {
          oldPassword,
          newPassword,
          visitorId,
        },
      }).then((res) => {
        if (res?.status == 200) {
          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
      setServerError("");
      reset(); // Reset form fields after successful submission
    } catch (error) {
      if (error.response && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong");
      }
    }
  };

  const handleBooking = async (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    setModelOpenBooking(true);
  };

  const handleCloseMessage = () => {
    setMessageModelOpen(false);
  };
  const handleCloseAuditorium = () => {
    setAuditoriumModelOpen(false);
  };

  // const checkForUpcomingMeetings = () => {
  //   if (bookedSlots && bookedSlots.length) {
  //     const notifiedMeetings = {}; // Track notifications for each slot

  //     const intervalId = setInterval(() => {
  //       const now = new Date();

  //       bookedSlots.forEach((slot) => {
  //         // Combine Date and Time fields from the slot and parse the timezone
  //         const meetingDateTime = `${slot.Date} ${slot.Time.replace(
  //           " PM",
  //           "PM"
  //         ).replace(" AM", "AM")}`;
  //         const meetingTime = moment
  //           .tz(meetingDateTime, "YYYY-MM-DD hh:mm A", slot.Timezone)
  //           .toDate();

  //         const timeDiff = meetingTime - now;

  //         // If the meeting is 'booked' and still has time
  //         if (timeDiff > 0 && slot.Status === "booked") {
  //           const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Convert to minutes

  //           // Notify at 30 minutes if not already notified for this slot
  //           if (
  //             minutesLeft <= 30 &&
  //             minutesLeft > 15 &&
  //             !notifiedMeetings[slot.SerialNo]?.notifiedAt30
  //           ) {
  //             setMessageModelOpen(true);
  //             setMessageBody(
  //               `Meeting starts in ${minutesLeft} minutes, please be available.`
  //             );

  //             // Mark as notified for the 30-minute mark
  //             notifiedMeetings[slot.SerialNo] = {
  //               ...notifiedMeetings[slot.SerialNo],
  //               notifiedAt30: true,
  //             };
  //             sendEmailMeetingNotifyVisitorUtil({ visitorId, exhibitorId: slot.ExhibitorId, slotDetails: slot, minutesLeft });
  //           }

  //           // Notify at 15 minutes if not already notified for this slot
  //           if (
  //             minutesLeft <= 15 &&
  //             !notifiedMeetings[slot.SerialNo]?.notifiedAt15
  //           ) {
  //             setMessageModelOpen(true);
  //             setMessageBody(
  //               `Meeting starts in ${minutesLeft} minutes, please be available.`
  //             );

  //             // Mark as notified for the 15-minute mark
  //             notifiedMeetings[slot.SerialNo] = {
  //               ...notifiedMeetings[slot.SerialNo],
  //               notifiedAt15: true,
  //             };
  //           }

  //           // Clear the interval if both notifications have been sent for the slot
  //           if (
  //             notifiedMeetings[slot.SerialNo]?.notifiedAt30 &&
  //             notifiedMeetings[slot.SerialNo]?.notifiedAt15
  //           ) {
  //             clearInterval(intervalId);
  //           }
  //           sendEmailMeetingNotifyVisitorUtil({ visitorId, exhibitorId: slot.ExhibitorId, slotDetails: slot, minutesLeft });
  //         }
  //       });
  //     }, 60 * 1000); // Check every minute
  //   }
  // };

  const checkForUpcomingMeetings = () => {
    if (bookedSlots && bookedSlots.length) {
      const notifiedMeetings = {}; // Track notifications for each slot

      const intervalId = setInterval(() => {
        const now = new Date();

        bookedSlots.forEach((slot) => {
          // Combine Date and Time fields from the slot and parse the timezone
          const meetingDateTime = `${slot.Date} ${slot.Time.replace(
            " PM",
            "PM"
          ).replace(" AM", "AM")}`;
          const meetingTime = moment
            .tz(meetingDateTime, "YYYY-MM-DD hh:mm A", slot.Timezone)
            .toDate();

          const timeDiff = meetingTime - now;
          const minutesLeft = Math.floor(timeDiff / (1000 * 60)); // Convert to minutes

          if (timeDiff > 0 && slot.Status === "booked") {
            // Initialize tracking if not already present
            if (!notifiedMeetings[slot.SerialNo]) {
              notifiedMeetings[slot.SerialNo] = {
                notifiedAt60: false,
                notifiedAt30: false,
                notifiedAt0: false,
              };
            }

            // Notify at 60 minutes if not already notified
            if (minutesLeft <= 60 && minutesLeft > 30 && !notifiedMeetings[slot.SerialNo].notifiedAt60) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt60 = true;
            }

            // Notify at 30 minutes if not already notified
            if (minutesLeft <= 30 && minutesLeft > 0 && !notifiedMeetings[slot.SerialNo].notifiedAt30) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt30 = true;
            }

            // Notify at 0 minutes if not already notified
            if (minutesLeft <= 0 && !notifiedMeetings[slot.SerialNo].notifiedAt0) {
              sendNotification(slot, minutesLeft);
              notifiedMeetings[slot.SerialNo].notifiedAt0 = true;
            }
          }
        });

        // Check if all notifications have been sent for all slots, then clear interval
        const allNotified = bookedSlots.every(
          (slot) =>
            notifiedMeetings[slot.SerialNo]?.notifiedAt60 &&
            notifiedMeetings[slot.SerialNo]?.notifiedAt30 &&
            notifiedMeetings[slot.SerialNo]?.notifiedAt0
        );

        if (allNotified) {
          clearInterval(intervalId);
        }
      }, 60 * 1000); // Check every minute
    }
  };

  // Helper function to send notifications
  const sendNotification = (slot, minutesLeft) => {
    setMessageModelOpen(true);
    setMessageBody(`Meeting starts in ${minutesLeft} minutes, please be available.`);
    sendEmailMeetingNotifyVisitorUtil({
      visitorId,
      exhibitorId: slot.ExhibitorId,
      slotDetails: slot,
      minutesLeft,
    });
  };

  const handleModelClose = (e) => {
    document.getElementsByTagName("body")[0].style.overflow = "unset";
    setModelOpenBooking(false);
  };

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickNotify = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotify = () => {
    setAnchorEl(null);
  };

  const handleSeeAll = () => {
    setAnchorEl(null);
    setNotificationView(true);
  };

  const open = Boolean(anchorEl);
  const idNotify = open ? "simple-popover" : undefined;

  const getVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
    );
    return match ? match[1] : null;
  };

  // useEffect(() => {
  //   if (stallList) {
  //     if (
  //       stallList &&
  //       stallList.length &&
  //       !stallList[0]?.stallBackgroundImage
  //     ) {
  //       const videoId = getVideoId(stallList[0]?.stallVideoLink);

  //       // Load the YouTube IFrame Player API
  //       const tag = document.createElement("script");
  //       tag.src = "https://www.youtube.com/iframe_api";
  //       const firstScriptTag = document.getElementsByTagName("script")[0];
  //       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //       // Initialize player when API is ready
  //       window.onYouTubeIframeAPIReady = function () {
  //         new YT.Player("player", {
  //           videoId: videoId, // Replace with your video ID
  //           playerVars: {
  //             autoplay: 1,
  //             controls: 0,
  //             modestbranding: 1,
  //             rel: 0,
  //             showinfo: 0,
  //             fs: 0,
  //             loop: 1,
  //             mute: 1,
  //           },
  //           events: {
  //             onStateChange: (event) => {
  //               if (event.data === YT.PlayerState.PAUSED) {
  //                 event.target.playVideo(); // Resume if paused
  //               }
  //             },
  //           },
  //         });
  //       };
  //     }
  //   }
  // }, [stallList]);

  const changeAuditorium = () => {
    setAuditoriumModelOpen(true);
  };
  return (
    <main className="w-full h-auto overflow-auto relative">
      {isModelOpen ? (
        <Model
          productdata={stallData.productsList}
          profiledata={stallData.companyProfileList}
          videodata={stallData.stallVideoList}
          stallData={stallData}
          briefcaseData={briefcaseData}
        />
      ) : (
        ""
      )}
      {confirmOpen ? (
        <ConfirmModel
          handleClick={handleConfirm}
          handleClose={handleCloseModal}
          meetingId={meetingId}
          instantMeetingData={instantMeeting}
        />
      ) : (
        ""
      )}
      {messageModelOpen ? (
        <MessageModel
          handleClose={handleCloseMessage}
          messageHeader={`Meeting Notification`}
          messageBody={messageBody}
        />
      ) : (
        ""
      )}
      {auditoriumModelOpen ? (
        <AuditoriumModal handleClose={handleCloseAuditorium} />
      ) : (
        ""
      )}
      {contactInfo ? (
        <ContactModel
          handleClick={handleContactInfo}
          visitingCard={stallData.stall}
        />
      ) : galleryModel ? (
        <GalleryModel
          handleClose={closeGallery}
          galleryImages={[
            ...stallData.galleryImageList.map((image) => ({
              ...image,
              type: "image",
            })),
            ...stallData.galleryVideoList.map((video) => ({
              ...video,
              type: "video",
            })),
          ]}
        ></GalleryModel>
      ) : (
        ""
      )}
      {stallData && (
        <section
          className={`bg-[#808080] w-full mx-auto relative md:pt-0  md:pb-12 lg:pb-3 overflow-x-hidden lg:h-screen flex flex-col gap-[1.25rem] ${device === "tablet" ? "!h-auto" : ""
            }`}
          id="main-content-body"
          style={{ overflow: "hidden" }}
        >
          {/\.(mp4|webm|ogg)$/i.test(stallData?.stall?.stallImage) ? (
            <div
              style={{
                position: "relative",
                height: "88vh",
                width: "100%",
                zIndex: 0,
              }}
            >
              <video
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: -9999,
                }}
                autoPlay
                // loop
                muted
              >
                <source
                  src={`${BUCKET_URL}/video/stall.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <Image
              alt="img"
              ref={image}
              src={stallData?.stall?.stallImage}
              width={3000}
              height={3000}
              className="w-full h-screen object-cover object-center"
              unoptimized
              blurDataURL={`${BUCKET_URL}/blurred.svg`}
            ></Image>
          )}

          {/* <div className=" w-[80%] h-auto mx-auto text-center flex flex-col justify-center items-center">
            <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center mt-10 mb-28">
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.website && (
                  <a
                    href={stallData.stall.social_media.website}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("Website")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/website.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Website2
                    </p>
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.facebook && (
                  <a
                    href={stallData.stall.social_media.facebook}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("facebook")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/facebook.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      facebook
                    </p>
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.instagram && (
                  <a
                    href={stallData.stall.social_media.instagram}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("Instagram")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/instagram.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Instagram
                    </p>
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.twitter && (
                  <a
                    href={stallData.stall.social_media.twitter}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("Twitter")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/social/x.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Twitter1
                    </p>
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.youtube && (
                  <a
                    href={stallData.stall.social_media.youtube}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("Youtube")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/youtube.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Youtube
                    </p>
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.whatsapp && (
                  <a
                    href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={() => socialTrack("Whatsapp")}
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                    ></Image>
                    <p className=" text-xs font-quickSand font-bold mt-[2px]">
                      Whatsapp
                    </p>
                  </a>
                )}
            </div> 
          </div>*/}
          {modelOpenBooking ? (
            <Mybookings
              handleModelClose={handleModelClose}
              bookedSlots={bookedSlots}
              tableColumnDef={tableColumnDef}
            />
          ) : (
            ""
          )}
          {/* For Desktop */}
          {
            // device === "desktop" ? (
            <>
              <div className=" fixed z-[20] top-1/2 sm:top-1/3 -translate-y-1/2 sm:-translate-y-1/3 left-0 nav-wrapper left md:px-4 md:py-4 sm:px-1 sm:py-1 flex flex-col md:gap-6 sm:gap-0 bg-black">
                <div
                  onClick={() => handleModelopen("product")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/product.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Products
                    </p>
                  )}
                </div>
                <div
                  onClick={() => handleModelopen("profile")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/companyProfile.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                      Company Profile
                    </p>
                  )}
                </div>
                <div
                  onClick={openGallery}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/gallery.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Gallery
                    </p>
                  )}
                </div>
                <div
                  onClick={() => handleModelopen("video")}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/videoLeft.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Video
                    </p>
                  )}
                </div>
                <div
                  onClick={handleContactInfo}
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/stall-view/contact.svg`}
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                      Contact Info
                    </p>
                  )}
                </div>
              </div>
              <div className=" fixed z-[20] top-1/2 sm:top-1/3 -translate-y-1/2 sm:-translate-y-1/3 right-0 nav-wrapper right md:px-4 md:py-4 sm:px-1 sm:py-1 flex flex-col md:gap-6 sm:gap-0 bg-black">
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => requestForInstantMeeting()}
                // onClick={() => router.push(`/visitor/video-chat?id=${id}`)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/zoom.png`}
                      unoptimized
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Instant Meeting
                    </p>
                  )}
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => handleMeetingView(meetingView)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/calendar.png`}
                      unoptimized
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                      Book a Meeting
                    </p>
                  )}
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => handleBooking()}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/calendarview.png`}
                      unoptimized
                    ></Image>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
                      Show Meetings
                    </p>
                  )}
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => handleChatView(chatView)}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className="w-full h-auto"
                      src={`${BUCKET_URL}/chat.svg`}
                    ></Image>
                    {totalUnreadMessages ? (
                      <div
                        className="ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]"
                        style={{ marginTop: "-38px" }}
                      >
                        {totalUnreadMessages}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Chat
                    </p>
                  )}
                </div>
                <div
                  className=" max-w-[45px] flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => handleModelopen("briefcase")}
                >
                  <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 22 22"
                    >
                      <g
                        id="Group_189"
                        data-name="Group 189"
                        transform="translate(-995 -712)"
                      >
                        <rect
                          id="Rectangle_34"
                          data-name="Rectangle 34"
                          width="22"
                          height="22"
                          rx="4"
                          transform="translate(995 712)"
                          fill={"#23272d"}
                        />
                        <g id="briefcase" transform="translate(995.5 712.825)">
                          <path
                            id="Path_135"
                            data-name="Path 135"
                            d="M15.7,6.6H13.1V5.3A1.3,1.3,0,0,0,11.8,4H9.2A1.3,1.3,0,0,0,7.9,5.3V6.6H5.3A1.294,1.294,0,0,0,4.007,7.9L4,15.05a1.3,1.3,0,0,0,1.3,1.3H15.7a1.3,1.3,0,0,0,1.3-1.3V7.9A1.3,1.3,0,0,0,15.7,6.6Zm-3.9,0H9.2V5.3h2.6Z"
                            fill="#fff"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-1 text-white">
                      Briefcase
                    </p>
                  )}
                </div>
              </div>
            </>
            // ) : (
            //   ""
            // )
            // (
            //   <>
            //     <div
            //       className={`md:fixed z-[10] mobileOrientation md:top-1/2 md:-translate-y-1/2 md:left-0  md:nav-wrapper md:left px-6 py-4 relative flex flex-row flex-wrap md:flex-col justify-center gap-5 w-full mt-5`}
            //     >
            //       <div
            //         onClick={() => handleModelopen("product")}
            //         className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
            //       >
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/product.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1">
            //           Products
            //         </p>
            //       </div>
            //       <div
            //         onClick={() => handleModelopen("profile")}
            //         className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer "
            //       >
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/companyProfile.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1 text-center">
            //           Company Profile
            //         </p>
            //       </div>
            //       <div
            //         onClick={openGallery}
            //         className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
            //       >
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/gallery.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1">
            //           Gallery
            //         </p>
            //       </div>
            //       <div
            //         onClick={() => handleModelopen("video")}
            //         className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
            //       >
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/videoLeft.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1">
            //           Video
            //         </p>
            //       </div>
            //       <div
            //         onClick={handleContactInfo}
            //         className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer"
            //       >
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/contact.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1 text-center">
            //           Contact Info
            //         </p>
            //       </div>
            //       <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/Meeting.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1 text-white">
            //           Instant Meeting
            //         </p>
            //       </div>
            //       <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/stall-view/video.svg`}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1 text-center text-white">
            //           Book a Meeting
            //         </p>
            //       </div>
            //       <div className=" max-w-[45px] flex flex-col justify-start items-center cursor-pointer">
            //         <div className=" w-10 h-10 p-2 bg-[#23272D] rounded-md">
            //           <Image
            //             alt="img"
            //             width={3000}
            //             height={3000}
            //             className="w-full h-auto"
            //             src={`${BUCKET_URL}/chat.svg`}
            //             onClick={() => handleChatView(chatView)}
            //           ></Image>
            //         </div>
            //         <p className=" text-xs font-quickSand font-bold mt-1 text-white">
            //           chat
            //         </p>
            //       </div>
            //     </div>
            //     {/* repeating elements for landscape */}
            //     <div className=" px-4 py-2 flex flex-row flex-wrap gap-6 justify-center bottomSocial">
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.website && (
            //           <a
            //             href={stallData.stall.social_media.website}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/website.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Website
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.facebook && (
            //           <a
            //             href={stallData.stall.social_media.facebook}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/facebook.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               facebook
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.instagram && (
            //           <a
            //             href={stallData.stall.social_media.instagram}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/instagram.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Instagram
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.twitter && (
            //           <a
            //             href={stallData.stall.social_media.twitter}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/social/x.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Twitter
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.youtube && (
            //           <a
            //             href={stallData.stall.social_media.youtube}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/youtube.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Youtube
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.whatsapp && (
            //           <a
            //             href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Whatsapp
            //             </p> */}
            //           </a>
            //         )}
            //     </div>
            //     <div className="hidden fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 topNavSocial flex-row gap-6 bg-black">
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.website && (
            //           <a
            //             href={stallData.stall.social_media.website}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/website.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Website
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.facebook && (
            //           <a
            //             href={stallData.stall.social_media.facebook}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/facebook.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               facebook
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.instagram && (
            //           <a
            //             href={stallData.stall.social_media.instagram}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/instagram.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Instagram
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.twitter && (
            //           <a
            //             href={stallData.stall.social_media.twitter}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/social/x.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Twitter
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.youtube && (
            //           <a
            //             href={stallData.stall.social_media.youtube}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/youtube.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Youtube
            //             </p> */}
            //           </a>
            //         )}
            //       {stallData.stall &&
            //         stallData.stall.social_media &&
            //         stallData.stall.social_media.whatsapp && (
            //           <a
            //             href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
            //             target="_blank"
            //             className="flex flex-col justify-center items-center cursor-pointer"
            //           >
            //             <Image
            //               alt="img"
            //               width={3000}
            //               height={3000}
            //               className=" w-6 h-6"
            //               src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
            //             ></Image>
            //             {/* <p className=" text-xs font-quickSand font-bold mt-[2px]">
            //               Whatsapp
            //             </p> */}
            //           </a>
            //         )}
            //     </div>
            //     <div className=" flex justify-center items-center gap-3 rotateText">
            //       <Image
            //         alt="img"
            //         src={`${BUCKET_URL}/rotate-screen.svg`}
            //         height={100}
            //         width={100}
            //         className="  w-5 h-auto"
            //       ></Image>
            //       <p className=" text-center text-base font-semibold text-black opacity-80">
            //         Rotate your phone for better view
            //       </p>
            //     </div>
            //   </>
            // )
          }
          {
            // device === "desktop" && height < 150 ? (
            <div className=" fixed z-[20] top-0 right-0 nav-wrapper top px-4 py-2 flex flex-row gap-6 bg-black">
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.website && (
                  <a
                    href="#"
                    className="flex flex-col justify-center items-center cursor-pointer"
                    onClick={handleClickNotify}
                  >
                    <NotificationsActiveIcon
                      sx={{ fontSize: 24, color: "white" }}
                    />
                    {unreadNotifications && (
                      <div className="absolute ml-4 top-0 bg-brand-color rounded-full flex flex-row items-center justify-center h-5 w-5 font-lato font-bold text-[8px]">
                        {unreadNotifications && unreadNotifications.length}
                      </div>
                    )}
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Notification
                      </p>
                    )}
                  </a>
                )}
              <Popover
                id={idNotify}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseNotify}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="popoverHeader">
                  <div>Notifications</div>
                  <Button color="primary" size="small" onClick={handleSeeAll}>
                    See All
                  </Button>
                </div>
                <div className="popoverContent">
                  {unreadNotifications &&
                    unreadNotifications.length > 0 &&
                    unreadNotifications.map((res) => (
                      <div className="section-popover" key={res._id}>
                        <div>
                          {res?.exhibitor?.name} ({res?.exhibitor?.companyName})
                        </div>
                        <div>
                          {res?.notificationType} -{" "}
                          {dayjsShortFormat(res?.createdAt)}
                        </div>
                      </div>
                    ))}
                </div>
              </Popover>
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.website && (
                  <a
                    href={stallData.stall.social_media.website}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/website.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Website
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.facebook && (
                  <a
                    href={stallData.stall.social_media.facebook}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/facebook.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        facebook
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.instagram && (
                  <a
                    href={stallData.stall.social_media.instagram}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/instagram.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Instagram
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.linkedin && (
                  <a
                    href={stallData.stall.social_media.linkedin}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/linkedin.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Linkedin
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.twitter && (
                  <a
                    href={stallData.stall.social_media.twitter}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/social/x.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Twitter
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.youtube && (
                  <a
                    href={stallData.stall.social_media.youtube}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/youtube.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Youtube
                      </p>
                    )}
                  </a>
                )}
              {stallData.stall &&
                stallData.stall.social_media &&
                stallData.stall.social_media.whatsapp && (
                  <a
                    href={`https://wa.me/${stallData.stall.social_media.whatsapp}`}
                    target="_blank"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    <Image
                      alt="img"
                      width={3000}
                      height={3000}
                      className=" w-6 h-6"
                      src={`${BUCKET_URL}/stall-view/whatsapp.svg`}
                    ></Image>
                    {!isMobile && (
                      <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                        Whatsapp
                      </p>
                    )}
                  </a>
                )}
            </div>
            // ) : (
            //   ""
            // )
          }
          {
            // device === "desktop" && height < 150 ? (
            <>
              <div className=" fixed z-[20] bottom-0 right-0 nav-wrapper bottom1 px-4 py-2 flex flex-row gap-6 bg-black" style={{ position: "absolute" }}>
                <div
                  onClick={logout}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/power.png`}
                    unoptimized
                  ></Image>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                      Logout
                    </p>
                  )}
                </div>
              </div>
              <div className=" fixed z-[20] bottom-0 right-28 nav-wrapper bottom2 px-4 py-2 flex flex-row gap-6 bg-black" style={{ position: "absolute" }}>
                <div
                  onClick={() => changeAuditorium()}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/audi.png`}
                    unoptimized
                  ></Image>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                      Auditorium
                    </p>
                  )}
                </div>
              </div>
              <div className=" fixed z-[20] bottom-0 left-0 nav-wrapper left1 px-3 py-2 flex flex-row gap-6 bg-black" style={{ position: "absolute" }}>
                <div
                  onClick={() => setFromLink(!fromLink)}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/reset.png`}
                    unoptimized
                  ></Image>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                      Reset{" "}
                    </p>
                  )}
                </div>
                <div
                  onClick={() => setVerifyPhoneEmail(!verifyPhoneEmail)}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/profile.png`}
                    unoptimized
                  ></Image>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                      Profile
                    </p>
                  )}
                </div>
                <div
                  onClick={() => setSupport(!support)}
                  className="flex flex-col justify-center items-center cursor-pointer"
                >
                  <Image
                    alt="img"
                    width={3000}
                    height={3000}
                    className=" w-6 h-6"
                    src={`${BUCKET_URL}/support.png`}
                    unoptimized
                  ></Image>
                  {!isMobile && (
                    <p className=" text-xs font-quickSand font-bold mt-[2px] text-white">
                      Support
                    </p>
                  )}
                </div>
                {/* )} */}
              </div>
            </>
            // ) : (
            //   ""
            // )
          }

          {/* Like Area */}
          {/* {device === "desktop" ? (
            <div
              onMouseDown={mousedown}
              onMouseUp={mouseup}
              className="fixed z-[200] bottom-14 right-16 iconwrap max-w-[105px] flex justify-center items-center flex-col"
            >
              <div className="relative">
                <Image
                  alt="img"
                  ref={icon}
                  src={`${BUCKET_URL}/stall-view/care-emoji-for-mobile.svg`}
                  className=" w-16 h-16 cursor-pointer relative z-30"
                  width={3000}
                  height={3000}
                  draggable="false"
                ></Image>
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/stall-view/like.svg`}
                  width={3000}
                  height={3000}
                  onMouseEnter={handlemouseover}
                  ref={likeButton}
                  className="w-7 h-7 absolute z-40 -left-3 -top-3 hidden"
                ></Image>
                <Image
                  alt="img"
                  src={`${BUCKET_URL}/stall-view/dislike.svg`}
                  width={3000}
                  height={3000}
                  onMouseEnter={handlemouseover}
                  ref={dislikeButton}
                  className="w-7 h-7 absolute z-40 -right-3 -top-3 hidden"
                ></Image>
              </div>
              <p className=" text-center font-quickSand text-xs font-bold select-none">
                Long Press to React to the Store
              </p>
            </div>
          ) : (
            ""
          )} */}
        </section>
      )}
      {chatView ? (
        <VisitorChatModal
          handleClose={handleClose}
          exhibitorId={stallData?.stall?.exhibitor}
        />
      ) : (
        ""
      )}
      {notificationView ? <NotificationModal handleClose={handleClose} /> : ""}
      {meetingView ? (
        <VisitorMeetingModal
          handleClose={handleMeetingClose}
          requestForInstantMeeting={requestForInstantMeeting}
          stallData={stallData}
        />
      ) : (
        ""
      )}
      {fromLink && (
        <div className=" bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center top-0">
          <div
            // style={{ overflow: "hidden", transition: "height 0.3s ease-in-out" }}
            className="modelDiv text-white mx-5 h-auto max-h-[90%]  bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] px-6 py-2"
          >
            {!resetBtn ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-3xl sm:text-xl font-bold text-black font-quickSand">
                  Reset Your Password
                </h1>
                <div className="mt-1 flex flex-col">
                  <label className="text-black font-bold font-quickSand text-base">
                    *Old Password
                  </label>
                  <input
                    type="password"
                    {...register("oldPassword")}
                    className="border border-black h-12 sm:h-8 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                  />
                  {customErrors.oldPassword && (
                    <p className="text-red text-sm mt-1">
                      {customErrors.oldPassword}
                    </p>
                  )}

                  <label className="text-black font-bold font-quickSand text-base mt-4 sm:mt-1">
                    *New Password
                  </label>
                  <input
                    type="password"
                    {...register("newPassword")}
                    className="border border-black h-12 sm:h-8 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                  />
                  {customErrors.newPassword && (
                    <p className="text-red text-sm mt-1">
                      {customErrors.newPassword}
                    </p>
                  )}

                  <label className="text-black font-bold font-quickSand text-base mt-4 sm:mt-1">
                    *Re-Type Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="border border-black h-12 sm:h-8 rounded-lg text-black px-3 font-quickSand font-semibold text-sm"
                  />
                  {customErrors.confirmPassword && (
                    <p className="text-red text-sm mt-1">
                      {customErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {serverError && (
                  <p className="text-red text-sm mt-2">{serverError}</p>
                )}

                <button
                  type="submit"
                  className="md:mt-10 lg:mt-10 mt-2 sx:mt-3 bg-black text-white px-6 py-3 sm:py-1 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => setFromLink(false)}
                  type="button"
                  className="md:ml-4 lg:ml-4 sm:md-1 md:mt-10 mt-2 bg-black text-white px-6 py-3 sm:py-1 rounded-lg font-lato font-bold text-base w-full md:w-auto"
                >
                  Close
                </button>
              </form>
            ) : (
              <>
                <h1 className=" text-3xl sm:text-xl font-bold text-black font-quickSand">
                  Password Reset Successful
                </h1>
                <div className=" mt-11 flex flex-col justify-center items-center gap-7">
                  <Image
                    alt="success"
                    src={`${BUCKET_URL}/neofairs-lite/success.svg`}
                    className=" max-w-[165px] h-auto"
                    height={3000}
                    width={3000}
                  ></Image>
                  <p className="text-base font-quickSand text-black font-medium">
                    Your Password has been updated. Use it in the Login Screen
                    to access your account.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {verifyPhoneEmail && (
        <VerifyProfileForm
          visitorData={visitorData}
          visitorId={visitorId}
          closeVerify={() => setVerifyPhoneEmail(!verifyPhoneEmail)}
        />
      )}
      {support && <Support closeSupport={() => setSupport(!support)} />}
    </main>
  );
};

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <StallViewComponent />
      </Suspense>
    </div>
  );
};

export default Page;
