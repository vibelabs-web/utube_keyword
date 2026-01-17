#!/bin/bash

# Integration Test Script for ViewPulse
# Tests frontend-backend connectivity

set -e

echo "=========================================="
echo "ViewPulse Integration Test"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:5173"
MAX_RETRIES=30
RETRY_INTERVAL=2

# Functions
check_service() {
    local url=$1
    local service_name=$2
    local retries=0

    echo -n "Checking $service_name at $url... "

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            return 0
        fi
        retries=$((retries + 1))
        sleep $RETRY_INTERVAL
    done

    echo -e "${RED}FAILED${NC}"
    return 1
}

test_api_endpoint() {
    local endpoint=$1
    local method=$2
    local data=$3
    local description=$4

    echo -n "Testing $description... "

    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$BACKEND_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s "$BACKEND_URL$endpoint" -w "\n%{http_code}")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}OK${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}FAILED${NC} (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Main test flow
echo "Step 1: Checking Services"
echo "-------------------------------------------"

if ! check_service "$BACKEND_URL/health" "Backend"; then
    echo -e "${RED}Backend is not running. Please start it with:${NC}"
    echo "  cd backend && uvicorn app.main:app --reload"
    exit 1
fi

if ! check_service "$FRONTEND_URL" "Frontend"; then
    echo -e "${RED}Frontend is not running. Please start it with:${NC}"
    echo "  cd frontend && npm run dev"
    exit 1
fi

echo ""
echo "Step 2: Testing Backend API Endpoints"
echo "-------------------------------------------"

# Test root endpoint
test_api_endpoint "/" "GET" "" "Root endpoint"

# Test health check
test_api_endpoint "/health" "GET" "" "Health check"

# Test API documentation
echo -n "Testing API documentation... "
if curl -s "$BACKEND_URL/docs" | grep -q "Swagger"; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC} (Swagger UI might not be loaded)"
fi

echo ""
echo "Step 3: Testing API Functionality"
echo "-------------------------------------------"

# Test keyword analysis (requires YouTube API key)
if [ -n "$YOUTUBE_API_KEY" ]; then
    test_api_endpoint "/api/v1/youtube/analyze-keyword" "POST" \
        '{"keyword":"python tutorial"}' \
        "Keyword analysis"
else
    echo -e "${YELLOW}SKIPPED${NC} Keyword analysis (YOUTUBE_API_KEY not set)"
fi

echo ""
echo "Step 4: Testing Frontend-Backend Proxy"
echo "-------------------------------------------"

# Test if frontend can proxy to backend
echo -n "Testing frontend proxy to backend... "
if curl -s "$FRONTEND_URL/api/health" | grep -q "healthy"; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC} (Proxy might not be configured correctly)"
fi

echo ""
echo "=========================================="
echo "Integration Test Complete!"
echo "=========================================="
echo ""
echo "Access points:"
echo "  Frontend:  $FRONTEND_URL"
echo "  Backend:   $BACKEND_URL"
echo "  API Docs:  $BACKEND_URL/docs"
echo ""

exit 0
