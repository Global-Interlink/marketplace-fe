import React from "react";
import { Modal } from "antd";
import CloseIcon from "../../atoms/Icons/CloseIcon";

interface Props {
  close?: () => void;
  type: "forEvery" | "completedAnyTask" | "completedAllTask";
  numberOfNFTs?: number;
  currentTGIL?: number;
  handleBuy: (
    type: "forEvery" | "completedAnyTask" | "completedAllTask"
  ) => void;
}

const ConfirmBuyTicketModal: React.FC<Props> = ({
  close,
  type,
  numberOfNFTs,
  currentTGIL,
  handleBuy,
}) => {
  const price =
    type === "forEvery"
      ? numberOfNFTs && numberOfNFTs > 0
        ? 1000
        : 2000
      : type === "completedAnyTask"
      ? 1000
      : 3000;
  const isNotEnoughTGIL = currentTGIL ? currentTGIL < price : true;
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
          <p className="text-[20px] md:text-[30px] font-medium">
            Confirm to buy action
          </p>
          <div className="flex flex-col w-full space-y-3">
            <div className="flex items-start justify-between w-full text-[#667085]">
              <div>
                <p>You are trying to buy :</p>
                {type === "forEvery" && (
                  <p className="text-[12px] font-light">
                    (Dynamic NFT Holder can buy at 1000 tGIL)
                  </p>
                )}
              </div>
              <p className="text-[#EB77DC] text-end">
                {type === "completedAllTask" ? "3" : "1"} ticket x {price} tGIL
              </p>
            </div>
            <div className="flex items-start justify-between w-full text-[#667085]">
              <p>Current balance:</p>
              <div>
                <p className="text-[#EB77DC] text-end">{currentTGIL} tGIL</p>
                {isNotEnoughTGIL && (
                  <p className="text-[#F04438] text-end text-[12px] font-light">
                    Not enough tGIL
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between w-full text-[#667085]">
              <p>New balance:</p>
              <p className="text-[#EB77DC] text-end">
                {isNotEnoughTGIL
                  ? currentTGIL
                  : currentTGIL
                  ? currentTGIL - price
                  : 0}{" "}
                tGIL
              </p>
            </div>
          </div>
          <div className="space-x-4">
            <button className="border rounded-full text-[#344054] h-10 w-40" onClick={close}>
              Cancel
            </button>
            <button
              disabled={isNotEnoughTGIL}
              onClick={() => {
                if (!isNotEnoughTGIL) {
                  handleBuy(type);
                }
                close && close();
              }}
              className="rounded-full bg-[#EB77DC] disabled:bg-[#EB77DC]/40 text-white h-10 w-[136px]"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmBuyTicketModal;
