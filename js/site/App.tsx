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
import {Admin} from "@/admin/Admin";
import {SourcePage} from "@/source/SourcePage";
import {AuthForm} from "@/auth/AuthForm";

const AppRoutes = () => {
    const commonRoutes = [{
        path: '/app',
        element: (
            <div className="h-screen flex flex-col gap-4 w-full">
                <div className="mt-4">
                    <div className="items-center px-5 py-12 lg:px-20">
                        <div className="flex flex-col w-full max-w-md p-10 mx-auto space-y-4">
                            <p>oh, hello.</p>
                            <a href={"/app/content"} className={"btn"}>let's go write something.</a>
                            {/*<a href={"/app/chat"} className={"btn"}>chat</a>*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }, {
        path: '/app/content',
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
