const getTime = () => {
    let today = new Date();

    let date = today.getFullYear() + '' +
        ('0' + (today.getMonth() + 1)).slice(-2) + '' +
        ('0' + today.getDate()).slice(-2);
    let time = ('0' + today.getHours()).slice(-2) + '' +
        ('0' + (today.getMinutes())).slice(-2) + '' +
        ('0' + today.getSeconds()).slice(-2);

    return (date + time);
}

export default getTime