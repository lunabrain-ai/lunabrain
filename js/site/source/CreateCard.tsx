import {
    PaperAirplaneIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {useProjectContext} from "@/react/ProjectProvider";
import {textContent, urlContent} from "../../extension/util";
import {Content, GRPCTypeInfo, Post} from "@/rpc/content/content_pb";
import {ContentEditor} from "@/source/ContentEditor";
import {AddTagBadge} from "@/tag/AddTagBadge";
import {useContentEditor, useSources} from "@/source/state";
import {GRPCInputFormProps, ProtobufMessageForm} from "@/form/ProtobufMessageForm";
import {useForm} from "react-hook-form";

export const CreateCard = () => {
    const { getSources } = useSources();
    const { selected } = useContentEditor();

    const handleDelete = async () => {
        if (!selected) {
            return;
        }
        try {
            // TODO breadchris save content to group
            const resp = await contentService.delete({
                contentIds: [selected.id],
            });
            void getSources();
            console.log(resp);
            toast.success('Deleted content');
        } catch (e) {
            toast.error('Failed to delete content');
            console.error('failed to delete', e)
        }
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <ContentEditor />
                {selected && (
                    <div className={"alert"} role={"alert"}>
                        <span>Editing selected content</span>
                        <button className={"btn"} onClick={handleDelete}>
                            <TrashIcon className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

