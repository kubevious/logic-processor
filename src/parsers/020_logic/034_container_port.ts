import _ from 'the-lodash';
import { LogicParser } from '../../parser-builder';

export default LogicParser()
    .only()
    .target({
        path: ["logic", "ns", "app", "launcher", "cont"]
    })
    .target({
        path: ["logic", "ns", "app", "launcher", "initcont"]
    })
    .handler(({ logger, item, helpers}) => {

        const config = helpers.k8s.container(item);

        if (!config.ports) {
            return;
        }

        for(let portConfig of config.ports) {
            let portName = portConfig.protocol + "-" + portConfig.containerPort;
            if (portConfig.name) {
                portName = portConfig.name + " (" + portName + ")";
            }

            let portItem = item.fetchByNaming("port", portName);
            portItem.setConfig(portConfig);

            // let portConfigScope = {
            //     name: portConfig.name,
            //     containerName: containerConfig.name,
            //     portItem: portItem,
            //     containerItem: container
            // };

            // appScope.ports[portConfig.name] = portConfigScope;
            // appScope.ports[portConfig.containerPort] = portConfigScope;
        }

    })
    ;
