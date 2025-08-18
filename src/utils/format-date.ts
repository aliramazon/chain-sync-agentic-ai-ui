export const formatDate = (
    dateString: string,
    includeTime: boolean = false
) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
    }

    return new Date(dateString).toLocaleDateString("en-US", options);
};
