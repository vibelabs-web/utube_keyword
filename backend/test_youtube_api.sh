#!/bin/bash
# YouTube API REST Endpoints Test Script
# Usage: ./backend/test_youtube_api.sh

set -e

BASE_URL="http://localhost:8000/api/v1/youtube"
BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
RESET="\033[0m"

echo -e "${BOLD}========================================${RESET}"
echo -e "${BOLD}YouTube API Endpoints Test${RESET}"
echo -e "${BOLD}========================================${RESET}\n"

# Check if server is running
echo -e "${BOLD}[0] Checking server...${RESET}"
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${RED}Error: Server is not running!${RESET}"
    echo "Start server with: cd backend && uvicorn app.main:app --reload"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${RESET}\n"

# Test 1: Quota check
echo -e "${BOLD}[1] Testing quota check...${RESET}"
curl -s "${BASE_URL}/quota" | jq '.'
echo -e "${GREEN}✓ Quota check completed${RESET}\n"

# Test 2: Video search
echo -e "${BOLD}[2] Testing video search...${RESET}"
SEARCH_RESULT=$(curl -s "${BASE_URL}/search?query=python%20tutorial&max_results=3")
echo "$SEARCH_RESULT" | jq '.[0] | {video_id, title, channel_title}'
VIDEO_ID=$(echo "$SEARCH_RESULT" | jq -r '.[0].video_id')
CHANNEL_ID=$(echo "$SEARCH_RESULT" | jq -r '.[0].channel_id')
echo -e "${GREEN}✓ Search completed (found video_id: $VIDEO_ID)${RESET}\n"

# Test 3: Video details
echo -e "${BOLD}[3] Testing video details...${RESET}"
curl -s "${BASE_URL}/videos/${VIDEO_ID}" | jq '{title, channel_title, view_count, like_count, duration}'
echo -e "${GREEN}✓ Video details retrieved${RESET}\n"

# Test 4: Video comments
echo -e "${BOLD}[4] Testing video comments...${RESET}"
COMMENTS=$(curl -s "${BASE_URL}/videos/${VIDEO_ID}/comments?max_results=3")
echo "$COMMENTS" | jq '.[0] | {author_name, text: .text[0:100], like_count}'
COMMENT_COUNT=$(echo "$COMMENTS" | jq '. | length')
echo -e "${GREEN}✓ Retrieved $COMMENT_COUNT comments${RESET}\n"

# Test 5: Channel info
echo -e "${BOLD}[5] Testing channel info...${RESET}"
curl -s "${BASE_URL}/channels/${CHANNEL_ID}" | jq '{title, subscriber_count, video_count}'
echo -e "${GREEN}✓ Channel info retrieved${RESET}\n"

# Test 6: Error handling (invalid video ID)
echo -e "${BOLD}[6] Testing error handling...${RESET}"
ERROR_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/videos/invalid_id_12345")
HTTP_CODE=$(echo "$ERROR_RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✓ Error handling works (HTTP $HTTP_CODE)${RESET}\n"
else
    echo -e "${RED}✗ Expected 404/400, got $HTTP_CODE${RESET}\n"
fi

echo -e "${BOLD}========================================${RESET}"
echo -e "${GREEN}${BOLD}All tests completed!${RESET}"
echo -e "${BOLD}========================================${RESET}"
