const modal = document.getElementById("viewContact"); //modal window

const drawContact =(
    contact
    )=>{
        let numbers='<p class="one-num">Номеров пока нет</p>'
        if(contact['numbers'].length != 0){
            numbers =''
            for(let i=0; i < contact['numbers'].length;i++){
                numbers +=`
                <div class="one-num">
                <p>${contact['numbers'][i]['type']}</p>
                <p class="one-num-push">${contact['numbers'][i]['number']}</p>
                </div>
                `
            } 
        }
        
        
        let newcontact = `
        <div class="contact-card" onclick="viewContact(${contact.id})">
            <p>${contact['lastname']} ${contact['firstname']} ${contact['fathername']}</p>
            <div class="contact-numbers" id="numbers-contact-${contact['id']}">
                ${numbers}
            </div>
        </div>`
        document.getElementById('contacts-container').innerHTML += newcontact
}
let countNumberCards = 0
const addNumberCard =async() =>{
    
    if(countNumberCards == 3){
        document.getElementById('add-number').outerHTML = ''
    }

    let saveCards = []
    for (let i = 0; i < countNumberCards; i++) {
        const card = {
            number : document.getElementById(`num-number-${i}`).value,
            type : document.getElementById(`num-type-${i}`).value
        }       
        saveCards.push(card)
    }

    try{
        const response = await fetch('http://merchator.ru/api/types/', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
        })
    
        const phonetypes = await response.json()
        let typesTemplate =''
        for (let i = 0; i < phonetypes.length; i++) {
            typesTemplate += `
            <option value="${phonetypes[i]['type']}">${phonetypes[i]['type']}</option>
            `
        }
        const template = `
        <div class="element">
        <i class='bx bx-chevron-down'></i>
            <select name="types" id="num-type-${countNumberCards}">
            
                ${typesTemplate}
            </select>
            <input type="text" id="num-number-${countNumberCards}" placeholder="Номер телефона" value="" />
        </div>
        `
        document.getElementById('numbers-container').innerHTML += template
        
        //Return save cards 
        for (let i = 0; i < countNumberCards; i++) {       
            const card = saveCards[i]
            document.getElementById(`num-number-${i}`).value = card['number']
            document.getElementById(`num-type-${i}`).value = card['type']
        }
        countNumberCards += 1

    }catch(e){
        console.log(e)
    }
    

}
const logout = ()=>{
    localStorage.removeItem('token')
    document.location.href = './login.html' 
}
const getContacts = async()=>{
    try{
        //del old cards
        document.getElementById('contacts-container').innerHTML = ''

        const response = await fetch('http://merchator.ru/api/contact/getall', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
        })
        const data = await response.json();
        if(data.length == 0){
            document.getElementById('contacts-container').innerHTML += 
            `
            <div class="no-contacts">
                <p>Контакты отсутствуют</p>
            </div>
            `
        }
        for(let i = 0; i < data.length; i += 1){
            drawContact(data[i])
        } 

    }catch(e){
        console.log(e)
    }
    
}
const viewContact=async(
    contactId
)=>{
    try{
        modal.style.display = "block";
        document.getElementById('form-btn-container').innerHTML = `
        <button type="button" class="action-button-form" onclick="updateContact(${contactId})">Обновить</button>
        <button type="button" class="action-button-form-red" onclick="deleteContact(${contactId})">Удалить</button>
        `
        const response = await fetch(`http://merchator.ru/api/contact/getContact?contactId=${contactId}`, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            }
           
        })
        const data = await response.json();
        document.getElementById('firstname').value = data['firstname']
        document.getElementById('lastname').value = data['lastname']
        document.getElementById('fathername').value = data['fathername']
        document.getElementById('description').value = data['description'] 
        const arrNums = data['numbers']
        for (let i = 0; i < arrNums.length; i++) {
            await addNumberCard()
        }
        for (let i = 0; i < arrNums.length; i++) {
            const element = arrNums[i];
            document.getElementById(`num-number-${i}`).value = element['number']
            document.getElementById(`num-type-${i}`).value = element['type']
        }
        

    }catch(e){

    }
}

