export const calculateDistanceToRestaurant = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const isRestaurantOpen = (
    workingDays: string[],
    workingHoursStart?: string,
    workingHoursEnd?: string
): boolean => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', {weekday: 'long'});
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (!workingDays.includes(currentDay)) return false;

    if (workingHoursStart && workingHoursEnd) {
        const [startHour, startMinute] = workingHoursStart.split(':').map(Number);
        const [endHour, endMinute] = workingHoursEnd.split(':').map(Number);

        const currentTime = currentHour * 60 + currentMinute;
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        return currentTime >= startTime && currentTime <= endTime;
    }

    return true;
};


