import _ from 'the-lodash';
import { K8sParser } from '../../parser-builder';
import { ClusterRoleBinding, RoleBinding, Subject } from 'kubernetes-types/rbac/v1';
import { LogicRoleRuntime } from '../../types/parser/logic-role';

export default K8sParser<ClusterRoleBinding | RoleBinding>()
    .target({
        clustered: true,
        api: "rbac.authorization.k8s.io",
        kind: "ClusterRoleBinding"
    })
    .target({
        api: "rbac.authorization.k8s.io",
        kind: "RoleBinding"
    })
    .handler(({ logger, scope, config, item, metadata, namespace, helpers }) => {

        if (config.roleRef)
        {
            const roleDn = helpers.k8s.makeDn(namespace || null, config.apiVersion!, config.roleRef.kind, config.roleRef.name);
            const role = item.link('role', roleDn);
        }

        for(let subjectRef of (config.subjects || []))
        {
            processSubject(subjectRef);
        }
        
        /*** HELPERS ***/
        function processSubject(subjectRef: Subject)
        {
            if (subjectRef.kind == 'ServiceAccount')
            {
                const targetNamespace = subjectRef.namespace || namespace || null;
                const subjectDn = helpers.k8s.makeDn(targetNamespace, 'v1', subjectRef.kind, subjectRef.name);

                const linkNamingParts = [subjectRef.kind];
                if (targetNamespace) {
                    linkNamingParts.push(targetNamespace);
                }
                linkNamingParts.push(subjectRef.name);
                const linkNaming = linkNamingParts.join('_');

                item.link('subject', subjectDn, linkNaming);
            }
        }

    })
    ;