const btncreateContact = async()=>{
    modal.style.display = "block";
}
const viewError = (
    message
)=>{
    let errContainer = document.getElementById('error-container')
    document.getElementById('error-label').innerHTML = message
    errContainer.classList.add('error-container-show')
    setTimeout(()=>{errContainer.classList.remove('error-container-show')}, 3000)
}
const createContact = async()=>{
    try{
        let data = {
            firstname :  document.getElementById('firstname').value,
            lastname : document.getElementById('lastname').value,
            fathername : document.getElementById('fathername').value,
            description : document.getElementById('description').value
        }
        if(data.firstname == '' && data.lastname == '' && data.fathername == ''){
            viewError('Нужно хотябы одно поле ФИО')
            return
            
        } 
        const responseContact = await fetch('http://merchator.ru/api/contact/createContact', {
            method: "POST",
            
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token'),
            },
            body : JSON.stringify(data)
        })
        
        if (responseContact.status != 200){
            console.log(`response status: ${responseContact.status}`)
        }

        const body = await responseContact.json()
        
        for (let i = 0; i < countNumberCards; i++) {
            let number = {
                contactId: body['contactId'],
                number: document.getElementById(`num-number-${i}`).value,
                type: document.getElementById(`num-type-${i}`).value,
            }
            if(number.number.trim() != ""){
                console.log(number.number)
                const responseNumber = await fetch('http://merchator.ru/api/contact/createNumberToContact', {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization' :"Bearer " + localStorage.getItem('token')
                },
                body : JSON.stringify(number)
            })  
            }
            
        }
        resetForm()
        getContacts()
    }catch(e){
        console.log(e)
    }
}

const updateContact = async(
    contactId
) =>{
    try{
        let data = {
            id: contactId,
            firstname :  document.getElementById('firstname').value,
            lastname : document.getElementById('lastname').value,
            fathername : document.getElementById('fathername').value,
            description : document.getElementById('description').value
        }
        const responseContact = await fetch('http://merchator.ru/api/contact/updateContact', {
            method: "POST",
            
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token'),
            },
            body : JSON.stringify(data)
        })
        
        if (responseContact.status != 200){
            console.log(`response status: ${responseContact.status}`)
        }
        const body = await responseContact.json()
        const responseDelNums = await fetch('http://merchator.ru/api/contact/deleteNumbersToContact', {
            method: "DELETE",
            
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token'),
            },
            body : JSON.stringify({contactId : body['contactId']})
        })

        if (responseDelNums.status!=200) {
            console.log(`response status: ${responseContact.status}`)
        }
        
        for (let i = 0; i < countNumberCards; i++) {
            let number = {
                contactId: body['contactId'],
                number: document.getElementById(`num-number-${i}`).value,
                type: document.getElementById(`num-type-${i}`).value,
            }
            if(number.number.trim() != ""){
                const responseNumber = await fetch('http://merchator.ru/api/contact/createNumberToContact', {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization' :"Bearer " + localStorage.getItem('token')
                    },
                    body : JSON.stringify(number)
                })  
            }

           
        }
        resetForm()
        getContacts()
    }catch(e){
        console.log(e)
    }
}

const deleteContact = async(
    contactId
)=>{

    try{
        const response = await fetch('http://merchator.ru/api/contact/deleteContact', {
            method: "DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },
            body : JSON.stringify({id: contactId})
        })
        if (await response.status == 200){
            getContacts()
     
        } else{
        console.log(`response status: ${response.status}`)
        }
        resetForm()
    }catch(e){
        console.log(e)
    }

}

const resetForm =() =>{
    countNumberCards = 0
    document.getElementById('form-modal').reset()
    modal.style.display = "none";
    document.getElementById('numbers').innerHTML = `<p>Номер телефона</p>
    <div class="numbers-container" id="numbers-container">
    </div> <div class="add-number">
    <p  onclick="addNumberCard()" id="add-number">Добавить номер</p>
</div>`
    document.getElementById('form-btn-container').innerHTML = `<button type="button" class="action-button-form" onclick="createContact()">Создать</button>`
}
const onLoad= ()=>{
    getContacts()
    resetForm()
    document.getElementById('username').innerHTML = localStorage.getItem('username') 
}



window.onclick = function(event) {
  if (event.target == modal) {
   resetForm();
  }
} 


