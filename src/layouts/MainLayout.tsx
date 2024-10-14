import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom'
export interface OrderData {
  "Date Ordered": string;
  Month: number;
  "Product Name": string;
  "Product Price": number;
  "Quantity Ordered": number;
  Total: number;
  Week: string;
  Year: number;
}
interface SalesData {
  "Date Ordered": string;
  "Product Name": string;
  "Product Price": number;
  "Quantity Ordered": number;
  Total: number;
}
interface ItemsData {
  "Product": string;
  "Price": number;
}
export interface OutletContextType {
  importData: OrderData[];
  setImportData: React.Dispatch<React.SetStateAction<OrderData[]>>;
  importItemsData: ItemsData[];
  setImportItemsData: React.Dispatch<React.SetStateAction<ItemsData[]>>;
  importSalesData: SalesData[];
  setImportSalesData: React.Dispatch<React.SetStateAction<SalesData[]>>;
}


export const MainLayout = () => {

  useEffect(()=>{
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if(isLoggedIn){
      console.log("Login Success!")
    }else{
      location.href = "/login"
    }
  },[])
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
          location.href = "/login"
  }

  const [importData, setImportData] = useState<OrderData[]>([]); // Initialize as empty
  const [importSalesData, setImportSalesData] = useState<SalesData[]>([])
  const [importItemsData, setImportItemsData] = useState<ItemsData[]>([])
  const [breadCrumb, setBreadCrumb] = useState("Dashboard");

  return (
    <>
      <>
        {/* ========== MAIN CONTENT ========== */}
        {/* Breadcrumb */}
        <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex items-center py-2">
            {/* Navigation Toggle */}
            <button
              type="button"
              className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="hs-application-sidebar"
              aria-label="Toggle navigation"
              data-hs-overlay="#hs-application-sidebar"
            >
              <span className="sr-only">Toggle Navigation</span>
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width={18} height={18} x={3} y={3} rx={2} />
                <path d="M15 3v18" />
                <path d="m8 9 3 3-3 3" />
              </svg>
            </button>
            {/* End Navigation Toggle */}
            {/* Breadcrumb */}
            <ol className="ms-3 flex items-center whitespace-nowrap">
              {/* <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
                Application Layout

              </li> */}
              {
                breadCrumb && breadCrumb == "Dashboard"? 
                <>
              <li>
                <svg
                  className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </li>
              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                Dashboard
              </li>
                </>: breadCrumb == "Sales" ? 
                <>
                              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                Sales Data
              </li>
                              <li>
                <svg
                  className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </li>
              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                View
              </li>
                </>
                :
                <>
                              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                Items Data
              </li>
                              <li>
                <svg
                  className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </li>
              <li
                className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
                aria-current="page"
              >
                View
              </li>
                </>
              }

            </ol>
            {/* End Breadcrumb */}
          </div>
        </div>
        {/* End Breadcrumb */}
        {/* Sidebar */}
        <div
          id="hs-application-sidebar"
          className="hs-overlay  [--auto-close:lg]
  hs-overlay-open:translate-x-0
  -translate-x-full transition-all duration-300 transform
  w-[260px] h-full
  hidden
  fixed inset-y-0 start-0 z-[60]
  bg-white border-e border-gray-200
  lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
  dark:bg-neutral-800 dark:border-neutral-700"
          role="dialog"
          tabIndex={-1}
          aria-label="Sidebar"
        >
          <div className="relative flex flex-col h-full max-h-full">
            <div className="px-6 pt-4">
              {/* Logo */}
              <Link
                className="flex justify-center items-center gap-5 rounded-xl text-xl font-semibold"
                to="/"
                onClick={()=>{setBreadCrumb("Dashboard")}}
                aria-label="Preline"
              >
                <img src="/optimization_logo.png" alt="Logo" className='object-contain w-12 h-12' />
                <p className='text-md'>Stock Optimization</p>
              </Link>
              {/* End Logo */}
            </div>
            {/* Content */}
            <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <nav
                className="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
                data-hs-accordion-always-open=""
              >
                <ul className="flex flex-col space-y-1">
                  <li>
                    <Link
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-white"
                      to="/"
                      onClick={()=>{setBreadCrumb("Dashboard")}}
                    >
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Dashboard
                    </Link>
                  </li>

                  <li className="hs-accordion" id="account-accordion">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                      aria-expanded="true"
                      aria-controls="account-accordion-child"
                    >
                      <svg fill="#1f2937" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width={24} height={24} className="shrink-0 mt-0.5 size-4">
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M136.948 908.811c5.657 0 10.24-4.583 10.24-10.24V610.755c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v287.816c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V610.755c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v287.816c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.96c5.657 0 10.24-4.583 10.24-10.24V551.322c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v347.249c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V551.322c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v347.249c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.342c5.657 0 10.24-4.583 10.24-10.24V492.497c0-5.651-4.588-10.24-10.24-10.24h-81.92c-5.652 0-10.24 4.589-10.24 10.24v406.692c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V492.497c0-28.271 22.924-51.2 51.2-51.2h81.92c28.276 0 51.2 22.929 51.2 51.2v406.692c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.958c5.657 0 10.24-4.583 10.24-10.24V441.299c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v457.892c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V441.299c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v457.892c0 28.278-22.922 51.2-51.2 51.2zm-6.205-841.902C677.379 271.088 355.268 367.011 19.245 387.336c-11.29.683-19.889 10.389-19.206 21.679s10.389 19.889 21.679 19.206c342.256-20.702 670.39-118.419 964.372-284.046 9.854-5.552 13.342-18.041 7.79-27.896s-18.041-13.342-27.896-7.79z" />
                          <path d="M901.21 112.64l102.39.154c11.311.017 20.494-9.138 20.511-20.449s-9.138-20.494-20.449-20.511l-102.39-.154c-11.311-.017-20.494 9.138-20.511 20.449s9.138 20.494 20.449 20.511z" />
                          <path d="M983.151 92.251l-.307 101.827c-.034 11.311 9.107 20.508 20.418 20.542s20.508-9.107 20.542-20.418l.307-101.827c.034-11.311-9.107-20.508-20.418-20.542s-20.508 9.107-20.542 20.418z" />
                        </g>
                      </svg>

                      Sales Data
                      <svg
                        className="hs-accordion-active:block ms-auto hidden size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="hs-accordion-active:hidden ms-auto block size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      id="account-accordion-child"
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="account-accordion"
                    >
                      <ul className="ps-8 pt-1 space-y-1">
                        <li>

                          <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-200"
                            to="sales/view"
                            onClick={()=>{setBreadCrumb("Sales")}}
                          >
                            <svg
                              fill="#1f2937"
                              height="15"
                              width="15"
                              version="1.1"
                              id="Layer_1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              viewBox="0 0 512 512"
                              xmlSpace="preserve"
                              stroke="#1f2937"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M226.133,469.333H55.467V409.6c0-4.71-3.823-8.533-8.533-8.533c-4.71,0-8.533,3.823-8.533,8.533v68.267 c0,4.71,3.823,8.533,8.533,8.533h179.2c4.71,0,8.533-3.823,8.533-8.533S230.844,469.333,226.133,469.333z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M46.933,366.933c-4.71,0-8.533,3.823-8.533,8.533S42.223,384,46.933,384h0.085c4.71,0,8.491-3.823,8.491-8.533 S51.644,366.933,46.933,366.933z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M394.3,139.034L257.766,2.5c-1.596-1.604-3.772-2.5-6.033-2.5h-204.8C42.223,0,38.4,3.823,38.4,8.533v332.8 c0,4.71,3.823,8.533,8.533,8.533c4.71,0,8.533-3.823,8.533-8.533V17.067H243.2v128c0,4.71,3.823,8.533,8.533,8.533h128v76.8 c0,4.71,3.823,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-85.333C396.8,142.805,395.904,140.629,394.3,139.034z M260.267,136.533 V29.133l107.401,107.401H260.267z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M345.6,256c-70.579,0-128,57.421-128,128s57.421,128,128,128s128-57.421,128-128S416.179,256,345.6,256z M345.6,494.933 c-61.167,0-110.933-49.766-110.933-110.933S284.433,273.067,345.6,273.067S456.533,322.833,456.533,384 S406.767,494.933,345.6,494.933z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M429.286,378.957c-22.272-31.138-51.994-48.29-83.686-48.29s-61.406,17.143-83.678,48.29 c-2.005,2.807-2.125,6.682-0.324,9.626c21.709,35.319,51.132,54.904,82.859,55.151c0.205,0,0.41,0,0.614,0 c31.872,0,61.841-19.524,84.454-55.04C431.411,385.741,431.317,381.798,429.286,378.957z M345.6,349.867 c9.395,0,17.032,7.637,17.032,17.033c0,9.395-7.637,17.033-17.032,17.033c-9.395,0-17.033-7.646-17.033-17.033 S336.205,349.867,345.6,349.867z M410.01,387.081c-18.526,25.626-41.327,39.586-64.947,39.586c-0.162,0-0.316,0-0.469,0 c-23.424-0.188-45.747-14.148-63.556-39.543c-1.109-1.587-1.033-3.84,0.205-5.333c8.678-10.513,18.398-18.662,28.732-24.38 c1.271-0.7,2.825,0.495,2.483,1.911c-1.988,8.09-1.237,17.212,6.016,27.341c3.866,5.402,9.054,9.668,15.275,12.006 c23.748,8.917,45.986-9.088,45.986-31.735c0-3.115-0.768-5.291-1.348-7.893c-0.307-1.374,1.289-2.483,2.526-1.809 c10.411,5.7,20.19,13.858,28.937,24.422C411.102,383.181,411.17,385.476,410.01,387.081z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                              </g>
                            </svg>

                            View
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-200"
                            to="sales/create"
                          >
                            <svg
                              height={15}
                              width={15}
                              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                                  stroke="#1f2937"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                                <path
                                  d="M17 15V18M17 21V18M17 18H14M17 18H20"
                                  stroke="#1f2937"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                              </g>
                            </svg>
                            Create
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </li>
                  <li className="hs-accordion" id="account-accordion">
                    <button
                      type="button"
                      className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                      aria-expanded="true"
                      aria-controls="account-accordion-child"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 mt-0.5 size-4" width={24} height={24}>
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.2626 3.26045C7.38219 2.13044 8.33828 1.25 9.5 1.25H14.5C15.6617 1.25 16.6178 2.13044 16.7374 3.26045C17.5005 3.27599 18.1603 3.31546 18.7236 3.41895C19.4816 3.55818 20.1267 3.82342 20.6517 4.34835C21.2536 4.95027 21.5125 5.70814 21.6335 6.60825C21.75 7.47522 21.75 8.57754 21.75 9.94513V16.0549C21.75 17.4225 21.75 18.5248 21.6335 19.3918C21.5125 20.2919 21.2536 21.0497 20.6517 21.6517C20.0497 22.2536 19.2919 22.5125 18.3918 22.6335C17.5248 22.75 16.4225 22.75 15.0549 22.75H8.94513C7.57754 22.75 6.47522 22.75 5.60825 22.6335C4.70814 22.5125 3.95027 22.2536 3.34835 21.6517C2.74643 21.0497 2.48754 20.2919 2.36652 19.3918C2.24996 18.5248 2.24998 17.4225 2.25 16.0549V9.94513C2.24998 8.57754 2.24996 7.47522 2.36652 6.60825C2.48754 5.70814 2.74643 4.95027 3.34835 4.34835C3.87328 3.82342 4.51835 3.55818 5.27635 3.41895C5.83973 3.31546 6.49952 3.27599 7.2626 3.26045ZM7.26496 4.76087C6.54678 4.7762 5.99336 4.81234 5.54735 4.89426C4.98054 4.99838 4.65246 5.16556 4.40901 5.40901C4.13225 5.68577 3.9518 6.07435 3.85315 6.80812C3.75159 7.56347 3.75 8.56458 3.75 10V16C3.75 17.4354 3.75159 18.4365 3.85315 19.1919C3.9518 19.9257 4.13225 20.3142 4.40901 20.591C4.68577 20.8678 5.07435 21.0482 5.80812 21.1469C6.56347 21.2484 7.56458 21.25 9 21.25H15C16.4354 21.25 17.4365 21.2484 18.1919 21.1469C18.9257 21.0482 19.3142 20.8678 19.591 20.591C19.8678 20.3142 20.0482 19.9257 20.1469 19.1919C20.2484 18.4365 20.25 17.4354 20.25 16V10C20.25 8.56458 20.2484 7.56347 20.1469 6.80812C20.0482 6.07434 19.8678 5.68577 19.591 5.40901C19.3475 5.16556 19.0195 4.99838 18.4527 4.89426C18.0066 4.81234 17.4532 4.7762 16.735 4.76087C16.6058 5.88062 15.6544 6.75 14.5 6.75H9.5C8.34559 6.75 7.39424 5.88062 7.26496 4.76087ZM9.5 2.75C9.08579 2.75 8.75 3.08579 8.75 3.5V4.5C8.75 4.91421 9.08579 5.25 9.5 5.25H14.5C14.9142 5.25 15.25 4.91421 15.25 4.5V3.5C15.25 3.08579 14.9142 2.75 14.5 2.75H9.5ZM6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z"
                            fill="#1f2937"
                          />{" "}
                        </g>
                      </svg>


                      Items Data
                      <svg
                        className="hs-accordion-active:block ms-auto hidden size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <svg
                        className="hs-accordion-active:hidden ms-auto block size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      id="account-accordion-child"
                      className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
                      role="region"
                      aria-labelledby="account-accordion"
                    >
                      <ul className="ps-8 pt-1 space-y-1">
                        <li>
                          <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-200"
                            to="items/view"
                            onClick={()=>{setBreadCrumb("Items")}}
                          >
                            <svg
                              fill="#1f2937"
                              height="15"
                              width="15"
                              version="1.1"
                              id="Layer_1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              viewBox="0 0 512 512"
                              xmlSpace="preserve"
                              stroke="#1f2937"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M226.133,469.333H55.467V409.6c0-4.71-3.823-8.533-8.533-8.533c-4.71,0-8.533,3.823-8.533,8.533v68.267 c0,4.71,3.823,8.533,8.533,8.533h179.2c4.71,0,8.533-3.823,8.533-8.533S230.844,469.333,226.133,469.333z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M46.933,366.933c-4.71,0-8.533,3.823-8.533,8.533S42.223,384,46.933,384h0.085c4.71,0,8.491-3.823,8.491-8.533 S51.644,366.933,46.933,366.933z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M394.3,139.034L257.766,2.5c-1.596-1.604-3.772-2.5-6.033-2.5h-204.8C42.223,0,38.4,3.823,38.4,8.533v332.8 c0,4.71,3.823,8.533,8.533,8.533c4.71,0,8.533-3.823,8.533-8.533V17.067H243.2v128c0,4.71,3.823,8.533,8.533,8.533h128v76.8 c0,4.71,3.823,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-85.333C396.8,142.805,395.904,140.629,394.3,139.034z M260.267,136.533 V29.133l107.401,107.401H260.267z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M345.6,256c-70.579,0-128,57.421-128,128s57.421,128,128,128s128-57.421,128-128S416.179,256,345.6,256z M345.6,494.933 c-61.167,0-110.933-49.766-110.933-110.933S284.433,273.067,345.6,273.067S456.533,322.833,456.533,384 S406.767,494.933,345.6,494.933z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                                <g>
                                  {" "}
                                  <g>
                                    {" "}
                                    <path d="M429.286,378.957c-22.272-31.138-51.994-48.29-83.686-48.29s-61.406,17.143-83.678,48.29 c-2.005,2.807-2.125,6.682-0.324,9.626c21.709,35.319,51.132,54.904,82.859,55.151c0.205,0,0.41,0,0.614,0 c31.872,0,61.841-19.524,84.454-55.04C431.411,385.741,431.317,381.798,429.286,378.957z M345.6,349.867 c9.395,0,17.032,7.637,17.032,17.033c0,9.395-7.637,17.033-17.032,17.033c-9.395,0-17.033-7.646-17.033-17.033 S336.205,349.867,345.6,349.867z M410.01,387.081c-18.526,25.626-41.327,39.586-64.947,39.586c-0.162,0-0.316,0-0.469,0 c-23.424-0.188-45.747-14.148-63.556-39.543c-1.109-1.587-1.033-3.84,0.205-5.333c8.678-10.513,18.398-18.662,28.732-24.38 c1.271-0.7,2.825,0.495,2.483,1.911c-1.988,8.09-1.237,17.212,6.016,27.341c3.866,5.402,9.054,9.668,15.275,12.006 c23.748,8.917,45.986-9.088,45.986-31.735c0-3.115-0.768-5.291-1.348-7.893c-0.307-1.374,1.289-2.483,2.526-1.809 c10.411,5.7,20.19,13.858,28.937,24.422C411.102,383.181,411.17,385.476,410.01,387.081z" />{" "}
                                  </g>{" "}
                                </g>{" "}
                              </g>
                            </svg>
                            View
                          </Link>
                        </li>
                        {/* <li>


                          <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:text-neutral-200"
                            to="items/create"
                          >
                            <svg
                              height={15}
                              width={15}
                              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                                  stroke="#1f2937"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                                <path
                                  d="M17 15V18M17 21V18M17 18H14M17 18H20"
                                  stroke="#1f2937"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                              </g>
                            </svg>
                            Create
                          </Link>
                        </li> */}
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:bg-neutral-700 dark:text-white"
                      href="#"
                      onClick={handleLogout}
                    >

                      <svg
                        fill="#B91c1c"
                        viewBox="0 0 32 32"
                        version="1.1"
                        className="shrink-0 mt-0.5 size-4" width={24} height={24}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path d="M3.651 16.989h17.326c0.553 0 1-0.448 1-1s-0.447-1-1-1h-17.264l3.617-3.617c0.391-0.39 0.391-1.024 0-1.414s-1.024-0.39-1.414 0l-5.907 6.062 5.907 6.063c0.196 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293c0.391-0.39 0.391-1.023 0-1.414zM29.989 0h-17c-1.105 0-2 0.895-2 2v9h2.013v-7.78c0-0.668 0.542-1.21 1.21-1.21h14.523c0.669 0 1.21 0.542 1.21 1.21l0.032 25.572c0 0.668-0.541 1.21-1.21 1.21h-14.553c-0.668 0-1.21-0.542-1.21-1.21v-7.824l-2.013 0.003v9.030c0 1.105 0.895 2 2 2h16.999c1.105 0 2.001-0.895 2.001-2v-28c-0-1.105-0.896-2-2-2z" />{" "}
                        </g>
                      </svg>


                      <span className='text-red-700'>
                        Logout</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            {/* End Content */}
          </div>
        </div>
        {/* End Sidebar */}
        {/* Content */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:ps-[16rem] lg:pt-0 lg:pr-0">
          <Outlet context={{ importData, setImportData, importItemsData, setImportItemsData, importSalesData, setImportSalesData }} />
        </div>
        {/* End Content */}
        {/* ========== END MAIN CONTENT ========== */}
      </>

    </>
  )

}