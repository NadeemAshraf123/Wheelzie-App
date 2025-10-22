import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Api_BASE_URL } from "../../../utils/config";

type CarFormData = {
  name: string;
  model_type: string;
  license_plate: string;
  daily_rate: number;
  image?: FileList;
};

interface AddCarFormProps {
  onClose: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onClose }) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: {
      name: "",
      model_type: "",
      license_plate: "",
      daily_rate: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      const url = `${Api_BASE_URL}/cars/`;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("model_type", data.model_type);
      formData.append("license_plate", data.license_plate);
      formData.append("daily_rate", data.daily_rate.toString());

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: { "ngrok-skip-browser-warning": "true" },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add car");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["cars"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Add car failed:", error);
      alert(`Failed to add car: ${error?.message ?? error}`);
    },
  });


 

  const onSubmit = (data: CarFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-left mb-4">
        Add New Car
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
     
        <input
          type="file"
          id="car-image-upload"
          accept="image/*"
          {...register("image", {
            validate: (files) =>
              !files?.length ||
              files[0].size <= 2 * 1024 * 1024 ||
              "Image must be 2MB or smaller",
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

        <label htmlFor="car-image-upload" className="block cursor-pointer">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden hover:border-blue-500 transition">
            {preview ? (
              <img
                src={preview}
                alt="Selected car"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <span className="text-gray-500 text-center">Click to upload car image</span>
            )}
          </div>
        </label>

        {errors.image && (
          <p className="text-red-500 text-xs mt-1">
            {errors.image.message as string}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Car Name <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Toyota Corolla"
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
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Model
            <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            placeholder="2025"
            {...register("model_type")}
            className="w-full border rounded-lg p-2 outline-none border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Plate
            <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            placeholder="ABC-123"
            {...register("license_plate")}
            className="w-full border rounded-lg p-2 outline-none border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Daily Rate
            <span className="text-blue-500">*</span>
          </label>
          <input
            type="number"
            {...register("daily_rate", { min: 0 })}
            className="w-full border rounded-lg p-2 outline-none border-gray-300"
          />
        </div>

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
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700 flex items-center"
          >
            {mutation.isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Adding...
              </>
            ) : (
              "Add Car"
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

export default AddCarForm;
