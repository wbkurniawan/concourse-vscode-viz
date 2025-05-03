import * as d3 from 'd3';
import { Graph, GraphNode, Edge } from './graph';

console.log('Render module loaded');

let currentHighlight: string | undefined;

// Main drawing function for the pipeline
export function draw(svg: d3.Selection<any, any, any, any>, jobs: any[], resources: any[]): void {
  console.log('Drawing pipeline with jobs:', jobs.length, 'and resources:', resources.length);
  
  // Debug output of jobs and resources
  if (jobs.length > 0) {
    console.log('Sample job:', jobs[0].name, 'with inputs:', jobs[0].inputs?.length, 'outputs:', jobs[0].outputs?.length);
  }
  
  if (resources.length > 0) {
    console.log('Sample resource:', resources[0].name);
  }
  
  const redraw = redrawFunction(svg, jobs, resources);
  redraw();
  
  console.log('Pipeline drawing complete');
}

// Create function that will redraw the pipeline
function redrawFunction(svg: d3.Selection<any, any, any, any>, jobs: any[], resources: any[]) {
  return function() {
    // Reset viewbox for clean slate calculation
    const parentNode = svg.node()?.parentNode as SVGElement;
    if (parentNode) {
      d3.select(parentNode).attr("viewBox", "0 0 0 0");
    }

    // Create the graph
    const graph = createGraph(svg, jobs, resources);

    // Remove existing edges and nodes
    svg.selectAll("g.edge").remove();
    svg.selectAll("g.node").remove();

    // Bind data to edges
    const svgEdges = svg.selectAll("g.edge")
      .data(graph.edges());

    svgEdges.exit().remove();

    // Bind data to nodes
    const svgNodes = svg.selectAll("g.node")
      .data(graph.nodes());

    svgNodes.exit().remove();

    // Create edge groups
    const svgEdge = svgEdges.enter().append("g")
      .attr("class", function(edge: Edge) { 
        // Start with basic edge class + source node status
        let classes = "edge " + (edge.source.node.status || '');
        
        // Add trigger class based on the customData
        if (edge.customData && edge.customData.trigger === true) {
          classes += " trigger-true";
        } else {
          classes += " trigger-false";
        }
        
        return classes;
      });
      
    // Log some edge data for debugging
    if (graph.edges().length > 0) {
      console.log('Sample edge trigger status:', 
                  graph.edges()[0].customData?.trigger, 
                  'from', graph.edges()[0].source.node.name,
                  'to', graph.edges()[0].target.node.name);
    }

    // Highlight function for hover effects
    function highlight(thing: { key?: string }) {
      if (!thing.key) {
        return;
      }

      currentHighlight = thing.key;

      svgEdges.each(function(edge: Edge) {
        if (edge.source.key === thing.key) {
          d3.select(this).classed("active", true);
        }
      });

      svgNodes.each(function(node: GraphNode) {
        if (node.key === thing.key) {
          d3.select(this).classed("active", true);
        }
      });
    }

    // Remove highlight
    function lowlight(thing: { key?: string }) {
      if (!thing.key) {
        return;
      }

      currentHighlight = undefined;
      
      svgEdges.classed("active", false);
      svgNodes.classed("active", false);
    }

    // Create node groups
    const svgNode = svgNodes.enter().append("g")
      .attr("class", function(node: GraphNode) { return "node " + node.class; })
      .on("mouseover", highlight)
      .on("mouseout", lowlight);

    // Create node links (for clicking)
    const nodeLink = svgNode.append("svg:a")
      .attr("xlink:href", function(node: GraphNode) { return node.url || '#'; });

    // Create node background rectangles
    const jobStatusBackground = nodeLink.append("rect")
      .attr("height", function(node: GraphNode) { return node.height(); });

    // Create text element for node names
    nodeLink.append("text")
      .text(function(node: GraphNode) { return node.name; })
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("x", function(node: GraphNode) { return node.width() / 2; })
      .attr("y", function(node: GraphNode) { return node.height() / 2; })
      .attr("class", function(node: GraphNode) {
        // Add class for resource type
        if (node.class.includes('input') || node.class.includes('output')) {
          return 'resource-text';
        }
        return '';
      });

    // Set width of node rectangles
    jobStatusBackground.attr("width", function(node: GraphNode) { return node.width(); });

    // Layout the graph
    graph.layout();

    // Set node positions
    svgNode.attr("transform", function(node: GraphNode) {
      const position = node.position();
      return "translate(" + position.x + ", " + position.y + ")";
    });

    // Create edge paths
    svgEdge.append("path")
      .attr("d", function(edge: Edge) { return edge.path(); })
      .on("mouseover", highlight)
      .on("mouseout", lowlight);

    // Update viewBox to fit content
    const bbox = svg.node()?.getBBox();
    if (bbox && parentNode) {
      d3.select(parentNode)
        .attr("viewBox", "" + (bbox.x - 20) + " " + (bbox.y - 20) + " " + 
              (bbox.width + 40) + " " + (bbox.height + 40));
    }

    // Restore current highlight if there was one
    if (currentHighlight) {
      svgNodes.each(function(node: GraphNode) {
        if (node.key === currentHighlight) {
          highlight(node);
        }
      });

      svgEdges.each(function(edge: Edge) {
        if (edge.key === currentHighlight) {
          highlight(edge);
        }
      });
    }
  };
}

// Create SVG container for the pipeline
export function createPipelineSvg(svg: d3.Selection<any, any, any, any>): d3.Selection<any, any, any, any> {
  console.log('Creating pipeline SVG container');
  
  // Clear any existing content
  svg.html("");
  
  let g = svg.select<SVGGElement>("g.pipeline-container");
  
  if (g.empty()) {
    console.log('Creating new pipeline container group');
    
    // Create defs for filters and markers
    const defs = svg.append("defs");
    
    // Add embiggen filter
    defs.append("filter")
      .attr("id", "embiggen")
      .append("feMorphology")
      .attr("operator", "dilate")
      .attr("radius", "4");
      
    // No arrowhead marker as requested

    // Create main container group
    g = svg.append<SVGGElement>("g")
      .attr("class", "pipeline-container")
      .attr("transform", "translate(0,0) scale(1)");
    
    console.log('Adding zoom behavior');
    
    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom as any);
    
    // Debug rectangle to check if the SVG is rendering - hidden but kept for future use
    g.append("rect")
      .attr("x", 20)
      .attr("y", 20)
      .attr("width", 100)
      .attr("height", 60)
      .attr("fill", "purple")
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("display", "none"); // Hide the rectangle
      
    g.append("text")
      .attr("x", 70)
      .attr("y", 50)
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Pipeline View")
      .style("display", "none"); // Hide the text
  }
  
  return g;
}

// Reset zoom and transform
export function resetPipelineFocus(): void {
  const g = d3.select("g.pipeline-container");
  
  if (!g.empty()) {
    g.attr("transform", "");
    // Reset zoom behavior
    d3.select("svg").call(
      d3.zoom().transform as any, 
      d3.zoomIdentity
    );
  }
}

