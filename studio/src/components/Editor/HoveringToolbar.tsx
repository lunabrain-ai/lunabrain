import React, {useMemo, useRef, useEffect, useCallback} from 'react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import {
    Editor,
    Range,
} from 'slate'
import { css } from '@emotion/css'
import {Button, Icon, Menu, Portal} from './Components'
import { CustomEditor } from './custom-types'
import {projectService} from "@/service";
import {useProjectContext} from "@/providers/ProjectProvider";
import toast from "react-hot-toast";

export const HoveringToolbar = () => {
    const ref = useRef<HTMLDivElement | null>()
    const editor = useSlate()
    const inFocus = useFocused()

    useEffect(() => {
        const el = ref.current
        const {selection} = editor

        if (!el) {
            return
        }

        if (
            !selection ||
            !inFocus ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style')
            return
        }

        const domSelection = window.getSelection()
        if (!domSelection) {
            return
        }
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        el.style.opacity = '1'
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
        el.style.left = `${rect.left +
        window.pageXOffset -
        el.offsetWidth / 2 +
        rect.width / 2}px`
    })

    return (
        <Portal>
            {/* @ts-ignore */}
            <Menu ref={ref}
                className={css`
                  padding: 8px 7px 6px;
                  position: absolute;
                  z-index: 1;
                  top: -10000px;
                  left: -10000px;
                  margin-top: -6px;
                  opacity: 0;
                  background-color: #222;
                  border-radius: 4px;
                  transition: opacity 0.75s;
                `}
                onMouseDown={(e: { preventDefault: () => void }) => {
                    // prevent toolbar from taking focus away from editor
                    e.preventDefault()
                }}
            >
                <FormatButton format="summarize" icon="summarize"/>
                <FormatButton format="questions" icon="questions"/>
            </Menu>
        </Portal>
    )
}

export const toggleMark = (editor: CustomEditor, format: string) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isMarkActive = (editor: CustomEditor, format: string) => {
    const marks = Editor.marks(editor)
    //@ts-ignore
    return marks ? marks[format] === true : false
}

const FormatButton: React.FC<{format: any, icon: string}> = ({ format, icon }) => {
    const editor = useSlate()
    const getSelection = async () => {
        const { selection } = editor;
        if (selection) {
            const text = Editor.string(editor, selection);
            try {
                const res = await projectService.analyzeConversation( {
                    text,
                })
                // Editor.insertText(editor, res.summary);
            } catch (e: any) {
                toast.error(e.message);
                console.log(e);
            }
        }
    };
    return (
        <Button
            reversed
            onClick={() => getSelection()}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}