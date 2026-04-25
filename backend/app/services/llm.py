import os
import json
import re
import httpx
from typing import Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")  # "openai" or "anthropic"


async def call_llm(prompt: str, system: str = "") -> str:
    """Unified LLM caller supporting OpenAI and Anthropic."""
    if LLM_PROVIDER == "openai":
        return await _call_openai(prompt, system)
    elif LLM_PROVIDER == "deepseek":
        return await _call_deepseek(prompt, system)
    else:
        return await _call_anthropic(prompt, system)


async def _call_openai(prompt: str, system: str) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o",
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 2000,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


async def _call_anthropic(prompt: str, system: str) -> str:
    async with httpx.AsyncClient(timeout=30.0) as client:
        body = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 2000,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system:
            body["system"] = system

        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            json=body,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["content"][0]["text"]


import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

async def _call_deepseek(prompt: str, system: str) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            resp = await client.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "deepseek-v4-pro",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1024,
                    "stream": False,
                },
            )
            # 记录状态与返回体便于排查
            logger.info("Deepseek HTTP %s", resp.status_code)
            text = await resp.aread()
            try:
                body = resp.json()
            except Exception:
                body = text.decode('utf-8', errors='ignore')
            logger.info("Deepseek response body: %s", body)
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            logger.error("Deepseek error %s: %s", e.response.status_code if e.response else None,
                         e.response.text if e.response is not None else "<no body>")
            raise

        data = body if isinstance(body, dict) else (resp.json() if resp.content else {})
        # 兼容多种路径提取文本
        for path in (("choices",0,"message","content"), ("choices",0,"message"), ("choices",0,"text"), ("text",)):
            try:
                tmp = data
                for k in path:
                    tmp = tmp[k]
                # 如果是 dict 包含 content/text 字段，进一步提取
                if isinstance(tmp, dict) and "content" in tmp:
                    tmp = tmp["content"]
                return tmp.strip()
            except Exception:
                continue
        raise ValueError(f"Unexpected Deepseek response: {data}")

def extract_json(text: str) -> dict:
    """Extract JSON from LLM response, stripping markdown fences."""
    text = text.strip()
    # Remove ```json ... ``` fences
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    # Find first { or [
    start = min(
        (text.find("{") if text.find("{") != -1 else len(text)),
        (text.find("[") if text.find("[") != -1 else len(text)),
    )
    text = text[start:]
    return json.loads(text)
