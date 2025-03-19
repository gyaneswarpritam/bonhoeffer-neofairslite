"use client";
import "../globals.css";
import { useState } from "react";
import ExhibitorChatModal from "@/components/ExhibitorChatModal";
import { useSelector } from "react-redux";
import SideNav from "@/components/exibitor/side-nav";
import BlackFooter from "@/components/exibitor/blackFooter";

export default function RootLayout({ children }) {
  const name =
    typeof window !== "undefined" ? sessionStorage.getItem("name") : null;
  const user = {
    name: name,
    role: "Exhibitor",
  };
  const [chatView, setChatView] = useState(false);
  const { showNavbar } = useSelector((state) => state.commonStore);
  const [currentMenu, setCurrentMenu] = useState(true);

  const handleChatView = () => {
    setChatView(true);
  };

  const handleClose = () => {
    setChatView(false);
  };

  const toggleMenu = () => {
    setCurrentMenu(!currentMenu);
  };

  return (
    <>
      <main>
        {showNavbar ? (
          <main className="custom-color-bg">
            <div className="mx-auto max-w-[1439px] container md:flex md:flex-row md:items-stretch md:justify-between overflow-hidden">
              {currentMenu && (
                <section
                  className="bg-bg-grey lg:w-[20%] md:min-h-screen px-2 lg:px-2 w-[0] side-bar-navi"
                  id="side-bar"
                >
                  <SideNav userDetails={user} handleChatView={handleChatView} />
                </section>
              )}
              <div
                className={`bg-white ${
                  currentMenu ? "lg:w-[80%]" : "lg:w-[100%]"
                } w-full  lg:py-4 lg:px-4 px-2 py-2`}
              >
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  onClick={toggleMenu}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
                {children}
              </div>
            </div>
          </main>
        ) : (
          <>{children}</>
        )}

        <BlackFooter></BlackFooter>
        {chatView ? <ExhibitorChatModal handleClose={handleClose} /> : ""}
      </main>
    </>
  );
}
