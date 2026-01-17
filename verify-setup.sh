#!/bin/bash

# Setup Verification Script for Zettel
# Verifies that all required files and configurations are in place

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "Zettel Setup Verification"
echo -e "==========================================${NC}"
echo ""

# Counters
PASS=0
FAIL=0
WARN=0

# Helper functions
check_file() {
    local file=$1
    local description=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description: $file ${RED}(MISSING)${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

check_dir() {
    local dir=$1
    local description=$2

    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description: $dir"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description: $dir ${RED}(MISSING)${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

check_command() {
    local cmd=$1
    local description=$2

    if command -v "$cmd" &> /dev/null; then
        local version=$($cmd --version 2>&1 | head -1)
        echo -e "${GREEN}✓${NC} $description: $version"
        PASS=$((PASS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description ${RED}(NOT INSTALLED)${NC}"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

check_env_var() {
    local var_name=$1
    local file=$2

    if [ -f "$file" ]; then
        if grep -q "^${var_name}=" "$file"; then
            local value=$(grep "^${var_name}=" "$file" | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_"* ]; then
                echo -e "${GREEN}✓${NC} $var_name is set in $file"
                PASS=$((PASS + 1))
                return 0
            else
                echo -e "${YELLOW}⚠${NC} $var_name exists but uses placeholder value in $file"
                WARN=$((WARN + 1))
                return 1
            fi
        else
            echo -e "${RED}✗${NC} $var_name not found in $file"
            FAIL=$((FAIL + 1))
            return 1
        fi
    else
        echo -e "${RED}✗${NC} File not found: $file"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

# Section 1: System Requirements
echo -e "${BLUE}[1/6] System Requirements${NC}"
echo "-------------------------------------------"
check_command "python3" "Python"
check_command "node" "Node.js"
check_command "npm" "npm"
check_command "docker" "Docker"
check_command "docker-compose" "Docker Compose" || check_command "docker" "Docker (with compose plugin)"
echo ""

# Section 2: Project Structure
echo -e "${BLUE}[2/6] Project Structure${NC}"
echo "-------------------------------------------"
check_file "README.md" "Main README"
check_file "docker-compose.yml" "Docker Compose (Production)"
check_file "docker-compose.dev.yml" "Docker Compose (Development)"
check_file ".gitignore" "Git ignore file"
check_file "test-integration.sh" "Integration test script"
check_dir "backend" "Backend directory"
check_dir "frontend" "Frontend directory"
check_dir "docs" "Documentation directory"
echo ""

# Section 3: Backend Setup
echo -e "${BLUE}[3/6] Backend Setup${NC}"
echo "-------------------------------------------"
check_file "backend/Dockerfile" "Backend Dockerfile"
check_file "backend/requirements.txt" "Python requirements"
check_file "backend/app/main.py" "Backend main application"
check_file "backend/.env.example" "Backend env example"
check_dir "backend/app" "Backend app directory"
check_dir "backend/app/routers" "Backend routers" || check_dir "backend/app/api" "Backend API directory"
check_dir "backend/app/models" "Backend models"
check_dir "backend/app/schemas" "Backend schemas"
check_dir "backend/app/services" "Backend services"

# Check if virtual environment exists
if [ -d "backend/venv" ] || [ -d "backend/.venv" ]; then
    echo -e "${GREEN}✓${NC} Python virtual environment found"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}⚠${NC} Python virtual environment not found (run: python -m venv venv)"
    WARN=$((WARN + 1))
fi
echo ""

# Section 4: Frontend Setup
echo -e "${BLUE}[4/6] Frontend Setup${NC}"
echo "-------------------------------------------"
check_file "frontend/Dockerfile" "Frontend Dockerfile (Production)"
check_file "frontend/Dockerfile.dev" "Frontend Dockerfile (Development)"
check_file "frontend/nginx.conf" "Nginx configuration"
check_file "frontend/package.json" "Package.json"
check_file "frontend/vite.config.ts" "Vite configuration"
check_file "frontend/tsconfig.json" "TypeScript configuration"
check_dir "frontend/src" "Frontend source directory"
check_dir "frontend/src/components" "Frontend components"
check_dir "frontend/src/pages" "Frontend pages"
check_dir "frontend/src/services" "Frontend services"

# Check if node_modules exists
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Node modules installed"
    PASS=$((PASS + 1))
else
    echo -e "${YELLOW}⚠${NC} Node modules not found (run: npm install)"
    WARN=$((WARN + 1))
fi
echo ""

# Section 5: Environment Variables
echo -e "${BLUE}[5/6] Environment Variables${NC}"
echo "-------------------------------------------"

# Check root .env
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Root .env file exists"
    PASS=$((PASS + 1))
    check_env_var "YOUTUBE_API_KEY" ".env"
else
    echo -e "${YELLOW}⚠${NC} Root .env file not found (copy from .env.example)"
    WARN=$((WARN + 1))
fi

# Check backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
    PASS=$((PASS + 1))
    check_env_var "YOUTUBE_API_KEY" "backend/.env"
    check_env_var "DATABASE_URL" "backend/.env"
else
    echo -e "${YELLOW}⚠${NC} Backend .env file not found (copy from backend/.env.example)"
    WARN=$((WARN + 1))
fi
echo ""

# Section 6: Documentation
echo -e "${BLUE}[6/6] Documentation${NC}"
echo "-------------------------------------------"
check_file "QUICKSTART.md" "Quick start guide"
check_file "INTEGRATION_CHECKLIST.md" "Integration checklist"
check_file "T4.2_COMPLETION_REPORT.md" "Completion report"
check_file "docs/planning/01-prd.md" "Product Requirements"
check_file "docs/planning/02-trd.md" "Technical Requirements"
echo ""

# Summary
echo -e "${BLUE}=========================================="
echo "Summary"
echo -e "==========================================${NC}"
echo -e "${GREEN}Passed:${NC}  $PASS"
echo -e "${YELLOW}Warnings:${NC} $WARN"
echo -e "${RED}Failed:${NC}  $FAIL"
echo ""

if [ $FAIL -gt 0 ]; then
    echo -e "${RED}Setup verification FAILED. Please fix the issues above.${NC}"
    exit 1
elif [ $WARN -gt 0 ]; then
    echo -e "${YELLOW}Setup verification passed with WARNINGS.${NC}"
    echo "You can proceed, but consider addressing the warnings."
    exit 0
else
    echo -e "${GREEN}Setup verification PASSED!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start backend:  cd backend && uvicorn app.main:app --reload"
    echo "2. Start frontend: cd frontend && npm run dev"
    echo "3. Run tests:      ./test-integration.sh"
    exit 0
fi
