export const useCurrentLocation = (timeout = 5000) => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = position.coords;
                    resolve({
                        longitude: coords.longitude,
                        latitude: coords.latitude,
                        rotation: coords.heading,
                    });
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: timeout,
                    maximumAge: 0,
                }
            );
        } else {
            reject(new Error("浏览器不支持定位"));
        }
    });
}

export const useLocationing = (fn, timeout = 5000) => {
    if (!fn) {
        throw new Error("fn is required");
    }
    if (!navigator.geolocation) {
        throw new Error("浏览器不支持定位");
    }
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            const coords = position.coords;
            fn({
                longitude: coords.longitude,
                latitude: coords.latitude,
                rotation: coords.heading,
            });
        },
        undefined,
        {
            enableHighAccuracy: true,
            timeout: timeout,
            maximumAge: 0,
        }
    );
    return watchId;
}