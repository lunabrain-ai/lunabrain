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
import "react-chat-elements/dist/main.css"
import { initializeIcons } from '@fluentui/react/lib/Icons';
import {Home} from "@/site";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {userService} from "@/service";

initializeIcons();

const Join = () => {
    const [success, setSuccess] = useState<boolean>(false);
    const { secret } = useParams();
    useEffect(() => {
        if (secret) {
            try {
                const res = userService.joinGroup({secret});
                toast.success('Joined group');
                setSuccess(true)
            } catch (e: any) {
                console.error(e)
                toast.error('Failed to join group');
            }
        }
    }, []);
    if (success) {
        return <Home />
    }
    return (
        <>
            <h1>Joining Group</h1>
        </>
    );
}

const AppRoutes = () => {
    const commonRoutes = [{
        path: '',
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
