import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Api_BASE_URL } from '../../../utils/config';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  profile_image?: string | null; 
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
  profile_image?: FileList; 
};

// const API_URL = 'https://1fc9b9ba03e4.ngrok-free.app/clients/';

interface Props {
  client: Client;
  onClose: () => void;
}

const updateClient = async (client: any): Promise<Client> => {

useEffect(()=>{
  console.log("baseurl", Api_BASE_URL);


}, []);


const res = await fetch(`${Api_BASE_URL}/clients/${client.id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    body: JSON.stringify(client),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to update client');
  }
  return res.json();
};

const EditClientModal: React.FC<Props> = ({ client, onClose }) => {

  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(client.profile_image || null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      document_name: client.document_name || '',
      points: client.points ?? 0,
    },
  });

  useEffect(() => {
    setValue('name', client.name);
    setValue('email', client.email);
    setValue('phone', client.phone);
    setValue('address', client.address);
    setValue('document_name', client.document_name || '');
    setValue('points', client.points ?? 0);
  }, [client, setValue]);

  
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: any) => updateClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      onClose();
    },
    onError: (err: any) => {
      console.error('Update failed:', err);
      alert('Failed to update client: ' + (err?.message || 'Unknown error'));
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload: Client = {
      id: client.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      document_name: values.document_name,
      points: values.points ?? 0,
      profile_image: client.profile_image || null, 
    };

    mutation.mutate(payload);
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
          <img
            src={previewImage || "/placeholder-user.png"}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            {...register('profile_image')}
            onChange={handleImagePreview}
            className="mt-2 text-sm"
          />
          <p className="text-xs text-gray-400">*Image upload will activate once backend supports it</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
              className={`w-full border rounded-lg p-2 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
              className={`w-full border rounded-lg p-2 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^[0-9-]+$/, message: 'Invalid phone format' },
                minLength: { value: 7, message: 'Phone too short' },
              })}
              className={`w-full border rounded-lg p-2 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              {...register('address', { required: 'Address is required', minLength: { value: 10, message: 'Address too short' } })}
              rows={3}
              className={`w-full border rounded-lg p-2 outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Documents (comma separated)</label>
            <input
              {...register('document_name', { required: 'At least one document is required' })}
              className={`w-full border rounded-lg p-2 outline-none ${errors.document_name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.document_name && <p className="text-red-500 text-xs mt-1">{errors.document_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Points</label>
            <input
              type="number"
              {...register('points', { valueAsNumber: true, min: { value: 0, message: 'Points cannot be negative' } })}
              className={`w-full border rounded-lg p-2 outline-none ${errors.points ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting || mutation.isLoading} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
              {mutation.isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;
