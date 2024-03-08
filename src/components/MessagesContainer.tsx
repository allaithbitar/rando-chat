import { TMessage } from "@/type/message";
import Message from "./Message";

const MessagesContainer = ({ messages }: { messages: TMessage[] }) => (
  <div className="overflow-y-auto p-2">
    {messages.map((m) => (
      <Message message={m} key={m.date} />
    ))}
  </div>
);

export default MessagesContainer;
