const loadPage = async()=> {
    try{
        const response = await fetch('http://merchator.ru/api/user/refreshToken', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
            },

        })
        if (response.status == 200){
            const body =  await response.json() 
            localStorage.setItem('token',body['token'])
            
            const responseAdm = await fetch('http://merchator.ru/api/user/checkAdm', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization' :"Bearer " + localStorage.getItem('token')
                    },
            })
            if (responseAdm.status == 200) {
                document.location.href = './adminPanel.html' 
            }    
        } else{
            document.location.href = './login.html'         
        }
    } catch(e){
        console.log(e)
    }
}

loadPage();