import React, { useState, useEffect } from "react";

type Car = {
  id: number;
  name: string;
  model_type: string | null;
  license_plate: string;
  daily_rate: number | null;
  image?: string | null;
};

interface Props {
  car: Car;
  onClose: () => void;
  onSubmit: (data: Partial<Car> & { file?: File }) => void;
}

const EditCarForm: React.FC<Props> = ({ car, onClose, onSubmit }) => {
  
  const [previewImage, setPreviewImage] = useState<string | null>(car.image || null);

  const [formData, setFormData] = useState({
    name: car.name,
    model_type: car.model_type || "",
    license_plate: car.license_plate,
    daily_rate: car.daily_rate || 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "daily_rate" ? Number(value) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile)); 
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.license_plate.trim()) newErrors.license_plate = "License plate is required";
    if (formData.daily_rate === null || formData.daily_rate < 0)
      newErrors.daily_rate = "Daily rate must be 0 or more";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...formData, file: file || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-full border mx-auto mb-3"
        />
      )}

      <div>
        <label className="block font-medium mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div>
        <label className="block font-medium mb-1">Car Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Model</label>
        <input
          type="text"
          name="model_type"
          value={formData.model_type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">License Plate</label>
        <input
          type="text"
          name="license_plate"
          value={formData.license_plate}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${errors.license_plate ? "border-red-500" : ""}`}
        />
        {errors.license_plate && <p className="text-red-500 text-sm mt-1">{errors.license_plate}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Daily Rate</label>
        <input
          type="number"
          name="daily_rate"
          value={formData.daily_rate}
          onChange={handleChange}
          className={`w-full border px-3 py-2 rounded ${errors.daily_rate ? "border-red-500" : ""}`}
        />
        {errors.daily_rate && <p className="text-red-500 text-sm mt-1">{errors.daily_rate}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditCarForm;
