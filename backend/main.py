# main.py
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any

# Import our compiled multi-agent state graph engine
from app.graph import app_graph

app = FastAPI(
    title="AI Coding Team API Platform",
    description="An autonomous agentic software development organization driven by LangGraph and Gemma-4-31b-it.",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for local testing)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define the expected JSON payload schema for incoming requests
class ProjectRequest(BaseModel):
    prompt: str = Field(
        ..., 
        description="The detailed description of the software system you want built.",
        example="Build a Library Management System API using FastAPI with JWT authentication and PostgreSQL."
    )

# Define the structured response schema returned to the client
class ProjectResponse(BaseModel):
    requirements_doc: str = Field(..., description="The functional specifications document from the PM.")
    architecture_spec: Dict[str, Any] = Field(..., description="The layout, schema, and stack choices from the Architect.")
    source_code: Dict[str, str] = Field(..., description="Generated deployment-ready source code (File Path -> Content).")
    test_report: str = Field(..., description="The comprehensive test suite and validation logs from the Tester.")
    review_report: str = Field(..., description="The final security audit report from the Principal Reviewer.")
    total_cycles_executed: int = Field(..., description="The final loop count spent in the Developer-Tester correction loop.")

@app.post("/generate-project", response_model=ProjectResponse)
async def generate_software_project(request: ProjectRequest):
    """
    Triggers the multi-agent orchestration pipeline to construct a software application autonomously.
    """
    print(f"\n🚀 [Received Project Creation Request]: '{request.prompt}'")
    
    # Initialize the default, baseline structure of our global TeamState
    initial_state = {
        "user_prompt": request.prompt,
        "requirements_doc": "",
        "architecture_spec": {},
        "source_code": {},
        "test_report": "",
        "review_report": "",
        "iteration_count": 0,
        "errors_found": False
    }
    
    try:
        # Execute the LangGraph engine synchronously using the initial state map
        final_state = app_graph.invoke(initial_state)
        
        # Parse and return the accumulated state data as a structured JSON response
        return ProjectResponse(
            requirements_doc=final_state.get("requirements_doc", "No specs generated."),
            architecture_spec=final_state.get("architecture_spec", {}),
            source_code=final_state.get("source_code", {}),
            test_report=final_state.get("test_report", "No tests run."),
            review_report=final_state.get("review_report", "No review completed."),
            total_cycles_executed=final_state.get("iteration_count", 0)
        )
        
    except Exception as e:
        print(f"❌ [Graph Execution Failure]: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred within the agent workflow system: {str(e)}"
        )

# Direct execution capability for debugging purposes
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)