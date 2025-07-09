import React from 'react';
import type { ComponentData, PaneType } from '~/types/component';

interface FormRendererProps {
  components: ComponentData[];
  panes: PaneType[];
}

const FormRenderer: React.FC<FormRendererProps> = ({ components, panes }) => {
  const sortedPanes = panes
    .map(pane => ({
      ...pane,
      components: pane.components
        .filter(comp => comp.type !== 'placeholder') 
        .sort((a, b) => (a.panePosition || 0) - (b.panePosition || 0))
    }))
    .sort((a, b) => {
      if (a.components.length === 0 && b.components.length === 0) {
        return 0; 
      }
      if (a.components.length === 0) return 1; 
      if (b.components.length === 0) return -1; 
      
      const aMinPos = Math.min(...a.components.map(c => c.position));
      const bMinPos = Math.min(...b.components.map(c => c.position));
      return aMinPos - bMinPos;
    });

  const renderComponent = (component: ComponentData) => {
    const baseClasses = "w-full p-3 border border-gray-300 rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
    
    switch (component.type.toLowerCase()) {
      case 'button':
        return (
          <button
            key={component.id}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors font-medium w-full"
          >
            {component.content || component.name}
          </button>
        );
      
      case 'input':
        return (
          <input
            key={component.id}
            type="text"
            placeholder={component.content || component.name}
            className={baseClasses}
          />
        );
      
      case 'text':
        return (
          <div key={component.id} className="text-gray-700 p-3 border border-gray-300 rounded-md">
            <h3 className="font-medium text-gray-800">{component.name}</h3>
            {component.content && <p className="text-sm text-gray-600 mt-1">{component.content}</p>}
          </div>
        );
      
      case 'header':
        return (
          <h2 key={component.id} className="text-2xl font-bold text-gray-800 mb-2 p-3 border border-gray-300 rounded-md">
            {component.content || component.name}
          </h2>
        );
      
      case 'image':
        return (
          <div key={component.id} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">{component.name}</p>
          </div>
        );
      
      case 'card':
        return (
          <div key={component.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">{component.name}</h4>
            {component.content && <p className="text-gray-600 text-sm">{component.content}</p>}
          </div>
        );
      
      case 'navigation':
        return (
          <nav key={component.id} className="bg-gray-800 text-white p-3 rounded-md">
            <div className="flex space-x-4">
              <span className="font-medium">{component.name}</span>
              <span className="text-gray-300">Home</span>
              <span className="text-gray-300">About</span>
              <span className="text-gray-300">Contact</span>
            </div>
          </nav>
        );
      
      case 'modal':
        return (
          <div key={component.id} className="border-2 border-blue-300 bg-blue-50 rounded-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-blue-800">{component.name}</h4>
              <button className="text-blue-600 hover:text-blue-800">×</button>
            </div>
            {component.content && <p className="text-blue-700 text-sm">{component.content}</p>}
          </div>
        );
      
      case 'table':
        return (
          <div key={component.id} className="border border-gray-300 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">{component.name}</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-800">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Sample</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{component.content || 'Content'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      
      case 'footer':
        return (
          <footer key={component.id} className="bg-gray-700 text-white p-3 rounded-md text-center">
            <p className="text-sm">{component.content || component.name}</p>
          </footer>
        );

      case 'mcq':
        return (
          <div key={component.id} className="p-4 bg-white rounded border">
            <h3 className="font-semibold mb-3">{component.name}</h3>
            <div className="space-y-2">
              <div className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="radio" name={`mcq-${component.id}`} className="mr-2" />
                Option 1
              </div>
              <div className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="radio" name={`mcq-${component.id}`} className="mr-2" />
                Option 2
              </div>
              <div className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input type="radio" name={`mcq-${component.id}`} className="mr-2" />
                Option 3
              </div>
            </div>
          </div>
        );

      case 'identity':
        return (
          <div key={component.id} className="p-4 bg-white rounded border">
            <h3 className="font-semibold mb-3">{component.name}</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="First Name" className="flex-1 p-2 border rounded" />
                <input type="text" placeholder="Last Name" className="flex-1 p-2 border rounded" />
              </div>
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
              <input type="tel" placeholder="Phone #" className="w-full p-2 border rounded" />
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div key={component.id} className="p-4 bg-white rounded border">
            <label className="block font-semibold mb-2">{component.name}</label>
            <select className="w-full p-2 border rounded">
              <option>Select an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        );

      case 'disclaimer':
        return (
          <div key={component.id} className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {component.content || 'This is a disclaimer component'}
            </p>
          </div>
        );

      case 'graphic':
        return (
          <div key={component.id} className="p-4 bg-white rounded border">
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500">🎨 {component.name}</span>
            </div>
          </div>
        );

      case 'short_text':
        return (
          <div key={component.id} className="p-4 bg-white rounded border">
            <label className="block font-semibold mb-2">{component.name}</label>
            <input 
              type="text" 
              placeholder={component.content || "Enter text"} 
              className="w-full p-2 border rounded" 
            />
          </div>
        );
      
      default:
        return (
          <div key={component.id} className="bg-gray-100 border border-gray-300 rounded-md p-3">
            <span className="text-gray-700 font-medium">{component.name}</span>
            {component.content && <p className="text-sm text-gray-600 mt-1">{component.content}</p>}
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Form Preview</h2>
      </div>
      
      <div className="space-y-4">
        {sortedPanes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium mb-2">No components yet</p>
            <p>Add components from the right panel to build your form</p>
          </div>
        ) : (
          sortedPanes.map((pane) => (
            <div key={pane.id}>
              {pane.components.length === 1 ? (
                <div className="w-full">
                  {pane.components[0] && renderComponent(pane.components[0])}
                </div>
              ) : pane.components.length === 2 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    {pane.components[0] && renderComponent(pane.components[0])}
                  </div>
                  <div className="col-span-1">
                    {pane.components[1] && renderComponent(pane.components[1])}
                  </div>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormRenderer;