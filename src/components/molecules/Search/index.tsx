import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { clear, searchLaunchpad } from "../../../redux/search/searchSlice";
import ImgIcon from "../../atoms/Icons/ImgIcon";

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
          isFocus ? "border" : "border border-transparent"
        } px-6 py-4 flex items-center space-x-4 w-[100%] lg:w-[300px] xl:w-[380px] h-12 bg-white dark:bg-[#392B4A]/50 rounded-full`}
      >
        <Image src="/ic_search.svg" width={20} height={20} alt="ic-search"/>
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
        <div id="home-search" className="absolute z-20 shadow-2xl text-white w-full lg:w-[300px] xl:w-[380px] max-h-[428px] bg-white dark:bg-bgProperty mt-14 py-3 overflow-y-auto rounded-xl">
          <p className="px-6 text-gray-400">Collections</p>
          <hr className="border-gray-300 dark:border-gray-800 mt-3" />
          {response.data.map((i, idx) => {
            return (
              <Link key={idx} href={`/collection/${i.id}`}>
                <div
                  key={idx}
                  className="flex items-start space-x-3 px-6 pt-3 pb-3 cursor-pointer bg-white dark:bg-bgProperty hover:bg-gray-400"
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
                      className="rounded-full w-[44px] min-w-[44px] h-[44px]" 
                    />
                  </div>
                  <div>
                    <span className="externalSP text-sm text-black dark:text-white break-all line-clamp-2" title={i.name}>{i.name}</span>
                    <div className="flex items-center space-x-3 mt-[6px]">
                      <span className="text-gray-500 text-sm">
                        {i.totalNfts} items
                      </span>
                      <ImgIcon />
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
