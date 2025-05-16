import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentCoursesList, setStudentCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <StudentContext.Provider
      value={{ studentCoursesList, setStudentCoursesList, loading, setLoading }}
    >
      {children}
    </StudentContext.Provider>
  );
}
