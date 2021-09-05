export const formatDate = (time) => {
    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, 'segundos', 1], // 60
        [120, 'hace 1 minuto', '1 minute from now'], // 60*2
        [3600, 'minutos', 60], // 60*60, 60
        [7200, 'hace 1 hora', '1 hour from now'], // 60*60*2
        [86400, 'horas', 3600], // 60*60*24, 60*60
        [172800, 'Ayer', 'Tomorrow'], // 60*60*24*2
        [604800, 'dias', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Semana pasada', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'semanas', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'meses', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = 'hace',
        list_choice = 1;

    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return token + ' ' + Math.floor(seconds / format[2]) + ' ' + format[1];
        }
    return time;
}

// Update state
export const stateHomePost = (_state, _id, _newValue) => {
    const store = _state.homePosts;
    const i = store.findIndex(p => p._id === _id);
    if (i === -1) throw new Error('Index not found');
    store[i] = Object.assign({}, store[i], _newValue);
    return store;
}