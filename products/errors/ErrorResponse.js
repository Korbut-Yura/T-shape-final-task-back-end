class ErrorResponse {
    constructor(message= 'An error occured', statusCode = 500){
       const body = JSON.stringify({message})
       this.statusCode= statusCode
       this.body= body
       this.headers= {
           'Content-Type': 'application/json'
       }
    }
}

module.exports = { ErrorResponse }