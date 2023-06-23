import Image from "next/image";
import React from "react";
import { Modal } from "antd";
import CloseIcon from "../../atoms/Icons/CloseIcon";
import Link from "next/link";
interface Props {
  close?: () => void;
  errorMessage?: string;
}

const BuyTicketResponseModal: React.FC<Props> = ({ close, errorMessage }) => {
  return (
    <Modal
      centered
      open={true}
      footer={null}
      width={590}
      onCancel={close}
      closeIcon={<CloseIcon />}
    >
      <div className="flex flex-col justify-center">
        <div className="py-10 space-y-4 flex flex-col items-center justify-center">
          <Image
            src={!errorMessage ? "/eligilble.png" : "/not-eligilble.png"}
            alt="eligilble"
            width={100}
            height={100}
          />
          <p className="text-[20px] md:text-[30px] font-medium">
            {errorMessage ? errorMessage : "Successfully buy 1 ticket"}
          </p>
          {errorMessage ? (
            <p className="text-center whitespace-pre-wrap">
              Please try again later. If this problem persist, please take a
              screenshot and contact our team via our social channel to receive
              best support
            </p>
          ) : (
            <p className="text-center text-[#667085] whitespace-pre-wrap">
              {`Congratulations! Let's wait to find out if it is your lucky ones. \nYou can check your tickets at this `}
              <Link
                className="text-[#E23DCC]"
                href="/event/weekly-reward/tickets"
              >
                page
              </Link>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BuyTicketResponseModal;
