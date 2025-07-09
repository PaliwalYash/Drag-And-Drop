import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, type DropResult, resetServerContext } from 'react-beautiful-dnd';
import ComponentCard from './ComponentCard';
import type { ComponentData } from '~/types/component';

interface ComponentListProps {
  components: ComponentData[];
  onReorder: (result: DropResult) => Promise<void>;
  onDelete: (id: string) => void;
  onCreateHorizontalGroup: () => void;
}

const ComponentList: React.FC<ComponentListProps> = ({
  components,
  onReorder,
  onDelete,
  onCreateHorizontalGroup
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [enableDragDrop, setEnableDragDrop] = useState(false);

  useEffect(() => {
    resetServerContext();
    setIsMounted(true);
    
    const timer = setTimeout(() => {
      setEnableDragDrop(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const paneGroups = new Map<string, ComponentData[]>();
  components.forEach(component => {
    if (component.paneId) {
      if (!paneGroups.has(component.paneId)) {
        paneGroups.set(component.paneId, []);
      }
      if (component.type !== 'placeholder') {
        paneGroups.get(component.paneId)!.push(component);
      }
    }
  });

  components.forEach(component => {
    if (component.paneId && component.type === 'placeholder') {
      if (!paneGroups.has(component.paneId)) {
        paneGroups.set(component.paneId, []);
      }
    }
  });

  paneGroups.forEach((components, paneId) => {
    paneGroups.set(paneId, components.sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0)));
  });

  const sortedPaneEntries = Array.from(paneGroups.entries()).sort(([, componentsA], [, componentsB]) => {
    const minPosA = Math.min(...componentsA.map(c => c.position));
    const minPosB = Math.min(...componentsB.map(c => c.position));
    return minPosA - minPosB;
  });

  if (!isMounted || !enableDragDrop) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Groups</h2>
            <button
              onClick={onCreateHorizontalGroup}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors"
            >
              + New
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {components.length} component{components.length !== 1 ? 's' : ''} in {paneGroups.size} group{paneGroups.size !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-4">
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Initializing drag and drop...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Groups</h2>
          <button
            onClick={onCreateHorizontalGroup}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors"
          >
            + New
          </button>
        </div>
      </div>

      <div className="p-4">
        <DragDropContext onDragEnd={onReorder}>
          {sortedPaneEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedPaneEntries.map(([paneId, paneComponents]) => (
                <div key={paneId} className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-3">
                  <Droppable 
                    droppableId={paneId} 
                    direction="horizontal"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={false}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          grid grid-cols-2 gap-3 min-h-[100px] p-3 rounded transition-colors
                          ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-white'}
                        `}
                      >
                        <div className="col-span-1">
                          {paneComponents[0] ? (
                            <ComponentCard
                              component={paneComponents[0]}
                              index={0}
                              onDelete={onDelete}
                              isInPane={true}
                            />
                          ) : (
                            <div className="flex items-center justify-center text-blue-400 text-xs border-2 border-dashed border-blue-300 rounded min-h-[80px] bg-gray-50">
                              <div className="text-center">
                                <svg className="w-6 h-6 mx-auto mb-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="col-span-1">
                          {paneComponents[1] ? (
                            <ComponentCard
                              component={paneComponents[1]}
                              index={1}
                              onDelete={onDelete}
                              isInPane={true}
                            />
                          ) : (
                            <div className="flex items-center justify-center text-blue-400 text-xs border-2 border-dashed border-blue-300 rounded min-h-[80px] bg-gray-50">
                              <div className="text-center">
                                <svg className="w-6 h-6 mx-auto mb-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-medium mb-2">No Component yet</p>
              <p className="mb-4">Create your first group to organize components</p>
              <button
                onClick={onCreateHorizontalGroup}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create First Component group
              </button>
            </div>
          )}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ComponentList;