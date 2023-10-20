import * as React from "react";
import {
    Button,
    Combobox,
    makeStyles,
    Option,
    shorthands,
    useId,
} from "@fluentui/react-components";
import {AddSquare24Regular} from "@fluentui/react-icons";
import type { ComboboxProps } from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";
import { Tag } from "@/rpc/content/content_pb";
import {Stack} from "@fluentui/react";
import { useDebounce } from "@uidotdev/usehooks";


const useStyles = makeStyles({
    root: {
        // Stack the label above the field with a gap
        display: "grid",
        gridTemplateRows: "repeat(1fr)",
        justifyItems: "start",
        ...shorthands.gap("2px"),
        maxWidth: "400px",
    },
});

// TODO breadchris move this code to go and return down flattened tags
function flattenTag(tag: Tag): string[] {
    let names: string[] = [tag.name];

    for (let subTag of tag.subTags) {
        names = names.concat(`${tag.name}/${flattenTag(subTag)}`);
    }

    return names;
}

function normalizeTags(tags: Tag[]): string[] {
    let names: string[] = [];
    for (let tag of tags) {
        names = names.concat(flattenTag(tag));
    }
    return names;
}

export const FilteredTagInput: React.FC<{
    selectedTag: string,
    setSelectedTag: (tag: string) => void,
    onAddTag: (tag: string) => void,
}> = ({
    selectedTag,
    setSelectedTag,
    onAddTag,
}) => {
    const {tags, addFilteredTag} = useProjectContext();
    const normalizedTags = normalizeTags(tags);

    const filterOptions = (tag: string) => {
        return normalizedTags.filter(
            (option) => option.toLowerCase().indexOf(tag.toLowerCase()) === 0
        );
    }

    const [matchingOptions, setMatchingOptions] = React.useState(filterOptions(selectedTag));

    const onChange = (tag: string) => {
        setMatchingOptions(filterOptions(tag));
        setSelectedTag(tag);
    }
    return (
        <Stack horizontal>
            <TagInput value={selectedTag} onChange={onChange} matchingOptions={matchingOptions} />
            <Button onClick={() => onAddTag(selectedTag)} icon={<AddSquare24Regular />} aria-label={"add-tag"} />
        </Stack>
    )
}

export const TagInput: React.FC<{
    onChange: (tag: string) => void,
    value: string,
    matchingOptions: string[],
}> = ({
    onChange,
    value,
    matchingOptions,
}) => {
    const styles = useStyles();
    const debouncedOptions = useDebounce(matchingOptions, 300);

    const onBoxChange: ComboboxProps["onChange"] = (event) => {
        const value = event.target.value.trim();
        onChange(value);
    };

    return (
        <div className={styles.root}>
            <Combobox
                value={value}
                placeholder="search by tag..."
                onChange={onBoxChange}
                onOptionSelect={(e, option) => {
                    option.optionValue && onChange(option.optionValue)
                }}>

                {debouncedOptions.map((option) => (
                    <Option key={option} value={option}>{option}</Option>
                ))}
                {debouncedOptions.length === 0 ? (
                    <Option key="no-results" text="">
                        No results found
                    </Option>
                ) : null}
            </Combobox>
        </div>
    );
};