import { useState, useEffect } from "react";
import { 
  Sparkles, Play, Terminal, FileText, Layers, Code2, 
  TestTube2, ShieldCheck, CheckCircle2, AlertCircle, 
  Folder, FileCode, RotateCcw, Copy, Check
} from "lucide-react";

interface ProjectResponse {
  requirements_doc: string;
  architecture_spec: Record<string, any>;
  source_code: Record<string, string>;
  test_report: string;
  review_report: string;
  total_cycles_executed: number;
}

const AGENT_STATUSES = [
  { agent: "Product Manager", msg: "Analyzing prompt and compiling requirements specification document...", icon: FileText },
  { agent: "Software Architect", msg: "Drafting scalable system architecture, tables, and API routes...", icon: Layers },
  { agent: "Backend Developer", msg: "Writing FastAPI application routes and business logic files...", icon: Code2 },
  { agent: "QA Tester", msg: "Creating and executing unit tests against generated endpoints...", icon: TestTube2 },
  { agent: "Principal Reviewer", msg: "Auditing security vulnerabilities and formatting final files...", icon: ShieldCheck }
];

const PRESETS = [
  "Build a Task Management API with JWT auth and SQLite.",
  "Create a Weather Alert subscription service with email notifications.",
  "Design a Library Booking System with book checkout and penalty calculations."
];

