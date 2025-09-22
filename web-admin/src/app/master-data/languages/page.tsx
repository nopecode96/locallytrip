'use client';

import { useState } from 'react';
import { useLanguages } from '@/hooks/useLanguages';
import { Language, LanguageFormData } from '@/types/masterData';
import AuthGuard from '@/components/AuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

const initialFormData: LanguageFormData = {
  name: '',
  code: '',
  native_name: '',
  is_active: true,
};

// Common language codes for quick selection
const commonLanguages = [
  { code: 'en', name: 'English', native_name: 'English' },
  { code: 'id', name: 'Indonesian', native_name: 'Bahasa Indonesia' },
  { code: 'zh', name: 'Chinese', native_name: '中文' },
  { code: 'ja', name: 'Japanese', native_name: '日本語' },
  { code: 'ko', name: 'Korean', native_name: '한국어' },
  { code: 'th', name: 'Thai', native_name: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native_name: 'Tiếng Việt' },
  { code: 'ms', name: 'Malay', native_name: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', native_name: 'Filipino' },
  { code: 'my', name: 'Myanmar', native_name: 'မြန်မာ' },
];

export default function LanguagesPage() {
  const { languages, loading, error, createLanguage, updateLanguage, deleteLanguage, toggleStatus } = useLanguages();
  const [showForm, setShowForm] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [formData, setFormData] = useState<LanguageFormData>(initialFormData);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; language: Language | null }>({
    show: false,
    language: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      
      if (editingLanguage) {
        await updateLanguage(editingLanguage.id, formData);
      } else {
        await createLanguage(formData);
      }
      
      // Reset form
      setFormData(initialFormData);
      setShowForm(false);
      setEditingLanguage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setFormData({
      name: language.name,
      code: language.code,
      native_name: language.native_name || '',
      is_active: language.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.language) return;
    
    try {
      await deleteLanguage(deleteModal.language.id);
      setDeleteModal({ show: false, language: null });
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  const handleToggleStatus = async (language: Language) => {
    try {
      await toggleStatus(language.id);
    } catch (error) {
      console.error('Error toggling language status:', error);
    }
  };

  const handleQuickSelect = (lang: typeof commonLanguages[0]) => {
    setFormData({
      name: lang.name,
      code: lang.code,
      native_name: lang.native_name,
      is_active: true,
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingLanguage(null);
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-100">
          <AdminNavbar />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Language Management</h1>
              <p className="text-gray-600 mt-2">Manage supported languages and locales</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Language
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {editingLanguage ? 'Edit Language' : 'Add New Language'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Quick Select for Common Languages */}
                {!editingLanguage && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Select Common Languages:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleQuickSelect(lang)}
                          className="text-left p-2 text-sm border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <div className="font-medium">{lang.name}</div>
                          <div className="text-gray-500 text-xs">{lang.code} - {lang.native_name}</div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={255}
                        placeholder="English, Indonesian, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language Code *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        maxLength={255}
                        placeholder="en, id, zh, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Native Name
                    </label>
                    <input
                      type="text"
                      value={formData.native_name}
                      onChange={(e) => setFormData({ ...formData, native_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={255}
                      placeholder="English, Bahasa Indonesia, 中文, etc."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {submitting ? 'Saving...' : (editingLanguage ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Languages Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Native Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {languages.map((language) => (
                    <tr key={language.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {language.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {language.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(language.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {language.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {language.native_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleToggleStatus(language)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              language.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } transition-colors`}
                          >
                            {language.is_active ? 'Active' : 'Inactive'}
                          </button>
                          {language.deleted_at && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Soft Deleted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(language)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, language })}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {languages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No languages found. Add your first language to get started.</div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, language: null })}
          onConfirm={handleDelete}
          title="Delete Language"
          categoryName={deleteModal.language?.name || ''}
          description="This action cannot be undone and may affect related content."
        />
      </div>
    </AuthGuard>
  );
}