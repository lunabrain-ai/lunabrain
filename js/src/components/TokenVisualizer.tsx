import { useState, useMemo } from "react";
const cl100k_base = require("gpt-tokenizer/cjs/encoding/cl100k_base");
const p50k_base = require("gpt-tokenizer/cjs/encoding/p50k_base");
const r50k_base = require("gpt-tokenizer/cjs/encoding/r50k_base");
const p50k_edit = require("gpt-tokenizer/cjs/encoding/p50k_edit");
import type React from "react";

const tokenizers = {
    cl100k_base,
    p50k_base,
    r50k_base,
    p50k_edit
};

const pastelColors = [
    "rgba(107,64,216,.3)",
    "rgba(104,222,122,.4)",
    "rgba(244,172,54,.4)",
    "rgba(239,65,70,.4)",
    "rgba(39,181,234,.4)"
];

const monospace = `"Roboto Mono",sfmono-regular,consolas,liberation mono,menlo,courier,monospace`;

const TextInput = ({
                       value,
                       onChange
                   }: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => (
    <textarea
        value={value}
        onChange={onChange}
        style={{ fontFamily: monospace, width: "100%", height: "200px" }}
    />
);

const TokenizedText = ({ tokens }: { tokens: (string | number)[] }) => (
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: monospace,
            width: "100%",
            height: "200px",
            overflowY: "auto",
            padding: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#f8f8f8",
            lineHeight: "1.5",
            alignContent: "flex-start"
        }}
    >
        {tokens.map((token, index) => (
            <span
                key={index}
                style={{
                    backgroundColor: pastelColors[index % pastelColors.length],
                    padding: "0 0px",
                    borderRadius: "3px",
                    marginRight: "0px",
                    marginBottom: "4px",
                    display: "inline-block",
                    height: "1.5em"
                }}
            >
        {
            <pre>
            {String(token)
                .replaceAll(" ", "\u00A0")
                .replaceAll("\n", "<newline>")}
          </pre>
        }
      </span>
        ))}
    </div>
);

type Encoding = "cl100k_base" | "p50k_base" | "p50k_edit" | "r50k_base";

export const TokenVisualizer = () => {
    const [inputText, setInputText] = useState(
        "Replace this with your text to see how tokenization works."
    );
    const [displayTokens, setDisplayTokens] = useState(false);

    const [selectedEncoding, setSelectedEncoding] = useState<Encoding>(
        "cl100k_base"
    );

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEncoding(event.target.value as Encoding);
    };

    const api = tokenizers[selectedEncoding];
    const encodedTokens = api.encode(inputText);

    const decodedTokens = useMemo(() => {
        const tokens = [];
        for (const token of api.decodeGenerator(encodedTokens)) {
            tokens.push(token);
        }
        return tokens;
    }, [encodedTokens, api]);

    const toggleDisplay = () => {
        setDisplayTokens(!displayTokens);
    };

    const selectEncoding = (
        <div>
            <label htmlFor="encoding-select">Encoding:</label>&nbsp;
            <select
                id="encoding-select"
                value={selectedEncoding}
                onChange={handleChange}
            >
                <option value="cl100k_base">
                    cl100k_base (GPT-3.5-turbo and GPT-4)
                </option>
                <option value="p50k_base">p50k_base</option>
                <option value="p50k_edit">p50k_edit</option>
                <option value="r50k_base">r50k_base</option>
            </select>
        </div>
    );

    return (
        <>
            {selectEncoding}
            <div className="tokenizer">
                <TextInput
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button onClick={() => setInputText("")}>Clear</button>
            </div>

            <TokenizedText tokens={displayTokens ? encodedTokens : decodedTokens} />

            <button onClick={toggleDisplay}>
                {displayTokens ? "Show tokenized text" : "Show Token IDs"}
            </button>

            <div className="statistics">
                <div>Characters: {inputText.length}</div>
                <div>Tokens: {encodedTokens.length}</div>
            </div>
        </>
    );
};
