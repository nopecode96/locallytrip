import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useCommunicationApps, useUserContacts } from '../hooks/useCommunication';
import { CommunicationService } from '../services/communicationService';
import { CommunicationAppIcon } from './CommunicationContacts';
import type { CommunicationApp, UserCommunicationContact } from '../types/communication';
import { authAPI } from '../services/authAPI';

interface CommunicationAppsManagerProps {
  userId: number;
  className?: string;
  readOnly?: boolean; // New prop for read-only mode
}

const CommunicationAppsManager: React.FC<CommunicationAppsManagerProps> = ({
  userId,
  className = '',
  readOnly = false
}) => {
  const { showToast } = useToast();
  const { apps: allApps, loading: appsLoading } = useCommunicationApps();
  const { contacts: userContacts, loading: contactsLoading, refetch: refetchContacts } = useUserContacts(userId);
  
  const [editingContact, setEditingContact] = useState<UserCommunicationContact | null>(null);
  const [newContact, setNewContact] = useState<{
    appId: number;
    contactValue: string;
    isPublic: boolean;
    isPreferred: boolean;
  }>({
    appId: 0,
    contactValue: '',
    isPublic: true,
    isPreferred: false
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddContact = async () => {
    if (!newContact.appId || !newContact.contactValue.trim()) {
      showToast('Please select an app and enter contact value', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = authAPI.getToken();
      await CommunicationService.addOrUpdateContact(userId, {
        communicationAppId: newContact.appId,
        contactValue: newContact.contactValue.trim(),
        isPublic: newContact.isPublic,
        isPreferred: newContact.isPreferred
      }, token || undefined);

      setNewContact({
        appId: 0,
        contactValue: '',
        isPublic: true,
        isPreferred: false
      });
      setIsAdding(false);
      refetchContacts();
      showToast('Communication contact added successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add contact', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    setIsSubmitting(true);
    try {
      const token = authAPI.getToken();
      await CommunicationService.addOrUpdateContact(userId, {
        communicationAppId: editingContact.app.id,
        contactValue: editingContact.contactValue,
        isPublic: editingContact.isPublic,
        isPreferred: editingContact.isPreferred
      }, token || undefined);

      setEditingContact(null);
      refetchContacts();
      showToast('Communication contact updated successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update contact', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm('Are you sure you want to delete this communication contact?')) {
      return;
    }

    try {
      const token = authAPI.getToken();
      await CommunicationService.deleteContact(userId, contactId, token || undefined);
      refetchContacts();
      showToast('Communication contact deleted successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete contact', 'error');
    }
  };

  if (appsLoading || contactsLoading) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Existing Contacts */}
      {userContacts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Your Communication Contacts</h4>
          {userContacts.map((contact) => (
            <div key={contact.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <CommunicationAppIcon app={contact.app} size="sm" />
              
              {editingContact?.id === contact.id && !readOnly ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editingContact.contactValue}
                    onChange={(e) => setEditingContact({
                      ...editingContact,
                      contactValue: e.target.value
                    })}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Contact value"
                  />
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="checkbox"
                      checked={editingContact.isPublic}
                      onChange={(e) => setEditingContact({
                        ...editingContact,
                        isPublic: e.target.checked
                      })}
                      className="w-4 h-4"
                    />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center space-x-1 text-sm">
                    <input
                      type="checkbox"
                      checked={editingContact.isPreferred}
                      onChange={(e) => setEditingContact({
                        ...editingContact,
                        isPreferred: e.target.checked
                      })}
                      className="w-4 h-4"
                    />
                    <span>Preferred</span>
                  </label>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{contact.app.displayName}</span>
                    <span className="text-gray-600">{contact.contactValue}</span>
                    {contact.isPreferred && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Preferred</span>
                    )}
                    {!contact.isPublic && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Private</span>
                    )}
                  </div>
                </div>
              )}

              {!readOnly && (
                <div className="flex items-center space-x-2">
                  {editingContact?.id === contact.id ? (
                    <>
                      <button
                        onClick={handleUpdateContact}
                        disabled={isSubmitting}
                        className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingContact(null)}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingContact(contact)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Contact - Only show in edit mode */}
      {!readOnly && (
        <>
          {isAdding ? (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Add Communication Contact</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">App</label>
              <select
                value={newContact.appId}
                onChange={(e) => setNewContact({
                  ...newContact,
                  appId: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value={0}>Select an app</option>
                {allApps.filter(app => app.isActive).map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Contact Value</label>
              <input
                type="text"
                value={newContact.contactValue}
                onChange={(e) => setNewContact({
                  ...newContact,
                  contactValue: e.target.value
                })}
                placeholder="Username, phone number, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={newContact.isPublic}
                onChange={(e) => setNewContact({
                  ...newContact,
                  isPublic: e.target.checked
                })}
                className="w-4 h-4"
              />
              <span>Public (visible to travelers after booking)</span>
            </label>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={newContact.isPreferred}
                onChange={(e) => setNewContact({
                  ...newContact,
                  isPreferred: e.target.checked
                })}
                className="w-4 h-4"
              />
              <span>Preferred contact method</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddContact}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewContact({
                  appId: 0,
                  contactValue: '',
                  isPublic: true,
                  isPreferred: false
                });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Communication Contact</span>
          </div>
        </button>
      )}
        </>
      )}

      {userContacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No communication contacts added yet.</p>
          {!readOnly && (
            <p className="text-sm mt-1">Click "Add Communication Contact" to get started.</p>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        💡 Communication contacts will only be visible to travelers after they complete their booking payment
      </div>
    </div>
  );
};

export default CommunicationAppsManager;
