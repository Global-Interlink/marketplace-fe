import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { clear, searchLaunchpad } from "../../../redux/search/searchSlice";

const SearchForm = () => {
  const [text, setText] = React.useState("");
  const [showBottom, setShowBottom] = React.useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setShowBottom(false);
    },
  });
  const dispatch = useAppDispatch();
  const [isFocus, setFocus] = React.useState(false);
  const { response } = useAppSelector((store) => store.search.searchData);
  console.log("==search", response);
  const debounceSearch = React.useCallback(
    debounce((nextValue) => {
      if (nextValue.length === 0) {
        dispatch(clear());
        return;
      }
      dispatch(searchLaunchpad(nextValue));
    }, 1000),
    []
  );

  React.useEffect(() => {
    return () => {
      dispatch(clear());
    };
  }, []);

  return (
    <div className="relative flex" ref={ref}>
      <div
        className={` ${
          isFocus ? "border" : ""
        } px-6 py-4 flex items-center space-x-4 w-[100%] lg:w-[300px] xl:w-[380px] h-12 bg-gray-100 dark:bg-gray-900 rounded-full`}
      >
        <Image src="/ic_search.svg" width={24} height={24} alt="ic-search"/>
        <input
          placeholder="Search Collections and Creators"
          className="bg-transparent text-sm flex-1 outline-none dark:caret-white dark:text-white"
          onChange={(e) => {
            const { value } = e.target;
            setText(value);
            debounceSearch(value);
          }}
          value={text}
          onFocus={() => {
            setFocus(true);
            setShowBottom(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
        />
        {text.length > 0 && (
          <button
            onClick={() => {
              setText("");
              dispatch(clear());
            }}
          >
            <Image width={24} height={24} src="/ic-close.svg" alt="ic-close" />
          </button>
        )}
      </div>
      {showBottom && response && response.data.length > 0 && (
        <div className="absolute z-20 shadow-2xl text-white w-full lg:w-[300px] xl:w-[380px] max-h-[428px] bg-white dark:bg-gray-900 mt-14 py-3 overflow-y-auto rounded-xl">
          <p className="px-6 text-gray-400">Collections</p>
          <hr className="border-gray-300 dark:border-gray-800 mt-3" />
          {response.data.map((i, idx) => {
            return (
              <Link key={idx} href={`/launchpad/${i.id}`}>
                <div
                  key={idx}
                  className="flex items-center space-x-3 px-6 pt-3 pb-3 cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-400 dark:hover:bg-gray-800"
                  onClick={() => {
                    setShowBottom(false);
                  }}
                >
                  <div>
                    <Image
                      width={44}
                      height={44}
                      alt="logo-searc"
                      src={i.featuredImage}
                      className="rounded-full w-[44px] h-[44px]" 
                    />
                  </div>
                  <div>
                    <span className="externalSP text-sm text-black dark:text-white">{i.name}</span>
                    <div className="flex items-center space-x-3 mt-[6px]">
                      <Image
                        width={24}
                        height={24}
                        alt="chain"
                        src="/ic-sui.jpeg"
                        className="rounded-full object-cover w-6 h-6"
                      />
                      <span className="text-gray-500 text-sm">
                        {i.totalItems} items
                      </span>
                    </div>
                  </div>
                </div>
                {idx < response.data.length - 1 && (
                  <hr className="border-gray-300 dark:border-gray-800" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
