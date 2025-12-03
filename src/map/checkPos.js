/**
 * 判断经纬度是否在中国境内
 */
export default function checkPos(pos = []) {
    const lng = Number(pos[0]);
    const lat = Number(pos[1]);
    if (isNaN(lng) || isNaN(lat)) {
        return false;
    }
    if (lng < 73.66 || lng > 135.05) {
        return false;
    } else if (lat < 3.86 || lat > 53.55) {
        return false;
    } else {
        return true;
    }
}