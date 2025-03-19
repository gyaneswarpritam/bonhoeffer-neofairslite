import axios from "axios";
import { request } from "./axios";

export const trackUtil = async (data) => {
  const response = await axios.get("https://api.ipify.org?format=json");
  const userIP = response.data.ip;
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const payload = {
    ...data,
    ip: userIP,
    visitor: visitorId,
  };
  request({
    url: `visitor/trackVisitor`,
    method: "post",
    data: payload,
  });
};

export const trackMeetingUtil = async (data) => {
  const response = await axios.get("https://api.ipify.org?format=json");
  const userIP = response.data.ip;

  const payload = {
    ...data,
    ip: userIP,
  };
  request({
    url: `visitor/trackMeeting`,
    method: "post",
    data: payload,
  });
};

export const sendEmailMeetingUtil = async (data) => {
  request({
    url: `visitor/book-slot-email`,
    method: "post",
    data: data
  });
};

export const sendEmailMeetingConfirmationUtil = async (data) => {
  request({
    url: `exhibitor/book-slot-email`,
    method: "post",
    data,
  });
};

export const sendEmailMeetingNotifyExhibitorUtil = async (data) => {
  request({
    url: `exhibitor/notify-meeting`,
    method: "post",
    data: data,
  });
};

export const sendEmailMeetingNotifyVisitorUtil = async (data) => {
  request({
    url: `visitor/notify-meeting`,
    method: "post",
    data: data,
  });
};
