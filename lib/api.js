// API for products

export async function getAllProducts(host) {
    const response = await fetch(`${host}/products`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllProductByFilterParameter(host, param) {
    const response = await fetch(`${host}/products?${param}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getProductById(host ,id) {
    const response = await fetch(host + `/products/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createProduct(host, product, token) {
    const response = await fetch(host + "/products", {
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

export async function updateProduct(host, product, token) {
    const response = await fetch(`${host}/products/${product.id}`, {
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

export async function deleteProduct(host, id, token) {
    const response = await fetch(host + `/products/${id}`, {
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

export async function getAllHighlights(host) {
    const response = await fetch(`${host}/highlight`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllHighlightDrafts(host) {
    const response = await fetch(`${host}/highlight?isDraft=true`)
}

export async function getAllHighligtsInclusiveProduct(host) {
    const response = await fetch(`${host}/highlight?_expand=product`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getHighlightById(host, id) {
    const response = await fetch(`${host}/highlight/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createHighlight(host, highlight, token) {
    const response = await fetch(host + "/highlight", {
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

export async function updateHighlight(host, highlight, token) {
    const response = await fetch(`${host}/highlight/${highlight.id}`, {
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

export async function deleteHighlight(host, id, token) {
    const response = await fetch(host + `/highlight/${id}`, {
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

export async function getAllBaseDataVariety(host) {
    const response = await fetch(host + "/baseDataVariety")
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getBaseDataVariertyById(host, id) {
    const response = await fetch(host + `/baseDataVariety/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function createBaseDataVariety(host, variety, token) {
    const response = await fetch(host + "/baseDataVariety", {
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

export async function updateBaseDataVariety(host, variety, token) {
    const response = await fetch(`${host}/baseDataVariety/${variety.id}`, {
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

export async function deleteBaseDataVariety(host, id, token) {
    const response = await fetch(host + `/baseDataVariety/${id}`, {
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

export async function getAllImages(host) {
    const response = await fetch(host + "/image")
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getAllImagesByUsage(host, usage) {
    const response = await fetch(host + "/image?usage=" + usage)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getImageById(host, id) {
    const response = await fetch(host + `/image/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function uploadImageData(host, imageData, token) {
    const response = await fetch(host + "/image", {
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

export async function editImage(host, imageData, token) {
    const response = await fetch(`${host}/image/${imageData.id}`, {
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

// API for clientQuestion

export async function getAllCustumerQuestion(host) {
    const response = await fetch(host + "/customerQuestion")
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function getCustomerQuestionById(host, id) {
    const response = await fetch(host + `/customerQuestion/${id}`)
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function postCustomerQuestion(host, question) {
    const response = await fetch(host + "/customerQuestion", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(question)
    })
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function editCustomerQuestion(host, question, token) {
    const response = await fetch(`${host}/customerQuestion/${question.id}`, {
        method: "PUT",
        headers: {
            "authorization": `Bearer${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(question)
    })

    if (!response.ok) {
        throw Error(response.statusText)
    }
    return await response.json()
}

export async function deleteCustomerQuestion(host, id, token) {
    const response = await fetch(host + `/customerQuestion/${id}`, {
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

export async function login(host, email, password) {
    const response = await fetch(`${host}/login`, {
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

export async function register(host, title, firstName, lastName, email, username, since, roleId, password) {
    const response = await fetch(`${host}/register`, {
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

export async function getAllUsers(host) {
    const response = await fetch(`${host}/users`)
    if (!response.ok) {
        throw Error()
    }
    return await response.json()
}