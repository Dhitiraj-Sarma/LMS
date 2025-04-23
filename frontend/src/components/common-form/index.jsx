import { Button } from "../ui/button";

function CommonForm({ handleSubmit, buttonText }) {
  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit">{buttonText || "Submit"}</Button>
    </form>
  );
}

export default CommonForm;
