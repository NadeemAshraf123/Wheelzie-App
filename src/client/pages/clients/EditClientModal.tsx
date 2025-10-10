import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  document_name: string;
  points: number;
};

const API_URL = 'https://1fc9b9ba03e4.ngrok-free.app/clients/';

interface Props {
  client: Client;
  onClose: () => void;
}

const updateClient = async (client: Client): Promise<Client> => {
  const res = await fetch(`${API_URL}${client.id}/`, {
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
    // keep form in sync if client changes
    setValue('name', client.name);
    setValue('email', client.email);
    setValue('phone', client.phone);
    setValue('address', client.address);
    setValue('document_name', client.document_name || '');
    setValue('points', client.points ?? 0);
  }, [client, setValue]);

  const mutation = useMutation({
    mutationFn: (data: Client) => updateClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      onClose();
    },
    onError: (err: any) => {
      // show minimal feedback; you can enhance with toast
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
