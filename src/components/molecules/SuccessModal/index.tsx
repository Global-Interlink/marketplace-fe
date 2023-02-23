import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
interface Props {
  close?: () => void;
  txHash?: string;
  owner?: string;
  price?: number;
  title: string;
  message: string;
}

const SuccessModal: React.FC<Props> = ({ close, title, message }) => {
  const { theme } = useTheme();
  return (
    <div>
      <div className={"modal fade show block"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content relative w-[550px] max-w-[550px]">
            <div className="py-10 flex flex-col items-center justify-center">
              <Image
                src={
                  theme === "light" ? "/ic-success.svg" : "/ic-success-d.svg"
                }
                alt="success"
                width={246}
                height={246}
              />
              <p className="text-[#892DF0] dark:text-white font-medium text-[36px] mt-[37px]">
                {title}
              </p>
              <p className="text-2xl mt-2 text-black dark:text-white">
                {message}
              </p>
            </div>
            {/* footer */}
            <div className="font-light flex items-center justify-center space-x-5 mb-11">
              <button
                className="hoverCommon primaryButton  text-white font-medium w-2/3 h-12 rounded-full"
                onClick={() => {
                  close && close();
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
