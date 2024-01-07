import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {projectService, userService} from "@/service";
import toast, {Toaster} from "react-hot-toast";

const Options = () => {
    const [whitelist, setWhitelist] = useState<string[]>([]);
    const [currentDomain, setCurrentDomain] = useState('');
    const [availableDomains, setAvailableDomains] = useState<string[]>([]);

    useEffect(() => {
        (
            async () => {
                const res = await userService.login({});
                if (res.config) {
                    setWhitelist(res.config.domainWhitelist || []);
                }
            }
        )()
        if (!chrome) {
            return;
        }
        // Fetch all tabs and set their domains in state
        chrome.tabs.query({}, (tabs) => {
            const domainSet = new Set<string>();
            tabs.forEach(tab => {
                const url = new URL(tab.url || '');
                domainSet.add(url.hostname);
            });
            setAvailableDomains([...domainSet]);
        });
    }, [setWhitelist]);

    const addDomain = () => {
        if (currentDomain && !whitelist.includes(currentDomain)) {
            setWhitelist([...whitelist, currentDomain]);
            setCurrentDomain('');
        }
    };

    const removeDomain = (domain: string) => {
        setWhitelist(prevWhitelist => prevWhitelist.filter(d => d !== domain));
    };

    const saveWhitelist = async () => {
        try {
            await userService.updateConfig({
                domainWhitelist: whitelist,
            })
            toast.success('Whitelist saved');
        } catch (e: any) {
            console.error(e);
            toast.error(e.message);
        }
    }

    return (
        <div>
            <h3>Whitelisted Domains</h3>
            {/*<Dropdown*/}
            {/*    placeholder="Select domains from opened tabs"*/}
            {/*    options={availableDomains.map(domain => ({ key: domain, text: domain }))}*/}
            {/*    onChange={(e, option) => setCurrentDomain(option?.text || '')}*/}
            {/*/>*/}
            <input type={"text"}
                placeholder="Enter domain hostname"
                value={currentDomain}
                // onChange={(e, newValue) => setCurrentDomain(newValue || '')}
            />
            <button className={"btn"} onClick={addDomain}>Add to Whitelist</button>
            <ul>
                {whitelist.map((domain) => (
                    <li key={domain}>
                        {domain}
                        <button className={"btn"}
                            onClick={() => removeDomain(domain)}
                        >Delete</button>
                    </li>
                ))}
            </ul>
            <button className={"btn"} onClick={saveWhitelist}>Save Whitelist</button>
        </div>
    );
};


const rootElem = document.createElement("div");
document.body.appendChild(rootElem);

const root = ReactDOM.createRoot(rootElem as HTMLElement);
root.render(
    <React.StrictMode>
        <Options />
        <Toaster />
    </React.StrictMode>
);
