import { useEffect, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

import Button from "./Button";

const RecordingDialogBox = ({ setOpenRecorderBox, transcription }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [fileBlobUrl, setFileBlobUrl] = useState(null);
  useEffect(() => {
    let interval;
    if (startTimer) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTimer]);

  const handleRecordClick = (status, startRecording, stopRecording) => {
    setStartTimer((p) => !p);
    status === "recording" ? stopRecording() : startRecording();
    console.log(status);
  };
  const handleRecordStop = (mediaBlobUrl) => {
    setFileBlobUrl(mediaBlobUrl);
  };
  const handleClose = () => {
    setFileBlobUrl(null);
    setOpenRecorderBox(false);
  };
  return (
    <>
      <div className=" fixed min-h-screen w-screen bg-[rgba(0,0,0,0.5)] top-0 right-0  left-0 bottom-0 z-20 flex justify-center items-center">
        <div className="bg-gray-200 min-w-1/4 min-h-1/4 border-[3px] border-black p-8 border-spacing-5 flex flex-col">
          <h1 className="text-3xl font-bold text-black">Recording...</h1>
          <h3 className="text-xl italic font-thin text-black self-center">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h3>
          {!fileBlobUrl && (
            <ReactMediaRecorder
              audio
              render={({ status, startRecording, stopRecording }) => {
                return (
                  <>
                    <Button
                      label={status === "idle" ? "start" : "stop"}
                      onClick={() =>
                        handleRecordClick(status, startRecording, stopRecording)
                      }
                    ></Button>
                  </>
                );
              }}
              onStop={(mediaBlobUrl) => handleRecordStop(mediaBlobUrl)}
            />
          )}
          {fileBlobUrl && (
            <div>
              <audio src={fileBlobUrl} controls />
              <div className="flex justify-around mt-5">
                <button
                  className="bg-rose-600 px-5 py-2 rounded-md border border-black hover:border-l-4 hover:border-b-4 transition-all duration-300"
                  onClick={() => transcription(fileBlobUrl)}
                >
                  Transcribe
                </button>
                <button
                  className="bg-gray-600 px-5 py-2 rounded-md border border-black hover:border-l-4 hover:border-b-4 transition-all duration-300"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecordingDialogBox;
