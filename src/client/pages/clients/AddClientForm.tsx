import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import type { AppDispatch } from "../../../app/store";
import { createClient } from "../../../features/ClientsSlice";
import toast from "react-hot-toast";

type ClientFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  image?: FileList;
};

const AddClientForm: React.FC = () => {
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
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
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
        navigate("/clients"); // Navigate to clients page after success
      } else {
        toast.error("Failed to add client");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Add client failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button
            onClick={() => navigate("/clients")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="block w-full text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
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
              Email *
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
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone *
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9-]+$/,
                  message: "Invalid phone format",
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
              Address *
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              rows={3}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Name *
            </label>
            <input
              type="text"
              {...register("document_name", { required: "Document name is required" })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.document_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.document_name && (
              <p className="text-red-500 text-xs">{errors.document_name.message}</p>
            )}
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Points
            </label>
            <input
              type="number"
              {...register("points", {
                min: { value: 0, message: "Points cannot be negative" },
                valueAsNumber: true,
              })}
              className={`w-full border rounded-lg p-2 outline-none ${
                errors.points ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.points && (
              <p className="text-red-500 text-xs">{errors.points.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : null}
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientForm;