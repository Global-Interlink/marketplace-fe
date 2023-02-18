import React from "react";
import ArrowDown from "../Icons/ArrowDown";
import { useDetectClickOutside } from "react-detect-click-outside";
const Sort = () => {
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
    },
  });
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative" ref={ref}>
      <div
        className="border flex text-[#5B5B5B] dark:text-white bg-white items-center justify-between dark:bg-gray-800 w-[155px] h-10 px-5 rounded-full cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <p>Newest</p>
        <ArrowDown />
      </div>
      {open && (
        <div className="absolute mt-2 bg-white dark:bg-gray-800 border shadow w-full rounded-[10px] z-10">
          <p
            onClick={() => {
              setOpen(false);
            }}
            className="rounded-[10px] text-black px-5 py-3 hover:bg-slate-200 cursor-pointer dark:hover:bg-gray-600 dark:text-white"
          >
            Oldest
          </p>
        </div>
      )}
    </div>
  );
};

export default Sort;
