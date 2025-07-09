"use client";

import React, { useState } from 'react';
import { type DropResult } from 'react-beautiful-dnd';
import { api } from '~/trpc/react';
import ComponentList from '~/components/ComponentList';
import AddComponentForm from '~/components/AddComponentForm';
import FormRenderer from '~/components/FormRenderer';
import Toast from '~/components/Toast';
import type { ComponentData, CreateComponentInput, PaneType } from '~/types/component';

const HomePage: React.FC = () => {
  const [toast, setToast] = useState<{ 
    message: string; 
    type: 'success' | 'error' | 'info' 
  } | null>(null);

  const { data: components, isLoading, refetch } = api.component.getAll.useQuery();
  
  const createComponent = api.component.create.useMutation({
    onSuccess: () => {
      void refetch();
      showToast('Component added successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to add component', 'error');
    }
  });

  const reorderComponents = api.component.reorder.useMutation({
    onSuccess: () => {
      void refetch();
      showToast('Components reordered successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to save new order', 'error');
    }
  });

  const deleteComponent = api.component.delete.useMutation({
    onSuccess: () => {
      void refetch();
      showToast('Component deleted successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to delete component', 'error');
    }
  });

  const createHorizontalGroup = api.component.createHorizontalGroup.useMutation({
    onSuccess: () => {
      void refetch();
      showToast('New horizontal group created!', 'success');
    },
    onError: () => {
      showToast('Failed to create horizontal group', 'error');
    }
  });

  const handleAddComponent = async (componentData: CreateComponentInput) => {
    await createComponent.mutateAsync(componentData);
  };

  const handleDeleteComponent = async (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      await deleteComponent.mutateAsync({ id });
    }
  };

  const handleCreateHorizontalGroup = async () => {
    const result = await createHorizontalGroup.mutateAsync();
    if (!result.success) {
      showToast('Only one empty group is allowed at a time', 'info');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || !components) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    try {
      const updatedComponents = [...components];
      const draggedComponent = updatedComponents.find(c => c.id === draggableId);
      
      if (!draggedComponent) {
        console.warn('Dragged component not found:', draggableId);
        return;
      }

      const destPaneComponents = updatedComponents.filter(c => 
        c.paneId === destination.droppableId && 
        c.id !== draggableId && 
        c.type !== 'placeholder'
      );

      const destinationPlaceholder = updatedComponents.find(c => 
        c.paneId === destination.droppableId && c.type === 'placeholder'
      );

      if (source.droppableId === destination.droppableId) {
        const paneComponents = updatedComponents
          .filter(c => c.paneId === source.droppableId && c.type !== 'placeholder')
          .sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0));
        
        const [removed] = paneComponents.splice(source.index, 1);
        paneComponents.splice(destination.index, 0, removed!);
        
        paneComponents.forEach((comp, index) => {
          const compIndex = updatedComponents.findIndex(c => c.id === comp.id);
          if (compIndex !== -1) {
            updatedComponents[compIndex] = { ...comp, panePosition: index };
          }
        });
      }
      else {
        const draggedComponentIndex = updatedComponents.findIndex(c => c.id === draggableId);
        
        if (draggedComponentIndex !== -1) {
          if (destPaneComponents.length >= 2) {
            const targetPaneComponents = destPaneComponents.sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0));
            const targetComponent = targetPaneComponents[destination.index];
            
            if (targetComponent) {
              const targetComponentIndex = updatedComponents.findIndex(c => c.id === targetComponent.id);
              
              updatedComponents[draggedComponentIndex] = {
                ...draggedComponent,
                paneId: destination.droppableId,
                panePosition: destination.index
              };
              
              updatedComponents[targetComponentIndex] = {
                ...targetComponent,
                paneId: source.droppableId,
                panePosition: source.index
              };
              
              showToast('Components swapped successfully!', 'info');
            } else {
              showToast('Cannot drop here - group is full', 'error');
              return;
            }
          } else {
            const newPanePosition = Math.min(destination.index, destPaneComponents.length);

            updatedComponents[draggedComponentIndex] = {
              ...draggedComponent,
              paneId: destination.droppableId,
              panePosition: newPanePosition
            };

            if (destinationPlaceholder) {
              const placeholderIndex = updatedComponents.findIndex(c => c.id === destinationPlaceholder.id);
              if (placeholderIndex !== -1) {
                updatedComponents.splice(placeholderIndex, 1);
              }
            }

            destPaneComponents.forEach((comp, index) => {
              const targetIndex = index >= newPanePosition ? index + 1 : index;
              const compIdx = updatedComponents.findIndex(c => c.id === comp.id);
              if (compIdx !== -1) {
                updatedComponents[compIdx] = { ...comp, panePosition: targetIndex };
              }
            });

            const sourcePaneComponents = updatedComponents
              .filter(c => c.paneId === source.droppableId && c.id !== draggableId && c.type !== 'placeholder')
              .sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0));

            sourcePaneComponents.forEach((comp, index) => {
              const compIdx = updatedComponents.findIndex(c => c.id === comp.id);
              if (compIdx !== -1) {
                updatedComponents[compIdx] = { ...comp, panePosition: index };
              }
            });
          }
        }
      }

      const componentsToUpdate = updatedComponents.map(comp => ({
        id: comp.id,
        position: comp.position,
        paneId: comp.paneId,
        panePosition: comp.panePosition
      }));

      await reorderComponents.mutateAsync({ components: componentsToUpdate });

    } catch (error) {
      console.error('Error handling drag end:', error);
      showToast('Failed to reorder components', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading components...</p>
        </div>
      </div>
    );
  }

  const allPaneIds = Array.from(
    new Set(components?.filter(c => c.paneId).map(c => c.paneId))
  );
  
  const panes = allPaneIds.map(paneId => ({
    id: paneId!,
    components: components!
      .filter(c => c.paneId === paneId)
      .sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0))
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
           Form Builder
          </h1>
          <p className="text-gray-600">
            Build forms with  groups
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="order-2 lg:order-1">
            <FormRenderer 
              components={components || []} 
              panes={panes} 
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            
            <ComponentList
              components={components || []}
              onReorder={handleDragEnd}
              onDelete={handleDeleteComponent}
              onCreateHorizontalGroup={handleCreateHorizontalGroup}
            />

            <AddComponentForm 
              onAddComponent={handleAddComponent} 
              isLoading={createComponent.isPending}
            />

          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HomePage;