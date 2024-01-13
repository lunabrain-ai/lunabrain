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
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <ContentEditor />
            </div>
        </div>
    );
}

