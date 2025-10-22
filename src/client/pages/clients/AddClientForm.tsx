import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import type { AppDispatch } from "../../../app/store";
import { createClient } from "../../../features/ClientsSlice";
import toast from "react-hot-toast";
import { file } from "zod";

type ClientFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  image: FileList;
};

interface AddClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onClose: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onClose }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      document_name: "",
      points: 0,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (!data.image || data.image.length === 0) {
        toast.error("Profile image is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("document_name", data.document_name);
      formData.append("points", data.points.toString());

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const resultAction = await dispatch(createClient(formData));

      if (createClient.fulfilled.match(resultAction)) {
        toast.success("Client added successfully!");
        reset();
        onClose();
        navigate("/clients");
      } else {
        toast.error("Failed to add client");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Add client failed:", error);
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white rounded-lg max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-xl font-semibold">Add New Client</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <input
            type="file"
            id="client-image-upload"
            accept="image/*"
            {...register("image", {
              required: "Profile image is required",
              validate: {
                fileSize: (files) =>
                  files?.[0]?.size <= 2 * 1024 * 1024 ||
                  "Image must be 2MB or smaller",
                fileType: (files) =>
                  [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                  ].includes(files?.[0]?.type) ||
                  "Only JPEG, PNG, and GIF images are allowed",
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

          <label htmlFor="client-image-upload" className="block cursor-pointer">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden hover:border-blue-500 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Selected client"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 text-center text-sm">
                  Click to upload client image
                </span>
              )}
            </div>
          </label>

          {errors.image && (
            <p className="text-red-500 text-xs mt-1">
              {errors.image.message as string}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium ">
              Full Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Email <span className="text-blue-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium ">
              Phone <span className="text-blue-500">*</span>
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{3}-\d{3}-\d{5}$/,
                  message: "Phone must be in format: 111-222-33333",
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
              placeholder="111-222-33333"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Address <span className="text-blue-500">*</span>
            </label>
            <textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
              rows={3}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Document Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              {...register("document_name", {
                required: "Document name is required",
                minLength: {
                  value: 2,
                  message: "Document name must be at least 2 characters",
                },
              })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.document_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter document name"
            />
            {errors.document_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.document_name.message}
              </p>
            )}
          </div>

          
          <div>
            <label className="block text-sm font-medium">
              Points<span className="text-blue-500">*</span>
            </label>
            <input
              type="number"
              {...register("points", {
                min: {
                  value: 0,
                  message: "Points cannot be negative",
                },
                valueAsNumber: true,
              })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.points ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter points"
            />
            {errors.points && (
              <p className="text-red-500 text-xs mt-1">
                {errors.points.message}
              </p>
            )}
          </div>

        
          <div className="flex justify-end pt-4 ">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : null}
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientForm;
