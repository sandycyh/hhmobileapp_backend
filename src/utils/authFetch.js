import { deleteToken, getToken } from "./tokenStorage";

export async function authFetch(url, options = {}){
    const token = await getToken(); 

    const response = await fetch(url, {
        ...options, 
        headers: {
            ...options.headers, 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}`, 
        },
    });

    if ( response.status === 401 ) {
        await deleteToken(); 
        router.replace('/login');
    }

    return response; 
}