import React, { useState } from 'react';
import type { CreateComponentInput } from '~/types/component';

interface AddComponentFormProps {
  onAddComponent: (component: CreateComponentInput) => Promise<void>;
  isLoading: boolean;
}

const componentTypes = [
  'Button',
  'Input', 
  'Text',
  'Header',
  'Image',
  'Card',
  'Navigation',
  'Modal',
  'Table',
  'Footer',
  'MCQ',
  'Identity',
  'Dropdown',
  'Disclaimer',
  'Graphic',
  'Short Text'
];

const AddComponentForm: React.FC<AddComponentFormProps> = ({ 
  onAddComponent, 
  isLoading 
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Button');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await onAddComponent({
        name: name.trim(),
        type: type.toLowerCase().replace(' ', '_'),
        content: content.trim() || undefined
      });
      setName('');
      setContent('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Component</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Component Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            placeholder="e.g., Email Input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Component Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
          >
            {componentTypes.map((componentType) => (
              <option key={componentType} value={componentType}>
                {componentType}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            placeholder="Additional content or placeholder"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            '+ Add Component'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddComponentForm;