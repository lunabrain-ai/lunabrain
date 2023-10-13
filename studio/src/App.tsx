import {
  FluentProvider,
  webDarkTheme
} from "@fluentui/react-components";
import {HotkeysProvider} from "react-hotkeys-hook/src/HotkeysProvider";
import ProjectProvider from "@/providers/ProjectProvider";
import toast, {Toaster} from "react-hot-toast";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallbackError} from "@/components/FallbackError";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import {Home} from "@/site";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {queryClient, transport, userService} from "@/service";
import {TransportProvider} from "@connectrpc/connect-query";
import {QueryClientProvider} from "@tanstack/react-query";
import {Join} from "@/site/JoinGroupPage";

initializeIcons();

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
      <FluentProvider theme={webDarkTheme}>
          <ErrorBoundary
              FallbackComponent={FallbackError}
          >
              <HotkeysProvider initiallyActiveScopes={["editor"]}>
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
              </HotkeysProvider>
          </ErrorBoundary>
      </FluentProvider>
  )
}
