import { Inbox } from "lucide-react";

export default function EmptyTab({ message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
      <Inbox className="mb-3 size-8 text-neutral-300" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}
