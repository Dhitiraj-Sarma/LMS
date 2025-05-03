import MediaProgressBar from "@/components/media-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseCurriculumPage() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumFormData[0],
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleNewLecture}>Add Lecture</Button>
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
                    <Button>Replace Video</Button>
                    <Button className="bg-red-900">Delete Lecture</Button>
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
