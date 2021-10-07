import _ from 'the-lodash';
import { InfraStorageParser } from '../../parser-builder/infra';
import { InfraStorageClassRuntime } from '../../types/parser/infra-storage-class';

export default InfraStorageParser()
    .handler(({ logger, scope, config, item, runtime, helpers }) => {

        runtime.volumeCount = 0;

        runtime.capacity = {
            value: 0,
            unit: 'bytes'
        };

        for(const storClass of item.getChildrenByKind('storclass'))
        {
            const storClassRuntime = <InfraStorageClassRuntime>storClass.runtime;

            runtime.volumeCount += storClassRuntime.volumeCount;
            runtime.capacity.value += storClassRuntime.capacity.value;
        }

    })
    ;
