const { prisma } = require('../configs/database');

const findStrategy = async (id) => {
  const strategies = await prisma.strategy.findMany({
    where: {
      userId: id.toString(),
    },
    select: {
      id: true,
      percent: true,
      amount: true,
      
    },
  });
  return strategies;
};
const deleteStrategy = async (id, percent, amount) => {
  // Delete strategies matching the provided criteria
  const deletedStrategies = await prisma.strategy.deleteMany({
    where: {
      userId: id.toString(),
      percent: percent,
      amount: amount
    }
  });

  // Log the number of strategies deleted
  console.log(`Deleted ${deletedStrategies.count} strategies`);
};



const createStrategy = async (params) => {
  try {
    
    await prisma.strategy.create({
      data: params,
    });
  } catch(e) {
    console.error(e)
    return null;
  }
};


const updateStrategy = async (id, params) => {
 
  
    // Delete dependent records first
    
  if (params=="del" ){
    await prisma.StrategyTrade.deleteMany({
      where: {
        strategyId: id,
      },
    });
    await prisma.strategy.deleteMany({
      where: {
        id: id,
      },
      
    });
    const strategies = await findStrategy(id);
    return strategies;

  }

  await prisma.strategy.updateMany({
    where: {
      id: id,
    },
    data: params,
  });
  const strategies = await findStrategy(id);
  return strategies;
};

module.exports = {
  findStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy,
};
