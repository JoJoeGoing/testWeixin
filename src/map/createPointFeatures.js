import checkPos from './checkPos';
import Feature from 'ol/Feature.js';
import { Point } from 'ol/geom';

export const createPointFeatures = (data = [], longitude = 'longitude', latitude = 'latitude', id = 'uuid') => {
	const features = [];
	for (let index = 0; index < data.length; index++) {
		const props = data[index];
		if (!props[longitude] || !props[latitude]) {
			continue;
		}
		const longitude_n = Number(props[longitude]);
		const latitude_n = Number(props[latitude]);
		if (isNaN(longitude_n) || isNaN(latitude_n)) {
			continue;
		}
		const pos = [longitude_n, latitude_n];
		if (!checkPos(pos)) {
			continue;
		}
		const feature = new Feature({
			geometry: new Point(pos),
			props: props,
		});
		feature.setId(props[id]);
		features.push(feature);
	}
	return features;
};
export const createPointFeature = (props = {}, longitude = 'longitude', latitude = 'latitude', id = 'uuid') => {
	if (!props[longitude] || !props[latitude]) {
		return null;
	}
	const longitude_n = Number(props[longitude]);
	const latitude_n = Number(props[latitude]);
	if (isNaN(longitude_n) || isNaN(latitude_n)) {
		return null;
	}
	const pos = [longitude_n, latitude_n];
	if (!checkPos(pos)) {
		return null;
	}
	const feature = new Feature({
		geometry: new Point(pos),
		props: props,
	});
	if(props[id]){
		feature.setId(props[id]);
	}
	return feature;
}
