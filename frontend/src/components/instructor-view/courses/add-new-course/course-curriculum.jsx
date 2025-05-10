import MediaProgressBar from "@/components/media-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { InstructorContext } from "@/context/instructor-context";
import {
  bulkMediaUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculumPage() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        title: "",
        freePreview: false,
        videoUrl: "",
        public_id: "",
      },
    ]);
  }

  function handleCourseTitleChange(e, index) {
    let copy = [...courseCurriculumFormData];

    copy[index] = {
      ...copy[index],
      title: e.target.value,
    };

    setCourseCurriculumFormData(copy);
  }

  function handleFreePreviewChnage(currentValue, currentIndex) {
    let copy = [...courseCurriculumFormData];

    copy[currentIndex] = {
      ...copy[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(copy);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const res = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (res.success) {
          let copy = [...courseCurriculumFormData];
          copy[currentIndex] = {
            ...copy,
            videoUrl: res?.data?.url,
            public_id: res?.data?.public_id,
          };
          setCourseCurriculumFormData(copy);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title?.trim() !== "" &&
        item.videoUrl?.trim() !== ""
      );
    });
  }

  async function handleReplaceVideo(currentIndex) {
    let copy = [...courseCurriculumFormData];
    const getCUrrentVideoPublicId = copy[currentIndex].public_id;
    const deleteCurrentMediaResponde = await mediaDeleteService(
      getCUrrentVideoPublicId
    );

    if (deleteCurrentMediaResponde?.success) {
      copy[currentIndex] = {
        ...copy[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(copy);
    }
  }

  function handleOpenBulkUpload() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) =>
      Object.values(obj).every(
        (value) =>
          (typeof value === "boolean" && !value) || // Consider boolean values as non-empty
          value === "" ||
          value === null ||
          value === undefined
      )
    );
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const bulkFormData = new FormData();
    selectedFiles.forEach((file) => bulkFormData.append("files", file));

    try {
      setMediaUploadProgress(true);
      setMediaUploadProgressPercentage(0);

      const res = await bulkMediaUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (res?.success) {
        const currentItems = courseCurriculumFormData.filter(
          (item) => !areAllCourseCurriculumFormDataObjectsEmpty([item])
        );

        const baseIndex = currentItems.length;

        const newItems =
          res.data?.map((item, index) => ({
            videoUrl: item.url,
            public_id: item.public_id,
            title: `Lecture ${baseIndex + index + 1}`,
            freePreview: false,
          })) || [];

        setCourseCurriculumFormData([...currentItems, ...newItems]);
      }
    } catch (error) {
      console.error("Bulk upload failed:", error);
    } finally {
      setMediaUploadProgress(false);
      setMediaUploadProgressPercentage(0);
      event.target.value = "";
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let copy = [...courseCurriculumFormData];
    const getCUrrentVideoPublicId = copy[currentIndex].public_id;
    const res = await mediaDeleteService(getCUrrentVideoPublicId);

    if (res?.success) {
      copy = copy.filter((_, index) => index !== currentIndex);
      setCourseCurriculumFormData(copy);
    }
  }
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        <div className="p-4">
          {mediaUploadProgress ? (
            <MediaProgressBar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
        </div>
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculum, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(e) => handleCourseTitleChange(e, index)}
                  value={curriculum.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChnage(value, index)
                    }
                    checked={curriculum.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {curriculum?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={curriculum?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculumPage;
