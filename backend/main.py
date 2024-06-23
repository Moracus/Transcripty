import requests
import aiocron
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pydub import AudioSegment  # For audio processing
from dotenv import load_dotenv
import logging

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_URL = "https://api-inference.huggingface.co/models/openai/whisper-medium"
HEADERS = {"Authorization": "Bearer "+os.getenv("API_KEY")}

CHUNK_SIZE_MS = 30000  # 30 seconds





@aiocron.crontab('*/5 * * * *')
async def self_ping():
    response = requests.get('https://transcripty.onrender.com/health')
    print(f"Health check response: {response.status_code}")

def query(data):
    response = requests.post(API_URL, headers=HEADERS, data=data)
    print(f"Request to {API_URL} with headers {HEADERS}\n")
    print(f"Response status code: {response.status_code}\n")
    print(f"Response content: {response.content}\n")
    response.raise_for_status()  # Raise an exception for HTTP errors
  
    return response.json()


def split_audio_file(filename):
    audio = AudioSegment.from_file(filename)
    chunks = []
    for i in range(0, len(audio), CHUNK_SIZE_MS):
        chunks.append(audio[i:i + CHUNK_SIZE_MS])
    return chunks


@app.post("/post-audio")
async def post_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded audio file
        with open("temp_audio.flac", "wb") as f:
            f.write(await file.read())

        # Split the audio file into smaller chunks
        chunks = split_audio_file("temp_audio.flac")

        # Transcribe each chunk
        converted_text = ""
        for i, chunk in enumerate(chunks):
            chunk_filename = f"chunk_{i}.flac"
            chunk.export(chunk_filename, format="flac")
            with open(chunk_filename, "rb") as f:
                data = f.read()
            text_response = query(data)
            converted_text += text_response['text'] + " "

        # Print the converted text
        print("Converted Text:", converted_text)

        # Return the text response
        return JSONResponse(content={"text": converted_text.strip()})

    except requests.RequestException as e:
        print(f"HTTP error: {e}")
        return JSONResponse(content={"error": "HTTP error occurred"}, status_code=500)
    except Exception as e:
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/health")
async def root():
    return {"message": "Hello World"}