// Create the graph from jobs and resources
function createGraph(svg: d3.Selection<any, any, any, any>, jobs: any[], resources: any[]): Graph {
  const graph = new Graph();

  const resourceURLs: Record<string, string> = {};
  const resourceFailing: Record<string, boolean> = {};
  const resourcePaused: Record<string, boolean> = {};

  // Process resources
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    resourceURLs[resource.name] = `/teams/${resource.team_name}/pipelines/${resource.pipeline_name}/resources/${encodeURIComponent(resource.name)}`;
    resourceFailing[resource.name] = resource.failing_to_check;
    resourcePaused[resource.name] = resource.paused;
  }

  // Create job nodes
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const id = jobNode(job.name);
    const classes = ["job"];

    // Determine URL
    let url = `/teams/${job.team_name}/pipelines/${job.pipeline_name}/jobs/${encodeURIComponent(job.name)}`;
    if (job.next_build) {
      const build = job.next_build;
      url = `/teams/${build.team_name}/pipelines/${build.pipeline_name}/jobs/${encodeURIComponent(build.job_name)}/builds/${build.name}`;
    } else if (job.finished_build) {
      const build = job.finished_build;
      url = `/teams/${build.team_name}/pipelines/${build.pipeline_name}/jobs/${encodeURIComponent(build.job_name)}/builds/${build.name}`;
    }

    // Determine status
    let status;
    if (job.paused) {
      status = "paused";
    } else if (job.finished_build) {
      status = job.finished_build.status;
    } else {
      status = "no-builds";
    }

    classes.push(status);

    if (job.next_build) {
      classes.push(job.next_build.status);
    }

    // Create the node
    graph.setNode(id, new GraphNode({
      id: id,
      name: job.name,
      class: classes.join(" "),
      status: status,
      url: url,
      svg: svg,
    }));
  }

  // Helper function to determine resource status
  const resourceStatus = function(resource: string): string {
    let status = "";
    if (resourceFailing[resource]) {
      status += " failing";
    }

    if (resourcePaused[resource]) {
      status += " paused";
    }

    return status;
  };

  // Process job outputs and create edges
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const id = jobNode(job.name);

    for (let j = 0; j < job.outputs.length; j++) {
      const output = job.outputs[j];
      const outputId = outputNode(job.name, output.resource);

      let jobOutputNode = graph.node(outputId);
      if (!jobOutputNode) {
        jobOutputNode = new GraphNode({
          id: outputId,
          name: output.resource,
          key: output.resource,
          class: "output" + resourceStatus(output.resource),
          repeatable: true,
          url: resourceURLs[output.resource],
          svg: svg
        });

        graph.setNode(outputId, jobOutputNode);
      }

      graph.addEdge(id, outputId, output.resource, null);
    }
  }

  // Process job inputs and create edges
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const id = jobNode(job.name);

    for (let j = 0; j < job.inputs.length; j++) {
      const input = job.inputs[j];

      if (input.passed && input.passed.length > 0) {
        for (let p = 0; p < input.passed.length; p++) {
          const sourceJobNode = jobNode(input.passed[p]);
          const sourceOutputNode = outputNode(input.passed[p], input.resource);
          const sourceInputNode = inputNode(input.passed[p], input.resource);

          let sourceNode;
          if (graph.node(sourceOutputNode)) {
            sourceNode = sourceOutputNode;
          } else {
            if (!graph.node(sourceInputNode)) {
              graph.setNode(sourceInputNode, new GraphNode({
                id: sourceInputNode,
                name: input.resource,
                key: input.resource,
                class: "constrained-input",
                repeatable: true,
                url: resourceURLs[input.resource],
                svg: svg
              }));
            }

            if (graph.node(sourceJobNode)) {
              graph.addEdge(sourceJobNode, sourceInputNode, input.resource, null);
            }

            sourceNode = sourceInputNode;
          }

          graph.addEdge(sourceNode, id, input.resource, { trigger: input.trigger });
        }
      }
    }
  }

  // Process unconstrained job inputs
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const id = jobNode(job.name);
    const node = graph.node(id);

    if (!node) continue;

    for (let j = 0; j < job.inputs.length; j++) {
      const input = job.inputs[j];

      if (!input.passed || input.passed.length === 0) {
        const inputId = inputNode(job.name, input.resource + "-unconstrained");

        if (!graph.node(inputId)) {
          graph.setNode(inputId, new GraphNode({
            id: inputId,
            name: input.resource,
            key: input.resource,
            class: "input" + resourceStatus(input.resource),
            status: "",
            repeatable: true,
            url: resourceURLs[input.resource],
            svg: svg,
            equivalentBy: input.resource + "-unconstrained",
          }));
        }

        graph.addEdge(inputId, id, input.resource, { trigger: input.trigger });
      }
    }
  }

  // Compute positions and optimize the graph
  graph.computeRanks();
  graph.collapseEquivalentNodes();
  graph.addSpacingNodes();

  return graph;
}

// Helper functions for node naming
function jobNode(name: string): string {
  return "job-" + name;
}

function outputNode(jobName: string, resourceName: string): string {
  return "job-" + jobName + "-output-" + resourceName;
}

function inputNode(jobName: string, resourceName: string): string {
  return "job-" + jobName + "-input-" + resourceName;
}