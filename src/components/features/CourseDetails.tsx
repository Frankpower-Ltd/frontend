//import React from "react";
import { PlayCircle, BookOpen, Users, Clock } from "lucide-react";

const CourseDetails = ({ courseId }: { courseId: string }) => {
  return (
    <div className="max-w-6xl mx-auto p-6" data-course-id={courseId}>
      {/* Course header with banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">Full Stack Development</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>12 weeks</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>24 modules</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>Interactive</span>
              </div>
            </div>
          </div>
          <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 flex items-center">
            <PlayCircle className="h-5 w-5 mr-2" />
            Continue Learning
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Course Modules
            </h3>
            {/* Module list */}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-bold text-gray-900 mb-4">Instructor</h4>
            {/* Instructor card */}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            {/* Resources list */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
