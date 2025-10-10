import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
      const url = "https://1fc9b9ba03e4.ngrok-free.app/cars/";

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
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add car");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
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
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Add New Car
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Car Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", {
              validate: (files) =>
                !files?.length ||
                files[0].size <= 2 * 1024 * 1024 ||
                "Image must be 2MB or smaller",
            })}
            className="block w-full text-sm"
          />
          {errors.image && (
            <p className="text-red-500 text-xs">{errors.image.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Car Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Toyota Corolla"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            placeholder="2025"
            {...register("model_type")}
            className="w-full border rounded-lg p-2 outline-none border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">License Plate</label>
          <input
            type="text"
            placeholder="ABC-123"
            {...register("license_plate")}
            className="w-full border rounded-lg p-2 outline-none border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
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
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center"
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
