import {
  FluentProvider,
  webDarkTheme
} from "@fluentui/react-components";
import {HotkeysProvider} from "react-hotkeys-hook/src/HotkeysProvider";
import ProjectProvider from "@/providers/ProjectProvider";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, useRoutes} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallbackError} from "@/components/FallbackError";
import "react-chat-elements/dist/main.css"
import { initializeIcons } from '@fluentui/react/lib/Icons';
import Home from "@/pages";

initializeIcons();

const AppRoutes = () => {
    const commonRoutes = [{
        path: '/studio',
        element: <Home />
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
                                      <ProjectProvider>
                                          <AppRoutes/>
                                      </ProjectProvider>
                              </BrowserRouter>
                              <Toaster/>
                      </ProjectProvider>
                  </HotkeysProvider>
              </ErrorBoundary>
          </FluentProvider>
  )
}
