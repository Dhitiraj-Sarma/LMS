import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCoursesList, setStudentCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentCourseDetails, setStudentCourseDetails] = useState(null);
  const [currentStudentCourseDetails, setCurrentStudentCourseDetails] =
    useState(null);

  return (
    <StudentContext.Provider
      value={{
        studentCoursesList,
        setStudentCoursesList,
        loading,
        setLoading,
        studentCourseDetails,
        setStudentCourseDetails,
        currentStudentCourseDetails,
        setCurrentStudentCourseDetails,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
