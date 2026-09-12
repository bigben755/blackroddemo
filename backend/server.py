from __future__ import annotations

import hashlib
import hmac
import os
from typing import List

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Community Alliance Sandbox Demo")


def _origins() -> List[str]:
    raw = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
    return [value.strip() for value in raw.split(",") if value.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

COOKIE_NAME = "community_demo_access"
COOKIE_MAX_AGE = 60 * 60 * 12


class LoginRequest(BaseModel):
    password: str


def _configured_password() -> str:
    return str(os.environ.get("DEMO_ACCESS_PASSWORD") or "").strip()


def _session_secret() -> str:
    return str(os.environ.get("DEMO_SESSION_SECRET") or _configured_password() or "").strip()


def _session_token() -> str:
    secret = _session_secret()
    password = _configured_password()
    if not secret or not password:
        return ""
    message = f"community-alliance-demo-access|{password}".encode("utf-8")
    return hmac.new(
        secret.encode("utf-8"),
        message,
        hashlib.sha256,
    ).hexdigest()


def _is_authenticated(request: Request) -> bool:
    supplied = str(request.cookies.get(COOKIE_NAME) or "")
    expected = _session_token()
    return bool(supplied and expected and hmac.compare_digest(supplied, expected))


def _secure_cookie(request: Request) -> bool:
    forwarded = str(request.headers.get("x-forwarded-proto") or "").lower()
    if forwarded:
        return forwarded == "https"
    return request.url.scheme == "https"


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "community-alliance-demo"}


@app.get("/api/demo/status")
async def demo_status(request: Request):
    return {
        "authenticated": _is_authenticated(request),
        "password_configured": bool(_configured_password()),
    }


@app.post("/api/demo/login")
async def demo_login(body: LoginRequest, request: Request, response: Response):
    configured = _configured_password()
    if not configured:
        raise HTTPException(
            status_code=503,
            detail="Demo access password has not been configured by the site owner.",
        )

    supplied = str(body.password or "")
    if not hmac.compare_digest(supplied, configured):
        raise HTTPException(status_code=401, detail="Incorrect demo password")

    response.set_cookie(
        key=COOKIE_NAME,
        value=_session_token(),
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        secure=_secure_cookie(request),
        samesite="lax",
        path="/",
    )
    return {"ok": True}


@app.post("/api/demo/logout")
async def demo_logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}
