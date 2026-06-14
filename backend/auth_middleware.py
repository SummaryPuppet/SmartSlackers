import os
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Middleware to validate API key from frontend."""
    
    def __init__(self, app, api_key: str = None):
        super().__init__(app)
        self.api_key = api_key or os.getenv("API_SECRET_KEY")
    
    async def dispatch(self, request: Request, call_next):
        # Skip health check, docs, and CORS preflight
        if request.url.path in ["/api/health", "/docs", "/openapi.json"] or request.method == "OPTIONS":
            return await call_next(request)
        
        # Check for API key in header
        api_key = request.headers.get("X-API-Key")
        
        if not api_key or api_key != self.api_key:
            raise HTTPException(
                status_code=401,
                detail="Invalid or missing API key"
            )
        
        response = await call_next(request)
        return response
