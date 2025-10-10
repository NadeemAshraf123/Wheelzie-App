import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const driverSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.enum(
    ["On Duty", "Off Duty", "Sick Leave"],
    "Invalid status selected"
  ),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface EditDriverFormProps {
  driver: any;
  onClose: () => void;
  onSubmit: (data: DriverFormData) => void;
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
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      status: driver.status,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Driver</h2>

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
          <option value="Off Duty">Off Duty</option>
          <option value="Sick Leave">Sick Leave</option>
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
