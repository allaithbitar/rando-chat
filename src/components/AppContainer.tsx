import { ReactNode } from "react";

const AppContainer = ({ children }: { children: ReactNode }) => (
  <div className="p-2 flex flex-col gap-2 h-screen justify-end relative">
    {children}
  </div>
);

export default AppContainer;
