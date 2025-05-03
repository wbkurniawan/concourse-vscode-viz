import { init, update, resetZoom } from './concourse-vis-view';

// Acquire the VS Code API
const vscode = acquireVsCodeApi();

console.log('Webview bundle script loaded');

// Update status message
function updateStatus(message: string) {
  const statusElement = document.getElementById('status-message');
  if (statusElement) {
    statusElement.textContent = message;
    console.log('Status updated:', message);
  }
}

// Initialize the container and visualization
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event triggered');
  updateStatus('DOM loaded, initializing visualization...');
  
  const container = document.getElementById('pipeline-container');
  
  if (!container) {
    console.error('Pipeline container element not found');
    updateStatus('Error: Pipeline container element not found');
    return;
  }
  
  try {
    // Initialize the visualization with the container
    updateStatus('Initializing D3 visualization...');
    const { svg } = init(container);
    updateStatus('Visualization initialized, waiting for pipeline data...');
    
    // Set up reset zoom button
    const resetButton = document.getElementById('reset-zoom');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        console.log('Reset zoom button clicked');
        resetZoom();
        updateStatus('View reset');
      });
    }
    
    // Send ready message to extension
    vscode.postMessage({ 
      type: 'ready',
      message: 'Webview initialized and ready'
    });
    
    // Listen for messages from the extension
    window.addEventListener('message', event => {
      const message = event.data;
      console.log('Received message from extension:', message);
      
      if (message.command === 'updatePipeline') {
        try {
          updateStatus('Updating pipeline visualization...');
          update(svg, message.text);
          updateStatus('Pipeline visualization updated');
        } catch (error) {
          console.error('Error updating pipeline:', error);
          updateStatus('Error: Failed to update pipeline: ' + (error instanceof Error ? error.message : String(error)));
        }
      }
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    updateStatus('Error during initialization: ' + (error instanceof Error ? error.message : String(error)));
  }
});

// Define the VS Code API type for TypeScript
declare function acquireVsCodeApi(): {
  postMessage(message: any): void;
  setState(state: any): void;
  getState(): any;
};