"use client";
import React, { useState } from "react";
import Image from "next/image";
import SubMenuImage from "./SubMenuImage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BUCKET_URL } from "@/config/constant";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Material Arrow Icons

export default function SideNav(props) {
  const router = useRouter();
  const user = props.userDetails;
  const currentRoute = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    router.push("/admin-login");
  };

  return (
    <>
      <div className="side-nav-main relative" data-tag="empty-space">
        <div className="bg-bg-grey container overflow-x-hidden h-auto flex flex-col items-start py-6 clicker-nav relative">
          <div className="container flex flex-row items-center justify-start mb-5 avatar">
            <div className="">
              <Image
                alt="profile_icon"
                src={`${BUCKET_URL}/menu-icons/admin.png`}
                width={5000}
                height={5000}
                className="rounded-full h-16 w-auto"
                unoptimized
              />
            </div>
            <div className="flex flex-col items-start justify-center ml-3">
              <div className="font-lato text-lg font-normal">Admin</div>
              <div className="flex flex-row items-center mt-1">
                <Image
                  alt="menu_icon"
                  src={
                    `${BUCKET_URL}/menu-icons/` +
                    user.role.toLowerCase() +
                    ".svg"
                  }
                  width={10}
                  height={10}
                  className="m-0 p-0 w-auto h-4"
                />
                <p className="m-0 p-0 font-bold text-accent-font-color font-lato ml-2 text-xs">
                  TECHNICAL ADMIN
                </p>
              </div>
            </div>
          </div>

          {/* <div className="container">
            <select
              className="border-2 text-lg rounded-lg w-4/5"
              onChange={(e) => changeStatus(e.target.value)}
            >
              {data &&
                data.map((res) => (
                  <option value={res._id} key={res._id}>
                    {res.name}
                  </option>
                ))}
            </select>
          </div> */}
          <div
            className={`container menu-item px-0 py-0 ${currentRoute === "/admin" ||
              currentRoute === "/admin/visitor-approval" ||
              currentRoute === "/admin/exhibitor-approval"
              ? "active"
              : ""
              }`}
          >
            <div className="flex items-center justify-start">
              <Image
                alt="dashboard_icon"
                src={`${BUCKET_URL}/admin/dashboard.svg`}
                height={100}
                width={100}
              />
              <p className="font-lato ml-3 text-sm m-0 p-0">Dashboard</p>
            </div>
            <div className="sub-menu-all">
              <Link href={"/admin/visitor-approval"}>
                <div
                  className={`sub-menu container menu-item ${currentRoute === "/admin" ||
                    currentRoute === "/admin/visitor-approval"
                    ? "active"
                    : ""
                    }`}
                >
                  <SubMenuImage icon={"sub-menu"} />
                  <p>Visitors</p>
                </div>
              </Link>
              <Link href={"/admin/exhibitor-approval"}>
                <div
                  className={`sub-menu container menu-item ${currentRoute === "/admin/exhibitor-approval" ? "active" : ""
                    }`}
                >
                  <SubMenuImage icon={"sub-menu"} />
                  <p>Exhibitors</p>
                </div>
              </Link>
              <Link href={"/admin/stall-manager-approval"}>
                <div
                  className={`sub-menu container menu-item ${currentRoute === "/admin/stall-manager-approval" ? "active" : ""
                    }`}
                >
                  <SubMenuImage icon={"sub-menu"} />
                  <p>Stall Manager</p>
                </div>
              </Link>
            </div>
          </div>
          <div
            className={`container menu-item px-0 py-0 ${[
              "/admin/reports/visitor-report",
              "/admin/reports/exhibitor-report",
              "/admin/reports/visited-stall-report",
              "/admin/reports/logged-visitor-report",
              "/admin/reports/logged-exhibitor-report",
              "/admin/reports/joined-visitor-report",
              "/admin/reports/joined-exhibitor-report",
              "/admin/reports/visitor-tracking-report",
              "/admin/reports/exhibitor-tracking-report",
              "/admin/reports/catalogue-report",
              "/admin/reports/meeting-tracking-report",
            ].includes(currentRoute)
              ? "active"
              : ""
              }`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
            >
              <div className="flex items-center">
                <Image
                  alt="reports-icon"
                  src={`${BUCKET_URL}/admin/reports.svg`}
                  height={100}
                  width={100}
                />
                <p className="font-lato ml-3 text-sm m-0 p-0">Reports</p>
              </div>
              {/* Toggle Arrow */}
              {isSubMenuOpen ? <FaChevronUp size={16} color="gray" /> : <FaChevronDown size={16} color="gray" />}
            </div>

            {/* Submenu: Show only if isSubMenuOpen is true */}
            {isSubMenuOpen && (
              <div className="sub-menu-all">
                <Link href="/admin/reports/visitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/visitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Visitor Report</p>
                  </div>
                </Link>
                <Link href="/admin/reports/exhibitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/exhibitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Exhibitor Report</p>
                  </div>
                </Link>
                <Link href="/admin/reports/visited-stall-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/visited-stall-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Visited Stall</p>
                  </div>
                </Link>
                <Link href="/admin/reports/logged-visitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/logged-visitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Logged Visitor</p>
                  </div>
                </Link>
                <Link href="/admin/reports/logged-exhibitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/logged-exhibitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Logged Exhibitor</p>
                  </div>
                </Link>
                <Link href="/admin/reports/joined-visitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/joined-visitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Joined Visitor</p>
                  </div>
                </Link>
                <Link href="/admin/reports/joined-exhibitor-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/joined-exhibitor-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Joined Exhibitor</p>
                  </div>
                </Link>
                <Link href="/admin/reports/visitor-tracking-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/visitor-tracking-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Visitor Tracking Report</p>
                  </div>
                </Link>
                <Link href="/admin/reports/catalogue-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/catalogue-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Catalogue Report</p>
                  </div>
                </Link>
                <Link href="/admin/reports/meeting-tracking-report">
                  <div
                    className={`sub-menu menu-item ${currentRoute === "/admin/reports/meeting-tracking-report" ? "active" : ""
                      }`}
                  >
                    <SubMenuImage icon="sub-menu" />
                    <p>Meeting Tracking Report</p>
                  </div>
                </Link>
              </div>
            )}
          </div>


          <Link href={"/admin/auditorium"}>
            <div
              className={`container menu-item px-0 py-0 flex items-center justify-start ${currentRoute === "/admin/auditorium" ? "active" : ""
                }`}
            >
              <SubMenuImage icon={"auditorium"} />
              <p className="font-lato ml-3 text-sm m-0 p-0">Auditorium</p>
            </div>
          </Link>
          <Link href={"/admin/settings"}>
            <div
              className={`container menu-item px-0 py-0 flex items-center justify-start ${currentRoute === "/admin/settings" ? "active" : ""
                }`}
            >
              <SubMenuImage icon={"settings"} />
              <p className="font-lato ml-3 text-sm m-0 p-0">Settings</p>
            </div>
          </Link>
          <div
            className={`container menu-item px-0 py-0 flex items-center justify-start`}
            onClick={() => logout()}
          >
            <SubMenuImage icon={"logout"} />
            <p className="font-lato ml-3 text-sm m-0 p-0">Logout</p>
          </div>
        </div >
      </div >
      <div className="fixed drop-shadow-lg left-0 px-5 right-0 top-0 h-16 flex-row items-center justify-between bg-black-2 z-[999] floating-top hidden">
        <div></div>
        <div>
          <SubMenuImage icon={"logo-main"} />
        </div>
        <div id="nav-icon" className="z-[1000]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </>
  );
}
