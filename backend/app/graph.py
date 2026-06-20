# app/graph.py
from langgraph.graph import StateGraph, END
from typing import Dict, Any
from app.agents import frontend_developer_agent

# Import the shared state and the modified NVIDIA agents
from app.state import TeamState
from app.agents import (
    product_manager_agent,
    software_architect_agent,
    backend_developer_agent,
    tester_agent,
    code_reviewer_agent
)

# Define the conditional routing logic for the QA Loop
def route_after_testing(state: TeamState) -> str:
    """
    Evaluates the results from the Tester agent.
    If bugs are found and we haven't looped too many times, send back to the developer.
    Otherwise, move forward to final security code review.
    """
    print(f"--- [Routing Router] Iteration: {state.get('iteration_count', 0)}, Errors Found: {state.get('errors_found', False)} ---")
    
    # Safety Valve: Prevent infinite looping if the developer can't fix the bug
    if state.get("errors_found") and state.get("iteration_count", 0) < 3:
        print("--> Decision: Code has bugs. Routing back to Backend Developer Node.")
        return "developer"
    
    print("--> Decision: Code passed tests or reached max iterations. Routing to Code Reviewer Node.")
    return "reviewer"

# Initialize the stateful workflow graph
workflow = StateGraph(TeamState)

# 1. Register all agent nodes into the graph workspace
workflow.add_node("product_manager", product_manager_agent)
workflow.add_node("software_architect", software_architect_agent)
workflow.add_node("backend_developer", backend_developer_agent)
workflow.add_node("tester", tester_agent)
workflow.add_node("code_reviewer", code_reviewer_agent)
workflow.add_node("frontend_developer", frontend_developer_agent)

# 2. Establish fixed structural sequence connections
workflow.set_entry_point("product_manager")
workflow.add_edge("product_manager", "software_architect")
workflow.add_edge("software_architect", "backend_developer")
workflow.add_edge("backend_developer", "tester")
workflow.add_edge("code_reviewer", "frontend_developer")

# 3. Inject the conditional testing edge
# This dynamically determines whether to repeat execution or finish up.
workflow.add_conditional_edges(
    "tester",
    route_after_testing,
    {
        "developer": "backend_developer",
        "reviewer": "code_reviewer"
    }
)

# 4. Connect the terminal edge to exit the application cycle gracefully
workflow.add_edge("frontend_developer", END)

# Compile the workflow blueprint into a runtime engine executable
app_graph = workflow.compile()