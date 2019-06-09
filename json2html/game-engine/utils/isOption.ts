import { fromNullable, Option, tryCatch } from 'fp-ts/lib/Option';

const isOption = (obj: any): obj is Option<any> =>
    tryCatch(() => fromNullable(obj._tag)).exists(_ =>
        _.exists(tag => tag === 'Some' || tag === 'None')
    );
export default isOption;
