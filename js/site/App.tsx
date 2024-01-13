import ProjectProvider from "@/react/ProjectProvider";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallbackError} from "@/react/FallbackError";
import {transport} from "@/service";
import {Join} from "@/auth/JoinGroupPage";
import React from "react";
import {Home} from "@/home/Home";
import {ChatPage} from "@/chat/ChatPage";
import {VerifyPage} from "@/auth/VerifyPage";

const AppRoutes = () => {
    const commonRoutes = [{
        path: '/app',
        element: <Home />
    }, {
        path: '/app/group/:groupID',
        element: <Home />
    }, {
        path: '/app/group/join/:secret',
        element: <Join />
    }, {
        path: '/app/chat',
        element: <ChatPage />
    }, {
        path: '/app/verify/:secret',
        element: <VerifyPage />
    }, {
        path: '/app/content/:id',
        element: <Home />
    }];

    const element = useRoutes([...commonRoutes]);

    return <>
        {element}
    </>;
};

export default function App() {
  return (
      <ErrorBoundary
          FallbackComponent={FallbackError}
      >
          <ProjectProvider>
              <BrowserRouter>
                  <AppRoutes/>
              </BrowserRouter>
              <Toaster/>
          </ProjectProvider>
      </ErrorBoundary>
  )
}
