import axios from "axios";
import { request } from "./axios";

export const notificationVisitorUtil = async (data, exhibitorId) => {
  const response = await axios.get("https://api.ipify.org?format=json");
  const userIP = response.data.ip;
  const visitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const payload = {
    ...data,
    ip: userIP,
    visitor: visitorId,
    exhibitor: exhibitorId,
  };
  request({
    url: `visitor/notification`,
    method: "post",
    data: payload,
  });
};
export const notificationExhibitorUtil = async (data, visitorId) => {
  const response = await axios.get("https://api.ipify.org?format=json");
  const userIP = response.data.ip;
  const exhibitorId =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const payload = {
    ...data,
    ip: userIP,
    exhibitor: exhibitorId,
    visitor: visitorId,
  };
  request({
    url: `exhibitor/notification`,
    method: "post",
    data: payload,
  });
};
