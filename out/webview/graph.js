"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeTarget = exports.EdgeSource = exports.Edge = exports.GraphNode = exports.Graph = void 0;
const KEY_HEIGHT = 20;
const KEY_SPACING = 10;
const RANK_GROUP_SPACING = 50;
const NODE_PADDING = 5;
// Graph class manages nodes and edges
class Graph {
    constructor() {
        this._nodes = {};
        this._edges = [];
    }
    setNode(id, value) {
        this._nodes[id] = value;
    }
    removeNode(id) {
        const node = this._nodes[id];
        if (!node)
            return;
        // Remove all incoming edges
        for (let i = 0; i < node._inEdges.length; i++) {
            const edge = node._inEdges[i];
            const sourceNode = edge.source.node;
            const idx = sourceNode._outEdges.indexOf(edge);
            sourceNode._outEdges.splice(idx, 1);
            const graphIdx = this._edges.indexOf(edge);
            this._edges.splice(graphIdx, 1);
        }
        // Remove all outgoing edges
        for (let i = 0; i < node._outEdges.length; i++) {
            const edge = node._outEdges[i];
            const targetNode = edge.target.node;
            const idx = targetNode._inEdges.indexOf(edge);
            targetNode._inEdges.splice(idx, 1);
            const graphIdx = this._edges.indexOf(edge);
            this._edges.splice(graphIdx, 1);
        }
        delete this._nodes[id];
    }
    addEdge(sourceId, targetId, key, customData) {
        const source = this._nodes[sourceId];
        if (source === undefined) {
            throw new Error(`source node does not exist: ${sourceId}`);
        }
        const target = this._nodes[targetId];
        if (target === undefined) {
            throw new Error(`target node does not exist: ${targetId}`);
        }
        // Check if the edge already exists
        for (let i = 0; i < target._inEdges.length; i++) {
            if (target._inEdges[i].source.node.id === source.id) {
                // Edge already exists; skip
                return;
            }
        }
        if (source._edgeKeys.indexOf(key) === -1) {
            source._edgeKeys.push(key);
        }
        if (target._edgeKeys.indexOf(key) === -1) {
            target._edgeKeys.push(key);
        }
        let edgeSource = source._edgeSources[key];
        if (!edgeSource) {
            edgeSource = new EdgeSource(source, key);
            source._edgeSources[key] = edgeSource;
        }
        let edgeTarget = target._edgeTargets[key];
        if (!edgeTarget) {
            edgeTarget = new EdgeTarget(target, key);
            target._edgeTargets[key] = edgeTarget;
        }
        const edge = new Edge(edgeSource, edgeTarget, key, customData);
        target._inEdges.push(edge);
        source._outEdges.push(edge);
        this._edges.push(edge);
    }
    removeEdge(edge) {
        const inIdx = edge.target.node._inEdges.indexOf(edge);
        edge.target.node._inEdges.splice(inIdx, 1);
        const outIdx = edge.source.node._outEdges.indexOf(edge);
        edge.source.node._outEdges.splice(outIdx, 1);
        const graphIdx = this._edges.indexOf(edge);
        this._edges.splice(graphIdx, 1);
    }
    node(id) {
        return this._nodes[id];
    }
    nodes() {
        const nodes = [];
        for (const id in this._nodes) {
            nodes.push(this._nodes[id]);
        }
        return nodes;
    }
    edges() {
        return this._edges;
    }
    layout() {
        const rankGroups = [];
        // Assign nodes to rank groups
        for (const id in this._nodes) {
            const node = this._nodes[id];
            const rankGroupIdx = node.rank();
            let rankGroup = rankGroups[rankGroupIdx];
            if (!rankGroup) {
                rankGroup = new RankGroup(rankGroupIdx);
                rankGroups[rankGroupIdx] = rankGroup;
            }
            rankGroup.nodes.push(node);
        }
        // Initial x positioning
        for (const id in this._nodes) {
            const node = this._nodes[id];
            const rankGroup = node.rank();
            let rankGroupOffset = 0;
            for (let c = 0; c < rankGroups.length; c++) {
                if (c < rankGroup && rankGroups[c]) {
                    rankGroupOffset += rankGroups[c].width() + RANK_GROUP_SPACING;
                }
            }
            node._position.x = rankGroupOffset + ((rankGroups[rankGroup].width() - node.width()) / 2);
            // Sort edge keys
            node._edgeKeys.sort((a, b) => {
                const targetA = node._edgeTargets[a];
                const targetB = node._edgeTargets[b];
                if (targetA && !targetB) {
                    return -1;
                }
                else if (!targetA && targetB) {
                    return 1;
                }
                if (targetA && targetB) {
                    const introRankA = targetA.rankOfFirstAppearance();
                    const introRankB = targetB.rankOfFirstAppearance();
                    if (introRankA < introRankB) {
                        return -1;
                    }
                    else if (introRankA > introRankB) {
                        return 1;
                    }
                }
                const sourceA = node._edgeSources[a];
                const sourceB = node._edgeSources[b];
                if (sourceA && !sourceB) {
                    return -1;
                }
                else if (!sourceA && sourceB) {
                    return 1;
                }
                return compareNames(a, b);
            });
        }
        // Two pass layout
        for (let repeat = 0; repeat < 2; repeat++) {
            for (let c = 0; c < rankGroups.length; c++) {
                if (rankGroups[c]) {
                    rankGroups[c].sortNodes();
                    rankGroups[c].layout();
                }
            }
        }
        // Tug process for better alignment
        let anyChanged = true;
        while (anyChanged) {
            anyChanged = false;
            for (let c = 0; c < rankGroups.length; c++) {
                if (rankGroups[c] && rankGroups[c].tug()) {
                    anyChanged = true;
                }
            }
        }
    }
    computeRanks() {
        let forwardNodes = {};
        // Initialize ranks for source nodes (no incoming edges)
        for (const n in this._nodes) {
            const node = this._nodes[n];
            if (node._inEdges.length === 0) {
                node._cachedRank = 0;
                forwardNodes[node.id] = node;
            }
        }
        const bottomNodes = {};
        // Forward pass - determine ranks from left to right
        while (!objectIsEmpty(forwardNodes)) {
            let nextNodes = {};
            for (const n in forwardNodes) {
                const node = forwardNodes[n];
                if (node._outEdges.length === 0) {
                    bottomNodes[node.id] = node;
                }
                for (let e = 0; e < node._outEdges.length; e++) {
                    const nextNode = node._outEdges[e].target.node;
                    // Place destination nodes as far right as possible
                    nextNode._cachedRank = Math.max(nextNode._cachedRank, node._cachedRank + 1);
                    nextNodes[nextNode.id] = nextNode;
                }
            }
            forwardNodes = nextNodes;
        }
        let backwardNodes = bottomNodes;
        // Backward pass - bring upstream nodes as close as possible
        while (!objectIsEmpty(backwardNodes)) {
            const prevNodes = {};
            for (const n in backwardNodes) {
                const node = backwardNodes[n];
                for (let e = 0; e < node._inEdges.length; e++) {
                    const prevNode = node._inEdges[e].source.node;
                    const latestRank = prevNode.latestPossibleRank();
                    if (latestRank !== undefined) {
                        prevNode._cachedRank = latestRank;
                    }
                    prevNodes[prevNode.id] = prevNode;
                }
            }
            backwardNodes = prevNodes;
        }
    }
    collapseEquivalentNodes() {
        const nodesByRank = [];
        // Group nodes by rank and equivalence
        for (const n in this._nodes) {
            const node = this._nodes[n];
            if (node.equivalentBy === undefined) {
                continue;
            }
            let byRank = nodesByRank[node.rank()];
            if (byRank === undefined) {
                byRank = {};
                nodesByRank[node.rank()] = byRank;
            }
            let byEqv = byRank[node.equivalentBy];
            if (byEqv === undefined) {
                byEqv = [];
                byRank[node.equivalentBy] = byEqv;
            }
            byEqv.push(node);
        }
        // Collapse equivalent nodes
        for (const r in nodesByRank) {
            const byEqv = nodesByRank[r];
            for (const e in byEqv) {
                const nodes = byEqv[e];
                if (nodes.length === 1) {
                    continue;
                }
                const chosenOne = nodes[0];
                for (let i = 1; i < nodes.length; i++) {
                    const loser = nodes[i];
                    // Transfer incoming edges
                    for (let ie = 0; ie < loser._inEdges.length; ie++) {
                        const edge = loser._inEdges[ie];
                        this.addEdge(edge.source.node.id, chosenOne.id, edge.key, edge.customData);
                    }
                    // Transfer outgoing edges
                    for (let oe = 0; oe < loser._outEdges.length; oe++) {
                        const edge = loser._outEdges[oe];
                        this.addEdge(chosenOne.id, edge.target.node.id, edge.key, edge.customData);
                    }
                    this.removeNode(loser.id);
                }
            }
        }
    }
    addSpacingNodes() {
        const edgesToRemove = [];
        for (let e = 0; e < this._edges.length; e++) {
            const edge = this._edges[e];
            const delta = edge.target.node.rank() - edge.source.node.rank();
            if (delta > 1) {
                let upstreamNode = edge.source.node;
                const downstreamNode = edge.target.node;
                let repeatedNode;
                let initialCustomData;
                let finalCustomData;
                if (edge.source.node.repeatable) {
                    repeatedNode = upstreamNode;
                    initialCustomData = null;
                    finalCustomData = edge.customData;
                }
                else {
                    repeatedNode = downstreamNode;
                    initialCustomData = edge.customData;
                    finalCustomData = null;
                }
                for (let i = 0; i < (delta - 1); i++) {
                    const spacerID = edge.id() + "-spacing-" + i;
                    let spacingNode = this.node(spacerID);
                    if (!spacingNode) {
                        spacingNode = repeatedNode.copy();
                        spacingNode.id = spacerID;
                        spacingNode._cachedRank = upstreamNode.rank() + 1;
                        this.setNode(spacingNode.id, spacingNode);
                    }
                    const currentCustomData = (i === 0 ? initialCustomData : null);
                    this.addEdge(upstreamNode.id, spacingNode.id, edge.key, currentCustomData);
                    upstreamNode = spacingNode;
                }
                this.addEdge(upstreamNode.id, edge.target.node.id, edge.key, finalCustomData);
                edgesToRemove.push(edge);
            }
        }
        for (let e = 0; e < edgesToRemove.length; e++) {
            this.removeEdge(edgesToRemove[e]);
        }
    }
}
exports.Graph = Graph;
// GraphNode class represents a node in the graph
class GraphNode {
    constructor(opts) {
        this._edgeTargets = {};
        this._edgeSources = {};
        this._edgeKeys = [];
        this._inEdges = [];
        this._outEdges = [];
        this._cachedRank = -1;
        this._cachedWidth = 0;
        this._keyOffset = 0;
        this._position = { x: 0, y: 0 };
        this.id = opts.id;
        this.name = opts.name;
        this.class = opts.class || '';
        this.status = opts.status;
        this.repeatable = opts.repeatable;
        this.key = opts.key;
        this.url = opts.url;
        this.svg = opts.svg;
        this.equivalentBy = opts.equivalentBy;
    }
    copy() {
        return new GraphNode({
            id: this.id,
            name: this.name,
            class: this.class,
            status: this.status,
            repeatable: this.repeatable,
            key: this.key,
            url: this.url,
            svg: this.svg,
            equivalentBy: this.equivalentBy
        });
    }
    width() {
        if (this._cachedWidth === 0 && this.svg) {
            const id = this.id;
            const svgNode = this.svg.selectAll("g.node").filter(function (node) {
                return node.id === id;
            });
            const textNode = svgNode.select("text").node();
            if (textNode) {
                this._cachedWidth = textNode.getBBox().width;
            }
            else {
                return 0;
            }
        }
        return this._cachedWidth + (NODE_PADDING * 2);
    }
    height() {
        const keys = Math.max(this._edgeKeys.length, 1);
        return (KEY_HEIGHT * keys) + (KEY_SPACING * (keys - 1));
    }
    position() {
        return {
            x: this._position.x,
            y: (KEY_HEIGHT + KEY_SPACING) * this._keyOffset
        };
    }
    animationRadius() {
        if (this.class.search('job') > -1) {
            return 70;
        }
        return 0;
    }
    rank() {
        return this._cachedRank;
    }
    latestPossibleRank() {
        let latestRank;
        for (let o = 0; o < this._outEdges.length; o++) {
            const prevTargetNode = this._outEdges[o].target.node;
            const targetPrecedingRank = prevTargetNode.rank() - 1;
            if (latestRank === undefined) {
                latestRank = targetPrecedingRank;
            }
            else {
                latestRank = Math.min(latestRank, targetPrecedingRank);
            }
        }
        return latestRank;
    }
    dependsOn(node, stack = []) {
        for (let i = 0; i < this._inEdges.length; i++) {
            const source = this._inEdges[i].source.node;
            if (source === node) {
                return true;
            }
            if (stack.indexOf(this) !== -1) {
                continue;
            }
            stack.push(this);
            if (source.dependsOn(node, stack)) {
                return true;
            }
        }
        return false;
    }
    highestUpstreamSource() {
        let minY;
        for (let e = 0; e < this._inEdges.length; e++) {
            const y = this._inEdges[e].source.effectiveKeyOffset();
            if (minY === undefined || y < minY) {
                minY = y;
            }
        }
        return minY;
    }
    highestDownstreamTarget() {
        let minY;
        for (let e = 0; e < this._outEdges.length; e++) {
            const y = this._outEdges[e].target.effectiveKeyOffset();
            if (minY === undefined || y < minY) {
                minY = y;
            }
        }
        return minY;
    }
    inAlignment() {
        let minAlignment;
        for (let e = 0; e < this._inEdges.length; e++) {
            const edge = this._inEdges[e];
            const offset = edge.source.effectiveKeyOffset();
            if (minAlignment === undefined || offset < minAlignment) {
                minAlignment = offset - this._edgeKeys.indexOf(edge.key);
            }
        }
        return minAlignment;
    }
    outAlignment() {
        let minAlignment;
        for (let e = 0; e < this._outEdges.length; e++) {
            const edge = this._outEdges[e];
            const offset = edge.target.effectiveKeyOffset();
            if (minAlignment === undefined || offset < minAlignment) {
                minAlignment = offset - this._edgeKeys.indexOf(edge.key);
            }
        }
        return minAlignment;
    }
    passedThroughAnyPreviousNode() {
        for (let e = 0; e < this._inEdges.length; e++) {
            const edge = this._inEdges[e];
            if (edge.key in edge.source.node._edgeTargets) {
                return true;
            }
        }
        return false;
    }
    passesThroughAnyNextNode() {
        for (let e = 0; e < this._outEdges.length; e++) {
            const edge = this._outEdges[e];
            if (edge.key in edge.target.node._edgeSources) {
                return true;
            }
        }
        return false;
    }
}
exports.GraphNode = GraphNode;
// Ordering class manages space allocation in a rank group
class Ordering {
    constructor() {
        this.spaces = [];
    }
    fill(pos, len) {
        for (let i = pos; i < pos + len; i++) {
            this.spaces[i] = true;
        }
    }
    free(pos, len) {
        for (let i = pos; i < pos + len; i++) {
            this.spaces[i] = false;
        }
    }
    isFree(pos, len) {
        for (let i = pos; i < pos + len; i++) {
            if (this.spaces[i]) {
                return false;
            }
        }
        return true;
    }
}
// RankGroup class manages nodes at the same rank
class RankGroup {
    constructor(idx) {
        this.nodes = [];
        this.ordering = new Ordering();
        this.index = idx;
    }
    sortNodes() {
        const nodes = this.nodes;
        const before = this.nodes.slice();
        nodes.sort((a, b) => {
            if (a._inEdges.length && b._inEdges.length) {
                // Position nodes closer to their upstream sources
                const aSource = a.highestUpstreamSource();
                const bSource = b.highestUpstreamSource();
                if (aSource !== undefined && bSource !== undefined) {
                    const compare = aSource - bSource;
                    if (compare !== 0) {
                        return compare;
                    }
                }
            }
            if (a._outEdges.length && b._outEdges.length) {
                // Position nodes closer to their downstream targets
                const aTarget = a.highestDownstreamTarget();
                const bTarget = b.highestDownstreamTarget();
                if (aTarget !== undefined && bTarget !== undefined) {
                    const compare = aTarget - bTarget;
                    if (compare !== 0) {
                        return compare;
                    }
                }
            }
            if (a._inEdges.length && b._outEdges.length) {
                // Position nodes closer to their sources than others that are just
                // closer to their destinations
                const aSource = a.highestUpstreamSource();
                const bTarget = b.highestDownstreamTarget();
                if (aSource !== undefined && bTarget !== undefined) {
                    const compare = aSource - bTarget;
                    if (compare !== 0) {
                        return compare;
                    }
                }
            }
            if (a._outEdges.length && b._inEdges.length) {
                // Position nodes closer to their sources than others that are just
                // closer to their destinations
                const aTarget = a.highestDownstreamTarget();
                const bSource = b.highestUpstreamSource();
                if (aTarget !== undefined && bSource !== undefined) {
                    const compare = aTarget - bSource;
                    if (compare !== 0) {
                        return compare;
                    }
                }
            }
            // Place nodes that threaded through upstream nodes higher
            const aPassedThrough = a.passedThroughAnyPreviousNode();
            const bPassedThrough = b.passedThroughAnyPreviousNode();
            if (aPassedThrough && !bPassedThrough) {
                return -1;
            }
            // Place nodes that thread through downstream nodes higher
            const aPassesThrough = a.passesThroughAnyNextNode();
            const bPassesThrough = b.passesThroughAnyNextNode();
            if (aPassesThrough && !bPassesThrough) {
                return -1;
            }
            // Place nodes with more out edges higher
            const byOutEdges = b._outEdges.length - a._outEdges.length;
            if (byOutEdges !== 0) {
                return byOutEdges;
            }
            if (!aPassesThrough && bPassesThrough) {
                return 1;
            }
            // Both are of equivalent; compare names so it's at least deterministic
            a.debugMarked = true; // to aid in debugging (adds .marked css class)
            b.debugMarked = true;
            return compareNames(a.name, b.name);
        });
        let changed = false;
        for (let c = 0; c < nodes.length; c++) {
            if (nodes[c] !== before[c]) {
                changed = true;
            }
        }
        return changed;
    }
    mark() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].rankGroupMarked = true;
        }
    }
    width() {
        let width = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            width = Math.max(width, this.nodes[i].width());
        }
        return width;
    }
    layout() {
        let rollingKeyOffset = 0;
        this.ordering = new Ordering();
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            node._keyOffset = rollingKeyOffset;
            this.ordering.fill(rollingKeyOffset, node._edgeKeys.length);
            rollingKeyOffset += Math.max(node._edgeKeys.length, 1);
        }
    }
    tug() {
        let changed = false;
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            const align = node.inAlignment();
            if (align !== undefined && node._keyOffset < align &&
                this.ordering.isFree(align, node._edgeKeys.length)) {
                this.ordering.free(node._keyOffset, node._edgeKeys.length);
                node._keyOffset = align;
                this.ordering.fill(node._keyOffset, node._edgeKeys.length);
                changed = true;
            }
            else {
                const outAlign = node.outAlignment();
                if (outAlign !== undefined && node._keyOffset < outAlign &&
                    this.ordering.isFree(outAlign, node._edgeKeys.length)) {
                    this.ordering.free(node._keyOffset, node._edgeKeys.length);
                    node._keyOffset = outAlign;
                    this.ordering.fill(node._keyOffset, node._edgeKeys.length);
                    changed = true;
                }
            }
        }
        this.nodes.sort((a, b) => {
            return a._keyOffset - b._keyOffset;
        });
        return changed;
    }
}
// Edge class represents a connection between two nodes
class Edge {
    constructor(source, target, key, customData) {
        this.source = source;
        this.target = target;
        this.key = key;
        this.customData = customData;
    }
    id() {
        return this.source.id() + "-to-" + this.target.id();
    }
    bezierPoints() {
        const sourcePosition = this.source.position();
        const targetPosition = this.target.position();
        const curvature = 0.5;
        let point2, point3;
        if (sourcePosition.x > targetPosition.x) {
            const belowSourceNode = this.source.node.position().y + this.source.node.height();
            const belowTargetNode = this.target.node.position().y + this.target.node.height();
            point2 = {
                x: sourcePosition.x + 100,
                y: belowSourceNode + 100
            };
            point3 = {
                x: targetPosition.x - 100,
                y: belowTargetNode + 100
            };
        }
        else {
            const xi = (t) => sourcePosition.x * (1 - t) + targetPosition.x * t;
            point2 = {
                x: xi(curvature),
                y: sourcePosition.y
            };
            point3 = {
                x: xi(1 - curvature),
                y: targetPosition.y
            };
        }
        const points = [sourcePosition, point2, point3, targetPosition];
        return points;
    }
    path() {
        const points = this.bezierPoints();
        return "M" + points[0].x + "," + points[0].y
            + " C" + points[1].x + "," + points[1].y
            + " " + points[2].x + "," + points[2].y
            + " " + points[3].x + "," + points[3].y;
    }
}
exports.Edge = Edge;
// EdgeSource class represents the source end of an edge
class EdgeSource {
    constructor(node, key) {
        this.node = node;
        this.key = key;
    }
    width() {
        return 0;
    }
    height() {
        return 0;
    }
    effectiveKeyOffset() {
        return this.node._keyOffset + this.node._edgeKeys.indexOf(this.key);
    }
    id() {
        return this.node.id + "-" + this.key + "-source";
    }
    position() {
        return {
            x: this.node.position().x + this.node.width(),
            y: (KEY_HEIGHT / 2) + this.effectiveKeyOffset() * (KEY_HEIGHT + KEY_SPACING)
        };
    }
}
exports.EdgeSource = EdgeSource;
// EdgeTarget class represents the target end of an edge
class EdgeTarget {
    constructor(node, key) {
        this.node = node;
        this.key = key;
    }
    width() {
        return 0;
    }
    height() {
        return 0;
    }
    effectiveKeyOffset() {
        return this.node._keyOffset + this.node._edgeKeys.indexOf(this.key);
    }
    rankOfFirstAppearance() {
        if (this._rankOfFirstAppearance !== undefined) {
            return this._rankOfFirstAppearance;
        }
        const inEdges = this.node._inEdges;
        let rank = Infinity;
        for (let i = 0; i < inEdges.length; i++) {
            const inEdge = inEdges[i];
            if (inEdge.source.key === this.key) {
                const upstreamNodeInEdges = inEdge.source.node._inEdges;
                if (upstreamNodeInEdges.length === 0) {
                    rank = inEdge.source.node.rank();
                    break;
                }
                let foundUpstreamInEdge = false;
                for (let j = 0; j < upstreamNodeInEdges.length; j++) {
                    const upstreamEdge = upstreamNodeInEdges[j];
                    if (upstreamEdge.target.key === this.key) {
                        foundUpstreamInEdge = true;
                        const upstreamRank = upstreamEdge.target.rankOfFirstAppearance();
                        if (upstreamRank < rank) {
                            rank = upstreamRank;
                        }
                    }
                }
                if (!foundUpstreamInEdge) {
                    rank = inEdge.source.node.rank();
                    break;
                }
            }
        }
        this._rankOfFirstAppearance = rank;
        return rank;
    }
    id() {
        return this.node.id + "-" + this.key + "-target";
    }
    position() {
        return {
            x: this.node.position().x,
            y: (KEY_HEIGHT / 2) + this.effectiveKeyOffset() * (KEY_HEIGHT + KEY_SPACING)
        };
    }
}
exports.EdgeTarget = EdgeTarget;
// Helper function to compare names
function compareNames(a, b) {
    const byLength = a.length - b.length;
    if (byLength !== 0) {
        // Place shorter names higher
        return byLength;
    }
    return a.localeCompare(b);
}
// Helper function to check if an object is empty
function objectIsEmpty(o) {
    for (const x in o) {
        return false;
    }
    return true;
}
//# sourceMappingURL=graph.js.map