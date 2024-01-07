import ProjectProvider from "@/react/ProjectProvider";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallbackError} from "@/react/FallbackError";
import {queryClient, transport} from "@/service";
import {TransportProvider} from "@connectrpc/connect-query";
import {QueryClientProvider} from "@tanstack/react-query";
import {Join} from "@/auth/JoinGroupPage";
import React from "react";
import {Home} from "@/home/Home";

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
                  <TransportProvider transport={transport}>
                      <QueryClientProvider client={queryClient}>
                          <AppRoutes/>
                      </QueryClientProvider>
                  </TransportProvider>
              </BrowserRouter>
              <Toaster/>
          </ProjectProvider>
      </ErrorBoundary>
  )
}
