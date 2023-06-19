import React from "react";

interface Props {
  breadcrumbs: { title: string; path?: string }[];
}
const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => {
  return (
    <div className="text-gray-900 dark:text-white text-lg md:text-[24px] mb-4 md:mb-10">
      {breadcrumbs.map((breadcrumb, index) => (
        <a key={index} href={breadcrumb.path} className="hover:text-gray-900 dark:hover:text-gray-400 cursor-pointer">
          {breadcrumb.title}
          {index !== breadcrumbs.length - 1 && <span> {">"} </span>}
        </a>
      ))}
    </div>
  );
};

export default Breadcrumbs;
