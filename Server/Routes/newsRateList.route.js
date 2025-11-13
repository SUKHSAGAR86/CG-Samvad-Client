const express = require('express')
const { getNewsPaperWithRates } = require('../Controllers/newsRateList.controller')

const router=express.Router()

router.get("/get-news-rate",getNewsPaperWithRates);


module.exports=router;
