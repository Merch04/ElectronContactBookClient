
let button = document.getElementById('registrationBtn');
button.addEventListener('click', async() => {
    
    let data ={
        password : document.getElementById('inputPassword').value,
        username : document.getElementById('inputEmail').value
    } 
    try{
        const response = await fetch('http://merchator.ru/api/user/registration', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        })
        if (response.status == 200){
            const body =  await response.json() 
            localStorage.setItem('token',body['token'])
            localStorage.setItem('username', data.username)
          
            document.location.href = './mainPage.html'        
        } else{
        document.getElementById('errorLabel').innerHTML = 'Неверные данные';
        }
    } catch(e){
        document.getElementById('errorLabel').innerHTML = 'Ошибка сервера';
    }
    

    
});