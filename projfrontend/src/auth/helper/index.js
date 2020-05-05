import { API } from "../../backend";//API=localhost8000...

export const signup=user=>{
    return fetch(`${API}/signup`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=> console.log(err));//no error being passed so it'll take show console log in every case
}


export const signin=user=>{
    return fetch(`${API}/signin`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=> console.log(err));
}

export const authenticate =(data,next)=>{
    if (typeof window !=="undefined") {
        localStorage.setItem("jwt",JSON.stringify(data))
        next();
    }
}



export const signout=next=>{//next allows us to have a callback which we use to redirect to other pages
    if (typeof window !=="undefined") {
        localStorage.removeItem("jwt")
        next();

        return fetch(`${API}/signout`,{
            method:"GET"
        }).then(response=>console.log("Signout Success")
        )
        .catch(err=> console.log(err)
        )
    }
}


export const isAuthenticated=()=>{
    if (typeof window =="undefined") {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    }
    else{
        return false;
    }
}