//import { useState } from "react";
const Calendar = () => {
  //const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Learning Calendar</h3>
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            Today
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100">
            Week
          </button>
          <button className="px-4 py-2 rounded-lg hover:bg-gray-100">
            Month
          </button>
        </div>
      </div>
      {/* Calendar grid implementation */}
    </div>
  );
};
export default Calendar;
