import {projectService} from "@/lib/api";
import {createContext, useCallback, useContext, useEffect, useState} from "react";

type ProjectContextType = {
    loadRunningWorkflows: () => Promise<void>;
};

type ProjectProviderProps = {
    children: React.ReactNode;
};

const ProjectContext = createContext<ProjectContextType>({} as any);

export const useProjectContext = () => useContext(ProjectContext);

// project provider holds things that are closer to the database, like information fetched from the database
export default function ProjectProvider({children}: ProjectProviderProps) {

    const loadRunningWorkflows = useCallback(async () => {
        try {
            const { traces } = await projectService.getRunningWorkflows({});
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                loadRunningWorkflows,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
