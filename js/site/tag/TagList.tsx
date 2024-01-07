import {MagnifyingGlassIcon, TrashIcon} from "@heroicons/react/24/outline";
import * as React from "react";

const Tag: React.FC<{ name: string }> = ({name}) => {
    const dialogName = `dialog-${item.id}-${i}}`;
    return (
        <div key={i}>
            <span className={"badge"}
                  onClick={() => (document.getElementById(dialogName) as HTMLDialogElement).showModal()}>
                {t.name}
            </span>
            <dialog id={dialogName}>
                <button onClick={() => searchTag(t.name)} aria-label={"search-tag"}>
                    <MagnifyingGlassIcon className={"h-6 w-6"}/>
                </button>
                <button onClick={() => removeTag(t.name)} aria-label={"delete-tag"}>
                    <TrashIcon className={"h-6 w-6"}/>
                </button>
            </dialog>
        </div>
    )
}

export const TagList: React.FC<{ tags: string[] }> = ({tags}) => {
    return (
        <div className={"flex flex-wrap"}>
            {tags.map((t, i) => {
                // TODO breadchris break into its own component and useRef
            })}
            )
            }