
function saveData(key, data){
    dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
}

function getData(key){
    const data = localStorage.getItem(key);
    if (!data){
        return null;
    }
    return JSON.parse(data);
}

function deleteData(key){
    localStorage.removeItem(key);
}
