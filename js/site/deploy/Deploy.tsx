import React, {useEffect} from "react";
import {kubes} from "@/service";
import {Deployment} from "@/rpc/kubes/kubes_pb";
import {toast} from "react-toastify";

export const Deploy: React.FC = () => {
    const [deployments, setDeployments] = React.useState<Deployment[]>([]);
    const [name, setName] = React.useState<string>('');
    const [domain, setDomain] = React.useState<string>('');
    useEffect(() => {
        (async () => {
            const res = await kubes.listDeployments({});
            setDeployments(res.deployments);
        })();
    }, []);
    const newDeployment = async () => {
        try {
            const res = await kubes.newDeployment({
                name,
                domainName: domain,
            });
        } catch (e: any) {
            console.error(e);
            toast.error(e.message);
        }
    }
    const deleteDeployment = async (deploymentName: string) => {
        try {
            const res = await kubes.deleteDeployment({
                name: deploymentName,
                domainName: domain,
            });
        } catch (e: any) {
            console.error(e);
            toast.error(e.message);
        }
    }
    return (
        <div className="mx-[3vw] lg:mx-[6vw] mt-8">
            <h3>New</h3>
            <input className="input input-bordered" aria-label={"name"} placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input className="input input-bordered" aria-label={"domain-name"} placeholder="Domain" onChange={(e) => setDomain(e.target.value)} />
            <button className="btn" aria-label={"create"} onClick={newDeployment}>Create</button>
            <hr />
            <ul>
                {deployments.map((d) => {
                    return (
                        <li key={d.id}>{d.name} <button className="btn" onClick={() => deleteDeployment(d.name)}>Delete</button></li>
                    )
                })}
            </ul>
        </div>
    )
}
