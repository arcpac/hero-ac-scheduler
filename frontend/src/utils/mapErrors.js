function mapErrors(responseData) {
    return Array.isArray(responseData.errors) ? responseData.errors.map(error => error.msg).join(", ") : `${responseData.message}`
}


export default mapErrors