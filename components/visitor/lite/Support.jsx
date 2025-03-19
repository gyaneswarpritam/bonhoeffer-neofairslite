const Support = ({ closeSupport }) => {
  return (
    <div className="bg-[#000000]/[.89] w-full h-[100dvh] absolute z-[1001] flex justify-center items-center top-0">
      <div className="modelDiv text-white mx-5 h-auto max-h-[90%] overflow-y-auto bg-white rounded-[20px] w-full max-w-[470px] md:p-[30px] p-5">
        <h1 className="text-3xl font-bold text-black font-quickSand">
          Contact Support
        </h1>
        <div className="mt-1 flex flex-col">
          <label className="text-black font-bold font-quickSand text-base">
            Email: support@neofairs.com
          </label>
        </div>
        <div className="mt-1 flex flex-col">
          <label className="text-black font-bold font-quickSand text-base">
            Phone: +91 70101 30684
          </label>
        </div>
        <button
          onClick={closeSupport}
          type="button"
          className="md:ml-4 sm:ml-0 md:mt-10 mt-2 xs:mt-2 bg-black text-white px-6 py-3 sm:py-1  rounded-lg font-lato font-bold text-base w-full md:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Support;
