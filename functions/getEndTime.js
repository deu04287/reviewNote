const getEndTime = (receivedTime, second) => {

    let today = new Date(
        Number(JSON.stringify(receivedTime).slice(1, 5)), //년
        Number(JSON.stringify(receivedTime).slice(5, 7)), //월
        Number(JSON.stringify(receivedTime).slice(7, 9)), //일
        Number(JSON.stringify(receivedTime).slice(9, 11)), //시
        Number(JSON.stringify(receivedTime).slice(11, 13)), //분
        Number(JSON.stringify(receivedTime).slice(13, 15)) + second, //초
        0
    );
    let date = today.getFullYear() + '' +
        ('0' + (today.getMonth())).slice(-2) + '' +
        ('0' + today.getDate()).slice(-2);
    let time = ('0' + today.getHours()).slice(-2) + '' +
        ('0' + (today.getMinutes())).slice(-2) + '' +
        ('0' + today.getSeconds()).slice(-2);


    return (date + time);
}

export default getEndTime