import { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import { Job } from 'kubernetes-types/batch/v1';
import _ from 'the-lodash';
import { K8sConfig } from '../..';
import { K8sParser } from '../../parser-builder';

export default K8sParser<Deployment | DaemonSet | StatefulSet | Job>()
    .only()
    .target({
        api: "apps",
        kind: "Deployment"
    })
    .target({
        api: "apps",
        kind: "DaemonSet"
    })
    .target({
        api: "apps",
        kind: "StatefulSet"
    })
    .target({
        api: "batch",
        kind: "Job"
    })
    .handler(({ logger, scope, config, item, metadata, namespace, helpers }) => {

        helpers.k8s.labelMatcher.register(<K8sConfig>config, item);

        const root = scope.logicRootNode.fetchByNaming('logic', '');

        const ns = root.fetchByNaming('ns', metadata.namespace!);

        const app = ns.fetchByNaming('app', metadata.name);
        item.link('app', app);

        const launcher = app.fetchByNaming('launcher', config.kind);
        launcher.makeShadowOf(item);
        // launcher.setConfig(config);
        item.link('logic', launcher);

        let labelsMap = getPodLabels();
        if (labelsMap) {
            helpers.k8s.labelMatcher.registerManual('LogicApp', namespace, labelsMap, app)
        }

        /*** HELPERS ***/
        function getPodLabels()
        {
            if (config.spec) {
                if (config.spec!.template.metadata) {
                    if (config.spec!.template.metadata!.labels) {
                        return config.spec!.template.metadata!.labels;
                    }
                }
            }
            return {};
        }
    })
    ;
