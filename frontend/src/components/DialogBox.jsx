const DialogBox = ({
  fileName,
  setOpenDialog,
  setFileConfirmed,
  setSelectedFile,
}) => {
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div className=" fixed min-h-screen w-screen bg-[rgba(0,0,0,0.5)] top-0 right-0  left-0 bottom-0 z-20 flex justify-center items-center">
        <div className="bg-gray-200 min-w-1/4 min-h-1/4 border-[3px] border-black p-8 border-spacing-5 flex flex-col">
          <h1 className="text-3xl font-bold text-black">Are you sure?</h1>
          <h3 className="text-xl italic font-thin text-black">
            &apos;{fileName}&apos; will be transcripted
          </h3>
          <div className="flex justify-around mt-5">
            <button
              className="bg-rose-600 px-5 py-2 rounded-md border border-black hover:border-l-4 hover:border-b-4 transition-all duration-300"
              onClick={() => setFileConfirmed(true)}
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
      </div>
    </>
  );
};

export default DialogBox;
