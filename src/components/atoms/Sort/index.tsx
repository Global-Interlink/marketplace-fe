import React from "react";
import ArrowDown from "../Icons/ArrowDown";
import { useDetectClickOutside } from "react-detect-click-outside";
interface Props {
  onChange: (sort: "ASC" | "DESC") => void;
}
const Sort: React.FC<Props> = ({ onChange }) => {
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
    },
  });
  const [open, setOpen] = React.useState(false);
  const [currentSort, setCurrentSort] = React.useState<"ASC" | "DESC">("DESC");
  return (
    <div className="relative" ref={ref}>
      <div
        className="border flex text-[#5B5B5B] dark:text-white bg-white border-primaryDark items-center justify-between dark:bg-[#514E89] w-[155px] h-10 px-5 rounded-full cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <p>{currentSort === "DESC" ? "Newest" : "Oldest"}</p>
        <ArrowDown />
      </div>
      {open && (
        <div className="absolute mt-2 bg-white dark:bg-[#514E89] border border-primaryDark shadow w-full rounded-[10px] z-10">
          <p
            onClick={() => {
              setOpen(false);
              if (currentSort === "DESC") {
                setCurrentSort("ASC");
                onChange("ASC");
              } else {
                setCurrentSort("DESC");
                onChange("DESC");
              }
            }}
            className="rounded-[10px] text-black px-5 py-3 hover:bg-slate-200 cursor-pointer dark:hover:bg-gray-600 dark:text-white"
          >
            {currentSort === "ASC" ? "Newest" : "Oldest"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sort;
