import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettingsPage() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      const ImageFormData = new FormData();
      ImageFormData.append("file", selectedImage);

      try {
        const res = await mediaUploadService(ImageFormData);
        if (res.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: res.data.url,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="mb-4"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettingsPage;
