import { TMessage } from "@/type/message";
import { memo } from "react";

const Message = ({ message }: { message: TMessage }) => (
  <div
    className={`w-fit flex items-start gap-2.5 mb-5 ${message.isMe && "ml-auto"}`}
  >
    <div className="flex flex-col gap-1 w-full max-w-[320px]">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {/*   <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Bonnie Green
        </span> */}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {message.date}
        </span>
      </div>
      <div
        className={`flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-lg dark:bg-gray-700 ${message.isMe && "dark:bg-slate-500 text-xl "}`}
      >
        <p className={`text-sm font-normal text-gray-900 dark:text-white`}>
          {message.data}
        </p>
      </div>
      {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Delivered
      </span> */}
    </div>
  </div>
);

export default memo(Message);
