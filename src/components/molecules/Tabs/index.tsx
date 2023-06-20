import React from "react";

interface Props {
  items: {
    key: string;
    title: string;
  }[];
  onChangeKey: (key: string) => void;
  activeKey: string;
}
const Tabs: React.FC<Props> = ({ items, onChangeKey, activeKey }) => {
  return (
    <ul className="inline-flex rounded-lg text-center p-1 text-[#667085] dark:text-[#98A2B3] border bg-gray-50">
      {items.map((i) => {
        return (
          <li className="mr-2" key={i.key}>
            <button
              className={`inline-block text-sm px-4 py-2 hover:tex rounded-lg ${
                i.key === activeKey
                  ? "bg-white shadow-sm text-[#344054]"
                  : "hover:text-[#101828] hover:bg-gray-100 text-[#667085]"
              }`}
              onClick={() => {
                onChangeKey(i.key);
              }}
            >
              {i.title}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
export default Tabs;
