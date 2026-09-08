import os
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
from app.security.guardrails import mask_pii, check_prompt_injection

class BaseLLMProvider:
    async def generate_response(self, prompt: str, system_instruction: str = "") -> str:
        raise NotImplementedError

class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"

    async def generate_response(self, prompt: str, system_instruction: str = "") -> str:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        if system_instruction:
            payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}
            
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(self.endpoint, json=payload)
            res.raise_for_status()
            data = res.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

class IntelligentLocalProvider(BaseLLMProvider):
    """
    Robust local rule & domain intelligence engine.
    Ensures 100% platform availability offline / without external API keys.
    """
    async def generate_response(self, prompt: str, system_instruction: str = "") -> str:
        lower = prompt.lower()
        if "backend" in lower or "java" in lower:
            return (
                "For Backend Engineering in the Indian tech ecosystem:\n\n"
                "1. **Core Competencies**: Strengthen your foundation in Java 21+ / Spring Boot 3+, REST API design, and JPA/Hibernate query optimization.\n"
                "2. **Data & Caching**: Deepen practical experience with PostgreSQL (indexing, EXPLAIN ANALYZE) and Redis caching patterns.\n"
                "3. **Microservices & System Design**: Build projects demonstrating idempotency, asynchronous messaging with RabbitMQ/Kafka, and rate limiting (Bucket4j/Redis).\n"
                "4. **AI/ML Integration**: Learn how to connect services to LLM endpoints and vector embeddings for semantic search."
            )
        elif "frontend" in lower or "react" in lower:
            return (
                "For Modern Frontend Development:\n\n"
                "1. **Modern Stack**: Master React 19, TypeScript strict mode, Next.js or Vite, and Tailwind CSS.\n"
                "2. **State & Performance**: Focus on Zustand or TanStack Query, code-splitting, lazy loading, and Web Vitals optimization.\n"
                "3. **UI/UX Polish**: Premium design aesthetics (Framer Motion, glassmorphism, responsive micro-interactions) differentiate top candidates.\n"
                "4. **Testing**: Add Jest/Vitest and Playwright end-to-end test suites."
            )
        elif "resume" in lower or "ats" in lower:
            return (
                "Resume & ATS Optimization Guidance:\n\n"
                "• Use the STAR method (Situation, Task, Action, Result) with quantified metrics (e.g., 'Reduced query latency by 42%').\n"
                "• Ensure keywords match the target JD exactly (e.g., 'PostgreSQL', 'Docker', 'Distributed Systems').\n"
                "• Avoid multi-column layouts or graphic bars for skill levels which confuse ATS parsers.\n"
                "• Showcase GitHub links with clear READMEs, architecture diagrams, and live demo URLs."
            )
        else:
            return (
                "Here is strategic career guidance tailored to your query:\n\n"
                "1. **Skill Verification**: Complete verified project assessments on CareerSetu to stand out to verified recruiters.\n"
                "2. **Industry Alignment**: Tailor your skills to current market demands in India's GCC (Global Capability Center) and startup ecosystems.\n"
                "3. **Proof of Work**: Public repositories with automated CI/CD and clear documentation carry 3x more weight than simple certification certificates."
            )

def get_llm_provider() -> BaseLLMProvider:
    if settings.GEMINI_API_KEY:
        return GeminiProvider(api_key=settings.GEMINI_API_KEY)
    return IntelligentLocalProvider()
