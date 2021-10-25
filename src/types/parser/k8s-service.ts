import { ServicePort } from 'kubernetes-types/core/v1';
import { LogicItem } from '../../logic/item';

export interface K8sServiceRuntime
{
    portsDict : { [portProtocol : string] : K8sServicePort }
    portsByName : { [name : string] : K8sServicePort }
}

export interface K8sServicePort
{
    id: string,
    port: number,
    protocol: string,
    config: ServicePort,

    logicPorts: { [dn: string] : boolean }
}

export function makePortId(port: number, protocol? : string) : string
{
    protocol = (protocol ?? 'TCP').toUpperCase();
    return `${port}-${protocol}`;
}