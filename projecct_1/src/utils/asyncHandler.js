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

// const asyncHandler = ()=>{}
// const asyncHandler = (func)=>{ ()=>{} }
// const asyncHandler = (func)=>{ async()=>{} }
// const asyncHandler = (func)=> async()=>{} // just removed the braces
