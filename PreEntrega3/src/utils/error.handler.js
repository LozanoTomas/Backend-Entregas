export default class ErrorHandler extends Error{
    constructor(message, code){
        super(message);
        this.code = code || 500;
    }

    static handleError(error) {

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((item) => item.message);
            return new ErrorHandler(messages.join(",").trim(), 400);
        }

        if (error.code === 11000) {
            return new ErrorHandler(error.message, 409);
        }

        return new ErrorHandler(error.message, error?.code || 500);
    }
}