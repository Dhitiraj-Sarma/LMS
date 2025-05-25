import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseDetailsService } from "@/services";
import { CheckCircle, Globe } from "lucide-react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

function StudentCourseDetails() {
  const {
    loading,
    setLoading,
    studentCourseDetails,
    setStudentCourseDetails,
    currentStudentCourseDetailsId,
    setCurrentStudentCourseDetailsId,
  } = useContext(StudentContext);

  const { id } = useParams();

  async function fetchStudentCourseDetails() {
    const res = await fetchStudentCourseDetailsService(
      currentStudentCourseDetailsId
    );

    if (res?.success) {
      setStudentCourseDetails(res?.data);
      setLoading(false);
    } else {
      setStudentCourseDetails(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentStudentCourseDetailsId !== null) {
      fetchStudentCourseDetails();
    }
  }, [currentStudentCourseDetailsId]);

  useEffect(() => {
    if (id) {
      setCurrentStudentCourseDetailsId(id);
    }
  }, [id]);

  if (loading) {
    <Skeleton />;
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Gradient header card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
          {studentCourseDetails?.title}
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-6">
          {studentCourseDetails?.subtitle}
        </p>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-medium">Instructor:</span>{" "}
            {studentCourseDetails?.instructorName}
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-medium">Created:</span>{" "}
            {studentCourseDetails?.date.split("T")[0]}
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full flex items-center">
            <Globe className="mr-1 h-4 w-4 text-indigo-200" />
            <span className="font-medium">
              {studentCourseDetails?.primaryLanguage}
            </span>
          </span>

          <span className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-medium">Enrolled:</span>{" "}
            {studentCourseDetails?.students.length}{" "}
            {studentCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>

      {/* Objectives card */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <CardTitle className="text-2xl font-bold">
                What you’ll learn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentCourseDetails?.objectives.split(",").map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-gray-800 dark:text-gray-200"
                  >
                    <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                    <span>{obj.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default StudentCourseDetails;
