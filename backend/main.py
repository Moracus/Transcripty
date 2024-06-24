import requests
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from pydub import AudioSegment  # For audio processing
from dotenv import load_dotenv
import time
from requests.exceptions import RequestException

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







def query(data, max_retries=5, initial_wait=10):
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=HEADERS, data=data)
            print(f"Request to {API_URL} with headers {HEADERS}\n")
            print(f"Response status code: {response.status_code}\n")
            print(f"Response content: {response.content}\n")
            response.raise_for_status()
            return response.json()
        except RequestException as e:
            if response.status_code == 503 and "is currently loading" in response.text:
                wait_time = initial_wait * (2 ** attempt)  # Exponential backoff
                print(f"Model is loading. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                raise e
    
    raise Exception("Max retries reached. Model is still loading.")


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
        print(f"Error: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/health")
async def root():
    return {"message": "Hello World"}
