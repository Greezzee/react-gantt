import extensions from "./ext/extensions_gpl";
import * as base from "./factory/make_instance_web";
import * as scope from "./utils/global";
const gantt = (scope as any).gantt = base(extensions);

export default gantt;
export { gantt };