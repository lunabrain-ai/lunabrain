import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import {Component} from "react";
import {ReactRenderer} from "@tiptap/react";
import tippy from "tippy.js";

// https://codesandbox.io/p/sandbox/tiptap-react-slash-command-e3j3u?file=%2Fsrc%2Ftiptap.jsx%3A17%2C1-18%2C30

export const Commands = Extension.create({
    name: 'cmds',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                // @ts-ignore
                command: ({ editor, range, props }) => {
                    console.log('hello1')
                    props.command({ editor, range })
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})

export class CommandsList extends Component {
    state = {
        selectedIndex: 0
    };

    componentDidUpdate(oldProps: { items: any; }) {
        if (this.props.items !== oldProps.items) {
            this.setState({
                selectedIndex: 0
            });
        }
    }

    onKeyDown({ event }) {
        if (event.key === "ArrowUp") {
            this.upHandler();
            return true;
        }

        if (event.key === "ArrowDown") {
            this.downHandler();
            return true;
        }

        if (event.key === "Enter") {
            this.enterHandler();
            return true;
        }

        return false;
    }

    upHandler() {
        this.setState({
            selectedIndex:
                (this.state.selectedIndex + this.props.items.length - 1) %
                this.props.items.length
        });
    }

    downHandler() {
        this.setState({
            selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length
        });
    }

    enterHandler() {
        this.selectItem(this.state.selectedIndex);
    }

    selectItem(index) {
        const item = this.props.items[index];

        if (item) {
            this.props.command(item);
        }
    }

    render() {
        console.log('hello2')
        const { items } = this.props;
        return (
            <div className="items">
                {items.map((item, index) => {
                    return (
                        <button
                            className={`item ${
                                index === this.state.selectedIndex ? "is-selected" : ""
                            }`}
                            key={index}
                            onClick={() => this.selectItem(index)}
                        >
                            {item.element || item.title}
                        </button>
                    );
                })}
            </div>
        );
    }
}

export const getSuggestionItems = (query) => {
    return [
        {
            title: "H1",
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
            }
        },
        {
            title: "H2",
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 2 })
                    .run();
            }
        },
        {
            title: "bold",
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setMark("bold").run();
            }
        },
        {
            title: "italic",
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setMark("italic").run();
            }
        },
        {
            title: "image",
            command: ({ editor, range }) => {
                console.log("call some function from parent");
                editor.chain().focus().deleteRange(range).setNode("paragraph").run();
            }
        }
    ]
        .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 10);
};

export const renderItems = () => {
    let component;
    let popup;

    return {
        onStart: (props) => {
            component = new ReactRenderer(CommandsList, {
                props,
                editor: props.editor
            });

            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start"
            });
        },
        onUpdate(props) {
            component.updateProps(props);

            popup[0].setProps({
                getReferenceClientRect: props.clientRect
            });
        },
        onKeyDown(props) {
            if (props.event.key === "Escape") {
                popup[0].hide();

                return true;
            }

            return component.ref?.onKeyDown(props);
        },
        onExit() {
            popup[0].destroy();
            component.destroy();
        }
    };
};

export const commands = Commands.configure({
    items: getSuggestionItems,
    render: renderItems
})

