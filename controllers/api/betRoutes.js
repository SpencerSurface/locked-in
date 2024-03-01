const router = require('express').Router();
const { Bet, Stake } = require('../../models');

// Create a new bet
router.post('/', async (req, res) => {
    try {
        // Create the bet
        const newBet = await Bet.create({
            ...req.body
        });

        // Respond with the new bet
        res.status(200).json(newBet);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

// Update a bet
router.put('/:id', async (req, res) => {
    try {
        // Update the bet
        const updatedBet = await Bet.update(
            {
                ...req.body
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        
        // Respond with the updated bet data
        res.status(200).json(updatedBet);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Delete a bet
router.delete('/:id', async (req, res) => {
    try {
        // Delete the bet
        const deletedBet = await Bet.destroy({
            where: {
                id: req.params.id
            },
        });

        // Catch a not-found error
        if (!deletedBet) {
            res.status(404).json({ message: 'No bet found with this id!' });
            return;
        }

        // Respond with the deleted bet data
        res.status(200).json(deletedBet);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;