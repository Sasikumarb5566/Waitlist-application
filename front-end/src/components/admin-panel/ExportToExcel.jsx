import React from "react";

const ExportToExcel = () => {
  return (
    <div>
      <button
        className="bg-blue-600 text-white p-2 mt-4 rounded-full px-3 md:absolute md:right-28 md:-top-5 text-sm"
        onClick={exportToExcel}
      >
        <FontAwesomeIcon icon={faFileExport} className="mr-1" /> Export
      </button>
    </div>
  );
};

export default ExportToExcel;
