import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateProject = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const data = await response.json();

      // 🚨 THE DEBUGGING TRICK: Print the exact AI data to the browser console!
      console.log("🚨 HERE IS THE AI DATA:", data);

      // Check if FastAPI sent back a 500 error
      if (!response.ok) {
        alert(`Backend Error: ${data.detail || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("Error generating project:", error);
      alert("Failed to connect to the AI team.");
    }
    setLoading(false);
  };

  // Safe helper to handle however the AI decides to format the source code
  const renderSourceCode = (sourceCode) => {
    if (!sourceCode) return <p className="text-slate-400">No source code returned.</p>;

    // If the AI returned it as a direct string instead of a dictionary
    if (typeof sourceCode === 'string') {
      return (
        <div className="mb-4 border border-slate-600 rounded">
          <div className="bg-slate-700 px-4 py-2 font-mono text-sm">main.py (Fallback)</div>
          <pre className="p-4 text-sm text-slate-300 overflow-x-auto">{sourceCode}</pre>
        </div>
      );
    }

    // If it's a properly formatted dictionary of files
    return Object.entries(sourceCode).map(([path, code]) => (
      <div key={path} className="mb-4 border border-slate-600 rounded shadow-sm">
        <div className="bg-slate-700 px-4 py-2 font-mono text-sm text-purple-300 border-b border-slate-600">
          {path}
        </div>
        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
          {typeof code === 'object' ? JSON.stringify(code, null, 2) : code}
        </pre>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-4xl font-bold text-cyan-400">AI Software Company</h1>
          <p className="text-slate-400 mt-2">Autonomous Multi-Agent Engineering Team</p>
        </header>

        {/* Input Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <textarea
            className="w-full bg-slate-900 text-white p-4 rounded border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
            rows="4"
            placeholder="Describe the software you want to build (e.g., 'Build a fast Library Management API...')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={generateProject}
            disabled={loading}
            className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{loading ? "Agents are coding..." : "Deploy AI Team"}</span>
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">

            {/* Architect Spec */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-2xl font-bold text-green-400 mb-2">Architect Specification</h2>
              <pre className="text-sm text-slate-300 overflow-x-auto bg-slate-900 p-4 rounded border border-slate-800">
                {JSON.stringify(result.architecture_spec, null, 2)}
              </pre>
            </div>

            {/* Advanced Workspace Preview */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Project Workspace</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Simulated Directory Explorer */}
                <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 font-mono text-sm text-emerald-400 h-fit sticky top-6 shadow-inner">
                  <p className="text-slate-500 mb-4 border-b border-slate-800 pb-2">// Directory Tree</p>
                  <p className="text-blue-400 font-bold mb-2"> project_root/</p>
                  <p className="pl-4 text-slate-400 mb-1">.venv/ <span className="text-xs text-slate-600 italic">(run setup)</span></p>

                  {result.source_code && typeof result.source_code === 'object' ? (
                    Object.keys(result.source_code).map((fileName) => (
                      <p key={fileName} className="pl-4 text-emerald-300 mb-1 hover:text-emerald-100 transition-colors cursor-default">
                        {fileName}
                      </p>
                    ))
                  ) : (
                    <p className="pl-4 text-emerald-300"> main.py</p>
                  )}
                </div>

                {/* Right Column: Interactive Code Viewer / Live Mock Terminal Preview */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Mock Endpoint Execution Simulator */}
                  <div className="bg-slate-950 rounded-lg p-0 border border-slate-700 shadow-inner overflow-hidden">
                    <div className="bg-slate-800 flex items-center space-x-2 p-3 border-b border-slate-700">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-400 font-mono pl-2">bash - API Tester</span>
                    </div>

                    <div className="p-4 font-mono text-xs text-slate-300 space-y-3">
                      <div className="flex space-x-2">
                        <span className="text-green-400">user@workspace:~$</span>
                        <span className="text-yellow-400">curl -X 'POST' http://127.0.0.1:8000/docs</span>
                      </div>
                      <p className="text-slate-500">HTTP/1.1 200 OK</p>
                      <pre className="bg-slate-900 border border-slate-800 p-3 rounded text-cyan-400 overflow-x-auto">
                        {JSON.stringify({
                          status: "success",
                          message: "AI pipeline completed. Endpoints are ready for local deployment.",
                          timestamp: new Date().toISOString()
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Actual Generated Code */}
                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4 pb-2 border-b border-slate-700">Generated Files</h3>
                    {renderSourceCode(result.source_code)}
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;