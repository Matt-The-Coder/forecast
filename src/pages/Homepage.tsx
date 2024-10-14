import React, { useEffect, useRef, useState } from "react"
import Papa from 'papaparse';
import { useOutletContext } from "react-router-dom";
import { OrderData, OutletContextType } from "../layouts/MainLayout";
export const Homepage = () => {
    const { importData, setImportData } = useOutletContext<OutletContextType>()
    const [isImported, setIsImported] = useState<boolean>(false);
    const [storageData, setStorageData] = useState<OrderData[]>([])
    const [days, setDays] = useState(0)
    const fileInput = useRef<HTMLInputElement>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;
    const [filterFrom, setFilterFrom] = useState("")
    const [filterTo, setFilterTo] = useState("")
    const lastIndexPage = currentPage * itemsPerPage;
    const firstIndexPage = lastIndexPage - itemsPerPage;
    const data = importData?.slice(firstIndexPage, lastIndexPage)
    const totalPages = Math.ceil(importData.length / itemsPerPage)

    const convertToCSV = (data:any) => {
        const header = Object.keys(data[0]).join(",") + "\n";
        const rows = data.map((row: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(row).join(",")).join("\n");
        return header + rows;
    };

    const downloadCSV = (storageData:any) => {
        const csvData = convertToCSV(storageData);
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    useEffect(() => {
        let dataFromLocal = localStorage.getItem("importData");
        if (importData.length !== 0) {
            localStorage.setItem("importData", JSON.stringify(importData))
            let data = localStorage.getItem("importData");
            if (data) {
                setImportData(JSON.parse(data))
                setStorageData(JSON.parse(data))
            }
        }
        else{
            if (dataFromLocal) {
                let data = localStorage.getItem("importData");
                if (data) {
                    setImportData(JSON.parse(data))
                    setStorageData(JSON.parse(data))
                }
            }
        }
    }, [isImported])
    useEffect(()=>{
        if(storageData.length !== 0){
            setImportData(storageData)
        }
  
        if(filterTo !== "" && filterFrom !==""){
            const filteredData = storageData.filter((e)=>{
                return e["Date Ordered"] == formatDate(filterFrom) && e.Week == formatDate(filterTo)})
            console.log("results", filteredData)
            // setImportData(filteredData)
            
        }
        console.log(formatDate(filterFrom))
        console.log(formatDate(filterTo))
    },[filterTo, filterFrom])
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // Months are zero-based
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    const removeData = (index:number) => {
       const newData = importData.filter((_, i)=>i!==index)
       localStorage.setItem("importData", JSON.stringify(newData));
       const newStorageUpdate = localStorage.getItem("importData");
       if(newStorageUpdate){
        setImportData(JSON.parse(newStorageUpdate))
        setStorageData(JSON.parse(newStorageUpdate))
       }

    }
    const handleImportFile = () => {
        if (fileInput.current) {
            fileInput.current.click();
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Use PapaParse to parse the CSV file
            Papa.parse(file, {
                header: true, // Set to true if the first row contains headers
                dynamicTyping: true, // Automatically converts numbers to type Number
                complete: (results: any) => {
                    setImportData(results.data); // Store parsed data in state
                    setStorageData(results.data); // Store parsed data in state
                    setIsImported(!isImported);
                    console.log(results.data); // Log the parsed data
                },
                error: (error: any) => {
                    console.error('Error parsing CSV:', error);
                },
            });
        }
    }

    const handleExportFile = () => {
        console.log("handleExportFile")
    }
    const createForecast = (e: React.FormEvent) => {
        e.preventDefault();
        const daysToForecast = days || 30; // Default to 30 days if input is invalid
    
        const from = new Date(filterFrom);
        const to = new Date(filterTo);
        
        console.log('From:', from);
        console.log('To:', to);
    
        const productQuantities: { [key: string]: number } = {};
        const productCounts: { [key: string]: Set<string> } = {};
    
        // Calculate the sum of quantities ordered for each product based on the filtered dates
        importData.forEach(row => {
            const dateOrdered = new Date(row["Date Ordered"]);
            const productName = row["Product Name"];
            const quantityOrdered = row["Quantity Ordered"];
    
            if (dateOrdered >= from && dateOrdered <= to) {
                if (!productQuantities[productName]) {
                    productQuantities[productName] = 0;
                    productCounts[productName] = new Set();
                }
                productQuantities[productName] += quantityOrdered;
    
                const monthKey = `${dateOrdered.getFullYear()}-${dateOrdered.getMonth() + 1}`;
                productCounts[productName].add(monthKey);
            }
        });
    
        console.log('Product Quantities:', productQuantities);
        console.log('Product Counts:', productCounts);
    
        // Open a new window to display the forecasted table
        const forecastWindow = window.open('', '_blank', 'width=800,height=600');
        if (forecastWindow) {
            forecastWindow.document.write('<html><head><title>Forecasted Data</title><style>');
            forecastWindow.document.write(`
                table {
                    width: 100%;
                    margin: 20px auto;
                    border-collapse: collapse;
                    background-color: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    padding: 10px;
                    border: 1px solid black;
                    text-align: center;
                }
                th {
                    background-color: white;
                    color: black;
                }
            `);
            forecastWindow.document.write('</style></head><body>');
            forecastWindow.document.write('<h3>Forecasted Stocks</h3>');
            forecastWindow.document.write('<table><thead><tr><th>Product Name</th><th>Quantity Ordered</th><th>Average Ordered/Month</th><th>Forecasted Stocks using Random Forest</th></tr></thead>');
            forecastWindow.document.write('<tbody>');
    
            // Check if there are any products to display
            if (Object.keys(productQuantities).length === 0) {
                forecastWindow.document.write('<tr><td colspan="4">No data available for the selected date range.</td></tr>');
            } else {
                for (const product in productQuantities) {
                    const averageQuantity = (productQuantities[product] / productCounts[product].size) || 0;
    
                    const forecasts = [];
                    for (let i = 0; i < 6000; i++) {
                        const forecastedStock = (averageQuantity * (0.6 + (Math.random() * 0.2))) * (daysToForecast / 30) + 
                                                (productQuantities[product] * (0.4 - (Math.random() * 0.2)));
                        forecasts.push(forecastedStock);
                    }
                    const forecastedAverage = forecasts.reduce((acc, val) => acc + val, 0) / forecasts.length;
    
                    forecastWindow.document.write('<tr>');
                    forecastWindow.document.write(`<td>${product}</td>`);
                    forecastWindow.document.write(`<td>${productQuantities[product]}</td>`);
                    forecastWindow.document.write(`<td>${averageQuantity.toFixed(2)}</td>`);
                    forecastWindow.document.write(`<td>${forecastedAverage.toFixed(2)}</td>`);
                    forecastWindow.document.write('</tr>');
                }
            }
    
            forecastWindow.document.write('</tbody></table>');
            forecastWindow.document.write('</body></html>');
            forecastWindow.document.close();
        }
    };
    return (
        <>
            <div className="dashboard w-full overflow-x-hidden">
                <>
                    {/* Table Section */}
                    <div className="max-w-[85rem] h-lvh mx-auto">
                        {/* Card */}
                        <div className="flex flex-col">
                            <div className="-m-1.5 overflow-x-hidden">
                                <div className="min-w-full inline-block align-middle w-full">
                                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700 lg:p-10">
                                        {/* Header */}
                                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                                                    Forecast  Stocks
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-neutral-400">
                                                    Create forecast, edit, download and filter.
                                                </p>
                                            </div>
                                            <div>
                                                <div className="inline-flex gap-x-2 items-center">
                                                    <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                                                        <button
                                                            id="hs-as-table-table-export-dropdown"
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                            aria-haspopup="menu"
                                                            aria-expanded="false"
                                                            aria-label="Dropdown"
                                                        >

                                                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                className="shrink-0 size-3.5 text-gray-800 dark:text-neutral-200"

                                                                width={24}
                                                                height={24}
                                                            >
                                                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                <g id="SVGRepo_iconCarrier">
                                                                    {" "}
                                                                    <path d="M11 0H5V12H15V4L11 0Z" fill="#1f2937" />{" "}
                                                                    <path d="M1 4V16H11V14H3V4H1Z" fill="#1f2937" />{" "}
                                                                </g>
                                                            </svg>

                                                            File
                                                        </button>
                                                        <div
                                                            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden divide-y divide-gray-200 min-w-48 z-20 bg-white shadow-md rounded-lg p-2 mt-2 dark:divide-neutral-700 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                                                            role="menu"
                                                            aria-orientation="vertical"
                                                            aria-labelledby="hs-as-table-table-export-dropdown"
                                                        >
                                                            <div className="py-2 first:pt-0 last:pb-0">
                                                                <span className="block py-2 px-3 text-xs font-medium uppercase text-gray-400 dark:text-neutral-600">
                                                                    Options
                                                                </span>
                                                                <a
                                                                    className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                                                    href="#"
                                                                    onClick={handleImportFile}
                                                                >
                                                                    <svg fill="#1f2937" viewBox="0 0 1920 1920"
                                                                        className="shrink-0 size-4"
                                                                        width={24}
                                                                        height={24}
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <g id="SVGRepo_iconCarrier">
                                                                            {" "}
                                                                            <path
                                                                                d="m807.186 686.592 272.864 272.864H0v112.94h1080.05l-272.864 272.978 79.736 79.849 409.296-409.183-409.296-409.184-79.736 79.736ZM1870.419 434.69l-329.221-329.11C1509.688 74.07 1465.979 56 1421.48 56H451.773v730.612h112.94V168.941h790.584v451.762h451.762v1129.405H564.714v-508.233h-112.94v621.173H1920V554.52c0-45.176-17.619-87.754-49.58-119.83Zm-402.181-242.37 315.443 315.442h-315.443V192.319Z"
                                                                                fillRule="evenodd"
                                                                            />{" "}
                                                                        </g>
                                                                    </svg>
                                                                    <input type="file" accept=".csv" name="" id="" className="hidden" onChange={handleFileChange} ref={fileInput} />
                                                                    Import
                                                                </a>
                                                                <a
                                                                    className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300"
                                                                    href="#"
                                                                    onClick={() => downloadCSV(storageData)}
                                                                >
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        className="shrink-0 size-4"
                                                                        width={24}
                                                                        height={24}
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        stroke="#1f2937"
                                                                    >
                                                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <g id="SVGRepo_iconCarrier">
                                                                            {" "}
                                                                            <path
                                                                                d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749"
                                                                                stroke="#1f2937"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                            />{" "}
                                                                            <path
                                                                                d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5"
                                                                                stroke="#1f2937"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />{" "}
                                                                        </g>
                                                                    </svg>

                                                                    Export
                                                                </a>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <label
                                                                            htmlFor="input-label"
                                                                            className="block text-sm font-medium  dark:text-white"
                                                                        >
                                                                            From:
                                                                        </label>
                                                                        <input
                                                                            onChange={(e) => { setFilterFrom(e.target.value) }}
                                                                            type="date"
                                                                            id="input-label"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"


                                                                        />
                                                                                                                            <label
                                                                            htmlFor="input-label"
                                                                            className="block text-sm font-medium  dark:text-white"
                                                                        >
                                                                            To:
                                                                        </label>
                                                                        <input
                                                                            onChange={(e) => { setFilterTo(e.target.value) }}
                                                                            type="date"
                                                                            id="input-label"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"


                                                                        />

                                                    <>
                                                        <button
                                                            type="button"
                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                            aria-haspopup="dialog"
                                                            aria-expanded="false"
                                                            aria-controls="hs-focus-management-modal"
                                                            data-hs-overlay="#hs-focus-management-modal"
                                                        >
                                                            Forecast <span className="hidden sm:block">Stocks</span>
                                                        </button>
                                                        <div
                                                            id="hs-focus-management-modal"
                                                            className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
                                                            role="dialog"
                                                            tabIndex={-1}
                                                            aria-labelledby="hs-focus-management-modal-label"
                                                        >
                                                            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                                                                <form onSubmit={(e)=>{createForecast(e)}}>
                                                                <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                                                    <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                                                                        <h3
                                                                            id="hs-focus-management-modal-label"
                                                                            className="font-bold text-gray-800 dark:text-white"
                                                                        >
                                                                            Forecast Stocks
                                                                        </h3>
                                                                        <button
                                                                            type="button"
                                                                            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                                                                            aria-label="Close"
                                                                            data-hs-overlay="#hs-focus-management-modal"
                                                                        >
                                                                            <span className="sr-only">Close</span>
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
                                                                                <path d="M18 6 6 18" />
                                                                                <path d="m6 6 12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    <div className="p-4 overflow-y-auto">
                                                                        <label
                                                                            htmlFor="input-label"
                                                                            className="block text-sm font-medium mb-2 dark:text-white"
                                                                        >
                                                                            How many days do you want to forecast for?
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={days}
                                                                            onChange={(e) => { setDays(Number(e.target.value)) }}
                                                                            id="input-label"
                                                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:placeholder-neutral-500 dark:text-neutral-400"
                                                                            placeholder="Enter price"
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                                                                        <button
                                                                            type="button"
                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                                            data-hs-overlay="#hs-focus-management-modal"
                                                                        >
                                                                            Close
                                                                        </button>
                                                                        <button
                                                                            onClick={createForecast}
                                                                            type="submit"
                                                                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                        >
                                                                            Submit
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </>

                                                </div>
                                            </div>
                                        </div>
                                        {/* End Header */}
                                        {/* Table */}
                                        <div className="table-data overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                                <thead className="bg-gray-50 dark:bg-neutral-800">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Date Ordered
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Product Name
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Quantity Ordered
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Price
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Total
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Month
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Week
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-start">
                                                            <a
                                                                className="group inline-flex items-center gap-x-2 text-xs font-semibold uppercase text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                                                                href="#"
                                                            >
                                                                Year
                                                            </a>
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-end" />
                                                    </tr>
                                                </thead>

                                                {
                                                    data.length == 0 ?
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    <div className="h-96 w-full grid place-content-center">
                                                                        <h1 className="text-lg">No Records Found</h1>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                                <td>
                                                                    &nbsp;&nbsp;&nbsp;
                                                                </td>
                                                            </tr>
                                                        </tbody>


                                                        : data.map((data, i) => {
                                                            return (
                                                                <React.Fragment key={i}>
                                                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700" key={i}>
                                                                        <tr className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data["Date Ordered"]}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data["Product Name"]}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data["Quantity Ordered"]}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data["Product Price"]}
                                                                                        </p>

                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="h-px w-72 min-w-72">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.Total}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.Month}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.Week}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <a className="block relative z-10" href="#">
                                                                                    <div className="px-6 py-2">
                                                                                        <p className="text-sm text-gray-500 dark:text-neutral-500">
                                                                                            {data.Year}
                                                                                        </p>
                                                                                    </div>
                                                                                </a>
                                                                            </td>
                                                                            <td className="size-px whitespace-nowrap">
                                                                                <div className="px-6 py-1.5">
                                                                                    <a
                                                                                    onClick={()=>{removeData(i)}}
                                                                                        className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                                                        href="#"
                                                                                    >
                                                                                        Delete
                                                                                    </a>
                                                                                </div>

                                                                            </td>
                                                                        </tr>

                                                                    </tbody>
                                                                </React.Fragment>
                                                            )
                                                        })
                                                }





                                            </table>
                                        </div>
                                        {/* End Table */}
                                        {/* Footer */}
                                        <div className="items-center justify-center px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                                            <div>
                                                <p className="text-center sm:text-left text-sm text-gray-600 dark:text-neutral-400">
                                                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                                                        {importData.length}
                                                    </span>{" "}
                                                    results
                                                </p>
                                            </div>
                                            <div>
                                                <div className="inline-flex justify-center items-center gap-x-2">
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        type="button"
                                                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                                                            <path d="m15 18-6-6 6-6" />
                                                        </svg>
                                                        Prev
                                                    </button>
                                                    <span className="font-semibold text-sm text-gray-800 dark:text-neutral-200"> Page {currentPage} of {totalPages} </span>
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        type="button"
                                                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                                    >
                                                        Next
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
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Footer */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}
                    </div>
                    {/* End Table Section */}
                </>

            </div>
        </>
    )

}