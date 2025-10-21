import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditDriverFormProps {
  driver: any;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const EditDriverForm: React.FC<EditDriverFormProps> = ({
  driver,
  onClose,
  onSubmit,
}) => {

  const [previewImage, setPreviewImage] = useState<string | null>(driver.profile_image || null);
  const [hasImage, setHasImage] = useState<boolean>(!!driver.profile_image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setHasImage(true);
    }
  };

  // Create schema inside component to access driver prop
  const driverSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{5}$/, "Phone must be in format: 111-222-33333 (11 digits total)"),
    status: z.enum(["On Duty", "Half-Day Leave", "Sick Leave", "Off Duty"]),
    profileImage: z
      .any()
      .refine(
        (files) => files?.length > 0 || hasImage,
        "Profile image is required"
      )
      .refine(
        (files) => !files?.length || files[0]?.size <= 2 * 1024 * 1024,
        "Image must be 2MB or smaller"
      )
      .refine(
        (files) => !files?.length || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(files[0]?.type),
        "Only JPEG, PNG, and GIF images are allowed"
      ),
  });

  type DriverFormData = z.infer<typeof driverSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driver.name || "",
      email: driver.email || "",
      phone: driver.phone || "",
      status: driver.status || "On Duty",
    },
  });

  const handleFormSubmit = (data: DriverFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("status", data.status);

    if (data.profileImage && data.profileImage.length > 0) {
      formData.append("profile_image", data.profileImage[0]);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Driver</h2>

      {/* <div>
        {(previewImage || driver.profile_image) && (
          <img
            src={previewImage || driver.profile_image}
            className="w-24 h-24 rounded-full object-cover mb-3 mx-auto mt-2 border"
            alt="Driver profile"
          />
        )}

        <label className="block text-sm font-medium">
          Profile Image <span className="text-blue-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("profileImage", {
            onChange: handleImageChange,
          })}
          className="w-full text-sm"
        />

        {errors.profileImage && (
          <p className="text-red-500 text-sm">{errors.profileImage.message}</p>
        )}
      </div> */}

      <input
  type="file"
  id="driver-image-upload"
  accept="image/*"
  {...register("profileImage", {
    onChange: handleImageChange,
  })}
  className="hidden"
/>

<label
  htmlFor="driver-image-upload"
  className="cursor-pointer block w-fit mx-auto"
>
  <img
    src={previewImage || "/placeholder-driver.png"}
    alt="Click to select image"
    className="w-24 h-24 object-cover rounded-full border-2 border-gray-400 hover:opacity-80 transition"
  />
</label>

{errors.profileImage && (
  <p className="text-red-500 text-sm text-center mt-1">
    {errors.profileImage.message}
  </p>
)}


      <div>
        <label className="block text-sm font-medium">
          Name <span className="text-blue-500">*</span>
        </label>
        <input
          type="text"
          {...register("name")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Driver Name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Email <span className="text-blue-500">*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Phone Number <span className="text-blue-500">*</span>
        </label>
        <input
          type="text"
          {...register("phone")}
          className="w-full border px-3 py-2 rounded"
          placeholder="111-222-33333"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="On Duty">On Duty</option>
          <option value="Half-Day Leave">Half-Day Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Off Duty">Off Duty</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditDriverForm;