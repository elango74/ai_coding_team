from typing import TypedDict, Dict, List, Any

class TeamState(TypedDict):
    user_prompt: str
    requirements_doc: str
    architecture_spec: Dict[str, Any]
    frontend_source_code: Dict[str, str]
    source_code: Dict[str, str]
    test_report: str
    errors_found: bool
    iteration_count: int
    review_report: str
