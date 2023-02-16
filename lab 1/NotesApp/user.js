const fs = require("fs")
function getLang(){
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    let user = JSON.parse(userJSON);
    return user.languages;
}
function getUser(){
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    return JSON.parse ( userJSON );
}

function add(language) {
    //Прочитати файл user.json
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    //Перетворити дані з файлу в JS-обєкт
    let user = JSON.parse(userJSON);

    //Отримати масив мов і додати новий елемент
    user.languages.push(language)

    //Перетворити JS-обєкт в JSON
    //Записати новий JSON у файл user.json
    fs.writeFileSync("user.json", JSON.stringify(user))
    console.log("Мову успішно додано")
}

function remove(title) {
    let langs=getLang();
    let user=getUser();

    if(langs.filter(lang=>lang.title===title).length===0){
        console.log('Мови з такою назвою немає у списку')
        return;
    }

    user.languages=langs.filter(lang=>lang.title!==title)
    fs.writeFileSync("user.json", JSON.stringify(user))
    console.log('Мову успішно видалено!')
}

function list() {
    let userJSON =  fs.readFileSync("user.json", "utf-8")
    let user = JSON.parse(userJSON);
    console.log(user.languages)
}
function read(title) {
    let langs=getLang();
    if(langs.filter(lang=>lang.title===title).length===0){
        console.log('Такої мови немає в списку')
    }
    else {
        console.log(langs)

    }
}

module.exports = {add, remove, list, read}