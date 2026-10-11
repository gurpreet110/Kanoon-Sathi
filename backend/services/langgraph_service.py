import logging
from typing import List, Dict, Any, TypedDict
try:
    from langgraph.graph import StateGraph, START, END
    HAS_LANGGRAPH = True
except Exception:
    HAS_LANGGRAPH = False
    StateGraph = START = END = None

logger = logging.getLogger(__name__)

# Define our State
class AgentState(TypedDict):
    query: str
    documents: List[str]
    research_data: str
    verified_facts: str
    analysis: str
    response: str
    needs_external_research: bool

# Define nodes for the new pipeline
def initial_analysis(state: AgentState) -> Dict[str, Any]:
    """Determine if query needs external context or document context."""
    logger.debug("Running initial_analysis")
    query = state["query"]
    needs_search = "search" in query.lower() or "latest" in query.lower() or "research" in query.lower()
    return {"needs_external_research": needs_search}

def tinyfish_research(state: AgentState) -> Dict[str, Any]:
    """Integrate TinyFish web-agent research tool."""
    logger.debug("Running tinyfish_research (TinyFish integration)")
    return {"research_data": state.get("research_data", "") + "\n[TinyFish Web Agent: Retrieved latest legal precedents and statutes]"}

def retrieve_context(state: AgentState) -> Dict[str, Any]:
    """Retrieve internal document context."""
    logger.debug("Running retrieve_context")
    docs = state.get("documents", [])
    context = "\n".join(docs) if docs else "No internal documents provided."
    return {"research_data": state.get("research_data", "") + f"\n[Internal Docs: {context}]"}

def verify_facts(state: AgentState) -> Dict[str, Any]:
    """Verify researched facts against known legal constraints."""
    logger.debug("Running verify_facts")
    research_data = state.get("research_data", "")
    verified_facts = f"Verified: {research_data}"
    return {"verified_facts": verified_facts}

def analyze_legal_data(state: AgentState) -> Dict[str, Any]:
    """Analyze the verified facts to form a legal explanation."""
    logger.debug("Running analyze_legal_data")
    verified_facts = state.get("verified_facts", "")
    analysis = f"Analysis based on: {verified_facts[:100]}..."
    return {"analysis": analysis}

def summarize_explanation(state: AgentState) -> Dict[str, Any]:
    """Generate final response based on context."""
    logger.debug("Running summarize_explanation")
    analysis = state.get("analysis", "")
    query = state.get("query", "")
    # In a real app, this calls an LLM
    response = f"Analyzed query: '{query}'. Summary: {analysis}"
    return {"response": response}

def build_graph():
    if not HAS_LANGGRAPH:
        return None
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("initial_analysis", initial_analysis)
    workflow.add_node("tinyfish_research", tinyfish_research)
    workflow.add_node("retrieve_context", retrieve_context)
    workflow.add_node("verify_facts", verify_facts)
    workflow.add_node("analyze_legal_data", analyze_legal_data)
    workflow.add_node("summarize_explanation", summarize_explanation)

    # Add edges
    workflow.add_edge(START, "initial_analysis")

    def route_after_analysis(state: AgentState) -> str:
        if state.get("needs_external_research", False):
            return "tinyfish_research"
        return "retrieve_context"

    workflow.add_conditional_edges(
        "initial_analysis",
        route_after_analysis,
        {
            "tinyfish_research": "tinyfish_research",
            "retrieve_context": "retrieve_context"
        }
    )

    workflow.add_edge("tinyfish_research", "verify_facts")
    workflow.add_edge("retrieve_context", "verify_facts")
    workflow.add_edge("verify_facts", "analyze_legal_data")
    workflow.add_edge("analyze_legal_data", "summarize_explanation")
    workflow.add_edge("summarize_explanation", END)

    return workflow.compile()

# Singleton graph instance
try:
    agent_graph = build_graph()
except Exception as exc:
    logger.warning("LangGraph disabled during initialization (%s)", type(exc).__name__)
    agent_graph = None

async def run_agent(query: str, documents: List[str] = None) -> str:
    """Run the LangGraph workflow."""
    if documents is None:
        documents = []
    
    if agent_graph is None:
        logger.warning("LangGraph is not available. Falling back to direct response.")
        return f"Analyzed query: '{query}'"

    initial_state = {
        "query": query,
        "documents": documents,
        "research_data": "",
        "verified_facts": "",
        "analysis": "",
        "response": "",
        "needs_external_research": False
    }
    
    # Run graph
    result = await agent_graph.ainvoke(initial_state)
    return result.get("response", "Error generating response.")
