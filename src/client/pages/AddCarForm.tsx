import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Car {
  id: number;
  name: string;
  model_type: string;
  license_plate: string;
  daily_rate: number;
}

interface CarFormData {
  name: string;
  model_type: string;
  license_plate: string;
  daily_rate: string;
}

interface AddCarFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CarFormData>();

  const addCarMutation = useMutation({
    mutationFn: async (carData: Omit<Car, 'id'>) => {
      console.log('Sending car data:', carData);
      
      const response = await fetch('https://3d00fd53f473.ngrok-free.app/cars/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      return result;
    },
    onSuccess: () => {
      console.log('Car added successfully');
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      reset();
      onClose();
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
    },
  });

  const onSubmit = (data: CarFormData) => {
    console.log('Form submitted with data:', data);
    const carData = {
      ...data,
      daily_rate: parseFloat(data.daily_rate),
    };
    console.log('Parsed car data:', carData);
    addCarMutation.mutate(carData);
  };

  const handleClose = () => {
    console.log('Closing modal');
    reset();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Car</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Car Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Car name is required',
                minLength: {
                  value: 2,
                  message: 'Car name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Car name must be less than 50 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Toyota Camry"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Model Type Field */}
          <div>
            <label htmlFor="model_type" className="block text-sm font-medium text-gray-700 mb-2">
              Model Type *
            </label>
            <input
              id="model_type"
              type="text"
              {...register('model_type', {
                required: 'Model type is required',
                minLength: {
                  value: 2,
                  message: 'Model type must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Model type must be less than 50 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.model_type ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Sedan, SUV, Truck"
            />
            {errors.model_type && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.model_type.message}
              </p>
            )}
          </div>

          {/* License Plate Field */}
          <div>
            <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700 mb-2">
              License Plate *
            </label>
            <input
              id="license_plate"
              type="text"
              {...register('license_plate', {
                required: 'License plate is required',
                pattern: {
                  value: /^[A-Z0-9-]+$/i,
                  message: 'License plate can only contain letters, numbers, and hyphens',
                },
                minLength: {
                  value: 3,
                  message: 'License plate must be at least 3 characters',
                },
                maxLength: {
                  value: 15,
                  message: 'License plate must be less than 15 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                errors.license_plate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., ABC-123"
            />
            {errors.license_plate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.license_plate.message}
              </p>
            )}
          </div>

          {/* Daily Rate Field */}
          <div>
            <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Rate ($) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="daily_rate"
                type="number"
                step="0.01"
                min="0"
                {...register('daily_rate', {
                  required: 'Daily rate is required',
                  min: {
                    value: 0.01,
                    message: 'Daily rate must be greater than 0',
                  },
                  max: {
                    value: 10000,
                    message: 'Daily rate must be less than $10,000',
                  },
                  validate: {
                    validNumber: (value) => 
                      !isNaN(parseFloat(value)) || 'Please enter a valid number',
                    decimalPlaces: (value) => 
                      /^\d+(\.\d{1,2})?$/.test(value) || 'Maximum 2 decimal places allowed'
                  }
                })}
                className={`w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.daily_rate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.daily_rate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.daily_rate.message}
              </p>
            )}
            {watch('daily_rate') && !errors.daily_rate && (
              <p className="mt-1 text-sm text-gray-500">
                ${parseFloat(watch('daily_rate') || '0').toFixed(2)} per day
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addCarMutation.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {addCarMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </div>
              ) : (
                'Add Car'
              )}
            </button>
          </div>

          {/* Mutation Error */}
          {addCarMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <strong className="font-bold">Error: </strong>
                <span className="ml-1">{(addCarMutation.error as Error).message}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCarForm;