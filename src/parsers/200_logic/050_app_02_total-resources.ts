import { Deployment } from 'kubernetes-types/apps/v1';
import _ from 'the-lodash';
import { PropertyValueWithUnit } from '../../helpers/resources';
import { LogicAppParser } from '../../parser-builder/logic'
import { InfraNodesRuntime } from '../../types/parser/infra-nodes';

export default LogicAppParser()
    .handler(({ logger, scope, item, config, runtime, helpers}) => {

        let multiplier = 0;
        if (runtime.launcherKind == 'Deployment' || 
        runtime.launcherKind == 'StatefulSet')
        {
            multiplier = runtime.launcherReplicas;
        }
        else if (runtime.launcherKind == 'DaemonSet')
        {
            const nodes = scope.findItem('root/infra/nodes')!;
            multiplier = (<InfraNodesRuntime>nodes.runtime).nodeCount;
        }
        
        runtime.usedResources = {};

        for(let metric of helpers.resources.METRICS)
        {
            const perPod = runtime.perPodResources[helpers.resources.makeMetricProp(metric, 'request')];
            runtime.usedResources[helpers.resources.makeMetricProp(metric, 'request')] = { 
                value: perPod.value * multiplier,
                unit: perPod.unit
            };
        }

        item.addProperties({
            kind: "key-value",
            id: "resources",
            title: "Resources",
            order: 7,
            config: runtime.usedResources
        });

    })
    ;
