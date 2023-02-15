import ArrowDown from "../Icons/ArrowDown";

const Sort = () => {
  return (
    <div className="border flex text-[#5B5B5B] dark:text-white bg-white items-center justify-between dark:bg-gray-800 w-[155px] h-10 px-5 rounded-full cursor-pointer">
      <p>Newest</p>
      <ArrowDown />
    </div>
  );
};

export default Sort;
