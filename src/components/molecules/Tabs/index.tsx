import React from "react";

interface Props {
  items: {
    key: string;
    title: string;
  }[];
}
const Tabs: React.FC<Props> = ({ items }) => {
  const [activeId, setActiveId] = React.useState("");
  React.useEffect(() => {
    if (items) {
      setActiveId(items[0].key);
    }
  }, [items]);
  return (
    <ul className="inline-flex rounded-lg text-center p-1 text-gray-500 dark:text-gray-400 border bg-gray-50">
      {items.map((i) => {
        return (
          <li className="mr-2" key={i.key}>
            <button
              className={`inline-block text-sm px-4 py-2 hover:tex rounded-lg ${
                i.key === activeId
                  ? "bg-white shadow-sm text-gray-700"
                  : "hover:text-gray-900 hover:bg-gray-100 text-gray-500"
              }`}
              onClick={() => {
                setActiveId(i.key);
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
