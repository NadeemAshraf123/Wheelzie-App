import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useAppDispatch } from "../../../app/store";
import { updateClient } from "../../../features/ClientsSlice";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  image?: string | null;
  profile_image?: string | null;
}

interface Props {
  client: Client;
  onClose: () => void;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  image?: FileList;
};

const EditClientModal: React.FC<Props> = ({ client, onClose }) => {
  const dispatch = useAppDispatch();
  const [previewImage, setPreviewImage] = useState<string | null>(
    client.image || client.profile_image || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      document_name: client.document_name || "",
      points: client.points ?? 0,
    },
  });

  useEffect(() => {
    setValue("name", client.name);
    setValue("email", client.email);
    setValue("phone", client.phone);
    setValue("address", client.address);
    setValue("document_name", client.document_name || "");
    setValue("points", client.points ?? 0);
  }, [client, setValue]);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("document_name", values.document_name);
    formData.append("points", String(values.points ?? 0));

    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }

    dispatch(updateClient({ id: client.id, formData }));
    onClose();
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Client</h3>
          <button onClick={onClose} className=" cursor-pointer font-extrabold hover:text-gray-700">
            <X />
          </button>
        </div>

        <input
          type="file"
          id="client-image-upload"
          accept="image/*"
          {...register("image", {
            onChange: handleImagePreview,
          })}
          className="hidden"
        />

        <label htmlFor="client-image-upload" className="cursor-pointer block w-fit mb-4">
          <img
            src={previewImage || "/placeholder-user.png"}
            alt="Click to select image"
            className="w-20 h-20 object-cover rounded-full border-2 border-gray-400 hover:opacity-80 transition"
          />
        </label>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Full Name <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full border text-gray-500 p-2 rounded"
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Email <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              className="w-full text-gray-500 border p-2 rounded"
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Phone Number <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^\d{3}-\d{3}-\d{5}$/,
                  message: "Phone must be in format: 111-222-33333",
                },
                validate: {
                  positive: (value) => {
                    const numbersOnly = value.replace(/-/g, "");
                    return !numbersOnly.startsWith("-") || "Phone number cannot be negative";
                  },
                  exactLength: (value) => {
                    const numbersOnly = value.replace(/-/g, "");
                    return numbersOnly.length === 11 || "Phone number must be exactly 11 digits";
                  },
                },
              })}
              onChange={(e) => {
                register("phone").onChange(e);
                handlePhoneChange(e);
              }}
              className="w-full text-gray-500 border p-2 rounded"
              placeholder="111-222-33333"
            />
            {errors.phone && <p className="text-blue-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Address <span className="text-blue-500">*</span>
            </label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full border text-gray-500 p-2 rounded"
              placeholder="Enter full address"
            ></textarea>
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">
              Document Name <span className="text-blue-500">*</span>
            </label>
            <input
              {...register("document_name", { required: "Document Name is required" })}
              className="w-full border text-gray-500 p-2 rounded"
              placeholder="Enter document name"
            />
            {errors.document_name && (
              <p className="text-red-500 text-xs">{errors.document_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Points <span className="text-blue-500">*</span></label>
            <input
              type="number"
              {...register("points")}
              className="w-full border p-2 text-gray-500 rounded"
              placeholder="Enter points"
            />
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 cursor-pointer rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 cursor-pointer bg-blue-600 text-white rounded"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
