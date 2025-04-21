#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
# Replace with your actual values
IMAGE_NAME="baxus-frontend"
GCR_HOST="eu.gcr.io"
PROJECT_ID="baxathon" # Your Google Cloud Project ID
SERVICE_NAME="baxus-frontend" # Your Cloud Run service name
REGION="europe-west1" # The region your Cloud Run service is in
# --- End Configuration ---

IMAGE_TAG="${GCR_HOST}/${PROJECT_ID}/${IMAGE_NAME}:latest" # Added :latest tag

# 1. Build the Docker image
echo "Building Docker image: ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

# 2. Tag the Docker image
echo "Tagging image as: ${IMAGE_TAG}..."
docker tag "${IMAGE_NAME}" "${IMAGE_TAG}"

# 3. Push the Docker image to Google Container Registry
# Make sure you have authenticated Docker with GCR (e.g., using `gcloud auth configure-docker ${GCR_HOST}`)
echo "Pushing image to GCR: ${IMAGE_TAG}..."
docker push "${IMAGE_TAG}"

# 4. Deploy the image to Google Cloud Run
# Make sure you are authenticated with gcloud (gcloud auth login) and have set the project (gcloud config set project ${PROJECT_ID})
echo "Deploying image to Cloud Run service: ${SERVICE_NAME} in region ${REGION}..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_TAG}" \
  --region "${REGION}" \
  --platform managed \
  --quiet # Use --quiet to avoid interactive prompts

echo "Deployment to ${SERVICE_NAME} successful!"
