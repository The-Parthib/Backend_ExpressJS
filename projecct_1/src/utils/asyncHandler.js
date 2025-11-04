const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

/*
// using try
const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Internal Server Error from asyncHandler.js",
        })
    }
}
*/
export { asyncHandler };


/**
 * link : https://chatgpt.com/share/690a4379-133c-800c-bbcb-f57a6b2b6c38
 */


// const asyncHandler = ()=>{}
// const asyncHandler = (func)=>{ ()=>{} }
// const asyncHandler = (func)=>{ async()=>{} }
// const asyncHandler = (func)=> async()=>{} // just removed the braces
