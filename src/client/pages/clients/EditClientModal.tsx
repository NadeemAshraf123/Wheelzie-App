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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Client</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>

        <div className="flex flex-col items-center mb-4">
          <img src={previewImage || "/placeholder-user.png"} className="w-20 h-20 rounded-full object-cover border" />
          
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImagePreview}
            className="mt-2 text-sm"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("name", { required: true })} className="w-full border p-2 rounded" />
          <input {...register("email", { required: true })} className="w-full border p-2 rounded" />
          <input {...register("phone", { required: true })} className="w-full border p-2 rounded" />
          <textarea {...register("address", { required: true })} className="w-full border p-2 rounded"></textarea>
          <input {...register("document_name", { required: true })} className="w-full border p-2 rounded" />
          <input type="number" {...register("points")} className="w-full border p-2 rounded" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
