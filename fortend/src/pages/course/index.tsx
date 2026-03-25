import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/header/page-header";
import SearchInput from "./SearchInput";
import { getAllCoursesList, deleteCourse } from "../../api/course.api";
import type { ICourseResponse } from "../../types/course.types";
import { FiBook, FiHash, FiLayers, FiCalendar, FiAward } from "react-icons/fi";
import { useNavigate } from "react-router";
import ConfirmationModal from "../../components/modal/confirmation.modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/auth.context";
import { Role } from "../../types/enum";

const CoursePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tempInputValue, setTempInputValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [creditHours, setCreditHours] = useState<number | "">("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState<number | "">("");
  const [program, setProgram] = useState("");
  const { user } = useAuth();

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => setInputValue(tempInputValue), 400);
    return () => clearTimeout(timeout);
  }, [tempInputValue]);

  // Fetch courses using React Query
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["get_all_courses"],
    queryFn: () => getAllCoursesList(),
  });

  const courses: ICourseResponse[] =
    coursesData?.data?.data || coursesData?.data || [];

  // Filtered courses
  const [filteredCourses, setFilteredCourses] =
    useState<ICourseResponse[]>(courses);

  useEffect(() => {
    let temp = [...courses];

    if (creditHours !== "")
      temp = temp.filter((c) => c.creditHours === creditHours);
    if (department !== "")
      temp = temp.filter((c) =>
        c.department.toLowerCase().includes(department.toLowerCase()),
      );
    if (semester !== "") temp = temp.filter((c) => c.semester === semester);
    if (program !== "")
      temp = temp.filter((c) =>
        c.program.toLowerCase().includes(program.toLowerCase()),
      );
    if (inputValue !== "")
      temp = temp.filter((c) =>
        c.name.toLowerCase().includes(inputValue.toLowerCase()),
      );

    setFilteredCourses(temp);
  }, [creditHours, department, semester, program, inputValue, courses]);

  // Delete mutation
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (res) => {
      toast.success(res.message ?? "Course deleted successfully");
      setShowDeleteModal(false);
      setSelectedCourseId(null);
      queryClient.invalidateQueries({ queryKey: ["get_all_courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete course");
    },
  });

  const handleDelete = () => {
    if (selectedCourseId) deleteMutate(selectedCourseId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Loading Courses...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full p-6 flex flex-col gap-6 bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Page Header */}
      <PageHeader
        key="list-course"
        title="Course List"
        sub_title="Explore all available courses"
        {...(user?.role === Role.ADMIN && { button_text: "Add Course" })}
        link_to="/course/add"
      />

      {/* Filter Card */}
      <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row gap-4 items-center border border-gray-200">
        <SearchInput
          tempInputValue={tempInputValue}
          setTempInputValue={setTempInputValue}
          placeholder="Search courses..."
          id="search"
        />
        <input
          type="number"
          placeholder="Credit Hours"
          value={creditHours}
          onChange={(e) =>
            setCreditHours(e.target.value ? parseInt(e.target.value) : "")
          }
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full md:w-44"
        />
        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full md:w-44"
        />
        <input
          type="number"
          placeholder="Semester"
          value={semester}
          onChange={(e) =>
            setSemester(e.target.value ? parseInt(e.target.value) : "")
          }
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full md:w-36"
        />
        <input
          type="text"
          placeholder="Program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full md:w-44"
        />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            No courses match the selected filters
          </div>
        )}

        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 border border-gray-100 flex flex-col gap-4 h-full"
          >
            {/* Header */}
            <div
              className="relative flex items-center justify-center rounded-t-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-md -mx-4 px-6"
              style={{ minHeight: "64px", lineHeight: "1.2" }}
            >
              <span className="text-center break-words">{course.name}</span>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 text-gray-700 text-sm flex-1">
              <div className="flex items-center gap-2">
                <FiHash className="text-indigo-500" />{" "}
                <span className="font-medium">Code:</span> {course.code}
              </div>
              <div className="flex items-center gap-2">
                <FiBook className="text-green-500" />{" "}
                <span className="font-medium">Credit Hours:</span>{" "}
                {course.creditHours}
              </div>
              <div className="flex items-center gap-2">
                <FiLayers className="text-yellow-500" />{" "}
                <span className="font-medium">Department:</span>{" "}
                {course.department}
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-pink-500" />{" "}
                <span className="font-medium">Semester:</span> {course.semester}
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-purple-500" />{" "}
                <span className="font-medium">Program:</span> {course.program}
              </div>
            </div>

            {/* Action Buttons */}
            {(() => {
              return user?.role === Role.ADMIN ? (
                <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3 sm:gap-0">
                  <button
                    onClick={() =>
                      navigate(`/course/edit/${course._id}?name=${course.name}`)
                    }
                    className="sm:w-[48%] w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:from-indigo-600 hover:to-purple-600 transition cursor-pointer flex items-center justify-center text-center"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourseId(course._id);
                      setShowDeleteModal(true);
                    }}
                    className="sm:w-[48%] w-full bg-red-500 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:bg-red-600 transition cursor-pointer flex items-center justify-center text-center"
                  >
                    Delete
                  </button>
                </div>
              ) : null;
            })()}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          title="Delete Confirmation"
          message="Are you sure you want to remove this course?"
          confirmText="Delete"
          confirmColor="red"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
};

export default CoursePage;
