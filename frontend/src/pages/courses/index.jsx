import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowUpDownIcon, Filter as FilterIcon } from "lucide-react";

import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseListService } from "@/services";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export default function StudentCoursePage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { studentCoursesList, setStudentCoursesList, loading, setLoading } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const limit = 6;

  function createSearchParamsHelper(filters) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
    }
    return queryParams.join("&");
  }

  async function fetchAllStudentViewCourses(filters, sort, page, limit) {
    setLoading(true);
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
      page: page,
      limit: limit,
    });
    const res = await fetchStudentCourseListService(query);
    if (res.success) {
      setStudentCoursesList(res.data);
      setTotalPages(res.pagination.totalPages);
    }
    setLoading(false);
  }

  function handleFilterOnChange(group, option) {
    const copy = { ...filters };
    if (!copy[group]) {
      copy[group] = [option.id];
    } else {
      const idx = copy[group].indexOf(option.id);
      if (idx === -1) {
        copy[group].push(option.id);
      } else {
        copy[group].splice(idx, 1);
      }
      if (copy[group].length === 0) {
        delete copy[group];
      }
    }
    setFilters(copy);
    sessionStorage.setItem("filters", JSON.stringify(copy));
  }

  // restore filters on mount
  useEffect(() => {
    setSort("price-lowtohigh");
    const saved = sessionStorage.getItem("filters");
    if (saved) {
      try {
        setFilters(JSON.parse(saved));
      } catch {
        setFilters({});
      }
    }
  }, []);

  // sync filters → URL
  useEffect(() => {
    const qs = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(qs));
  }, [filters, setSearchParams]);

  // fetch courses whenever filters or sort change
  useEffect(() => {
    fetchAllStudentViewCourses(filters, sort, page, limit);
  }, [filters, sort, page]);

  // cleanup
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
        {/* Sidebar Filters (desktop only) */}
        <aside className="hidden md:block w-full md:w-64 bg-white rounded-lg shadow p-4 space-y-6">
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
                      checked={filters[group]?.includes(opt.id) ?? false}
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
          {/* Sort + Mobile Filter Button + Result Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex gap-2">
              {/* Sort Dropdown */}
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
                    onValueChange={(v) => setSort(v)}
                  >
                    {sortOptions.map((so) => (
                      <DropdownMenuRadioItem value={so.id} key={so.id}>
                        {so.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Filters Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition md:hidden"
                  >
                    <FilterIcon className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-xs">
                  <DialogClose
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                  ></DialogClose>
                  <div className="pt-6 space-y-6">
                    {Object.keys(filterOptions).map((group) => (
                      <div key={group}>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          {group.toUpperCase()}
                        </h3>
                        <div className="space-y-2">
                          {filterOptions[group].map((opt) => (
                            <Label
                              htmlFor={`mobile-filter-${group}-${opt.id}`}
                              className="flex items-center gap-2 text-gray-600"
                              key={opt.id}
                            >
                              <Checkbox
                                id={`mobile-filter-${group}-${opt.id}`}
                                checked={
                                  filters[group]?.includes(opt.id) ?? false
                                }
                                onCheckedChange={() =>
                                  handleFilterOnChange(group, opt)
                                }
                                className="text-indigo-600"
                              />
                              {opt.label}
                            </Label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <span className="text-sm font-medium text-gray-700">
              {studentCoursesList?.length ?? 0} Results
            </span>
          </div>

          {/* Courses Grid / Loading / Empty State */}
          {studentCoursesList && studentCoursesList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentCoursesList.map((course) => (
                  <Card
                    key={course._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/course/details/${course._id}`)}
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
                        {course.curriculum.length}{" "}
                        {course.curriculum.length === 1
                          ? "Lecture"
                          : "Lectures"}{" "}
                        • {course.level.toUpperCase()} Level
                      </p>
                      <p className="mt-2 text-sm font-semibold text-indigo-600">
                        ${course.pricing}
                      </p>
                    </CardContent>
                  </Card>
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
          ) : loading ? (
            <Skeleton className="h-64" />
          ) : (
            <p className="text-center text-gray-500 py-12">No Courses Found</p>
          )}
        </main>
      </div>
    </div>
  );
}
