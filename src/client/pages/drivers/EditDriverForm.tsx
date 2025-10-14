import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Updated schema to match backend
const driverSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.enum(["On Duty", "Half-Day Leave", "Sick Leave", "Off Duty"]),
  total_hours: z.coerce.number().min(0, "Total hours must be 0 or more"),
  total_trips: z.coerce.number().min(0, "Total trips must be 0 or more"),
  performance_rating: z.coerce
    .number()
    .min(0, "Min is 0")
    .max(5, "Max is 5"),
  profileImage: z
    .any()
    .optional()
    .refine(
      (files) => !files?.length || files[0]?.size <= 2 * 1024 * 1024,
      "Image must be 2MB or smaller"
    ),
});

type DriverFormData = z.infer<typeof driverSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driver.name || "",
      email: driver.email || "",
      phone: driver.phone || "",
      status: driver.status || "On Duty",
      total_hours: driver.total_hours ?? 0,
      total_trips: driver.total_trips ?? 0,
      performance_rating: driver.performance_rating ?? 0,
    },
  });

  const handleFormSubmit = (data: DriverFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("status", data.status);
    formData.append("total_hours", data.total_hours.toString());
    formData.append("total_trips", data.total_trips.toString());
    formData.append("performance_rating", data.performance_rating.toString());

    if (data.profileImage && data.profileImage.length > 0) {
      formData.append("profile_image", data.profileImage[0]);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Driver</h2>

      <div>
        <label className="block text-sm font-medium">Profile Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("profileImage")}
          className="w-full text-sm"
        />
        {errors.profileImage && (
          <p className="text-red-500 text-sm">{errors.profileImage.message}</p>
        )}
      </div>

      <div>
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
        <input
          type="text"
          {...register("phone")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Phone Number"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div>
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

      <div>
        <input
          type="number"
          {...register("total_hours")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Total Hours"
        />
        {errors.total_hours && (
          <p className="text-red-500 text-sm">{errors.total_hours.message}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          {...register("total_trips")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Total Trips"
        />
        {errors.total_trips && (
          <p className="text-red-500 text-sm">{errors.total_trips.message}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          step="0.1"
          {...register("performance_rating")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Performance Rating (0–5)"
        />
        {errors.performance_rating && (
          <p className="text-red-500 text-sm">
            {errors.performance_rating.message}
          </p>
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
