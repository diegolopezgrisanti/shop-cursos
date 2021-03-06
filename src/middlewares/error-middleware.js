module.exports = (err, req, res, next) => {
    const httpStatus = err.status || 500;
    console.debug(err, err.stack)

    /**
     * This is only in the case you want to return a view instead of a JSON
     */
    const view = err.view || null;

    if(view){
        return res.render(view, {error: err});
    } 

    return res.status(httpStatus).send({
        status: httpStatus,
        message: err.message || "Internal server error",
        developer_message: err.developer_message || "No error detail. Check Logs"
    });


    
}