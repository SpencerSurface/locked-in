const router = require("express").Router(); 
const User = require("../../models/User");

// Creating a new user
router.post("/", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        req.session.save(()=>{
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            res.status(200).json(newUser);
        });
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

// Updating a user
router.put('/', async (req, res) => {
    try {
        const updatedUser = await User.update(req.body, {
            where: {
                id: req.session.user_id
            },
            individualHooks: true
        });
        res.status(200).json({message: updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to update account'});
    }
});

//Logging in
router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { email: req.body.email },
        });
    
        if (!userData) {
            res
            .status(400)
            .json({ message: "Incorrect username or password, please try again" });
            return;
        }
    
        const validPassword = userData.checkPassword(req.body.password);
    
        if (!validPassword) {
            res
            .status(400)
            .json({ message: "Incorrect username or password, please try again" });
            return;
        }
    
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
    
            res.json({ user: userData, message: "You are now logged in!" });
        });
    } catch (err) {
        res.json({ message: "Error with loggin in", err });
    }
});

// Get a users data
router.get("/:id", async (req, res) => {
    try{
        const userData = await User.findByPk(req.params.id);

        if(!userData){
            res.json({ message: "No user found with this id"});
        }

        const user = userData.get({ plain: true });

        res.json({ userInfo: user });

    }catch(err){
        res.json(err);
    }
})

// Logging out
router.post("/logout", async (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
  
module.exports = router;