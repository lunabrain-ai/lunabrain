import React, {useEffect, useMemo} from 'react';
import {Form} from "@/form/Form";
import {contentService} from "@/service";
import {Content, TypesResponse} from "@/rpc/content/content_pb";
import {walkDescriptor} from "@/form/walk";
import {transformObject} from "@/util/form";

const tabs = ["ui"] as const;
type Tab = typeof tabs[number];

export const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<Tab>(tabs[0]);
    return (
        <>
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">admin</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        {tabs.map((t) => (
                            <li key={t}>
                                <a
                                    className={`btn btn-ghost ${t === activeTab ? 'btn-active' : ''}`}
                                    onClick={() => setActiveTab(t)}
                                >
                                    {t}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <TabDisplay tab={activeTab} />
        </>
    )
}

const TabDisplay: React.FC<{tab: Tab}> = ({tab}) => {
    switch (tab) {
        case "ui":
            return <UI />;
    }
}

const UI: React.FC = () => {
    return (
        <div className="container mx-auto">
            <UIFormTest />
        </div>
    )
}

const UIFormTest: React.FC = () => {
    const [formTypes, setFormTypes] = React.useState<TypesResponse|undefined>(undefined);

    useEffect(() => {
        (async () => {
            const t = await contentService.types({});
            setFormTypes(t);
        })()
    }, [setFormTypes]);

    const fields = useMemo(() => {
        if (!formTypes || !formTypes.content?.msg) {
            return null;
        }
        return walkDescriptor(formTypes.content, formTypes.content.msg, [])
    }, [formTypes]);
    if (!fields) {
        return null;
    }

    return (
        <>
            <Form fields={fields} onSubmit={(data) => {
                console.log(Content.fromJson(data))
            }} />
        </>
    )
}