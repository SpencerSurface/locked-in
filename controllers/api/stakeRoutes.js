const router = require('sequelize').Router();
const Stake = require('../../models/Stake');
const { User, Bet } = require("../../models");


//get stake
router.get('/:id', async (req, res) => {
    try{
        const stakeData = await Stake.findByPk(req.params.id, {
            include: [
                {model: User},
                {model: Bet}
            ]
        })

        if(!stakeData){
            res.json({message: "No stake with this id!"});
            return;
        }

        // const stake = stakeData.get({ plain: true });

    // res.render('', {
    //     ...stake,
    //     logged_in: req.session.logged_in
    // });
    }catch(err){
        res.json({message: "Error with getting stake", err});
    }
});

// Create Stake
router.post('/:bet_id', async (req, res) => {
    try {
        const newStake = await Stake.create({
            ...req.body,
            bet_id: req.params.bet_id,
            user_id: req.session.user_id,
        });

        res.json(newStake);

    }catch(err){
        res.json({message: "Error with creating stake"})
    }
});