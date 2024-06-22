import Button from "../components/Button";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import DialogBox from "../components/DialogBox";
import ProgressBar from "../components/ProgressBar";
import RecordingDialogBox from "../components/RecordingDialogBox";
const BACKEND_URL = import.meta.env.VITE_BACKEND;
const Home = () => {
  const fileInputRef = useRef();
  const [transcript, setTranscript] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRecorderBox, setOpenRecorderBox] = useState(false);
  const [fileConfirmed, setFileConfirmed] = useState(false);
  const [recordingConfirmed, setRecordingConfirmed] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleInputChange = (e) => {
    setOpenDialog(true);
    console.log(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };
  useEffect(() => {
    if (selectedFile && fileConfirmed) {
      console.log(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      console.log(fileUrl);
      transcription(fileUrl);
    }
  }, [selectedFile, fileConfirmed]);
  const transcription = async (mediaBlobUrl) => {
    setOpenDialog(false);
    setOpenRecorderBox(false);
    try {
      console.log("stopped recording");
      setLoading(true);
      setProgress(0);
      simulateProgress();
      // Fetch the media data
      const mediaData = await fetch(mediaBlobUrl);

      // Convert the media data to a Blob object
      const mediaBlob = await mediaData.blob();

      const formData = new FormData();
      formData.append("file", mediaBlob, "recording.mp3");

      const response = await axios.post(`${BACKEND_URL}/post-audio`, formData, {
        headers: {
          "Content-Type": "audio/mp3", // or whatever format your recorded media is in
        },
      });
      const resText = await response.data.text;
      setTranscript(resText); // Access the correct key for transcript
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setProgress(100); // Ensure progress bar completes on success/failure
    }
  };
  useEffect(() => {
    console.log(transcript);
  }, [transcript]);
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const simulateProgress = () => {
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      if (progressValue < 100) {
        setProgress(progressValue);
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className="min-h-full flex flex-col flex-auto justify-center items-center gap-8 md:flex-row">
      <div className=" h-72 w-60 md:h-[36rem] md:w-[30rem] p-5 bg-slate-600 text-white border border-white text-wrap overflow-x-hidden overflow-y-hidden hover:overflow-y-scroll ">
        {loading ? (
          <div className="h-full w-full flex flex-col justify-center items-center">
            <p className="text-gray-400 ">Transcription in progress...</p>
            <div className="w-full">
              <ProgressBar progress={progress} />
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col ">
            <div className="flex flex-row-reverse align-top">
              {transcript && <MdOutlineContentCopy onClick={handleCopyText} />}
            </div>
            <p className="text-gray-400 ">
              {transcript ? transcript : "Your transcription will be here."}
            </p>
          </div>
        )}
      </div>
      <div className=" flex flex-col justify-center items-center md:flex-row gap-5 md:gap-8">
        <div className=" text-white">
          <Button
            label={"Record audio"}
            onClick={() => setOpenRecorderBox(true)}
          />
          {/* <ReactMediaRecorder
            audio
            render={({ status, startRecording, stopRecording }) => {
              return (
                <>
                  <Button
                    label={"Record Audio"}
                    onClick={() =>
                      handleRecordClick(status, startRecording, stopRecording)
                    }
                  ></Button>
                </>
              );
            }}
            onStop={(mediaBlobUrl) => handleRecordStop(mediaBlobUrl)}
          /> */}
          {openRecorderBox && (
            <RecordingDialogBox
              transcription={transcription}
              setOpenRecorderBox={setOpenRecorderBox}
            />
          )}
          <h2 className="text-white text-2xl">or</h2>
          <input
            type="file"
            hidden
            multiple={false}
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="audio/*"
          />
          <Button label={"upload audio(mp3)"} onClick={handleFileSelect} />
          {openDialog && (
            <DialogBox
              fileName={selectedFile?.name}
              setOpenDialog={setOpenDialog}
              setFileConfirmed={setFileConfirmed}
              setSelectedFile={setSelectedFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
