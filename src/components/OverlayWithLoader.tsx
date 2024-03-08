import { ReactNode } from "react";
import Loader from "./Loader";

const OverlayWithLoader = ({ message }: { message?: string }) => (
  <div className="p-8 absolute w-[90%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] grid place-items-center z-10 backdrop-blur-sm border border-gray-500 rounded border-current">
    <Loader message={message} />
  </div>
);

export default OverlayWithLoader;
