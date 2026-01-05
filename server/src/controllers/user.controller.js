export const getUser = (req,res)=>{
    
    res.status(200).json({
        status:"success",
        message:"user get"
    })
}