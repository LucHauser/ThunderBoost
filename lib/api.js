const URL = "http://localhost:3001"

// API for products

export async function getAllProducts() {
    const response = await fetch(`${URL}/products`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getProductById(id) {
    const response = await fetch(URL + `/products/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createProduct(product, token) {
    const response = await fetch(URL + "/products", {
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
    const response = await fetch(`${URL}/products/${product.id}`, {
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
    const response = await fetch(URL + `/products/${id}`, {
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

// API for Highlights

export async function getAllHighlights() {
    const response = await fetch(`${URL}/highlights`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllHighligtsInclusiveProduct() {
    const response = await fetch(`${URL}/highlight?_expand=product`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getHighlightById(id) {
    const response = await fetch(URL + `/highlights/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createHighlight(highlight, token) {
    const response = await fetch(URL + "/highlights", {
        method: "POST",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(highlight)
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function updateHighlight(highlight, token) {
    const response = await fetch(`${URL}/highlights/${highlight.id}`, {
        method: "PUT",
        headers: {
            "authorization": `Bearer${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(highlight)
    })

    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function deleteHighlight(id, token) {
    const response = await fetch(URL + `/highlights/${id}`, {
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

// Api for imagesFile

export async function getAllImages() {
    const response = await fetch(URL + "/image")
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllImagesByUsage(usage) {
    const response = await fetch(URL + "/image?usage=" + usage)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getImageById(id) {
    const response = await fetch(URL + `/image/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function uploadImageData(imageData, token) {
    const response = await fetch(URL + "/image", {
        method: "POST",
        headers: {
            "authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(imageData)
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function editImage(imageData, token) {
    const response = await fetch(`${URL}/image/${imageData.id}`, {
        method: "PUT",
        headers: {
            "authorization": `Bearer${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(imageData)
    })

    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
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
    return await response.json()
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
    return  await response.json()
}