"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concourse_vis_view_1 = require("./concourse-vis-view");
// Acquire the VS Code API
const vscode = acquireVsCodeApi();
console.log('Webview bundle script loaded');
// Store YAML content globally
let currentYamlContent = '';
// Update status message
function updateStatus(message) {
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
        const { svg } = (0, concourse_vis_view_1.init)(container);
        updateStatus('Visualization initialized, waiting for pipeline data...');
        // Set up reset zoom button
        const resetButton = document.getElementById('reset-zoom');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                console.log('Reset zoom button clicked');
                (0, concourse_vis_view_1.resetZoom)();
                updateStatus('View reset');
            });
        }
        // Listen for group tab clicks (delegated event handling)
        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.classList.contains('group-tab')) {
                console.log('Group tab clicked:', target.getAttribute('data-group'));
                // The group switching logic is handled internally in concourse-vis-view.ts
            }
        });
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
                    currentYamlContent = message.text;
                    (0, concourse_vis_view_1.update)(svg, currentYamlContent);
                    updateStatus('Pipeline visualization updated');
                }
                catch (error) {
                    console.error('Error updating pipeline:', error);
                    updateStatus('Error: Failed to update pipeline: ' + (error instanceof Error ? error.message : String(error)));
                }
            }
        });
    }
    catch (error) {
        console.error('Error during initialization:', error);
        updateStatus('Error during initialization: ' + (error instanceof Error ? error.message : String(error)));
    }
});
//# sourceMappingURL=index.js.map