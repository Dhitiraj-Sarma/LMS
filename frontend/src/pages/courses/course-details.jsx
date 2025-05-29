import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseDetailsService } from "@/services";
import { CheckCircle, Globe, LockIcon, PlayCircleIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function StudentCourseDetails() {
  const {
    loading,
    setLoading,
    studentCourseDetails,
    setStudentCourseDetails,
    currentStudentCourseDetailsId,
    setCurrentStudentCourseDetailsId,
  } = useContext(StudentContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  const getIndexOfFreePreviewUrl =
    studentCourseDetails !== null
      ? studentCourseDetails?.curriculum?.findIndex((item) => item.freePreview)
      : -1;

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

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentCourseDetails(null);
      setCurrentStudentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Skeleton className="h-12 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" count={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full rounded" />
          <Skeleton className="h-40 w-full rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Gradient header card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
          {studentCourseDetails?.title}
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 mb-4">
          {studentCourseDetails?.subtitle}
        </p>
        <p className="prose prose-indigo prose-sm md:prose-base mb-6">
          {studentCourseDetails?.description}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            <strong>Instructor:</strong> {studentCourseDetails?.instructorName}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            <strong>Created:</strong> {studentCourseDetails?.date.split("T")[0]}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full flex items-center">
            <Globe className="mr-1 h-4 w-4 text-indigo-200 animate-pulse" />
            <strong>{studentCourseDetails?.primaryLanguage}</strong>
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            <strong>Enrolled:</strong> {studentCourseDetails?.students.length}{" "}
            {studentCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>

      {/* Objectives card */}
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-1 space-y-8">
          <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-md">
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
                    className="flex items-start space-x-2 hover:text-indigo-600 transition-colors"
                  >
                    <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                    <span>{obj.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="px-6 py-4 border-b">
              <CardTitle className="text-2xl font-bold">
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <ul>
                {studentCourseDetails?.curriculum.map((lesson, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center p-2 rounded-lg ${
                      lesson.freePreview
                        ? "hover:bg-indigo-50 cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    } transition-colors relative`}
                  >
                    {lesson.freePreview ? (
                      <PlayCircleIcon className="mr-3 h-5 w-5 text-indigo-500 animate-pulse" />
                    ) : (
                      <>
                        <LockIcon className="mr-3 h-5 w-5 text-gray-400" />
                        {/* Lock overlay */}
                        <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-30 rounded-lg" />
                      </>
                    )}
                    <span className="relative z-10">{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>

        {/* — Sidebar */}
        <aside className="w-full lg:w-96 space-y-6 sticky top-4 self-start">
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold">
                  ${studentCourseDetails?.pricing}
                </span>
              </div>
              <Button
                className="w-full py-3 text-lg font-semibold"
                variant="secondary"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={setShowFreePreviewDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentCourseDetails;
