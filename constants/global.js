const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
]

const fileExtensionsAllowed = ["png", "jpg", "jpeg", "gif"];

const defaultEmailSender = { name: "Diego Cardenas", email: "diego.colombia.devs@gmail.com" }

module.exports = {
    allowedCollections,
    defaultEmailSender,
    fileExtensionsAllowed
}