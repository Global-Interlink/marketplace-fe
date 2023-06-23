import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";
import { Modal } from "antd";
import CloseIcon from "../../atoms/Icons/CloseIcon";
interface Props {
  close?: () => void;
  isEligible: boolean;
}

const EligibleModal: React.FC<Props> = ({ close, isEligible }) => {
  return (
    <Modal
      centered
      open={true}
      footer={null}
      width={700}
      onCancel={close}
      closeIcon={<CloseIcon />}
    >
      <div className="flex flex-col justify-center">
        <div className="py-10 space-y-4 flex flex-col items-center justify-center">
          <Image
            src={isEligible ? "/eligilble.png" : "/not-eligilble.png"}
            alt="eligilble"
            width={100}
            height={100}
          />
          <p className="text-[20px] md:text-[30px] font-medium">
            {isEligible
              ? "Eligible to participate"
              : "Not eligible to participate"}
          </p>
          <p className="text-center whitespace-pre-wrap">
            {isEligible
              ? "As long as you’re holding at least 1 Dynamic NFT, you’re eligible to participate in the Festival to do daily tasks and weekly reward"
              : "You need to have at least 1 Dynamic NFT in your wallet to be eligible to participate in the Festival to do daily tasks and weekly reward"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default EligibleModal;
