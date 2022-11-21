const URL = "http://localhost:3001"

// API for products

export async function getAllProducts() {
    const response = await fetch(`${URL}/product`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllProductsInclusiveConnectVariety() {
    const response = await fetch(`${URL}/product?_embed=productHasVarieties`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getProductById(id) {
    const response = await fetch(URL + `/product/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createProduct(product, token) {
    const response = await fetch(URL + "/product", {
        method: "POST",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(product)
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function updateProduct(product, token) {
    const response = await fetch(`${URL}/product/${product.id}`, {
        method: "PUT",
        headers: {
            "authorization": `Bearer${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(product)
    })

    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function deleteProduct(id, token) {
    const response = await fetch(URL + `/product/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
}

// API for baseDataVariety

export async function getAllBaseDataVariety() {
    const response = await fetch(URL + "/baseDataVariety")
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getBaseDataVariertyById(id) {
    const response = await fetch(URL + `/baseDataVariety/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createBaseDataVariety(variety, token) {
    const response = await fetch(URL + "/baseDataVariety", {
        method: "POST",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(variety)
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function updateBaseDataVariety(variety, token) {
    const response = await fetch(`${URL}/baseDataVariety/${variety.id}`, {
        method: "PUT",
        headers: {
            "authorization": `Bearer${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(variety)
    })

    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function deleteBaseDataVariety(id, token) {
    const response = await fetch(URL + `/baseDataVariety/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
}

// API users & login/register

export async function login(email, password) {
    const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function register(title, firstName, lastName, email, username, since, roleId, password) {
    const response = await fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ title, firstName, lastName, email, username, since, roleId, password })
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}