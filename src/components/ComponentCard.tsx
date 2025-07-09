import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { ComponentData } from '~/types/component';

interface ComponentCardProps {
  component: ComponentData;
  index: number;
  onDelete?: (id: string) => void;
  isInPane?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ 
  component, 
  index, 
  onDelete,
  isInPane = false
}) => {
  const getComponentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'button':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
      case 'input':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      case 'header':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-8 0h8m-8 0v2m8-2v2M5 8h14l-1 13H6L5 8z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'card':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'navigation':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
      case 'modal':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'table':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
          </svg>
        );
      case 'footer':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      case 'mcq':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'identity':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'dropdown':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      case 'disclaimer':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'graphic':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011 1v2M7 4h10M7 4a1 1 0 00-1 1v2m0 0V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011 1v2" />
          </svg>
        );
      case 'short_text':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  const getComponentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'button':
        return 'text-blue-600 bg-blue-50';
      case 'input':
        return 'text-green-600 bg-green-50';
      case 'text':
        return 'text-gray-600 bg-gray-50';
      case 'header':
        return 'text-purple-600 bg-purple-50';
      case 'image':
        return 'text-pink-600 bg-pink-50';
      case 'card':
        return 'text-indigo-600 bg-indigo-50';
      case 'navigation':
        return 'text-cyan-600 bg-cyan-50';
      case 'modal':
        return 'text-orange-600 bg-orange-50';
      case 'table':
        return 'text-yellow-600 bg-yellow-50';
      case 'footer':
        return 'text-red-600 bg-red-50';
      case 'mcq':
        return 'text-teal-600 bg-teal-50';
      case 'identity':
        return 'text-violet-600 bg-violet-50';
      case 'dropdown':
        return 'text-emerald-600 bg-emerald-50';
      case 'disclaimer':
        return 'text-amber-600 bg-amber-50';
      case 'graphic':
        return 'text-rose-600 bg-rose-50';
      case 'short_text':
        return 'text-lime-600 bg-lime-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Draggable 
      draggableId={component.id} 
      index={index}
      isDragDisabled={false}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-lg border p-3 shadow-sm transition-all duration-200 cursor-move
            ${snapshot.isDragging ? 'shadow-lg rotate-1 scale-105 border-blue-300 z-50 bg-blue-50' : 'hover:shadow-md border-gray-200'}
            ${isInPane ? 'border-blue-200 bg-blue-50' : ''}
          `}
          style={provided.draggableProps.style}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getComponentColor(component.type)}`}>
                {getComponentIcon(component.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm truncate">{component.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-500 capitalize">{component.type.replace('_', ' ')}</p>
                  {component.content && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <p className="text-xs text-gray-400 truncate max-w-[100px]">{component.content}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="text-gray-400 p-1" title="Drag to reorder">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(component.id);
                  }}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Delete component"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {isInPane && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Pane Position: {component.panePosition !== null && component.panePosition !== undefined ? component.panePosition + 1 : 'N/A'}
              </div>
            </div>
          )}
          
          {snapshot.isDragging && (
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Moving...
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default ComponentCard;