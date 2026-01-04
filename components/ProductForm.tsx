'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/components/ToastProvider';

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { _id?: string };
  mode: 'create' | 'edit';
}

const steps = [
  { id: 1, name: 'Basic Information', icon: '📝' },
  { id: 2, name: 'Pricing & Inventory', icon: '💰' },
  { id: 3, name: 'Images', icon: '🖼️' },
];

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      category: initialData?.category || '',
      sku: initialData?.sku || '',
      brand: initialData?.brand || '',
      sales: initialData?.sales || 0,
      images: initialData?.images || [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      console.log('🔄 Mutation function called with data:', data);
      
      const url = mode === 'create' ? '/api/products' : `/api/products/${initialData?._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      console.log(`📡 Making ${method} request to ${url}`);
      
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        console.log('📥 Response status:', res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error('❌ API Error:', errorData);
          throw new Error(errorData.error || errorData.message || 'Failed to save product');
        }

        const result = await res.json();
        console.log('✅ API Success:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Fetch error:', error);
        throw error;
      }
    },
    onSuccess: async (createdProduct) => {
      try {
        console.log('✅ Product created successfully:', createdProduct);
        
        toast.showToast(
          `Product "${createdProduct.name || 'Product'}" ${mode === 'create' ? 'created' : 'updated'} successfully!`,
          'success'
        );
        
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 1000);
      } catch (error) {
        console.error('❌ Error in onSuccess:', error);
        router.push('/admin/products');
      }
    },
    onError: (error) => {
      console.error('Product creation error:', error);
      toast.showToast(error.message || 'Failed to save product', 'error');
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const newImages = [...images, data.url];
      setImages(newImages);
      setValue('images', newImages);
      toast.showToast('Image uploaded successfully', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      toast.showToast(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
    toast.showToast('Image removed', 'info');
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log('📝 Form validation passed, data:', data);
      
      const formData = { ...data, images: images || [] };
      
      console.log('🚀 Submitting product data:', formData);
      mutation.mutate(formData);
    } catch (error: unknown) {
      console.error('❌ Error in onSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form. Please check the console for details.';
      alert(errorMessage);
    }
  };

  const onError = (errors: any) => {
    console.error('❌ Form validation errors:', errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h1>
        <p className="text-gray-600">Fill in the details to {mode === 'create' ? 'add' : 'update'} your product</p>
      </div>

      {/* Enhanced Step Indicator */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`flex-1 ${stepIdx !== steps.length - 1 ? 'pr-4' : ''} relative`}>
                <div className="flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'border-primary-600 bg-gradient-to-br from-primary-500 to-purple-500 shadow-lg scale-110'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`text-lg ${currentStep >= step.id ? 'text-white' : 'text-gray-400'}`}>
                          {step.icon}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-3 text-sm font-medium text-center ${
                        currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-gray-300'
                    }`}
                    style={{ marginLeft: '24px' }}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form Card */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === steps.length) {
            handleSubmit(onSubmit, onError)(e);
          }
        }} 
        className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
        {/* Step Content */}
        <div className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Enter the fundamental details about your product</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200 resize-none"
                    placeholder="Describe your product in detail (minimum 10 characters)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('category')}
                    type="text"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200"
                    placeholder="e.g., Electronics"
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    {...register('brand')}
                    type="text"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200"
                    placeholder="e.g., Apple, Samsung"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="sku" className="block text-sm font-semibold text-gray-700 mb-2">
                    SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('sku')}
                    type="text"
                    placeholder="e.g., PROD-001"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border uppercase transition-all duration-200"
                    onChange={(e) => setValue('sku', e.target.value.toUpperCase())}
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.sku.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Use uppercase letters, numbers, and hyphens only</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Inventory */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Inventory</h2>
                <p className="text-gray-600">Set the price and stock information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold">$</span>
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm pl-10 pr-4 py-3 border transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('stock', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {mode === 'edit' && (
                  <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <label htmlFor="sales" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sales Count
                    </label>
                    <input
                      {...register('sales', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm px-4 py-3 border transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Images</h2>
                <p className="text-gray-600">Upload images for your product (optional)</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors duration-200 bg-gray-50">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </label>
              </div>

              {images.length === 0 && !uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    No images uploaded. You can add images later or skip this step.
                  </p>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-colors duration-200">
                        <Image
                          src={url}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.images.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            ← Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('🖱️ Create Product button clicked');
                handleSubmit(onSubmit, onError)();
              }}
              disabled={mutation.isPending}
              className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {mutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">✅</span>
                  {mode === 'create' ? 'Create Product' : 'Update Product'}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Status Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mx-8 mb-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <strong>Please fix the following errors:</strong>
            </div>
            <ul className="mt-2 list-disc list-inside ml-6">
              {Object.entries(errors).map(([field, error]: [string, any]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message || 'Invalid value'}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mutation.isError && (
          <div className="mx-8 mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <strong>Error:</strong> {mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}
            </div>
            <p className="mt-1 text-sm">Please check the browser console (F12) for more details.</p>
          </div>
        )}
        
        {mutation.isSuccess && (
          <div className="mx-8 mb-6 bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <strong>Success!</strong> Product {mode === 'create' ? 'created' : 'updated'} successfully! Redirecting...
            </div>
          </div>
        )}

        {mutation.isPending && (
          <div className="mx-8 mb-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <strong>Saving product...</strong> Please wait.
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
