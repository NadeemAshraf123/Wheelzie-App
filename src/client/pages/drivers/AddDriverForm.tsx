import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import {
  addDriver,
  selectDriversStatus,
  selectDriversError,
} from "../../../features/DriversSlice";

type DriverFormData = {
  name: string;
  email: string;
  phone: string;
  status: string;
  profileImage: FileList;
};

interface AddDriverFormProps {
  onClose: () => void;
}

const AddDriverForm: React.FC<AddDriverFormProps> = ({ onClose }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const status = useAppSelector(selectDriversStatus);
  const error = useAppSelector(selectDriversError);

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
    },
  });

  const onSubmit = async (data: DriverFormData) => {
    const resultAction = await dispatch(addDriver(data));
    if (addDriver.fulfilled.match(resultAction)) {
      reset();
      onClose();
    } else {
      alert(
        `Failed to add driver: ${
          resultAction.payload || resultAction.error.message
        }`
      );
    }
  };

  return (
    <div className="bg-white rounded-xl w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 text-left mb-4">
        Add New Driver
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="file"
          id="driver-image-upload"
          accept="image/*"
          {...register("profileImage", {
            required: "Profile image is required",
            validate: {
              fileSize: (files) =>
                files?.[0]?.size <= 2 * 1024 * 1024 ||
                "Image must be 2MB or smaller",
              fileType: (files) =>
                ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
                  files?.[0]?.type
                ) || "Only JPEG, PNG, and GIF images are allowed",
            },
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
              }
            },
          })}
          className="hidden"
        />

        <label htmlFor="driver-image-upload" className="block cursor-pointer">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden hover:border-blue-500 transition">
            {preview ? (
              <img
                src={preview}
                alt="Selected driver"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500 text-sm text-center">
                Click to upload driver image
              </span>
            )}
          </div>
        </label>

        {errors.profileImage && (
          <p className="text-red-500 text-xs mt-1">
            {errors.profileImage.message as string}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John Adams"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-blue-500">*</span>
          </label>
          <input
            type="email"
            placeholder="john.adams@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone No. <span className="text-blue-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="111-222-3333"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\d{3}-\d{3}-\d{5}$/,
                message:
                  "Phone must be in format: 111-222-33333 (11 digits total)",
              },
              validate: {
                positive: (value) => {
                  const numbersOnly = value.replace(/-/g, "");
                  return (
                    !numbersOnly.startsWith("-") ||
                    "Phone number cannot be negative"
                  );
                },
                exactLength: (value) => {
                  const numbersOnly = value.replace(/-/g, "");
                  return (
                    numbersOnly.length === 11 ||
                    "Phone number must be exactly 11 digits"
                  );
                },
              },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">

            Status <span className="text-blue-500">*</span>
          </label>
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

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Adding...
              </>
            ) : (
              "Add Driver"
            )}
          </button>
        </div>

        {status === "failed" && error && (
          <p className="text-red-500 text-sm mt-2">Error: {error}</p>
        )}
      </form>
    </div>
  );
};

export default AddDriverForm;
