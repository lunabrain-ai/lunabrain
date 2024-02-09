import React, {useEffect, useState} from 'react';
import {contentService} from "@/service";
import {Article, ReadMe} from "@/rpc/content/content_pb";
import {Modal} from "@/components/modal";
import ReactMarkdown from "react-markdown";

export const URLEditor: React.FC<{
    id: string;
    url: string;
    onChange: (url: string) => void;
}> = ({ id, url, onChange }) => {
    const [articles, setArticles] = useState<{id: string, article: Article}[]>([]);
    const [readmes, setReadmes] = useState<{id: string, readme: ReadMe}[]>([]);
    const [openedArticle, setOpenedArticle] = useState<string | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!id) {
                return;
            }
            console.log(id)
            const res = await contentService.search({
                contentID: id,
            });
            res.storedContent.forEach((c) => {
                c.related.forEach((r) => {
                    switch (r.type.case) {
                        case 'normalized':
                            const n = r.type.value;
                            switch (n.type.case) {
                                case 'article':
                                    setArticles([...articles, {id: r.id, article: n.type.value}]);
                                    break;
                                case 'readme':
                                    setReadmes([...readmes, {id: r.id, readme: n.type.value}]);
                                    break;
                            }
                    }
                });
            });
        })();
    }, []);
    return (
        <div className="form-group ">
            <label htmlFor="url">URL</label>
            <input type="text" className={"input w-full"} id="url" placeholder="URL" value={url} onChange={(e) => onChange(e.target.value)} />
            {articles.map((a) => (
                <div key={a.id} className="card">
                    <div className="card-body">
                        <h2 className="card-title">{a.article.title}</h2>
                        <p className="max-h-72 truncate text-gray-500 font-normal">{a.article.text}</p>
                        <button className={"btn"} onClick={() => setOpenedArticle(a.id)}>read</button>
                        <Modal open={openedArticle === a.id} onClose={() => setOpenedArticle(undefined)}>
                            <h1>{a.article.title}</h1>
                            <p>{a.article.text}</p>
                            <div className="flex justify-end">
                                <button className={"btn"} onClick={() => setOpenedArticle(undefined)}>close</button>
                            </div>
                        </Modal>
                    </div>
                </div>
            ))}
            {readmes.map((a) => (
                <div key={a.id} className="card">
                    <div className="card-body">
                        <p className="max-h-72 truncate text-gray-500 font-normal">{a.readme.data}</p>
                        <button className={"btn"} onClick={() => setOpenedArticle(a.id)}>read</button>
                        <Modal open={openedArticle === a.id} onClose={() => setOpenedArticle(undefined)}>
                            <ReactMarkdown className={"markdown"}>
                                {a.readme.data}
                            </ReactMarkdown>
                            <div className="flex justify-end">
                                <button className={"btn"} onClick={() => setOpenedArticle(undefined)}>close</button>
                            </div>
                        </Modal>
                    </div>
                </div>
            ))}
        </div>
    );
}