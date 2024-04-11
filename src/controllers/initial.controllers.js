const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateBuy(userId, tokenAddress, initial) {
    try {
        // Check if a record exists with the given userId and tokenAddress
        const existingRecord = await prisma.position.findMany({
            where: {
                
                    userId: userId,
                    tokenAddress: tokenAddress
                
            }
        });
        
        if (existingRecord.length!=0 ) {
            // If the record exists, update the initial value
            const updatedRecord = await prisma.position.update({
                where: {
                    id: existingRecord[0].id
                },
                data: {
                    initial: existingRecord[0].initial + initial
                }
            });
            console.log('Record updated:', updatedRecord);
        } else {
            // If the record doesn't exist, create a new one
            const newRecord = await prisma.position.create({
                data: {
                    userId: userId,
                    tokenAddress: tokenAddress,
                    initial: initial
                }
            });
            console.log('New record created:', newRecord);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Example usage
async function updatesell(userId, tokenAddress,percentage) {
    try {
        // Check if a record exists with the given userId and tokenAddress
        const existingRecord = await prisma.position.findMany({
            where: {
               
                    userId: userId,
                    tokenAddress: tokenAddress
                
            }
        });

        if (existingRecord.length!=0) {
            // If the record exists, update the initial value
            const updatedRecord = await prisma.position.update({
                where: {
                    id: existingRecord[0].id
                },
                data: {
                    initial: (1-percentage)*existingRecord[0].initial 
                }
            });
            console.log('Record updated:', updatedRecord);
        } else {
            // If the record doesn't exist, create a new one
            const newRecord = await prisma.position.create({
                data: {
                    userId: userId,
                    tokenAddress: tokenAddress,
                    initial: 0
                }
            });
            console.log('New record created:', newRecord);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}
const findInit=async(userId, tokenAddress)=>{
    console.log("yay")
    try {
        console.log(userId)
        console.log(tokenAddress)
        // Check if a record exists with the given userId and tokenAddress
        const existingRecord = await prisma.position.findMany({
            where: {
                    userId: userId,
                    tokenAddress: tokenAddress
                }
            }
        );
        console.log(existingRecord)
        if (existingRecord.length!=0) {
            console.log(existingRecord)
        
        return existingRecord[0].initial}
        else{
            console.log(existingRecord)
            return 0
        }
}catch(e){
    console.log(e)
    return 0
}}

module.exports={updateBuy,updatesell,findInit}