import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

interface Props {
  title: string;
  shareUrl: string;
}

const ShareItem: React.FC<Props> = ({ title, shareUrl }) => {
  const [isOpen, setOpen] = React.useState(false);
  const { theme } = useTheme();
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
    },
  });
  return (
    <div className="relative flex cursor-pointer" ref={ref}>
      <div
        className="flex items-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Image
          width={24}
          height={24}
          src={theme === "dark" ? "/ic-share.svg" : "/ic-share-l.svg"}
          alt="ic-share"
        />
      </div>
      {isOpen && (
        <div className="absolute z-20 md:right-[-60px] ">
          <div className=" text-white flex items-center bg-gray-900 mt-10 p-4 overflow-y-auto rounded-lg space-x-4 shadow-xl">
            <FacebookShareButton
              url={shareUrl}
              quote={title}
              className="Demo__some-network__share-button"
              onClick={() => {
                setOpen(false);
              }}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
              onClick={() => {
                setOpen(false);
              }}
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareItem;
