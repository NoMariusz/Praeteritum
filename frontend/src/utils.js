const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
};

export const getCSRF = () => {
    return getCookie('csrftoken');
};

export const formatIfTooLong = (toFormat, maxLen) => {
    // formatting too long strings in format looking like tooLongSt...
    if (toFormat.length > maxLen){
        return toFormat.slice(0, maxLen-3) + "..."
    }
    return toFormat
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
