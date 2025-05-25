import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseDetailsService } from "@/services";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

function StudentCourseDetails() {
  const {
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

    console.log(res);
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
  return <div>StudentCourseDetails</div>;
}

export default StudentCourseDetails;
