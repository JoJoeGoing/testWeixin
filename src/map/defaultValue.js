
import defined from "./defined"
export default function defaultValue(target, value) {
    return defined(target) ? target : value
}