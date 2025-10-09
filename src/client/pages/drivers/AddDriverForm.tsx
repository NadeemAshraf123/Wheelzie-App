import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type DriverFormData = {
  name: string;
  email: string;
  phone: string;
  status: string;
  total_hours: number;
  total_trips: number;
  performance_rating: number;
  profileImage?: FileList;
};

interface AddDriverFormProps {
  onClose: () => void;
}

const AddDriverForm: React.FC<AddDriverFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "On Duty",
      total_hours: 0,
      total_trips: 0,
      performance_rating: 0,
    },
  });



  // Mutation: POST request using React Query
  const mutation = useMutation({
    mutationFn: async (data: DriverFormData) => {
      const url = "https://3d00fd53f473.ngrok-free.app/drivers/";

   const formData = new FormData();
formData.append("name", data.name);
formData.append("email", data.email);
formData.append("phone", data.phone);
formData.append("status", data.status);
formData.append("total_hours", data.total_hours.toString());
formData.append("total_trips", data.total_trips.toString());
formData.append("performance_rating", data.performance_rating.toString());

if (data.profileImage && data.profileImage.length > 0) {
  formData.append("profile_image", data.profileImage[0]); // 👈 Actual file
}

const res = await fetch(url, {
  method: "POST",
  body: formData, // 👈 No need to set headers, fetch handles it
});


      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add driver");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["drivers"]);
      reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Add driver failed:", error);
      alert(`Failed to add driver: ${error?.message ?? error}`);
    },
  });

  const onSubmit = (data: DriverFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Add New Driver
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profileImage", {
              validate: (files) =>
                !files?.length ||
                files[0].size <= 2 * 1024 * 1024 ||
                "Image must be 2MB or smaller",
            })}
            className="block w-full text-sm"
          />
          {errors.profileImage && (
            <p className="text-red-500 text-xs">
              {errors.profileImage.message as string}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John Adams"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="john.adams@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone No. <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="111-222-3333"
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9-]+$/, message: "Invalid phone format" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register("status", { required: "Status is required" })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="On Duty">On Duty</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Off Duty">Off Duty</option>
          </select>
        </div>

        {/* Total Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Hours
          </label>
          <input
            type="number"
            {...register("total_hours", {
              required: "Total hours required",
              min: { value: 0, message: "Cannot be negative" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.total_hours ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.total_hours && (
            <p className="text-red-500 text-xs">{errors.total_hours.message}</p>
          )}
        </div>

        {/* Total Trips */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Trips
          </label>
          <input
            type="number"
            {...register("total_trips", {
              required: "Total trips required",
              min: { value: 0, message: "Cannot be negative" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.total_trips ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.total_trips && (
            <p className="text-red-500 text-xs">{errors.total_trips.message}</p>
          )}
        </div>

        {/* Performance Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Performance Rating (0–5)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("performance_rating", {
              required: "Performance rating required",
              min: { value: 0, message: "Min is 0" },
              max: { value: 5, message: "Max is 5" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.performance_rating ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.performance_rating && (
            <p className="text-red-500 text-xs mt-1">
              {errors.performance_rating.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Adding...
              </>
            ) : (
              "Add Driver"
            )}
          </button>
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            Error: {(mutation.error as Error)?.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddDriverForm;
