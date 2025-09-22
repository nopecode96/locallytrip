'use client';

import { useState } from 'react';
import { useExperienceTypes } from '@/hooks/useExperienceTypes';
import { ExperienceType } from '@/types/experienceType';
import AuthGuard from '@/components/AuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import IconRenderer from '@/components/IconRenderer';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface ExperienceTypeFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: ExperienceTypeFormData = {
  name: '',
  description: '',
  icon: '',
  color: '#3B82F6',
  imageUrl: '',
  isActive: true,
  sortOrder: 0,
};

// Available icon options for quick selection
const iconOptions = [
  { name: 'fa-heart', label: 'Heart/Love' },
  { name: 'fa-utensils', label: 'Food/Dining' },
  { name: 'fa-landmark', label: 'Culture/Heritage' },
  { name: 'fa-mountain', label: 'Adventure/Nature' },
  { name: 'fa-om', label: 'Spiritual' },
  { name: 'fa-camera', label: 'Photography' },
  { name: 'fa-camera-retro', label: 'Portrait' },
  { name: 'fa-rings-wedding', label: 'Wedding' },
  { name: 'fa-star', label: 'Premium/Featured' },
  { name: 'fa-palette', label: 'Art/Culture' },
  { name: 'fa-hiking', label: 'Hiking/Outdoor' },
  { name: 'fa-map-marked-alt', label: 'Planning/Custom' },
  { name: 'fa-route', label: 'Multi-destination' },
  { name: 'fa-calculator', label: 'Budget/Planning' },
  { name: '🎯', label: 'Target/Goal' },
  { name: '🎨', label: 'Art' },
  { name: '🏖️', label: 'Beach' },
  { name: '🌴', label: 'Tropical' },
  { name: '🛶', label: 'Water Sports' },
  { name: '🕉️', label: 'Spiritual/Meditation' },
  { name: '💍', label: 'Wedding/Romance' },
  { name: '📷', label: 'Photography Tours' }
];

export default function CategoriesPage() {
  const { 
    experienceTypes, 
    loading, 
    error, 
    createExperienceType, 
    updateExperienceType, 
    deleteExperienceType, 
    toggleStatus 
  } = useExperienceTypes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ExperienceType | null>(null);
  const [formData, setFormData] = useState<ExperienceTypeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingType, setDeletingType] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = () => {
    setEditingType(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEdit = (experienceType: ExperienceType) => {
    setEditingType(experienceType);
    setFormData({
      name: experienceType.name,
      description: experienceType.description || '',
      icon: experienceType.icon || '',
      color: experienceType.color || '#3B82F6',
      imageUrl: experienceType.imageUrl || '',
      isActive: experienceType.isActive,
      sortOrder: experienceType.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    if (!formData.name || formData.name.trim() === '') {
      alert('Category name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log('Submitting form data:', formData);
      
      if (editingType) {
        await updateExperienceType(editingType.id, formData);
      } else {
        await createExperienceType(formData);
      }
      
      setIsModalOpen(false);
      setEditingType(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving experience type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setDeletingType({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingType) return;
    
    try {
      setIsDeleting(true);
      await deleteExperienceType(deletingType.id);
      setIsDeleteModalOpen(false);
      setDeletingType(null);
    } catch (error) {
      console.error('Error deleting experience type:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingType(null);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleStatus(id);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminNavbar />
          <div className="flex-1 lg:ml-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminNavbar />
          <div className="flex-1 lg:ml-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600">Error: {error}</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Experience Categories</h1>
                <p className="text-gray-600 mt-2">Manage experience type categories</p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Category
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="grid gap-4">
                  {experienceTypes && experienceTypes.length > 0 ? (
                    experienceTypes.map((experienceType) => (
                      <div key={experienceType.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconRenderer iconName={experienceType.icon || 'fa-star'} className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{experienceType.name}</h3>
                            <p className="text-gray-500 text-sm">{experienceType.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${experienceType.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {experienceType.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => handleEdit(experienceType)}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(experienceType.id, experienceType.name)}
                            className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No categories found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit Category */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingType ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter category name"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Enter category description"
                    />
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    
                    {/* Icon Preview */}
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="text-sm text-gray-600 mb-2">Preview:</div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center">
                          <IconRenderer iconName={formData.icon || 'fa-star'} className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {formData.icon || 'fa-star'}
                        </span>
                      </div>
                    </div>

                    {/* Icon Selection Grid */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Choose from predefined icons:</div>
                      <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {iconOptions.map((iconOption) => (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: iconOption.name })}
                            className={`p-2 rounded-lg border transition-colors ${
                              formData.icon === iconOption.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={iconOption.label}
                          >
                            <IconRenderer iconName={iconOption.name} className="w-6 h-6 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Icon Input */}
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Or enter icon name manually:</div>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., fa-heart, 🎯, etc."
                      />
                    </div>
                  </div>

                  {/* Color Field */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  {/* Image URL Field */}
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Status and Sort Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        id="sortOrder"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : (editingType ? 'Update Category' : 'Create Category')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Hapus Kategori"
          categoryName={deletingType?.name || ''}
          isLoading={isDeleting}
          description="Kategori yang masih digunakan oleh experience akan di-nonaktifkan, sedangkan kategori yang tidak digunakan akan dihapus permanen."
        />
      </div>
    </AuthGuard>
  );
}