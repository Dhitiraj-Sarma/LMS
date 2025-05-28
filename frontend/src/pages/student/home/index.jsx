import { courseCategories } from "@/config";
import banner from "/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

function StudentHomePage() {
  const { studentCoursesList, setStudentCoursesList } =
    useContext(StudentContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const navigate = useNavigate();

  async function fetchAllStudentViewCourses(page, limit) {
    const query = new URLSearchParams({
      page: page,
      limit: limit,
    });
    const res = await fetchStudentCourseListService(query);
    console.log(res);
    if (res?.success) {
      setStudentCoursesList(res.data);
      setTotalPages(res.pagination.totalPages);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses(page, limit);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-16 px-6 lg:px-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-b-3xl">
        <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pr-12">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Learning that takes you{" "}
            <span className="text-yellow-300">further</span>
          </h1>
          <p className="text-lg lg:text-xl mb-6 opacity-90">
            Master new skills for today’s world—and tomorrow’s challenges.
          </p>
          <Button
            variant="solid"
            className="bg-yellow-300 text-indigo-900 hover:bg-yellow-400 transition-shadow shadow-lg"
            onClick={() => navigate("/courses")}
          >
            Get Started
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={banner}
            alt="Learning banner"
            className="w-full max-w-md rounded-xl shadow-2xl transform hover:scale-105 transition-transform"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Course Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {courseCategories.map((cat) => (
            <Button
              key={cat.id}
              variant="outline"
              className="h-14 text-left p-4 bg-white border border-purple-500 text-purple-600 rounded-xl hover:border-purple-50 hover:bg-purple-50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-6 lg:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Courses
        </h2>
        {studentCoursesList && studentCoursesList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {studentCoursesList.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
                >
                  <div className="overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {course.instructorName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${course.pricing}
                      </span>
                      <Button
                        variant="solid"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
                      >
                        Enroll
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-2 mt-6">
              <Pagination>
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No Courses Found</p>
        )}
      </section>
    </div>
  );
}

export default StudentHomePage;
