import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
interface Props {
  close?: () => void;
  txHash?: string;
  owner?: string;
  price?: number;
}

const SuccessModal: React.FC<Props> = ({ close }) => {
  const router = useRouter();
  return (
    <div>
      <div className={"modal fade show block"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content relative w-[550px] max-w-[550px]">
            <div className="py-10 flex flex-col items-center justify-center">
              <Image
                src={"/ic-success.svg"}
                alt="success"
                width={246}
                height={246}
              />
              <p className="text-[#892DF0] font-medium text-[36px] mt-[37px]">
                Congratulations !
              </p>
              <p className="text-2xl mt-2">
                Your item has been activated for sale
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
