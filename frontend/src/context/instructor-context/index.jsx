import { createContext } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  return <InstructorContext.Provider>{children}</InstructorContext.Provider>;
}
