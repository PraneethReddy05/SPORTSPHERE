module.exports.isUserLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to proceed!");
        res.redirect("/user/login");
        return;
    }
    next();
}

module.exports.isSellerLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to proceed!");
        res.redirect("/seller/login");
        return;
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.updateOrderStatusIfUniform = async (order) => {
    if (!order || !order.items || order.items.length === 0) return;
    // Extract all item statuses
    const statuses = order.items.map(item => item.status);
    // Check if all statuses are the same
    const allSame = statuses.every(status => status === statuses[0]);
    if (allSame) {
        order.status = statuses[0]; // Set the overall order status
    }
    return order;
};