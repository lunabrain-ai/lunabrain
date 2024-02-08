import React, {useEffect, useState} from "react";
import {Section, Site} from "@/rpc/content/content_pb";
import {PlusIcon} from "@heroicons/react/24/outline";
import {SectionEditor} from "@/source/editors/SectionEditor";

export const SiteEditor: React.FC<{site: Site, onUpdate: (s: Site) => void}> = ({site, onUpdate}) => {
    const [sectionIdx, setSectionIdx] = useState<number|undefined>(undefined);
    const deleteSection = () => {
        onUpdate(new Site({
            ...site,
            sections: site.sections.filter((_, i) => i !== sectionIdx),
        }));
    }
    useEffect(() => {
        if (site.sections.length === 0) {
            onUpdate(new Site({
                ...site,
                sections: [new Section({})],
            }));
        }
        if (site.sections.length > 0 && sectionIdx === undefined) {
            setSectionIdx(0);
        }
    }, [site]);
    return (
        <>
            <div className="text-gray-600 px-3 py-2">
                <h4 className="text-lg font-semibold">site: {site.hugoConfig?.title || 'untitled'}</h4>
            </div>
            <button className={"btn"} onClick={() => {
                onUpdate(new Site({
                    ...site,
                    sections: [...site.sections, new Section({})],
                }));
            }}>
                <PlusIcon className="h-6 w-6" />
            </button>
            <div className="tabs tabs-bordered my-6">
                {site.sections.map((section, idx) => (
                    <a
                        className={`tab ${idx === sectionIdx ? 'tab-active' : ''}`}
                        key={idx}
                        onClick={() => setSectionIdx(idx)}
                    >
                        {section.menu?.name || 'untitled'}
                    </a>
                ))}
            </div>
            {sectionIdx !== undefined && (
                <SectionEditor section={site.sections[sectionIdx]} onUpdate={(s: Section) => {
                    onUpdate(new Site({
                        ...site,
                        sections: site.sections.map((section, idx) => {
                            if (idx === sectionIdx) {
                                return s;
                            }
                            return section;
                        })
                    }));
                }} onDelete={deleteSection} />
            )}
        </>
    )
}
