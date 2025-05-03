# Concourse VS Code Pipeline Visualizer - Development Guide

This document provides key information for continuing development on the Concourse Pipeline Visualizer VS Code extension. It documents the project structure, development workflow, and common tasks.

## Project Overview

This extension visualizes Concourse CI pipeline YAML files within VS Code. It provides:
- Interactive D3.js visualization of pipelines
- Group tabs for filtering pipeline views
- Live updates as you edit YAML files
- Concourse-style dark UI theme

## Development Environment Setup

1. **Prerequisites**
   - Node.js and npm
   - VS Code

2. **Installation**
   ```bash
   git clone <repository-url>
   cd concourse-vscode-viz
   npm install
   ```

3. **Development Commands**
   - `npm run compile` - Compile TypeScript and bundle webview
   - `npm run watch` - Compile and watch for changes to TypeScript
   - `npm run build:webview` - Bundle the webview with esbuild
   - `npm run watch:webview` - Bundle and watch for changes to webview files
   - `npm run package` - Create VSIX package for distribution
   - `npm run install-local` - Package and install locally

## Project Structure

- `src/` - TypeScript source code
  - `extension.ts` - Main extension activation code
  - `webview/` - Webview implementation
    - `index.ts` - Entry point for webview
    - `concourse-vis-view.ts` - Main visualization controller
    - `graph.ts` - Graph model and layout logic
    - `render.ts` - D3.js rendering code
- `sample-pipelines/` - Example pipeline YAML files
- `out/` - Compiled JavaScript and bundled files (generated)
- `images/` - Icons and screenshots

## Key Components

### Extension Host (`extension.ts`)
- Activates on YAML files
- Creates webview panel
- Passes YAML content to webview

### Webview 
- `index.ts` - Initializes the webview and handles messaging
- `concourse-vis-view.ts` - Manages groups, pipeline display, and UI elements
- `graph.ts` - Implements graph data structure and layout algorithms
- `render.ts` - Handles D3.js visualization and interactivity

## Development Workflow

1. Make changes to the TypeScript files
2. Run `npm run compile` or use VS Code's built-in task system
3. Press F5 to launch the extension in debug mode
4. Open a Concourse pipeline YAML file
5. Run "Show Concourse Pipeline Preview" from the command palette

## Common Tasks

### Adding a New Feature

1. Determine if the feature belongs in the extension host or webview
2. Add implementation to appropriate files
3. Test with the provided sample pipelines
4. Update documentation if necessary

### Debugging

- Use `console.log()` statements in the webview code
- Check Debug Console in VS Code for extension host logs
- Add the debug pattern `svg.append("text").text("Debug info")` for visualization issues

### Styling

- Webview styling is handled via inline styles in `concourse-vis-view.ts`
- D3.js styling (for nodes, edges, etc.) is in both `extension.ts` (CSS) and `render.ts` (D3 attributes)

### Packaging for Distribution

1. Update version in `package.json`
2. Run `npm run package`
3. Distribute the resulting `.vsix` file

## Code Patterns to Know

### Webview Communication
Messages are passed between the extension host and webview:

```typescript
// From extension to webview
panel.webview.postMessage({
  command: 'updatePipeline',
  text: editor.document.getText()
});

// From webview to extension
vscode.postMessage({ 
  type: 'ready',
  message: 'Webview initialized and ready'
});
```

### Pipeline Processing

1. YAML is parsed into objects
2. Jobs and resources are extracted
3. `iteratePlan()` processes job plans recursively
4. Pipeline graph is constructed
5. D3.js renders the graph

### Group Filtering

- Groups are read from the YAML structure
- Jobs are assigned to their groups
- UI tabs filter jobs by group
- Pipeline is redrawn with filtered jobs

## Troubleshooting

- **Black screen/no rendering**: Check the console for JS errors and verify D3.js is working
- **Layout issues**: Review graph layout logic in `graph.ts`
- **Missing elements**: Verify YAML parsing and job/resource extraction
- **Performance issues**: For large pipelines, consider optimizing the layout algorithm

## Future Enhancements

- Add keyboard shortcuts for common actions
- Improve performance for large pipelines
- Add search functionality
- Support more Concourse pipeline features
- Add visual diff capabilities for pipeline changes

## Maintenance

- Keep D3.js and other dependencies updated
- Test with newer versions of VS Code
- Follow VS Code extension API changes

## Useful Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [D3.js Documentation](https://d3js.org/)
- [Concourse Pipeline Syntax](https://concourse-ci.org/pipelines.html)