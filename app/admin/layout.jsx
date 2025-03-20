"use client";
import SideNav from "@/components/admin/side-nav";
import "../admin/style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  const name =
    typeof window !== "undefined" ? localStorage.getItem("name") : null;
  const user = {
    name: name,
    role: "Admin",
  };
  const [currentMenu, setCurrentMenu] = useState(true);
  const [currentSubMenu, setSub] = useState(0);

  const toggleMenu = () => {
    setCurrentMenu(!currentMenu);
  };

  useEffect(() => {
    // Ensure this runs only on the client
    const storedAdminId = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role == "exhibitor") {
      router.push("/exhibitor");
    } else if (role == "visitor") {
      router.push("/visitor");
    }

    if (!storedAdminId) {
      router.push("/admin-login");
    }
  }, []);

  return (
    <div className="w-full lg:px-4 px-2 lg:custom-color-bg bg-bg-grey">
      <section className="mx-auto max-w-[1400px] flex flex-row items-stretch justify-between pt-16 lg:pt-0">
        {currentMenu && (
          <div
            className="bg-bg-grey lg:w-[20%] md:min-h-screen lg:px-2 w-[0]"
            id="side-bar"
          >
            <SideNav userDetails={user} />
          </div>
        )}

        <div
          className={`bg-white ${currentMenu ? "lg:w-[80%]" : "lg:w-[100%]"
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
      </section>
    </div>
  );
}
