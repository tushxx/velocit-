import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { RepoAnalysis, GraphNode, GraphLink } from '../types';
import { getFileContent } from '../services/geminiService';
import { 
  GitBranch, 
  Layers, 
  Activity, 
  Database, 
  FileCode,
  Maximize2,
  X,
  Settings,
  Github,
  ArrowLeft,
  ChevronRight,
  Code2,
  Download,
  ZoomIn,
  ZoomOut,
  FileText,
  Folder,
  FolderOpen,
  ChevronDown,
  Users,
  History,
  LayoutGrid,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { PipelineView, StackView, CollaborationView, HistoryView } from './RepoVisualizerViews';
import { RepoOverview } from './RepoOverview';
import { HotspotAnalytics } from './HotspotAnalytics';
import { ActivityContext } from './ActivityContext';
import { PRVisualizer } from './PRVisualizer';
import { RepoSummary } from './RepoSummary';

interface RepoVisualizerProps {
  data: RepoAnalysis;
  repoUrl: string;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

interface TreeNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  _children?: TreeNode[]; // For collapsed state
  data?: GraphNode;
}

type VisualizerTab = 'dashboard' | 'graph' | 'pipeline' | 'stack' | 'collaboration' | 'history';

export const RepoVisualizer: React.FC<RepoVisualizerProps> = ({ data, repoUrl, onClose, theme = 'dark' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [rootData, setRootData] = useState<TreeNode | null>(null);
  const [activeTab, setActiveTab] = useState<VisualizerTab>('dashboard');
  const [githubIssues, setGithubIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  
  // New State for Interactivity
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'dependency' | 'risk'>('all');
  const [tooltip, setTooltip] = useState<{x: number, y: number, content: string} | null>(null);

  // Helper to get repo name from URL
  const getRepoName = (url: string) => {
    try {
      const parts = url.split('/');
      return parts.slice(-2).join('/');
    } catch (e) {
      return url;
    }
  };

  const repoName = useMemo(() => getRepoName(repoUrl), [repoUrl]);

  // Build Hierarchy from flat nodes
  useEffect(() => {
    if (!data) return;

    const buildHierarchy = () => {
      const root: TreeNode = { name: repoName, path: repoName, type: 'folder', children: [] };
      const map = new Map<string, TreeNode>();
      map.set(repoName, root);

      // Sort nodes to ensure folders are created before files if possible, 
      // but we'll handle missing parents dynamically.
      // We primarily care about 'file' nodes to build the tree.
      // We also need to handle 'dependency' nodes separately or integrate them.
      // For now, let's focus on the file structure.

      data.nodes.forEach(node => {
        if (node.group === 'dependency') return; // Skip dependencies in the tree view for now

        const parts = node.id.split('/');
        // parts[0] is owner, parts[1] is repo. 
        // We want to start from parts[2] relative to root.
        // Actually, node.id is full path "owner/repo/path/to/file".
        
        let currentPath = `${parts[0]}/${parts[1]}`;
        let currentDir = root;

        for (let i = 2; i < parts.length; i++) {
          const part = parts[i];
          currentPath += `/${part}`;
          
          let child = map.get(currentPath);
          if (!child) {
            child = {
              name: part,
              path: currentPath,
              type: i === parts.length - 1 && node.group !== 'config' && node.group !== 'folder' ? 'file' : 'folder', // Simple heuristic
              children: []
            };
            // If it's the actual node from data, attach it
            if (currentPath === node.id) {
                child.data = node;
                child.type = 'file'; // It's a file if it's in the node list (usually)
            } else {
                child.type = 'folder';
            }
            
            if (!currentDir.children) currentDir.children = [];
            currentDir.children.push(child);
            map.set(currentPath, child);
          }
          currentDir = child;
        }
      });

      return root;
    };

    setRootData(buildHierarchy());
    setRootData(buildHierarchy());
  }, [data, repoName]);

  // Fetch GitHub Issues
  useEffect(() => {
    const fetchIssues = async () => {
      if (!repoUrl.includes('github.com')) return;
      setLoadingIssues(true);
      try {
        const path = repoUrl.split('github.com/')[1];
        const res = await fetch(`https://api.github.com/repos/${path}/issues?state=open&per_page=20`);
        if (res.ok) {
          const issues = await res.json();
          setGithubIssues(issues);
        }
      } catch (e) {
        console.error("Failed to fetch issues", e);
      } finally {
        setLoadingIssues(false);
      }
    };
    fetchIssues();
  }, [repoUrl]);

  // Map issues to nodes
  const nodesWithIssues = useMemo(() => {
    if (!data?.nodes) return [];
    return data.nodes.map(node => {
      // Find issues that mention this filename
      const relatedIssues = githubIssues.filter(issue => 
        issue.title.includes(node.label) || 
        (issue.body && issue.body.includes(node.label)) ||
        (issue.body && issue.body.includes(node.id))
      );
      
      return {
        ...node,
        githubIssues: relatedIssues
      };
    });
  }, [data, githubIssues]);

  // Get unlinked issues
  const unlinkedIssues = useMemo(() => {
    const linkedIds = new Set(nodesWithIssues.flatMap(n => n.githubIssues.map((i: any) => i.id)));
    return githubIssues.filter(i => !linkedIds.has(i.id));
  }, [githubIssues, nodesWithIssues]);

  const handleViewSource = async () => {
    if (!selectedNode || selectedNode.group === 'dependency') return;
    setIsLoadingSource(true);
    try {
      const content = await getFileContent(repoUrl, selectedNode.id);
      setSourceCode(content);
    } catch (e) {
      console.error("Failed to load source", e);
      setSourceCode("// Failed to load source code.");
    } finally {
      setIsLoadingSource(false);
    }
  };

  const handleExport = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${repoName.replace('/', '-')}-map.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // D3 Rendering
  useEffect(() => {
    if (activeTab !== 'graph' || !svgRef.current || !rootData || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(Math.round(event.transform.k * 100));
      });

    svg.call(zoom);
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(50, height / 2).scale(0.8));

    // Tree Layout
    const treeLayout = d3.tree<TreeNode>().nodeSize([30, 250]); // [height, width]
    const root = d3.hierarchy<TreeNode>(rootData);

    // Collapse function
    // Collapse all except first level by default? No, let's show expanded.
    // root.children?.forEach(collapse); 

    // Collapse function
    // Collapse all except first level by default? No, let's show expanded.
    // root.children?.forEach(collapse); 

    function update(source: any) {
      const treeData = treeLayout(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      // Filter nodes based on search/filter
      // Note: In a tree layout, hiding parent hides children. 
      // For search, we might want to highlight instead of filter to keep structure.
      
      // --- Nodes ---
      const node = g.selectAll<SVGGElement, d3.HierarchyPointNode<TreeNode>>(".node")
        .data(nodes, (d: any) => d.data.path);

      const nodeEnter = node.enter().append("g")
        .attr("class", "node cursor-pointer")
        .attr("transform", (d) => `translate(${source.y0 || source.y},${source.x0 || source.x})`)
        .on("click", (event, d) => {
          event.stopPropagation();
          if (d.data.type === 'folder') {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          } else {
            // File click
            if (d.data.data) {
                setSelectedNode(d.data.data);
            }
          }
        })
        .on("mouseover", (event, d) => {
            setHoveredNode(d.data);
            
            // Tooltip
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setTooltip({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                    content: d.data.name
                });
            }
        })
        .on("mouseout", () => {
            setHoveredNode(null);
            setTooltip(null);
        });

      // Node Circle/Icon
      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", (d) => d.data.type === 'folder' ? (d.children ? "#3B82F6" : "#60A5FA") : "#10B981");

      // Node Label
      nodeEnter.append("text")
        .attr("dy", ".35em")
        .attr("x", (d) => d.children || d._children ? -13 : 13)
        .attr("text-anchor", (d) => d.children || d._children ? "end" : "start")
        .text((d) => d.data.name)
        .style("fill-opacity", 1e-6)
        .style("font-size", "12px")
        .style("font-family", "Inter, sans-serif")
        .style("fill", theme === 'dark' ? "#e5e5e5" : "#333");

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter as any).transition().duration(200)
        .attr("transform", (d) => `translate(${d.y},${d.x})`)
        .style("opacity", (d) => {
            // Interactivity Logic: Opacity
            if (filterType === 'dependency' && d.data.data?.group !== 'dependency' && d.data.type !== 'folder') return 0.1;
            if (filterType === 'risk' && (!d.data.data?.issues || d.data.data.issues.length === 0) && d.data.type !== 'folder') return 0.1;
            
            if (searchQuery && !d.data.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                // If search active, dim non-matches
                // But keep path to matches visible? Complex. Simple dim for now.
                return 0.2;
            }
            
            if (hoveredNode) {
                // Dim if not hovered or connected
                // For tree, maybe just dim everything else slightly?
                // Or check if it's the node or a direct relative?
                return 1; // Keep simple for now, maybe just highlight the hovered one
            }
            return 1;
        });

      nodeUpdate.select("circle")
        .attr("r", (d) => {
            if (d.data.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery) return 10;
            return 6;
        })
        .style("fill", (d) => {
            if (d.data.type === 'folder') return d.children ? "#3B82F6" : "#60A5FA"; // Blue for folders
            
            // Check for GitHub issues
            const nodeWithIssues = nodesWithIssues.find(n => n.id === d.data.data?.id);
            if (nodeWithIssues?.githubIssues && nodeWithIssues.githubIssues.length > 0) {
                return '#EF4444'; // Red if it has GitHub issues
            }

            // Color by group if available
            if (d.data.data) {
                switch(d.data.data.group) {
                    case 'api': return '#00d907';
                    case 'database': return '#3B82F6';
                    case 'component': return '#A855F7';
                    case 'config': return '#EAB308';
                    default: return '#10B981';
                }
            }
            return "#10B981";
        })
        .style("stroke", (d) => {
            if (d.data.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery) return "#fff";
            return "none";
        })
        .style("stroke-width", (d) => {
            if (d.data.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery) return 2;
            return 0;
        });

      nodeUpdate.select("text")
        .style("fill-opacity", 1)
        .style("font-weight", (d) => d.data.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery ? "bold" : "normal");

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition().duration(200)
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // --- Links ---
      const link = g.selectAll<SVGPathElement, d3.HierarchyLink<TreeNode>>(".link")
        .data(links, (d: any) => d.target.data.path);

      const linkEnter = link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", (d) => {
          const o = { x: source.x0 || source.x, y: source.y0 || source.y };
          return diagonal(o, o);
        })
        .style("fill", "none")
        .style("stroke", theme === 'dark' ? "#333" : "#e5e7eb")
        .style("stroke-width", "1.5px");

      const linkUpdate = link.merge(linkEnter as any).transition().duration(200)
        .attr("d", (d) => diagonal(d.source, d.target))
        .style("opacity", (d) => {
             if (searchQuery) return 0.2;
             return 1;
        });

      link.exit().transition().duration(200)
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
      
      // --- Dependency Links (Overlay) ---
      // Only draw if a node is selected
      g.selectAll(".dep-link").remove();
      
      if (selectedNode) {
          // Find the hierarchy node for the selected node
          const selectedHNode = nodes.find(n => n.data.path === selectedNode.id);
          if (selectedHNode) {
              const deps: {source: any, target: any}[] = [];
              
              // Find links in original data
              data.links.forEach(l => {
                  const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                  const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                  
                  if (sourceId === selectedNode.id) {
                      // Outgoing dependency
                      const targetHNode = nodes.find(n => n.data.path === targetId);
                      if (targetHNode) deps.push({ source: selectedHNode, target: targetHNode });
                  } else if (targetId === selectedNode.id) {
                      // Incoming dependency
                      const sourceHNode = nodes.find(n => n.data.path === sourceId);
                      if (sourceHNode) deps.push({ source: sourceHNode, target: selectedHNode });
                  }
              });

              g.selectAll(".dep-link")
                .data(deps)
                .enter().append("path")
                .attr("class", "dep-link")
                .attr("d", (d) => {
                    // Draw a curve between nodes
                    const s = d.source;
                    const t = d.target;
                    // Bezier curve
                    return `M${s.y},${s.x} C${(s.y + t.y) / 2},${s.x} ${(s.y + t.y) / 2},${t.x} ${t.y},${t.x}`;
                })
                .style("fill", "none")
                .style("stroke", "#F97316") // Orange
                .style("stroke-width", "2px")
                .style("stroke-opacity", 0.6)
                .style("pointer-events", "none");
          }
      }
    }

    // Helper for diagonal paths
    function diagonal(s: any, d: any) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
                ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`;
    }

    // Initial update
    (root as any).x0 = height / 2;
    (root as any).y0 = 0;
    update(root);

  }, [rootData, theme, selectedNode, data.links, activeTab, searchQuery, filterType]); // Re-render when selectedNode changes to draw deps

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#030303] text-gray-900 dark:text-white transition-colors font-sans">
      
      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-neutral-400 transition-colors">
                  <ArrowLeft size={18} />
              </button>
              <div className="h-6 w-px bg-gray-200 dark:bg-white/10"></div>
              <div className="flex items-center gap-2">
                  <div className="p-1 bg-gray-100 dark:bg-white/10 rounded-md">
                    <Github size={16} />
                  </div>
                  <span className="font-semibold text-sm">{repoName}</span>
                  <span className="text-xs text-gray-400 dark:text-neutral-500 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10">Public</span>
              </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
              { id: 'graph', label: 'Graph', icon: FolderOpen },
              { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
              { id: 'stack', label: 'Stack', icon: Layers },
              { id: 'collaboration', label: 'Collab', icon: Users },
              { id: 'history', label: 'History', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as VisualizerTab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#00d907] text-black shadow-sm'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

           <div className="flex items-center gap-3">
             {/* Search Bar */}
             <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search files..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-[#00d907] rounded-md text-xs w-48 outline-none transition-all"
                />
             </div>
             <button onClick={handleExport} className="px-3 py-1.5 bg-[#00d907] text-black text-xs font-bold rounded hover:bg-[#00b006] transition-colors flex items-center gap-2">
                 <Download size={14} /> Export Map
             </button>
           </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR - REPO DETAILS (Only for Graph View) */}
          {activeTab === 'graph' && (
            <div className="w-[380px] flex flex-col border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050505] overflow-y-auto z-30">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 border-b border-gray-200 dark:border-white/10">
                    <div 
                        className={`p-4 flex flex-col items-center justify-center border-r border-gray-200 dark:border-white/10 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${filterType === 'risk' ? 'bg-red-500/10' : ''}`}
                        onClick={() => setFilterType(filterType === 'risk' ? 'all' : 'risk')}
                    >
                        <span className="text-xs text-gray-500 uppercase font-bold mb-1">Risk</span>
                        <span className={`text-lg font-mono font-bold ${data.riskScore > 50 ? 'text-red-500' : 'text-[#00d907]'}`}>{data.riskScore}</span>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center border-r border-gray-200 dark:border-white/10">
                        <span className="text-xs text-gray-500 uppercase font-bold mb-1">Nodes</span>
                        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">{data.nodes.length}</span>
                    </div>
                    <div 
                        className={`p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${filterType === 'dependency' ? 'bg-blue-500/10' : ''}`}
                        onClick={() => setFilterType(filterType === 'dependency' ? 'all' : 'dependency')}
                    >
                        <span className="text-xs text-gray-500 uppercase font-bold mb-1">Dependencies</span>
                        <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                          {data.nodes.filter(n => n.group === 'dependency').length}
                        </span>
                    </div>
                </div>

                {/* AI Summary Section */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-neutral-500 mb-3 flex items-center gap-2">
                        <Activity size={14} className="text-[#00d907]" /> 
                        Architectural Insights
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed font-medium">
                        {data.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {data.techStack.map(tech => (
                            <span key={tech} className="px-2 py-1 rounded-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-600 dark:text-neutral-400">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Issues List Section */}
                <div className="flex-1 overflow-y-auto p-0">
                    <div className="sticky top-0 bg-gray-50 dark:bg-[#050505] p-4 border-b border-gray-200 dark:border-white/10 z-10">
                        <h3 className="text-xs font-bold uppercase text-gray-500 dark:text-neutral-500 flex items-center gap-2">
                            <Github size={14} className="text-gray-900 dark:text-white" /> 
                            GitHub Issues ({githubIssues.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-white/5">
                        {loadingIssues ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00d907]"></div>
                            </div>
                        ) : (
                            <>
                                {nodesWithIssues.filter(n => n.githubIssues.length > 0).map((node, i) => (
                                    <div key={i} className="bg-red-50/50 dark:bg-red-900/10">
                                        <div className="px-4 py-2 text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                                            <FileCode size={10} /> {node.label}
                                        </div>
                                        {node.githubIssues.map((issue: any) => (
                                            <div key={issue.id} 
                                                 className="px-4 py-3 hover:bg-red-100/50 dark:hover:bg-red-900/20 cursor-pointer transition-colors border-l-2 border-red-500 ml-4 mb-2"
                                                 onClick={() => setSelectedNode(node)}
                                            >
                                                <div className="text-sm font-medium text-gray-900 dark:text-white leading-tight mb-1">
                                                    {issue.title}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>#{issue.number}</span>
                                                    <span>•</span>
                                                    <span>{issue.user.login}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                
                                {unlinkedIssues.length > 0 && (
                                    <div className="mt-2">
                                        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            General Issues
                                        </div>
                                        {unlinkedIssues.map((issue: any) => (
                                            <div key={issue.id} className="p-4 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white leading-tight mb-1">
                                                    {issue.title}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="font-mono">#{issue.number}</span>
                                                    <span>•</span>
                                                    <span>{issue.user.login}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
          )}

          {/* MAIN VISUALIZATION AREA */}
          <div className="flex-1 relative bg-gray-50 dark:bg-[#030303] flex flex-col">
              
              {/* Graph View */}
              {activeTab === 'graph' && (
                <>
                  {/* Canvas Toolbar */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-white/10 shadow-lg p-1 flex flex-col gap-1">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500 dark:text-neutral-400" title="Zoom In">
                              <ZoomIn size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500 dark:text-neutral-400" title="Zoom Out">
                              <ZoomOut size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500 dark:text-neutral-400" title="Reset View">
                              <Maximize2 size={18} />
                          </button>
                      </div>
                      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-white/10 shadow-lg p-2 text-center">
                          <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-500">{zoomLevel}%</span>
                      </div>
                  </div>

                  {/* D3 Canvas */}
                  <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
                       {/* Dotted Grid Background */}
                       <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] dark:opacity-[0.1] pointer-events-none"></div>
                       
                       <svg ref={svgRef} className="w-full h-full block" />
                       
                       {/* Tooltip */}
                       {tooltip && (
                           <div 
                               className="absolute z-50 px-2 py-1 bg-black/80 text-white text-[10px] rounded pointer-events-none backdrop-blur-sm border border-white/10"
                               style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                           >
                               {tooltip.content}
                           </div>
                       )}
                  </div>

                  {/* Node Detail Floating Card (Bottom Right) */}
                  {selectedNode ? (
                      <div className="absolute bottom-6 right-6 z-20 w-80 bg-white dark:bg-[#0A0A0A]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-4 animate-fade-in">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg">
                                      <Code2 size={20} className="text-[#00d907]" />
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-sm text-gray-900 dark:text-white break-all">{selectedNode.label}</h4>
                                      <span className="text-xs text-gray-500 uppercase font-bold">{selectedNode.group}</span>
                                  </div>
                              </div>
                              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                  <X size={16} />
                              </button>
                          </div>
                          
                          {/* Hierarchy Breadcrumbs */}
                          <div className="mb-4 flex flex-wrap gap-1">
                              {selectedNode.id.split('/').map((part, i, arr) => (
                                  <span key={i} className="text-[10px] text-gray-500 flex items-center">
                                      {part}
                                      {i < arr.length - 1 && <span className="mx-1 text-gray-300">/</span>}
                                  </span>
                              ))}
                          </div>

                          <div className="space-y-2">
                              <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-white/5">
                                  <span className="text-gray-500">Type</span>
                                  <span className="font-mono text-gray-900 dark:text-white capitalize">{selectedNode.group}</span>
                              </div>
                              <div className="flex justify-between text-xs py-1 border-b border-gray-100 dark:border-white/5">
                                  <span className="text-gray-500">Connections</span>
                                  <span className="font-mono text-gray-900 dark:text-white">
                                    {data.links.filter(l => 
                                      (typeof l.source === 'object' ? l.source.id : l.source) === selectedNode.id || 
                                      (typeof l.target === 'object' ? l.target.id : l.target) === selectedNode.id
                                    ).length}
                                  </span>
                              </div>
                          </div>

                          {/* Issues Section in Card */}
                          {(() => {
                              const nodeIssues = nodesWithIssues.find(n => n.id === selectedNode.id)?.githubIssues;
                              if (nodeIssues && nodeIssues.length > 0) {
                                  return (
                                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2">
                                          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                              <Github size={12} /> Linked Issues
                                          </span>
                                          {nodeIssues.map((issue: any, i: number) => (
                                              <a key={i} href={issue.html_url} target="_blank" rel="noreferrer" className="block text-xs p-2 rounded border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:opacity-80 transition-opacity">
                                                  <div className="font-bold mb-0.5">#{issue.number} {issue.title}</div>
                                                  <div className="opacity-70 truncate">{issue.body}</div>
                                              </a>
                                          ))}
                                      </div>
                                  );
                              }
                              return null;
                          })()}
                          
                          {selectedNode.group !== 'dependency' && (
                              <button 
                                onClick={handleViewSource}
                                className="w-full mt-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                              >
                                  <FileText size={14} /> View Source
                              </button>
                          )}
                      </div>
                  ) : (
                    <div className="absolute bottom-6 right-6 z-20 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-lg text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00d907] rounded-full animate-pulse"></div>
                        Select a file to view details
                    </div>
                  )}
                </>
              )}

              {/* Dashboard View */}
              {activeTab === 'dashboard' && (
                <div className="p-6 overflow-y-auto h-full">
                  {data.stats && <RepoOverview stats={data.stats} />}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 flex flex-col gap-6">
                        {data.activity && <ActivityContext activity={data.activity} />}
                        {data.prImpact && <PRVisualizer impact={data.prImpact} />}
                     </div>
                     <div className="flex flex-col gap-6">
                        {data.hotspots && <HotspotAnalytics hotspots={data.hotspots} />}
                        {data.aiSummary && <RepoSummary summary={data.aiSummary} />}
                     </div>
                  </div>
                </div>
              )}

              {/* Other Views */}
              {activeTab === 'pipeline' && <PipelineView repoUrl={repoUrl} />}
              {activeTab === 'stack' && <StackView data={data} />}
              {activeTab === 'collaboration' && <CollaborationView />}
              {activeTab === 'history' && <HistoryView repoUrl={repoUrl} />}

              {/* Source Code Modal */}
              {sourceCode !== null && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                      <div className="bg-white dark:bg-[#0A0A0A] w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-white/10">
                          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                              <h3 className="font-bold text-sm flex items-center gap-2">
                                  <FileCode size={16} className="text-[#00d907]" />
                                  {selectedNode?.label}
                              </h3>
                              <button onClick={() => setSourceCode(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md">
                                  <X size={18} />
                              </button>
                          </div>
                          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-[#050505] font-mono text-xs">
                              <pre className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap flex">
                                  <div className="pr-4 mr-4 border-r border-gray-200 dark:border-white/10 text-right text-gray-400 select-none">
                                      {sourceCode.split('\n').map((_, i) => (
                                          <div key={i}>{i + 1}</div>
                                      ))}
                                  </div>
                                  <div>
                                      {sourceCode}
                                  </div>
                              </pre>
                          </div>
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};