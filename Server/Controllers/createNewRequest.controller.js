const  {pool,poolConnect,sql}=require("../Database/dbConfig.js");
//get createnewrequiest/upload your RO record
const getCreateNewRequiest=async(req,res)=>{
    try{
        await poolConnect;
        const result=await pool.request().query(`
            select case when (cat_id = '02') then (cat_text + N' - वर्गीकृत विज्ञापन / प्रदर्शन विज्ञापन (दैनिक समाचार पत्रों हेतु)') else case when (cat_id ='01') then
                                    (cat_text + N' - प्रदर्शन विज्ञापन हेतु (साप्ताहिक, मासिक, वेबसाइट एवं अन्य)' ) else case when (cat_id = '03')
                                    then (cat_text + N' - होर्डिंग्स लगवाने हेतु')  else case when (cat_id = '04')
                                    then (cat_text + N' - मुद्रण कार्य हेतु(प्रकाशन हेतु)') else case when (cat_id = '05')
                                    then (cat_text + N' - इलेक्ट्रॉनिक मीडिया कार्य हेतु (टीवी चैनल्स, ब्रॉड कास्ट, प्रोडक्शन हाउस, एयरपोर्ट, रेलवे स्टेशन, पीवीआर / आईनोक्स / यूएफओ)') end end end end end as cat_text,cat_id
from A_AvakCategory where Status='1' order by cat_text`);
res.json(result.recordset);
    }
    catch(err){
        res.status(500).send(err.message);

    }
};
module.exports={
    getCreateNewRequiest,
}
