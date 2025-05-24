import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseListService } from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StudentCoursePage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { studentCoursesList, setStudentCoursesList, loading, setLoading } =
    useContext(StudentContext);

  const navigate = useNavigate();

  function createSearchParamsHelper(filters) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const res = await fetchStudentCourseListService(query);
    if (res?.success) {
      setStudentCoursesList(res.data);
      setLoading(false);
    }
  }

  function handleFilterOnChange(item, option) {
    let copy = { ...filters };
    const indexOfCurrentSection = Object.keys(copy).indexOf(item);

    if (indexOfCurrentSection === -1) {
      copy = {
        ...copy,
        [item]: [option.id],
      };
    } else {
      const indexOfCurrentOption = copy[item].indexOf(option.id);

      if (indexOfCurrentOption === -1) {
        copy[item].push(option.id);
      } else {
        copy[item].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(copy);
    sessionStorage.setItem("filters", JSON.stringify(copy));
  }

  useEffect(() => {
    const buildQueryStringsForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringsForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          All Courses
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4 space-y-6 hidden md:block">
          {Object.keys(filterOptions).map((group) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {group.toUpperCase()}
              </h3>
              <div className="space-y-2">
                {filterOptions[group].map((opt) => (
                  <Label
                    htmlFor={`filter-${group}-${opt.id}`}
                    className="flex items-center gap-2 text-gray-600"
                    key={opt.id}
                  >
                    <Checkbox
                      id={`filter-${group}-${opt.id}`}
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[group] &&
                        filters[group].indexOf(opt.id) > -1
                      }
                      onCheckedChange={() => handleFilterOnChange(group, opt)}
                      className="text-indigo-600"
                    />
                    {opt.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Sort + Result Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <ArrowUpDownIcon className="w-4 h-4" />
                  <span className="text-sm">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((so) => (
                    <DropdownMenuRadioItem value={so.id} key={so.id}>
                      {so.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm font-medium text-gray-700">
              {studentCoursesList?.length ?? 0} Results
            </span>
          </div>

          {/* Courses Grid */}
          {studentCoursesList && studentCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentCoursesList.map((course) => (
                <Card
                  key={course._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition"
                  onClick={() => navigate(`/course/details/${course?._id}`)}
                >
                  <CardContent className="flex flex-col h-full p-4">
                    <div className="w-full h-40 bg-gray-200 rounded overflow-hidden mb-3">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg font-semibold mb-1">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Created by{" "}
                      <span className="font-medium text-gray-700">
                        {course.instructorName}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {`${course.curriculum.length} ${
                        course.curriculum.length === 1 ? "Lecture" : "Lectures"
                      } • ${course.level.toUpperCase()} Level`}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-indigo-600">
                      ${course.pricing}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : loading ? (
            <Skeleton />
          ) : (
            <p className="text-center text-gray-500 py-12">No Courses Found</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentCoursePage;
