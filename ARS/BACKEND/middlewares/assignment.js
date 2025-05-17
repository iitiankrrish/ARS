function roleVerifierForAdminAndForReviewer(req, res, next) {
    console.log(req.user);
    const role = req.user.role;
    if (role === "admin" || role === "reviewer") {
        console.log(`You can go ahead as you are ${role}`);
        next(); // Move to the next middleware/route handler
    } else {
        return res.json({"Error": "You are not admin or reviewer"});
    }
}
module.exports = {roleVerifierForAdminAndForReviewer}