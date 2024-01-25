import {Toaster} from "react-hot-toast";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallbackError} from "@/react/FallbackError";
import {Join} from "@/auth/JoinGroupPage";
import React from "react";
import {Home} from "@/home/Home";
import {ChatPage} from "@/chat/ChatPage";
import {VerifyPage} from "@/auth/VerifyPage";
import {Provider} from "jotai";
import {DevTools} from "jotai-devtools";
import {Admin} from "@/admin/Admin";

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
    }, {
        path: '/app/admin',
        element: <Admin />
    }];

    const element = useRoutes([...commonRoutes]);

    return <>
        {element}
    </>;
};

export const App: React.FC<{dev: boolean}> = ({dev}) => {
  return (
      <ErrorBoundary
          FallbackComponent={FallbackError}
      >
          <Provider>
              <BrowserRouter>
                  <AppRoutes/>
              </BrowserRouter>
              <Toaster/>
          </Provider>
      </ErrorBoundary>
  )
}
