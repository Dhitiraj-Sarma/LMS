function formControls({ formControls = [], formData, setFormData }) {
  function renderComponent() {}

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}></div>
      ))}
    </div>
  );
}

export default formControls;
