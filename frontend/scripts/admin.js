const drawContact =(
    contact
    )=>{
        let templateContact =`
        <div class="contact-card">
            <div class="content">
                <p id="contactId-${contact.id}">${contact['lastname']} ${contact['firstname']} ${contact['fathername']}</p>
            </div>
        </div>
        `
        document.getElementById('contacts-container').innerHTML += templateContact
}
const drawUser =(
    user
)=>{
        const templateUser=`
        <div class="user-card" onclick="getContacts(${user['id']})">
            <div class="nickname">
                <p id="username-${user['id']}">${user['username']}</p>
            </div>
        </div>
        `
        document.getElementById('users-container').innerHTML += templateUser
}
const drawType = (
    type
)=>{
    const typeTemplate =`
    <div class="type-card">
        <div class="input-type" id="type-card-${type.type}">
            <input type="text" value="${type.type}">
            <div onclick="deleteType('${type.type}')">
                <i class='bx bx-x'></i>
            </div>
        </div>
    </div>
    `
    document.getElementById('types-container').innerHTML += typeTemplate
}

const getTypes = async()=>{
    try{

        const response = await fetch('http://merchator.ru/api/types', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
        })
        const data = await response.json();
        document.getElementById('types-container').innerHTML =`
        <div class="new-type-card">
            <div class="input-type">
                <input type="text" placeholder="Новый тип..." id="new-type-input">
                <div onclick="createType()">
                    <i class='bx bx-plus' ></i>
                </div>
            </div>
        </div>`
        if (data.length == 0) {
            document.getElementById('types-container').innerHTML += `
                    <p>Типоу нет</p>
            `
        }
        for (let i = 0; i < data.length; i++) {
            drawType(data[i]);  
        }
    

    }catch(e){
        console.log(e)
    }
}

const createType = async()=>{
    try{
        console.log(document.getElementById('new-type-input').value)
        await fetch('http://merchator.ru/api/types', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify({type: document.getElementById('new-type-input').value})
        })
        await getTypes()
    }catch(e){
        console.log(e)
    }
}

const deleteType = async(
    type
)=>{
    try{
        
        await fetch('http://merchator.ru/api/types', {
            method: "DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify({type: type})
        })
        await getTypes()
    }catch(e){
        console.log(e)
    }
}

const getUsers = async()=>{
    try{

        const response = await fetch('http://merchator.ru/api/user/getall', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
        })
        const data = await response.json();
        document.getElementById('users-container').innerHTML =''
        if (data.length == 0) {
            document.getElementById('users-container').innerHTML = `
                    <p>Пользователей нет</p>
            `
        }
        for (let i = 0; i < data.length; i++) {
            drawUser(data[i]);  
        }
    

    }catch(e){
        console.log(e)
    }
}

const getContacts = async(
    userId
)=>{
    try{
    
        const response = await fetch(`http://merchator.ru/api/contact/getall?userId=${userId}`, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
        })
        const data = await response.json();
        document.getElementById('contacts-container').innerHTML =''

        if (data.length == 0) {
            document.getElementById('contacts-container').innerHTML = `
                    <p>Контактов нет</p>
            `
        }
        for (let i = 0; i < data.length; i++) {
            drawContact(data[i]);   
        }
    }catch(e){
        console.log(e)
    }
    
}
const onLoad = async()=>{
    await getUsers()
    await getTypes()
}
const logout = ()=>{
    localStorage.removeItem('token')
    document.location.href = './login.html' 
}
