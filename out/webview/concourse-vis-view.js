"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.update = update;
exports.resetZoom = resetZoom;
const yaml = __importStar(require("js-yaml"));
const d3 = __importStar(require("d3"));
const _ = __importStar(require("underscore"));
const render_1 = require("./render");
// Current active group
let activeGroup = null;
// Initialize the visualization
function init(container) {
    console.log('Initializing visualization in container', container);
    // Clear the container
    container.innerHTML = "";
    // Create initial text to confirm it's working
    const infoText = document.createElement('div');
    infoText.style.padding = '20px';
    infoText.style.fontSize = '16px';
    infoText.style.color = '#333';
    infoText.textContent = 'Concourse Pipeline Visualizer is initializing...';
    container.appendChild(infoText);
    // Add logo header
    const header = document.createElement('div');
    header.className = 'topbar-logo';
    header.textContent = 'Concourse Pipeline Visualizer';
    header.style.padding = '10px';
    header.style.textAlign = 'center';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '18px';
    header.style.fontFamily = 'Inconsolata, monospace';
    header.style.background = '#000000'; // Black background
    header.style.color = '#ffffff'; // White text
    header.style.borderBottom = '1px solid #444';
    container.appendChild(header);
    // Create groups container
    const groupsContainer = document.createElement('div');
    groupsContainer.id = 'groups-container';
    groupsContainer.style.display = 'flex';
    groupsContainer.style.flexWrap = 'wrap';
    groupsContainer.style.gap = '5px';
    groupsContainer.style.padding = '10px';
    groupsContainer.style.background = '#333';
    container.appendChild(groupsContainer);
    // Create SVG element
    console.log('Creating SVG element');
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('class', 'pipeline-graph');
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '80%');
    container.appendChild(svgElement);
    // Initialize D3 selection and SVG container
    console.log('Initializing D3');
    const svg = d3.select(svgElement);
    // Add a simple rectangle to verify D3 is working
    svg.append('rect')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 50)
        .attr('height', 50)
        .attr('fill', 'steelblue');
    console.log('Creating pipeline SVG');
    const pipelineSvg = (0, render_1.createPipelineSvg)(svg);
    console.log('Visualization initialized successfully');
    // Remove the info text after initialization
    container.removeChild(infoText);
    return { svg: pipelineSvg };
}
// Create group tabs based on pipeline data
function createGroupTabs(groups) {
    const groupsContainer = document.getElementById('groups-container');
    if (!groupsContainer)
        return;
    // Clear existing tabs
    groupsContainer.innerHTML = '';
    if (!groups || groups.length === 0) {
        // If no groups defined, create an "All" tab
        const allTab = createGroupTab('All', true);
        groupsContainer.appendChild(allTab);
        activeGroup = null;
        return;
    }
    // Create tab for each group
    groups.forEach((group, index) => {
        const isActive = index === 0 || group.name === activeGroup;
        if (isActive && activeGroup === null) {
            activeGroup = group.name;
        }
        const tab = createGroupTab(group.name, isActive);
        groupsContainer.appendChild(tab);
    });
    // Add "All" tab
    const allTab = createGroupTab('All', activeGroup === null);
    groupsContainer.appendChild(allTab);
}
// Create a single group tab element
function createGroupTab(name, isActive) {
    const tab = document.createElement('div');
    tab.className = 'group-tab';
    tab.textContent = name;
    tab.setAttribute('data-group', name);
    tab.style.padding = '8px 16px';
    tab.style.margin = '0';
    tab.style.cursor = 'pointer';
    tab.style.fontFamily = 'Inconsolata, monospace';
    tab.style.fontSize = '14px';
    tab.style.border = isActive ? '1px solid white' : '1px solid #555';
    tab.style.backgroundColor = isActive ? '#333' : '#262626';
    tab.style.color = isActive ? 'white' : '#999';
    tab.addEventListener('click', () => {
        // Set active group and update view
        setActiveGroup(name === 'All' ? null : name);
    });
    return tab;
}
// Set the active group and update the visualization
function setActiveGroup(groupName) {
    activeGroup = groupName;
    // Update tab styles
    const tabs = document.querySelectorAll('.group-tab');
    tabs.forEach(tab => {
        const tabGroup = tab.getAttribute('data-group');
        const isActive = (tabGroup === 'All' && groupName === null) ||
            (tabGroup === groupName);
        tab.style.border = isActive ? '1px solid white' : '1px solid #555';
        tab.style.backgroundColor = isActive ? '#333' : '#262626';
        tab.style.color = isActive ? 'white' : '#999';
    });
    // Filter jobs and resources based on the active group
    filterAndUpdatePipeline();
}
// Filter jobs and resources based on active group and update visualization
// Store parsed pipeline data for refiltering
let pipelineJobs = [];
let pipelineResources = [];
let pipelineSvg = null;
function filterAndUpdatePipeline() {
    // Check if we have pipeline data to work with
    if (!pipelineJobs.length || !pipelineSvg) {
        console.log('No pipeline data available for filtering');
        return;
    }
    console.log('Filtering pipeline for group:', activeGroup);
    // Filter jobs based on active group
    let filteredJobs = pipelineJobs;
    if (activeGroup !== null) {
        filteredJobs = pipelineJobs.filter(job => job.groups.includes(activeGroup));
        console.log(`Filtered to ${filteredJobs.length} jobs in group: ${activeGroup}`);
    }
    // Redraw the pipeline with filtered jobs
    (0, render_1.draw)(pipelineSvg, filteredJobs, pipelineResources);
}
// Update the visualization with new YAML content
function update(svg, rawYaml) {
    console.log('Updating visualization with YAML content, length:', rawYaml.length);
    if (!svg) {
        console.error('SVG container not initialized');
        return;
    }
    try {
        // Parse YAML
        console.log('Parsing YAML');
        const obj = yaml.load(rawYaml);
        if (!obj) {
            console.warn('YAML parsed to null or undefined');
            return;
        }
        console.log('YAML parsed successfully, keys:', Object.keys(obj));
        // Extract resources, jobs, and groups
        const resources = obj.resources || [];
        const jobs = obj.jobs || [];
        const groups = obj.groups || [];
        console.log(`Found ${resources.length} resources, ${jobs.length} jobs, and ${groups.length} groups`);
        // Create group tabs
        createGroupTabs(groups);
        // Quick check of data for debugging
        if (resources.length === 0 || jobs.length === 0) {
            console.warn('No resources or jobs found in YAML');
            // Draw text in SVG for debugging
            svg.html("");
            svg.append("text")
                .attr("x", 100)
                .attr("y", 100)
                .attr("fill", "red")
                .text(`Pipeline data incomplete: ${resources.length} resources, ${jobs.length} jobs`);
            return;
        }
        // Process each job to extract inputs and outputs
        _.each(jobs, function (job) {
            console.log('Processing job:', job.name);
            // For the visualization, we'll assume all jobs are successful
            // This can be enhanced with real status if available
            job.finished_build = {
                status: "succeeded"
            };
            // Store original groups from the pipeline definition
            job.groups = [];
            // Find which groups this job belongs to
            groups.forEach((group) => {
                if (group.jobs.includes(job.name)) {
                    job.groups.push(group.name);
                }
            });
            const inputs = [];
            const outputs = [];
            // Process each plan item
            if (job.plan) {
                _.each(job.plan, function (plan) {
                    // Recursively extract inputs and outputs
                    console.log('Processing plan item in job', job.name);
                    const result = iteratePlan(plan, null, null, plan, inputs, outputs);
                });
            }
            else {
                console.warn('Job has no plan:', job.name);
            }
            job.inputs = inputs;
            job.outputs = outputs;
            console.log(`Job ${job.name} has ${inputs.length} inputs and ${outputs.length} outputs`);
        });
        // Store pipeline data for future filtering
        pipelineJobs = jobs;
        pipelineResources = resources;
        pipelineSvg = svg;
        // Filter jobs based on active group
        let filteredJobs = jobs;
        if (activeGroup !== null) {
            filteredJobs = jobs.filter((job) => job.groups.includes(activeGroup));
            console.log(`Filtered to ${filteredJobs.length} jobs in group: ${activeGroup}`);
        }
        // Draw the pipeline with filtered jobs
        console.log('Drawing pipeline with D3');
        (0, render_1.draw)(svg, filteredJobs, resources);
        console.log('Pipeline drawing complete');
    }
    catch (e) {
        console.error('Error parsing or processing YAML:', e);
        svg.html("");
        svg.append("text")
            .attr("x", 100)
            .attr("y", 100)
            .attr("fill", "red")
            .text(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
}
// Reset zoom to fit the entire pipeline
function resetZoom() {
    (0, render_1.resetPipelineFocus)();
}
// Recursively process the job plan to extract inputs and outputs
function iteratePlan(obj, id, parent, plan, inputs, outputs) {
    // Iterate through all properties of the current object
    for (const property in obj) {
        if (property === "get") {
            // Handle 'get' step (input)
            if (parent === null) {
                inputs.push({
                    name: obj[property],
                    resource: obj[property],
                    trigger: obj.trigger ? obj.trigger : false,
                    passed: obj["passed"]
                });
            }
            else {
                inputs.push({
                    name: obj[property],
                    resource: parent[id]?.resource ? parent[id].resource : obj[property],
                    trigger: parent[id]?.trigger ? parent[id].trigger : false,
                    passed: parent[id]?.passed ? parent[id].passed : null
                });
            }
        }
        if (property === "put") {
            // Handle 'put' step (output)
            outputs.push({
                name: obj[property],
                resource: obj[property]
            });
        }
        // Recursively process nested objects
        if (typeof (obj[property]) === "object" && obj[property] !== null) {
            iteratePlan(obj[property], property, obj, plan, inputs, outputs);
        }
    }
    return [inputs, outputs];
}
//# sourceMappingURL=concourse-vis-view.js.map