import _ from 'the-lodash';
import { Node } from 'kubernetes-types/core/v1';

import { LogicParser } from './';
import { InfraNodesRuntime } from '../types/parser/infra-nodes'
import { InfraPoolRuntime } from '../types/parser/infra-pool';

export function InfraNodeParser() {

    return LogicParser<Node>()
        .target({
            path: ["infra", "nodes", "pool", "node"]
        });
}

export function InfraNodePoolParser() {

    return LogicParser<{}, InfraPoolRuntime>()
        .target({
            path: ["infra", "nodes", "pool"]
        });
}

export function InfraNodesParser() {

    return LogicParser<{}, InfraNodesRuntime>()
        .target({
            path: ["infra", "nodes"]
        });
}