export default function AgentWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ProjectResponse | null>(null);
  
  // Results UI tabs
  const [activeTab, setActiveTab] = useState<"specs" | "arch" | "code" | "tests" | "review">("specs");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Status message rotation during load
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % AGENT_STATUSES.length);
      }, 6000);
    } else {
      setStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleLaunch = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("http://localhost:8000/generate-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}: ${response.statusText}`);
      }

      const data: ProjectResponse = await response.json();
      setResults(data);
      
      // Auto-select the first file in source code if any
      const files = Object.keys(data.source_code || {});
      if (files.length > 0) {
        setSelectedFile(files[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish connection with the AI team backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CurrentStatusIcon = AGENT_STATUSES[statusIndex].icon;

  return (
    <section id="workspace" className="py-20 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-[#34908b] font-semibold bg-[#34908b]/10 border border-[#a5e9dd]/30">
            <Terminal className="h-3.5 w-3.5" /> Interactive Sandbox
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
            Run the <span className="text-gradient">AI Coding Team</span> Live
          </h2>
          <p className="mt-4 text-muted-foreground">
            Type your project specifications below and command the multi-agent system to design, build, and test your system.
          </p>
        </div>

        {/* Input Card */}
        <div className="glass glow-border rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-lg relative bg-[#a5e9dd]/5">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#34908b]" /> What would you like to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="e.g. Build a Library Book checkout system API using FastAPI with database schemas, JWT auth, and CRUD operations..."
              className="w-full min-h-[120px] rounded-xl border border-[#a5e9dd]/40 bg-white/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#34908b] disabled:opacity-50"
            />

            {/* Preset Suggestions */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-1">Suggestions:</span>
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPrompt(preset)}
                  disabled={loading}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/60 hover:bg-white border border-[#a5e9dd]/30 hover:border-[#34908b]/50 text-foreground transition-all cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/20">
              <button
                onClick={() => setPrompt("")}
                disabled={loading || !prompt}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/40 transition-colors disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
              
              <button
                onClick={handleLaunch}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#34908b" }}
              >
                <Play className="h-4 w-4 fill-current" />
                Launch AI Team
              </button>
            </div>
          </div>
        </div>

        {/* Loading State Overlay */}
        {loading && (
          <div className="mt-8 glass glow-border rounded-3xl p-8 max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[260px] bg-white/40 shadow-inner">
            <div className="relative flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#34908b]"></div>
              <div className="absolute grid place-items-center">
                <CurrentStatusIcon className="h-6 w-6 text-[#34908b] animate-pulse" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Workflow Active: {AGENT_STATUSES[statusIndex].agent}
            </h3>
            <p className="mt-2 text-sm text-[#34908b] max-w-md animate-pulse">
              {AGENT_STATUSES[statusIndex].msg}
            </p>
            <div className="mt-6 flex gap-3 text-xs text-muted-foreground font-mono bg-black/5 px-4 py-2 rounded-full">
              <span>Iterative Review Loop: Running tests & validations</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 border border-destructive/20 bg-destructive/5 rounded-3xl p-6 max-w-4xl mx-auto flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-destructive">Execution Encountered An Error</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <button 
                onClick={handleLaunch}
                className="mt-3 text-xs underline font-semibold text-[#34908b] hover:text-[#34908b]/80"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* Results Workspace */}
        {results && !loading && (
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="glass glow-border rounded-3xl p-6 shadow-xl bg-white/60">
              
              {/* Success metrics header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/20 text-success">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">Project Successfully Shipped</h3>
                    <p className="text-xs text-muted-foreground">Generated clean architecture documents and executable source files.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="bg-[#a5e9dd]/20 border border-[#a5e9dd]/40 px-3 py-1.5 rounded-lg text-foreground/80">
                    Cycles Executed: <span className="font-bold text-[#34908b]">{results.total_cycles_executed}</span>
                  </div>
                  <div className="bg-[#a5e9dd]/20 border border-[#a5e9dd]/40 px-3 py-1.5 rounded-lg text-foreground/80">
                    Files Created: <span className="font-bold text-[#34908b]">{Object.keys(results.source_code || {}).length}</span>
                  </div>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-border/30 pb-2">
                {[
                  { id: "specs", label: "Requirements Spec", icon: FileText },
                  { id: "arch", label: "Architecture Spec", icon: Layers },
                  { id: "code", label: "Source Code", icon: Code2 },
                  { id: "tests", label: "QA Test Suite", icon: TestTube2 },
                  { id: "review", label: "Principal Review", icon: ShieldCheck }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                        active 
                          ? "border-[#34908b] text-[#34908b] bg-[#a5e9dd]/15" 
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-black/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panels */}
              <div className="mt-6">
                
                {/* Requirements Spec Tab */}
                {activeTab === "specs" && (
                  <div className="rounded-2xl bg-white/40 border border-border/30 p-6 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Product Manager PRD Specs</h4>
                      <button 
                        onClick={() => handleCopy(results.requirements_doc)} 
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg"
                      >
                        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy Spec"}
                      </button>
                    </div>
                    <pre className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {results.requirements_doc}
                    </pre>
                  </div>
                )}

                {/* Architecture Spec Tab */}
                {activeTab === "arch" && (
                  <div className="rounded-2xl bg-white/40 border border-border/30 p-6 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Software Architect Spec Layout</h4>
                      <button 
                        onClick={() => handleCopy(JSON.stringify(results.architecture_spec, null, 2))} 
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg"
                      >
                        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy JSON"}
                      </button>
                    </div>
                    <pre className="text-xs font-mono bg-black/5 p-4 rounded-xl max-h-[400px] overflow-y-auto border border-border/30 text-[#34908b]">
                      {JSON.stringify(results.architecture_spec, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Source Code Tab */}
                {activeTab === "code" && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[400px]">
                    {/* Left File tree sidebar */}
                    <div className="md:col-span-1 border border-border/30 rounded-2xl bg-white/30 p-3 max-h-[500px] overflow-y-auto">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground px-2 block mb-2">Project Files</span>
                      <div className="flex flex-col gap-1">
                        {Object.keys(results.source_code || {}).map((path) => (
                          <button
                            key={path}
                            onClick={() => setSelectedFile(path)}
                            className={`flex items-center gap-2 text-left text-xs px-2.5 py-2 rounded-lg truncate w-full cursor-pointer transition-colors ${
                              selectedFile === path 
                                ? "bg-[#34908b] text-white font-medium" 
                                : "hover:bg-[#a5e9dd]/20 text-foreground/80"
                            }`}
                          >
                            <FileCode className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{path}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Code Display Panel */}
                    <div className="md:col-span-3 border border-[#a5e9dd]/40 rounded-2xl overflow-hidden flex flex-col bg-[#a5e9dd]/5 max-h-[500px]">
                      <div className="flex items-center justify-between bg-white/70 border-b border-border/30 px-4 py-2.5 text-xs">
                        <div className="flex items-center gap-2 font-mono text-muted-foreground">
                          <Folder className="h-3.5 w-3.5 text-[#34908b]" />
                          <span>{selectedFile || "Select a file..."}</span>
                        </div>
                        {selectedFile && (
                          <button 
                            onClick={() => handleCopy(results.source_code[selectedFile])} 
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-white border border-border px-2 py-0.5 rounded-md"
                          >
                            {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        )}
                      </div>
                      
                      <div className="p-4 flex-1 overflow-auto font-mono text-xs text-foreground/90 leading-relaxed bg-[#a5e9dd]/5">
                        {selectedFile ? (
                          <pre className="whitespace-pre overflow-x-auto">
                            {results.source_code[selectedFile]}
                          </pre>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            Please select a file from the list to view its code contents.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Report Tab */}
                {activeTab === "tests" && (
                  <div className="rounded-2xl bg-white/40 border border-border/30 p-6 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">QA Test Logs & Assertions</h4>
                      <button 
                        onClick={() => handleCopy(results.test_report)} 
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg"
                      >
                        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy logs"}
                      </button>
                    </div>
                    <pre className="text-xs font-mono bg-black/5 p-4 rounded-xl max-h-[400px] overflow-y-auto border border-border/30 text-emerald-800 leading-relaxed whitespace-pre-wrap">
                      {results.test_report}
                    </pre>
                  </div>
                )}

                {/* Review Report Tab */}
                {activeTab === "review" && (
                  <div className="rounded-2xl bg-white/40 border border-border/30 p-6 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Security Auditor Review and Linter Logs</h4>
                      <button 
                        onClick={() => handleCopy(results.review_report)} 
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg"
                      >
                        {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy Review"}
                      </button>
                    </div>
                    <pre className="text-sm font-sans whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {results.review_report}
                    </pre>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
