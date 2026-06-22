import os
import json
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv

# Import the TeamState typed dict you created earlier
from app.state import TeamState 

load_dotenv()

# Initialize the OpenAI Client pointing to NVIDIA NIM
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
    timeout=600.0  # 10 minutes to allow massive code generation
)

MODEL_NAME = "meta/llama-3.3-70b-instruct"

# --- Models for JSON Output Formatting ---
class ArchitectureModel(BaseModel):
    tech_stack: List[str]
    folder_structure: List[str]
    database_schema: str

class CodeGenerationModel(BaseModel):
    source_code: Dict[str, str]

class TestReportModel(BaseModel):
    test_cases_code: str
    errors_found: bool
    summary_report: str


# ==========================================
# 1. PRODUCT MANAGER AGENT
# ==========================================
def product_manager_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Product Manager Agent] Analyzing Requirements ---")
    
    prompt = f"""
    You are an elite Product Manager. Analyze the user requirement and write a strict software specification.
    
    User Requirement: {state['user_prompt']}
    
    METHODOLOGY (Chain of Thought):
    1. Identify the core user problem.
    2. Define the minimum viable product (MVP) features needed to solve it.
    3. Outline the specific REST API endpoints required.
    
    ANTI-HALLUCINATION GUARDRAILS (Chain of Verification):
    - Verify that every feature you outline was either explicitly requested or is strictly necessary for the app to function.
    - DO NOT invent complex secondary features (like payment gateways or auth) unless the user asked for them.
    
    Output a clean, highly structured Markdown document.
    """
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0
    )
    
    return {"requirements_doc": response.choices[0].message.content}


# ==========================================
# 2. SOFTWARE ARCHITECT AGENT
# ==========================================
def software_architect_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Software Architect Agent] Designing System ---")
    
    schema_json = ArchitectureModel.model_json_schema()
    
    prompt = f"""
    You are a Principal Software Architect. Design a production-level modular system based on this spec:
    
    Product Specification: {state.get('requirements_doc', '')}
    
    METHODOLOGY (Chain of Thought):
    1. Determine the database schema required to support the endpoints.
    2. Define a flat file structure for a FastAPI backend.
    
    ANTI-HALLUCINATION GUARDRAILS:
    - Verify your folder structure does not use deeply nested directories. Keep it flat and simple (e.g., main.py, models.py, schemas.py).
    
    CRITICAL INSTRUCTION: You MUST respond with ONLY a valid JSON object matching this schema:
    {json.dumps(schema_json, indent=2)}
    """
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.0
    )
    
    return {"architecture_spec": json.loads(response.choices[0].message.content)}


# ==========================================
# 3. BACKEND DEVELOPER AGENT
# ==========================================
def backend_developer_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Backend Developer Agent] Writing Application Code ---")
    
    folder_structure = state['architecture_spec'].get('folder_structure', [])
    db_schema = state['architecture_spec'].get('database_schema', '')
    
    prompt = f"""
    You are an expert Backend Python Developer. Write production-grade FastAPI code based on this architecture.
    
    Database Schema: {db_schema}
    Target Files: {folder_structure}
    Product Spec: {state.get('requirements_doc', '')}
    
    METHODOLOGY (Chain of Thought):
    1. Write schemas.py first to define data validation.
    2. Write models.py for the database.
    3. Write routes.py and connect schemas and models.
    4. Write main.py to bind it all together.
    5. Generate a comprehensive requirements.txt.
    
    ANTI-HALLUCINATION GUARDRAILS & THREATS:
    - If you use a Python package in your code that is NOT in your requirements.txt, the server will instantly crash. Verify every single import!
    - DO NOT use generic models like `dict` if a Pydantic schema is available.
    - Verify that `main.py` explicitly imports the routers you created.
    
    CRITICAL: Respond with ONLY a valid JSON object matching this format:
    {{
      "source_code": {{
        "requirements.txt": "fastapi\\nuvicorn\\npydantic\\n...",
        "main.py": "from fastapi import FastAPI\\n...",
        "schemas.py": "..."
      }}
    }}
    """    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.0
    )
    
    code_data = json.loads(response.choices[0].message.content)
    return {"source_code": code_data.get("source_code", code_data)}


# ==========================================
# 4. TESTER AGENT
# ==========================================
def tester_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Tester Agent] Analyzing Code and Simulating Tests ---")
    
    schema_json = TestReportModel.model_json_schema()
    current_code_str = "\n\n".join([f"### File: {path}\n{code}" for path, code in state.get('source_code', {}).items()])
    
    prompt = f"""
    You are a rigorous QA Engineer. Review the backend code, simulate execution mentally, and find critical errors.
    
    Code to test:
    {current_code_str}
    
    METHODOLOGY (Chain of Thought):
    1. Verify all Python imports exist and are correct.
    2. Check if FastAPI routes have matching functions and parameters.
    3. Check for undefined variables or schemas used as database models.
       
    ANTI-HALLUCINATION GUARDRAILS (Chain of Verification):
    - Before you report an error, VERIFY it actually exists in the text provided.
    - If you claim an import is missing, double-check the top of the file first.
       
    FEW-SHOT EXAMPLES for `errors_found`:
    - Example A (True): "The route `/users` expects a `User` schema, but `User` is not imported from `schemas.py`. errors_found: true"
    - Example B (False): "FastAPI is imported, routes are defined, and schemas match. errors_found: false"
       
    CRITICAL: Respond with ONLY a valid JSON object matching this schema:
    {json.dumps(schema_json, indent=2)}
    """
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.0
    )
    
    test_data = json.loads(response.choices[0].message.content)
    current_iterations = (state.get('iteration_count') or 0) + 1
    
    return {
        "test_report": test_data.get("summary_report", "Testing complete."),
        "errors_found": test_data.get("errors_found", False),
        "iteration_count": current_iterations
    }


# ==========================================
# 5. CODE REVIEWER AGENT
# ==========================================
def code_reviewer_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Code Reviewer Agent] Final Code and Security Audit ---")
    
    current_code_str = "\n\n".join([f"### File: {path}\n{code}" for path, code in state.get('source_code', {}).items()])
    
    prompt = f"""
    You are a Senior Security Auditor. Audit the code for security vulnerabilities.
    
    Code:
    {current_code_str}
    
    METHODOLOGY (Chain of Thought):
    1. Scan for hardcoded secrets or API keys.
    2. Check for missing input validation.
    3. Evaluate error handling mechanisms.
       
    ANTI-HALLUCINATION GUARDRAILS (Chain of Verification):
    - Draft your findings mentally, then VERIFY each finding against the actual code.
    - If you claim a vulnerability exists, YOU MUST QUOTE the exact line of code. If you cannot quote it, DO NOT report it.
       
    If secure, state: "Audit Complete. No critical vulnerabilities found."
    """
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0
    )
    
    return {"review_report": response.choices[0].message.content}


# ==========================================
# 6. FRONTEND DEVELOPER AGENT
# ==========================================
def frontend_developer_agent(state: TeamState) -> Dict[str, Any]:
    print("--- [Frontend Developer Agent] Writing React/Tailwind UI Code ---")
    
    backend_code_str = "\n\n".join([f"### {path}:\n{code}" for path, code in state.get('source_code', {}).items()])
    
    prompt = f"""
    You are an expert Frontend React Developer. Build a UI using React, Vite, and Tailwind CSS.
    
    Product Specification: {state.get('requirements_doc', '')}
    
    Backend Code (For API Reference):
    {backend_code_str}
    
    METHODOLOGY (Chain of Thought):
    1. Read the Backend Code to identify the exact API routes (e.g., GET /users, POST /books).
    2. Design React components that map to these specific routes.
    3. Write the necessary fetch() logic.
    
    ANTI-HALLUCINATION GUARDRAILS & THREATS:
    - Review the EXACT backend code above. 
    - DO NOT guess or invent API endpoints. Only use the ones explicitly defined in the code. If you guess an endpoint, the UI will break.
    - DO NOT use nested dictionaries for folders. Use flat file paths (e.g., "src/App.jsx").
    
    CRITICAL: Respond with ONLY a valid JSON object. Example format:
    {{
      "frontend_source_code": {{
        "package.json": "...",
        "src/App.jsx": "...",
        "src/index.css": "@tailwind base;\\n@tailwind components;\\n@tailwind utilities;"
      }}
    }}
    """
    
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.0 
    )
    
    code_data = json.loads(response.choices[0].message.content)
    return {"frontend_source_code": code_data.get("frontend_source_code", code_data)}