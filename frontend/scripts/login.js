let button = document.getElementById('loginBtn');

button.addEventListener('click', async() => {
    let data ={
        password : document.getElementById('inputPassword').value,
        username : document.getElementById('inputEmail').value
    } 
    
    try{
        
        const response = await fetch('http://merchator.ru/api/user/login', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        })
        if (response.status == 200){
            const body =  await response.json() 
            console.log(body['token'])
            localStorage.setItem('token',body['token'])
            localStorage.setItem('username', data.username)
           
          
            document.location.href = './mainPage.html'        
        } else{
        document.getElementById('errorLabel').innerHTML = 'Неверные данные';
        }
    } catch(e){
        console.log(e)
        document.getElementById('errorLabel').innerHTML = 'Ошибка сервера';
    }
    
});
