const Navbar = () => {
  return (
    <header className="bg-opacity-70 text-white ">
      <div className="w-full lg:p-8 md:p-6 sm:p-4 ">
        <div className="flex flex-col justify-center items-center md:flex-row lg:flex-row md:justify-between lg:justify-between ">
          <div className="text-center sm:text-left flex flex-col ">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {/* <Link to={"/"}>BookLit</Link> */}
              Transcripty
            </h1>
            <p className="mt-1.5 text-sm font-thin">
              Transcribe your audio in seconds!! 🎉
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
