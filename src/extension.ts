import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  console.log('Concourse Pipeline Visualizer extension is now active!');
  
  // Register the command to show the Concourse pipeline visualization
  const disposable = vscode.commands.registerCommand(
    'concourse-vscode-viz.showPipelinePreview',
    () => {
      console.log('Command executed: concourse-vscode-viz.showPipelinePreview');
      
      // Get the active editor
      const editor = vscode.window.activeTextEditor;
      let title = 'Concourse Pipeline Preview';
      
      // Get pipeline name from filename if available
      if (editor) {
        // Extract just the filename without path or extension
        const fileName = path.basename(editor.document.fileName, path.extname(editor.document.fileName));
        title = `Pipeline: ${fileName}`;
      }
      
      // Create the webview panel
      const panel = vscode.window.createWebviewPanel(
        'concoursePipelinePreview',
        title,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'out', 'webview'))
          ]
        }
      );

      // Get path to the bundled webview script
      const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, 'out', 'webview', 'bundle.js')
      );
      const scriptUri = panel.webview.asWebviewUri(scriptPath);
      console.log('Script URI:', scriptUri.toString());

      // Load the HTML content
      panel.webview.html = getWebviewContent(scriptUri);
      console.log('Webview HTML content set');

      // Helper function to send YAML to the webview
      const updatePipeline = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          console.log('Active editor document:', editor.document.fileName);
          
          if (isConcourseYaml(editor.document)) {
            console.log('Sending YAML content to webview');
            panel.webview.postMessage({
              command: 'updatePipeline',
              text: editor.document.getText()
            });
          } else {
            console.log('Document is not a Concourse YAML file');
          }
        } else {
          console.log('No active editor');
        }
      };

      // Initial update
      updatePipeline();

      // Listen for messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          console.log('Received message from webview:', message);
        },
        undefined,
        context.subscriptions
      );

      // Update on document changes
      const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
        if (e.document === vscode.window.activeTextEditor?.document) {
          console.log('Document changed, updating pipeline');
          updatePipeline();
        }
      });

      // Update when the active editor changes
      const changeEditorSubscription = vscode.window.onDidChangeActiveTextEditor(() => {
        console.log('Active editor changed, updating pipeline');
        updatePipeline();
      });

      // Clean up when the panel is closed
      panel.onDidDispose(() => {
        console.log('Webview panel disposed');
        changeDocumentSubscription.dispose();
        changeEditorSubscription.dispose();
      });
    }
  );

  context.subscriptions.push(disposable);
}

// Determine if a document is a Concourse YAML file
function isConcourseYaml(document: vscode.TextDocument): boolean {
  // Accept both 'yaml' language ID and files with .yml/.yaml extensions
  const isYamlFile = document.languageId === 'yaml' || 
                    document.fileName.endsWith('.yml') ||
                    document.fileName.endsWith('.yaml');
  
  if (!isYamlFile) {
    console.log('Document is not YAML:', document.fileName, 'language:', document.languageId);
    return false;
  }
  
  console.log('Document is YAML:', document.fileName);
  
  // Simple detection: check if the YAML contains 'jobs:' and 'resources:' sections
  const text = document.getText();
  const hasConcourseStructure = text.includes('jobs:') && text.includes('resources:');
  console.log('Document has Concourse structure:', hasConcourseStructure);
  
  // For debugging, let's treat all YAML files as Concourse YAML
  return true; // Return true for all YAML files during testing
}

// Generate the HTML for the webview
function getWebviewContent(scriptUri: vscode.Uri): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concourse Pipeline Preview</title>
  <style>
    body, html {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Inconsolata, monospace;
      background-color: #2a2a2a; /* Dark gray background */
    }
    
    @font-face {
      font-family: 'Inconsolata';
      src: url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap');
      font-weight: normal;
      font-style: normal;
    }
    #pipeline-container {
      width: 100%;
      height: 100vh;
      background-color: #2a2a2a; /* Dark gray background */
    }
    #status-message {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 100;
      display: none; /* Hide the status message but keep it for debugging */
    }
    .controls {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      padding: 5px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      display: flex;
      gap: 5px;
      z-index: 100;
    }
    .control-button {
      background: #3498db;
      color: white;
      border: none;
      border-radius: 3px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
    }
    
    /* Pipeline Graph Styles */
    svg.pipeline-graph {
      width: 100%;
      height: 100%;
      background-color: #2a2a2a; /* Dark gray background similar to Concourse */
    }
    
    /* Node styles - default */
    .node text {
      font-size: 12px;
      fill: white;
      dominant-baseline: middle;
      text-anchor: middle;
      font-weight: normal;
      font-family: Inconsolata, monospace;
      pointer-events: none;
    }
    
    /* Job nodes */
    .node.job rect {
      fill: #3498db;
      stroke: #2980b9;
      stroke-width: 1px;
      /* No rounded corners */
    }
    
    /* Resource nodes */
    .node.output rect, 
    .node.input rect, 
    .node.constrained-input rect {
      fill: #222222;
      stroke: #444444;
      stroke-width: 1px;
      /* No rounded corners */
    }
    
    /* First occurrence of resources */
    .node.input text {
      fill: white;
    }
    
    /* Re-appearances of resources */
    .node.constrained-input text {
      fill: #cccccc;
    }
    
    /* Edge styles - default is non-triggering */
    .edge path {
      fill: none;
      stroke: #95a5a6;
      stroke-width: 2px;
      stroke-dasharray: 5, 2; /* Default to dashed for non-triggering */
    }
    
    /* For triggering edges (trigger: true) - solid lines */
    .edge.trigger-true path {
      stroke-dasharray: none;
    }
    
    /* Resource text class */
    .resource-text {
      fill: white;
    }
    
    /* Status colors for jobs */
    .node.job.succeeded rect { fill: #2ecc71; }
    .node.job.failed rect { fill: #e74c3c; }
    .node.job.pending rect { fill: #f39c12; }
    .node.job.paused rect { fill: #95a5a6; }
    .node.job.no-builds rect { fill: #bdc3c7; }
    
    /* Make sure resource nodes remain black regardless of status */
    .node.input rect, 
    .node.output rect, 
    .node.constrained-input rect {
      fill: #222222 !important;
    }
    
    /* Active/hover state */
    .node.active rect, 
    .edge.active path {
      stroke: #f1c40f;
      stroke-width: 2px;
    }
    
    /* Pipeline container */
    g.pipeline-container {
      transition: transform 0.2s;
    }
  </style>
</head>
<body>
  <div id="status-message">Initializing Concourse Pipeline Visualizer...</div>
  <div id="pipeline-container"></div>
  <script>
    // This script runs before the bundle is loaded
    console.log('Webview HTML loaded');
    window.onerror = function(message, source, lineno, colno, error) {
      document.getElementById('status-message').textContent = 'Error: ' + message;
      console.error('Error in webview:', message, error);
      return true;
    };
  </script>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}