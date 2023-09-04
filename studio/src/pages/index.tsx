import { useProjectContext } from "@/providers/ProjectProvider";

import "reactflow/dist/style.css";
import {ChatPage} from "@/components/Chat/Chat";

export default function Home() {
  return (
    <main>
      <ChatPage />
    </main>
  );
}
